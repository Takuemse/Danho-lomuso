// src/lib/otp.ts
import crypto from "crypto";

// Generate a secure 6-digit code
export function generateOTP(): string {
  // Use crypto for security — not Math.random()
  const buffer = crypto.randomBytes(3);
  const num = buffer.readUIntBE(0, 3) % 1000000;
  return num.toString().padStart(6, "0");
}

// Hash OTP before storing in DB — never store plain text
export function hashOTP(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

// Verify entered code against stored hash
export function verifyOTP(entered: string, storedHash: string): boolean {
  const enteredHash = hashOTP(entered);
  return crypto.timingSafeEqual(
    Buffer.from(enteredHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}