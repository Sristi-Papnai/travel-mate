ALTER TABLE "newsletter_subscription" RENAME TO "newsletter_subscriptions";--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" DROP CONSTRAINT "newsletter_subscription_email_unique";--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_email_unique" UNIQUE("email");