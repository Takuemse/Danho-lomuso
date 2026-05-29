// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, studentProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sanitizeInput } from "@/lib/utils";
import { apiRateLimit } from "@/lib/rate-limit";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await apiRateLimit.limit(session.user.id);
  if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json();
  const { displayName, language, province, schoolName, examBoard, currentLevel, aspirations } = body;

  const validLanguages = ["en", "sn", "nd"];
  if (language && !validLanguages.includes(language)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  // Update user
  await db.update(users)
    .set({
      displayName: displayName ? sanitizeInput(displayName).slice(0, 60) : undefined,
      language: language ? language as "en" | "sn" | "nd" : undefined,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  // Upsert student profile
  const existingProfile = await db.select().from(studentProfiles)
    .where(eq(studentProfiles.userId, session.user.id)).limit(1);

  if (existingProfile.length > 0) {
    await db.update(studentProfiles)
      .set({
        province: province ? sanitizeInput(province) : undefined,
        schoolName: schoolName ? sanitizeInput(schoolName).slice(0, 100) : undefined,
        examBoard: examBoard as "zimsec" | "cambridge" | undefined,
        currentLevel: currentLevel ? sanitizeInput(currentLevel) : undefined,
        aspirations: aspirations ? sanitizeInput(aspirations).slice(0, 500) : undefined,
        profileCompletionPct: calculateCompletion({ province, schoolName, aspirations }),
        updatedAt: new Date(),
      })
      .where(eq(studentProfiles.userId, session.user.id));
  } else {
    await db.insert(studentProfiles).values({
      userId: session.user.id,
      province,
      schoolName,
      examBoard: examBoard as "zimsec" | "cambridge",
      currentLevel,
      aspirations,
      profileCompletionPct: calculateCompletion({ province, schoolName, aspirations }),
    });
  }

  return NextResponse.json({ success: true });
}

function calculateCompletion(data: { province?: string; schoolName?: string; aspirations?: string }): number {
  let score = 30; // base
  if (data.province) score += 20;
  if (data.schoolName) score += 20;
  if (data.aspirations && data.aspirations.length > 20) score += 30;
  return Math.min(100, score);
}