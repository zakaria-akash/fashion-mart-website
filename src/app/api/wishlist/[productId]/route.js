import mongoose from "mongoose";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import {
  attachGuestCookie,
  getCurrentSession,
  getOrCreateGuestSession,
} from "@/lib/auth";
import { WishlistEntry } from "@/models/WishlistEntry";

export const runtime = "nodejs";

/**
 * DELETE /api/wishlist/[productId]
 * Removes a specific product from the current user's or guest's wishlist.
 */
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { productId } = await params;

    // Id validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("INVALID_PRODUCT_ID", "Please provide a valid product id.", 400);
    }

    // Determine ownership (User ID or Guest Session ID)
    const session = await getCurrentSession();
    const guest = session?.sub ? null : await getOrCreateGuestSession(request);
    const filter = session?.sub
      ? { productId, userId: session.sub }
      : { productId, sessionId: guest.sessionId };

    // Perform the deletion
    await WishlistEntry.deleteOne(filter);

    const response = successResponse({
      data: {
        wished: false,
      },
    });

    // Ensure guest session is persisted if it's new
    if (guest?.shouldSetCookie) {
      attachGuestCookie(response, guest.sessionId);
    }

    return response;
  } catch (error) {
    return errorResponse("WISHLIST_DELETE_FAILED", error.message, 500);
  }
}
