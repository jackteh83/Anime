import type { MetadataRoute } from 'next'
import { getSettings } from '@/lib/settings'
import { siteBaseUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const SECTION_PATHS = [
  '',
  '/leaks',
  '/episodes',
  '/tcg',
  '/trends',
  '/news',
  '/community',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const general = await getSettings('general')
  const base = siteBaseUrl(general.siteUrl)
  const now = new Date()

  return SECTION_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'hourly' : 'daily',
    priority: path === '' ? 1 : 0.8,
  }))
}
