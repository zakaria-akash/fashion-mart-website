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

export async function GET(request) {
  try {
    await connectToDatabase();
    const owner = await getWishlistOwner(request);
    const entries = await WishlistEntry.find(owner.query).sort({ createdAt: -1 }).lean();
    const productIds = entries.map((entry) => String(entry.productId));
    const products = productIds.length ? await listProducts({ ids: productIds }) : [];

    const response = successResponse({
      data: products,
      meta: {
        total: products.length,
      },
    });

    if (owner.shouldSetCookie) {
      attachGuestCookie(response, owner.sessionId);
    }

    return response;
  } catch (error) {
    return errorResponse("WISHLIST_FETCH_FAILED", error.message, 500);
  }
}

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
