import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { careerPaths } from "./schema";

// 1. Force the script to read the working DIRECT_URL (Port 5432)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ Error: Connection string missing from environment variables.");
  process.exit(1);
}

// 2. Open a direct, unpooled single-client lane ideal for standalone seed tasks
const client = postgres(connectionString, { max: 1 });
const directDb = drizzle(client);

const CAREER_SEED = [
  {
    slug: "software-engineering",
    titleEn: "Software Engineering",
    titleSn: "Kushanda Zvemacomputer",
    titleNd: "Ubunjiniyela Besofitiweyimu",
    descriptionEn: "Build apps, websites, and systems that power modern Zimbabwe.",
    descriptionSn: "Gadzira maapps, mawebsite, uye masistemu anofambisa Zimbabwe yanhasi.",
    category: "Technology",
    isVocational: false,
    partnerInstitutions: ["Uncommon.org", "HIT Harare", "Africa University"],
  },
  {
    slug: "nursing",
    titleEn: "Nursing & Healthcare",
    titleSn: "Kurapa nokurera Vanhu",
    titleNd: "Ukunakekelwa Kwezempilo",
    descriptionEn: "Care for Zimbabwe's communities through modern healthcare.",
    category: "Healthcare",
    isVocational: false,
    partnerInstitutions: ["University of Zimbabwe", "Parirenyatwa Group of Hospitals"],
  },
  {
    slug: "agricultural-entrepreneur",
    titleEn: "Agri-Entrepreneur",
    titleSn: "Murimi-Businessman",
    titleNd: "Umlimi-Umabhizinisi",
    descriptionEn: "Combine modern agribusiness skills with Zimbabwe's farming heritage.",
    category: "Agriculture",
    isVocational: true,
    partnerInstitutions: ["TOFARA Trust", "Midlands State University"],
  },
  {
    slug: "electrician",
    titleEn: "Electrician & Solar Tech",
    titleSn: "Muvezi weMotokari / Magetsi",
    titleNd: "Umakadebona / Iteknoloji Yegesi",
    descriptionEn: "Zimbabwe needs skilled electricians — especially in solar energy.",
    category: "Vocational Trades",
    isVocational: true,
    partnerInstitutions: ["Harare Polytechnic", "Bulawayo Polytechnic"],
  },
  {
    slug: "graphic-design",
    titleEn: "Graphic Design & Creative Arts",
    titleSn: "Kugadzira Mifananidzo",
    titleNd: "Ukudizayina Nemaciko",
    descriptionEn: "Build a creative career in branding, digital art, and design.",
    category: "Creative Economy",
    isVocational: false,
    partnerInstitutions: ["National University of Science and Technology"],
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
  },
];

async function seed() {
  console.log("🌱 Seeding career paths...");
  for (const path of CAREER_SEED) {
    // 3. Using our direct connection instance to run the insertions
    await directDb.insert(careerPaths).values(path).onConflictDoNothing();
  }
  console.log("✅ Career paths seeded successfully!");
  
  // 4. Safely disconnect the network port
  await client.end();
  process.exit(0);
}

seed().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});