// app/api/marks/route.ts - Marks Entry API
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const marksSchema = z.object({
  resultId: z.string(),
  subjectId: z.string(),
  theoryMarks: z.number().min(0).optional(),
  practicalMarks: z.number().min(0).optional(),
  internalMarks: z.number().min(0).optional(),
  attendanceMarks: z.number().min(0).optional(),
  isDraft: z.boolean().default(true),
});

const bulkMarksSchema = z.object({
  resultId: z.string(),
  marks: z.array(marksSchema),
});

// POST - Enter/Update marks
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["TEACHER", "HOD", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Handle bulk or single
    if (body.marks) {
      // Bulk
      const data = bulkMarksSchema.parse(body);
      const results = [];

      for (const mark of data.marks) {
        // Validate against subject max marks
        const subject = await prisma.subject.findUnique({ where: { id: mark.subjectId } });
        if (!subject) continue;

        if (mark.theoryMarks !== undefined && mark.theoryMarks > subject.maxTheory) {
          return NextResponse.json(
            { error: `Theory marks exceed maximum (${subject.maxTheory}) for ${subject.code}` },
            { status: 400 }
          );
        }

        const upserted = await prisma.marks.upsert({
          where: {
            resultId_subjectId: { resultId: data.resultId, subjectId: mark.subjectId },
          },
          create: {
            resultId: data.resultId,
            subjectId: mark.subjectId,
            theoryMarks: mark.theoryMarks,
            practicalMarks: mark.practicalMarks,
            internalMarks: mark.internalMarks,
            attendanceMarks: mark.attendanceMarks,
            isDraft: mark.isDraft,
            enteredById: session.user.id,
          },
          update: {
            theoryMarks: mark.theoryMarks,
            practicalMarks: mark.practicalMarks,
            internalMarks: mark.internalMarks,
            attendanceMarks: mark.attendanceMarks,
            isDraft: mark.isDraft,
          },
        });

        // Log the entry
        if (session.user.role === "TEACHER") {
          const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
          if (teacher) {
            await prisma.marksEntry.create({
              data: {
                marksId: upserted.id,
                teacherId: teacher.id,
                action: "UPDATE",
                newValue: {
                  theoryMarks: mark.theoryMarks,
                  practicalMarks: mark.practicalMarks,
                  internalMarks: mark.internalMarks,
                  attendanceMarks: mark.attendanceMarks,
                },
              },
            });
          }
        }

        results.push(upserted);
      }

      // Activity log
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "UPDATE_MARKS",
          target: data.resultId,
          details: { count: results.length, isDraft: body.marks[0]?.isDraft },
        },
      });

      return NextResponse.json({ success: true, data: results, message: "Marks saved successfully" });
    } else {
      // Single
      const data = marksSchema.parse(body);
      const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
      if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

      if (data.theoryMarks !== undefined && data.theoryMarks > subject.maxTheory) {
        return NextResponse.json({ error: `Theory marks exceed max (${subject.maxTheory})` }, { status: 400 });
      }

      const marks = await prisma.marks.upsert({
        where: {
          resultId_subjectId: { resultId: data.resultId, subjectId: data.subjectId },
        },
        create: {
          resultId: data.resultId,
          subjectId: data.subjectId,
          theoryMarks: data.theoryMarks,
          practicalMarks: data.practicalMarks,
          internalMarks: data.internalMarks,
          attendanceMarks: data.attendanceMarks,
          isDraft: data.isDraft,
          enteredById: session.user.id,
        },
        update: {
          theoryMarks: data.theoryMarks,
          practicalMarks: data.practicalMarks,
          internalMarks: data.internalMarks,
          attendanceMarks: data.attendanceMarks,
          isDraft: data.isDraft,
        },
      });

      return NextResponse.json({ success: true, data: marks });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Marks entry error:", error);
    return NextResponse.json({ error: "Failed to save marks" }, { status: 500 });
  }
}

// GET - Fetch marks for a result
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const resultId = searchParams.get("resultId");

    if (!resultId) {
      return NextResponse.json({ error: "resultId required" }, { status: 400 });
    }

    const marks = await prisma.marks.findMany({
      where: { resultId },
      include: {
        subject: true,
        enteredBy: {
          include: {
            teacher: {
              include: { user: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ success: true, data: marks });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch marks" }, { status: 500 });
  }
}
