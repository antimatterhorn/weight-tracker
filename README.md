# Weight Tracker

A personal weight tracking app. Next.js (App Router) + Drizzle ORM + Turso (libSQL), deployed on Vercel.

## Features

- Log daily weight entries with an optional note (re-logging the same date updates that entry instead of duplicating it)
- Weight trend chart
- Goal weight tracking with progress
- Single shared password gate (this is a single-user app, not multi-tenant)

## Local development

Node.js 20+ is required.

1. Install dependencies:

   ```
   npm install
   ```

2. Copy the env example and fill it in:

   ```
   cp .env.local.example .env.local
   ```

   - Leave `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` empty to use a local SQLite file (`./local.db`) — no Turso account needed for local dev.
   - Set `APP_PASSWORD` to whatever password you want to use to log in.
   - Generate `AUTH_SECRET` with `openssl rand -hex 32`.

3. Apply the database schema:

   ```
   npm run db:migrate
   ```

4. Run the dev server:

   ```
   npm run dev
   ```

## Setting up Turso (production database)

1. Install the Turso CLI and sign in: https://docs.turso.tech/cli/installation
2. Create a database:

   ```
   turso db create weight-tracker
   ```

3. Get the connection URL and an auth token:

   ```
   turso db show weight-tracker --url
   turso db tokens create weight-tracker
   ```

4. Put those values in a local `.env.production.local` (or just export them in your shell) and run the migration against the real database:

   ```
   TURSO_DATABASE_URL=<url> TURSO_AUTH_TOKEN=<token> npm run db:migrate
   ```

   Re-run this (against the production URL/token) any time you change `src/db/schema.ts` and generate a new migration with `npm run db:generate`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, import the GitHub repo as a new project (framework preset: Next.js — auto-detected).
3. Add these environment variables in the Vercel project settings:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `APP_PASSWORD`
   - `AUTH_SECRET`
4. Deploy. Every push to the connected branch will redeploy automatically.

Migrations are not run automatically on deploy — run `npm run db:migrate` locally against the production database (step 4 above) whenever the schema changes, before or after deploying.

## Notes

- `npm run db:studio` opens Drizzle Studio against whichever database your env vars point to — handy for poking at the data directly.
- Session auth is a single HMAC-signed cookie (no user accounts); anyone with `APP_PASSWORD` has full access.
