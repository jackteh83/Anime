import 'server-only'
import { prisma } from '@/lib/db'
import type { Tone } from '@/components/ui'

/**
 * Single source of truth for published News. Both the homepage "Latest News"
 * widget (top few) and the /news section page (full list) read from here, so
 * the dashboard preview is always the first N rows of the real subpage data —
 * never a separate, mismatched dataset.
 */
export type NewsCardItem = {
  title: string
  slug: string
  excerpt: string
  cat: string
  tone: Tone
  ago: string
}

// Category name → accent tone. Falls back to primary for anything unmapped.
const CATEGORY_TONE: Record<string, Tone> = {
  Anime: 'primary',
  Manga: 'purple',
  Industry: 'blue',
  Movies: 'orange',
  Games: 'cyan',
  Figures: 'pink',
  TCG: 'green',
  Events: 'yellow',
  Interviews: 'blue',
}

export function newsAgo(d: Date | null): string {
  if (!d) return ''
  const mins = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  return hrs < 24 ? `${hrs}h ago` : `${Math.round(hrs / 24)}d ago`
}

/**
 * Fetch the most recent published news as display-ready cards. Returns an empty
 * array (never throws) if the database is unreachable, so callers can fall back
 * to placeholder copy at build time or during an outage.
 */
export async function getLatestNews(take = 12): Promise<NewsCardItem[]> {
  try {
    const rows = await prisma.news.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
      take,
    })
    return rows.map((n) => ({
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt ?? '',
      cat: n.category?.name ?? 'News',
      tone: CATEGORY_TONE[n.category?.name ?? ''] ?? 'primary',
      ago: newsAgo(n.publishedAt),
    }))
  } catch {
    return []
  }
}
