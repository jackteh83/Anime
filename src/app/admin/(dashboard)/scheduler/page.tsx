import Link from 'next/link'
import type { Metadata } from 'next'
import { CalendarClock, Clock, PlayCircle } from 'lucide-react'
import { AdminPageHeader, Panel, StatCard } from '@/components/admin/admin-ui'
import { Pill } from '@/components/ui'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { publishDueNow } from './actions'

export const metadata: Metadata = { title: 'Scheduler' }

const MANAGER_ROLES = ['Super Admin', 'Administrator', 'Editor']

function fmt(d: Date | null) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function SchedulerPage() {
  const session = await getSession()
  const canManage = !!session && MANAGER_ROLES.includes(session.role)
  const now = new Date()

  const scheduled = await prisma.news.findMany({
    where: { status: 'SCHEDULED', deletedAt: null },
    orderBy: { scheduledAt: 'asc' },
    take: 100,
    select: { id: true, title: true, scheduledAt: true },
  })

  const due = scheduled.filter((n) => n.scheduledAt && n.scheduledAt <= now)
  const upcoming = scheduled.filter((n) => !n.scheduledAt || n.scheduledAt > now)

  return (
    <div>
      <AdminPageHeader
        title="Scheduler"
        subtitle="Scheduled publishing — auto-publishes content when due"
        icon={CalendarClock}
        action={
          canManage && due.length > 0 ? (
            <form action={publishDueNow}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <PlayCircle className="h-4 w-4" /> Publish {due.length} due now
              </button>
            </form>
          ) : undefined
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Scheduled" value={scheduled.length} tone="blue" icon={Clock} />
        <StatCard label="Due Now" value={due.length} tone="orange" icon={PlayCircle} />
        <StatCard label="Upcoming" value={upcoming.length} tone="green" icon={CalendarClock} />
      </div>

      <Panel title="Scheduled Content">
        {scheduled.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted">
            Nothing scheduled. In an article, set status <b>Scheduled</b> and a
            publish time.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {scheduled.map((n) => {
              const isDue = !!n.scheduledAt && n.scheduledAt <= now
              return (
                <li key={n.id} className="flex items-center gap-3 py-3">
                  <Clock className={`h-4 w-4 ${isDue ? 'text-orange' : 'text-muted'}`} />
                  <Link
                    href={`/admin/content/${n.id}`}
                    className="min-w-0 flex-1 truncate font-semibold text-text hover:text-primary"
                  >
                    {n.title}
                  </Link>
                  <span className="shrink-0 text-sm text-muted">{fmt(n.scheduledAt)}</span>
                  <Pill tone={isDue ? 'orange' : 'blue'}>{isDue ? 'Due' : 'Upcoming'}</Pill>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>

      <div className="mt-4 rounded-card border border-line bg-surface p-5 text-sm text-muted">
        <p className="mb-1 font-semibold text-text">How auto-publishing works</p>
        <p>
          A scheduled job hits <code className="text-text">/api/cron/publish</code>{' '}
          and publishes anything that is due. Vercel Cron (configured in{' '}
          <code className="text-text">vercel.json</code>) triggers it; you can
          also point an external cron (e.g. cron-job.org) at that URL for
          minute-level precision, or use the button above to publish due items
          immediately.
        </p>
      </div>
    </div>
  )
}
