# Anisekai

AI-powered **Anime & Trading Card Game (TCG) intelligence platform** — leaks,
episodes, TCG market, trends, news, and a member system, presented as a
widget-based dashboard. Built on the CasRadar architecture (domain swapped from
Casino to Anime + TCG).

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript 5 · Tailwind CSS v4
· Prisma 7 + Postgres (Neon) · `jose` JWT auth · provider-agnostic AI engine ·
Vercel Blob media.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, etc.
npx prisma migrate dev       # apply the schema to your database
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                  | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Dev server (Turbopack)                      |
| `npm run build`         | Production build                            |
| `npm run typecheck`     | `tsc --noEmit`                              |
| `npm run prisma:migrate`| `prisma migrate dev`                        |
| `npm run db:seed`       | Seed roles, TCG games, news categories      |
| `npm run vercel-build`  | `prisma migrate deploy && next build`       |

## Project rules & docs

Agent/contributor rules live in **[`AGENTS.md`](./AGENTS.md)** (imported by
`CLAUDE.md`). Full product specifications are in **[`docs/`](./docs)**.

## Status

**Phase 1 (foundation)** — project scaffold, design system, site shell
(header/footer/theme), homepage dashboard, and full Prisma schema. Public
section pages, the CMS control center, member system, AI engine, and the
Phase 2 Virtual Pet are built on top of this foundation next.
