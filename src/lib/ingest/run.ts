import 'server-only'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/slug'
import { fetchFeed } from './rss'

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
