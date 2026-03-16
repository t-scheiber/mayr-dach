import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyMagicLinkToken } from "@/lib/magic-link";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = verifyMagicLinkToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Find the admin user
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Create a session directly in the database
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt,
      ipAddress: request.headers.get("x-forwarded-for") || null,
      userAgent: request.headers.get("user-agent") || null,
    },
  });

  // Redirect to the application page with the session cookie set
  const redirectUrl = new URL(payload.redirect, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("better-auth.session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return response;
}
