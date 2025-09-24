ALTER TABLE "checklists" RENAME COLUMN "created_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "commented_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "uploaded_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "saved_locations" RENAME COLUMN "commented_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "trips" RENAME COLUMN "created_by" TO "user_id";--> statement-breakpoint
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_commented_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_uploaded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "saved_locations" DROP CONSTRAINT "saved_locations_commented_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "trips_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_locations" ADD CONSTRAINT "saved_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;