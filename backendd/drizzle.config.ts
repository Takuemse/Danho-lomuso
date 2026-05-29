// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const url = (process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "")
  .replace("?pgbouncer=true", "");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config;