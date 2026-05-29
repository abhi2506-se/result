"use client";

// app/(dashboard)/student/profile/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Hash, BookOpen, Building2, Calendar,
  Edit3, Save, Loader2, CheckCircle2, Clock, CornerUpLeft,
  XCircle, Upload, Camera,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const approvalSteps = [
  { label: "Submitted", status: "done" },
  { label: "HOD Review", status: "done" },
  { label: "Approved", status: "done" },
];

export default function StudentProfilePage() {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "Rahul Kumar Sharma",
    phone: "9123456789",
    enrollmentNumber: "0175CS21001",
    rollNumber: "CS21001",
    department: "Computer Science & Engineering",
    semester: "5",
    batch: "2022-26",
    email: "student@acem.edu.in",
  });

  const approvalStatus = "APPROVED"; // would come from session/API

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const statusConfig = {
    APPROVED: { badge: "badge-approved", icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "Approved" },
    PENDING: { badge: "badge-pending", icon: <Clock className="w-3.5 h-3.5" />, text: "Pending Approval" },
    SENT_BACK: { badge: "badge-sent-back", icon: <CornerUpLeft className="w-3.5 h-3.5" />, text: "Sent Back" },
    REJECTED: { badge: "badge-rejected", icon: <XCircle className="w-3.5 h-3.5" />, text: "Rejected" },
  }[approvalStatus];

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your account information</p>
          </div>
          <span className={statusConfig?.badge}>
            {statusConfig?.icon}
            {statusConfig?.text}
          </span>
        </div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-start gap-5 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                {form.name[0]}
              </div>
              {editing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#0a0f1e] border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{form.name}</h2>
              <p className="text-slate-500 text-sm">{form.email}</p>
              <p className="text-slate-600 text-xs mt-1">B.Tech · {form.department} · Semester {form.semester}</p>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", icon: <User className="w-3.5 h-3.5" />, editable: true },
              { key: "email", label: "College Email", icon: <Mail className="w-3.5 h-3.5" />, editable: false },
              { key: "phone", label: "Mobile Number", icon: <Phone className="w-3.5 h-3.5" />, editable: true },
              { key: "enrollmentNumber", label: "Enrollment Number", icon: <Hash className="w-3.5 h-3.5" />, editable: false },
              { key: "rollNumber", label: "Roll Number", icon: <Hash className="w-3.5 h-3.5" />, editable: false },
              { key: "department", label: "Department", icon: <Building2 className="w-3.5 h-3.5" />, editable: false },
              { key: "semester", label: "Current Semester", icon: <BookOpen className="w-3.5 h-3.5" />, editable: false },
              { key: "batch", label: "Batch", icon: <Calendar className="w-3.5 h-3.5" />, editable: false },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-slate-500 font-medium mb-1.5 flex items-center gap-1.5">
                  {field.icon}
                  {field.label}
                  {!field.editable && (
                    <span className="text-slate-700 text-xs">(locked)</span>
                  )}
                </label>
                {editing && field.editable ? (
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="input-field"
                  />
                ) : (
                  <div
                    className="px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: field.editable ? "#e2e8f0" : "#64748b",
                    }}
                  >
                    {form[field.key as keyof typeof form]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Approval Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-semibold mb-5">Registration Status</h2>
          <div className="flex items-center gap-0">
            {approvalSteps.map((step, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === "done"
                        ? "bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400"
                        : step.status === "active"
                        ? "bg-amber-500/20 border-2 border-amber-500/50 text-amber-400"
                        : "bg-white/5 border-2 border-white/10 text-slate-600"
                    }`}
                  >
                    {step.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : step.status === "active" ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center text-slate-500 whitespace-nowrap">{step.label}</span>
                </div>
                {i < approvalSteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-5 ${
                      approvalSteps[i + 1].status !== "pending" ? "bg-emerald-500/30" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 border border-rose-500/15"
          style={{ background: "rgba(244,63,94,0.03)" }}
        >
          <h3 className="text-rose-400 font-semibold text-sm mb-1">Account Actions</h3>
          <p className="text-slate-600 text-xs mb-4">
            These actions cannot be undone. Please be careful.
          </p>
          <button className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all">
            Request Account Deletion
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
