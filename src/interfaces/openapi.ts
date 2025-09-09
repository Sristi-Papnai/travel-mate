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
 * Newsletter request payload
 */
export interface INewsletterRequest {
  email: string;
}

/**
 * Newsletter response (extends standard API response)
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface INewsletterResponse extends IStandardResponse {}

