import type { Metadata } from 'next'
import { Rss, Plus, Trash2 } from 'lucide-react'
import { AdminPageHeader, Panel } from '@/components/admin/admin-ui'
import { Pill } from '@/components/ui'
import { prisma } from '@/lib/db'
import { CollectPanel } from './fetch-now'
import { addSourceAction, toggleSourceAction, deleteSourceAction } from './actions'

export const metadata: Metadata = { title: 'Content Sources' }
export const dynamic = 'force-dynamic'

function fmtWhen(d: Date | null) {
  if (!d) return 'never'
  const mins = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  return hrs < 24 ? `${hrs}h ago` : `${Math.round(hrs / 24)}d ago`
}

async function loadSources() {
  try {
    return await prisma.rssSource.findMany({ orderBy: { createdAt: 'asc' } })
  } catch {
    return []
  }
}

export default async function SourcesPage() {
  const sources = await loadSources()
  const publishedNews = await prisma.news
    .count({ where: { status: 'PUBLISHED', deletedAt: null } })
    .catch(() => 0)
  const cardCount = await prisma.card
    .count({ where: { deletedAt: null } })
    .catch(() => 0)

  return (
    <div>
      <AdminPageHeader
        title="Content Sources"
        subtitle="Collect step — real, free feeds ingested into News + TCG cards"
        icon={Rss}
        action={
          <span className="text-xs text-faint">
            {publishedNews} article{publishedNews === 1 ? '' : 's'} · {cardCount} card
            {cardCount === 1 ? '' : 's'}
          </span>
        }
      />

      <Panel title="Collect now" className="mb-4">
        <CollectPanel />
      </Panel>

      <Panel
        title="RSS Feeds"
        className="mb-4"
        action={
          <span className="text-xs text-faint">
            {publishedNews} published article{publishedNews === 1 ? '' : 's'}
          </span>
        }
      >
        {sources.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            No sources yet. Add a feed URL below.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                  <th className="px-3 py-2 font-semibold">Source</th>
                  <th className="hidden px-3 py-2 font-semibold sm:table-cell">Status</th>
                  <th className="hidden px-3 py-2 font-semibold md:table-cell">Last fetched</th>
                  <th className="px-3 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="px-3 py-2">
                      <p className="font-semibold text-text">{s.name}</p>
                      <p className="max-w-[280px] truncate text-xs text-faint">{s.url}</p>
                    </td>
                    <td className="hidden px-3 py-2 sm:table-cell">
                      <Pill tone={s.enabled ? 'green' : 'muted'}>
                        {s.enabled ? 'Enabled' : 'Disabled'}
                      </Pill>
                    </td>
                    <td className="hidden px-3 py-2 text-muted md:table-cell">
                      {fmtWhen(s.lastFetchedAt)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <form action={toggleSourceAction.bind(null, s.id, !s.enabled)}>
                          <button
                            type="submit"
                            className="rounded-lg border border-line px-2 py-1 text-xs font-semibold text-muted hover:text-text"
                          >
                            {s.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </form>
                        <form action={deleteSourceAction.bind(null, s.id)}>
                          <button
                            type="submit"
                            className="rounded-lg bg-down/15 px-2 py-1 text-xs font-bold text-down"
                            aria-label={`Delete ${s.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="Add a feed">
        <form action={addSourceAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-muted">Name</label>
            <input
              name="name"
              required
              placeholder="Anime News Network"
              className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-faint focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex-[2]">
            <label className="mb-1 block text-xs font-semibold text-muted">Feed URL</label>
            <input
              name="url"
              type="url"
              required
              placeholder="https://example.com/rss.xml"
              className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-faint focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </form>
        <p className="mt-3 text-xs text-faint">
          RSS 2.0 and Atom feeds are supported. New articles publish directly —
          they are verbatim, source-attributed, and not AI-generated.
        </p>
      </Panel>
    </div>
  )
}
