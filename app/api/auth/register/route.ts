// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

const COLLEGE_DOMAIN = "@acem.edu.in";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z
    .string()
    .email()
    .refine((v) => v.endsWith(COLLEGE_DOMAIN), {
      message: `Only ${COLLEGE_DOMAIN} emails allowed`,
    }),
  enrollmentNumber: z.string().min(8),
  rollNumber: z.string().min(3),
  department: z.string().min(1),
  semester: z.coerce.number().min(1).max(8),
  batch: z.string().min(4),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Check email uniqueness
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 }
      );
    }

    // Check enrollment number uniqueness
    const existingEnrollment = await prisma.student.findUnique({
      where: { enrollmentNumber: data.enrollmentNumber },
    });
    if (existingEnrollment) {
      return NextResponse.json(
        { error: "This enrollment number is already registered." },
        { status: 400 }
      );
    }

    // Check roll number uniqueness
    const existingRoll = await prisma.student.findUnique({
      where: { rollNumber: data.rollNumber },
    });
    if (existingRoll) {
      return NextResponse.json(
        { error: "This roll number is already registered." },
        { status: 400 }
      );
    }

    // Find or create department
    let department = await prisma.department.findFirst({
      where: { name: { contains: data.department } },
    });
    if (!department) {
      // Create a basic department entry if not found
      department = await prisma.department.create({
        data: {
          name: data.department,
          code: data.department.split(" ").map((w) => w[0]).join("").toUpperCase(),
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Create user + student profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: "STUDENT",
          verifyToken,
          emailVerified: false,
        },
      });

      await tx.student.create({
        data: {
          userId: newUser.id,
          enrollmentNumber: data.enrollmentNumber,
          rollNumber: data.rollNumber,
          departmentId: department!.id,
          semester: data.semester,
          currentSemester: data.semester,
          approvalStatus: "PENDING",
        },
      });

      // Create approval request
      const hod = await tx.hOD.findFirst({
        where: { departmentId: department!.id, isActive: true },
      });

      await tx.approvalRequest.create({
        data: {
          studentId: (await tx.student.findUnique({ where: { userId: newUser.id } }))!.id,
          hodId: hod?.id ?? null,
          status: "PENDING",
        },
      });

      // Log registration
      await tx.activityLog.create({
        data: {
          userId: newUser.id,
          action: "REGISTER",
          details: {
            email: data.email,
            department: data.department,
            semester: data.semester,
          },
        },
      });

      return newUser;
    });

    // Send verification email
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verifyToken}`;
    await sendVerificationEmail({
      to: data.email,
      name: data.name,
      verifyUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful! Please check your email to verify.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
