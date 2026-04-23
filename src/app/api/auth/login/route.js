import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import {
  GUEST_COOKIE_NAME,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema, formatZodError } from "@/lib/validation";
import { mergeWishlistToUser } from "@/lib/products";
import { User } from "@/models/User";

export const runtime = "nodejs";

/**
 * POST /api/auth/login
 * Authenticates a user, manages session cookies, and merges guest wishlist data.
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    // Standard input validation
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please fix the highlighted fields.", 400, formatZodError(parsed.error));
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    // Account existence check
    if (!user) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    }

    // Enforce email verification before allowing access
    if (!user.emailVerified) {
      return errorResponse(
        "EMAIL_NOT_VERIFIED",
        "Verify your email before logging in.",
        403,
        [{ field: "email", message: "Your account is waiting for email verification." }]
      );
    }

    // Secure password comparison
    const passwordMatches = await verifyPassword(password, user.passwordHash);

    if (!passwordMatches) {
      // Track failed attempts for security audit
      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
      user.lastFailedLoginAt = new Date();
      await user.save();
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    }

    // Reset failure tracking on success
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAt = null;
    user.lastLoginAt = new Date();
    await user.save();

    // Migrate guest wishlist items to the authenticated user's account
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get(GUEST_COOKIE_NAME)?.value;
    await mergeWishlistToUser(guestSessionId, user._id);

    const response = successResponse({
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

    // Attach JWT session cookie to the response
    await setAuthCookie(response, {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return response;
  } catch (error) {
    return errorResponse("LOGIN_FAILED", error.message, 500);
  }
}
