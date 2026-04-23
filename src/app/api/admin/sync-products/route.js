import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { syncDummyJsonProducts } from "@/lib/products";

export const runtime = "nodejs";

/**
 * Validates admin access via session or Bearer token for automated tasks.
 */
function hasAdminAccess(request, session) {
  // Session check for interactive admin UI
  if (session?.role === "admin") {
    return true;
  }

  // Token check for external CI/CD or CRON triggers
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return bearerToken === serverEnv.productSyncAdminToken;
}

/**
 * POST /api/admin/sync-products
 * Triggers the synchronization of DummyJSON fashion items into the local MongoDB.
 * Supports image processing and storage in internal GridFS.
 */
export async function POST(request) {
  try {
    const session = await getCurrentSession();

    if (!hasAdminAccess(request, session)) {
      return errorResponse("UNAUTHORIZED", "Admin authorization is required for sync.", 401);
    }

    const json = await request.json().catch(() => ({}));
    
    // Execute sync using the product library utility
    const result = await syncDummyJsonProducts({
      dryRun: Boolean(json?.dryRun),
      storeImages: json?.storeImages !== false,
      initiatedBy: session?.email || "admin-token",
    });

    return successResponse(result);
  } catch (error) {
    return errorResponse("PRODUCT_SYNC_FAILED", error.message, 500);
  }
}
