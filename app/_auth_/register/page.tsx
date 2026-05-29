"use client";

// app/(auth)/register/page.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap, Eye, EyeOff, User, Mail, Phone, Hash,
  BookOpen, Building2, Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const COLLEGE_DOMAIN = "@acem.edu.in";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Chemical Engineering",
];

const registerSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z
    .string()
    .email("Invalid email")
    .refine((v) => v.endsWith(COLLEGE_DOMAIN), {
      message: `Only ${COLLEGE_DOMAIN} emails are allowed`,
    }),
  enrollmentNumber: z.string().min(8, "Invalid enrollment number"),
  rollNumber: z.string().min(3, "Invalid roll number"),
  department: z.string().min(1, "Select a department"),
  semester: z.coerce.number().min(1).max(8),
  batch: z.string().min(4, "Batch is required (e.g. 2022-26)"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const steps = [
  { label: "Personal Info", icon: <User className="w-4 h-4" /> },
  { label: "Academic Info", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Set Password", icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const emailValue = watch("email") || "";
  const isValidDomain = emailValue.endsWith(COLLEGE_DOMAIN);

  const handleNext = async () => {
    const fields: Array<keyof RegisterForm>[] = [
      ["name", "email", "phone"],
      ["enrollmentNumber", "rollNumber", "department", "semester", "batch"],
      ["password", "confirmPassword"],
    ];
    const valid = await trigger(fields[step] as (keyof RegisterForm)[]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Registration failed");
      toast.success("Registration submitted! Awaiting HOD approval.");
      router.push("/login?registered=true");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4 py-16">
      {/* BG Effects */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="orb orb-cyan w-96 h-96 fixed top-[-100px] left-[-100px] pointer-events-none" />
      <div className="orb orb-purple w-80 h-80 fixed bottom-[-80px] right-[-80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ACEM Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">
            Only <span className="text-cyan-400 font-mono text-xs">@acem.edu.in</span> emails accepted
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  i === step
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : i < step
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/5 text-slate-500 border border-white/10"
                }`}
              >
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px ${i < step ? "bg-cyan-400/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* STEP 0 - Personal Info */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      {...register("name")}
                      className="input-field"
                      placeholder="Rahul Kumar Sharma"
                    />
                    {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> College Email
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        className="input-field pr-10"
                        placeholder="yourname@acem.edu.in"
                        type="email"
                      />
                      {emailValue && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isValidDomain ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-rose-400/20 flex items-center justify-center text-rose-400 text-xs">✕</span>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Mobile Number
                    </label>
                    <input
                      {...register("phone")}
                      className="input-field"
                      placeholder="9876543210"
                      type="tel"
                      maxLength={10}
                    />
                    {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* STEP 1 - Academic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" /> Enrollment No.
                      </label>
                      <input
                        {...register("enrollmentNumber")}
                        className="input-field"
                        placeholder="0175CS211001"
                      />
                      {errors.enrollmentNumber && (
                        <p className="text-rose-400 text-xs mt-1">{errors.enrollmentNumber.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" /> Roll Number
                      </label>
                      <input
                        {...register("rollNumber")}
                        className="input-field"
                        placeholder="CS21001"
                      />
                      {errors.rollNumber && (
                        <p className="text-rose-400 text-xs mt-1">{errors.rollNumber.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Department
                    </label>
                    <select {...register("department")} className="input-field">
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-rose-400 text-xs mt-1">{errors.department.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Semester
                      </label>
                      <select {...register("semester")} className="input-field">
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                      {errors.semester && (
                        <p className="text-rose-400 text-xs mt-1">{errors.semester.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5">
                        Batch
                      </label>
                      <input
                        {...register("batch")}
                        className="input-field"
                        placeholder="2022-26"
                      />
                      {errors.batch && (
                        <p className="text-rose-400 text-xs mt-1">{errors.batch.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 - Password */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPw ? "text" : "password"}
                        className="input-field pr-10"
                        placeholder="Min 8 chars, uppercase, number"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-medium mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        {...register("confirmPassword")}
                        type={showCpw ? "text" : "password"}
                        className="input-field pr-10"
                        placeholder="Repeat your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCpw(!showCpw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-amber-300/80 mt-2">
                    After registration, your account will be in{" "}
                    <span className="font-semibold">Pending</span> status until approved by your HOD.
                    You'll receive an email notification once approved.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2 ml-auto"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 ml-auto disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Submit Registration</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
