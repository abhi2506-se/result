"use client";

// app/(dashboard)/admin/students/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, Download, ChevronRight, CheckCircle2,
  Clock, XCircle, MoreHorizontal, GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";

const mockStudents = [
  { id: "1", name: "Aarav Mehta", enrollment: "0175CS21045", roll: "CS21045", dept: "CSE", sem: 5, batch: "2022-26", status: "APPROVED", email: "aarav@acem.edu.in" },
  { id: "2", name: "Sneha Patel", enrollment: "0175CS21032", roll: "CS21032", dept: "CSE", sem: 5, batch: "2022-26", status: "PENDING", email: "sneha@acem.edu.in" },
  { id: "3", name: "Rohan Gupta", enrollment: "0175EC21011", roll: "EC21011", dept: "ECE", sem: 3, batch: "2023-27", status: "APPROVED", email: "rohan@acem.edu.in" },
  { id: "4", name: "Priya Verma", enrollment: "0175ME21005", roll: "ME21005", dept: "ME", sem: 7, batch: "2021-25", status: "SENT_BACK", email: "priya@acem.edu.in" },
  { id: "5", name: "Kiran Shah", enrollment: "0175CS21089", roll: "CS21089", dept: "CSE", sem: 5, batch: "2022-26", status: "REJECTED", email: "kiran@acem.edu.in" },
];

const statusBadge = {
  APPROVED: <span className="badge-approved"><CheckCircle2 className="w-3 h-3" />Approved</span>,
  PENDING: <span className="badge-pending"><Clock className="w-3 h-3" />Pending</span>,
  SENT_BACK: <span className="badge-sent-back">↩ Sent Back</span>,
  REJECTED: <span className="badge-rejected"><XCircle className="w-3 h-3" />Rejected</span>,
};

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = mockStudents.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.enrollment.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q);
    const matchDept = !filterDept || s.dept === filterDept;
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <DashboardLayout role="SUPER_ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">All Students</h1>
            <p className="text-slate-500 text-sm mt-1">{mockStudents.length} students across all departments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5"
              placeholder="Search by name, enrollment, roll..."
            />
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="input-field py-2.5 w-auto min-w-[130px]"
          >
            <option value="">All Departments</option>
            {["CSE", "ECE", "ME", "CE"].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field py-2.5 w-auto min-w-[140px]"
          >
            <option value="">All Statuses</option>
            {["APPROVED", "PENDING", "SENT_BACK", "REJECTED"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-x-auto">
          <table className="data-table w-full min-w-[700px]">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment No.</th>
                <th>Roll No.</th>
                <th>Dept</th>
                <th>Sem</th>
                <th>Batch</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {student.name[0]}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{student.name}</div>
                        <div className="text-slate-600 text-xs">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-slate-400">{student.enrollment}</td>
                  <td className="font-mono text-xs text-slate-400">{student.roll}</td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      {student.dept}
                    </span>
                  </td>
                  <td className="text-slate-400 text-sm">{student.sem}</td>
                  <td className="text-slate-400 text-xs font-mono">{student.batch}</td>
                  <td>{statusBadge[student.status as keyof typeof statusBadge]}</td>
                  <td>
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No students found matching your filters.</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
