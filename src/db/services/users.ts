import { db, schema } from "@/db/client";
import { and, eq, gt } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";


const { users } = schema;

export interface ITokenRecord {
  id: number;
  magicToken: string | null;
  tokenExpiryDate: Date | null;
  email: string;
  firstName: string;
  lastName: string;
}


/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

/**
 * Create a new user
 */
export async function createUser({
  lastName,
  firstName,
  email,
  password,
}: {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })
    .returning();

  return newUser;
}


export async function createGoogleUser({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  // check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // insert new Google user
  const [newUser] = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password: null, 
      provider: "google", 
    })
    .returning();

  return newUser;
}

/**
 * Validate user credentials
 */
export async function validateUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

/**
 * Update user
 */
export async function updateUser(
  id: number, 
  data: Partial<{ name: string; email: string; password: string }>
) {
  const updateData = { ...data };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id)) 
    .returning();

  return updatedUser;
}

/**
 * Delete user
 */
export async function deleteUser(id: number) {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id)) 
    .returning();

  return deletedUser;
}

/**
 * Create and store a magic token with 10-minute expiry for a user by email
 */
export async function createMagicTokenForUser(email: string) {
  const magicToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiryDate = new Date(Date.now() + 10 * 60 * 1000); 

  const [updatedUser] = await db
    .update(users)
    .set({
      magicToken,
      tokenExpiryDate,
    })
    .where(eq(users.email, email))
    .returning({
      id: users.id,
      email: users.email,
      magicToken: users.magicToken,
      tokenExpiryDate: users.tokenExpiryDate,
    });

  return updatedUser ?? null;
}


/**
 * Find user by magic token if it exists and is not expired.
 * @param token - The magic token to validate
 * @returns The user record or null if not found/expired
 */
export async function findUserByValidToken(token: string): Promise<ITokenRecord | null> {
  const now = new Date();

  const [user] = await db
    .select()
    .from(users)
    .where(and(
      eq(users.magicToken, token),
      gt(users.tokenExpiryDate, now)
    ))
    .limit(1);

  return user ?? null;
}

export async function updateUserPassword(userId: number, passwordHash: string): Promise<void> {
  await db
    .update(users)
    .set({ password: passwordHash, magicToken: null, tokenExpiryDate: null })
    .where(eq(users.id, userId));
}