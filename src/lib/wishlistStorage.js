import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";

/**
 * Wishlist Storage Utils
 * Provides a standardized client-side interface for interacting with the wishlist API.
 * Handles both authenticated and guest session persistence automatically via backend cookies.
 */

/**
 * Fetches all products currently in the user's/guest's wishlist.
 */
export async function fetchWishlistProducts() {
  const payload = await requestJson(apiEndpoints.wishlist);
  return payload.data ?? [];
}

/**
 * Toggles a product in the wishlist (adds if absent, removes if present).
 * Returns the final 'wished' status for UI updates.
 */
export async function toggleWishlistId(productId) {
  const payload = await requestJson(apiEndpoints.wishlist, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

  return payload.data?.wished ?? false;
}

/**
 * Explicitly removes a product from the wishlist.
 */
export async function removeWishlistId(productId) {
  const payload = await requestJson(`${apiEndpoints.wishlist}/${productId}`, {
    method: "DELETE",
  });

  return payload.data?.wished ?? false;
}
