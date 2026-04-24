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

    // SPECIAL CASE: Handle the hardcoded master admin session
    if (session.sub === "master-admin") {
      return successResponse({
        data: {
          user: {
            id: "master-admin",
            name: session.name || "System Admin",
            email: session.email,
            role: "admin",
            emailVerified: true,
          },
        },
      });
    }

    // STANDARD CASE: Refresh user data from database for standard users/admins
    // Check if sub is a valid ObjectId before querying to prevent Mongoose errors
    const isValidId = /^[0-9a-fA-F]{24}$/.test(session.sub);
    const user = isValidId ? await User.findById(session.sub).lean() : null;

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
