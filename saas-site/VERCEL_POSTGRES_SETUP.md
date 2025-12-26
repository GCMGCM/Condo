Vercel Postgres — quick setup and how to get DATABASE_URL (step-by-step)

This guide shows how to create a Vercel Postgres instance, copy the connection string (DATABASE_URL) and what I will do once you paste it here. This is the easiest path to get a hosted Postgres that works with Vercel.

1) Create a Vercel Postgres database
- Sign in to Vercel (https://vercel.com).
- Open your project (or create a new project).
- In the project dashboard, go to the "Integrations" or "Add" area and find "Vercel Postgres".
- Click "Add" / "Create" and follow prompts:
  - Choose plan (Hobby is fine for testing)
  - Choose a region (pick an EU region for GDPR, e.g., frankfurt (eu-central-1) or ireland (eu-west-1) if available)
  - Create the database; Vercel will provision it.

2) Get connection string (DATABASE_URL)
- In the Vercel project dashboard, go to "Integrations" → "Vercel Postgres" → your database.
- Click "Connection info" (or "Settings" → "Connection string").
- Copy the "Connection string" labeled as "Connection String" or "Primary connection string".
- It will typically look like:
  postgresql://postgres:password@ep-some-host-pg-vercel.internal:5432/vercel_db_name

- Vercel provides a special connection string for serverless environments — use the string they provide for `DATABASE_URL`.

3) Add DATABASE_URL to local .env and Vercel env
- Locally (for testing): create saas-site/.env (do NOT commit)
  DATABASE_URL="paste_the_connection_string_here"
- In Vercel: go to Project → Settings → Environment Variables → add DATABASE_URL (for Preview and Production).

4) Prisma migrations — two options
A) I run them for you (I will need you to paste the DATABASE_URL here and explicitly say "Please run migrations now (prisma migrate dev)")
B) You run them (commands below)

If you run them locally or in CI:
- cd saas-site
- npx prisma migrate dev --name init
- npx prisma generate

If you want non-interactive (deploy):
- cd saas-site
- npx prisma generate
- npx prisma migrate deploy

5) Why Vercel Postgres is easier
- Seamless integration with Vercel projects (no VPC peering required)
- Vercel provides connection string that works from Vercel serverless functions
- No manual security-group IP whitelisting needed for basic usage
- Good for small-medium apps and testing

6) After you paste the DATABASE_URL here and say "Please run migrations now (prisma migrate dev)":
- I'll create a temporary saas-site/.env with DATABASE_URL (not committed)
- Run:
  cd saas-site
  npx prisma migrate dev --name init
  npx prisma generate
- Test the signup flow at http://localhost:3002/signup
- Remove the temporary saas-site/.env
- Report results and advise rotation of any temporary DB credentials if necessary

Security notes
- Do not paste DATABASE_URL in public places.
- After successful migrations, keep DATABASE_URL in Vercel environment variables for deployment.

When ready:
- Paste the DATABASE_URL here and type:
  Please run migrations now (prisma migrate dev)

Or say "Show me condensed GUI checklist" if you want a short on-screen checklist for Vercel UI steps instead.
