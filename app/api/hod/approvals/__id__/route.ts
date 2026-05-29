// app/api/hod/approvals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail, sendSentBackEmail, sendRejectionEmail } from "@/lib/email";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["approve", "send_back", "reject"]),
  comment: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "HOD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, comment } = actionSchema.parse(body);

    // Validate comment for send_back and reject
    if ((action === "send_back" || action === "reject") && !comment?.trim()) {
      return NextResponse.json(
        { error: "Comment is required for this action." },
        { status: 400 }
      );
    }

    // Get HOD profile
    const hod = await prisma.hOD.findUnique({
      where: { userId: session.user.id },
    });
    if (!hod) {
      return NextResponse.json({ error: "HOD profile not found" }, { status: 404 });
    }

    // Get approval request with student info
    const approvalRequest = await prisma.approvalRequest.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: {
            user: true,
            department: true,
          },
        },
      },
    });

    if (!approvalRequest) {
      return NextResponse.json({ error: "Approval request not found" }, { status: 404 });
    }

    // Map action to status
    const statusMap = {
      approve: "APPROVED",
      send_back: "SENT_BACK",
      reject: "REJECTED",
    } as const;

    const newStatus = statusMap[action];

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update approval request
      await tx.approvalRequest.update({
        where: { id: params.id },
        data: {
          status: newStatus,
          comment: comment ?? null,
          hodId: hod.id,
          reviewedAt: new Date(),
        },
      });

      // Update student approval status
      await tx.student.update({
        where: { id: approvalRequest.studentId },
        data: {
          approvalStatus: newStatus,
          approvalComment: comment ?? null,
          approvedAt: action === "approve" ? new Date() : null,
        },
      });

      // Create notification for student
      const notifConfig = {
        approve: {
          type: "APPROVAL" as const,
          title: "Account Approved! 🎉",
          message: "Your registration has been approved by the HOD. You can now access the result portal.",
        },
        send_back: {
          type: "SENT_BACK" as const,
          title: "Registration Sent Back",
          message: `HOD sent back your registration. Reason: ${comment}`,
        },
        reject: {
          type: "REJECTION" as const,
          title: "Registration Rejected",
          message: `Your registration has been rejected. Reason: ${comment}. Please contact HOD for assistance.`,
        },
      };

      await tx.notification.create({
        data: {
          userId: approvalRequest.student.userId,
          type: notifConfig[action].type,
          title: notifConfig[action].title,
          message: notifConfig[action].message,
        },
      });

      // Activity log
      const actionMap = {
        approve: "APPROVE_STUDENT",
        send_back: "APPROVE_STUDENT",
        reject: "REJECT_STUDENT",
      } as const;

      await tx.activityLog.create({
        data: {
          userId: session.user.id,
          action: actionMap[action],
          target: approvalRequest.student.enrollmentNumber,
          details: { action, comment, studentId: approvalRequest.studentId },
        },
      });
    });

    // Send email notifications
    const student = approvalRequest.student;
    try {
      if (action === "approve") {
        await sendApprovalEmail({
          to: student.user.email,
          name: student.user.name,
          department: student.department.name,
        });
      } else if (action === "send_back") {
        await sendSentBackEmail({
          to: student.user.email,
          name: student.user.name,
          comment: comment!,
          loginUrl: `${process.env.NEXTAUTH_URL}/login`,
        });
      } else {
        await sendRejectionEmail({
          to: student.user.email,
          name: student.user.name,
          comment: comment!,
        });
      }
    } catch (emailError) {
      // Don't fail the whole request if email fails
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Student ${action === "approve" ? "approved" : action === "send_back" ? "sent back" : "rejected"} successfully.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("HOD approval error:", error);
    return NextResponse.json({ error: "Action failed. Please try again." }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !["HOD", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const request = await prisma.approvalRequest.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true, phone: true, avatar: true } },
            department: true,
            batch: true,
          },
        },
        hod: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
