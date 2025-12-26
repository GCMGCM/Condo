# Deployment checklist — Vercel + Neon (Postgres) + Clerk + Stripe

This document shows step-by-step instructions and the exact environment variables needed to deploy the app fully online (no local hosting). You asked NOT to deploy now — this file prepares the repo and documents everything so you can deploy manually or follow the steps later.

Summary
- App framework: Next.js (App Router), TypeScript, Tailwind
- Auth: Clerk (hosted)
- DB: Neon/Postgres (hosted)
- Payments: Stripe (hosted)
- Hosting: Vercel (recommended) — serverless functions + Edge

Required accounts
- GitHub (or other git provider) — push repo
- Vercel account
- Neon (or any Postgres; Neon recommended)
- Clerk account
- Stripe account

Environment variables
Add these in Vercel (both "Preview" and "Production" as needed) and locally in `.env` when testing.

Database
- DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DATABASE?schema=public"

Clerk
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
- CLERK_SECRET_KEY=sk_...
- NEXT_PUBLIC_CLERK_FRONTEND_API=frontend_api (optional, Clerk keyless flows)
- NEXT_PUBLIC_CLERK_DOMAIN=your-clerk-domain (if using satellite)
- CLERK_ENCRYPTION_KEY=some_random_secret_for_encrypting_middleware_data (recommended)
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://your-domain/auth/sign-in (dev only if satellite)

Stripe
- STRIPE_SECRET_KEY=sk_live_... (or test key sk_test_...)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
- STRIPE_WEBHOOK_SECRET=whsec_... (set after creating webhook in Stripe dashboard)

Other
- NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app (use your real domain)
- SENTRY_DSN (optional)

Prisma
- The project uses Prisma. After DATABASE_URL is set:
  - `npx prisma generate`
  - `npx prisma migrate deploy` (on production)
  - For local dev: `npx prisma migrate dev` to create migrations interactively

Vercel configuration
1. Push repo to GitHub (or Git provider).
2. Import repository into Vercel (New Project).
3. In Vercel project settings → Environment Variables: add the variables above.
4. Build & Output settings:
   - Build Command: prisma generate && next build
   - Install Command (if you want explicit): npm ci
   - Output Directory: (Next handles this automatically)
5. Deploy. After deploy, run DB migrations:
   - From a server shell: `npx prisma migrate deploy` (or via Vercel post-deploy step)
   - Or use the provided API seed endpoint: `POST https://your-domain/api/admin/seed` (if enabled)

Stripe webhook
1. In Stripe Dashboard → Developers → Webhooks, create a webhook endpoint:
   - URL: https://your-domain/api/stripe/webhook
   - Events: subscribe to `checkout.session.completed`, `invoice.payment_succeeded`, etc. (checkout & payment events used by repo)
2. Copy the webhook secret and set it as `STRIPE_WEBHOOK_SECRET` in Vercel.

Clerk setup
1. Create a Clerk application.
2. Add your Vercel deployment domain under “Frontend URLs” and set allowed origins if needed.
3. Copy publishable key (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) and secret key (CLERK_SECRET_KEY) into Vercel env.
4. If you use Clerk middleware features or satellites, set CLERK_ENCRYPTION_KEY and other advanced keys per Clerk docs.

Post-deploy / Optional
- After deployment, you can seed example services/users via:
  - `POST https://your-domain/api/admin/seed` (the repo includes a seed API route)
  - Or run prisma seed locally pointing at production DB (be careful).

Local testing (how you saw it)
- Run dev server (from project root):
  - `npx next dev ./saas-site --port 3002` (this starts dev server for the saas-site workspace)
  - OR: cd into `saas-site` and run `npm run dev` (if dependencies installed)
- Ensure `.env` contains the equivalent variables (use Clerk test keys / Stripe test keys / local Postgres) for local auth and payments.

Troubleshooting tips
- "Couldn't find pages or app directory" — make sure you run Next from the `saas-site` workspace (we set a root-level next.config.js pointing turbopack root and/or start Next with `./saas-site`).
- Clerk errors `MissingClerkProvider` / `SignedOut can only be used within <ClerkProvider />` — ensure the Providers component wraps your app (done).
- If Next can't acquire `.next/dev/lock`, ensure no other dev servers are running and remove stale lock file: `rm -f saas-site/.next/dev/lock` (on Windows: delete the file).
- Prisma migrations: always run `prisma generate` after pulling or before `next build`.

Minimal Vercel env example (.env.example already included in repo)
- Update `saas-site/.env.example` with real values before deploying. Example variables to add (copy these to Vercel):
  - DATABASE_URL=
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
  - CLERK_SECRET_KEY=
  - CLERK_ENCRYPTION_KEY=
  - NEXT_PUBLIC_CLERK_FRONTEND_API=
  - STRIPE_SECRET_KEY=
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
  - STRIPE_WEBHOOK_SECRET=
  - NEXT_PUBLIC_SITE_URL=
  - Any other provider keys you need (SENTRY_DSN, etc.)

Security notes
- Do not commit secret keys to source control.
- Use Vercel environment variables for production keys and restrict who can view them.

If you want, next I will:
- Update `saas-site/.env.example` with a complete list of variables and comments (I can write values as placeholders).
- Add a small "Deploy to Vercel" section to README with the steps above (I can commit the changes).
- Or keep repo unchanged and just hand you this checklist.

Which of those should I do now?
