import { findUserByValidToken } from "@/db/services/users";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";
import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /auth/validate-token
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token as string;


  if (!token) {
    return NextResponse.json(
      getErrorResponse({ mail: "Token cannot be empty" }),
      { status: 400 }
    );
  }

  const user = await findUserByValidToken(token);

  if (!user) {
    return NextResponse.json(
      getErrorResponse({ mail: "Token not found or expired" }),
      { status: 404 }
    );
  }


  return NextResponse.json(
    getSuccessResponse("Mail sent successfully", {
      userId: user.id,
    }),
    { status: 200 }
  );
}
