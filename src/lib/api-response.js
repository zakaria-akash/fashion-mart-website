import { NextResponse } from "next/server";

export function successResponse(data, init = {}) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    init
  );
}

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
