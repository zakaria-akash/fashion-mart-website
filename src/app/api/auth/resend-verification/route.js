import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { buildVerificationUrl, createVerificationToken, sendVerificationEmail } from "@/lib/email";
import { formatZodError, resendVerificationSchema } from "@/lib/validation";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = resendVerificationSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please provide a valid email address.", 400, formatZodError(parsed.error));
    }

    const { email } = parsed.data;
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("ACCOUNT_NOT_FOUND", "No account exists for that email address.", 404);
    }

    if (user.emailVerified) {
      return successResponse({
        message: "This account is already verified. You can log in now.",
      });
    }

    const verification = createVerificationToken();
    user.emailVerificationTokenHash = verification.tokenHash;
    user.emailVerificationExpiresAt = verification.expiresAt;
    await user.save();

    const origin = new URL(request.url).origin;
    const verificationUrl = buildVerificationUrl({
      email,
      token: verification.token,
      origin,
    });
    const delivery = await sendVerificationEmail({
      email,
      name: user.name,
      verificationUrl,
    });

    return successResponse({
      message: "A fresh verification link has been sent to your email.",
      data: {
        delivery,
      },
    });
  } catch (error) {
    return errorResponse("RESEND_VERIFICATION_FAILED", error.message, 500);
  }
}
