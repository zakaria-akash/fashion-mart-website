import mongoose from "mongoose";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import {
  attachGuestCookie,
  getCurrentSession,
  getOrCreateGuestSession,
} from "@/lib/auth";
import { listProducts } from "@/lib/products";
import { WishlistEntry } from "@/models/WishlistEntry";

export const runtime = "nodejs";

/**
 * Resolves the query filter and session status for wishlist operations.
 * Supports both authenticated user IDs and anonymous guest session IDs.
 */
async function getWishlistOwner(request) {
  const session = await getCurrentSession();

  if (session?.sub) {
    return {
      query: { userId: session.sub },
      sessionId: null,
      shouldSetCookie: false,
    };
  }

  const guestSession = await getOrCreateGuestSession(request);

  return {
    query: { sessionId: guestSession.sessionId },
    sessionId: guestSession.sessionId,
    shouldSetCookie: guestSession.shouldSetCookie,
  };
}

/**
 * GET /api/wishlist
 * Retrieves the full list of products currently saved in the requester's wishlist.
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    const owner = await getWishlistOwner(request);
    
    // Find all entries for this owner
    const entries = await WishlistEntry.find(owner.query).sort({ createdAt: -1 }).lean();
    const productIds = entries.map((entry) => String(entry.productId));
    
    // Populate product details for the UI
    const products = productIds.length ? await listProducts({ ids: productIds }) : [];

    const response = successResponse({
      data: products,
      meta: {
        total: products.length,
      },
    });

    // Ensure guest cookie is set if this is a new anonymous session
    if (owner.shouldSetCookie) {
      attachGuestCookie(response, owner.sessionId);
    }

    return response;
  } catch (error) {
    return errorResponse("WISHLIST_FETCH_FAILED", error.message, 500);
  }
}

/**
 * POST /api/wishlist
 * Toggles a product's presence in the requester's wishlist (Add if missing, Remove if exists).
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const json = await request.json();
    const productId = json?.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("INVALID_PRODUCT_ID", "Please provide a valid product id.", 400);
    }

    const owner = await getWishlistOwner(request);
    const filter = owner.query.userId
      ? { productId, userId: owner.query.userId }
      : { productId, sessionId: owner.sessionId };

    const existing = await WishlistEntry.findOne(filter).lean();
    let wished;

    // Toggle logic
    if (existing) {
      await WishlistEntry.deleteOne({ _id: existing._id });
      wished = false;
    } else {
      await WishlistEntry.create(filter);
      wished = true;
    }

    const response = successResponse({
      data: {
        wished,
      },
    });

    if (owner.shouldSetCookie) {
      attachGuestCookie(response, owner.sessionId);
    }

    return response;
  } catch (error) {
    // Handle race conditions for concurrent adds gracefully
    if (error?.code === 11000) {
      return successResponse({
        data: {
          wished: true,
        },
      });
    }

    return errorResponse("WISHLIST_UPDATE_FAILED", error.message, 500);
  }
}
