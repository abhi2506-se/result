"use client";

// app/(dashboard)/admin/departments/page.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Users, BookOpen, Shield,
  Edit3, Trash2, MoreHorizontal, CheckCircle2, X,
  Loader2, GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import toast from "react-hot-toast";

const mockDepartments = [
  { id: "d1", name: "Computer Science & Engineering", code: "CSE", students: 248, teachers: 12, hod: "Dr. Priya Sharma", isActive: true, subjects: 42 },
  { id: "d2", name: "Electronics & Communication Engineering", code: "ECE", students: 186, teachers: 9, hod: "Dr. Ramesh Patel", isActive: true, subjects: 38 },
  { id: "d3", name: "Mechanical Engineering", code: "ME", students: 142, teachers: 8, hod: "Prof. Suresh Kumar", isActive: true, subjects: 35 },
  { id: "d4", name: "Civil Engineering", code: "CE", students: 98, teachers: 6, hod: "Dr. Anita Verma", isActive: true, subjects: 30 },
  { id: "d5", name: "Electrical Engineering", code: "EE", students: 112, teachers: 7, hod: "Unassigned", isActive: false, subjects: 28 },
];

interface DeptForm { name: string; code: string; description: string; }

export default function AdminDepartmentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DeptForm>({ name: "", code: "", description: "" });

  const handleSubmit = async () => {
    if (!form.name || !form.code) return toast.error("Name and Code are required");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setShowModal(false);
    setForm({ name: "", code: "", description: "" });
    setEditId(null);
    toast.success(editId ? "Department updated!" : "Department created!");
  };

  const handleEdit = (dept: typeof mockDepartments[0]) => {
    setForm({ name: dept.name, code: dept.code, description: "" });
    setEditId(dept.id);
    setShowModal(true);
  };

  return (
    <DashboardLayout role="SUPER_ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Departments</h1>
            <p className="text-slate-500 text-sm mt-1">{mockDepartments.length} departments managed</p>
          </div>
          <button
            onClick={() => { setEditId(null); setForm({ name: "", code: "", description: "" }); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockDepartments.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-5 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">
                        {dept.code}
                      </span>
                      {!dept.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-sm mt-1 leading-snug">{dept.name}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: <GraduationCap className="w-3.5 h-3.5" />, value: dept.students, label: "Students" },
                  { icon: <Users className="w-3.5 h-3.5" />, value: dept.teachers, label: "Teachers" },
                  { icon: <BookOpen className="w-3.5 h-3.5" />, value: dept.subjects, label: "Subjects" },
                ].map((stat, j) => (
                  <div
                    key={j}
                    className="flex flex-col items-center p-2 rounded-xl text-center"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-slate-500 mb-1">{stat.icon}</span>
                    <span className="text-white font-bold text-sm">{stat.value}</span>
                    <span className="text-slate-600 text-xs">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* HOD */}
              <div className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-slate-500">HOD</span>
                </div>
                <span
                  className={`text-xs font-medium ${dept.hod === "Unassigned" ? "text-amber-400" : "text-white"}`}
                >
                  {dept.hod}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Add Department Placeholder */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mockDepartments.length * 0.06 }}
            onClick={() => { setEditId(null); setShowModal(true); }}
            className="glass-card p-5 border-dashed border-2 border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group flex flex-col items-center justify-center gap-3 min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-500/20 flex items-center justify-center transition-all">
              <Plus className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="text-slate-500 group-hover:text-slate-300 text-sm font-medium transition-colors">
              Add Department
            </span>
          </motion.button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative glass-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg">
                  {editId ? "Edit Department" : "Add New Department"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Department Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Department Code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="input-field font-mono"
                    placeholder="e.g. CSE"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="input-field resize-none"
                    rows={2}
                    placeholder="Brief description of the department..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> {editId ? "Update" : "Create"}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
