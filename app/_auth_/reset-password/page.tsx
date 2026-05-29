"use client";

// app/(auth)/reset-password/page.tsx
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Lock, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) return setError("Password must contain an uppercase letter");
    if (!/[0-9]/.test(password)) return setError("Password must contain a number");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!token) return setError("Invalid or expired reset link");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-rose-400 mb-3">Invalid reset link</div>
        <Link href="/forgot-password" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> New Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="input-field pr-10"
              placeholder="Min 8 chars, uppercase, number"
              required
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            className="input-field"
            placeholder="Repeat your new password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Reset Password</>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-blue w-96 h-96 fixed top-[-100px] right-[-100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ACEM Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
          <p className="text-slate-500 text-sm">Choose a strong password for your account</p>
        </div>
        <Suspense fallback={<div className="glass-card p-8 animate-pulse h-60" />}>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center mt-4">
          <Link href="/login" className="text-slate-500 text-sm hover:text-cyan-400 transition-colors">← Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
