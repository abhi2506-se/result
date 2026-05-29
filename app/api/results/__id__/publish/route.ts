// app/api/results/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendResultPublishedEmail } from "@/lib/email";

function calculateGrade(percentage: number): { grade: string; gradePoints: number } {
  if (percentage >= 90) return { grade: "O", gradePoints: 10 };
  if (percentage >= 80) return { grade: "A+", gradePoints: 9 };
  if (percentage >= 70) return { grade: "A", gradePoints: 8 };
  if (percentage >= 60) return { grade: "B+", gradePoints: 7 };
  if (percentage >= 50) return { grade: "B", gradePoints: 6 };
  if (percentage >= 40) return { grade: "C", gradePoints: 5 };
  return { grade: "F", gradePoints: 0 };
}

function calculateSGPA(marks: Array<{ gradePoints: number; subject: { credits: number } }>): number {
  if (marks.length === 0) return 0;
  const totalCredits = marks.reduce((a, m) => a + m.subject.credits, 0);
  const weightedSum = marks.reduce((a, m) => a + m.gradePoints * m.subject.credits, 0);
  return totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !["HOD", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hod = await prisma.hOD.findUnique({ where: { userId: session.user.id } });

    const result = await prisma.result.findUnique({
      where: { id: params.id },
      include: {
        marks: { include: { subject: true } },
        student: {
          include: {
            user: { select: { name: true, email: true } },
            department: { select: { name: true } },
          },
        },
        session: true,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    if (result.isPublished) {
      return NextResponse.json({ error: "Result already published" }, { status: 400 });
    }

    // Calculate totals and grades for each mark
    let totalMarks = 0;
    let maxMarks = 0;
    const updatedMarks = [];

    for (const mark of result.marks) {
      const total =
        (mark.theoryMarks ?? 0) +
        (mark.practicalMarks ?? 0) +
        (mark.internalMarks ?? 0) +
        (mark.attendanceMarks ?? 0);
      const max =
        mark.subject.maxTheory +
        mark.subject.maxPractical +
        mark.subject.maxInternal +
        mark.subject.maxAttendance;
      const pct = max > 0 ? (total / max) * 100 : 0;
      const { grade, gradePoints } = calculateGrade(pct);
      const isPassed = pct >= 40;

      updatedMarks.push({
        id: mark.id,
        totalMarks: total,
        grade,
        gradePoints,
        isPassed,
        isBacklog: !isPassed,
      });

      totalMarks += total;
      maxMarks += max;
    }

    const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
    const sgpa = calculateSGPA(
      updatedMarks.map((m, i) => ({
        gradePoints: m.gradePoints,
        subject: result.marks[i].subject,
      }))
    );
    const hasFail = updatedMarks.some((m) => !m.isPassed);
    const resultStatus = hasFail ? "FAIL" : "PASS";

    // Publish in transaction
    await prisma.$transaction(async (tx) => {
      // Update each mark's calculated values
      for (const mark of updatedMarks) {
        await tx.marks.update({
          where: { id: mark.id },
          data: {
            totalMarks: mark.totalMarks,
            grade: mark.grade,
            gradePoints: mark.gradePoints,
            isPassed: mark.isPassed,
            isBacklog: mark.isBacklog,
            isDraft: false,
          },
        });
      }

      // Update result
      await tx.result.update({
        where: { id: params.id },
        data: {
          isPublished: true,
          publishedAt: new Date(),
          status: resultStatus,
          totalMarks,
          maxMarks,
          percentage,
          sgpa,
        },
      });

      // Create publish log
      if (hod) {
        await tx.resultPublish.create({
          data: {
            resultId: params.id,
            hodId: hod.id,
            note: `Published by ${session.user.name}`,
          },
        });
      }

      // Notify student
      await tx.notification.create({
        data: {
          userId: result.student.userId,
          type: "RESULT_PUBLISHED",
          title: `Semester ${result.semester} ${result.examType} Result Published!`,
          message: `Your result is now available. SGPA: ${sgpa.toFixed(2)}, Status: ${resultStatus}`,
          link: `/student/results/${params.id}`,
        },
      });

      // Activity log
      await tx.activityLog.create({
        data: {
          userId: session.user.id,
          action: "PUBLISH_RESULT",
          target: params.id,
          details: { semester: result.semester, examType: result.examType, sgpa, percentage, status: resultStatus },
        },
      });
    });

    // Send email
    try {
      await sendResultPublishedEmail({
        to: result.student.user.email,
        name: result.student.user.name,
        semester: result.semester,
        examType: result.examType,
        sgpa,
        percentage,
        status: resultStatus,
        resultUrl: `${process.env.NEXTAUTH_URL}/student/results/${params.id}`,
      });
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Result published successfully!",
      data: { sgpa, percentage, status: resultStatus },
    });
  } catch (error) {
    console.error("Publish result error:", error);
    return NextResponse.json({ error: "Failed to publish result" }, { status: 500 });
  }
}
