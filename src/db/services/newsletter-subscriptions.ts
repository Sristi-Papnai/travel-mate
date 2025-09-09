import { db, schema } from "@/db/client";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";
import type { IStandardResponse } from "@/db/types/index";
import { eq } from "drizzle-orm";

const { newsletterSubscription } = schema;

/**
 * Add a newsletter subscription
 */
export async function addNewsletterSubscription(
  email: string
): Promise<IStandardResponse> {
  try {
    if (!email) {
      return getErrorResponse(
        { email: "Email is required" },
        "Invalid email"
      );
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(newsletterSubscription)
      .where(eq(newsletterSubscription.email, email))
      .limit(1);

    if (existing.length > 0) {
      return getErrorResponse(
        { email: "Duplicate subscription" },
        "Already subscribed with this email"
      );
    }

    // Insert new subscription
    const result = await db
      .insert(newsletterSubscription)
      .values({
        email,
        joiningDate: new Date(), 
      })
      .returning();

    return getSuccessResponse("Subscribed", result[0]);
  } catch (error) {
    console.error("Error adding subscription:", error);
    return getErrorResponse(
      { db: "Failed to Subscrib" },
      "Something went wrong"
    );
  }
}
