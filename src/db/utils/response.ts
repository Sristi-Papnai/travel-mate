import type { IErrorElement, IStandardResponse } from '../types/index';

/**
 * Build an empty response object
 */
export function getEmptyResponse(): IStandardResponse {
  return { error: false, errors: {}, msg: "" };
}

/**
 * Build an error response object
 */
export function getErrorResponse(
  errors: IErrorElement,
  msg?: string
): IStandardResponse {
  const errorMsg = msg || "Please correct your request and try again";
  const response = getEmptyResponse();
  return Object.assign(response, { error: true, msg: errorMsg, errors });
}

/**
 * Build a success response object
 */
export function getSuccessResponse(msg: string, data?: unknown) {
  const response = getEmptyResponse();
  return Object.assign(response, { msg, data });
}
