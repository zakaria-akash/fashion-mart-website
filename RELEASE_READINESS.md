# Release Readiness

## Final Checklist

- `npm run lint` passes
- `npm run build` passes
- MongoDB environment variables are present
- SMTP environment variables are present for real verification email delivery
- `APP_BASE_URL` matches the deployed host
- First admin email is included in `ADMIN_EMAILS` or created intentionally as the first account
- DummyJSON sync token is stored securely if used outside admin UI

## Deployment Notes

- Recommended deployment shape:
  - single Next.js deployment with Node runtime support
  - MongoDB Atlas for data and GridFS
- After deploy:
  1. confirm env vars in host dashboard
  2. run a production signup + verification test
  3. confirm `/api/products` returns Mongo-backed data
  4. confirm admin sync is protected and operational

## Regression Sweep

- Landing page renders and animates without layout shift
- Product browse, detail, wishlist, and fashion pages work with backend data
- Signup requires email verification before login
- Header reflects active session state and exposes logout
- Newsletter submissions validate and persist correctly
- Admin CRUD and sync routes remain available only to authorized sessions
