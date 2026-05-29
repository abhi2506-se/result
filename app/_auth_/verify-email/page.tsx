"use client";

// app/(auth)/verify-email/page.tsx
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GraduationCap, CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const status = searchParams.get("status");

  const [verifying, setVerifying] = useState(!!token);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const json = await res.json();
        if (res.ok) setSuccess(true);
        else setError(json.error ?? "Verification failed");
      } catch {
        setError("Something went wrong");
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [token]);

  // Pending status (after registration, before verification)
  if (status === "pending" || !token) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Check your email</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          We sent a verification link to your ACEM college email.
          Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-slate-600 text-xs mt-4">
          After verification, your account will go to HOD for approval.
        </p>
        <Link href="/login" className="inline-block mt-5 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
          ← Back to Login
        </Link>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Verifying your email...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="glass-card p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
        </motion.div>
        <h2 className="text-white font-bold text-lg mb-2">Email Verified!</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-2">
          Your email has been verified successfully.
        </p>
        <p className="text-slate-500 text-xs">
          Your registration is now pending HOD approval. You'll be notified via email once approved.
        </p>
        <Link
          href="/login"
          className="inline-block mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-rose-400" />
      </div>
      <h2 className="text-white font-bold text-lg mb-2">Verification Failed</h2>
      <p className="text-slate-400 text-sm mb-4">{error}</p>
      <Link href="/register" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
        Register again →
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4">
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-cyan w-80 h-80 fixed top-[-100px] left-[-80px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ACEM Portal</span>
          </div>
        </div>
        <Suspense fallback={<div className="glass-card p-8 h-48 animate-pulse" />}>
          <VerifyEmailContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
