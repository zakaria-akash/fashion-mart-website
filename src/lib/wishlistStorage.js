import { apiEndpoints } from "@/lib/api/endpoints";
import { requestJson } from "@/lib/api/request";

export async function fetchWishlistProducts() {
  const payload = await requestJson(apiEndpoints.wishlist);
  return payload.data ?? [];
}

export async function toggleWishlistId(productId) {
  const payload = await requestJson(apiEndpoints.wishlist, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

  return payload.data?.wished ?? false;
}

export async function removeWishlistId(productId) {
  const payload = await requestJson(`${apiEndpoints.wishlist}/${productId}`, {
    method: "DELETE",
  });

  return payload.data?.wished ?? false;
}
