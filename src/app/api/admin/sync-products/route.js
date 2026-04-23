import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentSession } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { syncDummyJsonProducts } from "@/lib/products";

export const runtime = "nodejs";

function hasAdminAccess(request, session) {
  if (session?.role === "admin") {
    return true;
  }

  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return bearerToken === serverEnv.productSyncAdminToken;
}

export async function POST(request) {
  try {
    const session = await getCurrentSession();

    if (!hasAdminAccess(request, session)) {
      return errorResponse("UNAUTHORIZED", "Admin authorization is required for sync.", 401);
    }

    const json = await request.json().catch(() => ({}));
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
