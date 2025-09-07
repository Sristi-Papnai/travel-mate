import { NextResponse } from "next/server";
import { addNewsletterSubscription } from "@/db/service/newsletter-subscriptions";

export async function POST(req: Request) {
  const { email } = await req.json();
  const response = await addNewsletterSubscription(email);
  return NextResponse.json(response);
}
