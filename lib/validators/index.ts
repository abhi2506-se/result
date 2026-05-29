// lib/validators/index.ts - Centralized Zod Validation Schemas

import { z } from "zod";

const COLLEGE_DOMAIN = "@acem.edu.in";

// ================================
// AUTH SCHEMAS
// ================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters").max(100),
  email: z
    .string()
    .email("Invalid email address")
    .refine((v) => v.endsWith(COLLEGE_DOMAIN), {
      message: `Only ${COLLEGE_DOMAIN} emails are allowed`,
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  enrollmentNumber: z
    .string()
    .min(8, "Invalid enrollment number")
    .max(20, "Enrollment number too long")
    .regex(/^[A-Z0-9]+$/i, "Enrollment number must be alphanumeric"),
  rollNumber: z
    .string()
    .min(3, "Invalid roll number")
    .max(15, "Roll number too long"),
  department: z.string().min(1, "Please select a department"),
  semester: z.coerce.number().min(1, "Invalid semester").max(8, "Invalid semester"),
  batch: z
    .string()
    .min(4, "Batch is required (e.g. 2022-26)")
    .regex(/^\d{4}-\d{2,4}$/, "Invalid batch format (e.g. 2022-26)"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ================================
// DEPARTMENT SCHEMAS
// ================================

export const createDepartmentSchema = z.object({
  name: z.string().min(3, "Department name required").max(100),
  code: z
    .string()
    .min(2, "Code required")
    .max(8, "Code too long")
    .regex(/^[A-Z]+$/, "Code must be uppercase letters only"),
  description: z.string().max(500).optional(),
});

// ================================
// HOD SCHEMAS
// ================================

export const assignHODSchema = z.object({
  userId: z.string().min(1, "User is required"),
  departmentId: z.string().min(1, "Department is required"),
  employeeId: z.string().min(4, "Employee ID required"),
  designation: z.string().optional(),
});

// ================================
// TEACHER SCHEMAS
// ================================

export const createTeacherSchema = z.object({
  name: z.string().min(3, "Name required"),
  email: z.string().email().refine((v) => v.endsWith(COLLEGE_DOMAIN)),
  employeeId: z.string().min(4, "Employee ID required"),
  departmentId: z.string().min(1, "Department required"),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
});

// ================================
// SUBJECT SCHEMAS
// ================================

export const createSubjectSchema = z.object({
  name: z.string().min(3, "Subject name required").max(100),
  code: z.string().min(2, "Code required").max(10),
  departmentId: z.string().min(1, "Department required"),
  semester: z.coerce.number().min(1).max(8),
  credits: z.coerce.number().min(1).max(6).default(4),
  type: z.enum(["THEORY", "PRACTICAL", "ELECTIVE"]),
  maxTheory: z.coerce.number().min(0).default(70),
  maxPractical: z.coerce.number().min(0).default(0),
  maxInternal: z.coerce.number().min(0).default(30),
  maxAttendance: z.coerce.number().min(0).default(10),
});

// ================================
// MARKS SCHEMAS
// ================================

export const marksEntrySchema = z.object({
  resultId: z.string().min(1),
  subjectId: z.string().min(1),
  theoryMarks: z.coerce.number().min(0).optional(),
  practicalMarks: z.coerce.number().min(0).optional(),
  internalMarks: z.coerce.number().min(0).optional(),
  attendanceMarks: z.coerce.number().min(0).optional(),
  isDraft: z.boolean().default(true),
});

export const bulkMarksSchema = z.object({
  resultId: z.string().min(1),
  marks: z.array(marksEntrySchema),
});

// ================================
// APPROVAL SCHEMAS
// ================================

export const approvalActionSchema = z.object({
  action: z.enum(["approve", "send_back", "reject"]),
  comment: z.string().max(500).optional(),
}).refine(
  (d) => d.action === "approve" || (d.comment && d.comment.trim().length >= 10),
  {
    message: "Please provide a comment (at least 10 characters) for send back or reject",
    path: ["comment"],
  }
);

// ================================
// BATCH & SESSION SCHEMAS
// ================================

export const createBatchSchema = z.object({
  name: z.string().regex(/^\d{4}-\d{2,4}$/, "Format: YYYY-YY or YYYY-YYYY"),
  year: z.coerce.number().min(2000).max(2099),
  departmentId: z.string().min(1, "Department required"),
});

export const createSessionSchema = z.object({
  name: z.string().min(3, "Session name required"),
  startYear: z.coerce.number().min(2000),
  endYear: z.coerce.number().min(2000),
  batchId: z.string().min(1, "Batch required"),
  isActive: z.boolean().default(false),
}).refine((d) => d.endYear >= d.startYear, {
  message: "End year must be >= start year",
  path: ["endYear"],
});

// ================================
// SEARCH/FILTER SCHEMAS
// ================================

export const studentFilterSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  semester: z.coerce.number().optional(),
  batch: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "SENT_BACK", "REJECTED"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const resultFilterSchema = z.object({
  semester: z.coerce.number().optional(),
  examType: z.enum(["SESSIONAL", "PUT", "INTERNAL"]).optional(),
  sessionId: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
});

// ================================
// PROFILE UPDATE SCHEMA
// ================================

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  avatar: z.string().url().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MarksEntryInput = z.infer<typeof marksEntrySchema>;
export type ApprovalActionInput = z.infer<typeof approvalActionSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
