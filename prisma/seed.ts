// prisma/seed.ts - Database Seeder
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ================================
  // DEPARTMENTS
  // ================================
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "CSE" },
      update: {},
      create: {
        name: "Computer Science & Engineering",
        code: "CSE",
        description: "Department of Computer Science and Engineering",
      },
    }),
    prisma.department.upsert({
      where: { code: "ECE" },
      update: {},
      create: {
        name: "Electronics & Communication Engineering",
        code: "ECE",
        description: "Department of Electronics and Communication Engineering",
      },
    }),
    prisma.department.upsert({
      where: { code: "ME" },
      update: {},
      create: {
        name: "Mechanical Engineering",
        code: "ME",
        description: "Department of Mechanical Engineering",
      },
    }),
    prisma.department.upsert({
      where: { code: "CE" },
      update: {},
      create: {
        name: "Civil Engineering",
        code: "CE",
        description: "Department of Civil Engineering",
      },
    }),
  ]);
  console.log(`✅ Created ${departments.length} departments`);

  // ================================
  // SUPER ADMIN
  // ================================
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? "Admin@ACEM2024", 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL ?? "admin@acem.edu.in" },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME ?? "Super Administrator",
      email: process.env.SEED_ADMIN_EMAIL ?? "admin@acem.edu.in",
      password: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });
  console.log(`✅ Super Admin created: ${admin.email}`);

  // ================================
  // HODs
  // ================================
  const hodPassword = await bcrypt.hash("Demo@1234", 12);
  const hodUser = await prisma.user.upsert({
    where: { email: "hod@acem.edu.in" },
    update: {},
    create: {
      name: "Dr. Priya Sharma",
      email: "hod@acem.edu.in",
      password: hodPassword,
      role: "HOD",
      emailVerified: true,
      phone: "9876543210",
    },
  });

  await prisma.hOD.upsert({
    where: { userId: hodUser.id },
    update: {},
    create: {
      userId: hodUser.id,
      departmentId: departments[0].id, // CSE
      employeeId: "ACEM-HOD-001",
      designation: "Head of Department - CSE",
    },
  });
  console.log(`✅ HOD created: ${hodUser.email}`);

  // ================================
  // TEACHER
  // ================================
  const teacherPassword = await bcrypt.hash("Demo@1234", 12);
  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@acem.edu.in" },
    update: {},
    create: {
      name: "Dr. Anil Kumar",
      email: "teacher@acem.edu.in",
      password: teacherPassword,
      role: "TEACHER",
      emailVerified: true,
      phone: "9988776655",
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      departmentId: departments[0].id,
      employeeId: "ACEM-TCH-001",
      qualification: "PhD Computer Science",
      specialization: "Data Structures & Algorithms",
    },
  });
  console.log(`✅ Teacher created: ${teacherUser.email}`);

  // ================================
  // BATCH
  // ================================
  const batch = await prisma.batch.upsert({
    where: { name_departmentId: { name: "2022-26", departmentId: departments[0].id } },
    update: {},
    create: {
      name: "2022-26",
      year: 2022,
      departmentId: departments[0].id,
    },
  });

  // ================================
  // ACADEMIC SESSION
  // ================================
  const academicSession = await prisma.academicSession.create({
    data: {
      name: "2024-25 Odd Semester",
      startYear: 2024,
      endYear: 2025,
      isActive: true,
      batchId: batch.id,
    },
  }).catch(() => prisma.academicSession.findFirst({ where: { batchId: batch.id } }));

  // ================================
  // SUBJECTS
  // ================================
  const subjectData = [
    { name: "Data Structures & Algorithms", code: "CS501", credits: 4, maxTheory: 70, maxPractical: 30, maxInternal: 30, maxAttendance: 10 },
    { name: "Database Management Systems", code: "CS502", credits: 4, maxTheory: 70, maxPractical: 30, maxInternal: 30, maxAttendance: 10 },
    { name: "Computer Networks", code: "CS503", credits: 4, maxTheory: 70, maxPractical: 0, maxInternal: 30, maxAttendance: 10 },
    { name: "Software Engineering", code: "CS504", credits: 3, maxTheory: 70, maxPractical: 0, maxInternal: 30, maxAttendance: 10 },
    { name: "Operating Systems", code: "CS505", credits: 4, maxTheory: 70, maxPractical: 30, maxInternal: 30, maxAttendance: 10 },
  ];

  for (const sub of subjectData) {
    await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: {
        ...sub,
        departmentId: departments[0].id,
        semester: 5,
        type: sub.maxPractical > 0 ? "THEORY" : "THEORY",
      },
    });
  }
  console.log(`✅ Created ${subjectData.length} subjects`);

  // ================================
  // DEMO STUDENT
  // ================================
  const studentPassword = await bcrypt.hash("Demo@1234", 12);
  const studentUser = await prisma.user.upsert({
    where: { email: "student@acem.edu.in" },
    update: {},
    create: {
      name: "Rahul Kumar Sharma",
      email: "student@acem.edu.in",
      password: studentPassword,
      role: "STUDENT",
      emailVerified: true,
      phone: "9123456789",
    },
  });

  const studentProfile = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      enrollmentNumber: "0175CS21001",
      rollNumber: "CS21001",
      departmentId: departments[0].id,
      batchId: batch.id,
      semester: 5,
      currentSemester: 5,
      approvalStatus: "APPROVED",
      approvedAt: new Date(),
    },
  });
  console.log(`✅ Student created: ${studentUser.email}`);

  // ================================
  // DEMO RESULT WITH MARKS
  // ================================
  if (academicSession) {
    const result = await prisma.result.upsert({
      where: {
        studentId_sessionId_semester_examType: {
          studentId: studentProfile.id,
          sessionId: academicSession.id,
          semester: 5,
          examType: "PUT",
        },
      },
      update: {},
      create: {
        studentId: studentProfile.id,
        sessionId: academicSession.id,
        semester: 5,
        examType: "PUT",
        isPublished: true,
        publishedAt: new Date(),
        status: "PASS",
        sgpa: 8.3,
        percentage: 76.4,
        totalMarks: 420,
        maxMarks: 550,
      },
    });

    const subjects = await prisma.subject.findMany({ where: { departmentId: departments[0].id, semester: 5 } });
    const sampleMarks = [
      { theory: 58, practical: 25, internal: 24, attendance: 9 },
      { theory: 52, practical: 22, internal: 21, attendance: 8 },
      { theory: 48, practical: 0, internal: 22, attendance: 9 },
      { theory: 44, practical: 0, internal: 19, attendance: 8 },
      { theory: 50, practical: 20, internal: 20, attendance: 8 },
    ];

    for (let i = 0; i < Math.min(subjects.length, sampleMarks.length); i++) {
      const m = sampleMarks[i];
      const total = m.theory + m.practical + m.internal + m.attendance;
      const max = subjects[i].maxTheory + subjects[i].maxPractical + subjects[i].maxInternal + subjects[i].maxAttendance;
      const pct = (total / max) * 100;
      const grade = pct >= 80 ? "A+" : pct >= 70 ? "A" : pct >= 60 ? "B+" : pct >= 50 ? "B" : "C";
      const gp = pct >= 80 ? 9 : pct >= 70 ? 8 : pct >= 60 ? 7 : pct >= 50 ? 6 : 5;

      await prisma.marks.upsert({
        where: { resultId_subjectId: { resultId: result.id, subjectId: subjects[i].id } },
        update: {},
        create: {
          resultId: result.id,
          subjectId: subjects[i].id,
          theoryMarks: m.theory,
          practicalMarks: m.practical,
          internalMarks: m.internal,
          attendanceMarks: m.attendance,
          totalMarks: total,
          grade,
          gradePoints: gp,
          isPassed: true,
          isDraft: false,
        },
      });
    }
    console.log("✅ Demo result and marks seeded");
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("   Admin:   admin@acem.edu.in   / Admin@ACEM2024");
  console.log("   HOD:     hod@acem.edu.in     / Demo@1234");
  console.log("   Teacher: teacher@acem.edu.in / Demo@1234");
  console.log("   Student: student@acem.edu.in / Demo@1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
