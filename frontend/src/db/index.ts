// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Import every table individually — avoids undefined schema object
import {
  users,
  studentProfiles,
  examResults,
  otpCodes,
  zoeConversations,
  careerPaths,
  userMilestones,
  userFeedback,
  accounts,
  sessions,
  verificationTokens,
} from "./schema";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. " +
    "Set DIRECT_URL or DATABASE_URL in .env.local and restart the server."
  );
}

// Always strip pgbouncer — Drizzle needs a direct TCP connection
const cleanUrl = connectionString.replace("?pgbouncer=true", "");

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
});

pool.on("error", (err) => {
  console.error("❌ DB pool error:", err.message);
});

// Explicitly pass every table — no wildcard spread
export const db = drizzle(pool, {
  schema: {
    users,
    studentProfiles,
    examResults,
    otpCodes,
    zoeConversations,
    careerPaths,
    userMilestones,
    userFeedback,
    accounts,
    sessions,
    verificationTokens,
  },
});

export type DB = typeof db;