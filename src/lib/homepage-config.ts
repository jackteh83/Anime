import 'server-only'
import { prisma } from '@/lib/db'

/**
 * Homepage sections (rows) the Homepage Builder can show/hide and reorder.
 * The approved design is the default order; the builder never deletes a
 * section, it only toggles visibility and order (see docs/05 homepage lock).
 */
export const HOMEPAGE_SECTIONS = [
  { key: 'hero', label: 'Hero · Previews · Profile' },
  { key: 'trends', label: "Today's Trend · Hot Cards · Card Reveals" },
  { key: 'leakTimeline', label: 'Leak Timeline' },
  { key: 'episodesTcg', label: 'Episode Hub · TCG Hub' },
  { key: 'marketMeta', label: 'Market Watch · Top Meta' },
  { key: 'community', label: 'Community · Leaker Accuracy · Discord' },
  { key: 'latestNews', label: 'Latest News' },
] as const

export type HomepageSectionKey = (typeof HOMEPAGE_SECTIONS)[number]['key']

export type HomepageSection = { key: HomepageSectionKey; visible: boolean }

export const DEFAULT_HOMEPAGE: HomepageSection[] = HOMEPAGE_SECTIONS.map((s) => ({
  key: s.key,
  visible: true,
}))

const SECTION_KEYS = new Set(HOMEPAGE_SECTIONS.map((s) => s.key))

/**
 * Read the homepage layout from settings, reconciled against the known section
 * list: keeps the saved order/visibility, drops unknown keys, and appends any
 * new sections that were added to the code since the config was saved.
 */
export async function getHomepageConfig(): Promise<HomepageSection[]> {
  let saved: HomepageSection[] = []
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'homepage' } })
    const value = row?.value as { sections?: HomepageSection[] } | null
    if (value?.sections && Array.isArray(value.sections)) saved = value.sections
  } catch {
    return DEFAULT_HOMEPAGE
  }

  const seen = new Set<string>()
  const ordered: HomepageSection[] = []
  for (const s of saved) {
    if (SECTION_KEYS.has(s.key as HomepageSectionKey) && !seen.has(s.key)) {
      ordered.push({ key: s.key as HomepageSectionKey, visible: s.visible !== false })
      seen.add(s.key)
    }
  }
  for (const s of DEFAULT_HOMEPAGE) {
    if (!seen.has(s.key)) ordered.push(s)
  }
  return ordered
}
