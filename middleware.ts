// middleware.ts - Route Protection & Role-Based Access Control
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Role } from "@/types";

// Route → allowed roles map
const routeRoles: Record<string, Role[]> = {
  "/admin": ["SUPER_ADMIN"],
  "/hod": ["HOD", "SUPER_ADMIN"],
  "/teacher": ["TEACHER", "HOD", "SUPER_ADMIN"],
  "/student": ["STUDENT"],
};

// Dashboard redirect per role
const roleDashboard: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  HOD: "/hod",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/contact",
];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public API routes and static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = await auth();

  // Redirect /dashboard → role-specific dashboard
  if (pathname === "/dashboard") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.redirect(
      new URL(roleDashboard[session.user.role as Role] ?? "/login", req.url)
    );
  }

  // If public route — allow, but redirect logged-in users away from auth pages
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (session && AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(
        new URL(roleDashboard[session.user.role as Role], req.url)
      );
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check email verification for students
  if (session.user.role === "STUDENT" && !session.user.emailVerified) {
    if (!pathname.startsWith("/verify-email") && !pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/verify-email?status=pending", req.url));
    }
  }

  // RBAC check
  for (const [routePrefix, allowedRoles] of Object.entries(routeRoles)) {
    if (pathname.startsWith(routePrefix)) {
      if (!allowedRoles.includes(session.user.role as Role)) {
        // Redirect to own dashboard instead of 403
        return NextResponse.redirect(
          new URL(roleDashboard[session.user.role as Role], req.url)
        );
      }
      break;
    }
  }

  // Rate limiting for API routes (basic)
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set("X-User-Id", session.user.id);
    response.headers.set("X-User-Role", session.user.role);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
