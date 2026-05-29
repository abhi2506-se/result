// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { verifyToken: token } });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification link" }, { status: 400 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "Email already verified" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
    });

    // Notify HOD about new pending approval
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      include: { department: true },
    });

    if (student) {
      const hod = await prisma.hOD.findFirst({
        where: { departmentId: student.departmentId, isActive: true },
      });
      if (hod) {
        await prisma.notification.create({
          data: {
            userId: hod.userId,
            type: "SYSTEM",
            title: "New Student Registration",
            message: `${user.name} (${student.enrollmentNumber}) has registered and needs approval.`,
            link: "/hod/approvals",
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
