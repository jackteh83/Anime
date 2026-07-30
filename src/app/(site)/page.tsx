import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  Check,
  Flame,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Pill, StatChange, Thumb, Widget } from '@/components/ui'
import * as data from '@/lib/homepage-data'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      {/* Row 1 — Hero / Previews / Profile */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Hero className="lg:col-span-5" />
        <HeroPreviews className="lg:col-span-4" />
        <ProfileCard className="lg:col-span-3" />
      </div>

      {/* Row 2 — Trend rail widgets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TodaysTrend />
        <TopHotCards />
        <NewCardReveals />
      </div>

      {/* Row 3 — Leak Timeline */}
      <LeakTimeline />

      {/* Row 4 — Episode Hub / TCG Hub */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EpisodeHub />
        <TcgHub />
      </div>

      {/* Row 5 — Market Watch / Top Meta */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MarketWatch />
        <TopMeta />
      </div>

      {/* Row 6 — Community / Leaker Accuracy / Discord */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CommunityPredictions />
        <LeakerAccuracy />
        <DiscordCta />
      </div>

      {/* Row 7 — Latest News */}
      <LatestNews />
    </div>
  )
}

/* ------------------------------- widgets -------------------------------- */

function Hero({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/leaks"
      className={`group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-card border border-line bg-gradient-to-br from-primary/30 via-surface to-bg p-6 ${className}`}
    >
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/25 to-transparent" />
      <div className="relative">
        <Pill tone="primary" className="mb-3">
          <Zap className="mr-1 h-3 w-3" /> Breaking Leak
        </Pill>
        <h1 className="text-3xl font-extrabold leading-tight text-text">
          One Piece Chapter 1156
          <span className="block text-primary">Leaks Confirmed</span>
        </h1>
        <div className="mt-4 max-w-sm">
          <p className="mb-1 text-sm font-semibold text-text">65% Released</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-[65%] rounded-full bg-primary" />
          </div>
        </div>
        <p className="mt-3 text-xs text-faint">Updated 8 mins ago</p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors group-hover:bg-primary-hover">
          View Leaks <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function HeroPreviews({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {data.heroPreviews.map((p) => (
        <Link
          key={p.title}
          href="/episodes"
          className="group flex items-center gap-3 rounded-card border border-line bg-surface p-3 transition-colors hover:border-line-strong"
        >
          <Thumb tone={p.tone} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-text">{p.title}</p>
            <p className="truncate text-sm text-muted">{p.sub}</p>
            <Pill tone={p.tone} className="mt-1">
              {p.badge}
            </Pill>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Play className="h-3.5 w-3.5" />
          </span>
        </Link>
      ))}
    </div>
  )
}

function ProfileCard({ className = '' }: { className?: string }) {
  return (
    <Widget
      title="My Profile"
      className={className}
      action={
        <Link
          href="/login"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View Profile
        </Link>
      }
    >
      <div className="flex items-center gap-3">
        <Thumb tone="primary" size="md" className="rounded-full" />
        <div>
          <p className="font-bold text-text">AniFan</p>
          <Pill tone="primary" className="mt-1">
            Level 28
          </Pill>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>XP 2,450 / 3,500</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-primary to-orange" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ['1,245', 'Followers'],
          ['345', 'Badges'],
          ['12', 'Posts'],
        ].map(([n, l]) => (
          <div key={l} className="rounded-lg bg-surface-2 py-2">
            <p className="text-sm font-bold text-text">{n}</p>
            <p className="text-[10px] uppercase tracking-wide text-faint">{l}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-surface-2 p-2 text-xs text-muted">
        <Sparkles className="h-4 w-4 text-orange" />
        Your pet <span className="font-semibold text-text">Kitsu</span> is waiting!
      </div>
    </Widget>
  )
}

function TodaysTrend() {
  return (
    <Widget
      title="Today's Trend"
      icon={<Flame className="h-4 w-4 text-primary" />}
      viewAllHref="/trends"
    >
      <ul className="space-y-3">
        {data.todaysTrend.map((t) => (
          <li key={t.rank} className="flex items-center gap-3">
            <span className="w-5 text-sm font-extrabold text-primary">
              {String(t.rank).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">
                {t.title}
              </p>
              <Pill tone={t.tone} className="mt-0.5">
                {t.tag}
              </Pill>
            </div>
            <span className="heat-text flex items-center gap-1 text-xs">
              <Flame className="h-3 w-3" />
              {t.heat}
            </span>
          </li>
        ))}
      </ul>
    </Widget>
  )
}

function TopHotCards() {
  return (
    <Widget
      title="Top Hot Cards"
      icon={<Flame className="h-4 w-4 text-primary" />}
      viewAllHref="/tcg"
    >
      <ul className="space-y-3">
        {data.topHotCards.map((c) => (
          <li key={c.name} className="flex items-center gap-3">
            <Thumb tone={c.tone} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">
                {c.name}
              </p>
              <p className="text-xs text-faint">{c.rank}</p>
            </div>
            <StatChange value={c.change} />
          </li>
        ))}
      </ul>
    </Widget>
  )
}

function NewCardReveals() {
  return (
    <Widget
      title="New Card Reveals"
      viewAllHref="/tcg/reveals"
      viewAllLabel="See all"
    >
      <div className="flex gap-4">
        <Thumb tone="primary" size="lg" label="Sample" className="h-40 w-28" />
        <div>
          <p className="font-bold text-text">Monkey D. Luffy</p>
          <p className="text-sm text-muted">New Leader Card</p>
          <p className="text-xs text-faint">OP-12</p>
          <Pill tone="purple" className="mt-2">
            Leader
          </Pill>
          <p className="mt-3 text-xs text-muted">
            Don&apos;t miss the latest card reveals and translations.
          </p>
        </div>
      </div>
    </Widget>
  )
}

function LeakTimeline() {
  const statusStyles: Record<string, string> = {
    completed: 'border-green/40 text-green',
    'in-progress': 'border-primary text-primary',
    next: 'border-line text-muted',
    upcoming: 'border-line text-faint',
  }
  const statusLabels: Record<string, string> = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    next: 'Up Next',
    upcoming: 'Upcoming',
  }
  return (
    <Widget
      title={
        <span>
          Leak Timeline{' '}
          <span className="font-normal text-muted">— One Piece Chapter 1156</span>
        </span>
      }
      viewAllHref="/leaks/timeline"
      viewAllLabel="View Full Timeline"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {data.leakTimeline.map((s) => (
          <div
            key={s.day}
            className={`rounded-lg border bg-surface-2 p-3 ${statusStyles[s.status]}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-faint">
              {s.day}
            </p>
            <p className="mt-1 font-semibold text-text">{s.label}</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold uppercase">
              {s.status === 'completed' && <Check className="h-3 w-3" />}
              {statusLabels[s.status]}
            </p>
          </div>
        ))}
      </div>
    </Widget>
  )
}

function EpisodeHub() {
  return (
    <Widget title="Episode Hub" viewAllHref="/episodes" viewAllLabel="View All Episodes">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-lg bg-gradient-to-br from-purple/40 via-surface-2 to-surface p-4">
          <Pill tone="purple" className="absolute left-3 top-3">
            Solo Leveling
          </Pill>
          <p className="text-lg font-extrabold text-text">Episode 14</p>
          <p className="text-xs text-muted">Countdown to Release</p>
          <p className="mt-2 font-mono text-lg font-bold text-text">
            21 : 06 : 32 : 15
          </p>
          <div className="mt-3 flex gap-2">
            <span className="rounded bg-primary px-3 py-1 text-xs font-bold text-on-primary">
              Preview
            </span>
            <span className="rounded border border-line px-3 py-1 text-xs font-bold text-text">
              Leaks
            </span>
          </div>
        </div>
        <ul className="space-y-2">
          {data.episodeHubList.map((e) => (
            <li
              key={e.title}
              className="flex items-center gap-3 rounded-lg bg-surface-2 p-2"
            >
              <Thumb tone={e.tone} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text">
                  {e.title}
                </p>
                <p className="truncate text-xs text-muted">{e.sub}</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-faint">
                {e.left}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Widget>
  )
}

function TcgHub() {
  return (
    <Widget title="TCG Hub" viewAllHref="/tcg" viewAllLabel="View All">
      <div className="mb-3 flex gap-4 border-b border-line pb-2 text-xs font-semibold">
        <span className="border-b-2 border-primary pb-2 text-primary">
          New Releases
        </span>
        <span className="text-muted">Card Reveals</span>
        <span className="text-muted">Tournaments</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.tcgReleases.slice(0, 3).map((r) => (
          <div key={r.title} className="text-center">
            <Thumb
              tone={r.tone}
              label={r.title}
              className="mx-auto mb-2 h-28 w-full"
            />
            <p className="text-sm font-bold text-text">{r.title}</p>
            <p className="truncate text-xs text-muted">{r.sub}</p>
            <p className="text-[11px] text-faint">{r.date}</p>
          </div>
        ))}
      </div>
    </Widget>
  )
}

function MarketWatch() {
  return (
    <Widget title="TCG Market Watch" viewAllHref="/tcg/market" viewAllLabel="View Market">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-faint">
            <th className="pb-2 font-semibold">Set</th>
            <th className="pb-2 text-right font-semibold">Avg Price</th>
            <th className="pb-2 text-right font-semibold">Change</th>
          </tr>
        </thead>
        <tbody>
          {data.marketWatch.map((m) => (
            <tr key={m.set} className="border-t border-line">
              <td className="py-2.5">
                <div className="flex items-center gap-2">
                  <Thumb tone="primary" size="sm" className="h-9 w-9" />
                  <div>
                    <p className="font-semibold text-text">{m.set}</p>
                    <p className="text-xs text-faint">{m.sub}</p>
                  </div>
                </div>
              </td>
              <td className="py-2.5 text-right font-semibold text-text">
                {m.price}
              </td>
              <td className="py-2.5 text-right">
                <StatChange value={m.change} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  )
}

function TopMeta() {
  return (
    <Widget
      title={
        <span>
          Top Meta <span className="font-normal text-muted">— One Piece TCG</span>
        </span>
      }
      viewAllHref="/tcg/decks"
      viewAllLabel="View Meta"
    >
      <ul className="space-y-3">
        {data.topMeta.map((d) => (
          <li
            key={d.rank}
            className="flex items-center gap-3 overflow-hidden rounded-lg bg-surface-2 p-3"
          >
            <span className="text-lg font-extrabold text-primary">
              {String(d.rank).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-text">{d.name}</p>
              <p className="text-xs text-muted">Win Rate {d.winRate}%</p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${d.winRate}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Widget>
  )
}

function CommunityPredictions() {
  return (
    <Widget title="Community Predictions" viewAllHref="/community/polls">
      <ul className="space-y-3">
        {data.communityPredictions.map((p) => (
          <li key={p.q} className="flex items-center gap-3">
            <Thumb tone="purple" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">{p.q}</p>
              <p className="text-xs text-faint">{p.votes}</p>
            </div>
            <span className="shrink-0 rounded bg-primary px-3 py-1 text-xs font-bold text-on-primary">
              Vote
            </span>
          </li>
        ))}
      </ul>
    </Widget>
  )
}

function LeakerAccuracy() {
  return (
    <Widget title="Leaker Accuracy" viewAllHref="/leaks">
      <ul className="space-y-3">
        {data.leakerAccuracy.map((l) => (
          <li key={l.name} className="flex items-center gap-3">
            <Thumb tone="primary" size="sm" className="rounded-full" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">{l.name}</p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${l.pct}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-text">{l.pct}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-faint">Based on last 100 leaks</p>
    </Widget>
  )
}

function DiscordCta() {
  return (
    <Widget className="flex flex-col justify-center bg-gradient-to-br from-purple/20 to-surface">
      <h2 className="text-lg font-extrabold text-text">
        Join our Discord Community!
      </h2>
      <p className="mt-2 text-sm text-muted">
        Get the latest leaks, TCG updates, and episode discussions.
      </p>
      <Link
        href="/community"
        className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-purple px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        Join Discord
      </Link>
    </Widget>
  )
}

function LatestNews() {
  return (
    <Widget
      title="Latest News"
      icon={<TrendingUp className="h-4 w-4 text-primary" />}
      viewAllHref="/news"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.latestNews.map((n) => (
          <Link
            key={n.title}
            href="/news"
            className="group overflow-hidden rounded-lg border border-line bg-surface-2 transition-colors hover:border-line-strong"
          >
            <Thumb tone={n.tone} className="h-28 w-full rounded-none" />
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
  )
}
