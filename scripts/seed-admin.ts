/**
 * Seed script to create the initial admin user.
 *
 * Usage:
 *   1. Make sure DATABASE_URL is set in .env
 *   2. Run: npx prisma migrate dev
 *   3. Run: npx tsx scripts/seed-admin.ts
 *
 * Or change the email/password below before running.
 */

import { auth } from "../lib/auth";

async function main() {
  const email = "mail@thomascheiber.com";
  const password = "changeme123"; // Change this!
  const name = "Thomas Scheiber";

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    console.log("Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("⚠️  Please change the password after first login.");
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }

  process.exit(0);
}

main();
