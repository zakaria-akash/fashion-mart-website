import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { hashVerificationToken } from "@/lib/email";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const email = typeof json?.email === "string" ? json.email.trim().toLowerCase() : "";
    const token = typeof json?.token === "string" ? json.token.trim() : "";

    if (!email || !token) {
      return errorResponse("INVALID_VERIFICATION_LINK", "This verification link is invalid.", 400);
    }

    const tokenHash = hashVerificationToken(token);
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("ACCOUNT_NOT_FOUND", "No account was found for this verification link.", 404);
    }

    if (user.emailVerified) {
      return successResponse({
        message: "Your account is already verified. You can log in now.",
      });
    }

    const isValidToken =
      user.emailVerificationTokenHash === tokenHash &&
      user.emailVerificationExpiresAt &&
      user.emailVerificationExpiresAt.getTime() > Date.now();

    if (!isValidToken) {
      return errorResponse("VERIFICATION_EXPIRED", "This verification link has expired. Please request a new one.", 400);
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    return successResponse({
      message: "Email verified successfully. Please log in to continue.",
    });
  } catch (error) {
    return errorResponse("EMAIL_VERIFICATION_FAILED", error.message, 500);
  }
}
