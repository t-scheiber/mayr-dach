/**
 * Seed script to create the initial admin user (passwordless / email OTP).
 *
 * Usage:
 *   1. Make sure DATABASE_URL is set in .env
 *   2. Run: npx prisma migrate dev
 *   3. Run: npx tsx scripts/seed-admin.ts
 */

import { prisma } from "../lib/db";

async function main() {
  const email = "office@mayr-dach.com";
  const name = "Mayr Dach Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    process.exit(0);
  }

  await prisma.user.create({
    data: {
      email,
      name,
      emailVerified: true,
      role: "admin",
    },
  });

  console.log("Admin user created successfully!");
  console.log(`Email: ${email}`);
  console.log("Login via one-time code sent to this email address.");

  process.exit(0);
}

main();
