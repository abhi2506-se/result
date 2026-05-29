"use client";

// app/(dashboard)/admin/page.tsx - Super Admin Dashboard
import { motion } from "framer-motion";
import {
  Users, Shield, GraduationCap, Building2, FileText,
  BarChart3, TrendingUp, Activity, Clock, CheckCircle2,
  XCircle, AlertCircle, ArrowUpRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const registrationTrend = [
  { month: "Aug", students: 45 },
  { month: "Sep", students: 78 },
  { month: "Oct", students: 52 },
  { month: "Nov", students: 94 },
  { month: "Dec", students: 67 },
];

const departmentData = [
  { name: "CSE", students: 248, color: "#06b6d4" },
  { name: "ECE", students: 186, color: "#8b5cf6" },
  { name: "ME", students: 142, color: "#3b82f6" },
  { name: "CE", students: 98, color: "#10b981" },
  { name: "EE", students: 112, color: "#f59e0b" },
];

const recentLogs = [
  { action: "HOD Assigned", user: "Dr. Priya Sharma", dept: "CSE", time: "10 min ago", type: "success" },
  { action: "Result Published", user: "HOD CSE", dept: "Sem 5 PUT", time: "1 hr ago", type: "info" },
  { action: "Student Rejected", user: "HOD ECE", dept: "ECE", time: "3 hrs ago", type: "error" },
  { action: "New Registration", user: "Aarav Kumar", dept: "CSE", time: "5 hrs ago", type: "pending" },
  { action: "Department Created", user: "Super Admin", dept: "IT", time: "1 day ago", type: "success" },
];

const logTypeColor = {
  success: "text-emerald-400 bg-emerald-500/10",
  info: "text-cyan-400 bg-cyan-500/10",
  error: "text-rose-400 bg-rose-500/10",
  pending: "text-amber-400 bg-amber-500/10",
};

export default function AdminDashboard() {
  const totalStudents = departmentData.reduce((a, d) => a + d.students, 0);

  return (
    <DashboardLayout role="SUPER_ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">System Overview</h1>
            <p className="text-slate-500 text-sm mt-1">
              ACEM Result Portal · Admin Control Center
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Operational
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: totalStudents.toString(), icon: <GraduationCap className="w-5 h-5" />, color: "cyan", sub: "+12 this week" },
            { label: "Pending Approvals", value: "23", icon: <Clock className="w-5 h-5" />, color: "amber", sub: "Across all depts" },
            { label: "Active Teachers", value: "42", icon: <Users className="w-5 h-5" />, color: "blue", sub: "6 departments" },
            { label: "Published Results", value: "38", icon: <FileText className="w-5 h-5" />, color: "emerald", sub: "This session" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Departments", value: "6", icon: <Building2 className="w-4 h-4" />, color: "purple" },
            { label: "Total HODs", value: "6", icon: <Shield className="w-4 h-4" />, color: "rose" },
            { label: "Avg Pass Rate", value: "86%", icon: <TrendingUp className="w-4 h-4" />, color: "emerald" },
            { label: "Approved Students", value: "763", icon: <CheckCircle2 className="w-4 h-4" />, color: "cyan" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  stat.color === "purple"
                    ? "bg-purple-500/15 text-purple-400"
                    : stat.color === "rose"
                    ? "bg-rose-500/15 text-rose-400"
                    : stat.color === "emerald"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-cyan-500/15 text-cyan-400"
                }`}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold">Student Registrations</h2>
                <p className="text-slate-500 text-xs mt-0.5">Monthly trend</p>
              </div>
              <button className="text-cyan-400 text-xs flex items-center gap-1 hover:text-cyan-300 transition-colors">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={registrationTrend}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,15,35,0.95)",
                    border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: "10px",
                    color: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="students" name="Students" stroke="#06b6d4" strokeWidth={2.5} fill="url(#regGrad)" dot={{ fill: "#06b6d4", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Department Distribution - Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-white font-semibold mb-1">Students by Dept.</h2>
            <p className="text-slate-500 text-xs mb-4">Total: {totalStudents}</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="students"
                  paddingAngle={3}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,15,35,0.95)",
                    border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: "10px",
                    fontSize: 11,
                    color: "#e2e8f0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {departmentData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-400">{d.name}</span>
                  </div>
                  <span className="text-white font-medium font-mono">{d.students}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent Activity Logs
            </h2>
            <button className="text-cyan-400 text-xs flex items-center gap-1 hover:text-cyan-300 transition-colors">
              View all logs <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    logTypeColor[log.type as keyof typeof logTypeColor]
                  }`}
                >
                  {log.type === "success" ? <CheckCircle2 className="w-4 h-4" /> :
                   log.type === "error" ? <XCircle className="w-4 h-4" /> :
                   log.type === "pending" ? <Clock className="w-4 h-4" /> :
                   <Activity className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{log.action}</p>
                  <p className="text-slate-500 text-xs">
                    {log.user} · {log.dept}
                  </p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Add Department", icon: <Building2 className="w-5 h-5" />, href: "/admin/departments/new", color: "cyan" },
            { label: "Assign HOD", icon: <Shield className="w-5 h-5" />, href: "/admin/hods/assign", color: "purple" },
            { label: "Add Teacher", icon: <Users className="w-5 h-5" />, href: "/admin/teachers/new", color: "blue" },
            { label: "View All Logs", icon: <Activity className="w-5 h-5" />, href: "/admin/logs", color: "rose" },
          ].map((action, i) => (
            <a
              key={i}
              href={action.href}
              className="glass-card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform group cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  action.color === "cyan"
                    ? "bg-cyan-500/15 text-cyan-400"
                    : action.color === "purple"
                    ? "bg-purple-500/15 text-purple-400"
                    : action.color === "blue"
                    ? "bg-blue-500/15 text-blue-400"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {action.icon}
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
