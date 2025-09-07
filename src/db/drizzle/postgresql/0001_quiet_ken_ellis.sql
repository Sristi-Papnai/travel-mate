CREATE TABLE "newsletter_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"joining_date" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscription_email_unique" UNIQUE("email")
);
