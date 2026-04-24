# Handover

## Project State

Fashion Mart is now in a release-ready posture with a fully separated Client Storefront and Admin Portal.

- **Storefront**: MongoDB-backed products, wishlist, shopping cart, and auth flows.
- **Admin Portal**: Specialized staff interface with environment-locked master credentials.
- **Media**: GridFS-based image serving with high-performance caching.
- **Data**: DummyJSON sync into MongoDB as runtime source of truth.

## Local Setup

1. Install dependencies: `npm install`
2. Configure environment variables in `.env.local`
3. Start the app: `npm run dev`

## Environment Variables

- `MONGODB_URI`: Connection string
- `MONGODB_DB_NAME`: Database name (default: fashionMart)
- `GRIDFS_PRODUCT_BUCKET`: (default: product_images)
- `AUTH_JWT_SECRET`: Secure string for signing sessions
- `ADMIN_EMAILS`: Authorized staff emails (comma separated)
- `ADMIN_PASSWORD`: Hardcoded master password for Admin Portal
- `APP_BASE_URL`: (default: http://localhost:3000)
- `SMTP_*`: Standard mail configuration for user verification

## Key Routes & Navigation

### 🛒 Client Storefront
- Home: `/`
- Catalogue: `/products`
- Wishlist: `/wishlist`
- Login/Signup: `/login`, `/signup`

### 🛠️ Admin Portal
- **Entry**: "Admin" button in site footer (Legal column, opens in new tab).
- **Staff Login**: `/admin-login` (Isolated layout, staff credentials only).
- **Inventory Manager**: `/admin` (Protected dashboard for staff).

## API Overview

### 🔐 Authentication
- `POST /api/auth/signup`: Create standard user account.
- `POST /api/auth/login`: Authenticate standard user.
- `POST /api/auth/admin-login`: Specialized staff authorization (master credentials).
- `GET /api/auth/me`: Resolve current session (DB users or master-admin).
- `POST /api/auth/logout`: Terminate session.

### 📦 Catalogue & Management
- `GET /api/products`: Public catalogue data.
- `GET /api/admin/products`: Staff listing overview.
- `POST /api/admin/sync-products`: Trigger DummyJSON-to-MongoDB sync.
- `POST/PUT/DELETE /api/admin/products`: Staff CRUD operations.

## Sync & Rollback
1. Trigger sync via `/admin` dashboard button.
2. If undesirable data is ingested, restore MongoDB collection from snapshot.
3. Rerun sync after adjusting source filtering logic.
