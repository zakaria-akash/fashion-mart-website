const requiredServerEnv = ["MONGODB_URI", "AUTH_JWT_SECRET"];

function getEnv(name, fallback = "") {
  return process.env[name] ?? fallback;
}

export function assertServerEnv() {
  const missing = requiredServerEnv.filter((name) => !getEnv(name));

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export const serverEnv = {
  mongodbUri: getEnv("MONGODB_URI"),
  mongodbDbName: getEnv("MONGODB_DB_NAME", "fashionMart"),
  gridfsProductBucket: getEnv("GRIDFS_PRODUCT_BUCKET", "product_images"),
  gridfsMarketingBucket: getEnv("GRIDFS_MARKETING_BUCKET", "marketing_assets"),
  dummyJsonBaseUrl: getEnv("DUMMYJSON_BASE_URL", "https://dummyjson.com"),
  productSyncAdminToken: getEnv("PRODUCT_SYNC_ADMIN_TOKEN", "fashion-mart-sync-token"),
  authJwtSecret: getEnv("AUTH_JWT_SECRET", "fashion-mart-dev-secret-change-me"),
  adminEmails: getEnv("ADMIN_EMAILS", "admin@fashionmart.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
};
