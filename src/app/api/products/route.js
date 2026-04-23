import { listProducts } from "@/lib/products";
import { errorResponse, successResponse } from "@/lib/api-response";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "all";
    const search = searchParams.get("search") ?? "";
    const limit = searchParams.get("limit");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") ?? "featured";

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
