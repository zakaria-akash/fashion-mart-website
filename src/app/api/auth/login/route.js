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

export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please fix the highlighted fields.", 400, formatZodError(parsed.error));
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);

    if (!passwordMatches) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    }

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
        },
      },
    });

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
