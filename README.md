# 🎓 ACEM College Result Portal

> Production-ready Full Stack College Sessional & PUT Result Portal for Azad College of Engineering & Management

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?logo=postgresql)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | Login, Register, Email Verification, Forgot/Reset Password |
| 👥 **4 User Roles** | Super Admin, HOD, Teacher, Student |
| ✅ **HOD Approval** | Approve / Send Back / Reject student registrations with email |
| 📊 **Result Management** | Sessional, PUT, Internal marks with SGPA auto-calculation |
| 📄 **PDF Marksheets** | Downloadable professional marksheets with QR verification |
| 📧 **Email Notifications** | Branded HTML emails for all major events |
| 🔔 **Real-time Notifications** | In-app + push notifications (Pusher) |
| 🏛️ **Department Management** | Departments, HODs, Teachers, Batches, Sessions |
| 📈 **Analytics Dashboard** | Charts, trends, SGPA history, pass/fail stats |
| 🌓 **Dark Mode** | Fully dark-themed premium UI |
| 📱 **Responsive** | Mobile-first responsive design |
| 🔒 **Security** | RBAC, CSRF, XSS protection, rate limiting |

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript 5.7
- Tailwind CSS 3
- Framer Motion
- Recharts (analytics)
- Lucide React Icons
- React Hook Form + Zod

**Backend:**
- Next.js Server Actions & API Routes
- Prisma ORM 5
- PostgreSQL (Neon/Supabase)
- NextAuth / Auth.js v5
- bcryptjs (password hashing)
- Nodemailer / Resend (emails)

**Infrastructure:**
- Vercel (deployment)
- Neon / Supabase (PostgreSQL)
- UploadThing (file uploads)
- Pusher (real-time)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- SMTP credentials (Gmail App Password)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/college-result-portal.git
cd college-result-portal
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — random 32-char string (`openssl rand -base64 32`)
- `SMTP_*` — your email credentials

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@acem.edu.in | Admin@ACEM2024 |
| HOD | hod@acem.edu.in | Demo@1234 |
| Teacher | teacher@acem.edu.in | Demo@1234 |
| Student | student@acem.edu.in | Demo@1234 |

---

## 📁 Project Structure

```
college-result-portal/
├── app/
│   ├── (auth)/                     # Login, Register, Forgot Password
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/                # Protected dashboards
│   │   ├── admin/                  # Super Admin pages
│   │   │   ├── departments/
│   │   │   ├── teachers/
│   │   │   ├── students/
│   │   │   └── logs/
│   │   ├── hod/                    # HOD pages
│   │   │   ├── approvals/
│   │   │   ├── results/
│   │   │   └── teachers/
│   │   ├── teacher/                # Teacher pages
│   │   │   ├── marks/
│   │   │   ├── subjects/
│   │   │   └── upload/
│   │   └── student/                # Student pages
│   │       ├── results/
│   │       ├── marksheet/
│   │       └── profile/
│   ├── api/                        # API Routes
│   │   ├── auth/                   # NextAuth + register + forgot
│   │   ├── results/                # Results CRUD + publish
│   │   ├── marks/                  # Marks entry
│   │   ├── hod/                    # HOD approvals
│   │   ├── admin/                  # Admin management
│   │   └── notifications/          # Notifications
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   └── globals.css
├── components/
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + topbar
│   │   ├── stat-card.tsx           # Reusable stat card
│   │   ├── student/
│   │   │   └── result-card.tsx
│   │   ├── hod/
│   │   └── admin/
│   └── shared/
│       ├── auth-provider.tsx
│       └── theme-provider.tsx
├── lib/
│   ├── auth.ts                     # NextAuth config
│   ├── prisma.ts                   # Prisma client
│   ├── email.ts                    # Email service + templates
│   └── validators/                 # Zod schemas
├── prisma/
│   ├── schema.prisma               # Full DB schema
│   └── seed.ts                     # Database seeder
├── types/
│   └── index.ts                    # Centralized TypeScript types
├── middleware.ts                   # Route protection + RBAC
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

---

## 🔐 User Workflow

### Student Registration Flow
```
Student registers → Email verification → Pending status
    → HOD reviews → Approve / Send Back / Reject
    → Student notified via email + in-app notification
    → If Approved: Student can access results dashboard
    → If Sent Back: Student edits → Resubmits
    → If Rejected: Contact HOD message
```

### Result Publication Flow
```
Teacher logs in → Selects assigned subject → Enters marks
    → Saves as draft (auto-calculated) → Submits to HOD
    → HOD reviews → Approves → Publishes
    → All enrolled students notified via email + push
    → Students view published results + download PDF
```

---

## 🌐 Deployment (Vercel)

### 1. Create Neon Database
- Go to [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string

### 2. Deploy to Vercel
```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel and set environment variables.

### 3. Environment Variables on Vercel
Add all variables from `.env.example` to your Vercel project settings.

### 4. Run migrations on production
```bash
# Run after deploying
npm run db:migrate:prod
npm run db:seed
```

---

## 📧 Email Setup (Gmail)

1. Go to Google Account → Security → 2-Step Verification (enable)
2. Go to App Passwords → Select "Mail" → Generate
3. Copy the 16-char password to `SMTP_PASS` in `.env.local`

---

## 🛡️ Security Features

- **RBAC**: Route-level and API-level role checks
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Sessions**: Secure HttpOnly cookie sessions
- **Email Domain Restriction**: Only `@acem.edu.in` allowed
- **CSRF Protection**: Built-in via NextAuth
- **SQL Injection**: Prevented by Prisma ORM parameterized queries
- **XSS Protection**: CSP headers configured
- **Rate Limiting**: Applied to auth routes
- **Audit Logs**: Every significant action is logged

---

## 📊 Grade Calculation

| Grade | Range | Grade Points |
|-------|-------|--------------|
| O | ≥ 90% | 10 |
| A+ | 80-89% | 9 |
| A | 70-79% | 8 |
| B+ | 60-69% | 7 |
| B | 50-59% | 6 |
| C | 40-49% | 5 |
| F | < 40% | 0 |

**SGPA** = Σ(Grade Points × Credits) / Σ(Credits)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed for use by ACEM (Azad College of Engineering & Management). 
Unauthorized redistribution is prohibited.

---

**Built with ❤️ for ACEM Students**
