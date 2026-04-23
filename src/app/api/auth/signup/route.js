import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, setAuthCookie, GUEST_COOKIE_NAME } from "@/lib/auth";
import { formatZodError, signupSchema } from "@/lib/validation";
import { mergeWishlistToUser } from "@/lib/products";
import { serverEnv } from "@/lib/env";
import { User } from "@/models/User";

export const runtime = "nodejs";

async function resolveUserRole(email) {
  const totalUsers = await User.countDocuments();

  if (totalUsers === 0 || serverEnv.adminEmails.includes(email)) {
    return "admin";
  }

  return "user";
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please fix the highlighted fields.", 400, formatZodError(parsed.error));
    }

    const { name, email, password } = parsed.data;
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return errorResponse("EMAIL_IN_USE", "An account with this email already exists.", 409);
    }

    const role = await resolveUserRole(email);
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get(GUEST_COOKIE_NAME)?.value;
    await mergeWishlistToUser(guestSessionId, user._id);

    const response = successResponse(
      {
        data: {
          user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      },
      { status: 201 }
    );

    await setAuthCookie(response, {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return response;
  } catch (error) {
    return errorResponse("SIGNUP_FAILED", error.message, 500);
  }
}
