// lib/auth.ts - NextAuth Configuration
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Role } from "@/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7 days
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            studentProfile: {
              include: { department: true, batch: true },
            },
            teacherProfile: {
              include: { department: true },
            },
            hodProfile: {
              include: { department: true },
            },
          },
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        // For students, check email verification and approval
        if (user.role === "STUDENT") {
          if (!user.emailVerified) {
            throw new Error("Please verify your email first.");
          }
          if (user.studentProfile?.approvalStatus !== "APPROVED") {
            throw new Error(
              user.studentProfile?.approvalStatus === "PENDING"
                ? "Your account is pending HOD approval."
                : user.studentProfile?.approvalStatus === "SENT_BACK"
                ? "Your registration was sent back. Please update and resubmit."
                : "Your account has been rejected. Contact your HOD."
            );
          }
        }

        // Log activity
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            details: { email: user.email },
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;
        token.emailVerified = (user as { emailVerified: boolean }).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
});

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: Role;
    emailVerified: boolean;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      emailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    emailVerified: boolean;
  }
}
