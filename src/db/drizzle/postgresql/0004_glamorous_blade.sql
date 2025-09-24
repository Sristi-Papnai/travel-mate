CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination" varchar(255) NOT NULL,
	"occasion" varchar(255),
	"mode_of_transportation" varchar(255),
	"members" integer NOT NULL,
	"start_date" date,
	"end_date" date,
	"min_budget" integer,
	"max_budget" integer,
	"budget_per_person" integer,
	"status" varchar(50) NOT NULL
);
