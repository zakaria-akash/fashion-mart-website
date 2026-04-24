const requiredServerEnv = ["MONGODB_URI", "AUTH_JWT_SECRET"];

/**
 * Retrieves an environment variable with an optional fallback value.
 */
function getEnv(name, fallback = "") {
  return process.env[name] ?? fallback;
}

/**
 * Validates that all critical server-side environment variables are present.
 * Should be called at the start of database or security operations.
 */
export function assertServerEnv() {
  const missing = requiredServerEnv.filter((name) => !getEnv(name));

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

/**
 * Centralized environment configuration for the server.
 * Provides typed and defaulted access to environment settings.
 */
export const serverEnv = {
  // Database configuration
  mongodbUri: getEnv("MONGODB_URI"),
  mongodbDbName: getEnv("MONGODB_DB_NAME", "fashionMart"),
  
  // Storage buckets for GridFS
  gridfsProductBucket: getEnv("GRIDFS_PRODUCT_BUCKET", "product_images"),
  gridfsMarketingBucket: getEnv("GRIDFS_MARKETING_BUCKET", "marketing_assets"),
  
  // External service URLs and tokens
  dummyJsonBaseUrl: getEnv("DUMMYJSON_BASE_URL", "https://dummyjson.com"),
  productSyncAdminToken: getEnv("PRODUCT_SYNC_ADMIN_TOKEN", "fashion-mart-sync-token"),
  
  // Security and session configuration
  authJwtSecret: getEnv("AUTH_JWT_SECRET", "fashion-mart-dev-secret-change-me"),
  appBaseUrl: getEnv("APP_BASE_URL", "http://localhost:3000"),
  
  // Role-based access configuration
  adminEmails: getEnv("ADMIN_EMAILS", "admin@fashionmart.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
  adminPassword: getEnv("ADMIN_PASSWORD", "admin12345"),
    
  // SMTP configuration for email delivery
  smtpHost: getEnv("SMTP_HOST"),
  smtpPort: Number(getEnv("SMTP_PORT", "587")),
  smtpUser: getEnv("SMTP_USER"),
  smtpPass: getEnv("SMTP_PASS"),
  smtpFromEmail: getEnv("SMTP_FROM_EMAIL", "no-reply@fashionmart.local"),
  smtpFromName: getEnv("SMTP_FROM_NAME", "Fashion Mart"),
};
