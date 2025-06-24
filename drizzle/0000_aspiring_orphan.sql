CREATE TYPE "public"."mbti" AS ENUM('INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."vote" AS ENUM('yes', 'no');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"participants" integer NOT NULL,
	"yes_votes" integer NOT NULL,
	"no_votes" integer NOT NULL,
	"is_post_ended" boolean NOT NULL,
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reply" (
	"id" serial PRIMARY KEY NOT NULL,
	"reply" text NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"sex" text NOT NULL,
	"age" integer NOT NULL,
	"mbti" text NOT NULL,
	"is_notification_on" boolean DEFAULT false NOT NULL,
	"role" integer NOT NULL,
	"post" integer[] DEFAULT '{}'::integer[] NOT NULL,
	"saved_posts" integer[] DEFAULT '{}'::integer[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"vote" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reply" ADD CONSTRAINT "reply_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reply" ADD CONSTRAINT "reply_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_roles_id_fk" FOREIGN KEY ("role") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;