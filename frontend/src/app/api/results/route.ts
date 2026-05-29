// src/app/api/results/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { examResults, users, userMilestones } from "@/db/schema";
import { eq } from "drizzle-orm";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await apiRateLimit.limit(session.user.id);
  if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json();
  const { examBoard, level, year, results } = body;

  if (!Array.isArray(results) || results.length === 0) {
    return NextResponse.json({ error: "No results provided" }, { status: 400 });
  }

  await db.insert(examResults).values({
    userId: session.user.id,
    examBoard: examBoard === "cambridge" ? "cambridge" : "zimsec",
    examYear: year,
    examLevel: level,
    results,
  });

  // Award milestone points
  await db.update(users)
    .set({ danhoPoints: 5 })
    .where(eq(users.id, session.user.id));

  await db.insert(userMilestones).values({
    userId: session.user.id,
    milestoneKey: "results_added",
    titleEn: "Added Exam Results",
    pointsAwarded: 5,
  }).onConflictDoNothing();

  return NextResponse.json({ success: true });
}