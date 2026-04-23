import { errorResponse, successResponse } from "@/lib/api-response";
import { getProductById, getRelatedProducts } from "@/lib/products";

export const runtime = "nodejs";

/**
 * GET /api/products/[productId]
 * Retrieves full details for a single product plus a list of related recommendations.
 */
export async function GET(_request, { params }) {
  try {
    const { productId } = await params;
    const product = await getProductById(productId);

    if (!product) {
      return errorResponse("PRODUCT_NOT_FOUND", "Product not found.", 404);
    }

    // Fetch recommendations based on current product category
    const relatedProducts = await getRelatedProducts(product.id, product.category);

    return successResponse({
      data: product,
      relatedProducts,
    });
  } catch (error) {
    return errorResponse("PRODUCT_FETCH_FAILED", error.message, 500);
  }
}
