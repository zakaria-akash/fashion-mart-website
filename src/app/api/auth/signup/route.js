import { cookies } from "next/headers";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, GUEST_COOKIE_NAME } from "@/lib/auth";
import { buildVerificationUrl, createVerificationToken, sendVerificationEmail } from "@/lib/email";
import { formatZodError, signupSchema } from "@/lib/validation";
import { mergeWishlistToUser } from "@/lib/products";
import { serverEnv } from "@/lib/env";
import { User } from "@/models/User";

export const runtime = "nodejs";

/**
 * Determines the role for a new user.
 * The first user in the database or emails listed in ADMIN_EMAILS get the 'admin' role.
 */
async function resolveUserRole(email) {
  const totalUsers = await User.countDocuments();

  if (totalUsers === 0 || serverEnv.adminEmails.includes(email)) {
    return "admin";
  }

  return "user";
}

/**
 * POST /api/auth/signup
 * Handles new user registration, role assignment, and initial verification email delivery.
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please fix the highlighted fields.", 400, formatZodError(parsed.error));
    }

    const { name, email, password } = parsed.data;
    const existingUser = await User.findOne({ email });

    // Handle existing accounts
    if (existingUser) {
      // If found but unverified, update details and resend the link
      if (!existingUser.emailVerified) {
        const verification = createVerificationToken();
        existingUser.name = name;
        existingUser.passwordHash = await hashPassword(password);
        existingUser.emailVerificationTokenHash = verification.tokenHash;
        existingUser.emailVerificationExpiresAt = verification.expiresAt;
        await existingUser.save();

        const origin = new URL(request.url).origin;
        const verificationUrl = buildVerificationUrl({
          email,
          token: verification.token,
          origin,
        });
        const delivery = await sendVerificationEmail({
          email,
          name,
          verificationUrl,
        });

        return successResponse({
          message: "This account already exists but is not verified yet. A fresh verification email has been sent.",
          data: {
            user: {
              id: String(existingUser._id),
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
              emailVerified: existingUser.emailVerified,
            },
            verificationRequired: true,
            delivery,
          },
        });
      }

      return errorResponse("EMAIL_IN_USE", "An account with this email already exists.", 409);
    }

    // Create a new user record
    const role = await resolveUserRole(email);
    const passwordHash = await hashPassword(password);
    const verification = createVerificationToken();
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      emailVerified: false,
      emailVerificationTokenHash: verification.tokenHash,
      emailVerificationExpiresAt: verification.expiresAt,
    });

    // Attempt to merge any existing guest wishlist into the new account
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get(GUEST_COOKIE_NAME)?.value;
    await mergeWishlistToUser(guestSessionId, user._id);

    // Build and send verification email
    const origin = new URL(request.url).origin;
    const verificationUrl = buildVerificationUrl({
      email,
      token: verification.token,
      origin,
    });
    const delivery = await sendVerificationEmail({
      email,
      name,
      verificationUrl,
    });

    return successResponse(
      {
        message: "Verification email sent. Please approve your account before logging in.",
        data: {
          user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
          verificationRequired: true,
          delivery,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse("SIGNUP_FAILED", error.message, 500);
  }
}
