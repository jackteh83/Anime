import type { Metadata } from 'next'
import { BarChart3, Bot, FileText, Image as ImageIcon, Users, Zap } from 'lucide-react'
import { AdminPageHeader, Panel, StatCard } from '@/components/admin/admin-ui'
import { Pill } from '@/components/ui'
import { prisma } from '@/lib/db'
import { statusMeta, type PublishStatusValue } from '@/lib/content'

export const metadata: Metadata = { title: 'Analytics' }

const STATUSES: PublishStatusValue[] = [
  'DRAFT',
  'PENDING_REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
]

export default async function AnalyticsPage() {
  const [
    newsTotal,
    leaksTotal,
    members,
    media,
    newsByStatus,
    leaksByStatus,
    aiByStatus,
    tokenAgg,
    topNews,
  ] = await Promise.all([
    prisma.news.count({ where: { deletedAt: null } }),
    prisma.animeLeak.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.media.count({ where: { deletedAt: null } }),
    prisma.news.groupBy({ by: ['status'], where: { deletedAt: null }, _count: true }),
    prisma.animeLeak.groupBy({ by: ['status'], where: { deletedAt: null }, _count: true }),
    prisma.aiJob.groupBy({ by: ['status'], _count: true }),
    prisma.aiLog.aggregate({ _sum: { tokensUsed: true }, _count: true }),
    prisma.news.findMany({
      where: { deletedAt: null, status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 8,
      select: { id: true, title: true, views: true },
    }),
  ])

  const newsMap = new Map(newsByStatus.map((g) => [g.status, g._count]))
  const leaksMap = new Map(leaksByStatus.map((g) => [g.status, g._count]))
  const publishedNews = newsMap.get('PUBLISHED') ?? 0
  const totalTokens = tokenAgg._sum.tokensUsed ?? 0

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        subtitle="Content, members, and AI usage — from your live database"
        icon={BarChart3}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Published News" value={publishedNews.toLocaleString()} tone="green" icon={FileText} />
        <StatCard label="Members" value={members.toLocaleString()} tone="purple" icon={Users} />
        <StatCard label="Media Assets" value={media.toLocaleString()} tone="blue" icon={ImageIcon} />
        <StatCard label="AI Tokens Used" value={totalTokens.toLocaleString()} tone="orange" icon={Zap} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title={`Content by Status`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                <th className="py-2 font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">News ({newsTotal})</th>
                <th className="py-2 text-right font-semibold">Leaks ({leaksTotal})</th>
              </tr>
            </thead>
            <tbody>
              {STATUSES.map((s) => (
                <tr key={s} className="border-b border-line last:border-0">
                  <td className="py-2.5">
                    <Pill tone={statusMeta[s].tone}>{statusMeta[s].label}</Pill>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-text">
                    {(newsMap.get(s) ?? 0).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-text">
                    {(leaksMap.get(s) ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="AI Engine Usage">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Bot className="h-4 w-4 text-primary" />
            {tokenAgg._count.toLocaleString()} runs · {totalTokens.toLocaleString()} tokens total
          </div>
          <ul className="space-y-2">
            {aiByStatus.length === 0 ? (
              <li className="text-sm text-muted">No AI jobs yet.</li>
            ) : (
              aiByStatus.map((g) => (
                <li key={g.status} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
                  <span className="text-sm text-text">{g.status.replace('_', ' ')}</span>
                  <span className="text-sm font-bold text-text">{g._count.toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>

      <Panel title="Top Published News (by views)" className="mt-4">
        {topNews.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            No published news yet. Publish articles to see view rankings.
          </p>
        ) : (
          <ol className="space-y-2">
            {topNews.map((n, i) => (
              <li key={n.id} className="flex items-center gap-3">
                <span className="w-5 text-sm font-extrabold text-primary">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text">{n.title}</span>
                <span className="text-sm text-muted">{n.views.toLocaleString()} views</span>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <p className="mt-4 text-xs text-faint">
        Page-view traffic requires an analytics provider (e.g. Vercel Analytics);
        the figures above are content and engagement metrics from the database.
      </p>
    </div>
  )
}
