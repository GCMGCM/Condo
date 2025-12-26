#!/bin/bash
#
# Provision Vercel project (import GitLab repo) - INSTRUCTIONS + CLI commands
# NOTE: This script is intentionally interactive / instructional. Some provisioning
# steps (Vercel Postgres integration) must be completed via Vercel dashboard.
#
# Usage:
#  1. Save your VERCEL_TOKEN in an environment variable or export it before running:
#       export VERCEL_TOKEN="your_token_here"
#  2. Edit REPO and SCOPE below (if needed).
#  3. Run the commands one-by-one in your shell (they include comments).
#
# This script does NOT run Prisma migrations automatically; after you obtain the
# DATABASE_URL from Vercel Postgres, paste it into the chat and explicitly ask
# "Please run migrations now (prisma migrate dev)" and I will run them for you.

# --- Configuration (edit if needed) ---
SCOPE="my-personal-username"           # your Vercel scope (username or team)
REPO="https://gitlab.com/marcondes.gustavo/facilit3s"  # repo to import
PROJECT_NAME="facilit3s"               # project name to create in Vercel
# -------------------------------------

echo "1) Ensure VERCEL_TOKEN is exported:"
echo "   export VERCEL_TOKEN=\"<your token>\""
echo

echo "2) Install vercel CLI (if not installed):"
echo "   npm install -g vercel"
echo "or use npx vercel for ad-hoc commands."
echo

echo "3) Import the GitLab repo into Vercel (non-interactive import may not be fully supported)."
echo "   The CLI will try to import; if prompted, follow the interactive steps."
echo "   Example (use npx to avoid global install):"
echo "   npx vercel git connect --provider gitlab --token \$VERCEL_TOKEN --scope \$SCOPE"
echo
echo "   Then import the repo:"
echo "   npx vercel --token \$VERCEL_TOKEN --confirm --name \$PROJECT_NAME --scope \$SCOPE --git \$REPO"
echo
echo "   If the CLI prompts for additional options (framework, build command), choose:"
echo "     Framework: Other (or Next.js)"
echo "     Build command: prisma generate && next build"
echo "     Output directory: (leave blank for Next)"
echo

echo "4) Provision Vercel Postgres (this currently must be done in the Vercel Dashboard):"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Select your scope (top-left) -> Projects -> (your project) -> Integrations -> Add Integration"
echo "   - Find 'Vercel Postgres' and click 'Add' / 'Install' for the project"
echo "   - Pick plan and region (choose an EU region for GDPR)"
echo "   - After provisioning, go to the database's Connection Info and copy the DATABASE_URL"
echo
echo "5) After you have the DATABASE_URL, create a local .env in the repo root (saas-site/.env) with:"
echo "   DATABASE_URL=\"<paste the connection string here>\""
echo
echo "6) If you want me to run migrations for you, paste the DATABASE_URL into the chat and say:"
echo "   Please run migrations now (prisma migrate dev)"
echo
echo "7) If you prefer to run migrations locally yourself, run:"
echo "   cd saas-site"
echo "   npx prisma migrate dev --name init"
echo "   npx prisma generate"
echo
echo "Security note: Do not commit saas-site/.env. Rotate tokens/passwords after setup if desired."
echo
echo "If you want me to perform the entire process programmatically (I will need the token and will run the steps), confirm explicitly in the chat. Otherwise please follow the steps above and paste the DATABASE_URL here when available."
