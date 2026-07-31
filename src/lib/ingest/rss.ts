import 'server-only'
import { XMLParser } from 'fast-xml-parser'

export type FeedItem = {
  title: string
  link: string
  summary: string
  publishedAt: Date | null
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
})

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

function text(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && '#text' in (v as object)) {
    return String((v as { '#text': unknown })['#text'] ?? '')
  }
  return String(v)
}

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toDate(s: string): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

/** Parse an RSS 2.0 or Atom feed body into normalized items. */
export function parseFeed(xml: string): FeedItem[] {
  const obj = parser.parse(xml)

  // RSS 2.0
  const rssItems = asArray(obj?.rss?.channel?.item)
  if (rssItems.length) {
    return rssItems
      .map((it: Record<string, unknown>) => ({
        title: stripHtml(text(it.title)),
        link: text(it.link),
        summary: stripHtml(text(it.description)).slice(0, 500),
        publishedAt: toDate(text(it.pubDate) || text(it['dc:date'])),
      }))
      .filter((i) => i.title)
  }

  // Atom
  const atomEntries = asArray(obj?.feed?.entry)
  if (atomEntries.length) {
    return atomEntries
      .map((e: Record<string, unknown>) => {
        const links = asArray(e.link as unknown)
        const href =
          (links.find((l) => (l as { '@_rel'?: string })['@_rel'] === 'alternate') ??
            links[0]) as { '@_href'?: string } | string | undefined
        const link =
          typeof href === 'string' ? href : (href?.['@_href'] ?? '')
        return {
          title: stripHtml(text(e.title)),
          link,
          summary: stripHtml(text(e.summary) || text(e.content)).slice(0, 500),
          publishedAt: toDate(text(e.updated) || text(e.published)),
        }
      })
      .filter((i) => i.title)
  }

  return []
}

/** Fetch and parse a feed URL. Throws on network / HTTP error. */
export async function fetchFeed(url: string): Promise<FeedItem[]> {
  const res = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (compatible; AnisekaiBot/1.0; +https://anisekai.app)',
      accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
    },
    // Never cache the source feed at the fetch layer.
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  return parseFeed(xml)
}
