import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Plus,
  Rss,
  TrendingUp,
  Users,
} from 'lucide-react'
import { AdminPageHeader, Panel, StatCard } from '@/components/admin/admin-ui'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const metadata: Metadata = { title: 'Dashboard' }

const aiTasks = [
  { label: 'Summary — JJK Ch.260', status: 'Running', tone: 'text-blue' },
  { label: 'Translate — OP TCG OP-12', status: 'Pending Review', tone: 'text-orange' },
  { label: 'SEO — Kaiju No.8 Ep13', status: 'Completed', tone: 'text-green' },
]

const sources = [
  { name: 'Anime News Network (RSS)', ok: true },
  { name: 'One Piece TCG API', ok: true },
  { name: 'MyAnimeList API', ok: false },
]

const quickActions = [
  { label: 'New Content', href: '/admin/content', icon: Plus },
  { label: 'Homepage Builder', href: '/admin/homepage', icon: LayoutTemplate },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'AI Engine', href: '/admin/ai', icon: Bot },
]

function fmtAgo(d: Date) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000))
  if (mins < 60) return `${mins}m`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.round(hrs / 24)}d`
}

export default async function AdminDashboard() {
  const session = await getSession()

  // Live counts from the database (empty DB shows honest zeros).
  const [published, pending, members, aiToday, pendingReview] = await Promise.all([
    prisma.news.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    prisma.news.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.aiJob.count({
      where: { createdAt: { gte: new Date(Date.now() - 86400000) } },
    }),
    prisma.news.findMany({
      where: { status: 'PENDING_REVIEW', deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, updatedAt: true },
    }),
  ])

  return (
    <div>
      <AdminPageHeader
        title={`Welcome back, ${session?.username ?? 'admin'}`}
        subtitle="Website overview and control center"
      />

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Published" value={published.toLocaleString()} hint="News articles" tone="green" icon={FileText} />
        <StatCard label="Pending Review" value={pending.toLocaleString()} hint="Needs approval" tone="orange" icon={Clock} />
        <StatCard label="AI Tasks (24h)" value={aiToday.toLocaleString()} hint="Queued & processed" tone="blue" icon={Bot} />
        <StatCard label="Members" value={members.toLocaleString()} hint="Registered users" tone="purple" icon={Users} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pending review queue */}
        <Panel
          title="Pending Review"
          className="lg:col-span-2"
          action={
            <Link href="/admin/content" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          }
        >
          {pendingReview.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Nothing awaiting review. 🎉
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {pendingReview.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-muted">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text">{p.title}</p>
                    <p className="text-xs text-faint">News · {fmtAgo(p.updatedAt)} ago</p>
                  </div>
                  <Link
                    href={`/admin/content/${p.id}`}
                    className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-on-primary"
                  >
                    Review
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* AI task status */}
        <Panel title="AI Task Status">
          <ul className="space-y-3">
            {aiTasks.map((t) => (
              <li key={t.label} className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-muted" />
                <span className="min-w-0 flex-1 truncate text-sm text-text">{t.label}</span>
                <span className={`text-xs font-semibold ${t.tone}`}>{t.status}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Source status */}
        <Panel title="RSS / API Status">
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.name} className="flex items-center gap-3">
                <Rss className="h-4 w-4 text-muted" />
                <span className="min-w-0 flex-1 truncate text-sm text-text">{s.name}</span>
                {s.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-green" />
                ) : (
                  <span className="text-xs font-semibold text-down">Error</span>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        {/* Traffic snapshot */}
        <Panel title="Traffic (7d)">
          <div className="flex items-end gap-1.5">
            {[40, 55, 48, 70, 62, 85, 78].map((h, i) => (
              <div key={i} className="flex-1">
                <div className="rounded-t bg-primary/70" style={{ height: `${h}px` }} />
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 text-sm text-green">
            <TrendingUp className="h-4 w-4" /> +18.9% vs last week
          </p>
        </Panel>

        {/* Quick actions */}
        <Panel title="Quick Actions">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex flex-col items-center gap-2 rounded-lg border border-line bg-surface-2 p-4 text-center text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-text"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  {a.label}
                </Link>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}
