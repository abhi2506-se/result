"use client";

// app/(dashboard)/admin/logs/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, Search, Filter, Download, CheckCircle2,
  XCircle, LogIn, LogOut, Edit3, Send, Plus, Shield,
  Clock, User, ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";

const mockLogs = [
  { id: "1", action: "LOGIN", user: "Dr. Priya Sharma", role: "HOD", target: null, details: "Logged in from 192.168.1.1", time: "2024-12-05 10:23:45", type: "info" },
  { id: "2", action: "APPROVE_STUDENT", user: "Dr. Priya Sharma", role: "HOD", target: "Aarav Mehta (0175CS21045)", details: "Student registration approved", time: "2024-12-05 10:30:12", type: "success" },
  { id: "3", action: "PUBLISH_RESULT", user: "Dr. Priya Sharma", role: "HOD", target: "Sem 5 PUT Result", details: "48 students notified via email", time: "2024-12-04 15:45:00", type: "success" },
  { id: "4", action: "REJECT_STUDENT", user: "Dr. Ramesh Patel", role: "HOD", target: "Kiran Shah (0175CS21089)", details: "Enrollment mismatch found", time: "2024-12-04 12:10:33", type: "error" },
  { id: "5", action: "UPDATE_MARKS", user: "Dr. Anil Kumar", role: "TEACHER", target: "CS501 - DSA", details: "Updated marks for 48 students", time: "2024-12-03 09:15:20", type: "info" },
  { id: "6", action: "REGISTER", user: "Rohan Gupta", role: "STUDENT", target: "0175EC21011", details: "New student registration", time: "2024-12-03 08:00:00", type: "info" },
  { id: "7", action: "CREATE_DEPARTMENT", user: "Super Admin", role: "SUPER_ADMIN", target: "Information Technology (IT)", details: "New department created", time: "2024-12-02 14:30:00", type: "success" },
  { id: "8", action: "LOGOUT", user: "Dr. Anil Kumar", role: "TEACHER", target: null, details: "Session ended", time: "2024-12-01 17:00:00", type: "neutral" },
];

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <LogIn className="w-3.5 h-3.5" />,
  LOGOUT: <LogOut className="w-3.5 h-3.5" />,
  APPROVE_STUDENT: <CheckCircle2 className="w-3.5 h-3.5" />,
  REJECT_STUDENT: <XCircle className="w-3.5 h-3.5" />,
  PUBLISH_RESULT: <Send className="w-3.5 h-3.5" />,
  UPDATE_MARKS: <Edit3 className="w-3.5 h-3.5" />,
  REGISTER: <Plus className="w-3.5 h-3.5" />,
  CREATE_DEPARTMENT: <Plus className="w-3.5 h-3.5" />,
  ASSIGN_HOD: <Shield className="w-3.5 h-3.5" />,
};

const typeColors: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  error: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  info: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  neutral: "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "text-rose-400 bg-rose-500/10",
  HOD: "text-purple-400 bg-purple-500/10",
  TEACHER: "text-blue-400 bg-blue-500/10",
  STUDENT: "text-cyan-400 bg-cyan-500/10",
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterAction, setFilterAction] = useState("");

  const filtered = mockLogs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch = !q || log.user.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || (log.target ?? "").toLowerCase().includes(q);
    const matchRole = !filterRole || log.role === filterRole;
    const matchAction = !filterAction || log.action === filterAction;
    return matchSearch && matchRole && matchAction;
  });

  return (
    <DashboardLayout role="SUPER_ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
            <p className="text-slate-500 text-sm mt-1">Complete audit trail of all system actions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Events", value: mockLogs.length.toString(), color: "cyan" },
            { label: "Logins Today", value: "12", color: "blue" },
            { label: "Results Published", value: "3", color: "emerald" },
            { label: "Approvals", value: "8", color: "purple" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-4"
            >
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5"
              placeholder="Search by user, action, target..."
            />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-field py-2.5 w-auto">
            <option value="">All Roles</option>
            {["SUPER_ADMIN", "HOD", "TEACHER", "STUDENT"].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="input-field py-2.5 w-auto">
            <option value="">All Actions</option>
            {["LOGIN", "LOGOUT", "REGISTER", "APPROVE_STUDENT", "REJECT_STUDENT", "PUBLISH_RESULT", "UPDATE_MARKS"].map((a) => (
              <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Logs Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <div className="p-4 border-b border-white/[0.05] flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-semibold text-sm">System Events</span>
            <span className="ml-auto text-xs text-slate-500">{filtered.length} records</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
              >
                {/* Action Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${typeColors[log.type]}`}>
                  {actionIcons[log.action] ?? <Activity className="w-3.5 h-3.5" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    {log.target && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate-600" />
                        <span className="text-slate-400 text-xs font-mono">{log.target}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <User className="w-3 h-3" /> {log.user}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[log.role]}`}>
                      {log.role.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-600">{log.details}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-slate-600 font-mono flex-shrink-0 text-right">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    {log.time.split(" ")[1]}
                  </div>
                  <div className="text-slate-700 mt-0.5">{log.time.split(" ")[0]}</div>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No logs found matching your filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
