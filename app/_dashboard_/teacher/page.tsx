"use client";

// app/(dashboard)/teacher/page.tsx - Teacher Dashboard
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, ClipboardList, Upload, CheckSquare, Users,
  Save, Send, ChevronRight, Search, Filter, FileSpreadsheet,
  Clock, CheckCircle2, AlertCircle, TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { StatCard } from "@/components/dashboard/stat-card";

const assignedSubjects = [
  { id: "s1", code: "CS501", name: "Data Structures & Algorithms", semester: 5, batch: "2022-26", students: 48, submitted: false },
  { id: "s2", code: "CS502", name: "Database Management Systems", semester: 5, batch: "2022-26", students: 48, submitted: true },
  { id: "s3", code: "CS301", name: "Object Oriented Programming", semester: 3, batch: "2023-27", students: 52, submitted: false },
];

const students = [
  { id: "st1", name: "Aarav Mehta", roll: "CS21045", enrollment: "0175CS21045", theory: "", practical: "", internal: "", attendance: "" },
  { id: "st2", name: "Priya Sharma", roll: "CS21032", enrollment: "0175CS21032", theory: "", practical: "", internal: "", attendance: "" },
  { id: "st3", name: "Rohan Gupta", roll: "CS21019", enrollment: "0175CS21019", theory: "", practical: "", internal: "", attendance: "" },
  { id: "st4", name: "Sneha Patel", roll: "CS21007", enrollment: "0175CS21007", theory: "", practical: "", internal: "", attendance: "" },
  { id: "st5", name: "Karan Singh", roll: "CS21055", enrollment: "0175CS21055", theory: "", practical: "", internal: "", attendance: "" },
];

type MarkField = "theory" | "practical" | "internal" | "attendance";

const MAX_MARKS: Record<MarkField, number> = {
  theory: 70,
  practical: 30,
  internal: 30,
  attendance: 10,
};

export default function TeacherDashboard() {
  const [selectedSubject, setSelectedSubject] = useState<typeof assignedSubjects[0] | null>(null);
  const [marks, setMarks] = useState<Record<string, Record<MarkField, string>>>(
    Object.fromEntries(students.map((s) => [s.id, { theory: "", practical: "", internal: "", attendance: "" }]))
  );
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState<"subjects" | "entry">("subjects");

  const updateMark = (studentId: string, field: MarkField, value: string) => {
    const num = parseFloat(value);
    const max = MAX_MARKS[field];
    if (value !== "" && (isNaN(num) || num < 0 || num > max)) return;
    setMarks((prev) => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
  };

  const getTotal = (studentId: string) => {
    const m = marks[studentId];
    const vals = Object.values(m).map((v) => parseFloat(v) || 0);
    return vals.reduce((a, b) => a + b, 0);
  };

  const getGrade = (total: number) => {
    const maxTotal = Object.values(MAX_MARKS).reduce((a, b) => a + b, 0);
    const pct = (total / maxTotal) * 100;
    if (pct >= 90) return { grade: "O", gp: 10, color: "text-emerald-400" };
    if (pct >= 80) return { grade: "A+", gp: 9, color: "text-cyan-400" };
    if (pct >= 70) return { grade: "A", gp: 8, color: "text-blue-400" };
    if (pct >= 60) return { grade: "B+", gp: 7, color: "text-purple-400" };
    if (pct >= 50) return { grade: "B", gp: 6, color: "text-amber-400" };
    if (pct >= 40) return { grade: "C", gp: 5, color: "text-orange-400" };
    return { grade: "F", gp: 0, color: "text-rose-400" };
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  const handleSubmitToHOD = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSelectedSubject(null);
    setActiveView("subjects");
  };

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="TEACHER">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Computer Science & Engineering · Dr. Anil Kumar</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Assigned Subjects", value: "3", icon: <BookOpen className="w-5 h-5" />, color: "cyan", sub: "2 semesters" },
            { label: "Total Students", value: "148", icon: <Users className="w-5 h-5" />, color: "blue", sub: "Across subjects" },
            { label: "Marks Submitted", value: "1", icon: <CheckSquare className="w-5 h-5" />, color: "emerald", sub: "2 pending" },
            { label: "Draft Saved", value: "2", icon: <Save className="w-5 h-5" />, color: "amber", sub: "Unsent" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {(["subjects", "entry"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeView === tab
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "subjects" ? "My Subjects" : "Enter Marks"}
            </button>
          ))}
        </div>

        {/* SUBJECTS LIST */}
        {activeView === "subjects" && (
          <div className="space-y-4">
            {assignedSubjects.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 hover:-translate-y-0.5 transition-transform group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                          {subject.code}
                        </span>
                        {subject.submitted ? (
                          <span className="badge-approved"><CheckCircle2 className="w-3 h-3" />Submitted</span>
                        ) : (
                          <span className="badge-pending"><Clock className="w-3 h-3" />Pending</span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold mt-1">{subject.name}</h3>
                      <p className="text-slate-500 text-xs mt-1">
                        Semester {subject.semester} · Batch {subject.batch} · {subject.students} students
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedSubject(subject); setActiveView("entry"); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 transition-all flex-shrink-0"
                  >
                    {subject.submitted ? "View Marks" : "Enter Marks"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Bulk Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Bulk Marks Upload</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Upload marks for all students at once using a CSV/Excel template.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-all">
                      <Upload className="w-4 h-4" />
                      Upload CSV
                    </button>
                    <button className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                      Download template →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MARKS ENTRY */}
        {activeView === "entry" && (
          <div className="space-y-4">
            {/* Subject Info Bar */}
            {selectedSubject && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 flex items-center justify-between gap-4 flex-wrap"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400">{selectedSubject.code}</span>
                    <span className="text-white font-semibold">{selectedSubject.name}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Sem {selectedSubject.semester} · {selectedSubject.students} students · Max Marks: Theory 70 | Practical 30 | Internal 30 | Attendance 10
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    onClick={handleSubmitToHOD}
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? "Submitting..." : "Submit to HOD"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9"
                placeholder="Search student by name or roll number..."
              />
            </div>

            {/* Marks Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-x-auto"
            >
              <table className="data-table w-full min-w-[700px]">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th>Student</th>
                    <th>Roll No.</th>
                    <th className="text-center">Theory<br /><span className="font-normal normal-case text-slate-600">/70</span></th>
                    <th className="text-center">Practical<br /><span className="font-normal normal-case text-slate-600">/30</span></th>
                    <th className="text-center">Internal<br /><span className="font-normal normal-case text-slate-600">/30</span></th>
                    <th className="text-center">Attendance<br /><span className="font-normal normal-case text-slate-600">/10</span></th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, i) => {
                    const total = getTotal(student.id);
                    const { grade, color } = getGrade(total);
                    const studentMarks = marks[student.id];
                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group"
                      >
                        <td className="text-slate-600 text-xs font-mono">{i + 1}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {student.name[0]}
                            </div>
                            <span className="text-white text-sm font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="font-mono text-xs text-slate-400">{student.roll}</td>
                        {(["theory", "practical", "internal", "attendance"] as MarkField[]).map((field) => (
                          <td key={field} className="text-center">
                            <input
                              type="number"
                              value={studentMarks[field]}
                              onChange={(e) => updateMark(student.id, field, e.target.value)}
                              min={0}
                              max={MAX_MARKS[field]}
                              className="w-14 px-2 py-1.5 rounded-lg text-center text-sm text-white bg-white/[0.05] border border-white/[0.08] focus:outline-none focus:border-cyan-500/40 focus:bg-cyan-500/5 transition-all"
                              placeholder="—"
                            />
                          </td>
                        ))}
                        <td className="text-center">
                          <span className="text-white font-bold font-mono text-sm">
                            {total > 0 ? total : "—"}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={`font-bold text-sm ${total > 0 ? color : "text-slate-600"}`}>
                            {total > 0 ? grade : "—"}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

            {/* Grade Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
              {[
                { grade: "O", range: "≥90%", color: "text-emerald-400" },
                { grade: "A+", range: "80–89%", color: "text-cyan-400" },
                { grade: "A", range: "70–79%", color: "text-blue-400" },
                { grade: "B+", range: "60–69%", color: "text-purple-400" },
                { grade: "B", range: "50–59%", color: "text-amber-400" },
                { grade: "C", range: "40–49%", color: "text-orange-400" },
                { grade: "F", range: "<40%", color: "text-rose-400" },
              ].map((g) => (
                <div key={g.grade} className="flex items-center gap-1.5 text-slate-500">
                  <span className={`font-bold ${g.color}`}>{g.grade}</span>
                  <span>= {g.range}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
