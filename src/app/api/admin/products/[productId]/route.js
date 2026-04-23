import mongoose from "mongoose";
import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import { serializeProduct, storeProductImageFromUrl } from "@/lib/products";
import { adminProductSchema, formatZodError } from "@/lib/validation";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

/**
 * Ensures the requester has an active admin session.
 */
async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session?.sub || session.role !== "admin") {
    return null;
  }

  return session;
}

/**
 * PUT /api/admin/products/[productId]
 * Updates an existing product. Manages GridFS image updates if a new URL is provided.
 */
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const adminSession = await requireAdmin();

    if (!adminSession) {
      return errorResponse("UNAUTHORIZED", "Admin access is required.", 401);
    }

    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("INVALID_PRODUCT_ID", "Please provide a valid product id.", 400);
    }

    const json = await request.json();
    const parsed = adminProductSchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please fix the highlighted fields.", 400, formatZodError(parsed.error));
    }

    const existing = await Product.findById(productId).lean();

    if (!existing) {
      return errorResponse("PRODUCT_NOT_FOUND", "Product not found.", 404);
    }

    // Update image storage if a new URL is provided, otherwise keep existing
    const imageState = parsed.data.imageUrl
      ? await storeProductImageFromUrl(parsed.data.imageUrl, existing.slug, existing.imageFileId)
      : {
          imageFileId: existing.imageFileId ?? null,
          imageUrlFallback: existing.imageUrlFallback ?? "",
        };

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          title: parsed.data.title,
          category: parsed.data.category,
          brand: parsed.data.brand,
          description: parsed.data.description,
          price: parsed.data.price,
          rating: parsed.data.rating ?? 4.5,
          imageFileId: imageState.imageFileId,
          imageUrlFallback: imageState.imageUrlFallback,
          imageAlt: parsed.data.title,
          details: [
            parsed.data.description,
            "Refined and updated in the Fashion Mart admin panel.",
            "Available immediately across catalogue flows.",
          ],
        },
      },
      { new: true }
    ).lean();

    return successResponse({
      data: serializeProduct(updated),
    });
  } catch (error) {
    return errorResponse("ADMIN_PRODUCT_UPDATE_FAILED", error.message, 500);
  }
}

/**
 * DELETE /api/admin/products/[productId]
 * Permanently removes a product from the database.
 */
export async function DELETE(_request, { params }) {
  try {
    await connectToDatabase();
    const adminSession = await requireAdmin();

    if (!adminSession) {
      return errorResponse("UNAUTHORIZED", "Admin access is required.", 401);
    }

    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse("INVALID_PRODUCT_ID", "Please provide a valid product id.", 400);
    }

    const deleted = await Product.findByIdAndDelete(productId).lean();

    if (!deleted) {
      return errorResponse("PRODUCT_NOT_FOUND", "Product not found.", 404);
    }

    return successResponse({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return errorResponse("ADMIN_PRODUCT_DELETE_FAILED", error.message, 500);
  }
}
