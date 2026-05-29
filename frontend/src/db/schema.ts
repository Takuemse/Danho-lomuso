// src/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

// ── ENUMS ─────────────────────────────────────────────────────────────────────
export const userRoleEnum    = pgEnum("user_role", ["student", "parent", "admin", "partner"]);
export const languageEnum    = pgEnum("language", ["en", "sn", "nd"]);
export const examBoardEnum   = pgEnum("exam_board", ["zimsec", "cambridge"]);
export const planEnum        = pgEnum("plan", ["free", "premium", "enterprise"]);
export const feedbackCatEnum = pgEnum("feedback_category", ["bug", "feature", "content", "general"]);

// ── USERS ─────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:                  uuid("id").defaultRandom().primaryKey(),
  email:               text("email").unique(),
  phoneEncrypted:      text("phone_encrypted"),
  nameEncrypted:       text("name_encrypted"),
  displayName:         text("display_name"),
  avatarUrl:           text("avatar_url"),
  role:                userRoleEnum("role").default("student").notNull(),
  language:            languageEnum("language").default("en").notNull(),
  plan:                planEnum("plan").default("free").notNull(),
  danhoPoints:         integer("danho_points").default(0).notNull(),
  chatTokensDaily:     integer("chat_tokens_daily").default(20).notNull(),
  chatTokensUsedToday: integer("chat_tokens_used_today").default(0).notNull(),
  tokensResetAt:       timestamp("tokens_reset_at").defaultNow(),
  isActive:            boolean("is_active").default(true).notNull(),
  emailVerified:       timestamp("email_verified"),
  lastLoginAt:         timestamp("last_login_at"),
  createdAt:           timestamp("created_at").defaultNow().notNull(),
  updatedAt:           timestamp("updated_at").defaultNow().notNull(),
});

// ── STUDENT PROFILES ──────────────────────────────────────────────────────────
export const studentProfiles = pgTable("student_profiles", {
  id:                   uuid("id").defaultRandom().primaryKey(),
  userId:               uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  province:             text("province"),
  schoolName:           text("school_name"),
  examBoard:            examBoardEnum("exam_board").default("zimsec"),
  currentLevel:         text("current_level"),
  aspirations:          text("aspirations"),
  interests:            jsonb("interests").default([]),
  onboardingComplete:   boolean("onboarding_complete").default(false).notNull(),
  profileCompletionPct: integer("profile_completion_pct").default(0).notNull(),
  createdAt:            timestamp("created_at").defaultNow().notNull(),
  updatedAt:            timestamp("updated_at").defaultNow().notNull(),
});

// ── EXAM RESULTS ──────────────────────────────────────────────────────────────
export const examResults = pgTable("exam_results", {
  id:        uuid("id").defaultRandom().primaryKey(),
  userId:    uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  examBoard: examBoardEnum("exam_board").notNull(),
  examYear:  integer("exam_year"),
  examLevel: text("exam_level"),
  results:   jsonb("results").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── OTP CODES ─────────────────────────────────────────────────────────────────
export const otpCodes = pgTable("otp_codes", {
  id:        uuid("id").defaultRandom().primaryKey(),
  email:     text("email").notNull(),
  code:      text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used:      boolean("used").default(false).notNull(),
  attempts:  integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── ZOE CONVERSATIONS ─────────────────────────────────────────────────────────
export const zoeConversations = pgTable("zoe_conversations", {
  id:         uuid("id").defaultRandom().primaryKey(),
  userId:     uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sessionId:  text("session_id").notNull(),
  language:   languageEnum("language").default("en"),
  messages:   jsonb("messages").default([]),
  tokensUsed: integer("tokens_used").default(0),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
  updatedAt:  timestamp("updated_at").defaultNow().notNull(),
});

// ── CAREER PATHS ──────────────────────────────────────────────────────────────
export const careerPaths = pgTable("career_paths", {
  id:                  uuid("id").defaultRandom().primaryKey(),
  slug:                text("slug").unique().notNull(),
  titleEn:             text("title_en").notNull(),
  titleSn:             text("title_sn"),
  titleNd:             text("title_nd"),
  descriptionEn:       text("description_en"),
  descriptionSn:       text("description_sn"),
  descriptionNd:       text("description_nd"),
  category:            text("category"),
  isVocational:        boolean("is_vocational").default(false),
  partnerInstitutions: jsonb("partner_institutions").default([]),
  isActive:            boolean("is_active").default(true),
  createdAt:           timestamp("created_at").defaultNow().notNull(),
});

// ── USER MILESTONES ───────────────────────────────────────────────────────────
export const userMilestones = pgTable("user_milestones", {
  id:            uuid("id").defaultRandom().primaryKey(),
  userId:        uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  milestoneKey:  text("milestone_key").notNull(),
  titleEn:       text("title_en").notNull(),
  earnedAt:      timestamp("earned_at").defaultNow().notNull(),
  pointsAwarded: integer("points_awarded").default(0),
});

// ── USER FEEDBACK ─────────────────────────────────────────────────────────────
export const userFeedback = pgTable("user_feedback", {
  id:            uuid("id").defaultRandom().primaryKey(),
  userId:        uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  category:      feedbackCatEnum("category").notNull(),
  message:       text("message").notNull(),
  metadata:      jsonb("metadata"),
  pointsAwarded: integer("points_awarded").default(3),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
});

// ── PARENT-STUDENT LINKS ──────────────────────────────────────────────────────
export const parentStudentLinks = pgTable("parent_student_links", {
  id:         uuid("id").defaultRandom().primaryKey(),
  parentId:   uuid("parent_id").references(() => users.id).notNull(),
  studentId:  uuid("student_id").references(() => users.id).notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
});

// ── NEXTAUTH TABLES ───────────────────────────────────────────────────────────
export const accounts = pgTable("accounts", {
  id:                uuid("id").defaultRandom().primaryKey(),
  userId:            uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type:              text("type").notNull(),
  provider:          text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken:      text("refresh_token"),
  accessToken:       text("access_token"),
  expiresAt:         integer("expires_at"),
  tokenType:         text("token_type"),
  scope:             text("scope"),
  idToken:           text("id_token"),
  sessionState:      text("session_state"),
});

export const sessions = pgTable("sessions", {
  id:           uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("session_token").unique().notNull(),
  userId:       uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires:      timestamp("expires").notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token:      text("token").notNull(),
  expires:    timestamp("expires").notNull(),
});