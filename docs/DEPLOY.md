# Deploying Anisekai to Vercel

Anisekai is a Next.js 16 app with a Postgres (Neon) database. The front-end
deploys and renders with seed fallbacks even before a database is wired; the
admin CMS, AI engine, and member accounts light up once you add the env vars
below.

## 1. Vercel project settings

- **Framework Preset:** Next.js (also forced by `vercel.json`).
- **Build Command:** leave default — Vercel runs the `vercel-build` script:
  `prisma generate && (prisma migrate deploy && db:seed) && next build`.
  If no database is configured the migrate + seed step is skipped gracefully so
  the site still builds.
- **Production Branch:** set to the branch you want live (this project develops
  on `claude/anime-tcg-website-9ow0e1`). Every branch also gets a stable preview
  URL: `anime-git-<branch>-<team>.vercel.app`.

## 2. Database (Neon — free tier)

1. Create a Postgres database at [neon.tech](https://neon.tech).
2. Copy two connection strings from the Neon dashboard:
   - **Pooled** connection → `DATABASE_URL` (used at runtime).
   - **Direct** (unpooled) connection → `DIRECT_URL` (used by migrations).
   Both should end with `?sslmode=require`.

## 3. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Required for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | database features | Neon pooled connection string |
| `DIRECT_URL` | migrations | Neon direct connection string |
| `AUTH_SECRET` | login / sessions | a long random string (e.g. `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | seed admin | defaults to `admin@anisekai.com` |
| `ADMIN_PASSWORD` | seed admin | set a strong value for production |
| `ANTHROPIC_API_KEY` | AI engine | only if you use AI generation |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` / `XAI_API_KEY` / `OPENROUTER_API_KEY` | alt AI providers | optional |
| `AI_PROVIDER` / `AI_MODEL` | AI defaults | optional; default `anthropic` / `claude-opus-5` |
| `BLOB_READ_WRITE_TOKEN` | media uploads | from Vercel Blob (Storage tab) |
| `NEXT_PUBLIC_SITE_URL` | canonical URLs | your production URL |

## 4. Deploy

Push to the production branch (or click **Redeploy**). On a deploy **with** the
database vars set, `vercel-build` runs `prisma migrate deploy` (creates all 25
tables) then `db:seed` (roles, TCG games, news categories, and a Super Admin).

**Admin login** after seeding: `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(defaults `admin@anisekai.com` / `A99nime`) at `/admin/login`.

## 5. Vercel Blob (optional, for the Media Library)

In the Vercel dashboard: **Storage → Create → Blob**, then Vercel injects
`BLOB_READ_WRITE_TOKEN` into the project. Media uploads in the CMS use it.

## Troubleshooting

- **404 NOT_FOUND (Vercel page):** the deployment failed or was superseded —
  open the newest **Ready** deployment, not an old URL.
- **"No Output Directory named public":** framework preset wasn't Next.js —
  `vercel.json` now forces it; redeploy.
- **Build fails on `prisma migrate deploy`:** `DATABASE_URL`/`DIRECT_URL` are
  missing or wrong — the build is designed to skip migrate when the DB is
  unreachable, so a hard failure here means the URL is present but invalid.
- **Login/admin errors at runtime:** `AUTH_SECRET` and the database vars must be
  set; the front-end works without them but auth does not.
