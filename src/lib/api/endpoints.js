export const apiEndpoints = {
  authSignup: "/api/auth/signup",
  authLogin: "/api/auth/login",
  products: "/api/products",
  wishlist: "/api/wishlist",
  adminProducts: "/api/admin/products",
  newsletter: "/api/newsletter",
};

export function normalizeDummyJsonProduct(item) {
  return {
    sourceId: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    rating: item.rating,
    category: item.category,
    imageUrl: item.thumbnail,
  };
}