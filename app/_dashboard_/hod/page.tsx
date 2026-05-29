"use client";

// app/(dashboard)/hod/page.tsx - HOD Dashboard
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, CheckSquare, XCircle, CornerUpLeft, Clock, FileText,
  BarChart3, ChevronRight, CheckCircle2, AlertCircle, Eye,
  Send, MessageSquare, Building2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const pendingStudents = [
  {
    id: "1",
    name: "Aarav Mehta",
    enrollment: "0175CS21045",
    rollNo: "CS21045",
    department: "CSE",
    semester: 5,
    batch: "2022-26",
    email: "aarav.mehta@acem.edu.in",
    phone: "9876543210",
    submittedAt: "2024-12-01",
    photo: "AM",
  },
  {
    id: "2",
    name: "Sneha Patel",
    enrollment: "0175CS21032",
    rollNo: "CS21032",
    department: "CSE",
    semester: 5,
    batch: "2022-26",
    email: "sneha.patel@acem.edu.in",
    phone: "9123456789",
    submittedAt: "2024-12-02",
    photo: "SP",
  },
  {
    id: "3",
    name: "Rohan Gupta",
    enrollment: "0175EC21011",
    rollNo: "EC21011",
    department: "ECE",
    semester: 3,
    batch: "2023-27",
    email: "rohan.gupta@acem.edu.in",
    phone: "9988776655",
    submittedAt: "2024-12-03",
    photo: "RG",
  },
];

const deptAnalytics = [
  { sem: "Sem 1", pass: 85, fail: 15 },
  { sem: "Sem 2", pass: 78, fail: 22 },
  { sem: "Sem 3", pass: 91, fail: 9 },
  { sem: "Sem 4", pass: 88, fail: 12 },
  { sem: "Sem 5", pass: 82, fail: 18 },
];

type ActionType = "approve" | "send_back" | "reject" | null;

export default function HODDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<typeof pendingStudents[0] | null>(null);
  const [action, setAction] = useState<ActionType>(null);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAction = async (studentId: string, actionType: ActionType, msg?: string) => {
    setProcessing(studentId);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setProcessing(null);
    setSelectedStudent(null);
    setAction(null);
    setComment("");
    // In real app: call /api/hod/approvals/[id]
  };

  return (
    <DashboardLayout role="HOD">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">HOD Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Computer Science & Engineering Department
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending Approvals", value: "5", icon: <Clock className="w-5 h-5" />, color: "amber", sub: "Awaiting review" },
            { label: "Total Students", value: "248", icon: <Users className="w-5 h-5" />, color: "cyan", sub: "In department" },
            { label: "Published Results", value: "12", icon: <FileText className="w-5 h-5" />, color: "emerald", sub: "This session" },
            { label: "Pass Rate", value: "87%", icon: <BarChart3 className="w-5 h-5" />, color: "blue", sub: "Department avg" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Approvals */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Pending Approvals
              </h2>
              <span className="badge-pending">{pendingStudents.length} pending</span>
            </div>

            {pendingStudents.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {student.photo}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-white font-semibold text-sm">{student.name}</h3>
                      <span className="badge-pending">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                      {[
                        ["Enrollment", student.enrollment],
                        ["Roll No.", student.rollNo],
                        ["Department", student.department],
                        ["Semester", `Sem ${student.semester}`],
                        ["Batch", student.batch],
                        ["Submitted", new Date(student.submittedAt).toLocaleDateString("en-IN")],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1 text-xs">
                          <span className="text-slate-600">{k}:</span>
                          <span className="text-slate-400 font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">{student.email}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                  <button
                    onClick={() => handleAction(student.id, "approve")}
                    disabled={processing === student.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {processing === student.id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => { setSelectedStudent(student); setAction("send_back"); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-all"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                    Send Back
                  </button>
                  <button
                    onClick={() => { setSelectedStudent(student); setAction("reject"); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25 hover:bg-rose-500/25 transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Department Analytics */}
            <div className="glass-card p-5">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                Pass/Fail by Semester
              </h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={deptAnalytics} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,35,0.95)",
                      border: "1px solid rgba(99,179,237,0.2)",
                      borderRadius: "10px",
                      color: "#e2e8f0",
                      fontSize: 11,
                    }}
                  />
                  <Bar dataKey="pass" name="Pass %" radius={[4, 4, 0, 0]} fill="#06b6d4" maxBarSize={16} />
                  <Bar dataKey="fail" name="Fail %" radius={[4, 4, 0, 0]} fill="#f43f5e" maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-5">
              <h2 className="text-white font-semibold mb-4">Recent Actions</h2>
              <div className="space-y-3">
                {[
                  { action: "Approved", name: "Vikram Singh", time: "2 hrs ago", color: "emerald" },
                  { action: "Published", name: "Sem 5 PUT Result", time: "1 day ago", color: "cyan" },
                  { action: "Sent Back", name: "Pooja Sharma", time: "2 days ago", color: "blue" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.color === "emerald"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : item.color === "cyan"
                          ? "bg-cyan-500/15 text-cyan-400"
                          : "bg-blue-500/15 text-blue-400"
                      }`}
                    >
                      {item.color === "emerald" ? <CheckCircle2 className="w-3.5 h-3.5" /> : item.color === "cyan" ? <Send className="w-3.5 h-3.5" /> : <CornerUpLeft className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">{item.action}</p>
                      <p className="text-slate-500 text-xs truncate">{item.name}</p>
                    </div>
                    <span className="text-slate-600 text-xs flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Modal */}
        {selectedStudent && action && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedStudent(null); setAction(null); }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative glass-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-lg mb-1">
                {action === "send_back" ? "Send Back Registration" : "Reject Registration"}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Student: <span className="text-white font-medium">{selectedStudent.name}</span>
              </p>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {action === "send_back" ? "Reason for Send Back (visible to student)" : "Rejection Reason"}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder={
                    action === "send_back"
                      ? "e.g. Please upload a clear ID card photo."
                      : "e.g. Enrollment number mismatch with records."
                  }
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => { setSelectedStudent(null); setAction(null); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(selectedStudent.id, action, comment)}
                  disabled={!comment.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                    action === "reject"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                  }`}
                >
                  {action === "send_back" ? (
                    <><CornerUpLeft className="w-4 h-4" /> Send Back</>
                  ) : (
                    <><XCircle className="w-4 h-4" /> Reject</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
