ALTER TABLE "saved_locations" DROP CONSTRAINT "saved_locations_created_at_users_id_fk";
--> statement-breakpoint
ALTER TABLE "saved_locations" ADD COLUMN "commented_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_locations" ADD CONSTRAINT "saved_locations_commented_by_users_id_fk" FOREIGN KEY ("commented_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;