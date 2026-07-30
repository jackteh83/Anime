import Link from 'next/link'
import type { Metadata } from 'next'
import { Flame, MessageCircle, Zap } from 'lucide-react'
import { SectionHero, SectionTabs } from '@/components/section-hero'
import { Pill, Thumb, Widget, type Tone } from '@/components/ui'
import { prisma } from '@/lib/db'
import { leakTypeMeta, type LeakTypeValue } from '@/lib/content'
import { leakTimeline, leakerAccuracy } from '@/lib/homepage-data'

export const metadata: Metadata = {
  title: 'Anime Leaks',
  description: 'The fastest anime & manga leaks, raws, and spoilers — updated daily.',
}

// Rendered per-request: pulls fresh published leaks from the database.
export const dynamic = 'force-dynamic'

const tabs = [
  { label: 'All Leaks', href: '/leaks' },
  { label: 'Manga Leaks', href: '/leaks?type=MANGA' },
  { label: 'Raws', href: '/leaks?type=RAWS' },
  { label: 'Spoilers', href: '/leaks?type=SPOILERS' },
  { label: 'Confirmed', href: '/leaks?type=CONFIRMED' },
  { label: 'Summaries', href: '/leaks?type=SUMMARY' },
]

const seedLeaks = [
  { id: '1', title: 'One Piece Chapter 1116 Leaked Full Summary', series: 'One Piece', summary: 'Full summary and key spoilers for the upcoming chapter.', type: 'MANGA' as LeakTypeValue, heat: 98700, comments: 256, when: '8 mins ago' },
  { id: '2', title: 'Jujutsu Kaisen Chapter 260 Raw Scans', series: 'Jujutsu Kaisen', summary: 'Detailed summary and major plot points leaked.', type: 'RAWS' as LeakTypeValue, heat: 56300, comments: 142, when: '23 mins ago' },
  { id: '3', title: 'Chainsaw Man Part 3 Chapter 12 Raw Scans', series: 'Chainsaw Man', summary: 'Raw scans leaked online.', type: 'RAWS' as LeakTypeValue, heat: 41800, comments: 89, when: '45 mins ago' },
  { id: '4', title: 'Kaiju No.8 Chapter 116 Early Spoilers', series: 'Kaiju No.8', summary: 'Early spoilers hint at major developments.', type: 'SPOILERS' as LeakTypeValue, heat: 38600, comments: 67, when: '1 hour ago' },
  { id: '5', title: 'My Hero Academia Chapter 430 Summary', series: 'My Hero Academia', summary: 'Brief summary of the chapter.', type: 'SUMMARY' as LeakTypeValue, heat: 28900, comments: 54, when: '1 hour ago' },
  { id: '6', title: 'Black Clover Chapter 376 Raws & Summary', series: 'Black Clover', summary: 'Raw scans and summary inside.', type: 'RAWS' as LeakTypeValue, heat: 24100, comments: 41, when: '2 hours ago' },
]

const topSeries = [
  { rank: 1, name: 'One Piece', heat: '98.7K' },
  { rank: 2, name: 'Jujutsu Kaisen', heat: '56.3K' },
  { rank: 3, name: 'Chainsaw Man', heat: '41.8K' },
  { rank: 4, name: 'Kaiju No.8', heat: '38.6K' },
  { rank: 5, name: 'My Hero Academia', heat: '28.9K' },
]

const statusStyles: Record<string, string> = {
  completed: 'border-green/40 text-green',
  'in-progress': 'border-primary text-primary',
  next: 'border-line text-muted',
  upcoming: 'border-line text-faint',
}

export default async function LeaksPage(props: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await props.searchParams

  let published: Awaited<ReturnType<typeof prisma.animeLeak.findMany>> = []
  try {
    published = await prisma.animeLeak.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        ...(type ? { type: type as LeakTypeValue } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    })
  } catch {
    published = []
  }

  const leaks =
    published.length > 0
      ? published.map((l) => ({
          id: l.id,
          title: l.title,
          series: l.series,
          summary: l.summary ?? '',
          type: l.type as LeakTypeValue,
          heat: l.heat,
          comments: l.commentCount,
          when: l.publishedAt
            ? new Date(l.publishedAt).toLocaleDateString()
            : '',
        }))
      : seedLeaks

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      <SectionHero
        title="Anime Leaks"
        subtitle="The fastest anime & manga leaks, raws, and spoilers — updated daily."
        icon={Zap}
      />
      <SectionTabs tabs={tabs} active="All Leaks" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          <Widget
            title={
              <span className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-primary" /> Latest Leaks
              </span>
            }
          >
            <ul className="divide-y divide-line">
              {leaks.map((l) => {
                const meta = leakTypeMeta[l.type]
                return (
                  <li key={l.id} className="flex items-center gap-3 py-3">
                    <Thumb tone={meta.tone} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">{l.title}</p>
                      <p className="truncate text-sm text-muted">{l.summary}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Pill tone={meta.tone}>{meta.label}</Pill>
                        <span className="text-[11px] text-faint">{l.series}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="heat-text flex items-center justify-end gap-1 text-xs">
                        <Flame className="h-3 w-3" />
                        {l.when}
                      </p>
                      <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-faint">
                        <MessageCircle className="h-3 w-3" />
                        {l.comments}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Widget>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Widget title="Leak Timeline" viewAllHref="/leaks/timeline" viewAllLabel="Full">
            <ul className="space-y-2">
              {leakTimeline.map((s) => (
                <li
                  key={s.day}
                  className={`rounded-lg border bg-surface-2 px-3 py-2 ${statusStyles[s.status]}`}
                >
                  <p className="text-[11px] font-bold uppercase text-faint">{s.day}</p>
                  <p className="text-sm font-semibold text-text">{s.label}</p>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Top Leaked Series">
            <ul className="space-y-3">
              {topSeries.map((s) => (
                <li key={s.rank} className="flex items-center gap-3">
                  <span className="w-4 text-sm font-extrabold text-primary">{s.rank}</span>
                  <span className="flex-1 text-sm font-semibold text-text">{s.name}</span>
                  <span className="heat-text flex items-center gap-1 text-xs">
                    <Flame className="h-3 w-3" />
                    {s.heat}
                  </span>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Leaker Accuracy">
            <ul className="space-y-3">
              {leakerAccuracy.map((l) => (
                <li key={l.name} className="flex items-center gap-3">
                  <span className="flex-1 text-sm font-semibold text-text">{l.name}</span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${l.pct}%` }} />
                  </div>
                  <span className="w-9 text-right text-sm font-bold text-text">{l.pct}%</span>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </div>

      <div className="rounded-card border border-line bg-surface-2/50 p-4 text-xs text-muted">
        <b className="text-text">Leak Disclaimer.</b> All leaks and spoilers are
        provided for informational and entertainment purposes only. We do not
        host or claim ownership of any leaked content. Please support the
        official release when available.
      </div>
    </div>
  )
}
