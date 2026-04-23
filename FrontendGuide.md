# Frontend Guide

## Objective

Provide an implementation blueprint for recreating the supplied website visuals with strong structure, responsiveness, and maintainability.

## Motion Requirement

Use slight, elegant, professional animation across key components. Motion should support hierarchy and feedback, not distract from content.

## Recommended Frontend Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS utilities with a small reusable component class layer
- Image handling: next/image for optimized loading
- State: React state for local interactions and API-driven content from internal backend endpoints

## Feature Modules (Mandatory)

- Authentication: signup and login screens with validation feedback
- Product Browsing: category-aware product listing and filtering UI
- Wishlist: mark and unmark favourites from product cards and persist state
- Admin Panel: product management screens to add and maintain listings

## Data Source Strategy

- Seed source: DummyJSON Products API (import/sync only)
- Runtime source: internal API backed by MongoDB
- Image delivery: internal file endpoints backed by GridFS
- Frontend rule: never call DummyJSON directly from UI components in production flow

## Design Tokens

Define these before implementation starts.

### Colors

- --color-bg-main: #EFE8B0
- --color-accent: #E6C744
- --color-text: #000000
- --color-surface: #FFFFFF
- --color-muted: #C2C8DA
- --color-section-bg: #F4F4F4

### Typography

- Font family: Poppins
- Weights: 400 (Regular), 500 (Medium), 900 (Black)
- Hero title: 56 to 72 px desktop, 36 to 44 px mobile
- Section heading: 36 to 48 px desktop, 28 to 32 px mobile
- Card title: 24 to 28 px
- Body text: 16 to 20 px
- Small text: 12 to 14 px

### Spacing and Radius

- Max content width: 1200 to 1320 px
- Section rhythm: 72 to 120 px desktop, 48 to 72 px mobile
- Card radius: 16 to 24 px
- CTA radius: 8 to 12 px

### Motion Tokens

- Easing: ease-out or cubic-bezier(0.22, 1, 0.36, 1)
- Fast transition: 160 to 220 ms
- Medium transition: 260 to 360 ms
- Transform offset: 4 to 12 px
- Hover scale cap: 1.02
- Opacity transitions: 0 to 1 with short stagger

## Page Information Architecture

1. Header/Nav
1. Hero plus CTA
1. Brand Logos Strip
1. New Arrivals Grid
1. Promo Banner
1. Young's Favourite Cards
1. App Download Promo
1. Newsletter CTA
1. Footer
1. Authentication Pages (Sign up and Login)
1. Product Browsing Page (catalog and category filters)
1. Wishlist Page (favourite products)
1. Admin Panel (add product and manage listings)

## Component Breakdown

- Header: logo, nav links, signup button
- Hero Section: heading group, supporting copy, CTA, hero image
- Brand Strip: horizontal logo row
- Product Card: image, title, support line, arrow affordance
- Promo Banner: promotional image, offer copy, CTA
- Favourite Cards: two featured cards side by side
- App Download Section: copy, store badges, device mockup
- Newsletter Section: heading, subtitle, email form
- Footer: brand block, social icons, link columns
- Auth Form: reusable input and submit states for signup/login
- Product Grid: reusable card list for category-based browsing
- Wishlist Toggle: reusable favourite control with active/inactive states
- Admin Product Form: product create/update form with validation
- Admin Product Table/List: manage existing product records

## Animation Plan by Section

- Header/Nav: subtle hover transitions on links and primary button
- Hero: fade-up entrance on text blocks and gentle image reveal
- Brand Strip: soft fade-in on viewport entry
- Product and Favourite Cards: hover lift and soft shadow transition
- Promo Banner: CTA hover and focus transitions
- App Download: phone mockup fade and slide-in on first viewport entry
- Newsletter: focus-ring and button-state transitions
- Footer: simple link color transitions only

## Motion Accessibility

1. Respect prefers-reduced-motion by removing entrance effects.
1. Avoid autoplay looping effects that compete with readability.
1. Keep motion low amplitude and purpose-driven.

## Responsive Strategy

Use a mobile-first layout with these breakpoints.

- sm: 640 px
- md: 768 px
- lg: 1024 px
- xl: 1280 px

Expected behavior.

- Desktop: split hero/promo layouts, 3-card arrivals, 2-card favourites
- Tablet: maintain split sections where possible, reduce arrivals to 2 columns if needed
- Mobile: single-column flow, larger touch targets, reduced paddings

## Image and Asset Handling

- Keep reference assets in a traceable source folder.
- Export web-optimized images (WebP/AVIF when practical).
- Maintain stable aspect ratios to avoid layout shift.
- Use descriptive asset names such as hero-main and arrivals-item-1.

## Accessibility Baseline

1. Visible keyboard focus for interactive controls.
1. Adequate contrast for text and controls.
1. Semantic landmarks: header, main, section, footer.
1. Meaningful alt text for informative images.
1. Explicit label association for newsletter input.
1. Explicit labels and error messaging for auth and admin forms.

## Performance Baseline

1. Prioritize above-the-fold media load.
1. Lazy-load below-the-fold imagery.
1. Keep component rendering boundaries clean.
1. Prefer static rendering where content is stable.
1. Use transform and opacity for animation performance.

## Frontend Quality Checklist

- Visual fidelity validated on desktop and mobile references
- Typography and spacing consistency verified
- Motion is subtle, elegant, and professional
- prefers-reduced-motion behavior verified
- Product content is API-driven and not hardcoded
- Product cards are rendered from internal MongoDB-backed APIs, not third-party endpoints
- Signup and login flows are implemented with clear validation states
- Product browsing supports category-wise exploration
- Wishlist mark/unmark behavior is functional and persisted
- Admin panel can add products and manage listings
- Newsletter form maps to backend contract
- No material image-driven layout shift
- Core performance and accessibility quality checks completed
