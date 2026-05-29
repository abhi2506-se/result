"use client";

// app/(dashboard)/student/page.tsx - Student Dashboard
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Award, BookOpen, Bell, Download, Eye,
  CheckCircle2, Clock, AlertCircle, BarChart2, FileText,
  ChevronRight, Star, Calendar, Hash,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ResultCard } from "@/components/dashboard/student/result-card";
import { useSession } from "next-auth/react";
import type { Result, Notification } from "@/types";

const mockSGPAData = [
  { sem: "Sem 1", sgpa: 7.2 },
  { sem: "Sem 2", sgpa: 7.8 },
  { sem: "Sem 3", sgpa: 8.1 },
  { sem: "Sem 4", sgpa: 8.5 },
  { sem: "Sem 5", sgpa: 8.3 },
];

const mockResults: Partial<Result>[] = [
  {
    id: "1",
    semester: 5,
    examType: "PUT",
    status: "PASS",
    isPublished: true,
    sgpa: 8.3,
    percentage: 76.4,
    totalMarks: 420,
    maxMarks: 550,
    publishedAt: new Date("2024-11-15"),
  },
  {
    id: "2",
    semester: 5,
    examType: "SESSIONAL",
    status: "PASS",
    isPublished: true,
    sgpa: 8.1,
    percentage: 74.8,
    totalMarks: 180,
    maxMarks: 240,
    publishedAt: new Date("2024-09-20"),
  },
];

const mockNotifications: Partial<Notification>[] = [
  {
    id: "1",
    type: "RESULT_PUBLISHED",
    title: "PUT Result Published",
    message: "Your Semester 5 PUT Result is now available.",
    isRead: false,
    createdAt: new Date("2024-11-15"),
  },
  {
    id: "2",
    type: "APPROVAL",
    title: "Account Approved",
    message: "Your registration has been approved by HOD.",
    isRead: true,
    createdAt: new Date("2024-08-01"),
  },
];

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"overview" | "results" | "notifications">("overview");

  const student = session?.user;

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-white">
              Welcome back,{" "}
              <span className="gradient-text-cyan">{student?.name?.split(" ")[0] ?? "Student"}</span> 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              B.Tech CSE · Semester 5 · Batch 2022–26
            </p>
          </motion.div>

          {/* Approval Status */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="badge-approved self-start sm:self-center"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Account Approved
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Current SGPA",
              value: "8.3",
              icon: <TrendingUp className="w-5 h-5" />,
              color: "cyan",
              sub: "+0.2 from last sem",
              trend: "up",
            },
            {
              label: "Overall %",
              value: "76.4%",
              icon: <BarChart2 className="w-5 h-5" />,
              color: "blue",
              sub: "PUT Semester 5",
              trend: "up",
            },
            {
              label: "Results Published",
              value: "2",
              icon: <FileText className="w-5 h-5" />,
              color: "purple",
              sub: "This semester",
            },
            {
              label: "Notifications",
              value: "1",
              icon: <Bell className="w-5 h-5" />,
              color: "amber",
              sub: "Unread",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {(["overview", "results", "notifications"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SGPA Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-semibold">SGPA Progression</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Semester-wise performance trend</p>
                </div>
                <div className="badge-approved text-xs">
                  <TrendingUp className="w-3 h-3" />
                  Improving
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockSGPAData}>
                  <defs>
                    <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[6, 10]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,15,35,0.95)",
                      border: "1px solid rgba(99,179,237,0.2)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sgpa"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fill="url(#sgpaGrad)"
                    dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Profile + Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-white font-semibold mb-4">Profile Summary</h2>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white">
                  {student?.name?.[0] ?? "S"}
                </div>
                <div>
                  <div className="text-white font-semibold">{student?.name ?? "Student"}</div>
                  <div className="text-slate-500 text-xs">{student?.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Enrollment", value: "0175CS21001", icon: <Hash className="w-3.5 h-3.5" /> },
                  { label: "Roll No.", value: "CS21001", icon: <Star className="w-3.5 h-3.5" /> },
                  { label: "Department", value: "CSE", icon: <BookOpen className="w-3.5 h-3.5" /> },
                  { label: "Batch", value: "2022–26", icon: <Calendar className="w-3.5 h-3.5" /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-slate-500 text-xs flex items-center gap-1.5">
                      {item.icon} {item.label}
                    </span>
                    <span className="text-white text-xs font-medium font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === "results" && (
          <div className="space-y-4">
            {mockResults.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ResultCard result={result as Result} />
              </motion.div>
            ))}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="glass-card divide-y divide-white/[0.04]">
            {mockNotifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === "RESULT_PUBLISHED"
                      ? "bg-cyan-500/15 text-cyan-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {notif.type === "RESULT_PUBLISHED" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-sm font-medium">{notif.title}</p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{notif.message}</p>
                  <p className="text-slate-600 text-xs mt-1 font-mono">
                    {notif.createdAt?.toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
