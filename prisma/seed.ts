import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

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

  console.log('Seed complete: roles, TCG games, news categories.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
