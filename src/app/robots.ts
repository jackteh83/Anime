import type { MetadataRoute } from 'next'
import { getSettings } from '@/lib/settings'
import { siteBaseUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [seo, general] = await Promise.all([
    getSettings('seo'),
    getSettings('general'),
  ])
  const base = siteBaseUrl(general.siteUrl)

  return {
    rules: seo.robotsAllow
      ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${base}/sitemap.xml`,
  }
}
