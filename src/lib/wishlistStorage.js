const WISHLIST_KEY = "fashion-mart-wishlist";

export function getWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(WISHLIST_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setWishlistIds(ids) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

export function toggleWishlistId(id) {
  const current = getWishlistIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  setWishlistIds(next);
  return next;
}