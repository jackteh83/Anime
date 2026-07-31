import 'server-only'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'
import { fetchFeed } from './rss'
import { fetchPokemonCards } from './tcg'

export type IngestResult = {
  source: string
  inserted: number
  error?: string
}

const MAX_ITEMS_PER_SOURCE = 15

/**
 * Ingest all enabled RSS sources into the News table. Real, source-attributed
 * content — no AI fabrication. Deduplicates by deterministic slug so re-running
 * never creates duplicates. Each source is isolated: one failing feed does not
 * stop the others.
 */
export async function ingestAllRss(): Promise<IngestResult[]> {
  const sources = await prisma.rssSource.findMany({
    where: { enabled: true, type: 'RSS' },
  })

  const results: IngestResult[] = []

  for (const source of sources) {
    try {
      const items = (await fetchFeed(source.url)).slice(0, MAX_ITEMS_PER_SOURCE)
      let inserted = 0

      for (const item of items) {
        const slug = slugify(item.title)
        if (!slug) continue
        const exists = await prisma.news.findUnique({
          where: { slug },
          select: { id: true },
        })
        if (exists) continue

        const body = source.url
          ? `${item.summary}\n\nSource: ${item.link || source.name}`
          : item.summary

        await prisma.news.create({
          data: {
            title: item.title,
            slug,
            excerpt: item.summary || null,
            body,
            status: 'PUBLISHED',
            publishedAt: item.publishedAt ?? new Date(),
          },
        })
        inserted++
      }

      await prisma.rssSource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date() },
      })
      results.push({ source: source.name, inserted })
    } catch (err) {
      results.push({
        source: source.name,
        inserted: 0,
        error: err instanceof Error ? err.message : 'fetch failed',
      })
    }
  }

  return results
}

/**
 * Ingest real Pokémon TCG cards + market prices into the Card table under the
 * seeded "Pokémon" game. Upserts by (gameId, code) so re-running refreshes
 * prices in place and computes priceChange from the previous stored price.
 */
export async function ingestPokemonCards(): Promise<IngestResult> {
  const label = 'Pokémon TCG'
  try {
    const game = await prisma.tcgGame.findUnique({ where: { slug: 'pokemon' } })
    if (!game) return { source: label, inserted: 0, error: 'game not seeded' }

    const cards = await fetchPokemonCards(50)
    let processed = 0

    for (const c of cards) {
      const existing = await prisma.card.findUnique({
        where: { gameId_code: { gameId: game.id, code: c.code } },
        select: { marketPrice: true },
      })

      let priceChange = 0
      if (existing?.marketPrice != null && c.marketPrice != null) {
        const prev = Number(existing.marketPrice)
        if (prev > 0) {
          priceChange = Number((((c.marketPrice - prev) / prev) * 100).toFixed(2))
        }
      }

      await prisma.card.upsert({
        where: { gameId_code: { gameId: game.id, code: c.code } },
        update: {
          name: c.name,
          rarity: c.rarity,
          setName: c.setName,
          imageUrl: c.imageUrl,
          marketPrice: c.marketPrice,
          priceChange,
          releaseDate: c.releaseDate,
        },
        create: {
          gameId: game.id,
          code: c.code,
          name: c.name,
          rarity: c.rarity,
          setName: c.setName,
          imageUrl: c.imageUrl,
          marketPrice: c.marketPrice,
          priceChange,
          releaseDate: c.releaseDate,
        },
      })
      processed++
    }

    return { source: label, inserted: processed }
  } catch (err) {
    return {
      source: label,
      inserted: 0,
      error: err instanceof Error ? err.message : 'fetch failed',
    }
  }
}
