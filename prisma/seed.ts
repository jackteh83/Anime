import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
})
const prisma = new PrismaClient({ adapter })

const ROLES = [
  { name: 'Super Admin', isSystem: true },
  { name: 'Administrator', isSystem: true },
  { name: 'Editor', isSystem: true },
  { name: 'Moderator', isSystem: true },
  { name: 'Author', isSystem: true },
  { name: 'Member', isSystem: true },
]

const TCG_GAMES = [
  { name: 'One Piece', slug: 'one-piece', sortOrder: 1 },
  { name: 'Pokémon', slug: 'pokemon', sortOrder: 2 },
  { name: 'Union Arena', slug: 'union-arena', sortOrder: 3 },
  { name: 'Yu-Gi-Oh!', slug: 'yugioh', sortOrder: 4 },
  { name: 'Weiss Schwarz', slug: 'weiss-schwarz', sortOrder: 5 },
  { name: 'Digimon', slug: 'digimon', sortOrder: 6 },
  { name: 'Dragon Ball Super', slug: 'dragon-ball-super', sortOrder: 7 },
]

const NEWS_CATEGORIES = [
  'Anime',
  'Manga',
  'Industry',
  'Movies',
  'Games',
  'Figures',
  'TCG',
  'Events',
  'Interviews',
]

async function main() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    })
  }

  for (const game of TCG_GAMES) {
    await prisma.tcgGame.upsert({
      where: { slug: game.slug },
      update: { name: game.name, sortOrder: game.sortOrder },
      create: game,
    })
  }

  for (const name of NEWS_CATEGORIES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, type: 'NEWS' },
    })
  }

  // Default RSS sources (real, free anime-news feeds). Editable in the CMS.
  const RSS_SOURCES = [
    { name: 'Anime News Network', url: 'https://www.animenewsnetwork.com/newsroom/rss.xml' },
    { name: 'Crunchyroll News', url: 'https://www.crunchyroll.com/newsrss' },
    { name: 'Gematsu', url: 'https://gematsu.com/feed' },
  ]
  for (const src of RSS_SOURCES) {
    const existing = await prisma.rssSource.findFirst({ where: { url: src.url } })
    if (!existing) {
      await prisma.rssSource.create({
        data: { name: src.name, url: src.url, type: 'RSS', enabled: true, category: 'NEWS' },
      })
    }
  }

  // Super Admin account. Credentials come from env; the defaults let a fresh
  // database work out of the box. Override ADMIN_PASSWORD in Vercel for prod.
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@anisekai.com').toLowerCase()
  const adminUsername = process.env.ADMIN_USERNAME ?? 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'A99nime'

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { name: 'Super Admin' },
  })
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, roleId: superAdminRole.id },
    create: {
      email: adminEmail,
      username: adminUsername,
      passwordHash,
      emailVerified: new Date(),
      roleId: superAdminRole.id,
      profile: { create: {} },
    },
  })

  console.log(
    `Seed complete: roles, TCG games, news categories, Super Admin (${adminEmail}).`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
