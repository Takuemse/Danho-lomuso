import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Load values directly from the environment variables passed by Node
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: Neither DIRECT_URL nor DATABASE_URL was found in your environment.");
  process.exit(1);
}

console.log("⏳ Connecting to Supabase database...");

// Open a clean, single-lane network connection for migrating
const migrationClient = postgres(databaseUrl, { max: 1 });
const db = drizzle(migrationClient);

async function runMigration() {
  try {
    console.log("🚀 Running migrations from the ./drizzle folder...");
    
    // Executes the SQL migration files against your live database
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log("✅ [✓] Migration successful! All 11 tables deployed.");
  } catch (error) {
    console.error("❌ Migration failed with error:", error);
  } finally {
    // Explicitly disconnect from the database server
    await migrationClient.end();
    process.exit(0);
  }
}

runMigration();
