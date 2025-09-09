import { NextResponse } from "next/server";

// (Simplified: In real app, send reset link via email)
export async function POST(req: Request) {
  const { email } = await req.json();

  return NextResponse.json({ message: `Password reset link sent to ${email}` });
}
