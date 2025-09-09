import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/db/services/users";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        getErrorResponse({ fields: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        getErrorResponse({ email: "Account already exists" }),
        { status: 400 }
      );
    }

    // Create new user using service function
    const newUser = await createUser({ firstName, lastName, email, password });

    return NextResponse.json(
      getSuccessResponse("User registered successfully", newUser)
    );
  } catch (error) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      getErrorResponse({ db: "Something went wrong" }, "Registration failed"),
      { status: 500 }
    );
  }
}
