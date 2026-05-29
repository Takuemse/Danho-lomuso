// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, studentProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sanitizeInput } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, age, province, role, language } = body;

    // ── Validation ────────────────────────────────────────────────
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      return NextResponse.json({ error: "Invalid age." }, { status: 400 });
    }
    if (!province || typeof province !== "string") {
      return NextResponse.json({ error: "Province is required." }, { status: 400 });
    }

    const validRoles = ["student", "parent"];
    const validLanguages = ["en", "sn", "nd"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (!validLanguages.includes(language)) {
      return NextResponse.json({ error: "Invalid language." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = sanitizeInput(fullName.trim()).slice(0, 80);
    const cleanProvince = sanitizeInput(province.trim());

    // ── Check if email already exists ─────────────────────────────
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // ── Create user ────────────────────────────────────────────────
    const [newUser] = await db
      .insert(users)
      .values({
        email: cleanEmail,
        displayName: cleanName,
        role: role as "student" | "parent",
        language: language as "en" | "sn" | "nd",
        plan: "free",
        danhoPoints: 10, // welcome bonus
        chatTokensDaily: 20,
        chatTokensUsedToday: 0,
        isActive: true,
      })
      .returning({ id: users.id });

    // ── Create student profile ─────────────────────────────────────
    if (role === "student") {
      await db.insert(studentProfiles).values({
        userId: newUser.id,
        province: cleanProvince,
        onboardingComplete: false,
        profileCompletionPct: 25, // name + province already filled
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}