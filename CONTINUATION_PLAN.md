# NexusDistribute Continuation Plan

Last updated: 2026-04-08

## 1) Project Context

NexusDistribute is a B2B distribution platform with 3 role-based portals:

- Admin portal
- Shop portal
- Delivery portal

Target stack:

- Next.js 15 (App Router)
- PostgreSQL (Neon) + Prisma 6
- Upstash Redis/QStash (prod) and BullMQ/Redis (local)
- Pusher for realtime notifications/chat
- Tailwind + shadcn/ui

Core business areas:

- Order placement with BNPL and credit checks
- Admin review queue for over-limit orders
- Inventory and stock reservation
- Delivery assignment/proof workflow
- Balance ledger and payment deadlines
- Announcements and notifications

## 2) Confirmed Product Decisions

From working session:

- Timeline: quality over speed, no hard deadline
- UI scope: standardize against the design system (not full redesign)
- Priority: all portals equally important
- 2FA: not required for launch
- Password recovery: defer to v2 unless needed sooner

## 3) Earlier Critical Blockers Identified

1. Missing auth context across pages/APIs leading to first-shop fallback logic
2. Missing delivery orders list route
3. Password recovery flow missing

## 4) Implementation Completed In This Session

### 4.1 Auth/session and identity flow

- Added session endpoint for authenticated user context:
  - src/app/api/auth/me/route.ts
- Added client auth hook:
  - src/hooks/use-auth.ts
- Extended JWT payload to include optional shopId:
  - src/lib/auth.ts
- Updated login token generation to include shop.id when role=shop:
  - src/app/api/auth/login/route.ts

### 4.2 Removed first-shop fallback behavior

- Shop orders list now uses auth-derived shop context:
  - src/app/shop/orders/page.tsx
- Shop order detail now uses auth-derived shop context:
  - src/app/shop/orders/[id]/page.tsx
- Orders API enforces auth and resolves shop correctly for shop role:
  - src/app/api/orders/route.ts

### 4.3 Admin API hardening

- Products API enforces admin auth and uses session.userId for createdBy:
  - src/app/api/admin/products/route.ts
- Announcements API enforces admin auth and uses session.userId for createdBy:
  - src/app/api/admin/announcements/route.ts
- Admin shops list endpoint enforces admin auth:
  - src/app/api/admin/shops/route.ts
- Removed client-side hardcoded createdBy from admin products page payload:
  - src/app/admin/products/page.tsx

### 4.4 Missing routes/pages fixed

- Added /shop root redirect to dashboard:
  - src/app/shop/page.tsx
- Added /delivery/orders list page:
  - src/app/delivery/orders/page.tsx
- Changed /delivery root to redirect to /delivery/orders:
  - src/app/delivery/page.tsx
- Updated delivery shell nav to use /delivery/orders as primary route:
  - src/components/layout/delivery-shell.tsx

### 4.5 Layout consistency pass

- Increased sidebar width and improved nav row touch targets and spacing:
  - src/components/layout/admin-shell.tsx
  - src/components/layout/shop-shell.tsx
  - src/components/layout/delivery-shell.tsx
- Updated topbar surface treatment and page paddings for consistency:
  - same files above

### 4.6 Tailwind dark-mode compatibility

- Enabled dark selector for both class and data-theme:
  - tailwind.config.ts

### 4.7 Delivery workflow completion (API + UI + validation)

- Added dedicated delivery transition endpoints:
  - src/app/api/delivery/orders/[id]/pickup/route.ts
  - src/app/api/delivery/orders/[id]/deliver/route.ts
- Added/updated delivery list and detail retrieval routes:
  - src/app/api/delivery/orders/route.ts
  - src/app/api/delivery/orders/[id]/route.ts
- Replaced delivery detail page mock logic with real API-backed flow:
  - src/app/delivery/orders/[id]/page.tsx
- Added delivery proof + GPS capture path on UI and multipart handling on API:
  - proof image required
  - GPS coordinates required
  - robust malformed payload handling for non-multipart requests
- Updated delivery list/history pages with real data wiring and proof/maps behavior:
  - src/app/delivery/orders/page.tsx
  - src/app/delivery/history/page.tsx
- Runtime smoke tested with seeded users and role-based sessions:
  - admin/shop/delivery login and key routes verified
  - pickup/deliver endpoint behavior verified for invalid and missing payload states

### 4.8 Route-protection parity fix

- Moved middleware implementation to src-level for App Router src-dir discovery:
  - src/middleware.ts
- Removed duplicate root-level middleware file to avoid ambiguity:
  - middleware.ts (deleted)
- Re-verified unauthenticated protected route behavior:
  - GET /admin/dashboard now returns 307 -> /login?callbackUrl=%2Fadmin%2Fdashboard

### 4.9 Design-token and layout standardization pass

- Standardized typography tokens around explicit body/heading font variables:
  - src/app/layout.tsx
  - tailwind.config.ts
  - src/app/globals.css
- Added shared portal layout utility classes for page rhythm consistency:
  - .portal-page, .portal-header, .portal-title, .portal-subtitle, .metrics-grid
  - src/app/globals.css
- Applied spacing and hierarchy refinements across core role dashboards/pages:
  - src/app/admin/dashboard/page.tsx
  - src/app/shop/dashboard/page.tsx
  - src/app/delivery/orders/page.tsx
  - src/app/delivery/history/page.tsx

### 4.10 Repeatable auth regression smoke script

- Added scripted route/API auth checks for unauthenticated and cross-role protection:
  - scripts/auth-smoke.ts
- Wired script into npm tooling:
  - package.json (`test:auth-smoke`)

## 5) Current Known Gaps (Next Priority)

1. Password recovery (deferred v2):

- Missing forgot/reset routes and APIs
- Missing reset token storage model/migration

## 6) Recommended Next Session Work Plan

### Phase A: Auth regression safety hardening

1. Add `npm run test:auth-smoke` to CI pre-merge checks
2. Extend smoke checks with additional protected API endpoints as coverage grows

### Phase B: Optional v2 auth features

1. Forgot password and reset password flow
2. Rate limits on auth endpoints
3. Audit event logging for critical account actions

## 7) Implementation Checklist For Next Agent

- [x] Build missing delivery APIs in src/app/api/delivery
- [x] Connect delivery orders list/detail to real API data
- [x] Add action handlers for pickup/delivered transitions
- [x] Add proof image upload pipeline hook points
- [x] Finish design-system consistency pass page-by-page
- [x] Add repeatable role-protection smoke script and wire it into validation flow

## 8) Role Journey Smoke Tests

Last verified: 2026-04-08 (local dev, seeded users)

Automated check command:

- `npm run test:auth-smoke` (expects local app running at BASE_URL, default http://localhost:3001)

Admin:

- /login -> /admin/dashboard
- Can list shops/products/orders
- Can create announcement with correct createdBy
- Unauthenticated /admin/dashboard -> 307 redirect to /login?callbackUrl=%2Fadmin%2Fdashboard

Shop:

- /login -> /shop/dashboard
- /shop and /shop/orders should not rely on first shop record
- Orders listing/detail should resolve via auth session

Delivery:

- /login -> /delivery/orders
- /delivery redirects correctly
- Delivery list/detail routes accessible
- /api/delivery/orders/:id/deliver returns expected validation errors for:
  - invalid payload format
  - missing proof image
  - missing GPS coordinates

## 9) Environment Variables Reference

- DATABASE_URL
- DIRECT_URL
- JWT_SECRET
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- QSTASH_TOKEN
- QSTASH_CURRENT_SIGNING_KEY
- PUSHER_APP_ID
- PUSHER_KEY
- PUSHER_SECRET
- PUSHER_CLUSTER
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- GOOGLE_MAPS_API_KEY
- RESEND_API_KEY
- SENTRY_DSN
- POSTHOG_API_KEY
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN

## 10) Notes

- Password recovery intentionally deferred by current product decision.
- Delivery workflow is now API-backed end-to-end with proof and GPS validation.
- Route-protection parity for admin pages has been revalidated after middleware relocation to src/middleware.ts.
- Auth route/API protection now has a repeatable smoke script for local and CI preflight usage.
- Continue using strict auth-context driven identity; do not reintroduce first-record fallbacks.

---

## Appendix A) Original Architecture + Build Context (Preserved)

The following captures the planning context provided by the product owner and should be treated as source-of-truth guidance for implementation scope.

### A.1 B2B Distribution Platform Vision

Project: NexusDistribute

Roles:

- Admin
- Shop (Client)
- Delivery

Core stack target:

- Next.js 15
- PostgreSQL (Neon)
- Prisma 6
- Upstash Redis + QStash
- Pusher

### A.2 Technology Stack (Target)

Layer decisions:

- Framework: Next.js 15 App Router
- UI: shadcn/ui + Radix + Tailwind
- State: Zustand (UI/cart) + TanStack Query (server state)
- Backend: Next.js API routes
- DB: Neon PostgreSQL
- ORM: Prisma 6
- Queue/cache prod: Upstash Redis + QStash
- Queue/cache local: BullMQ + Redis Docker
- Realtime: Pusher
- Auth: custom JWT + bcrypt + secure cookies
- Storage: Cloudinary or S3
- Maps: Google Maps API
- Email: Resend
- SMS fallback: Twilio or local PK gateway
- Hosting: Vercel + Neon
- Monitoring: Sentry
- Analytics: PostHog
- Testing: Playwright + Vitest + RTL

### A.3 UI Component Strategy

Required shadcn components include:

- table, form, dialog, badge, card, dropdown-menu, input, select, tabs, toast, calendar, command

Rules:

- Forms: react-hook-form + zod
- Data grids: TanStack table
- Icons: lucide-react
- Avoid MUI for this project

### A.4 Hosting and Deployment

Environments:

- Local: docker compose (Postgres + Redis) + next dev
- Staging/prod: Vercel + Neon + Upstash + Pusher + Cloudinary + Resend

Job model:

- Local: BullMQ workers
- Prod: QStash signed HTTP cron endpoints

### A.5 Production Hardening

Security expectations:

- Rate limit auth and order routes
- CSRF on state-changing actions
- Zod validation on all input
- Secure httpOnly cookies
- Refresh token rotation

Reliability:

- Sentry instrumentation
- Structured API logs
- Backup/PITR via Neon

### A.6 Data Model Scope (Functional)

Domain coverage expected in schema:

- Users and identity
- Shops and registration states
- Products, categories, price history, scheduled prices
- Orders, order items, order merge logs, review queue
- Balance ledger and payments
- Delivery persons and delivery assignments
- Announcements, recipients, chat, notifications
- Priorities and platform settings
- Discount codes, disputes, privilege logs

### A.7 Core Business Logic Requirements

Order placement validations:

1. Block if order menu disabled
2. Block on expired payment deadline with unpaid balance
3. BNPL projected balance check vs credit limit
4. Route over-limit to admin review queue
5. Run merge window logic
6. Reserve stock
7. Apply discount if valid
8. Save order + order item price snapshots
9. If BNPL approved, update balance ledger
10. Emit notifications/realtime events

Merge rule:

- Same shop
- Prior order within merge window and still merge-eligible status
- Transaction and lock protection required

Review queue:

- Realtime admin badge
- Approve/reject updates status, stock, notifications accordingly

Balance rule:

- balance + new BNPL order > creditLimit => review queue
- 80 percent warning threshold

Daily expiry:

- Suspend shops with overdue deadline and unpaid balance

Scheduled pricing:

- Admin schedules future price
- QStash triggers apply endpoint
- Price history persisted
- Existing order item snapshots unchanged

Cancellation policy:

- Pending/admin_review: cancellable
- approved/processing: admin cancellable
- dispatched: admin cancellable with reason
- out_for_delivery/delivered: not cancellable; dispute flow instead

### A.8 Portal Screens Expected

Admin screens:

- Dashboard
- Orders
- Review queue
- Shops
- Shop detail
- Products
- Price management
- Inventory
- Announcements
- Delivery management
- Disputes
- Settings

Shop screens:

- Registration
- Dashboard
- Products
- Cart
- Orders
- Order detail
- Balance
- Chat
- Announcements
- Profile

Delivery screens:

- Login
- My deliveries list
- Delivery order detail
- Delivery history
- Profile

### A.9 Notification Matrix (High-level)

Key events expected to notify appropriate roles:

- Review queue creation
- Approve/reject review queue order
- New order
- Merge result
- Status transitions (dispatched, out_for_delivery, delivered)
- Delivery assignment
- Credit warnings and limit exceed
- Deadline reminders and suspension
- Announcements
- Price changes
- Chat messages
- Dispute open/resolution
- Low stock and pending registrations

### A.10 Additional Features List (Target)

Planned features include:

- Categories
- Min order quantity
- Registration approval
- Quick reorder
- Invoices/PDF
- Disputes/returns
- CSV/Excel exports
- 2FA
- Delivery proof + GPS
- Google Maps + text fallback
- Partial payments
- Stock reservation
- Discount codes
- SMS/WhatsApp fallback
- Optional sales rep role

### A.11 API Surface (Target)

Expected major routes:

- /api/auth/\*
- /api/orders\*
- /api/orders/review\*
- /api/shops\*
- /api/products\*
- /api/delivery\*
- /api/chat\*
- /api/notifications\*
- /api/announcements\*
- /api/disputes\*
- /api/settings\*
- /api/discount/validate
- /api/reports/\*
- /api/cron/prices
- /api/cron/expiry
- /api/cron/sms

### A.12 Build Phases (Original)

1. Foundation (schema, auth, role layouts)
2. Products and catalogue
3. Core order flow
4. Delivery portal
5. Balance/payments/expiry
6. Communication
7. Pricing/settings/config
8. Additional features

---

## Appendix B) Original UI/UX Design System Context (Preserved)

The following summarizes the owner-provided UI system that implementation should align with.

### B.1 Design Intent

Principles:

- Clarity first for finance and operations data
- Context adaptive for desktop + field mobile usage
- Role-distinct portal accents
- High-contrast and accessibility-first behavior

### B.2 Color System Requirements

Light mode:

- Primary deep navy system
- Semantic success/warning/error/info palettes
- Role accents:
  - admin purple family
  - shop teal/cyan family
  - delivery orange family

Dark mode:

- Dedicated overrides, not naive inversion
- Preserved semantic meaning and contrast

### B.3 Typography Requirements

Expected hierarchy:

- Display, H1, H2, body large, body, caption, button
- Tabular numerals for prices/balances/metrics

### B.4 Component Requirements

Buttons:

- Clear states (rest/hover/active/disabled/loading)

Forms:

- Consistent labels, focus rings, error text

Tables:

- Header clarity, zebra rows, hover states, numeric alignment

Cards:

- Consistent radius, shadows, borders, spacing

Badges:

- Semantic and role-aware variant usage

### B.5 Role Visual Identity

Admin:

- Dense data layout with clear review urgency indicators

Shop:

- Balance utilization visibility and action focus

Delivery:

- Mobile-first, large tap targets, route/action clarity

### B.6 Spacing and Layout

Spacing scale uses 4px increments.

Expectations:

- Consistent side paddings and container rhythm
- Responsive grids by portal usage context

### B.7 Accessibility and UX Rules

Must-have:

- WCAG contrast
- keyboard focus visibility
- color not sole indicator
- reduced motion support
- robust status messaging

### B.8 Dark Mode Strategy

Implementation expectations:

- tokenized CSS variables
- persistent theme preference
- full component/theme parity in dark mode

### B.9 Completion Criteria

UI considered complete when:

- visual hierarchy is consistent
- spacing/alignment is systematic
- semantic colors applied correctly
- role portals feel intentional and coherent
- accessibility checks pass

---

## Appendix C) Practical Continuation Notes

- This file is intended to be sufficient for a new coding session handoff.
- Keep this file updated at the end of each implementation tranche.
- If priorities change (for example password reset moved to immediate scope), update section 2 and section 6 first.

---

## Appendix D) Raw Context Archive (Verbatim Copy)

The following is preserved as a raw context block from the planning brief so future sessions can reference original wording directly.

"""
B2B DISTRIBUTION PLATFORM
“NexusDistribute”
Complete Architecture & Build Plan
2026 Edition
Admin Shop (Client) Delivery
Next.js 15 · PostgreSQL (Neon) · Prisma 6 · Upstash Redis + QStash · Pusher

1. Technology Stack (2026 Standard)
   Every layer of the platform, from frontend to background jobs. Selections are optimised for serverless deployment, zero-cost hosting on free tiers, and Next.js 15 App Router compatibility.

Layer Technology / Library Rationale
Framework Next.js 15 (App Router) Stable RSC, improved caching, edge runtime support
UI Components shadcn/ui + Radix Primitives Zero runtime overhead, Tailwind integration, accessible, copy-to-own model
State Management Zustand (UI/Cart) + TanStack Query (Server) Separates client UI state from cached API state
Backend Next.js 15 API Routes Unified codebase; Edge + Node runtimes per route
Database (primary) PostgreSQL via Neon (Serverless) Built-in PgBouncer pooling prevents connection exhaustion on Vercel
ORM Prisma 6 Type-safe, migration tracking, native Next.js 15 compatibility
Cache / Queue (Prod) Upstash Redis + Upstash QStash Serverless-compatible; QStash replaces persistent BullMQ workers in production
Cache / Queue (Local) BullMQ + Redis 7 (Docker) Local dev uses BullMQ CLI for job testing; same interface, easy swap
Real-time Pusher Channels Managed WebSocket proxy — no long-running server connections on Vercel
Auth Custom JWT (jose + bcrypt) HTTP-only secure cookies, refresh token rotation, rate-limited endpoints
File/Image Storage Cloudinary (Free) or AWS S3 + CloudFront CDN delivery, presigned upload URLs, predictable pricing
Maps / Address Google Maps API Address picker, geocoding, map display for delivery
Email Resend 3,000 emails/mo free — auth, registration, system alerts
SMS / WhatsApp Twilio or local PK gateway (Jazz/Ufone) Critical fallback notifications for Pakistani numbers
Hosting — App/API Vercel Zero-config preview environments, auto-deploy on main
Hosting — DB Neon (Serverless PostgreSQL) Free tier covers early production; auto-scales
CI/CD GitHub Actions + Vercel Deployments Preview deploy on every PR; production deploy on main push
Error Tracking Sentry SDK Integrated at app root; structured JSON logging on API routes
Analytics PostHog (free) Feature adoption, funnel tracking, session replay
Testing Playwright (E2E) + Vitest + React Testing Library E2E for order flow, auth, delivery; unit/component for logic

1B. UI Component Strategy
Primary Library: shadcn/ui — install via npx shadcn@latest init

Core Components to Install
• table, form, dialog, badge, card, dropdown-menu, input, select, tabs, toast, calendar, command

Integration Rules
• All forms use react-hook-form + zod validation
• Data-heavy tables (orders, ledger, products) use @tanstack/react-table
• Icons: lucide-react — tree-shakeable, consistent with shadcn
• Skip MUI: heavier bundle, CSS-in-JS conflicts with Tailwind, slower Server Component rendering

shadcn uses a copy-to-own model — components live in your repo under components/ui/. You own and customise them freely. Run npx shadcn@latest add <component> to pull each one in.

1C. $0 Hosting & Deployment Pipeline

Environment Setup Notes Upgrade Trigger
Local Dev docker compose up (PostgreSQL 16 + Redis 7) + next dev Avoids cloud limits during heavy testing N/A
Staging / Prod Vercel + Neon + Upstash (Redis/QStash) + Pusher + Cloudinary + Resend Free tiers cover early production; auto-deploy on GitHub push See thresholds below
Job Scheduling Local: BullMQ CLI → Prod: QStash HTTP triggers (/api/cron/\*) QStash signs requests; no persistent workers needed N/A
WebSocket Pusher JS SDK (client) + /api/pusher/auth (server) No open connections on serverless functions >100 concurrent connections

Free-Tier Upgrade Triggers
• Vercel: >100 GB bandwidth/month
• Neon: >0.5 GB storage
• Upstash Redis: >100,000 commands/day
• Pusher: >100 concurrent connections
• Resend: >3,000 emails/month

1D. Production Hardening & Observability

Category Implementation
Security Rate limit /api/auth/\* and /api/orders; CSRF tokens on state-changing POST/PUT; Zod validation on all route inputs; httpOnly + secure + sameSite:strict cookies; rotate refresh tokens server-side
Error Tracking Sentry SDK at app root; wrap critical transactions in try/catch; structured JSON logging for API routes
Analytics PostHog (free) for feature adoption, funnel tracking, and session replay
Testing Playwright for E2E (order flow, merge, auth, delivery); Vitest + React Testing Library for unit/component tests
Backup & DR Neon automated daily backups + point-in-time recovery; environment variable rotation; npm audit in CI pipeline

2. Database Schema
   All tables are permanent — no hard deletes. Soft deletion via status flags only.

2.1 Users & Identity
Field Type Nullable Description
id UUID PK No Primary identifier
name VARCHAR(150) No Full name
email VARCHAR(255) No Unique login email
password_hash TEXT No Bcrypt hashed password
role ENUM No admin | shop | delivery
is_active BOOLEAN No Default true; admin can deactivate
created_at TIMESTAMPTZ No Account creation timestamp
last_login_at TIMESTAMPTZ Yes For audit and security

2.2 Shops
Field Type Nullable Description
id UUID PK No Primary identifier
user_id UUID FK → users No Linked user account
shop_name VARCHAR(200) No Display name
owner_name VARCHAR(150) No Owner full name
phone VARCHAR(20) No Primary contact number
address_text TEXT No Manually entered street address
address_lat DECIMAL(10,7) Yes Google Maps latitude
address_lng DECIMAL(10,7) Yes Google Maps longitude
address_place_id VARCHAR(255) Yes Google Maps place_id for re-display
address_formatted TEXT Yes Formatted address string from Maps API
balance DECIMAL(12,2) No Amount owed to company. Default 0.
credit_limit DECIMAL(12,2) No Default 200,000; per-shop configurable
payment_deadline DATE Yes Date by which balance must be cleared
is_active BOOLEAN No False = account suspended
order_menu_disabled BOOLEAN No Admin can disable ordering entirely
disable_reason TEXT Yes Admin's custom message shown to shop
registration_status ENUM No pending | approved | rejected
approved_by UUID FK → users Yes Admin who approved registration
approved_at TIMESTAMPTZ Yes Registration approval timestamp
created_at TIMESTAMPTZ No Registration request timestamp

2.3 Products & Inventory
products
Field Type Nullable Description
id UUID PK No Primary identifier
name VARCHAR(255) No Product display name
description TEXT Yes Rich text description
unit VARCHAR(50) No e.g. bag, kg, piece, box
current_price DECIMAL(10,2) No Live price shown to shops
image_url TEXT Yes Cloudinary / S3 URL
stock_quantity INTEGER No Current available stock
low_stock_threshold INTEGER No Alert admin below this qty
min_order_qty INTEGER No Minimum qty per order. Default 1
is_visible BOOLEAN No Show/hide from shop catalogue
category_id UUID FK → categories Yes Product category
created_by UUID FK → users No Admin who added it
created_at / updated_at TIMESTAMPTZ No Timestamps

categories | price_history | scheduled_prices
categories: id, name, sort_order, created_by
price_history: id, product_id, old_price, new_price, change_reason, changed_by, changed_at — permanent record, never deleted
scheduled_prices: id, product_id, new_price, effective_date, effective_time, status (pending|applied|cancelled), created_by, applied_at, cancelled_by

2.4 Orders
orders
Field Type Nullable Description
id UUID PK No Primary identifier
shop_id UUID FK → shops No Ordering shop
status ENUM No pending | admin_review | approved | processing | dispatched | out_for_delivery | delivered | cancelled | rejected
payment_type ENUM No pay_now | bnpl
total_amount DECIMAL(12,2) No Sum of items at time of order
priority_id UUID FK → priorities Yes Urgency level set by admin
notes TEXT Yes Admin or shop notes
placed_at TIMESTAMPTZ No When shop confirmed the order
merged_into UUID FK → orders Yes If merged, points to parent order
is_parent_merge BOOLEAN No True if this order absorbed others
cancelled_at / cancelled_by TIMESTAMPTZ / UUID Yes Cancellation audit trail

order_items: id, order_id, product_id, quantity, unit_price_at_order (snapshot — never changes), subtotal
order_merge_log: id, parent_order_id, child_order_id, merged_at, window_minutes_used
admin_review_queue: id, order_id, shop_id, reason, balance_at_request, order_total, projected_balance, status, reviewed_by, reviewed_at, admin_note

2.5 Payments & Balance Ledger
balance_ledger: id, shop_id, type (debit|credit), amount, balance_after, reference_type, reference_id, note, recorded_by, recorded_at — permanent audit trail
payments: id, shop_id, amount, payment_method, reference_no, recorded_by, payment_date, created_at

2.6 Delivery
delivery_persons: id, user_id, name, phone, vehicle_info, is_available, created_at
delivery_assignments: id, order_id, delivery_person_id, assigned_at, picked_up_at, delivered_at, proof_image_url, proof_gps_lat, proof_gps_lng, delivery_notes, status (pending|picked_up|delivered|failed)

2.7 Communication
announcements: id, title, body, send_to (all|specific), created_by, created_at
announcement_recipients: id, announcement_id, shop_id, is_read, read_at
chat_messages: id, shop_id, sender_role (shop|admin), sender_id, message, is_read, read_at, sent_at
notifications: id, recipient_role, recipient_id, type, title, body, reference_type, reference_id, is_read, read_at, created_at

2.8 Configuration Tables
priorities: id, label, duration_value, duration_unit (hours|days), sort_order, color_hex, is_active, created_by
platform_settings (key-value store): order_merge_window_minutes, default_credit_limit, default_payment_days, platform_name, platform_logo_url, low_stock_default_threshold, discount_codes_enabled, two_factor_enabled

2.9 Additional Feature Tables
discount_codes: id, code, discount_type (percentage|fixed_amount), discount_value, applies_to, valid_from, valid_until, max_uses, uses_so_far, is_active, created_by
disputes: id, order_id, shop_id, reason, type (wrong_items|damaged|missing|other), status (open|under_review|resolved|rejected), resolution_note, credit_issued, resolved_by, resolved_at, filed_at
shop_privilege_log: id, shop_id, action, old_value, new_value, reason, changed_by, changed_at — permanent audit trail

3. Core Business Logic
   3.1 Order Placement Flow
   Every order passes through this validation chain — run server-side inside a DB transaction.

1. Shop confirms cart and selects payment type (Pay Now / BNPL)
1. Check: is order_menu_disabled = true? YES → Return error with disable_reason. Block order.
1. Check: has payment_deadline passed AND balance > 0? YES → Block, notify shop and admin.
1. If payment_type = BNPL: calculate projected_balance = current_balance + order_total
1. If projected_balance > credit_limit → route to Admin Review Queue (status = admin_review)
1. If payment_type = pay_now → skip balance check entirely
1. Run Order Merge Check (see 3.2)
1. Reserve stock: deduct from products.stock_quantity (reserved, not final)
1. If discount code provided: validate and apply
1. Create order + order_items with unit_price_at_order snapshot
1. If BNPL and approved: update shop balance, write to balance_ledger (debit)
1. Send notifications: shop (confirmation), admin (new order badge)

3.2 Order Merge Logic
Two orders from the same shop merge if BOTH conditions are met:
• The earlier order was placed within the admin-configured merge window (e.g. 60 minutes)
• The earlier order status is still pending or processing — NOT dispatched or beyond

Race condition protection: the entire merge check is wrapped in a DB row-level lock on the shop's latest order. Two simultaneous orders cannot merge incorrectly.

3.3 Admin Review Queue 13. Real-time WebSocket event fires to admin dashboard — review badge count increments 14. Admin sees: shop name, current balance, credit limit, order total, projected balance 15. Admin clicks Approve → order status: approved → processing; balance updated; shop notified 16. Admin clicks Reject → order rejected; stock reservation released; shop notified with custom message

3.4 Balance & Credit Limit Rules
• Balance = total of all BNPL orders minus all recorded payments
• Credit check: (current_balance + new_order_total) > credit_limit
• Rs 199,999 balance + Rs 2 order = Rs 200,001 projected = OVER LIMIT → admin review
• Credit limit is per-shop configurable by admin (default Rs 200,000)
• Warning notification sent when balance reaches 80% of credit limit

3.5 Payment Deadline & Account Expiry
QStash (production) / BullMQ (local) job runs daily to check and suspend expired accounts.

17. Find all shops where payment_deadline < TODAY and balance > 0
18. Set is_active = false on those shops
19. Notify shop: account suspended; must pay balance
20. Notify admin: list of newly expired shops
21. Admin can extend/reduce deadline or manually reactivate at any time

3.6 Price Scheduling (QStash in Prod / BullMQ Locally) 22. Admin sets scheduled price → INSERT scheduled_prices 23. QStash job queued for effective_date + effective_time via HTTP delay 24. Job fires → /api/cron/prices endpoint triggered 25. UPDATE products.current_price, INSERT price_history, UPDATE scheduled_prices.status = applied 26. All active shops notified of price change
unit_price_at_order is always a snapshot. Historical orders are never retroactively changed.

3.7 Cancellation Rules

Status Cancellable?
pending Yes — by shop or admin
admin_review Yes — admin (reject) or shop (withdraw)
approved / processing Yes — by admin only
dispatched Admin only, with reason
out_for_delivery NO — cannot cancel once picked up by rider
delivered NO — open a dispute instead
cancelled / rejected Already terminal — no action

4. Data Flow Diagrams
   4.1 Shop Order Placement Flow
   Step System Action
1. Shop adds items to cart Cart state stored client-side (Zustand)
1. Select Pay Now / BNPL Proceeds to checkout
1. POST /api/orders Request hits Next.js 15 API route
1. Auth middleware Verifies JWT, extracts shop_id
1. Validation chain menu_disabled? → deadline_expired? → balance_check?
1. Merge window check SELECT latest order WHERE shop_id AND placed_at > NOW() - window
   7a. Merge path UPDATE order_items, recalculate total, INSERT order_merge_log
   7b. New order path INSERT orders, INSERT order_items (price snapshot)
1. Stock reservation UPDATE products.stock_quantity -= qty (atomic)
1. Balance update (BNPL) UPDATE shops.balance += total, INSERT balance_ledger
1. Notifications INSERT notifications, emit Pusher event to admin
1. Response Return order_id, status, merged_into (if applicable) to client

4.2 Admin Review Queue Flow
Step System Action
Order flagged over limit status = admin_review, INSERT admin_review_queue
Pusher event Push to admin dashboard — review count badge updates live
Admin opens review card GET /api/admin/review-queue/:id
Admin approves PUT status=approved, UPDATE shops.balance, INSERT ledger entry
Admin rejects PUT status=rejected, release stock reservation, INSERT notification
Notification fired INSERT notifications for shop, Pusher push

4.3 Delivery Flow
Step System Action
Admin assigns order INSERT delivery_assignments, UPDATE order.status = dispatched
Delivery person notified Pusher push to delivery portal
Rider taps 'Picked Up' PUT picked_up_at, order.status = out_for_delivery. Now non-cancellable.
Rider taps 'Delivered' Upload proof photo → Cloudinary → store URL
GPS captured Browser Geolocation API → proof_gps_lat/lng stored
Order complete order.status = delivered; shop + admin notified
Balance ledger No change — BNPL balance was debited at order time

4.4 Price Scheduling Flow (QStash)
Step System Action
Admin sets scheduled price INSERT scheduled_prices (product_id, new_price, effective_date)
QStash job queued HTTP trigger scheduled for effective_date + effective_time
Job fires POST to /api/cron/prices — QStash signs the request
Price applied UPDATE products.current_price, INSERT price_history, UPDATE status = applied
All shops notified INSERT notifications for all active shops, Pusher push
Existing orders unaffected unit_price_at_order is a snapshot — no retroactive changes

5. Admin Portal — All Screens
   5.1 Dashboard /admin
   Widget Data Shown
   Revenue cards Total sales today / this week / this month (sum of delivered orders)
   Outstanding balance Sum of all shop balances currently owed to company
   Review queue badge Count of orders pending admin approval — live via Pusher
   Active orders Orders in processing / dispatched / out_for_delivery
   Low stock alert Products below their low_stock_threshold
   Expiring deadlines Shops whose payment_deadline is within 7 days
   Recent activity feed Last 20 orders, payments, disputes in one timeline
   Sales chart Revenue per day for current month (bar chart)
   Top shops Shops ranked by monthly order volume

5.2 – 5.12 All Admin Screens
Screen / Route Key Functionality
Orders /admin/orders Daily grouped view; filters by date, shop, status, priority; export CSV/Excel
Review Queue /admin/orders/review Real-time Pusher updates; approve/reject with reason; temporary credit override
Shops /admin/shops List with pending/active/suspended tabs; search by name, phone, balance
Shop Detail /admin/shops/[id] Profile, balance, credit limit, payment deadline, order menu, status, full order history, privilege log, chat, disputes
Products /admin/products Grid/list; add/edit; image upload; price update or schedule; visibility toggle; price history; stock adjustment
Price Management /admin/prices Calendar view of scheduled changes; cancel pending; full history export
Inventory /admin/inventory Visual stock bars; low stock highlighted; adjust stock with reason; movement history
Announcements /admin/announcements Rich text compose; all shops or specific shops; read receipt per shop
Delivery /admin/delivery Delivery persons CRUD; assign to order; performance metrics
Disputes /admin/disputes Open disputes; resolve with balance credit; rejection with reason
Settings /admin/settings Merge window, credit limit default, priorities, platform branding, discount codes, 2FA, admin accounts

6. Shop Portal — All Screens
   Screen / Route Key Functionality
   Registration /register Shop name, owner, phone, email, password, Google Maps address picker + manual text fallback. Status = pending after submit.
   Dashboard /shop Balance card (green/amber/red by % of limit), credit remaining, payment countdown, active orders, unread announcements & chat badges
   Products /shop/products Lock screen if menu disabled (shows admin's message). Grid with image, price, min order qty. Cart sticky in header.
   Cart /shop/cart Quantity edit, discount code, Pay Now / BNPL buttons. BNPL shows projected balance. Warning if over limit but doesn't block submission. Quick reorder last order.
   Orders /shop/orders Full history; filter by status/date/payment type; cancel if allowed; merged order label shown
   Order Detail /shop/orders/[id] Item list, status timeline, delivery person contact, proof photo after delivery, file dispute button
   Balance /shop/balance Running ledger (debit/credit), payment deadline countdown, link to chat admin
   Chat /shop/chat Real-time Pusher chat thread with admin; all messages permanent
   Announcements /shop/announcements List; auto-mark as read on open; unread count in sidebar
   Profile /shop/profile Edit name, phone, password; Google Maps address picker + always-editable plain text address

7. Delivery Person Portal — All Screens
   Separate mobile-optimised interface. Same auth system, role = delivery.

Screen / Route Key Functionality
Login /login Phone + password. Role check: delivery only. Other roles rejected.
My Deliveries /delivery/orders Sorted by priority (Urgent first) then assigned_at. Filter: pending / in transit / delivered today.
Order Detail /delivery/orders/[id] Full item list, shop name + phone (tap to call), Google Maps address, 'Open in Maps' button (lat/lng or text fallback). Mark Picked Up → Mark Delivered (requires proof photo + GPS capture).
Delivery History /delivery/history All past deliveries; proof photo thumbnail; full detail on tap
Profile /delivery/profile Name, phone, vehicle info (view only); change password; availability toggle
Notifications In-app list + Pusher push for new assignment; badge count on icon

8. Notification System — Complete Reference
   Trigger Who Is Notified Channel
   Order sent to review (over limit) Admin Pusher badge + in-app
   Admin approves order from review Shop In-app + SMS fallback
   Admin rejects order from review Shop In-app + SMS fallback
   New order placed (any) Admin In-app badge count
   Order merged with existing Shop In-app
   Order status: dispatched Shop In-app
   Order status: out_for_delivery Shop + Admin In-app
   Order status: delivered Shop + Admin In-app
   Order assigned to delivery person Delivery person In-app + Pusher
   Balance reaches 80% of credit limit Shop In-app warning banner
   Balance exceeds credit limit Shop + Admin In-app + SMS
   Payment deadline < 7 days Shop In-app daily reminder
   Payment deadline expired Shop + Admin In-app + SMS
   Shop account suspended Shop In-app + admin message
   Announcement published Selected shops In-app
   Price change scheduled All active shops In-app
   Price change goes live All active shops In-app
   New chat message from admin Shop In-app + badge
   New chat message from shop Admin In-app + badge
   Dispute filed by shop Admin In-app
   Dispute resolved by admin Shop In-app
   Low stock alert Admin In-app dashboard alert
   New shop registration pending Admin In-app
   Shop registration approved/rejected Shop In-app + email (Resend)

9. Complete Feature List
   Core Features
   • Shop registration with admin approval workflow
   • Role-based auth: Admin, Shop, Delivery — three separate portals
   • Product catalogue with categories, images, units, min order qty
   • Shopping cart with Pay Now and Buy Now Pay Later
   • Credit limit system (default Rs 200,000, per-shop configurable)
   • Balance ledger — permanent running record of all debits and credits
   • Admin review queue for over-limit BNPL orders
   • Order merge window — time-based automatic order combining
   • Order cancellation rules — blocked after out_for_delivery
   • Payment deadline and account expiry (QStash/BullMQ auto-suspend daily)
   • Price scheduling — set future price changes per product
   • Full price history per product — permanent
   • Announcements with targeted shop selection
   • Admin customizable priorities (labels, durations, colors)
   • Shop privilege controls — disable menu, custom message
   • Delivery assignment and proof-of-delivery with GPS stamp
   • Real-time notifications via Pusher Channels

Additional Features (All 15)
Feature Summary

1. Product Categories Admin creates categories; shops filter catalogue; admin can reorder
2. Minimum Order Quantity Admin sets min_order_qty per product; cart validation enforces it; shown on product card
3. Shop Registration Approval Pending state on registration; admin approves/rejects; sets initial credit limit and deadline days
4. Quick Reorder Reorder button fills cart with last order items at current prices; editable before checkout
5. Invoice / PDF Generation Auto-generated PDF per order after delivery; monthly statement per shop; bulk ZIP export
6. Return / Dispute System Shop files dispute (wrong items, damaged, missing, other); admin resolves with credit or rejection
7. Analytics Export CSV/Excel: daily orders, revenue per shop, balance aging, top products, delivery performance
8. Two-Factor Authentication OTP via SMS on login; toggled in Settings; applies to admin and shop; 5-min expiry
9. Delivery Proof + GPS Stamp Geolocation API captures lat/lng at delivery moment; admin views on map from order detail
10. Google Maps + Manual Fallback Places Autocomplete saves lat/lng/place_id; manual text always editable; 'Open in Maps' links to coordinates
11. Partial Payments & Balance Plans Admin records partial payments; each writes a credit ledger entry; payment plan notes supported
12. Stock Reservation on Order Stock tentatively reduced when order placed; released on rejection/cancellation; finalized on delivery
13. Discount Codes Admin creates % or fixed amount codes; applies to all/specific shops or products; usage tracking
14. WhatsApp / SMS Fallback Critical events trigger SMS if app not opened within X hours; Pakistani gateway (Jazz/Ufone/Twilio)
15. Sales Rep Sub-Role (Optional) Restricted admin sub-role; can only see assigned shops, view balances, record payments, chat

16. Project Folder Structure
    Next.js 15 App Router, TypeScript throughout.

Path Purpose
app/(auth)/login/ Shared login — role-based redirect after JWT verify
app/(auth)/register/ Shop registration form with address picker
app/admin/ Admin portal root — protected by admin middleware
app/admin/orders/ Daily order view + order detail
app/admin/orders/review/ Admin review queue (real-time Pusher)
app/admin/shops/ Shop list and shop detail pages
app/admin/products/ Product management
app/admin/prices/ Price history and scheduling
app/admin/inventory/ Stock management
app/admin/delivery/ Delivery persons and assignment
app/admin/announcements/ Compose and send announcements
app/admin/disputes/ Dispute review and resolution
app/admin/settings/ Platform configuration
app/shop/ Shop portal root — protected by shop middleware
app/shop/products/ Product catalogue (locked if disabled)
app/shop/cart/ Cart and checkout
app/shop/orders/ Order history and order detail
app/shop/balance/ Balance ledger and payment history
app/shop/chat/ Real-time Pusher chat with admin
app/shop/announcements/ Announcements inbox
app/delivery/ Delivery portal — delivery middleware
app/delivery/orders/ Assigned deliveries and order detail
app/delivery/history/ Past deliveries with proof photos
app/api/auth/ Login, logout, refresh, OTP routes
app/api/orders/ Order CRUD, merge, cancel, status updates
app/api/shops/ Shop CRUD, balance, payments, privileges
app/api/products/ Product CRUD, pricing, inventory
app/api/delivery/ Assignment, pickup, delivery, proof upload
app/api/chat/ Chat messages REST + Pusher endpoint
app/api/notifications/ Notification read/unread, list
app/api/cron/ QStash HTTP trigger endpoints (/api/cron/prices, /api/cron/expiry, /api/cron/sms)
lib/prisma.ts Prisma client singleton
lib/redis.ts Upstash Redis client singleton
lib/balance-engine.ts All balance calculation logic isolated here
lib/order-merge.ts Merge window logic with DB transaction handling
lib/notifications.ts Dispatch all notification types (in-app + SMS + Pusher)
lib/auth.ts JWT sign/verify, role extraction, middleware helpers
lib/maps.ts Google Maps API helpers (geocode, place details)
lib/storage.ts Cloudinary / S3 upload helpers
jobs/price-scheduler.ts Local BullMQ worker — applies scheduled prices (dev only)
jobs/balance-expiry.ts Local BullMQ worker — daily account expiry check (dev only)
jobs/sms-fallback.ts Local BullMQ worker — sends SMS for unread critical notifs (dev only)
components/ui/ shadcn/ui primitives: Button, Input, Badge, Card, Table, etc.
components/layout/ AdminShell, ShopShell, DeliveryShell, Navbar, Sidebar
components/features/ Domain components: OrderCard, BalanceMeter, ReviewQueueCard, etc.
middleware.ts Next.js edge middleware — route protection by role
prisma/schema.prisma Full database schema
prisma/migrations/ All migration files — never delete
docker-compose.yml PostgreSQL 16 + Redis 7 for local development

11. API Route Reference
    All routes require JWT. Role enforced per route. Zod validation on all inputs.

Method + Path Role Action
POST /api/auth/login Any Verify password, return JWT + role
POST /api/auth/logout Any Invalidate session
POST /api/auth/otp/send Any Send OTP via SMS
POST /api/auth/otp/verify Any Verify OTP, complete login
POST /api/auth/register Public Create shop registration (pending)
GET /api/orders Admin List all orders with filters
POST /api/orders Shop Place new order (full validation chain)
GET /api/orders/:id Admin|Shop|Delivery Order detail
PUT /api/orders/:id/status Admin|Delivery Update order status
PUT /api/orders/:id/priority Admin Change priority
PUT /api/orders/:id/assign Admin Assign delivery person
DELETE /api/orders/:id Admin|Shop Cancel order (status check)
GET /api/orders/review Admin Admin review queue list
PUT /api/orders/review/:id Admin Approve or reject queued order
GET /api/shops Admin List all shops
GET /api/shops/:id Admin|Shop(own) Shop detail
PUT /api/shops/:id Admin Update shop profile/settings
PUT /api/shops/:id/balance Admin Record payment, adjust balance
PUT /api/shops/:id/privilege Admin Enable/disable menu, set message
PUT /api/shops/:id/registration Admin Approve or reject registration
GET /api/products Admin|Shop List products
POST /api/products Admin Create product
PUT /api/products/:id Admin Update product
POST /api/products/:id/price Admin Update price immediately
POST /api/products/:id/schedule Admin Schedule future price change
DELETE /api/products/schedule/:id Admin Cancel scheduled price
PUT /api/products/:id/stock Admin Adjust stock quantity
GET /api/delivery/orders Delivery My assigned orders
PUT /api/delivery/orders/:id/pickup Delivery Mark picked up
PUT /api/delivery/orders/:id/deliver Delivery Mark delivered + proof upload
GET /api/chat/:shopId Admin|Shop Chat message history
POST /api/chat/:shopId Admin|Shop Send chat message
GET /api/notifications Any My notifications
PUT /api/notifications/:id/read Any Mark notification read
POST /api/announcements Admin Compose and send announcement
POST /api/disputes Shop File a dispute on a delivered order
GET /api/disputes Admin List all disputes
PUT /api/disputes/:id Admin Resolve or reject dispute
GET /api/settings Admin Get all platform settings
PUT /api/settings Admin Update platform settings
POST /api/discount/validate Shop Validate discount code at checkout
GET /api/reports/orders Admin Export orders CSV/Excel
GET /api/reports/balances Admin Balance aging report
GET /api/reports/products Admin Product sales report
POST /api/cron/prices QStash (signed) Apply scheduled price change
POST /api/cron/expiry QStash (signed) Run daily account expiry check
POST /api/cron/sms QStash (signed) Send SMS fallback for unread critical notifs

12. Recommended Build Order
    Each phase is independently testable before moving to the next.

Phase 1 — Foundation
• Prisma schema: all tables defined and migrated
• Auth system: JWT sign/verify, login API, role middleware
• Admin login + basic admin shell layout (sidebar, header)
• Shop login + basic shop shell layout
• Delivery login + basic delivery shell layout
Tech: npx create-next-app@latest b2b-platform --typescript --tailwind --app | npx shadcn@latest init | docker-compose.yml with PostgreSQL 16 + Redis 7 | npx prisma migrate dev --name init | Push to GitHub, connect Vercel, verify preview deployment

Phase 2 — Products & Catalogue
• Admin: add/edit/delete products with image upload (Cloudinary)
• Admin: categories management
• Shop: browse product catalogue
• Shop: shopping cart (client-side Zustand state)
Tech: shadcn Card, Badge, Input; react-hook-form + zod for product CRUD; TanStack Query for catalogue fetching

Phase 3 — Core Order Flow
• Order placement API with full validation chain
• Order merge logic (with DB transaction + row lock)
• Balance engine (debit on BNPL, credit on payment)
• Admin review queue (Pusher real-time updates)
• Admin: view and manage orders, daily view
• Shop: order history, order detail, status tracking
Tech: Zod validation in /api/orders; Prisma transactions for merge + stock reservation; Pusher events for admin review queue

Phase 4 — Delivery Portal
• Admin: delivery person management
• Admin: assign delivery person to order
• Delivery portal: my orders, order detail
• Delivery: mark picked up, mark delivered
• Proof photo upload (Cloudinary)
• GPS capture at delivery (navigator.geolocation)
Tech: Cloudinary direct upload; store proof_gps_lat/lng; mobile-optimised shadcn layouts

Phase 5 — Balance, Payments & Expiry
• Balance ledger full UI (shop side + admin side)
• Admin: record payments against shop balance
• QStash: daily account expiry endpoint (/api/cron/expiry)
• Payment deadline UI (countdown, warnings)
• Partial payments and payment plan notes
Tech: Replace local BullMQ cron with QStash scheduled endpoints; Sentry error wrapping for ledger updates

Phase 6 — Communication
• Real-time chat (Pusher Channels)
• Announcements compose + send to targeted shops
• Notification system (in-app)
• Notification read/unread state
Tech: Pusher SDK for chat + announcements; PostHog events for notification reads/unreads

Phase 7 — Pricing, Settings & Config
• Price scheduling (admin UI + QStash /api/cron/prices)
• Price history per product
• Platform settings page (merge window, priorities, etc.)
• Priority labels — admin CRUD + assign to orders
Tech: QStash triggers price jobs at effective_date + effective_time; log all settings changes to shop_privilege_log with admin ID

Phase 8 — Additional Features
• Shop registration approval flow
• Dispute system (file + resolve with balance credit)
• Discount codes
• Stock reservation on order
• Invoice / PDF generation
• Analytics export (CSV/Excel)
• Two-factor authentication (OTP via SMS)
• SMS/WhatsApp notification fallback
• Google Maps address integration
• Quick reorder
• Sales Rep sub-role (optional last)
Tech: Playwright E2E tests for dispute flow, discount validation, PDF generation; PostHog funnels configured; npm audit in CI

13. Day 1 Execution Checklist
    Run these commands in order. Verify each step before proceeding.

14. npx create-next-app@latest b2b-platform --typescript --tailwind --app
15. npx shadcn@latest init → add button, input, form, table, dialog, badge, card, toast
16. Create docker-compose.yml with PostgreSQL 16 + Redis 7
17. Copy Prisma schema, run: npx prisma migrate dev --name init
18. Implement JWT auth middleware + role-based route guards
19. Push to GitHub, connect Vercel, verify preview deployment
20. Configure Upstash Redis + QStash in Vercel environment variables
21. Configure Pusher app credentials in environment variables
22. Connect Sentry SDK at app root
23. Begin Phase 1 layout while auth stabilizes

Environment Variables to Configure
Variable Service
DATABASE_URL Neon PostgreSQL connection string
DIRECT_URL Neon direct connection (for Prisma migrations)
JWT_SECRET Secret for signing JWTs
UPSTASH_REDIS_REST_URL + TOKEN Upstash Redis
QSTASH_TOKEN + QSTASH_CURRENT_SIGNING_KEY Upstash QStash (verify signed requests)
PUSHER_APP_ID + KEY + SECRET + CLUSTER Pusher Channels
CLOUDINARY_CLOUD_NAME + API_KEY + SECRET Cloudinary storage
GOOGLE_MAPS_API_KEY Maps / Places Autocomplete
RESEND_API_KEY Email via Resend
SENTRY_DSN Sentry error tracking
POSTHOG_API_KEY PostHog analytics
TWILIO_ACCOUNT_SID + AUTH_TOKEN SMS / OTP fallback

— End of Architecture & Build Plan Document —

---

UI:

B2B Distribution Platform — Complete UI/UX Design System
Light & Dark Mode Specification | Professional Enterprise Standard

Design Philosophy

- Clarity First
- Context Adaptive
- Role Distinct
- Pakistani Market Ready

Color System:

- Light and dark tokenized palettes with semantic statuses
- Role accents for admin/shop/delivery

Typography:

- Inter primary, Urdu fallback optional
- Strong hierarchy and tabular numeric treatment

Component styling:

- Buttons, inputs, tables, cards, badges with explicit light/dark behavior

Role identities:

- Admin: high-density data operations
- Shop: balance and order operations
- Delivery: mobile-first execution flow

Spacing:

- 4px base scale

Accessibility:

- WCAG AA contrast, keyboard focus, reduced motion support, colorblind-safe patterns

Dark mode strategy:

- CSS variables under root and data-theme overrides
- persistent preference and test checklist

Final handoff quality checklist:

- token consistency
- typography responsiveness
- interaction states
- role differentiation
- data table readability
- mobile delivery usability
- status triple-encoding (color + icon + label)
- loading/empty/error state design
- micro-interaction consistency
- accessibility verification

"""
