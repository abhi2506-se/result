"use client";

// app/(dashboard)/admin/analytics/page.tsx
import { motion } from "framer-motion";
import {
  TrendingUp, BarChart3, Users, Award, Target,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from "recharts";

const semResultData = [
  { sem: "Sem 1", pass: 88, fail: 12, backlog: 5, sgpa: 7.2 },
  { sem: "Sem 2", pass: 82, fail: 18, backlog: 8, sgpa: 7.5 },
  { sem: "Sem 3", pass: 91, fail: 9, backlog: 3, sgpa: 7.8 },
  { sem: "Sem 4", pass: 87, fail: 13, backlog: 6, sgpa: 8.0 },
  { sem: "Sem 5", pass: 84, fail: 16, backlog: 7, sgpa: 8.1 },
];

const deptPerformance = [
  { dept: "CSE", sgpa: 8.2, passRate: 87, students: 248 },
  { dept: "ECE", sgpa: 7.9, passRate: 82, students: 186 },
  { dept: "ME", sgpa: 7.5, passRate: 79, students: 142 },
  { dept: "CE", sgpa: 7.2, passRate: 76, students: 98 },
  { dept: "EE", sgpa: 7.8, passRate: 84, students: 112 },
];

const gradeDistribution = [
  { grade: "O", count: 45, color: "#10b981" },
  { grade: "A+", count: 112, color: "#06b6d4" },
  { grade: "A", count: 189, color: "#3b82f6" },
  { grade: "B+", count: 156, color: "#8b5cf6" },
  { grade: "B", count: 98, color: "#f59e0b" },
  { grade: "C", count: 54, color: "#f97316" },
  { grade: "F", count: 32, color: "#f43f5e" },
];

const monthlyRegistrations = [
  { month: "Jul", count: 12 },
  { month: "Aug", count: 145 },
  { month: "Sep", count: 234 },
  { month: "Oct", count: 78 },
  { month: "Nov", count: 45 },
  { month: "Dec", count: 22 },
];

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout role="SUPER_ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Comprehensive academic performance insights</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Institution Avg SGPA", value: "7.9", icon: <Award className="w-5 h-5" />, color: "cyan", sub: "↑ 0.3 from last year" },
            { label: "Overall Pass Rate", value: "86%", icon: <Target className="w-5 h-5" />, color: "emerald", sub: "Across all depts" },
            { label: "Total Enrolled", value: "786", icon: <Users className="w-5 h-5" />, color: "blue", sub: "Active students" },
            { label: "Results Published", value: "38", icon: <BarChart3 className="w-5 h-5" />, color: "purple", sub: "This academic year" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${
                stat.color === "cyan" ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" :
                stat.color === "emerald" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
                stat.color === "blue" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
                "bg-purple-500/15 text-purple-400 border-purple-500/20"
              }`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
              <div className="text-xs text-emerald-400 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pass/Fail by Semester */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-1">Pass/Fail by Semester</h2>
            <p className="text-slate-500 text-xs mb-4">CSE Department · 2024-25</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={semResultData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,35,0.95)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "10px", color: "#e2e8f0", fontSize: 11 }} />
                <Bar dataKey="pass" name="Pass %" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="fail" name="Fail %" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* SGPA Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-1">Average SGPA Trend</h2>
            <p className="text-slate-500 text-xs mb-4">Semester-wise progression</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={semResultData}>
                <defs>
                  <linearGradient id="sgpaGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(10,15,35,0.95)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "10px", color: "#e2e8f0", fontSize: 11 }} />
                <Area type="monotone" dataKey="sgpa" name="Avg SGPA" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#sgpaGrad2)" dot={{ fill: "#8b5cf6", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Distribution Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-1">Grade Distribution</h2>
            <p className="text-slate-500 text-xs mb-4">All departments · PUT Results</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="count" paddingAngle={2}>
                  {gradeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(10,15,35,0.95)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "10px", fontSize: 11, color: "#e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {gradeDistribution.map((g) => (
                <div key={g.grade} className="text-center">
                  <div className="text-xs font-bold" style={{ color: g.color }}>{g.grade}</div>
                  <div className="text-xs text-slate-600">{g.count}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Department Comparison */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6 lg:col-span-2">
            <h2 className="text-white font-semibold mb-1">Department Performance</h2>
            <p className="text-slate-500 text-xs mb-4">SGPA comparison across departments</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" domain={[6, 10]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="dept" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={{ background: "rgba(10,15,35,0.95)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "10px", color: "#e2e8f0", fontSize: 11 }} />
                <Bar dataKey="sgpa" name="Avg SGPA" radius={[0, 6, 6, 0]} maxBarSize={20}>
                  {deptPerformance.map((_, i) => (
                    <Cell key={i} fill={`hsl(${190 + i * 25}, 70%, 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Registration Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="text-white font-semibold mb-1">Monthly Registration Trend</h2>
          <p className="text-slate-500 text-xs mb-4">Academic Year 2024-25</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlyRegistrations}>
              <defs>
                <linearGradient id="regGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(10,15,35,0.95)", border: "1px solid rgba(99,179,237,0.2)", borderRadius: "10px", color: "#e2e8f0", fontSize: 11 }} />
              <Area type="monotone" dataKey="count" name="Registrations" stroke="#06b6d4" strokeWidth={2} fill="url(#regGrad2)" dot={{ fill: "#06b6d4", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
