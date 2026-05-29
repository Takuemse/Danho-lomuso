// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Extract the core handlers from Auth.js
const { GET: authGET, POST: authPOST } = handlers;

// ✅ FIXED: Instantly satisfies email security scanners (like Outlook/Defender) 
// without letting them silently consume and expire your magic link tokens.
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

// Export the handlers under their strict HTTP method names
export { authGET as GET, authPOST as POST };