import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { formatZodError, newsletterSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = newsletterSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse("INVALID_EMAIL", "Please provide a valid email address", 400, formatZodError(parsed.error));
    }

    const { email } = parsed.data;
    const existing = await NewsletterSubscriber.findOne({ email }).lean();

    if (existing) {
      return successResponse({
        message: "You are already subscribed.",
      });
    }

    await NewsletterSubscriber.create({ email });

    return successResponse({
      message: "Subscribed successfully",
    });
  } catch (error) {
    return errorResponse("NEWSLETTER_SUBSCRIBE_FAILED", error.message, 500);
  }
}
