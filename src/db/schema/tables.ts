import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
export const Sex = pgEnum("sex", ["male", "female"]);
export const Mbti = pgEnum("mbti", [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]);
export const Job = pgEnum("job", [
  "중고등학생",
  "대학/대학원생",
  "취준생",
  "직장인",
  "자영업",
  "전문직",
  "기타",
]);
export const Vote = pgEnum("vote", ["A", "B"]);

// NextAuth.js required tables
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_token", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Removed roles table - using isAdmin boolean in users table instead

// Users table - Updated to work with NextAuth.js
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Auto-incremented user ID
  name: varchar("name", { length: 255 }), // User's name (from OAuth)
  email: varchar("email", { length: 255 }).unique(), // Email (from OAuth)
  emailVerified: timestamp("email_verified", { mode: "date" }), // Email verification
  displayName: varchar("display_name", { length: 255 }), // User's display name (nullable)
  sex: Sex(), // Gender as enum (nullable)
  birthYear: integer("birth_year"), // Birth year as integer (nullable)
  mbti: Mbti(), // MBTI enum column (nullable)
  job: Job(), // Job/occupation as enum (nullable)
  customJob: varchar("custom_job", { length: 10 }), // Custom job input (max 10 chars, nullable)
  isNotificationOn: boolean("is_notification_on").notNull().default(false), // Toggle for notifications
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false), // Track if onboarding is done
  isAdmin: boolean("is_admin").notNull().default(false), // Admin privileges (simple boolean)
});

// Posts table for voting
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(), // Auto-incremented post ID
  title: varchar("title", { length: 35 }).notNull(), // Post title
  content: varchar("content", { length: 300 }).notNull(), // The question/content being asked
  authorId: integer("author_id")
    .references(() => users.id)
    .notNull(), // Foreign key to users table - who created the post
  optionA: varchar("option_a", { length: 11 }).notNull(), // Text for option A
  optionB: varchar("option_b", { length: 11 }).notNull(), // Text for option B
  votesA: integer("votes_a").notNull().default(0), // Number of votes for option A
  votesB: integer("votes_b").notNull().default(0), // Number of votes for option B
  isEndVote: boolean("is_end_vote").notNull().default(false), // Auto-end when total votes reach 101
  endedAt: timestamp("ended_at", { mode: "date" }), // Time when voting ended
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(), // Time when the post was created
});

// Reply table (for post replies and reply-to-reply, max 2 levels)
export const reply = pgTable("reply", {
  id: serial("id").primaryKey(), // Auto-incremented reply ID
  reply: text("reply").notNull(), // The reply content
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(), // Foreign key to users table
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(), // Foreign key to posts table - all replies belong to a post
  parentReplyId: integer("parent_reply_id"), // NULL = direct reply to post, NOT NULL = reply to another reply
  isDeleted: boolean("is_deleted").notNull().default(false), // Flag to indicate if the reply is deleted
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(), // Time when the reply was created
});

// Votes table
export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(), // Auto-incremented vote ID
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(), // Foreign key to users table
    postId: integer("post_id")
      .references(() => posts.id)
      .notNull(), // Foreign key to posts table
    vote: Vote().notNull(), // The user's vote (enum: 'A', 'B')
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(), // When the vote was cast
  },
  (table) => ({
    // Unique constraint: one vote per user per post
    uniqueUserPost: sql`UNIQUE(${table.userId}, ${table.postId})`,
  })
);

// Saved posts table (for bookmarking debates)
export const savedPosts = pgTable(
  "saved_posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    postId: integer("post_id")
      .references(() => posts.id)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    // Unique constraint: one save per user per post
    uniqueUserPost: sql`UNIQUE(${table.userId}, ${table.postId})`,
  })
);
