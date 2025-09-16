import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createMagicTokenForUser } from "@/db/services/users";
import { getErrorResponse, getSuccessResponse } from "@/db/utils/response";
import { sendEmail } from "@/app/services/mail/send-mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        getErrorResponse({ email: "Email is required" }),
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json(
        getErrorResponse({ email: "No account found with this email" }),
        { status: 404 }
      );
    }

    // Generate and save magic token
    const updatedUser = await createMagicTokenForUser(email);
    if (!updatedUser) {
      return NextResponse.json(
        getErrorResponse({ db: "Failed to generate magic token" }),
        { status: 500 }
      );
    }

    // send email

    const mail = await sendEmail({
      to: email,
      subject: "Reset Your Password",
      htmlContent: `
        <h1>Hello!</h1>
        <p>
        Click this
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset?token=${updatedUser.magicToken}">
          link
          </a> to reset your password:
        </p>
      `,
    });

    if(!mail.success){
      return NextResponse.json(
        getErrorResponse({ mail: "Failed to send mail" }),
        { status: 500 }
      );
    }


    // Return success with token details (don’t expose token in prod if sending via email)
    return NextResponse.json(
      getSuccessResponse("Mail sent successfully", {
        email: updatedUser.email,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      getErrorResponse({ server: "Something went wrong" }, "Forgot password failed"),
      { status: 500 }
    );
  }
}
