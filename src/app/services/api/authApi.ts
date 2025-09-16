// src/services/auth.ts (or wherever)

import type { IStandardResponse } from "@/db/types";
import type { ForgotPasswordResponse, IForgotPasswordPayload, IRegisterPayload, IValidateTokenPayload, ResetPasswordPayload, ResetPasswordResponse, ValidateTokenResponse } from "@/interfaces/openapi";


export async function registerUser(payload: IRegisterPayload) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // ensure cookies set by the server are accepted by the browser
    credentials: "include",
  });

  const result = await res.json().catch(() => ({}));
  return { res, result };
}

export async function forgotPassword(
  payload: IForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return (await res.json()) as ForgotPasswordResponse;
}

export async function validateToken(
  payload: IValidateTokenPayload
): Promise<IStandardResponse<ValidateTokenResponse>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
/**
 * Reset the password using a valid token.
 * @param token - The password reset token.
 * @param password - The new password.
 * @returns A promise that resolves to a ResetPasswordResponse.
 * @throws If the fetch request fails or API returns an error.
 */
export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<IStandardResponse<ResetPasswordResponse>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}