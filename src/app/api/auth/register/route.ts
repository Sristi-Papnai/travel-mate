// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/db/services/users";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";
import { encode } from "next-auth/jwt";
import { sendEmail } from "@/app/services/mail/send-mail";

const SESSION_COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

export async function POST(req: NextRequest) {
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

    // Create the user (assumes createUser hashes password, etc.)
    const newUser = await createUser({ firstName, lastName, email, password });

    // Build token payload that matches what your auth callbacks expect.
    // We put the user inside `user` to match your jwt callback that sets token.user.
    const tokenPayload = {
      user: {
        id: newUser.id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
      iat: Math.floor(Date.now() / 1000),
    };

    // encode a signed/encrypted JWT for NextAuth
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is not set");
      return NextResponse.json(
        getErrorResponse({ server: "Server misconfiguration" }, "Server error"),
        { status: 500 }
      );
    }

    const maxAge = 60 * 60 * 24 * 30; // 30 days in seconds (adjust if needed)
    const encoded = await encode({ token: tokenPayload, secret, maxAge });

    // Build response and set the cookie so browser stores the session token
    const res = NextResponse.json(
      getSuccessResponse("User registered and signed in", { id: newUser.id })
    );

    // set cookie options
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: encoded ?? "",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge,
    });

     // send email
     const mail = await sendEmail({
      to: newUser.email,
      subject: "Reset Your Password",
      htmlContent: `
        <h1>Hello! ${newUser.firstName}</h1>
        <p>
        Welcome to Travel Mate!
        </p>
      `,
    });

    if(!mail.success){
      console.error("failed to send welcom mail")
    }

    return res;
  } catch (error) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      getErrorResponse({ db: "Something went wrong" }, "Registration failed"),
      { status: 500 }
    );
  }
}
