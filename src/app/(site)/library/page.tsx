import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import {
  BookOpen,
  Clock,
  Heart,
  Layers,
  Library as LibraryIcon,
  Play,
  Star,
} from 'lucide-react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Pill, Thumb, Widget, type Tone } from '@/components/ui'

export const metadata: Metadata = { title: 'My Library' }
export const dynamic = 'force-dynamic'

// Static classes so Tailwind's scanner picks them up (no dynamic `text-${tone}`).
const toneText: Record<Tone, string> = {
  primary: 'text-primary',
  purple: 'text-purple',
  blue: 'text-blue',
  green: 'text-green',
  orange: 'text-orange',
  pink: 'text-pink',
  cyan: 'text-cyan',
  yellow: 'text-yellow',
  muted: 'text-muted',
}

const stats = [
  { label: 'Anime Watched', value: 124, icon: Play, tone: 'primary' as Tone },
  { label: 'Manga Read', value: 86, icon: BookOpen, tone: 'blue' as Tone },
  { label: 'TCG Cards', value: '1,247', icon: Layers, tone: 'orange' as Tone },
  { label: 'Favorites', value: 97, icon: Heart, tone: 'pink' as Tone },
  { label: 'Hours Watched', value: '2,368', icon: Clock, tone: 'green' as Tone },
]

const continueWatching = [
  { title: 'Jujutsu Kaisen S2', sub: 'Episode 18', pct: 72, tone: 'purple' as Tone },
  { title: 'Demon Slayer', sub: 'Hashira Training Arc', pct: 45, tone: 'primary' as Tone },
  { title: 'One Piece', sub: 'Egghead Island Arc', pct: 32, tone: 'orange' as Tone },
  { title: 'Mushoku Tensei', sub: 'Season 2', pct: 18, tone: 'green' as Tone },
]

const sections = [
  { title: 'Watchlist', count: '42 items', sub: 'Anime you plan to watch', tone: 'purple' as Tone },
  { title: 'Reading List', count: '31 items', sub: "Manga you're following", tone: 'blue' as Tone },
  { title: 'Anime Collection', count: '124 items', sub: 'Completed anime', tone: 'green' as Tone },
  { title: 'Manga Collection', count: '86 items', sub: 'Completed manga', tone: 'orange' as Tone },
  { title: 'TCG Collection', count: '1,247 cards', sub: 'Your cards and decks', tone: 'yellow' as Tone },
  { title: 'Favorites', count: '97 items', sub: 'Your favorite moments', tone: 'pink' as Tone },
]

const reminders = [
  { date: 'MAY 24', title: 'One Piece Episode 1117', when: 'Release in 2 days · 10:00 AM' },
  { date: 'MAY 25', title: 'Jujutsu Kaisen S2 Ep 19', when: 'Release in 3 days · 11:00 PM' },
  { date: 'MAY 26', title: 'Chainsaw Man Ep 7', when: 'Release in 4 days · 12:00 AM' },
  { date: 'MAY 30', title: 'Bleach TYBW Part 4 Ep 3', when: 'Release in 8 days · 11:30 PM' },
]

const activity = [
  { text: 'Watched Episode 6 — Demon Slayer', when: '2 hours ago' },
  { text: 'Added 12 new cards — One Piece TCG', when: '5 hours ago' },
  { text: 'Completed Chapter 1021 — One Piece', when: 'Yesterday' },
  { text: 'Added to Watchlist — Kaiju No.8 S2', when: '2 days ago' },
]

export default async function LibraryPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const profile = await prisma.userProfile
    .findUnique({ where: { userId: session.userId } })
    .catch(() => null)

  const level = profile?.level ?? 1
  const exp = profile?.exp ?? 0
  const nextLevel = level * 500 + 1000

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      {/* Header card */}
      <div className="flex flex-col justify-between gap-4 rounded-card border border-line bg-gradient-to-br from-purple/20 via-surface to-bg p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-on-primary">
            {session.username.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-text">
              {session.username}
              <Pill tone="primary">Level {level}</Pill>
            </h1>
            <p className="text-sm text-muted">
              All your anime, manga, TCG cards, and more in one place.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>XP {exp.toLocaleString()} / {nextLevel.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-orange"
              style={{ width: `${Math.min(100, (exp / nextLevel) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-card border border-line bg-surface p-4">
              <Icon className={`h-5 w-5 ${toneText[s.tone]}`} />
              <p className="mt-2 text-2xl font-extrabold text-text">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wide text-faint">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          <Widget title="Continue Watching" icon={<Play className="h-4 w-4 text-primary" />}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {continueWatching.map((c) => (
                <div key={c.title}>
                  <div className="relative overflow-hidden rounded-lg">
                    <Thumb tone={c.tone} className="h-28 w-full rounded-none" />
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-surface-2">
                      <div className="h-full bg-primary" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-text">{c.title}</p>
                  <p className="truncate text-xs text-muted">{c.sub}</p>
                  <p className="text-[11px] text-primary">{c.pct}%</p>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Your Library Sections">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((s) => (
                <div key={s.title} className="rounded-lg border border-line bg-surface-2 p-4">
                  <div className="flex items-center gap-2">
                    <LibraryIcon className={`h-4 w-4 ${toneText[s.tone]}`} />
                    <p className="font-bold text-text">{s.title}</p>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-text">{s.count}</p>
                  <p className="text-xs text-muted">{s.sub}</p>
                </div>
              ))}
            </div>
          </Widget>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Widget title="Upcoming Reminders">
            <ul className="space-y-3">
              {reminders.map((r) => (
                <li key={r.title} className="flex gap-3">
                  <div className="shrink-0 rounded-lg bg-primary-soft px-2 py-1 text-center">
                    <p className="text-[11px] font-bold text-primary">{r.date}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{r.title}</p>
                    <p className="truncate text-xs text-muted">{r.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Recent Activity">
            <ul className="space-y-3">
              {activity.map((a) => (
                <li key={a.text} className="flex items-start gap-2">
                  <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow" />
                  <div>
                    <p className="text-sm text-text">{a.text}</p>
                    <p className="text-[11px] text-faint">{a.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Widget>
        </div>
      </div>
    </div>
  )
}
