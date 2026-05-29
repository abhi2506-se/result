"use client";

// components/dashboard/stat-card.tsx
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "cyan" | "blue" | "purple" | "emerald" | "rose" | "amber";
  sub?: string;
  trend?: "up" | "down";
}

const colorStyles: Record<StatCardProps["color"], { icon: string; bg: string; glow: string }> = {
  cyan: {
    icon: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    bg: "from-cyan-500/5 to-transparent",
    glow: "rgba(6, 182, 212, 0.08)",
  },
  blue: {
    icon: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    bg: "from-blue-500/5 to-transparent",
    glow: "rgba(59, 130, 246, 0.08)",
  },
  purple: {
    icon: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    bg: "from-purple-500/5 to-transparent",
    glow: "rgba(139, 92, 246, 0.08)",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    bg: "from-emerald-500/5 to-transparent",
    glow: "rgba(16, 185, 129, 0.08)",
  },
  rose: {
    icon: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    bg: "from-rose-500/5 to-transparent",
    glow: "rgba(244, 63, 94, 0.08)",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    bg: "from-amber-500/5 to-transparent",
    glow: "rgba(245, 158, 11, 0.08)",
  },
};

export function StatCard({ label, value, icon, color, sub, trend }: StatCardProps) {
  const styles = colorStyles[color];
  return (
    <div
      className="glass-card p-5 hover:-translate-y-0.5 transition-transform"
      style={{ background: `radial-gradient(circle at top left, ${styles.glow}, transparent)` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${styles.icon}`}>
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              trend === "up"
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-rose-400 bg-rose-500/10"
            }`}
          >
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5 font-display">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
    </div>
  );
}
