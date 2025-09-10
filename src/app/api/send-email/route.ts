import { NextResponse } from "next/server";
import SibApiV3Sdk from "@getbrevo/brevo";

/**
 * POST /api/send-email
 *
 * Sends an email using Brevo's Transactional Email API.
 *
 * Expected payload (JSON):
 * {
 *   "to": "recipient@example.com",
 *   "subject": "Email subject",
 *   "htmlContent": "<p>Email body HTML</p>"
 * }
 *
 * Response:
 *   200: { success: true, messageId: string }
 *   400: { error: "Invalid request payload" }
 *   500: { error: "Error message" }
 */
export async function POST(req: Request) {
  try {
    const { to, subject, htmlContent } = await req.json();

    // Validate input
    if (!to || !subject || !htmlContent) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, htmlContent" },
        { status: 400 }
      );
    }

    // Initialize Brevo client
    const client = new SibApiV3Sdk.TransactionalEmailsApi();
    client.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // Prepare email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL }; 
    sendSmtpEmail.to = [{ email: to }];

    // Send email
    const result = await client.sendTransacEmail(sendSmtpEmail);


    return NextResponse.json({
      success: true,
      messageId: result.body.messageId, 
    });
  } catch (error) {
    console.error("Brevo email error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
