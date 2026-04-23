import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import { User } from "@/models/User";

export const runtime = "nodejs";

/**
 * GET /api/auth/me
 * Retrieves the profile of the currently authenticated user.
 * Returns null user data if no active session exists.
 */
export async function GET() {
  try {
    await connectToDatabase();
    const session = await getCurrentSession();

    if (!session?.sub) {
      return successResponse({
        data: {
          user: null,
        },
      });
    }

    // Refresh user data from database to ensure up-to-date roles/status
    const user = await User.findById(session.sub).lean();

    if (!user) {
      return successResponse({
        data: {
          user: null,
        },
      });
    }

    return successResponse({
      data: {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          lastLoginAt: user.lastLoginAt,
        },
      },
    });
  } catch (error) {
    return errorResponse("AUTH_SESSION_FAILED", error.message, 500);
  }
}
