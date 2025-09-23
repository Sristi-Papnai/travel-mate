import type { ISendEmailPayload, ISendEmailResponse } from "@/interfaces/openapi";
import SibApiV3Sdk from "@getbrevo/brevo";


export async function sendEmail(
    payload: ISendEmailPayload
  ): Promise<ISendEmailResponse> {
    try{

        const { to, subject, htmlContent, textContent } = payload;
         // Validate input
         if (!to || !subject || (!htmlContent && !textContent) ) {
    
            return {
                success: false,
                error: "Missing required fields: to, subject, htmlContent"
              };
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
      
      
          return {
            success: true,
            messageId: result.body.messageId, 
          };
      
    }
    catch (error) {
        console.error("Brevo email error:", error);
        return {
            success: false,
            error: "Brevo email error :"
          };
      }
  }