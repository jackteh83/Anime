<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure
may all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Anisekai — agent operating rules

Anisekai is an **AI-powered Anime & Trading Card Game (TCG) intelligence
platform**. It is built on the mature **CasRadar** architecture, with the
business domain swapped from Casino to Anime + TCG. Reuse CasRadar patterns
(dashboard layout, card UI, CMS philosophy, Homepage Builder, Media Library,
AI workflow, SEO Manager, Scheduler) wherever possible — do not redesign them.

This file is the single source of truth for every AI tool. `CLAUDE.md` just
imports it. Keep this file short and high-signal; deep specs live in `docs/`.

## Tech stack

| Layer     | Choice                                                              |
| --------- | ------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router) + React 19.2 + TypeScript 5                 |
| Bundler   | Turbopack (default in v16 — no `--turbopack` flag)                  |
| Styling   | Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first `@theme` tokens) |
| Database  | Prisma 7 + `@prisma/adapter-pg` + `pg` (Postgres / Neon)           |
| Auth      | Self-hosted JWT via `jose` + `bcryptjs`                             |
| AI        | Provider-agnostic; `@anthropic-ai/sdk` + fetch adapters for others |
| Media     | `@vercel/blob` + `sharp`                                            |
| Validation| `zod` v4                                                           |
| Icons     | `lucide-react` (note: brand icons like Twitter/Youtube were removed)|

## Directory map

```
src/app/(site)/     Public site (homepage dashboard + sections)
src/app/admin/      CMS control center (Phase 2+)
src/components/     Shared UI (site-header, site-footer, ui primitives, ...)
src/lib/            db (Prisma client), nav config, data helpers
prisma/             schema.prisma, seed.ts, migrations/
prisma.config.ts    Prisma 7 config (connection URLs live here, NOT in schema)
docs/               Full product specs — the deep source of truth (read on demand)
graphify-out/       Code knowledge graph (GRAPH_REPORT.md) — read to save tokens
scripts/graphify.mjs  Regenerates the graph (`npm run graphify`)
```

## Save tokens: read the graph first

`graphify-out/GRAPH_REPORT.md` maps every route, module, file, and its exports,
plus the full data model. Read it to locate code instead of grepping the whole
tree. Regenerate with `npm run graphify` after structural changes.

## Long-term rules (non-negotiable)

1. **Everything lives in this repo.** No code, config, or spec kept only in chat.
2. **English is the default language; a ZH toggle is provided.** Author UI copy
   in English; keep it translation-ready (no hardcoded concatenation).
3. **Secrets go in Vercel environment variables, never in the repo.** See
   `.env.example` for the key names. `.env*` is gitignored.
4. **Development happens on branch `claude/anime-tcg-website-9ow0e1`.** After a
   change: run `npm run build`, then commit and push to that branch. (CasRadar's
   rule is push-to-`main`; this project uses the feature branch until told
   otherwise.) Do not open a PR unless explicitly asked.
5. **AI never publishes directly.** Every AI output enters a review queue and
   requires manual editorial approval (see `docs/04_AI_Engine.md`).
6. **AI providers are never hardcoded.** Switching provider/model is config +
   API key only — no code changes (see `docs/04_AI_Engine.md`).
7. **The approved homepage design is locked.** No homepage widget/section may be
   removed unless the owner asks; widgets may be enhanced (see `docs/05`).

## Next.js 16 gotchas (already applied — keep them)

- Async Request APIs: `params`, `searchParams`, `cookies()`, `headers()`,
  `draftMode()` are **async** — always `await` them.
- `middleware` → `proxy` (nodejs runtime only). No `next lint` (use ESLint/Biome
  directly; `next build` no longer lints).
- `next/image`: use `images.remotePatterns` (not `images.domains`).
- Env: `serverRuntimeConfig`/`publicRuntimeConfig` removed — read `process.env`.

## Prisma 7 workflow

- Connection URLs are **not** in `schema.prisma`; they live in
  `prisma.config.ts` (migrate) and the `PrismaPg` adapter in `src/lib/db.ts`
  (runtime). Pooled `DATABASE_URL` at runtime; direct `DIRECT_URL` for migrate.
- Schema change → `npx prisma migrate dev --name <change>` locally → commit the
  migration. Deploy runs `prisma migrate deploy && next build` (`vercel-build`).
- Import the client from `@/lib/db` (singleton), never `new PrismaClient()`.

## Design system

Dark theme is default; `[data-theme="light"]` overrides. Brand red `#e5121f`
(`--primary`); category accents purple/blue/green/orange/pink/cyan/yellow.
Tokens are in `src/app/globals.css`; use semantic utilities (`bg-surface`,
`text-muted`, `border-line`, `rounded-card`) rather than raw hex.

## Specs index (docs/)

- `01_Master_PRD.md` — modules, mandatory rules, navigation, AI philosophy
- `02_Frontend_UI_UX.md` — header, homepage widgets, five main sections, footer
- `03_CMS_Control_Center.md` — dashboard, content mgmt, Homepage Builder, etc.
- `04_AI_Engine.md` — collect→classify→summary→translate→SEO→review→publish
- `05_Product_Details_Addendum.md` — homepage lock, ads, permissions, roadmap
- `06_Database_Design.md` — core tables + design rules
- `07_Member_System.md` — auth, profile, roles, features
- `08_Virtual_Pet_Framework.md` — Phase 2 reserved interfaces (data model only)
