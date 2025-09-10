import type { ISendEmailPayload, ISendEmailResponse } from "@/interfaces/openapi";

export async function sendEmail(
    payload: ISendEmailPayload
  ): Promise<ISendEmailResponse> {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    return res.json();
  }