// src/db/index.ts
import "server-only"; // 👈 Safeguard: Completely isolates this Node module from Edge/Browser bundling
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ Missing DATABASE_URL environment variable.");
}

const pool = new Pool({
  connectionString,
  // Supabase cloud databases demand SSL even during local development
  ssl: { rejectUnauthorized: false }, 
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Slightly increased to allow stable handshake
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;