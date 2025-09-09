import { serial, timestamp, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  magicToken: varchar("magic_token", { length: 255 }),
  tokenExpiryDate: timestamp("token_expiry_date"),     
  createdAt: timestamp("created_at").defaultNow(),
});


export const newsletterSubscription = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  joiningDate: timestamp("joining_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
});