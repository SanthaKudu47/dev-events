import { NextResponse } from "next/server";

type ResponseOptions = {
  success: boolean;
  message: string;
  data: any;
  status: number;
  errors?: string[] | null;
};

/**
 * Sends a standardized JSON response for API routes.
 * Always hides internal error details from the client.
 */
export function sendResponse({
  success,
  message,
  data,
  status,
  errors,
}: ResponseOptions) {
  return NextResponse.json(
    {
      success,
      message,
      data,
      errors,
    },
    { status }
  );
}
