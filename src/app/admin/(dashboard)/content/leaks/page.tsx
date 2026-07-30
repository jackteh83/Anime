import Link from 'next/link'
import type { Metadata } from 'next'
import { Flame, Pencil, Plus, Send, Trash2, Undo2, Zap } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { ContentTypeTabs } from '@/components/admin/content-type-tabs'
import { Pill } from '@/components/ui'
import { prisma } from '@/lib/db'
import {
  PUBLISH_STATUSES,
  leakTypeMeta,
  statusMeta,
  type PublishStatusValue,
} from '@/lib/content'
import { deleteLeak, setLeakStatus } from './actions'

export const metadata: Metadata = { title: 'Anime Leaks' }

const FILTERS = ['ALL', ...PUBLISH_STATUSES] as const

export default async function LeaksPage(props: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await props.searchParams
  const active = (
    FILTERS.includes(status as never) ? status : 'ALL'
  ) as (typeof FILTERS)[number]

  const where = {
    deletedAt: null,
    ...(active !== 'ALL' ? { status: active as never } : {}),
  }

  const [items, grouped] = await Promise.all([
    prisma.animeLeak.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: 100,
    }),
    prisma.animeLeak.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: true,
    }),
  ])

  const counts = new Map(grouped.map((g) => [g.status, g._count]))
  const total = grouped.reduce((n, g) => n + g._count, 0)

  return (
    <div>
      <AdminPageHeader
        title="Anime Leaks"
        subtitle="Manga & anime leaks, raws, spoilers and summaries"
        icon={Zap}
        action={
          <Link
            href="/admin/content/leaks/new"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> New Leak
          </Link>
        }
      />

      <ContentTypeTabs active="leaks" />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f === 'ALL' ? total : (counts.get(f) ?? 0)
          const isActive = f === active
          return (
            <Link
              key={f}
              href={
                f === 'ALL'
                  ? '/admin/content/leaks'
                  : `/admin/content/leaks?status=${f}`
              }
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'border border-line bg-surface text-muted hover:text-text'
              }`}
            >
              {f === 'ALL' ? 'All' : statusMeta[f as PublishStatusValue].label}
              <span className="ml-1.5 opacity-70">{count}</span>
            </Link>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-surface">
        {items.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">
            No leaks yet.{' '}
            <Link href="/admin/content/leaks/new" className="text-primary hover:underline">
              Create the first one
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Series</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Heat</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => {
                const meta = statusMeta[l.status]
                const type = leakTypeMeta[l.type]
                const published = l.status === 'PUBLISHED'
                return (
                  <tr key={l.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/content/leaks/${l.id}`}
                        className="font-semibold text-text hover:text-primary"
                      >
                        {l.title}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">
                      {l.series}
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={type.tone}>{type.label}</Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={meta.tone}>{meta.label}</Pill>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="flex items-center gap-1 text-xs font-bold text-primary">
                        <Flame className="h-3 w-3" />
                        {l.heat.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/content/leaks/${l.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-text"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form
                          action={setLeakStatus.bind(
                            null,
                            l.id,
                            published ? 'DRAFT' : 'PUBLISHED',
                          )}
                        >
                          <button
                            type="submit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-green"
                            title={published ? 'Unpublish' : 'Publish'}
                          >
                            {published ? (
                              <Undo2 className="h-4 w-4" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </button>
                        </form>
                        <form action={deleteLeak.bind(null, l.id)}>
                          <button
                            type="submit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-down"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
