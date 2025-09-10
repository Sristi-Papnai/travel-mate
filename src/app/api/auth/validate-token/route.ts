import { findUserByValidToken } from "@/db/services/users";
import type { IStandardResponse } from "@/db/types";
import type { NextRequest } from "next/server";

/**
 * POST /auth/validate-token
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token as string;

  const response: IStandardResponse<{ userId?: number }> = {
    error: true,
    errors: {},
    msg: "",
    data: {},
  };

  if (!token) {
    response.msg = "Token is required";
    response.errors = { token: "Token cannot be empty" };
    return new Response(JSON.stringify(response), { status: 400 });
  }

  const user = await findUserByValidToken(token);

  if (!user) {
    response.msg = "Invalid or expired token";
    response.errors = { token: "Token not found or expired" };
    return new Response(JSON.stringify(response), { status: 404 });
  }

  response.error = false;
  response.msg = "Token is valid";
  response.data = { userId: user.id };

  return new Response(JSON.stringify(response), { status: 200 });
}
