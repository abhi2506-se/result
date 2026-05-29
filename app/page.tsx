"use client";

// app/page.tsx - Landing Page
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap,
  Shield,
  BarChart3,
  Bell,
  FileCheck,
  Users,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Globe,
  Download,
} from "lucide-react";

const features = [
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Sessional & PUT Results",
    desc: "View all your exam results in one place with detailed subject-wise breakdown.",
    color: "cyan",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Role-Based Access",
    desc: "Four-tier RBAC system ensuring data privacy for students, teachers, HODs, and admin.",
    color: "blue",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "SGPA Analytics",
    desc: "Real-time SGPA calculations with semester-wise performance trends and graphs.",
    color: "purple",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Instant Notifications",
    desc: "Get notified the moment your results are published or approval status changes.",
    color: "emerald",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "PDF Marksheet",
    desc: "Download professional PDF marksheets with QR verification anytime.",
    color: "rose",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Multi-Department Support",
    desc: "Manage all departments, batches, sessions and subjects from one platform.",
    color: "amber",
  },
];

const stats = [
  { value: "5000+", label: "Students Enrolled" },
  { value: "50+", label: "Subjects Managed" },
  { value: "12+", label: "Departments" },
  { value: "99.9%", label: "Uptime Guarantee" },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "B.Tech CSE, 6th Sem",
    text: "Finally a portal that doesn't crash during result day. Clean, fast and I can download my marksheet instantly.",
    rating: 5,
    avatar: "RS",
  },
  {
    name: "Priya Verma",
    role: "HOD, Electronics Dept.",
    text: "Managing student approvals and publishing results has never been easier. The dashboard is intuitive.",
    rating: 5,
    avatar: "PV",
  },
  {
    name: "Dr. Anil Kumar",
    role: "Faculty, CS Department",
    text: "Bulk marks upload via CSV saves hours of work. The system validates everything automatically.",
    rating: 5,
    avatar: "AK",
  },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  rose: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c18] overflow-hidden">
      {/* === NAVBAR === */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div
          className="max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-6 py-3"
          style={{
            background: "rgba(10, 15, 35, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99, 179, 237, 0.1)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">ACEM</span>
              <span className="text-cyan-400 text-sm"> Result Portal</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Register
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="orb orb-cyan w-[600px] h-[600px] top-[-200px] left-[-200px]" />
        <div className="orb orb-blue w-[500px] h-[500px] top-[-100px] right-[-150px]" style={{ animationDelay: "-3s" }} />
        <div className="orb orb-purple w-[400px] h-[400px] bottom-[-100px] left-[30%]" style={{ animationDelay: "-1.5s" }} />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{
              background: "rgba(6, 182, 212, 0.1)",
              border: "1px solid rgba(6, 182, 212, 0.25)",
              color: "#67e8f9",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Official Portal · @acem.edu.in
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none"
          >
            <span className="text-white">Your Academic</span>
            <br />
            <span className="gradient-text">Results, Redefined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
          >
            The official Sessional & PUT result portal for ACEM. Secure, fast,
            and designed for every student, teacher, and administrator.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(99, 179, 237, 0.15)",
              }}
            >
              Sign In
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Security badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-12 text-xs text-slate-500"
          >
            {[
              { icon: <Lock className="w-3.5 h-3.5" />, text: "End-to-end Secure" },
              { icon: <Globe className="w-3.5 h-3.5" />, text: "College Domain Only" },
              { icon: <Zap className="w-3.5 h-3.5" />, text: "Real-time Updates" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-cyan-500">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === STATS === */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="text-3xl font-bold gradient-text-cyan mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need,{" "}
              <span className="gradient-text">nothing you don't.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built specifically for ACEM's academic workflow with enterprise-grade security and modern UX.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorMap[feature.color]}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === ROLES SECTION === */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Designed for <span className="gradient-text">every role</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                role: "Student",
                desc: "View results, download marksheets, track SGPA progress",
                items: ["View published results", "Download PDF marksheet", "Track SGPA history", "Real-time notifications"],
                gradient: "from-cyan-500/20 to-blue-500/10",
                border: "border-cyan-500/20",
                badge: "bg-cyan-500",
              },
              {
                role: "Teacher",
                desc: "Enter marks, bulk upload via CSV, submit to HOD",
                items: ["Enter subject marks", "Bulk CSV upload", "Draft save support", "View assigned subjects"],
                gradient: "from-blue-500/20 to-purple-500/10",
                border: "border-blue-500/20",
                badge: "bg-blue-500",
              },
              {
                role: "HOD",
                desc: "Approve students, verify marks, publish results",
                items: ["Approve student registrations", "Verify & publish results", "Assign teachers", "Department analytics"],
                gradient: "from-purple-500/20 to-rose-500/10",
                border: "border-purple-500/20",
                badge: "bg-purple-500",
              },
              {
                role: "Super Admin",
                desc: "Full system control, departments, users, logs",
                items: ["Manage all departments", "Assign HODs & teachers", "View system logs", "Full analytics access"],
                gradient: "from-rose-500/20 to-amber-500/10",
                border: "border-rose-500/20",
                badge: "bg-rose-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border ${item.border} overflow-hidden`}
                style={{ background: `linear-gradient(135deg, rgba(10,15,35,0.9), rgba(10,15,35,0.6))` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-30`} />
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.badge} mb-4`} />
                  <h3 className="text-lg font-bold text-white mb-1">{item.role}</h3>
                  <p className="text-slate-500 text-xs mb-4">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.items.map((point, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by <span className="gradient-text">ACEM community</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="orb orb-cyan w-64 h-64 top-[-50px] left-[-50px]" />
            <div className="orb orb-purple w-64 h-64 bottom-[-50px] right-[-50px]" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to check your results?
              </h2>
              <p className="text-slate-400 mb-8">
                Register with your ACEM college email to get started.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Register with @acem.edu.in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">
                ACEM Result Portal © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
              <Link href="/login" className="hover:text-cyan-400 transition-colors">Login</Link>
              <span>Only @acem.edu.in emails allowed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
