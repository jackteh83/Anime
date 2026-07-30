import type { Metadata } from 'next'
import { Flame, TrendingUp } from 'lucide-react'
import { SectionHero, SectionTabs } from '@/components/section-hero'
import { Pill, StatChange, Thumb, Widget } from '@/components/ui'
import {
  trendByCategory,
  trendingKeywords,
  trendingTop10,
} from '@/lib/section-data'

export const metadata: Metadata = {
  title: 'Trends',
  description: "Real-time pulse of anime & TCG. Updated every 10 minutes.",
}

const tabs = [
  { label: 'Overview', href: '/trends' },
  { label: 'Anime', href: '/trends?tab=anime' },
  { label: 'TCG', href: '/trends?tab=tcg' },
  { label: 'Episodes', href: '/trends?tab=episodes' },
  { label: 'Leaks', href: '/trends?tab=leaks' },
]

const heatColor: Record<string, string> = {
  Extreme: 'bg-primary/30 border-primary/50',
  'Very High': 'bg-primary/20 border-primary/40',
  High: 'bg-orange/20 border-orange/40',
  Medium: 'bg-green/15 border-green/30',
  Low: 'bg-surface-2 border-line',
}

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      <SectionHero
        title="Today's Trends"
        subtitle="Real-time pulse of anime & TCG. Updated every 10 minutes."
        icon={TrendingUp}
      />
      <SectionTabs tabs={tabs} active="Overview" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Top 10 ranking */}
        <Widget
          title="Top 10 Trending Right Now"
          className="lg:col-span-2"
          viewAllHref="/trends"
          viewAllLabel="View Full Ranking"
        >
          <ul className="divide-y divide-line">
            {trendingTop10.map((t) => (
              <li key={t.rank} className="flex items-center gap-3 py-2.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${
                    t.rank <= 3 ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted'
                  }`}
                >
                  {t.rank}
                </span>
                <Thumb tone={t.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text">{t.title}</p>
                  <Pill tone={t.tone} className="mt-0.5">{t.cat}</Pill>
                </div>
                <div className="shrink-0 text-right">
                  <p className="heat-text flex items-center justify-end gap-1 text-sm">
                    <Flame className="h-3 w-3" />
                    {t.score}
                  </p>
                  <p className="text-[11px] text-faint">{t.level}</p>
                </div>
              </li>
            ))}
          </ul>
        </Widget>

        {/* Right rail: heatmap + keywords */}
        <div className="space-y-4">
          <Widget title="Trending Heatmap">
            <div className="grid grid-cols-2 gap-2">
              {trendingTop10.slice(0, 6).map((t) => (
                <div
                  key={t.rank}
                  className={`rounded-lg border p-3 ${heatColor[t.level] ?? 'bg-surface-2 border-line'}`}
                >
                  <p className="truncate text-xs font-bold text-text">{t.title.split(' ').slice(0, 2).join(' ')}</p>
                  <p className="text-sm font-extrabold text-text">{t.score}</p>
                  <p className="text-[10px] uppercase text-faint">{t.level}</p>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Trending Keywords">
            <div className="flex flex-wrap gap-2">
              {trendingKeywords.map((k, i) => (
                <span
                  key={k}
                  className="rounded-full bg-surface-2 px-3 py-1 font-semibold text-muted"
                  style={{ fontSize: `${0.75 + (trendingKeywords.length - i) * 0.03}rem` }}
                >
                  {k}
                </span>
              ))}
            </div>
          </Widget>
        </div>
      </div>

      {/* By category */}
      <Widget title="Trending by Category" viewAllHref="/trends">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {trendByCategory.map((c) => (
            <div key={c.label} className="rounded-lg border border-line bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint">{c.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-text">{c.value}</p>
              <p className="text-[11px] text-muted">Total Mentions</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-bold text-up">
                <TrendingUp className="h-3 w-3" />
                <StatChange value={c.change} /> vs yesterday
              </p>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  )
}
