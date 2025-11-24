Quick local setup and production checklist

1) Copy environment template

  - Copy `.env.example` to `.env` and fill in secrets.

2) Local Postgres (Docker)

  ```powershell
  docker run --name advisortrends-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=adv_user -e POSTGRES_DB=advisortrends -p 5432:5432 -d postgres:15
  # then update .env:
  # DATABASE_URL=postgresql://adv_user:secret@localhost:5432/advisortrends
  ```

3) Install dependencies

  ```powershell
  cd "c:\Users\oasis\Documents\AdvisorTrends\AdvisorTrends"
  npm install
  ```

4) Run DB migrations (once DATABASE_URL is set)

  ```powershell
  npx drizzle-kit push
  # or
  npm run db:push
  ```

5) Start dev server

  ```powershell
  $env:NODE_ENV='development'; cd "c:\Users\oasis\Documents\AdvisorTrends\AdvisorTrends"; npm run dev
  ```

6) Signup / Magic link

  - POST `/api/signup` with JSON { "email": "you@domain.com" }.
  - Check console for magic link if SendGrid is not configured, or check your email.

7) Production checklist

  - Provision a managed Postgres and set `DATABASE_URL` as an environment secret.
  - Configure `SESSION_SECRET`, `OPENAI_API_KEY`, and `SENDGRID_API_KEY`.
  - Remove mock storage fallback (optional) once DB is confirmed.
  - Enable a real auth provider if you prefer (Clerk, Supabase, Replit OIDC).
