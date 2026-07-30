import { defineConfig } from 'prisma/config'

// Prisma 7 configuration. Connection URLs are no longer allowed in schema.prisma;
// migrate/introspect read them from here. The runtime PrismaClient uses the
// @prisma/adapter-pg adapter (see src/lib/db.ts) with the pooled DATABASE_URL.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Direct (unpooled) connection for migrations; falls back to DATABASE_URL.
    // Read via process.env (not prisma's strict env()) so validate/generate work
    // without a local .env — Vercel injects the real values at deploy time.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
