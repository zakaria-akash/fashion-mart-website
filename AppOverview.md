# App Overview

## Project Name

Fashion Mart Website Clone

## Purpose

Build a high-fidelity clone of the provided shopping website design with approximately 80 percent visual and structural accuracy, plus practical frontend and backend integration.

## Inputs Reviewed

- Visual references from Demo_Website_Figma_Images:
  - Hero section and full-page desktop/mobile compositions
  - Typography and color reference board
  - Mid-page section references (Favourite and app-download areas)
- Instruction_PDF.pdf requirements:
  - Clean layout and spacing
  - Responsive behavior
  - Structured, maintainable code
  - Backend integration for newsletter and product data

## Product Summary

The application is a fashion-commerce style landing page with the following key sections:

1. Top utility text line and primary navigation
2. Hero banner with CTA and highlighted word treatment
3. Brand strip/logo row
4. New Arrivals product cards
5. Promotional sale banner
6. Young's Favourite cards
7. App download teaser with phone mockup
8. Newsletter capture block
9. Footer with column links and social icons
10. Dedicated Lifestyle page linked from the header LIFESTYLE menu

## Core Functional Scope

1. Pixel-accurate layout reproduction for desktop and mobile references
2. Product content rendered from API data (not hardcoded) using DummyJSON as initial seed source
3. User authentication flow (Sign up and Login)
4. Product browsing experience with category-wise listing and product information
5. Wishlist interaction (mark and unmark favourite products) with persisted state
6. Dedicated Admin Portal: A fully isolated staff interface for product management
   - Secure staff login via hardcoded environment credentials
   - Specialized header/footer layout distinct from the public storefront
   - Premium Inventory Manager dashboard with split-panel CRUD operations
7. Newsletter email submission to backend with strict validation
8. Slight, elegant, and professional motion across key UI components
9. Header primary CTA set to Login, with elegant two-way navigation between Login and Sign Up pages
10. Integrated Shopping Cart with persistent global state, quantity controls, and guest session support
11. Simulated Checkout and Order Placement: authenticated users can complete a purchase via a secure checkout page with simulated payment processing, receiving a branded order confirmation email on success
12. My Orders Page: authenticated users can view their full order history with per-order item breakdowns, transaction IDs, and dates

## Design Direction (From Provided Assets)

- Primary background tone: warm cream/beige
- Accent yellow: #E6C744
- Core text color: #000000
- Surface white: #FFFFFF
- Muted cool gray accent: #C2C8DA
- Font family: Poppins (Regular, Medium, Black)

## Success Criteria

1. UI and layout are visibly aligned with reference screens
2. Spacing, type hierarchy, and section order match expected structure
3. Site remains responsive and stable across standard breakpoints
4. Backend-dependent features function correctly with clean data flow
5. Authentication, product browsing, wishlist, shopping cart, checkout, order history, and the specialized Admin Portal are fully functional
6. Staff-only routes are protected and inaccessible to client users
6. Subtle animations improve polish without hurting readability or performance
7. Codebase is modular and straightforward to maintain

## Constraints and Notes

- Keep implementation practical; avoid over-engineering
- Prioritize clean structure over unnecessary abstraction
- Data source strategy: use DummyJSON Products API for import/seeding, then serve data from MongoDB
- Backend stack preference: MongoDB for application data and GridFS for managed image/file storage
- Preserve section naming intent from references (for example, Favourite/Fovourite wording can be finalized during implementation)

## Out of Scope for Initial Build

- Real payment gateway integration (Stripe/PayPal) — checkout uses simulated processing
- CMS integration
- Complex analytics/event pipeline

## Delivery Readiness Checklist

- Section inventory finalized
- Design tokens finalized
- API contracts finalized
- Auth flow contracts finalized (signup and login)
- Product browsing and category filtering contracts finalized
- Wishlist data contract and persistence strategy finalized
- Admin panel product CRUD scope finalized
- Checkout flow and simulated payment contract finalized
- Order persistence and My Orders page scope finalized
- Order confirmation email template and delivery strategy finalized
- Source-to-database mapping finalized (DummyJSON fields to internal product schema)
- Animation tokens and motion rules finalized
- Folder structure and conventions finalized
- QA checklist drafted before implementation starts
