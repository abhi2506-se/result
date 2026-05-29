"use client";

// components/dashboard/student/result-card.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Download, Eye, CheckCircle2, XCircle,
  AlertCircle, FileText, TrendingUp, BarChart2,
} from "lucide-react";
import type { Result } from "@/types";

interface ResultCardProps {
  result: Result;
}

const mockMarks = [
  { subject: "Data Structures & Algorithms", code: "CS501", theory: 58, practical: 25, internal: 24, attendance: 9, total: 116, max: 140, grade: "A+", passed: true },
  { subject: "Database Management Systems", code: "CS502", theory: 52, practical: 22, internal: 21, attendance: 8, total: 103, max: 140, grade: "A", passed: true },
  { subject: "Computer Networks", code: "CS503", theory: 48, practical: 20, internal: 22, attendance: 9, total: 99, max: 140, grade: "B+", passed: true },
  { subject: "Software Engineering", code: "CS504", theory: 44, practical: 18, internal: 19, attendance: 8, total: 89, max: 140, grade: "B", passed: true },
];

const gradeColors: Record<string, string> = {
  "O": "text-emerald-400",
  "A+": "text-cyan-400",
  "A": "text-blue-400",
  "B+": "text-purple-400",
  "B": "text-amber-400",
  "C": "text-orange-400",
  "F": "text-rose-400",
};

export function ResultCard({ result }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDownloading(false);
  };

  const examTypeLabel = result.examType === "PUT" ? "PUT (University Theory)" : result.examType === "SESSIONAL" ? "Sessional" : "Internal Assessment";
  const statusLabel = result.status === "PASS" ? "PASS" : result.status === "FAIL" ? "FAIL" : "BACKLOG";

  return (
    <div className="glass-card overflow-hidden">
      {/* Card Header */}
      <div
        className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Exam Type Badge */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {examTypeLabel}
                </span>
                <span className="text-xs text-slate-500">Semester {result.semester}</span>
                {result.publishedAt && (
                  <span className="text-xs text-slate-600 font-mono">
                    {new Date(result.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
              <h3 className="text-white font-semibold mt-1.5">
                Semester {result.semester} Result
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                {result.totalMarks} / {result.maxMarks} marks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* SGPA */}
            <div className="text-right hidden sm:block">
              <div className="text-xl font-bold gradient-text-cyan">{result.sgpa?.toFixed(2)}</div>
              <div className="text-xs text-slate-500">SGPA</div>
            </div>

            {/* Status */}
            <div className={`${result.status === "PASS" ? "badge-approved" : "badge-rejected"}`}>
              {result.status === "PASS" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              {statusLabel}
            </div>

            {/* Expand */}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-slate-500" />
            </motion.div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Percentage", value: `${result.percentage?.toFixed(1)}%`, icon: <BarChart2 className="w-3.5 h-3.5" /> },
            { label: "SGPA", value: result.sgpa?.toFixed(2) ?? "—", icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { label: "Status", value: statusLabel, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-slate-500">{s.icon}</span>
              <div>
                <div className="text-slate-500">{s.label}</div>
                <div className="text-white font-bold font-mono">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Marks Table */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06]">
              {/* Subject-wise Marks Table */}
              <div className="overflow-x-auto">
                <table className="data-table w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Code</th>
                      <th className="text-center">Theory<br /><span className="normal-case font-normal text-slate-600">/70</span></th>
                      <th className="text-center">Practical<br /><span className="normal-case font-normal text-slate-600">/30</span></th>
                      <th className="text-center">Internal<br /><span className="normal-case font-normal text-slate-600">/30</span></th>
                      <th className="text-center">Attend.<br /><span className="normal-case font-normal text-slate-600">/10</span></th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Grade</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMarks.map((mark, i) => (
                      <tr key={i}>
                        <td className="text-white text-sm font-medium">{mark.subject}</td>
                        <td className="text-cyan-400 font-mono text-xs">{mark.code}</td>
                        <td className="text-center text-slate-300 font-mono text-sm">{mark.theory}</td>
                        <td className="text-center text-slate-300 font-mono text-sm">{mark.practical}</td>
                        <td className="text-center text-slate-300 font-mono text-sm">{mark.internal}</td>
                        <td className="text-center text-slate-300 font-mono text-sm">{mark.attendance}</td>
                        <td className="text-center">
                          <span className="text-white font-bold font-mono">{mark.total}</span>
                          <span className="text-slate-600 text-xs">/{mark.max}</span>
                        </td>
                        <td className="text-center">
                          <span className={`font-bold text-sm ${gradeColors[mark.grade] ?? "text-slate-400"}`}>
                            {mark.grade}
                          </span>
                        </td>
                        <td className="text-center">
                          {mark.passed ? (
                            <span className="badge-approved text-xs px-2 py-0.5">P</span>
                          ) : (
                            <span className="badge-rejected text-xs px-2 py-0.5">F</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>
                    Total:{" "}
                    <span className="text-white font-bold font-mono">{result.totalMarks}/{result.maxMarks}</span>
                  </span>
                  <span>
                    Percentage:{" "}
                    <span className="text-cyan-400 font-bold">{result.percentage?.toFixed(1)}%</span>
                  </span>
                  <span>
                    SGPA:{" "}
                    <span className="text-cyan-400 font-bold">{result.sgpa?.toFixed(2)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 transition-all disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloading ? "Generating PDF..." : "Download Marksheet"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
