// lib/email.ts - Email Service with Branded HTML Templates
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT ?? "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"ACEM Result Portal" <${process.env.SMTP_USER}>`;

// ================================
// BASE TEMPLATE
// ================================
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ACEM Result Portal</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #080c18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e2e8f0; }
  .wrapper { max-width: 580px; margin: 0 auto; padding: 40px 20px; }
  .card { background: linear-gradient(135deg, rgba(10,15,35,0.95), rgba(10,20,45,0.95)); border: 1px solid rgba(99,179,237,0.15); border-radius: 20px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #0891b2, #3b82f6); padding: 32px; text-align: center; }
  .header-logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 0; }
  .logo-icon { width: 42px; height: 42px; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; }
  .logo-text { font-size: 18px; font-weight: 800; color: white; letter-spacing: -0.5px; }
  .body { padding: 36px 32px; }
  .title { font-size: 22px; font-weight: 700; color: #f1f5f9; margin-bottom: 12px; }
  .text { font-size: 15px; color: #94a3b8; line-height: 1.7; margin-bottom: 16px; }
  .highlight { color: #67e8f9; font-weight: 600; }
  .badge { display: inline-block; padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700; margin: 8px 0; }
  .badge-success { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
  .badge-warning { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
  .badge-danger { background: rgba(244,63,94,0.15); color: #fb7185; border: 1px solid rgba(244,63,94,0.3); }
  .badge-info { background: rgba(6,182,212,0.15); color: #67e8f9; border: 1px solid rgba(6,182,212,0.3); }
  .btn { display: inline-block; padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; margin-top: 20px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; }
  .divider { border: none; border-top: 1px solid rgba(99,179,237,0.1); margin: 24px 0; }
  .info-box { background: rgba(6,182,212,0.05); border: 1px solid rgba(6,182,212,0.15); border-radius: 12px; padding: 16px 20px; margin: 16px 0; }
  .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #64748b; }
  .info-value { color: #e2e8f0; font-weight: 600; font-family: monospace; }
  .footer { padding: 20px 32px; text-align: center; border-top: 1px solid rgba(99,179,237,0.08); }
  .footer-text { font-size: 12px; color: #334155; line-height: 1.6; }
  .footer-text a { color: #475569; text-decoration: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="header-logo">
        <div class="logo-icon">🎓</div>
        <span class="logo-text">ACEM Result Portal</span>
      </div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p class="footer-text">
        Azad College of Engineering &amp; Management<br/>
        This email was sent from an automated system. Please do not reply.<br/>
        <a href="${process.env.NEXTAUTH_URL}">Visit Portal</a> · <a href="mailto:admin@acem.edu.in">Contact Admin</a>
      </p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ================================
// EMAIL FUNCTIONS
// ================================

export async function sendVerificationEmail({ to, name, verifyUrl }: { to: string; name: string; verifyUrl: string }) {
  const html = baseTemplate(`
    <h2 class="title">Verify your email address</h2>
    <p class="text">Hi <span class="highlight">${name}</span>,</p>
    <p class="text">Thank you for registering on the ACEM Result Portal. Please verify your email address to complete your registration.</p>
    <div style="text-align:center;">
      <a href="${verifyUrl}" class="btn">✉️ Verify Email Address</a>
    </div>
    <hr class="divider" />
    <p class="text" style="font-size:13px; color:#475569;">This link will expire in 24 hours. If you didn't register, ignore this email.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Verify your ACEM Portal email",
    html,
  });
}

export async function sendApprovalEmail({ to, name, department }: { to: string; name: string; department: string }) {
  const html = baseTemplate(`
    <span class="badge badge-success">✅ Account Approved</span>
    <h2 class="title">Your registration has been approved!</h2>
    <p class="text">Hi <span class="highlight">${name}</span>,</p>
    <p class="text">Great news! Your registration on ACEM Result Portal has been reviewed and <strong>approved</strong> by your Head of Department.</p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Department</span>
        <span class="info-value">${department}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status</span>
        <span class="info-value" style="color:#34d399;">APPROVED</span>
      </div>
    </div>
    <p class="text">You can now log in to access your academic results, download marksheets, and track your SGPA history.</p>
    <div style="text-align:center;">
      <a href="${process.env.NEXTAUTH_URL}/login" class="btn">🚀 Login to Portal</a>
    </div>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "✅ Your ACEM Portal Account is Approved!",
    html,
  });
}

export async function sendSentBackEmail({ to, name, comment, loginUrl }: { to: string; name: string; comment: string; loginUrl: string }) {
  const html = baseTemplate(`
    <span class="badge badge-warning">⚠️ Action Required</span>
    <h2 class="title">Your registration needs update</h2>
    <p class="text">Hi <span class="highlight">${name}</span>,</p>
    <p class="text">Your registration request has been reviewed by the HOD and needs some corrections before it can be approved.</p>
    <div class="info-box">
      <p style="font-size:13px; color:#64748b; margin-bottom:8px;">HOD's Comment:</p>
      <p style="font-size:14px; color:#fbbf24; font-style:italic;">"${comment}"</p>
    </div>
    <p class="text">Please log in to your account, update the required information, and re-submit your registration for approval.</p>
    <div style="text-align:center;">
      <a href="${loginUrl}" class="btn">✏️ Update My Registration</a>
    </div>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "⚠️ ACEM Portal: Registration Needs Update",
    html,
  });
}

export async function sendRejectionEmail({ to, name, comment }: { to: string; name: string; comment: string }) {
  const html = baseTemplate(`
    <span class="badge badge-danger">❌ Registration Rejected</span>
    <h2 class="title">Registration could not be approved</h2>
    <p class="text">Hi <span class="highlight">${name}</span>,</p>
    <p class="text">We regret to inform you that your registration on ACEM Result Portal has been rejected.</p>
    <div class="info-box">
      <p style="font-size:13px; color:#64748b; margin-bottom:8px;">Reason:</p>
      <p style="font-size:14px; color:#fb7185; font-style:italic;">"${comment}"</p>
    </div>
    <p class="text">Please contact your Head of Department directly for assistance or clarification.</p>
    <p class="text">Email: <a href="mailto:hod@acem.edu.in" style="color:#67e8f9;">hod@acem.edu.in</a></p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "ACEM Portal: Registration Status Update",
    html,
  });
}

export async function sendResultPublishedEmail({
  to, name, semester, examType, sgpa, percentage, status, resultUrl,
}: {
  to: string; name: string; semester: number; examType: string;
  sgpa: number; percentage: number; status: string; resultUrl: string;
}) {
  const isPass = status === "PASS";
  const html = baseTemplate(`
    <span class="badge badge-info">📊 Result Published</span>
    <h2 class="title">Your Semester ${semester} result is out!</h2>
    <p class="text">Hi <span class="highlight">${name}</span>,</p>
    <p class="text">Your <strong>Semester ${semester} ${examType} Result</strong> has been published on the ACEM Result Portal.</p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Exam Type</span>
        <span class="info-value">${examType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Semester</span>
        <span class="info-value">Semester ${semester}</span>
      </div>
      <div class="info-row">
        <span class="info-label">SGPA</span>
        <span class="info-value" style="color:#67e8f9;">${sgpa.toFixed(2)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Percentage</span>
        <span class="info-value">${percentage.toFixed(1)}%</span>
      </div>
      <div class="info-row">
        <span class="info-label">Result</span>
        <span class="info-value" style="color:${isPass ? "#34d399" : "#fb7185"};">${status}</span>
      </div>
    </div>
    <p class="text">Log in to view your detailed subject-wise marks and download your official marksheet.</p>
    <div style="text-align:center;">
      <a href="${resultUrl}" class="btn">📄 View Full Result</a>
    </div>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `📊 Semester ${semester} ${examType} Result Published | ACEM Portal`,
    html,
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }: { to: string; name: string; resetUrl: string }) {
  const html = baseTemplate(`
    <h2 class="title">Reset your password</h2>
    <p class="text">Hi <span class="highlight">${name}</span>,</p>
    <p class="text">We received a request to reset your ACEM Portal password. Click the button below to set a new password.</p>
    <div style="text-align:center;">
      <a href="${resetUrl}" class="btn">🔐 Reset Password</a>
    </div>
    <hr class="divider" />
    <p class="text" style="font-size:13px; color:#475569;">This link expires in 1 hour. If you didn't request a reset, ignore this email — your password remains unchanged.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "Reset your ACEM Portal password",
    html,
  });
}
