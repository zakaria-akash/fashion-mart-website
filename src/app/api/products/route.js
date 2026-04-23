import { listProducts } from "@/lib/products";
import { errorResponse, successResponse } from "@/lib/api-response";

export const runtime = "nodejs";

/**
 * GET /api/products
 * Public endpoint for retrieving and filtering the product catalogue.
 * Supports category filtering, text search, limit, and sorting.
 */
export async function GET(request) {
  try {
    // Parse query parameters for flexible browsing
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "all";
    const search = searchParams.get("search") ?? "";
    const limit = searchParams.get("limit");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") ?? "featured";

    // Fetch from internal MongoDB via product lib
    const data = await listProducts({
      category,
      search,
      limit,
      featured,
      sort,
    });

    return successResponse({
      data,
      meta: {
        total: data.length,
        category,
        search,
        featured,
      },
    });
  } catch (error) {
    return errorResponse("PRODUCTS_FETCH_FAILED", error.message, 500);
  }
}
