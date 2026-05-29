// src/app/api/analyze-results/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { analyzeExamResults } from "@/lib/zoe-ai";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await apiRateLimit.limit(`analyze:${session.user.id}`);
  if (!success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const body = await req.json();
  const { results } = body;

  if (!Array.isArray(results) || results.length === 0) {
    return NextResponse.json({ error: "No results provided" }, { status: 400 });
  }

  const userRows = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const user = userRows[0];
  const lang = (user?.language ?? "en") as "en" | "sn" | "nd";

  const analysis = await analyzeExamResults(results, lang);

  return NextResponse.json({ analysis });
}