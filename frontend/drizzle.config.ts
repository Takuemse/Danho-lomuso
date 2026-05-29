// drizzle.config.ts  — place this in your FRONTEND folder
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const rawUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
const url = rawUrl.replace("?pgbouncer=true", "");

if (!url) {
  throw new Error("No database URL found. Check .env.local in the frontend folder.");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config;