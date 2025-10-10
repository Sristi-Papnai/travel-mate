import { boolean, date, json, text } from "drizzle-orm/pg-core";
import { serial, timestamp, pgTable, varchar, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }),
  magicToken: varchar("magic_token", { length: 255 }),
  tokenExpiryDate: timestamp("token_expiry_date"),     
  createdAt: timestamp("created_at").defaultNow(),
  provider: varchar("provider").default("credentials").notNull(), 
});


export const newsletterSubscription = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  joiningDate: timestamp("joining_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
});


export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  destination: varchar("destination", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  occasion: varchar("occasion", { length: 255 }), 
  mode_of_transportation: varchar("mode_of_transportation", { length: 255 }), 
  members: integer("members").notNull(),
  start_date: date("start_date"), 
  end_date: date("end_date"), 
  min_budget: integer("min_budget"), 
  max_budget: integer("max_budget"), 
  budget_per_person: integer("budget_per_person"), 
  status: varchar("status", { length: 50 }).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(), 
});

// ROLES TABLE
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), 
});

// MEMBERS TABLE (Trip Membership)
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  tripId: integer("trip_id")
    .references(() => trips.id)
    .notNull(),
  roleId: integer("role_id")
    .references(() => roles.id)
    .notNull(),
});

// ACTIVITY TABLE (Logs for user actions)
export const activity = pgTable("activity", {
  id: serial("id").primaryKey(),
  referenceType: varchar("reference_type", { length: 100 }).notNull(),
  referenceId: integer("reference_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  data: json('data'),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// FILES TABLE (Trip files)
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .references(() => trips.id)
    .notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileType: varchar("file_type", { length: 100 }),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// CHECKLISTS TABLE (Trip checklists)
export const checklists = pgTable("checklists", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .references(() => trips.id)
    .notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  completedBy: integer("completed_by").references(() => users.id),
  sequence: integer("sequence").notNull(),
});

// COMMENTS TABLE (Trip comments)
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .references(() => trips.id)
    .notNull(),
  data: text("data"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// SAVED LOCATIONS TABLE (Trip saved locations)
export const savedLocations = pgTable("saved_locations", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .references(() => trips.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  longitude: varchar("longitude", { length: 100 }).notNull(),
  latitude: varchar("latitude", { length: 100 }).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


import { relations } from "drizzle-orm";

export const tripsRelations = relations(trips, ({ many, one }) => ({
  members: many(members),
  files: many(files),
  checklists: many(checklists),
  comments: many(comments),
  savedLocations: many(savedLocations),
  creator: one(users, {
    fields: [trips.userId],
    references: [users.id],
  }),

}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [members.tripId],
    references: [trips.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [files.tripId],
    references: [trips.id],
  }),
}));

export const checklistsRelations = relations(checklists, ({ one }) => ({
  creator: one(users, {
    fields: [checklists.userId],
    references: [users.id],
  }),
  completer: one(users, {
    fields: [checklists.completedBy],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [checklists.tripId],
    references: [trips.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [comments.tripId],
    references: [trips.id],
  }),
}));

export const savedLocationsRelations = relations(savedLocations, ({ one }) => ({
  user: one(users, {
    fields: [savedLocations.userId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [savedLocations.tripId],
    references: [trips.id],
  }),
}));
