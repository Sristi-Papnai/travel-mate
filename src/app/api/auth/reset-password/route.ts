// app/api/auth/reset-password/route.ts
import { findUserByValidToken, updateUserPassword } from "@/db/services/users";
import type { IStandardResponse } from "@/db/types";
import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";

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
    return NextResponse.json(
      getErrorResponse({ mail: "Token and password are required" }),
      { status: 404 }
    );
  }

  const user = await findUserByValidToken(token);

  if (!user) {
    return NextResponse.json(
      getErrorResponse({ mail: "Invalid or expired token" }),
      { status: 404 }
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Update user password & invalidate token
  await updateUserPassword(user.id, passwordHash);

  response.error = false;
  response.msg = "Password reset successfully";

  return NextResponse.json(
    getSuccessResponse("Mail sent successfully", {
      userId: user.id,
    }),
    { status: 200 }
  );
}
