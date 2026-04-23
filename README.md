# Fashion Mart Website Clone

A high-fidelity one-page fashion website clone built with Next.js, designed from provided desktop and mobile references and prepared for phased expansion into dynamic product and user features.

## Current Direction

The UI foundation is in place and the project is now prepared to evolve into a dynamic application with backend integration and role-based workflows.

## Mandatory Product Scope

- User authentication: signup and login
- Product browsing with category-based display
- Wishlist: mark and unmark favourite products
- Basic admin panel to:
  - Add products
  - Manage product listings

## Data and Backend Direction

- Seed product source: DummyJSON Products API
- Runtime source of truth: MongoDB
- File/image storage: MongoDB GridFS
- API runtime: Next.js route handlers (or Express split service if needed)

## Project Documentation

- [AppOverview.md](AppOverview.md)
- [FrontendGuide.md](FrontendGuide.md)
- [BackendGuide.md](BackendGuide.md)
- [WorkFlow.md](WorkFlow.md)

## Development Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notes

- Shared shell components such as header and footer are placed in app layout for multi-page scalability.
- UI components are structured to support incremental migration from static content to API-driven data.
