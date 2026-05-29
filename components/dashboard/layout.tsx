"use client";

// components/dashboard/layout.tsx - Shared Dashboard Layout
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  GraduationCap, LayoutDashboard, FileText, Bell, Settings,
  LogOut, Menu, X, Users, BookOpen, Building2, BarChart3,
  CheckSquare, UserCheck, ChevronDown, Shield, Layers,
  ClipboardList, Upload, Eye,
} from "lucide-react";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navConfig: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Departments", href: "/admin/departments", icon: <Building2 className="w-4 h-4" /> },
    { label: "HODs", href: "/admin/hods", icon: <Shield className="w-4 h-4" /> },
    { label: "Teachers", href: "/admin/teachers", icon: <Users className="w-4 h-4" /> },
    { label: "Students", href: "/admin/students", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Results", href: "/admin/results", icon: <FileText className="w-4 h-4" /> },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Activity Logs", href: "/admin/logs", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ],
  HOD: [
    { label: "Dashboard", href: "/hod", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Approvals", href: "/hod/approvals", icon: <CheckSquare className="w-4 h-4" />, badge: 5 },
    { label: "Teachers", href: "/hod/teachers", icon: <Users className="w-4 h-4" /> },
    { label: "Students", href: "/hod/students", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Results", href: "/hod/results", icon: <FileText className="w-4 h-4" /> },
    { label: "Subjects", href: "/hod/subjects", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Analytics", href: "/hod/analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/teacher", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Subjects", href: "/teacher/subjects", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Enter Marks", href: "/teacher/marks", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Bulk Upload", href: "/teacher/upload", icon: <Upload className="w-4 h-4" /> },
    { label: "Students", href: "/teacher/students", icon: <Users className="w-4 h-4" /> },
    { label: "Submissions", href: "/teacher/submissions", icon: <CheckSquare className="w-4 h-4" /> },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "My Results", href: "/student/results", icon: <FileText className="w-4 h-4" /> },
    { label: "Marksheet", href: "/student/marksheet", icon: <Eye className="w-4 h-4" /> },
    { label: "Notifications", href: "/student/notifications", icon: <Bell className="w-4 h-4" />, badge: 1 },
    { label: "Profile", href: "/student/profile", icon: <UserCheck className="w-4 h-4" /> },
  ],
};

const roleColors: Record<Role, string> = {
  SUPER_ADMIN: "from-rose-500 to-amber-500",
  HOD: "from-purple-500 to-blue-500",
  TEACHER: "from-blue-500 to-cyan-500",
  STUDENT: "from-cyan-500 to-emerald-500",
};

const roleBadge: Record<Role, { text: string; color: string }> = {
  SUPER_ADMIN: { text: "Super Admin", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  HOD: { text: "HOD", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  TEACHER: { text: "Teacher", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  STUDENT: { text: "Student", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = navConfig[role];
  const badge = roleBadge[role];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {(sidebarOpen || mobileSidebar) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <div className="text-white font-bold text-sm leading-none">ACEM</div>
              <div className="text-cyan-400 text-xs">Result Portal</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}
          >
            {session?.user?.name?.[0] ?? "U"}
          </div>
          <AnimatePresence>
            {(sidebarOpen || mobileSidebar) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-white text-sm font-medium truncate">
                  {session?.user?.name ?? "User"}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border mt-0.5 ${badge.color}`}
                >
                  {badge.text}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebar(false)}
              className={`sidebar-link ${isActive ? "active" : ""} relative`}
            >
              {item.icon}
              <AnimatePresence>
                {(sidebarOpen || mobileSidebar) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && (sidebarOpen || mobileSidebar) && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
              {item.badge && !sidebarOpen && !mobileSidebar && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sidebar-link w-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {(sidebarOpen || mobileSidebar) && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#080c18] overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col flex-shrink-0 border-r border-white/[0.06] relative"
        style={{ background: "rgba(10, 15, 30, 0.8)" }}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#0a0f1e] border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors z-10"
        >
          {sidebarOpen ? (
            <ChevronDown className="w-3 h-3 rotate-90" />
          ) : (
            <ChevronDown className="w-3 h-3 -rotate-90" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 flex flex-col border-r border-white/[0.06] lg:hidden"
              style={{ background: "rgba(10, 15, 30, 0.98)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0"
          style={{ background: "rgba(10, 15, 30, 0.6)", backdropFilter: "blur(12px)" }}
        >
          <button
            onClick={() => setMobileSidebar(true)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:flex-none" />

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </button>
            <div
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white cursor-pointer"
            >
              {session?.user?.name?.[0] ?? "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
