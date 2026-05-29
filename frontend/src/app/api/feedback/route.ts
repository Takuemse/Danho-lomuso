// src/app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userFeedback, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { feedbackRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 6-hour cooldown
  const { success } = await feedbackRateLimit.limit(session.user.id);
  if (!success) return NextResponse.json({ error: "Feedback cooldown active (6 hours)" }, { status: 429 });

  const body = await req.json();
  const category = body.category ?? "general";
  const message = sanitizeInput(body.message ?? "");

  if (message.length < 10) {
    return NextResponse.json({ error: "Feedback too short" }, { status: 400 });
  }

  const validCategories = ["bug", "feature", "content", "general"];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  await db.insert(userFeedback).values({
    userId: session.user.id,
    category: category as "bug" | "feature" | "content" | "general",
    message,
    metadata: {
      userAgent: req.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    },
    pointsAwarded: 3,
  });

  // Award +3 Danho Points
  await db.update(users)
    .set({ danhoPoints: sql`${users.danhoPoints} + 3` })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true, pointsAwarded: 3 });
}