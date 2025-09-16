import z from "zod";
import type { IStandardResponse } from "@/db/types";

export const OpenApiParams = z.object({
  id: z.string().describe("OpenApi ID"),
});

export const OpenApiResponse = z.object({
  id: z.string().describe("OpenApi ID"),
  name: z.string().describe("OpenApi name"),
  price: z.number().positive().describe("OpenApi price"),
});



/**
 * User registration request payload
 */
export interface IUserRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * User registration response (extends standard API response)
 */
export type IUserRegisterResponse = IStandardResponse;

/**
 * Newsletter request payload
 */
export interface INewsletterRequest {
  email: string;
}

/**
 * Newsletter response (extends standard API response)
 */
export type INewsletterResponse = IStandardResponse;

// ---------------- Zod Schemas (optional, for validation or OpenAPI generation) ----------------

export const UserRegisterRequest = z.object({
  firstName: z.string().describe("First name of the user"),
  lastName: z.string().describe("Last name of the user"),
  email: z.string().email().describe("Email of the user"),
  password: z.string().min(6).describe("Password for the account"),
});

export const UserRegisterResponse = z.object({
  success: z.boolean().describe("Status of the response"),
  msg: z.string().describe("Response message"),
  data: z
    .object({
      id: z.string().describe("User ID"),
      firstName: z.string().describe("First name"),
      lastName: z.string().describe("Last name"),
      email: z.string().describe("Email"),
    })
    .optional(),
});

export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface IForgotPasswordData {
  id: number;
  email: string;
  magicToken: string;
  tokenExpiryDate: string; // or Date if you want to parse it
}

export type ForgotPasswordResponse = IStandardResponse<IForgotPasswordData>;


/**
 * Request payload
 */
export interface IForgotPasswordPayload {
  email: string;
}

export interface ISendEmailPayload {
  to: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
}

/**
 * Response type from the email API
 */
export interface ISendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IValidateTokenPayload {
  token: string | undefined;
}
export interface ValidateTokenResponseData {
  id?: number;
}
export type ValidateTokenResponse = IStandardResponse<ValidateTokenResponseData>;

/**
 * Response type for password reset.
 */
export interface ResetPasswordResponseData {
  id?: number;
}

export type ResetPasswordResponse = IStandardResponse<ResetPasswordResponseData>;


export interface ResetPasswordPayload {
  token: string | undefined;
  password: string;
}


