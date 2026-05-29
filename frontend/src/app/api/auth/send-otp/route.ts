// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, otpCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateOTP, hashOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/email";
import { authRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // ── Parse body ─────────────────────────────────────────────────
    let body: { email?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const email = body.email?.toLowerCase().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // ── Rate limit ─────────────────────────────────────────────────
    try {
      const { success } = await authRateLimit.limit(`otp:${email}`);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please wait before trying again." },
          { status: 429 }
        );
      }
    } catch (rateLimitErr) {
      // Rate limit failure is non-fatal — log and continue
      console.warn("Rate limit check failed (non-fatal):", rateLimitErr);
    }

    // ── Check user exists ──────────────────────────────────────────
    let userRows;
    try {
      userRows = await db
        .select({ id: users.id, displayName: users.displayName })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    } catch (dbErr) {
      console.error("DB error checking user:", dbErr);
      return NextResponse.json(
        { error: "Database error. Please check your connection." },
        { status: 500 }
      );
    }

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "No account found with this email. Please create an account first." },
        { status: 404 }
      );
    }

    const user = userRows[0];

    // ── Invalidate old OTPs ────────────────────────────────────────
    try {
      await db
        .update(otpCodes)
        .set({ used: true })
        .where(and(eq(otpCodes.email, email), eq(otpCodes.used, false)));
    } catch (otpErr) {
      console.warn("Could not invalidate old OTPs (non-fatal):", otpErr);
    }

    // ── Generate new OTP ───────────────────────────────────────────
    const plainOTP = generateOTP();
    const hashedOTP = hashOTP(plainOTP);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await db.insert(otpCodes).values({
        email,
        code: hashedOTP,
        expiresAt,
        used: false,
        attempts: 0,
      });
    } catch (insertErr) {
      console.error("DB error inserting OTP:", insertErr);
      return NextResponse.json(
        { error: "Could not generate verification code. Please try again." },
        { status: 500 }
      );
    }

    // ── Send email ─────────────────────────────────────────────────
    // In development, log the OTP to terminal so you can test without email
    if (process.env.NODE_ENV === "development") {
      console.log("─────────────────────────────────────");
      console.log(`📧 OTP for ${email}: ${plainOTP}`);
      console.log("─────────────────────────────────────");
    }

    const sent = await sendOTPEmail(email, plainOTP, user.displayName ?? undefined);

    if (!sent) {
      // Email failed but OTP is in DB — warn but don't block in dev
      console.error("Email send failed for:", email);
      if (process.env.NODE_ENV === "development") {
        // In dev, still succeed so you can use the terminal OTP
        return NextResponse.json({
          success: true,
          devNote: "Email failed but OTP is printed in your terminal.",
        });
      }
      return NextResponse.json(
        { error: "Failed to send email. Please check your Resend API key." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected send-otp error:", err);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}