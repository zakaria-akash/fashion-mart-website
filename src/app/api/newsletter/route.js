import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { formatZodError, newsletterSchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * POST /api/newsletter
 * Captures and validates user emails for the shopping community newsletter.
 * Prevents duplicate subscriptions for already registered emails.
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const parsed = newsletterSchema.safeParse(json);

    // Zod validation check
    if (!parsed.success) {
      return errorResponse("INVALID_EMAIL", "Please provide a valid email address", 400, formatZodError(parsed.error));
    }

    const { email } = parsed.data;
    
    // Check for existing subscriber
    const existing = await NewsletterSubscriber.findOne({ email }).lean();

    if (existing) {
      return successResponse({
        message: "You are already subscribed.",
      });
    }

    // Persist new subscriber record
    await NewsletterSubscriber.create({ email });

    return successResponse({
      message: "Subscribed successfully",
    });
  } catch (error) {
    return errorResponse("NEWSLETTER_SUBSCRIBE_FAILED", error.message, 500);
  }
}
