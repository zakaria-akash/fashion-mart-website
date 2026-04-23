import { NextResponse } from "next/server";

/**
 * Generates a consistent success response for API route handlers.
 */
export function successResponse(data, init = {}) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    init
  );
}

/**
 * Generates a consistent error response for API route handlers.
 * Includes machine-readable codes and user-safe messages.
 */
export function errorResponse(code, message, status = 400, details) {
  return NextResponse.json(
    {
      success: false,
      code,
      message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}
