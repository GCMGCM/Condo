Condensed GUI checklist — copy/paste while in AWS Console

1) Open RDS → Databases → click your cluster (database-1)
2) Click "Connectivity & security" and copy:
   - Cluster endpoint (HOST)
   - Port (usually 5432)

3) Open "Query editor" (RDS → Query editor)
   - Connect using Database credentials:
     * Host: (HOST)
     * Port: 5432
     * Database: postgres
     * Username: master username
     * Password: master password
     * SSL: require
   - Click Connect

4) In the editor, run (replace APP_USER, APP_PW, DB_NAME if you want):
   -- create app user
   CREATE ROLE serviceco_user WITH LOGIN PASSWORD 'ReplaceWithStrongPassword1!';
   -- create DB if missing
   CREATE DATABASE serviceco OWNER serviceco_user;
   -- grants
   REVOKE CONNECT ON DATABASE serviceco FROM PUBLIC;
   GRANT CONNECT ON DATABASE serviceco TO serviceco_user;
   \c serviceco
   GRANT USAGE ON SCHEMA public TO serviceco_user;
   GRANT CREATE ON SCHEMA public TO serviceco_user;

5) Build DATABASE_URL (copy exact line):
   postgresql://serviceco_user:ReplaceWithStrongPassword1!@HOST:5432/serviceco?schema=public&sslmode=require

6) Paste the DATABASE_URL here with the sentence:
   Please run migrations now

I will then:
- create saas-site/.env (temporary),
- run: cd saas-site && npx prisma migrate dev --name init && npx prisma generate
- test the signup flow at http://localhost:3002/signup
- report results and remove temporary .env
