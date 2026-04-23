import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import { User } from "@/models/User";

export const runtime = "nodejs";

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
        },
      },
    });
  } catch (error) {
    return errorResponse("AUTH_SESSION_FAILED", error.message, 500);
  }
}
