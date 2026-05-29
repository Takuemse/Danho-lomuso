// src/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { careerPaths } from "./schema";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Connect directly — bypass pgbouncer
const rawUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
const url = rawUrl.replace("?pgbouncer=true", "");

const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool);

const CAREERS = [
  {
    slug: "software-engineering",
    titleEn: "Software Engineering",
    titleSn: "Kushanda Zvemacomputer",
    titleNd: "Ubunjiniyela Besofitiweyimu",
    descriptionEn: "Build apps, websites, and systems that power modern Zimbabwe.",
    category: "Technology",
    isVocational: false,
    partnerInstitutions: ["Uncommon.org", "HIT Harare", "Africa University"],
    isActive: true,
  },
  {
    slug: "nursing",
    titleEn: "Nursing & Healthcare",
    titleSn: "Kurapa nokurera Vanhu",
    titleNd: "Ukunakekelwa Kwezempilo",
    descriptionEn: "Care for Zimbabwe's communities through modern healthcare.",
    category: "Healthcare",
    isVocational: false,
    partnerInstitutions: ["University of Zimbabwe", "Parirenyatwa Hospital"],
    isActive: true,
  },
  {
    slug: "agricultural-entrepreneur",
    titleEn: "Agri-Entrepreneur",
    titleSn: "Murimi-Businessman",
    titleNd: "Umlimi-Umabhizinisi",
    descriptionEn: "Combine agribusiness skills with Zimbabwe's rich farming heritage.",
    category: "Agriculture",
    isVocational: true,
    partnerInstitutions: ["TOFARA Trust", "Midlands State University"],
    isActive: true,
  },
  {
    slug: "electrician-solar",
    titleEn: "Electrician & Solar Tech",
    titleSn: "Muvezi weMotokari / Magetsi",
    titleNd: "Umakadebona / Solar Tech",
    descriptionEn: "Zimbabwe needs skilled electricians — especially in solar energy.",
    category: "Vocational Trades",
    isVocational: true,
    partnerInstitutions: ["Harare Polytechnic", "Bulawayo Polytechnic"],
    isActive: true,
  },
  {
    slug: "graphic-design",
    titleEn: "Graphic Design & Creative Arts",
    titleSn: "Kugadzira Mifananidzo",
    titleNd: "Ukudizayina Nemaciko",
    descriptionEn: "Build a creative career in branding, digital art, and design.",
    category: "Creative Economy",
    isVocational: false,
    partnerInstitutions: ["NUST", "Harare Polytechnic"],
    isActive: true,
  },
  {
    slug: "accounting-finance",
    titleEn: "Accounting & Finance",
    titleSn: "Kuona Mari neHurumende",
    titleNd: "Ezezimali neZezezimali",
    descriptionEn: "Manage finances for businesses, NGOs, and government institutions.",
    category: "Business",
    isVocational: false,
    partnerInstitutions: ["University of Zimbabwe", "MSU", "ACCA Zimbabwe"],
    isActive: true,
  },
  {
    slug: "teaching",
    titleEn: "Teaching & Education",
    titleSn: "Kudzidzisa",
    titleNd: "Ukufundisa",
    descriptionEn: "Shape the next generation of Zimbabwean students.",
    category: "Education",
    isVocational: false,
    partnerInstitutions: ["Bindura University", "MSU", "UZ"],
    isActive: true,
  },
  {
    slug: "plumbing-construction",
    titleEn: "Plumbing & Construction",
    titleSn: "Kuvaka nePombi",
    titleNd: "Ukwakha noAmapayipi",
    descriptionEn: "Essential trade skills always in demand across Zimbabwe.",
    category: "Vocational Trades",
    isVocational: true,
    partnerInstitutions: ["Harare Polytechnic", "Mutare Polytechnic"],
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding career paths...");
  let inserted = 0;
  let skipped = 0;

  for (const career of CAREERS) {
    try {
      await db
        .insert(careerPaths)
        .values(career)
        .onConflictDoNothing();
      inserted++;
      console.log(`  ✅ ${career.titleEn}`);
    } catch (err) {
      skipped++;
      console.log(`  ⏭  Skipped (already exists): ${career.titleEn}`);
    }
  }

  console.log(`\n✅ Done! ${inserted} inserted, ${skipped} skipped.`);
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});