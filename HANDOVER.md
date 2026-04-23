# Handover

## Project State

Fashion Mart is now in a release-ready Phase 5 posture with:

- MongoDB-backed products, newsletter, wishlist, and auth flows
- GridFS-based image serving
- DummyJSON sync into MongoDB as runtime source of truth
- Email-verification-based account activation
- Motion/accessibility polish for key user-facing sections

## Local Setup

1. Install dependencies:
   - `npm install`
2. Configure environment variables in `.env.local`
3. Start the app:
   - `npm run dev`
4. Validate production build:
   - `npm run build`
   - `npm run start`

## Environment Variables

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `GRIDFS_PRODUCT_BUCKET`
- `GRIDFS_MARKETING_BUCKET`
- `DUMMYJSON_BASE_URL`
- `PRODUCT_SYNC_ADMIN_TOKEN`
- `AUTH_JWT_SECRET`
- `APP_BASE_URL`
- `ADMIN_EMAILS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`

## Key Routes

- Public pages:
  - `/`
  - `/products`
  - `/products/[productId]`
  - `/fashion`
  - `/wishlist`
  - `/lifestyle`
  - `/login`
  - `/signup`
  - `/verify-email`
- Admin page:
  - `/admin`

## API Overview

- Auth:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/resend-verification`
- Products:
  - `GET /api/products`
  - `GET /api/products/[productId]`
- Wishlist:
  - `GET /api/wishlist`
  - `POST /api/wishlist`
  - `DELETE /api/wishlist/[productId]`
- Newsletter:
  - `POST /api/newsletter`
- Admin:
  - `GET /api/admin/products`
  - `POST /api/admin/products`
  - `PUT /api/admin/products/[productId]`
  - `DELETE /api/admin/products/[productId]`
  - `POST /api/admin/sync-products`
- Files:
  - `GET /api/files/[fileId]`

## DummyJSON Sync Runbook

1. Ensure MongoDB and SMTP env values are loaded.
2. Authenticate as an admin user or use the sync token.
3. Trigger:
   - `POST /api/admin/sync-products`
4. Expected outcome:
   - products upsert into MongoDB
   - remote images store in GridFS
   - the app serves products from internal APIs only

## Rollback Notes

- If a sync introduces undesirable content:
  - restore the affected MongoDB collections from backup or Atlas snapshot
  - rerun sync only after adjusting source filtering logic
- If SMTP delivery becomes unstable:
  - keep account creation active
  - use resend verification once credentials are corrected
  - optionally switch to preview-mode locally by clearing SMTP vars

## Known Limitations

- Email delivery quality depends on SMTP sender reputation and receiving inbox classification.
- Footer utility links are placeholder destinations.
- The current auth system is stable, but a larger account-system redesign is still planned.
