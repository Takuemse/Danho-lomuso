// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { askZoe } from "@/lib/zoe-ai";
import { chatRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await chatRateLimit.limit(session.user.id);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message = sanitizeInput(body.message ?? "");
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    const user = userRows[0];
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const tokensLeft = user.chatTokensDaily - user.chatTokensUsedToday;
    if (tokensLeft <= 0 && user.plan === "free") {
      return NextResponse.json(
        {
          error: "Daily chat tokens exhausted. Earn more Danho Points to unlock more!",
          tokensExhausted: true,
        },
        { status: 403 }
      );
    }

    const response = await askZoe(
      message,
      history,
      (user.language as "en" | "sn" | "nd") ?? "en",
      user.displayName ?? undefined
    );

    await db
      .update(users)
      .set({ chatTokensUsedToday: sql`${users.chatTokensUsedToday} + 1` })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      response,
      tokensLeft: tokensLeft - 1,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}