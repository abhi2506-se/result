"use client";

// app/(dashboard)/student/results/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Filter, Search, TrendingUp, Award,
  ChevronDown, BarChart2, Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { ResultCard } from "@/components/dashboard/student/result-card";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import type { Result } from "@/types";

const mockResults: Result[] = [
  {
    id: "r1",
    studentId: "s1",
    sessionId: "sess1",
    semester: 5,
    examType: "PUT",
    status: "PASS",
    isPublished: true,
    publishedAt: new Date("2024-11-15"),
    sgpa: 8.3,
    percentage: 76.4,
    totalMarks: 420,
    maxMarks: 550,
    marks: [],
  },
  {
    id: "r2",
    studentId: "s1",
    sessionId: "sess1",
    semester: 5,
    examType: "SESSIONAL",
    status: "PASS",
    isPublished: true,
    publishedAt: new Date("2024-09-20"),
    sgpa: 8.1,
    percentage: 74.8,
    totalMarks: 180,
    maxMarks: 240,
    marks: [],
  },
  {
    id: "r3",
    studentId: "s1",
    sessionId: "sess0",
    semester: 4,
    examType: "PUT",
    status: "PASS",
    isPublished: true,
    publishedAt: new Date("2024-05-10"),
    sgpa: 8.5,
    percentage: 78.2,
    totalMarks: 430,
    maxMarks: 550,
    marks: [],
  },
  {
    id: "r4",
    studentId: "s1",
    sessionId: "sess0",
    semester: 4,
    examType: "SESSIONAL",
    status: "PASS",
    isPublished: true,
    publishedAt: new Date("2024-03-01"),
    sgpa: 8.2,
    percentage: 75.1,
    totalMarks: 187,
    maxMarks: 240,
    marks: [],
  },
];

const radarData = [
  { subject: "DSA", marks: 85 },
  { subject: "DBMS", marks: 74 },
  { subject: "CN", parts: 70, marks: 70 },
  { subject: "SE", marks: 65 },
  { subject: "OS", marks: 80 },
];

const semesters = [...new Set(mockResults.map((r) => r.semester))].sort((a, b) => b - a);

export default function StudentResultsPage() {
  const [filterSem, setFilterSem] = useState<number | "">("");
  const [filterType, setFilterType] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = mockResults.filter((r) => {
    const matchSem = filterSem === "" || r.semester === filterSem;
    const matchType = !filterType || r.examType === filterType;
    return matchSem && matchType;
  });

  const latestSGPA = mockResults.filter((r) => r.examType === "PUT").sort((a, b) => b.semester - a.semester)[0]?.sgpa ?? 0;
  const avgSGPA = (mockResults.filter((r) => r.examType === "PUT").reduce((a, b) => a + (b.sgpa ?? 0), 0) / mockResults.filter((r) => r.examType === "PUT").length).toFixed(2);

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">My Results</h1>
          <p className="text-slate-500 text-sm mt-1">All published academic results</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Latest SGPA", value: latestSGPA?.toFixed(2), icon: <TrendingUp className="w-5 h-5" />, color: "cyan" },
            { label: "Average SGPA", value: avgSGPA, icon: <BarChart2 className="w-5 h-5" />, color: "blue" },
            { label: "Results Available", value: mockResults.length.toString(), icon: <FileText className="w-5 h-5" />, color: "purple" },
            { label: "Semesters", value: semesters.length.toString(), icon: <Calendar className="w-5 h-5" />, color: "emerald" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                stat.color === "cyan" ? "bg-cyan-500/15 text-cyan-400" :
                stat.color === "blue" ? "bg-blue-500/15 text-blue-400" :
                stat.color === "purple" ? "bg-purple-500/15 text-purple-400" :
                "bg-emerald-500/15 text-emerald-400"
              }`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={filterSem}
                onChange={(e) => setFilterSem(e.target.value === "" ? "" : parseInt(e.target.value))}
                className="input-field py-2 w-auto"
              >
                <option value="">All Semesters</option>
                {semesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field py-2 w-auto"
              >
                <option value="">All Types</option>
                <option value="PUT">PUT</option>
                <option value="SESSIONAL">Sessional</option>
                <option value="INTERNAL">Internal</option>
              </select>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No results found for selected filters.</p>
              </div>
            ) : (
              filtered.map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ResultCard result={result} />
                </motion.div>
              ))
            )}
          </div>

          {/* Subject Performance Radar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-white font-semibold mb-1">Subject Performance</h2>
            <p className="text-slate-500 text-xs mb-4">Semester 5 PUT</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Radar
                  dataKey="marks"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,15,35,0.95)",
                    border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: "10px",
                    fontSize: 11,
                    color: "#e2e8f0",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Grade Summary */}
            <div className="mt-4 space-y-2">
              {[
                { sub: "DSA", grade: "A+", pct: 85 },
                { sub: "DBMS", grade: "A", pct: 74 },
                { sub: "CN", grade: "A", pct: 70 },
                { sub: "SE", grade: "B+", pct: 65 },
                { sub: "OS", grade: "A+", pct: 80 },
              ].map((item) => (
                <div key={item.sub} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-10">{item.sub}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 w-8 text-right">{item.grade}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
