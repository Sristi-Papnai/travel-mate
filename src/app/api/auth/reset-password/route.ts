// app/api/auth/reset-password/route.ts
import { findUserByValidToken, updateUserPassword } from "@/db/services/users";
import type { IStandardResponse } from "@/db/types";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, password } = body as { token: string; password: string };

  const response: IStandardResponse = {
    error: true,
    errors: {},
    msg: "",
    data: {},
  };

  if (!token || !password) {
    response.msg = "Token and password are required";
    if (!token) response.errors.token = "Token is missing";
    if (!password) response.errors.password = "Password is missing";
    return new Response(JSON.stringify(response), { status: 400 });
  }

  const user = await findUserByValidToken(token);

  if (!user) {
    response.msg = "Invalid or expired token";
    response.errors.token = "Token not found or expired";
    return new Response(JSON.stringify(response), { status: 404 });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update user password & invalidate token
  await updateUserPassword(user.id, passwordHash);

  response.error = false;
  response.msg = "Password reset successfully";

  return new Response(JSON.stringify(response), { status: 200 });
}
