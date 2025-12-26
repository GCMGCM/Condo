# Create a DB user & obtain DATABASE_URL for AWS Aurora (Postgres) — step-by-step guide

This guide shows the exact steps to create an application DB user on your Aurora PostgreSQL cluster, get the connection string (DATABASE_URL) in Prisma format, and prepare to run Prisma migrations. Follow the steps in order.

Prerequisites
- You already created an Aurora PostgreSQL cluster and have the cluster endpoint & port (you provided: database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com:5432).
- You have the master username and password you entered when creating the cluster.
- You have access to the AWS Console and (optionally) CloudShell, or a machine that can connect to the DB (IP allowed in the cluster security group).

1) Decide database name & app user
- Database name (example): `serviceco`
- App DB user (example): `serviceco_user`
- Use a strong password for the app user (rotate later).

2) Temporarily allow a connection source
- If your cluster is NOT publicly accessible (recommended for production), you'll need a bastion / EC2 in the same VPC or use AWS CloudShell and temporary security rules.
- For quick testing, you can allow your current public IP to connect:
  - Get your IP (from your browser): https://ifconfig.me or https://whatismyip. Use IPv4.
  - In AWS console → EC2 → Security Groups → find the SG attached to your cluster → Edit inbound rules → Add rule: Type: PostgreSQL, Port: 5432, Source: your-ip/32.
  - Save changes.

3) Connect to the cluster as the master user
Option A — Use AWS CloudShell (no setup):
  - Open AWS Console → CloudShell (top bar).
  - Install psql client (if not available) or use `psql` if present.

Option B — From your local machine:
  - Ensure your IP is added to SG inbound rules.
  - Install psql (psql client / libpq).
  - Connect:
    psql "host=database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com port=5432 user=<MASTER_USER> dbname=<INITIAL_DB> sslmode=require"

Example:
  psql "host=database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com port=5432 user=svc_admin dbname=serviceco sslmode=require"

4) Create an application role and database (recommend)
Once connected as the master user, run these SQL commands (adjust names & password):

  -- create the user
  CREATE ROLE serviceco_user WITH LOGIN PASSWORD 'STRONG_PASSWORD_HERE';

  -- create the application database owned by app user
  CREATE DATABASE serviceco OWNER serviceco_user;

  -- optional: grant additional privileges if needed
  GRANT CONNECT ON DATABASE serviceco TO serviceco_user;

Notes:
- If you provided an initial database name during cluster creation, that DB may already exist; you can still create the user and GRANT privileges on that DB.

5) Ensure the user can create tables (via schema migrations)
Connect to the `serviceco` database as the master (or any superuser) and run:

  \c serviceco  -- switch to the database

  -- grant typical privileges
  GRANT ALL PRIVILEGES ON DATABASE serviceco TO serviceco_user;

(Prisma migrate will create schemas/tables as the app user; if you prefer to restrict, create more granular grants later.)

6) Build the Prisma DATABASE_URL
Format:

  postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&sslmode=require

Using the example names:

  postgresql://serviceco_user:STRONG_PASSWORD_HERE@database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com:5432/serviceco?schema=public&sslmode=require

7) Test connection as app user (recommended)
From CloudShell or your machine (after authorizing your IP):

  psql "host=database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com port=5432 user=serviceco_user dbname=serviceco sslmode=require"

If you successfully connect, you're ready for migrations.

8) Save DATABASE_URL securely
- Locally (for testing): create `saas-site/.env` (do NOT commit) and add:
  DATABASE_URL="postgresql://serviceco_user:STRONG_PASSWORD_HERE@database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com:5432/serviceco?schema=public&sslmode=require"

- For Vercel: go to your Vercel project → Settings → Environment Variables and add `DATABASE_URL` for Preview and Production.

9) Prisma migration strategy (recommended)
- Recommended pattern for production Aurora:
  - Create migration files locally (in dev environment), review them, commit migrations, then run `npx prisma migrate deploy` in CI or on the server that will run migrations (non-interactive).
- If you want me to run migrations for you now:
  - Provide the DATABASE_URL and explicitly ask which migration command:
    - `npx prisma migrate dev --name init` — will create migration files and apply them (interactive; creates the migrations directory).
    - `npx prisma migrate deploy` — applies existing migrations non-interactively (safe for production when migrations are pre-generated).
- If you do not want to run migrations manually, provide DATABASE_URL here and I can run them for you after you confirm.

10) After migrations & testing
- Rotate DB credentials (create new app user or change password) if desired.
- Revoke the temporary inbound rule to your IP in the Security Group (for security).

11) Additional production notes
- For production Vercel → Aurora connectivity:
  - Vercel cannot directly join your VPC. Use one of:
    - RDS Proxy + a small AWS-hosted app server or Lambda inside your VPC that handles DB access.
    - Deploy your app into AWS (ECS/Fargate/EC2) inside the same VPC.
    - Use a DB provider that integrates with Vercel more easily (Neon, Vercel Postgres).
  - For secure production, avoid making your DB publicly accessible; prefer proxy/VPC solutions.

If you'd like, next I can:
- Provide the exact console clicks and screenshots-style guidance for the AWS Console (step-by-step commands you can copy).
- Once you paste the DATABASE_URL here I will run a safe migration command you choose (you must explicitly approve).
- Or I can prepare the repo with migration files (using `npx prisma migrate dev` locally with SQLite) and then you can run `prisma migrate deploy` against Aurora — but you said you don't want to run migrations yourself.

Which of the above would you like now?
</question>
</ask_followup_question>
