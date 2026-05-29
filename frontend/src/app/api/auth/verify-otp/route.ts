// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, otpCodes } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { verifyOTP } from "@/lib/otp";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();
    const code = body.code?.trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be exactly 6 digits." },
        { status: 400 }
      );
    }

    // Find valid, unused, non-expired OTP
    const otpRows = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.used, false),
          gt(otpCodes.expiresAt, new Date())
        )
      )
      .orderBy(otpCodes.createdAt)
      .limit(1);

    if (otpRows.length === 0) {
      return NextResponse.json(
        { error: "Code expired or not found. Please request a new code." },
        { status: 400 }
      );
    }

    const otpRecord = otpRows[0];

    // Block after 5 wrong attempts
    if (otpRecord.attempts >= 5) {
      await db
        .update(otpCodes)
        .set({ used: true })
        .where(eq(otpCodes.id, otpRecord.id));
      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new code." },
        { status: 400 }
      );
    }

    // Verify the code
    const isValid = verifyOTP(code, otpRecord.code);

    if (!isValid) {
      // Increment attempts
      await db
        .update(otpCodes)
        .set({ attempts: otpRecord.attempts + 1 })
        .where(eq(otpCodes.id, otpRecord.id));

      const attemptsLeft = 4 - otpRecord.attempts;
      return NextResponse.json(
        {
          error: `Incorrect code. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
        },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db
      .update(otpCodes)
      .set({ used: true })
      .where(eq(otpCodes.id, otpRecord.id));

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true, email });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}