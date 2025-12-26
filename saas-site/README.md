# ServiceCo — Modern Online Services Marketplace

A production-ready Next.js SaaS template to sell services online with:
- Next.js (App Router) + TailwindCSS
- Authentication via Clerk
- Online database (PostgreSQL via Neon)
- Payments via Stripe (Checkout + Webhook)
- Support tickets (users + staff), seed/admin endpoints
- Fully deployable to Vercel (no local hosting required)

Live-ready: you can deploy straight to Vercel, connect Neon, Clerk and Stripe, and start selling without running on your computer.

---

## 1) Tech Stack

- Next.js 16 (App Router), React 19, TypeScript, TailwindCSS 4
- Prisma ORM with Neon PostgreSQL (cloud hosted)
- Clerk for auth (prebuilt UI via SignInButton modal)
- Stripe for payments (Checkout Session + webhook for fulfillment)
- Serverless APIs on Vercel

---

## 2) App Features

- Marketing pages: Home, About, Services, Contact, FAQ, Privacy, Terms
- Services catalog (DB-backed) with “Buy now” flow via Stripe Checkout
- Webhook fulfillment -> updates orders to PAID, handles refund and expiry
- Support Tickets API (create/list + add message), Contact page creates tickets
- Admin endpoints:
  - POST /api/admin/seed — seed example services
  - GET/POST /api/admin/staff — list/add staff users (SUPPORT/ADMIN roles)
- Health endpoint: GET /api/health

Database models:
- Service, Order, Ticket, TicketMessage, Staff

---

## 3) Directory Highlights

- prisma/schema.prisma — DB schema (Neon PostgreSQL)
- src/lib/db.ts — Prisma client singleton
- src/lib/stripe.ts — Stripe SDK initialization
- src/lib/roles.ts — staff/admin helpers
- src/middleware.ts — minimal Clerk middleware
- src/components/ — header, footer, contact form, buy button, providers
- src/app/(pages)/ — about, contact, faq, privacy, terms, services
- src/app/api/ — services, checkout, stripe/webhook, tickets, admin, health

---

## 4) Deploy End-to-End (Everything Online)

You will not host anything locally. Use the following online services:

- Hosting: Vercel (free tier compatible)
- Database: Neon (PostgreSQL, serverless, free tier)
- Auth: Clerk (free tier compatible)
- Payments: Stripe

### Step A. Put code in a Git repo
- Create a new GitHub repository and push this `saas-site` folder to it.
  - Or use “Import Git Repository” in Vercel and point to your repo.

### Step B. Create Neon PostgreSQL (cloud)
- Go to https://neon.tech and create a project/database
- Get the connection string (ensure SSL): 
  postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
- This is your DATABASE_URL

### Step C. Create a Clerk application
- Go to https://clerk.com and create an application
- Get Publishable key and Secret key

### Step D. Create a Stripe account and keys
- Go to https://dashboard.stripe.com
- Create API keys:
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - STRIPE_SECRET_KEY
- Create a webhook endpoint in Stripe Dashboard:
  - URL: https://YOUR_VERCEL_URL/api/stripe/webhook
  - Events: checkout.session.completed, charge.refunded, checkout.session.expired
  - Copy the “Signing secret” as STRIPE_WEBHOOK_SECRET

### Step E. Deploy to Vercel
- Go to https://vercel.com → New Project → Import your repo
- Framework preset: Next.js
- Set Environment Variables (from .env.example):
  - NEXT_PUBLIC_SITE_URL = https://YOUR_VERCEL_URL
  - NEXT_PUBLIC_APP_NAME = ServiceCo
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_...
  - CLERK_SECRET_KEY = sk_...
  - DATABASE_URL = postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_...
  - STRIPE_SECRET_KEY = sk_...
  - STRIPE_WEBHOOK_SECRET = whsec_...
  - ADMIN_SECRET = change-me-strong-secret
- Build command is already configured to run Prisma:
  - package.json “build”: `prisma generate && prisma db push && next build`
- Deploy

Note: You do not need to run any command locally. Vercel builds, generates Prisma client, and syncs the schema to Neon (db push) during deployment.

---

## 5) Seed Services and Add Staff (Online via cURL or Postman)

Once deployed, seed initial services (replace URL and secret):

Seed default services:
```
curl -X POST "https://YOUR_VERCEL_URL/api/admin/seed" \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: CHANGE_ME"
```

Upsert a custom service:
```
curl -X POST "https://YOUR_VERCEL_URL/api/services" \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: CHANGE_ME" \
  -d '{
    "slug":"logo-design",
    "name":"Logo Design",
    "description":"Craft a professional logo. Includes 2 concepts and revisions.",
    "priceCents":19900,
    "active":true
  }'
```

Add a staff user (so support team can reply to tickets):
```
curl -X POST "https://YOUR_VERCEL_URL/api/admin/staff" \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: CHANGE_ME" \
  -d '{"clerkUserId":"clerk_user_id_here","role":"SUPPORT"}'
```

List staff:
```
curl -X GET "https://YOUR_VERCEL_URL/api/admin/staff" \
  -H "x-admin-secret: CHANGE_ME"
```

---

## 6) Using the App

- Visit https://YOUR_VERCEL_URL
- Sign in (header Sign in button opens Clerk modal)
- Browse Services (/services)
- Click “Buy now” → redirects to Stripe Checkout → complete payment
- Webhook updates the order in Neon to PAID
- Contact support at /contact to create a ticket
- Staff can reply via API: POST /api/tickets/[id]/messages (requires staff or ticket owner)
- Health check: GET /api/health

---

## 7) Environment Variables (.env.example)

```
# App
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="Your Company"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_xxx
STRIPE_SECRET_KEY=sk_live_or_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Admin/Support
ADMIN_SECRET=change-me-strong-secret
```

Configure these in Vercel Project Settings → Environment Variables. Redeploy after changes.

---

## 8) Notes and Customization

- Prices are integer cents in USD.
- The header includes links to marketing pages and Services.
- Clerk’s prebuilt modal is used (no extra routes needed for auth).
- Stripe webhook route is node runtime and validates signatures.
- Staff/admin roles are in DB (Staff model). Admin endpoints are protected by ADMIN_SECRET header.
- You can add a dashboard UI in the future for orders/tickets.

---

## 9) Troubleshooting

- 401 on /api/checkout or /api/tickets POST → ensure you are signed in (Clerk) and cookies are enabled.
- 500 on webhook → ensure STRIPE_WEBHOOK_SECRET matches the endpoint’s signing secret from Stripe Dashboard.
- DB errors → verify DATABASE_URL and that Neon project is running.
- No services showing → seed via /api/admin/seed or POST /api/services with x-admin-secret.

---

## 10) License

MIT (You can use, modify, and deploy for commercial projects.)
