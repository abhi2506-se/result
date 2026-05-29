// types/index.ts - Centralized Type Definitions

export type Role = "SUPER_ADMIN" | "HOD" | "TEACHER" | "STUDENT";
export type ApprovalStatus = "PENDING" | "APPROVED" | "SENT_BACK" | "REJECTED";
export type ResultStatus = "PASS" | "FAIL" | "BACKLOG" | "NOT_PUBLISHED";
export type ExamType = "SESSIONAL" | "PUT" | "INTERNAL";
export type SubjectType = "THEORY" | "PRACTICAL" | "ELECTIVE";
export type NotificationType =
  | "APPROVAL"
  | "REJECTION"
  | "SENT_BACK"
  | "RESULT_PUBLISHED"
  | "MARKS_UPDATED"
  | "SYSTEM";

// ================================
// AUTH TYPES
// ================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  emailVerified: boolean;
}

export interface SessionUser extends AuthUser {
  studentProfile?: StudentProfile | null;
  teacherProfile?: TeacherProfile | null;
  hodProfile?: HODProfile | null;
}

// ================================
// PROFILE TYPES
// ================================

export interface StudentProfile {
  id: string;
  enrollmentNumber: string;
  rollNumber: string;
  departmentId: string;
  batchId?: string | null;
  semester: number;
  currentSemester: number;
  approvalStatus: ApprovalStatus;
  approvalComment?: string | null;
  profilePhoto?: string | null;
  department?: Department;
  batch?: Batch | null;
}

export interface TeacherProfile {
  id: string;
  employeeId: string;
  departmentId?: string | null;
  qualification?: string | null;
  specialization?: string | null;
  department?: Department | null;
}

export interface HODProfile {
  id: string;
  employeeId: string;
  departmentId?: string | null;
  designation: string;
  department?: Department | null;
}

// ================================
// DEPARTMENT & ACADEMIC
// ================================

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  _count?: {
    students: number;
    teachers: number;
    subjects: number;
  };
}

export interface Batch {
  id: string;
  name: string;
  year: number;
  departmentId: string;
  isActive: boolean;
  department?: Department;
}

export interface AcademicSession {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  isActive: boolean;
  batchId: string;
  batch?: Batch;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: number;
  credits: number;
  type: SubjectType;
  maxTheory: number;
  maxPractical: number;
  maxInternal: number;
  maxAttendance: number;
  department?: Department;
}

// ================================
// RESULT TYPES
// ================================

export interface Marks {
  id: string;
  resultId: string;
  subjectId: string;
  theoryMarks: number;
  practicalMarks: number;
  internalMarks: number;
  attendanceMarks: number;
  totalMarks: number;
  grade: string;
  gradePoints: number;
  isPassed: boolean;
  isBacklog: boolean;
  isDraft: boolean;
  subject?: Subject;
}

export interface Result {
  id: string;
  studentId: string;
  sessionId: string;
  semester: number;
  examType: ExamType;
  status: ResultStatus;
  isPublished: boolean;
  publishedAt?: Date | null;
  sgpa?: number | null;
  percentage?: number | null;
  totalMarks: number;
  maxMarks: number;
  student?: StudentWithUser;
  session?: AcademicSession;
  marks?: Marks[];
}

// ================================
// COMBINED TYPES
// ================================

export interface StudentWithUser {
  id: string;
  enrollmentNumber: string;
  rollNumber: string;
  semester: number;
  approvalStatus: ApprovalStatus;
  approvalComment?: string | null;
  profilePhoto?: string | null;
  submittedAt: Date;
  approvedAt?: Date | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
  };
  department: Department;
  batch?: Batch | null;
}

export interface ApprovalRequest {
  id: string;
  studentId: string;
  hodId?: string | null;
  status: ApprovalStatus;
  comment?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
  student?: StudentWithUser;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  target?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
    role: Role;
  };
}

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ================================
// FORM TYPES
// ================================

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  enrollmentNumber: string;
  rollNumber: string;
  department: string;
  semester: number;
  batch: string;
  phone: string;
  profilePhoto?: File;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface MarksEntryFormData {
  resultId: string;
  subjectId: string;
  theoryMarks?: number;
  practicalMarks?: number;
  internalMarks?: number;
  attendanceMarks?: number;
}

// ================================
// ANALYTICS TYPES
// ================================

export interface DashboardStats {
  totalStudents: number;
  approvedStudents: number;
  pendingApprovals: number;
  publishedResults: number;
  totalDepartments: number;
  activeTeachers: number;
  totalHODs: number;
}

export interface ResultAnalytics {
  semester: number;
  passPercentage: number;
  failPercentage: number;
  avgSGPA: number;
  topperScore: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
}
