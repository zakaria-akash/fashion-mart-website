import { errorResponse, successResponse } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth";
import { listProducts, serializeProduct, storeProductImageFromUrl } from "@/lib/products";
import { adminProductSchema, formatZodError } from "@/lib/validation";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

/**
 * Middleware-like helper to enforce admin session requirements.
 */
async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session?.sub || session.role !== "admin") {
    return null;
  }

  return session;
}

/**
 * Constructs a normalized product payload for admin-created items.
 */
function buildAdminProductPayload(input) {
  return {
    source: "internal",
    sourceId: null,
    // Generate a unique slug using title and timestamp
    slug: `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${Date.now()}`,
    title: input.title,
    tagline: `${input.brand || "Fashion Mart"} edit for elevated everyday styling.`,
    category: input.category,
    brand: input.brand || "Fashion Mart",
    description: input.description,
    price: input.price,
    rating: input.rating ?? 4.5,
    accent: "Admin curated",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Stone", "White"],
    highlights: ["Fresh admin drop", "Responsive catalogue ready", "Premium styling direction"],
    details: [
      input.description,
      "Added from the Fashion Mart admin panel.",
      "Available immediately across catalogue flows.",
    ],
    imageUrlFallback: "",
    imageAlt: input.title,
    featuredHome: false,
    featuredFavourite: false,
  };
}

/**
 * GET /api/admin/products
 * Retrieves all products with admin-level detail, sorted by newest.
 */
export async function GET() {
  try {
    await connectToDatabase();
    const adminSession = await requireAdmin();

    if (!adminSession) {
      return errorResponse("UNAUTHORIZED", "Admin access is required.", 401);
    }

    const data = await listProducts({ sort: "newest" });

    return successResponse({
      data,
      meta: {
        total: data.length,
      },
    });
  } catch (error) {
    return errorResponse("ADMIN_PRODUCTS_FETCH_FAILED", error.message, 500);
  }
}

/**
 * POST /api/admin/products
 * Creates a new product record. Handles image uploads to GridFS if a URL is provided.
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const adminSession = await requireAdmin();

    if (!adminSession) {
      return errorResponse("UNAUTHORIZED", "Admin access is required.", 401);
    }

    const json = await request.json();
    const parsed = adminProductSchema.safeParse(json);

    // Validate input against the admin product schema
    if (!parsed.success) {
      return errorResponse("INVALID_INPUT", "Please fix the highlighted fields.", 400, formatZodError(parsed.error));
    }

    const payload = buildAdminProductPayload(parsed.data);
    
    // Process external image URL and store in internal GridFS if possible
    const imageState = parsed.data.imageUrl
      ? await storeProductImageFromUrl(parsed.data.imageUrl, payload.slug)
      : {
          imageFileId: null,
          imageUrlFallback: "",
        };

    const product = await Product.create({
      ...payload,
      ...imageState,
    });

    return successResponse(
      {
        data: serializeProduct(product.toObject()),
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse("ADMIN_PRODUCT_CREATE_FAILED", error.message, 500);
  }
}
