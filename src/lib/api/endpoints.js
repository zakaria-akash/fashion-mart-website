/**
 * Constant definitions for all internal API endpoints.
 * Used by client-side components to interact with Next.js route handlers.
 */
export const apiEndpoints = {
  authSignup: "/api/auth/signup",
  authLogin: "/api/auth/login",
  authAdminLogin: "/api/auth/admin-login",
  authMe: "/api/auth/me",
  authLogout: "/api/auth/logout",
  authVerifyEmail: "/api/auth/verify-email",
  authResendVerification: "/api/auth/resend-verification",
  products: "/api/products",
  wishlist: "/api/wishlist",
  adminProducts: "/api/admin/products",
  adminSyncProducts: "/api/admin/sync-products",
  newsletter: "/api/newsletter",
};
