"use client";

// app/(dashboard)/hod/results/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Send, Eye, CheckCircle2, Clock, Filter,
  Search, AlertCircle, BarChart2, Users, BookOpen,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import toast from "react-hot-toast";

const pendingResults = [
  {
    id: "r1",
    semester: 5,
    examType: "PUT",
    session: "2024-25 Odd",
    dept: "CSE",
    batch: "2022-26",
    totalStudents: 48,
    marksEntered: 48,
    submittedBy: "Dr. Anil Kumar",
    submittedAt: "2024-11-10",
    status: "PENDING_REVIEW",
  },
  {
    id: "r2",
    semester: 5,
    examType: "SESSIONAL",
    session: "2024-25 Odd",
    dept: "CSE",
    batch: "2022-26",
    totalStudents: 48,
    marksEntered: 45,
    submittedBy: "Dr. Meena Joshi",
    submittedAt: "2024-09-15",
    status: "DRAFT",
  },
  {
    id: "r3",
    semester: 3,
    examType: "PUT",
    session: "2024-25 Odd",
    dept: "CSE",
    batch: "2023-27",
    totalStudents: 52,
    marksEntered: 52,
    submittedBy: "Prof. Ravi Singh",
    submittedAt: "2024-11-12",
    status: "PENDING_REVIEW",
  },
];

const publishedResults = [
  {
    id: "p1",
    semester: 4,
    examType: "PUT",
    session: "2023-24 Even",
    dept: "CSE",
    publishedAt: "2024-06-15",
    passRate: 87,
    avgSGPA: 7.9,
  },
  {
    id: "p2",
    semester: 4,
    examType: "SESSIONAL",
    session: "2023-24 Even",
    dept: "CSE",
    publishedAt: "2024-03-20",
    passRate: 91,
    avgSGPA: 8.1,
  },
];

export default function HODResultsPage() {
  const [publishing, setPublishing] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "published">("pending");
  const [search, setSearch] = useState("");

  const handlePublish = async (resultId: string) => {
    setPublishing(resultId);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      // In real app: POST /api/results/${resultId}/publish
      toast.success("Result published! Students have been notified via email.");
    } catch {
      toast.error("Failed to publish result.");
    } finally {
      setPublishing(null);
    }
  };

  const filteredPending = pendingResults.filter(
    (r) => !search || r.examType.toLowerCase().includes(search.toLowerCase()) || r.session.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="HOD">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Result Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review and publish exam results for your department</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending Review", value: pendingResults.filter((r) => r.status === "PENDING_REVIEW").length.toString(), icon: <Clock className="w-5 h-5" />, color: "amber" },
            { label: "Published", value: publishedResults.length.toString(), icon: <CheckCircle2 className="w-5 h-5" />, color: "emerald" },
            { label: "Avg Pass Rate", value: "89%", icon: <BarChart2 className="w-5 h-5" />, color: "cyan" },
            { label: "Students Affected", value: "248", icon: <Users className="w-5 h-5" />, color: "blue" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                s.color === "amber" ? "bg-amber-500/15 text-amber-400" :
                s.color === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
                s.color === "cyan" ? "bg-cyan-500/15 text-cyan-400" :
                "bg-blue-500/15 text-blue-400"
              }`}>
                {s.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {(["pending", "published"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "pending" ? `Pending Review (${pendingResults.length})` : `Published (${publishedResults.length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5"
            placeholder="Search by exam type or session..."
          />
        </div>

        {/* Pending Results */}
        {tab === "pending" && (
          <div className="space-y-4">
            {filteredPending.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                          {result.examType}
                        </span>
                        <span className="text-xs text-slate-500">Semester {result.semester}</span>
                        <span className="text-xs text-slate-600 font-mono">{result.session}</span>
                        {result.status === "PENDING_REVIEW" ? (
                          <span className="badge-pending text-xs"><Clock className="w-3 h-3" />Pending Review</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">Draft</span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold mt-1">
                        Semester {result.semester} · {result.dept} · Batch {result.batch}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>Submitted by: <span className="text-slate-400">{result.submittedBy}</span></span>
                        <span>Date: <span className="text-slate-400 font-mono">{result.submittedAt}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-1">
                        Marks: <span className="text-white font-bold">{result.marksEntered}/{result.totalStudents}</span>
                      </div>
                      <div className="w-32 h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${(result.marksEntered / result.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>

                    {result.status === "PENDING_REVIEW" && result.marksEntered === result.totalStudents && (
                      <button
                        onClick={() => handlePublish(result.id)}
                        disabled={publishing === result.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {publishing === result.id ? "Publishing..." : "Publish Result"}
                      </button>
                    )}

                    {result.marksEntered < result.totalStudents && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {result.totalStudents - result.marksEntered} marks missing
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Published Results */}
        {tab === "published" && (
          <div className="glass-card divide-y divide-white/[0.04]">
            {publishedResults.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between gap-4 p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      Semester {result.semester} {result.examType} · {result.dept}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Session: {result.session} · Published: {new Date(result.publishedAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center hidden sm:block">
                    <div className="text-white font-bold">{result.passRate}%</div>
                    <div className="text-slate-600">Pass Rate</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="text-cyan-400 font-bold">{result.avgSGPA}</div>
                    <div className="text-slate-600">Avg SGPA</div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
