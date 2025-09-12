import { NextResponse } from "next/server";
import { addNewsletterSubscription } from "@/db/services/newsletter-subscriptions";
import type {
  INewsletterRequest,
  INewsletterResponse,
} from "@/interfaces/openapi";

/**
 * Subscribe to newsletter
 * @description Adds a user to the newsletter subscription list
 * @pathParams NewsletterParams
 * @request NewsletterRequest
 * @response NewsletterResponse
 * @openapi
 */
export async function POST(req: Request) {
  const body: INewsletterRequest = await req.json();
  const response: INewsletterResponse = await addNewsletterSubscription(body.email);
  return NextResponse.json(response);
}
