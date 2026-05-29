"use client";

// app/(auth)/forgot-password/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@acem.edu.in") && !email.endsWith("@admin.acem.edu.in")) {
      setError("Please enter a valid ACEM college email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSent(true);
      else {
        const json = await res.json();
        setError(json.error ?? "Failed to send email.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-cyan w-96 h-96 fixed top-[-150px] right-[-100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ACEM Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-500 text-sm">Enter your college email to receive reset instructions</p>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Email Sent!</h2>
              <p className="text-slate-400 text-sm">
                If <span className="text-cyan-400 font-mono text-xs">{email}</span> is registered,
                you'll receive password reset instructions within a few minutes.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> College Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="input-field"
                  placeholder="yourname@acem.edu.in"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-slate-500 text-sm hover:text-slate-300 transition-colors mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
