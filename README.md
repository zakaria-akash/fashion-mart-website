# Fashion Mart Website Clone

Fashion Mart is a Next.js App Router fashion-commerce experience built from the provided references and extended through phased delivery into a MongoDB-backed application with authentication, product browsing, admin management, wishlist persistence, newsletter capture, and email verification.

## Current Status

- Phase 0 to Phase 5 implementation is now covered
- Internal APIs serve runtime product data from MongoDB
- DummyJSON is used only for seed/sync import
- Product images are served through GridFS file routes
- Signup requires email verification before login
- Session-aware header state swaps `Login` to `Log Out`

## Core Features

- User signup, login, logout, session lookup, resend verification, and email verification
- Catalogue browsing, dedicated fashion edit, product detail, wishlist, and lifestyle pages
- Newsletter capture with validation
- Admin product CRUD plus DummyJSON-to-Mongo sync
- Global toast feedback and refined motion polish

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

## Environment

Copy values into `.env.local` as needed:

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

## Documentation

- [AppOverview.md](AppOverview.md)
- [FrontendGuide.md](FrontendGuide.md)
- [BackendGuide.md](BackendGuide.md)
- [WorkFlow.md](WorkFlow.md)
- [QA_REPORT.md](QA_REPORT.md)
- [HANDOVER.md](HANDOVER.md)
- [RELEASE_READINESS.md](RELEASE_READINESS.md)
