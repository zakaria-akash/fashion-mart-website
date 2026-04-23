import { successResponse } from "@/lib/api-response";
import { clearAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = successResponse({
    message: "Logged out successfully.",
  });

  clearAuthCookie(response);
  return response;
}
