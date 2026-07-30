import type { Metadata } from 'next'
import { Play, Star, Tv } from 'lucide-react'
import { SectionHero, SectionTabs } from '@/components/section-hero'
import { Pill, Thumb, Widget } from '@/components/ui'
import {
  currentlyAiring,
  recentlyAired,
  topRatedWeek,
  upcomingEpisodes,
} from '@/lib/section-data'

export const metadata: Metadata = {
  title: 'Episodes',
  description: 'Track, countdown, and discuss the latest episode releases.',
}

const tabs = [
  { label: 'Overview', href: '/episodes' },
  { label: 'Upcoming', href: '/episodes?tab=upcoming' },
  { label: 'Currently Airing', href: '/episodes?tab=airing' },
  { label: 'Recently Aired', href: '/episodes?tab=recent' },
  { label: 'Schedule', href: '/episodes/schedule' },
]

export default function EpisodesPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      <SectionHero
        title="Episodes"
        subtitle="Track, countdown, and discuss the latest episode releases."
        icon={Tv}
        stats={[
          { value: '1,248', label: 'Episodes This Season' },
          { value: '47', label: 'Airing Today' },
          { value: '12.6M', label: 'Total Views Today' },
        ]}
      />
      <SectionTabs tabs={tabs} active="Overview" />

      {/* Upcoming */}
      <Widget title="Upcoming Episodes" viewAllHref="/episodes/schedule" viewAllLabel="View Full Schedule">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingEpisodes.map((e) => (
            <div key={e.title} className="overflow-hidden rounded-lg border border-line bg-surface-2">
              <div className="relative">
                <Thumb tone={e.tone} className="h-32 w-full rounded-none" />
                <Pill tone={e.tone} className="absolute left-2 top-2">{e.tag}</Pill>
              </div>
              <div className="p-3">
                <p className="font-bold text-text">{e.title}</p>
                <p className="truncate text-xs text-muted">{e.sub}</p>
                <p className="mt-2 text-xs font-semibold text-text">{e.when}</p>
                <Pill tone="muted" className="mt-1">{e.platform}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Widget>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Currently airing */}
        <Widget title="Currently Airing" className="lg:col-span-2" viewAllHref="/episodes?tab=airing">
          <ul className="divide-y divide-line">
            {currentlyAiring.map((c) => (
              <li key={c.title} className="flex items-center gap-3 py-3">
                <Thumb tone={c.tone} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text">{c.title}</p>
                  <p className="truncate text-xs text-muted">{c.sub}</p>
                  <p className="text-[11px] text-faint">{c.next}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="flex items-center gap-1 text-sm font-bold text-yellow">
                    <Star className="h-3.5 w-3.5 fill-yellow" />
                    {c.rating}
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                    <Play className="h-3 w-3" /> Watch
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Widget>

        {/* Top rated */}
        <Widget title="Top Rated This Week" viewAllHref="/episodes">
          <ul className="space-y-3">
            {topRatedWeek.map((t) => (
              <li key={t.rank} className="flex items-center gap-3">
                <span className="w-4 text-sm font-extrabold text-primary">{t.rank}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text">{t.title}</span>
                <span className="flex items-center gap-1 text-sm font-bold text-yellow">
                  <Star className="h-3.5 w-3.5 fill-yellow" />
                  {t.rating}
                </span>
              </li>
            ))}
          </ul>
        </Widget>
      </div>

      {/* Recently aired */}
      <Widget title="Recently Aired Episodes" viewAllHref="/episodes?tab=recent">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {recentlyAired.map((r) => (
            <div key={r.title} className="overflow-hidden rounded-lg border border-line bg-surface-2">
              <div className="relative">
                <Thumb tone={r.tone} className="h-28 w-full rounded-none" />
                <Pill tone="green" className="absolute left-2 top-2">NEW</Pill>
              </div>
              <div className="p-2">
                <p className="truncate text-sm font-semibold text-text">{r.title}</p>
                <p className="truncate text-xs text-muted">{r.sub}</p>
                <span className="mt-1 flex items-center gap-1 text-xs font-bold text-yellow">
                  <Star className="h-3 w-3 fill-yellow" />
                  {r.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  )
}
