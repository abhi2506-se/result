// app/api/results/route.ts - Results API
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ================================
// GET - Fetch results
// ================================
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const sessionId = searchParams.get("sessionId");
    const examType = searchParams.get("examType");
    const studentId = searchParams.get("studentId");

    // Students can only see their own published results
    if (session.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
      });
      if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

      const results = await prisma.result.findMany({
        where: {
          studentId: student.id,
          isPublished: true,
          ...(semester && { semester: parseInt(semester) }),
          ...(examType && { examType: examType as "SESSIONAL" | "PUT" | "INTERNAL" }),
        },
        include: {
          marks: {
            include: { subject: true },
          },
          session: { include: { batch: true } },
        },
        orderBy: [{ semester: "desc" }, { createdAt: "desc" }],
      });

      return NextResponse.json({ success: true, data: results });
    }

    // HOD / Admin / Teacher — broader access
    const results = await prisma.result.findMany({
      where: {
        ...(studentId && { studentId }),
        ...(semester && { semester: parseInt(semester) }),
        ...(sessionId && { sessionId }),
        ...(examType && { examType: examType as "SESSIONAL" | "PUT" | "INTERNAL" }),
        // HOD: only their department
        ...(session.user.role === "HOD" && {
          student: {
            department: {
              hods: { some: { userId: session.user.id } },
            },
          },
        }),
      },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            department: { select: { name: true, code: true } },
          },
        },
        marks: { include: { subject: true } },
        session: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("GET results error:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

// ================================
// POST - Create/Initialize result
// ================================
const createResultSchema = z.object({
  studentId: z.string(),
  sessionId: z.string(),
  semester: z.number().min(1).max(8),
  examType: z.enum(["SESSIONAL", "PUT", "INTERNAL"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["HOD", "SUPER_ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createResultSchema.parse(body);

    // Check for existing result
    const existing = await prisma.result.findUnique({
      where: {
        studentId_sessionId_semester_examType: {
          studentId: data.studentId,
          sessionId: data.sessionId,
          semester: data.semester,
          examType: data.examType,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, data: existing, message: "Result already exists" });
    }

    const result = await prisma.result.create({
      data: {
        studentId: data.studentId,
        sessionId: data.sessionId,
        semester: data.semester,
        examType: data.examType,
        status: "NOT_PUBLISHED",
        isPublished: false,
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 });
  }
}
