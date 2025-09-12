ALTER TABLE "users" ADD COLUMN "magic_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "token_expiry_date" timestamp;