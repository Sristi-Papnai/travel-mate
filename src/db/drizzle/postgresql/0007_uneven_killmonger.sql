ALTER TABLE "trips" ALTER COLUMN "destination" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "description" varchar(255);