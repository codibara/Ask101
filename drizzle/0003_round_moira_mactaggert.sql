DROP INDEX "votes_user_post_unique";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "read_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "registered_at" timestamp DEFAULT now() NOT NULL;