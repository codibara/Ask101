CREATE TYPE "public"."job" AS ENUM('중고등학생', '대학/대학원생', '취준생', '직장인', '자영업', '전문직', '기타');--> statement-breakpoint
CREATE TABLE "saved_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE varchar(35);--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE varchar(300);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "sex" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "age" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "mbti" SET DATA TYPE mbti;--> statement-breakpoint
ALTER TABLE "votes" ALTER COLUMN "vote" SET DATA TYPE vote;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "author_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "option_a" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "option_b" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "votes_a" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "votes_b" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_end_vote" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reply" ADD COLUMN "parent_reply_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_year" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job" "job";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "custom_job" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "votes_user_post_unique" ON "votes" USING btree ("user_id","post_id");--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "participants";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "yes_votes";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "no_votes";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "is_post_ended";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "post";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "saved_posts";--> statement-breakpoint
ALTER TABLE "public"."votes" ALTER COLUMN "vote" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."vote";--> statement-breakpoint
CREATE TYPE "public"."vote" AS ENUM('A', 'B');--> statement-breakpoint
ALTER TABLE "public"."votes" ALTER COLUMN "vote" SET DATA TYPE "public"."vote" USING "vote"::"public"."vote";