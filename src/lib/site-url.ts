/** Resolve the site's public base URL for sitemap/robots/canonical use. */
export function siteBaseUrl(configuredUrl?: string): string {
  const candidates = [
    configuredUrl,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  ]
  const found = candidates.find((u) => u && !u.includes('localhost'))
  return (found ?? 'http://localhost:3000').replace(/\/$/, '')
}
