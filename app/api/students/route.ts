// app/api/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["HOD", "SUPER_ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const search = searchParams.get("search") ?? "";
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const semester = searchParams.get("semester");
    const batch = searchParams.get("batch");

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { enrollmentNumber: { contains: search, mode: "insensitive" as const } },
          { rollNumber: { contains: search, mode: "insensitive" as const } },
          { user: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }),
      ...(department && { departmentId: department }),
      ...(status && { approvalStatus: status as "PENDING" | "APPROVED" | "SENT_BACK" | "REJECTED" }),
      ...(semester && { semester: parseInt(semester) }),
      ...(batch && { batch: { name: batch } }),
      // HOD: only their department
      ...(session.user.role === "HOD" && {
        department: {
          hods: { some: { userId: session.user.id } },
        },
      }),
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true, phone: true, avatar: true, createdAt: true },
          },
          department: { select: { name: true, code: true } },
          batch: { select: { name: true } },
        },
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET students error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
