import { db, schema } from "@/db/client";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const { users } = schema;

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
