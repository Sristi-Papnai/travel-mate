import { findUserByValidToken } from "@/db/services/users";
import type { IStandardResponse } from "@/db/types";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";
import { NextResponse, type NextRequest } from "next/server";

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
    return NextResponse.json(
      getErrorResponse({ mail: "Token cannot be empty" }),
      { status: 400 }
    );
  }

  const user = await findUserByValidToken(token);

  if (!user) {
    response.msg = "Invalid or expired token";
    response.errors = { token: "Token not found or expired" };
    return NextResponse.json(
      getErrorResponse({ mail: "Token not found or expired" }),
      { status: 404 }
    );
  }

  response.error = false;
  response.msg = "Token is valid";
  response.data = { userId: user.id };

  return NextResponse.json(
    getSuccessResponse("Mail sent successfully", {
      userId: user.id,
    }),
    { status: 200 }
  );
}
