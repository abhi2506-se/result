"use client";

// app/(auth)/login/page.tsx
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { GraduationCap, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("All fields are required");
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      toast.success("Welcome back!");
      // Role-based redirect handled by middleware
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-blue w-96 h-96 fixed top-[-150px] right-[-100px] pointer-events-none" />
      <div className="orb orb-cyan w-80 h-80 fixed bottom-[-100px] left-[-80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ACEM Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Success alert */}
        {registered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Registration submitted! Please wait for HOD approval, then sign in.
          </motion.div>
        )}

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="yourname@acem.edu.in"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/2">
            <p className="text-xs text-slate-500 font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 font-mono text-xs">
              {[
                { role: "Admin", email: "admin@acem.edu.in" },
                { role: "HOD", email: "hod@acem.edu.in" },
                { role: "Teacher", email: "teacher@acem.edu.in" },
                { role: "Student", email: "student@acem.edu.in" },
              ].map((c) => (
                <div key={c.role} className="flex items-center justify-between">
                  <span className="text-slate-600">{c.role}:</span>
                  <button
                    type="button"
                    onClick={() => { setEmail(c.email); setPassword("Demo@1234"); }}
                    className="text-cyan-500/60 hover:text-cyan-400 transition-colors"
                  >
                    {c.email}
                  </button>
                </div>
              ))}
              <p className="text-slate-600 mt-1">Password: Demo@1234</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          New student?{" "}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
      <LoginForm />
    </Suspense>
  );
}
