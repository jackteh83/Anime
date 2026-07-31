import Link from 'next/link'
import type { Metadata } from 'next'
import { Newspaper } from 'lucide-react'
import { SectionHero, SectionTabs } from '@/components/section-hero'
import { Pill, Thumb, Widget } from '@/components/ui'
import { breakingNews, newsCategories } from '@/lib/section-data'
import { latestNews as seedNews } from '@/lib/homepage-data'
import { getLatestNews } from '@/lib/news-data'

export const metadata: Metadata = {
  title: 'News',
  description: 'Your daily source for official anime, manga, and industry news.',
}

// Rendered per-request: pulls fresh published news from the database.
export const dynamic = 'force-dynamic'

const tabs = [
  { label: 'Latest', href: '/news' },
  { label: 'Anime', href: '/news?cat=anime' },
  { label: 'Manga', href: '/news?cat=manga' },
  { label: 'Industry', href: '/news?cat=industry' },
  { label: 'Movies', href: '/news?cat=movies' },
  { label: 'TCG', href: '/news?cat=tcg' },
  { label: 'Events', href: '/news?cat=events' },
]

export default async function NewsPage() {
  const published = await getLatestNews(12)

  const items =
    published.length > 0
      ? published
      : seedNews.map((n) => ({ ...n, excerpt: '', slug: '' }))

  const [featured, ...rest] = items

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      <SectionHero
        title="News"
        subtitle="Your daily source for official anime, manga, and industry news."
        icon={Newspaper}
      />
      <SectionTabs tabs={tabs} active="Latest" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Featured */}
          {featured && (
            <Link
              href={featured.slug ? `/news/${featured.slug}` : '/news'}
              className="group block overflow-hidden rounded-card border border-line bg-surface"
            >
              <Thumb tone={featured.tone} className="h-56 w-full rounded-none" />
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Pill tone="primary">Featured</Pill>
                  <Pill tone={featured.tone}>{featured.cat}</Pill>
                  <span className="text-[11px] text-faint">{featured.ago}</span>
                </div>
                <h2 className="text-xl font-extrabold text-text group-hover:text-primary">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-2 text-sm text-muted">{featured.excerpt}</p>
                )}
              </div>
            </Link>
          )}

          <Widget title="Latest News">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rest.map((n) => (
                <Link
                  key={n.title}
                  href={n.slug ? `/news/${n.slug}` : '/news'}
                  className="group overflow-hidden rounded-lg border border-line bg-surface-2 transition-colors hover:border-line-strong"
                >
                  <Thumb tone={n.tone} className="h-32 w-full rounded-none" />
                  <div className="p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <Pill tone={n.tone}>{n.cat}</Pill>
                      <span className="text-[11px] text-faint">{n.ago}</span>
                    </div>
                    <p className="text-sm font-semibold leading-snug text-text group-hover:text-primary">
                      {n.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Widget>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Widget title="Breaking News" viewAllHref="/news">
            <ul className="space-y-3">
              {breakingNews.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <span className="shrink-0 text-xs font-bold text-primary">{b.time}</span>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-text">{b.title}</p>
                    <Pill tone={b.tone} className="mt-1">{b.tag}</Pill>
                  </div>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="News by Category">
            <ul className="space-y-1">
              {newsCategories.map((c) => (
                <li key={c.name}>
                  <Link
                    href="/news"
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-xs text-faint">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </div>
    </div>
  )
}
