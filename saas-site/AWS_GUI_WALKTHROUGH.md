AWS Console GUI walkthrough — get connection string & create app user (no CLI needed)

Follow these steps in the AWS Management Console. This uses only the UI (RDS + Query Editor) so you don't need to run PowerShell or CloudShell.

Overview
- We'll: (A) copy the cluster endpoint & port, (B) run SQL in RDS Query Editor (no SG changes required) to create an application user and DB, (C) construct the DATABASE_URL for Prisma.
- After you paste the DATABASE_URL here I can (if you want) run the Prisma migration for you.

Step A — Copy cluster endpoint & port
1. Open AWS Console: https://console.aws.amazon.com/
2. In the Services menu, choose RDS.
3. In the left menu choose "Databases".
4. Find and click your Aurora cluster (the cluster row named "database-1" or similar).
5. On the cluster details, open the "Connectivity & security" tab or panel.
6. Copy the "Cluster endpoint" value (host) — e.g. database-1.cluster-...eu-west-1.rds.amazonaws.com
7. Note the port (usually 5432).
8. Keep these values handy.

Step B — Use RDS Query Editor (GUI) to create app user + database
Query Editor v2 runs inside AWS and does not require modifying inbound SG rules.

1. In the RDS console left menu, click "Query editor" (Query Editor v2) or "Query editor" under the Databases menu.
   - If you haven't used it before, you may need to enable it; follow the on-screen prompts — it uses your AWS Console session.
2. In Query Editor:
   - Select the cluster (writer endpoint, not the reader) or use "Connect using database credentials".
   - In the connection dialog:
     - Host: use the cluster endpoint you copied.
     - Port: 5432
     - Database: you can use "postgres" for the initial connection (we can create the app DB later).
     - Username: your master DB user (the admin you configured when creating the cluster).
     - Password: the master DB password.
     - SSL: choose "require" or enable TLS if asked.
   - Click "Connect".
3. Run the SQL statements below in Query Editor (edit APP_USER and APP_PW or let the script show APP_PW):
   Replace APP_USER and APP_PW and DB_NAME as you prefer, or use the examples below.

   -- Example SQL (copy & paste into Query Editor and run)
   -- Change APP_USER / APP_PW / DB_NAME to your chosen values
   BEGIN;
   -- Create application user if not exists
   DO
   $$
   BEGIN
     IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'serviceco_user') THEN
       CREATE ROLE serviceco_user WITH LOGIN PASSWORD 'ReplaceWithStrongPassword1!';
     END IF;
   END
   $$;

   -- Create application database owned by the app user if not exists
   DO
   $$
   BEGIN
     IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'serviceco') THEN
       PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE serviceco OWNER serviceco_user');
     END IF;
   END
   $$;

   -- Grant privileges for the app user on public schema
   REVOKE CONNECT ON DATABASE serviceco FROM PUBLIC;
   GRANT CONNECT ON DATABASE serviceco TO serviceco_user;
   \c serviceco
   GRANT USAGE ON SCHEMA public TO serviceco_user;
   GRANT CREATE ON SCHEMA public TO serviceco_user;
   COMMIT;

   Notes:
   - If the Query Editor does not accept the dblink_exec call, simply do:
     CREATE DATABASE serviceco OWNER serviceco_user;
     (you must be connected as a superuser / master role).
   - If you created the DB when provisioning Aurora, skip the CREATE DATABASE step and only create the role.

4. After the SQL runs successfully, pick a strong password for the app user (if you didn't set one in the SQL above). Save it securely.

Step C — Build the DATABASE_URL
1. Use this format (Prisma):
   postgresql://APP_USER:APP_PW@ENDPOINT:PORT/DB_NAME?schema=public&sslmode=require

2. Example using the cluster info you provided and example user:
   postgresql://serviceco_user:STRONGPW@database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com:5432/serviceco?schema=public&sslmode=require

3. Create a local .env (do NOT commit):
   - File: saas-site/.env
   - Contents:
     DATABASE_URL="postgresql://serviceco_user:STRONGPW@database-1.cluster-c1iw6qyk0258.eu-west-1.rds.amazonaws.com:5432/serviceco?schema=public&sslmode=require"

Step D — Next steps (I can run or you can run)
- If you want me to run migrations, paste the full DATABASE_URL here and explicitly say "Run migrations now (prisma migrate dev)".
- If you prefer to run yourself, the commands are:
  cd saas-site
  npx prisma migrate dev --name init
  npx prisma generate

Security & cleanup
- After the migration & testing, rotate the master DB password (change it in AWS RDS) and revoke any temporary public access if you opened it.
- Store the app user's credentials in your secret store (Vercel env, AWS Secrets Manager, etc.)

If you'd like, I can produce a shorter, single‑page checklist you can follow on-screen while in the AWS Console. Would you like that condensed checklist now, or do you want to paste the DATABASE_URL here once you copy it from Console so I can run the migration for you?
