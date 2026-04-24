# Backend Guide

## Objective

Define a minimal, production-minded backend plan that satisfies the required task features while keeping implementation simple and maintainable.

## Requirement Mapping (From Instruction PDF)

### Required

1. Newsletter and email capture with robust validation.
2. Product data served from API with no hardcoded product UI data.
3. User authentication (signup and login).
4. Product browsing API with category-based filtering.
5. Wishlist persistence for mark and unmark favourite actions.
6. Basic admin product management (add and manage listings).

### Optional but Recommended

1. Wishlist and favourites persistence.

## Recommended Architecture

### Preferred Stack (Primary)

- Database: MongoDB
- File storage: MongoDB GridFS
- API layer: Next.js route handlers or Node.js plus Express
- ODM: Mongoose

### Runtime Layout Options

- Monolith: Next.js app plus route handlers plus MongoDB connection
- Split services: Express API plus Next.js frontend

For this project scope, Next.js with MongoDB and GridFS is the default recommendation.

## External Seed Source

- Primary seed API: DummyJSON Products API
- Usage model: fetch external data, normalize it, store in MongoDB, and serve only from internal endpoints
- Goal: keep UI stable and independent from third-party API availability

## Data Model

### Collection: products

- _id: ObjectId (primary key)
- source: string (example: dummyjson)
- source_id: string or number (unique with source)
- slug: string (unique index)
- title: string (required)
- category: string (required)
- brand: string (optional)
- description: string (optional)
- image_file_id: ObjectId (GridFS reference)
- image_alt: string (optional)
- price: number (optional)
- created_at: timestamp
- updated_at: timestamp

### Collection: newsletter_subscribers

- _id: ObjectId (primary key)
- email: string (required, unique index)
- source: string (optional, default: homepage_newsletter)
- created_at: timestamp

### Collection: favourites (optional)

- _id: ObjectId (primary key)
- item_id: ObjectId or slug (required)
- session_id or user_id: string (required, indexed)
- created_at: timestamp

### Collection: orders

- _id: ObjectId (primary key)
- userId: ObjectId (ref: users, required, indexed)
- items: array of embedded line items
  - productId: ObjectId (ref: products)
  - title: string
  - price: number
  - quantity: number
  - size: string (optional)
  - color: string (optional)
- total: number (required)
- transactionId: string (required, unique)
- created_at: timestamp
- updated_at: timestamp

### Collection: users

- _id: ObjectId (primary key)
- name: string (required)
- email: string (required, unique index)
- password_hash: string (required)
- role: string (enum: user, admin)
- created_at: timestamp
- updated_at: timestamp

### GridFS Buckets

- product_images: product and card visuals
- marketing_assets: banners and promotional media

## API Contract

### Frontend Route Contract Notes

- Header LIFESTYLE menu points to a dedicated `/lifestyle` page and does not route to login.
- Header primary authentication CTA is `Login`.
- Login and signup pages include direct two-way navigation for smooth auth entry.

### GET /api/products

Purpose:

- Return product items for New Arrivals and related card sections.

Query parameters (optional):

- category
- limit
- sort
- search

Notes:

- Endpoint must read from MongoDB collection only.
- Do not proxy third-party DummyJSON responses directly to UI.

### POST /api/admin/sync-products

Purpose:

- Pull products from DummyJSON, normalize fields, and upsert into MongoDB.

Behavior:

- Upsert key: source plus source_id
- Optional mode: dryRun to preview insert and update counts
- Optional mode: download images and store binary files in GridFS

Success response example:

```json
{
  "success": true,
  "source": "dummyjson",
  "fetched": 30,
  "inserted": 12,
  "updated": 18,
  "imagesStored": 30
}
```

### POST /api/auth/signup

Purpose:

- Register a new user account.

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strong-password"
}
```

### POST /api/auth/login

Purpose:

- Authenticate an existing public user and create a session/token.

### POST /api/auth/admin-login

Purpose:

- Specialized authentication for staff members using environment-locked master credentials.
- Bypasses standard user database for the master admin check.

### GET /api/auth/me

Purpose:

- Resolve current session identity.
- Supports both database-backed users and hardcoded master admin profiles.

Request body:

```json
{
  "email": "jane@example.com",
  "password": "strong-password"
}
```

Response example:

```json
{
  "data": [
    {
      "id": "661f4fd8a0b4e5eab95d0001",
      "slug": "hoodies-sweatshirt",
      "title": "Hoodies & Sweatshirt",
      "category": "new-arrivals",
      "imageUrl": "/api/files/661f4fd8a0b4e5eab95d0101",
      "price": 49.99
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### GET /api/files/:fileId

Purpose:

- Stream image or file content from GridFS by id.

Response:

- Binary stream with content-type and cache headers.

Notes:

- This route should serve product images from GridFS.
- Add safe caching headers for performance.

### POST /api/newsletter

Purpose:

- Capture email from the Join Shopping Community form.

Request body:

```json
{
  "email": "person@samplemail.com"
}
```

Validation rules:

1. Required
2. Trim whitespace
3. Lowercase normalize
4. RFC-compliant email format check
5. Deterministic duplicate handling

Success response:

```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

Error response example:

```json
{
  "success": false,
  "code": "INVALID_EMAIL",
  "message": "Please provide a valid email address"
}
```

### POST /api/checkout

Purpose:

- Process a simulated payment and persist an authenticated user's order to MongoDB.
- Sends a branded HTML order confirmation email to the user on success.

Authorization:

- Requires valid user session cookie. Returns 401 if unauthenticated.

Request body:

```json
{
  "items": [
    { "id": "...", "title": "Hoodie", "price": 49.99, "quantity": 2, "size": "M", "color": "Black" }
  ],
  "total": 99.98
}
```

Behavior:

- Validates session and cart contents (returns 400 for empty cart).
- Simulates a 1-second payment latency.
- Persists the order to the `orders` collection with a generated `transactionId` (`ch_<random>`).
- Sends a styled HTML confirmation email via Nodemailer (non-blocking — email failures do not cancel the order).

Success response:

```json
{
  "success": true,
  "data": {
    "message": "Order placed successfully.",
    "transactionId": "ch_abc123"
  }
}
```

Notes:

- `nodemailer` must be listed in `serverExternalPackages` in `next.config.mjs` to avoid Turbopack bundling conflicts.
- Email delivery degrades gracefully to a console preview in development when SMTP is not configured.

### GET /api/orders

Purpose:

- Return the authenticated user's full order history, sorted newest first.

Authorization:

- Requires valid user session cookie. Returns 401 if unauthenticated.

Response example:

```json
{
  "success": true,
  "data": [
    {
      "id": "661f4fd8a0b4e5eab95d0042",
      "transactionId": "ch_abc123",
      "total": 99.98,
      "createdAt": "2025-04-24T10:30:00.000Z",
      "items": [
        { "productId": "...", "title": "Hoodie", "price": 49.99, "quantity": 2, "size": "M", "color": "Black" }
      ]
    }
  ]
}
```

### Optional Favourites Endpoints

- GET /api/favourites?sessionId=...
- POST /api/favourites
- DELETE /api/favourites/:itemId

### Admin Product Management Endpoints

- POST /api/admin/products
- PUT /api/admin/products/:id
- DELETE /api/admin/products/:id
- GET /api/admin/products

If backend persistence is postponed, a localStorage fallback is acceptable for MVP.

## Validation and Security

1. Server-side validation is mandatory, even with client validation.
2. Apply basic rate limiting on newsletter endpoint.
3. Sanitize and validate all query and body inputs.
4. Restrict CORS when using a separate API host.
5. Never expose server secrets in client bundles.
6. Validate ObjectId parameters before database calls.
7. Restrict upload MIME types and file size for GridFS.
8. Protect sync endpoint with admin secret or internal-only access.
9. Hash passwords using a strong algorithm (bcrypt/argon2).
10. Enforce admin authorization on all admin product endpoints.

## Environment Variables

- MONGODB_URI
- MONGODB_DB_NAME
- GRIDFS_PRODUCT_BUCKET
- GRIDFS_MARKETING_BUCKET
- NEXT_PUBLIC_API_BASE_URL (only when frontend and API are split)
- DUMMYJSON_BASE_URL
- PRODUCT_SYNC_ADMIN_TOKEN
- AUTH_JWT_SECRET
  - ADMIN_EMAILS
  - ADMIN_PASSWORD
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USER
  - SMTP_PASS
  - SMTP_FROM_EMAIL
  - SMTP_FROM_NAME

## Error Handling Standard

Return structured JSON errors with predictable shape.

- success: false
- code: machine-readable code
- message: user-safe summary
- details: optional field-level metadata

## Testing Strategy

### API Tests

- Newsletter endpoint accepts valid email.
- Newsletter endpoint rejects empty and invalid email.
- Newsletter endpoint handles duplicates gracefully.
- Products endpoint returns expected payload shape.
- Products endpoint supports filter and limit behavior.
- Files endpoint streams valid GridFS ids.
- Files endpoint returns not found for invalid or missing ids.
- Sync endpoint upserts DummyJSON items without creating duplicates.
- Sync endpoint handles source downtime and partial failures safely.
- Signup endpoint validates input and prevents duplicate email registration.
- Login endpoint validates credentials and returns session/token.
- Wishlist endpoints support mark and unmark flows correctly.
- Admin product endpoints enforce authorization and perform CRUD correctly.
- Checkout endpoint rejects unauthenticated and empty-cart requests.
- Checkout endpoint persists a complete order document including all line items.
- Checkout endpoint triggers a confirmation email without blocking the order response.
- Orders endpoint returns scoped history for the requesting user only.
- Orders endpoint correctly rejects unauthenticated requests.

### Integration Checks

- New Arrivals UI renders API response correctly.
- Newsletter UI handles success and error responses correctly.
- Auth UI integrates with signup/login APIs.
- Product browsing UI reads category-filtered product data.
- Wishlist UI reflects saved favourites state.
- Admin panel can create and manage products end to end.
- Checkout endpoint saves orders and sends confirmation emails.
- Orders history endpoint scopes results to the authenticated user.

## Deployment Notes

- Keep frontend and backend deployable together for simplicity.
- Seed products collection before UI binding.
- Upload initial assets into GridFS buckets before data hookup.
- Add lightweight endpoint error logging.
- Schedule product sync as manual trigger or periodic job based on project needs.

## Definition of Done

1. Products endpoint provides stable UI-ready data.
2. Signup and login endpoints are functional and secure.
3. Product browsing supports category filtering and search.
4. Favourites persistence supports mark and unmark flows.
5. Admin panel backend endpoints support product CRUD with authorization.
6. Newsletter endpoint stores validated emails.
7. Error responses follow the standard shape.
8. DummyJSON-to-MongoDB sync pipeline is implemented and documented.
9. Basic endpoint tests or validation scripts pass.
10. Checkout endpoint saves orders and sends transactional emails.
11. Orders history endpoint returns scoped, correctly shaped data.
