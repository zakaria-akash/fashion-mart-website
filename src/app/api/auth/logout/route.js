import { successResponse } from "@/lib/api-response";
import { clearAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * POST /api/auth/logout
 * Terminates the user session by clearing the authentication cookie.
 */
export async function POST() {
  const response = successResponse({
    message: "Logged out successfully.",
  });

  // Instruct the client to delete the auth cookie
  clearAuthCookie(response);
  return response;
}
