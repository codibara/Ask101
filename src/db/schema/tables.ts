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
export const Vote = pgEnum("vote", ["yes", "no"]);

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

// Roles table: Admin or user roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(), // Role ID (auto-increment)
  name: varchar("name", { length: 50 }).notNull(), // Role name (admin/user)
});

// Users table - Updated to work with NextAuth.js
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Auto-incremented user ID
  name: varchar("name", { length: 255 }), // User's name (from OAuth)
  email: varchar("email", { length: 255 }).unique(), // Email (from OAuth)
  emailVerified: timestamp("email_verified", { mode: "date" }), // Email verification
  image: varchar("image", { length: 255 }), // Profile image (from OAuth)
  displayName: varchar("display_name", { length: 255 }), // User's display name (nullable)
  sex: text("sex").$type<typeof Sex>(), // Gender as enum (nullable)
  age: integer("age"), // Age as integer (nullable)
  mbti: text("mbti").$type<typeof Mbti>(), // MBTI enum column (nullable)
  isNotificationOn: boolean("is_notification_on").notNull().default(false), // Toggle for notifications
  role: integer("role")
    .references(() => roles.id)
    .notNull()
    .default(2), // Foreign key to roles table, default to user role
  post: integer("post")
    .array()
    .notNull()
    .default(sql`'{}'::integer[]`), // Array of post IDs with empty array default
  savedPosts: integer("saved_posts")
    .array()
    .notNull()
    .default(sql`'{}'::integer[]`), // Array of saved post IDs with empty array default
});

// Posts table for voting
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(), // Auto-incremented post ID
  title: varchar("title", { length: 255 }).notNull(), // Post title
  content: text("content").notNull(), // The question/content being asked
  participants: integer("participants").notNull(), // Number of users who participated
  yesVotes: integer("yes_votes").notNull(), // Number of "yes" votes
  noVotes: integer("no_votes").notNull(), // Number of "no" votes
  isPostEnded: boolean("is_post_ended").notNull(), // Toggle if the vote has ended
  endedAt: timestamp("ended_at", { mode: "date" }), // Time when voting ended
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(), // Time when the post was created
});

// Reply table (for post replies)
export const reply = pgTable("reply", {
  id: serial("id").primaryKey(), // Auto-incremented reply ID
  reply: text("reply").notNull(), // The reply content
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(), // Foreign key to users table
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(), // Foreign key to posts table
  isDeleted: boolean("is_deleted").notNull().default(false), // Flag to indicate if the reply is deleted
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(), // Time when the reply was created
});

// Votes table
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(), // Auto-incremented vote ID
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(), // Foreign key to users table
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(), // Foreign key to posts table
  vote: text("vote").$type<typeof Vote>().notNull(), // The user's vote (enum: 'yes', 'no')
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(), // When the vote was cast
});
