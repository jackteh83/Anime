import type { Metadata } from 'next'
import { Bot, CheckCircle2, XCircle } from 'lucide-react'
import { AdminPageHeader, Panel } from '@/components/admin/admin-ui'
import { Pill, type Tone } from '@/components/ui'
import { prisma } from '@/lib/db'
import { PROVIDERS, PROVIDER_IDS, providerConfigured } from '@/lib/ai/config'
import { resolveProvider } from '@/lib/ai/config'
import { AiRunner } from './ai-runner'
import { approveAiJob, rejectAiJob } from './actions'

export const metadata: Metadata = { title: 'AI Engine' }

const jobStatusTone: Record<string, Tone> = {
  WAITING: 'muted',
  RUNNING: 'blue',
  COMPLETED: 'green',
  FAILED: 'primary',
  PENDING_REVIEW: 'orange',
  PUBLISHED: 'green',
}

function fmtAgo(d: Date) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(d).getTime()) / 60000))
  if (mins < 60) return `${mins}m`
  const hrs = Math.round(mins / 60)
  return hrs < 24 ? `${hrs}h` : `${Math.round(hrs / 24)}d`
}

export default async function AiEnginePage() {
  const active = resolveProvider()
  const configured = PROVIDER_IDS.filter((id) => providerConfigured(id))

  const jobs = await prisma.aiJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
    include: { logs: { take: 1, orderBy: { createdAt: 'desc' } } },
  })

  return (
    <div>
      <AdminPageHeader
        title="AI Engine"
        subtitle="Collect → classify → generate → review → publish"
        icon={Bot}
      />

      {/* Provider status */}
      <Panel title="Providers" className="mb-4">
        <p className="mb-3 text-xs text-muted">
          Active: <b className="text-text">{PROVIDERS[active.id].label}</b> ·{' '}
          {active.model}. Providers are configured by API key only — no code
          changes to switch.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {PROVIDER_IDS.map((id) => {
            const ok = configured.includes(id)
            return (
              <div
                key={id}
                className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2"
              >
                {ok ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-faint" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">
                    {PROVIDERS[id].label}
                  </p>
                  <p className="text-[10px] text-faint">
                    {ok ? 'key set' : 'no key'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {/* Test generation */}
      <div className="mb-4">
        <AiRunner configured={configured} />
      </div>

      {/* Recent jobs / review queue */}
      <Panel title="Recent AI Jobs">
        {jobs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            No AI jobs yet. Run a generation above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                  <th className="px-3 py-2 font-semibold">Task</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="hidden px-3 py-2 font-semibold sm:table-cell">Provider</th>
                  <th className="hidden px-3 py-2 font-semibold md:table-cell">Tokens</th>
                  <th className="hidden px-3 py-2 font-semibold md:table-cell">Time</th>
                  <th className="px-3 py-2 font-semibold">When</th>
                  <th className="px-3 py-2 text-right font-semibold">Review</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => {
                  const log = j.logs[0]
                  return (
                    <tr key={j.id} className="border-b border-line last:border-0">
                      <td className="px-3 py-2 font-semibold text-text">{j.type}</td>
                      <td className="px-3 py-2">
                        <Pill tone={jobStatusTone[j.status] ?? 'muted'}>
                          {j.status.replace('_', ' ')}
                        </Pill>
                      </td>
                      <td className="hidden px-3 py-2 text-muted sm:table-cell">
                        {j.provider ?? '—'}
                      </td>
                      <td className="hidden px-3 py-2 text-muted md:table-cell">
                        {log?.tokensUsed ?? '—'}
                      </td>
                      <td className="hidden px-3 py-2 text-muted md:table-cell">
                        {log?.processingMs ? `${log.processingMs}ms` : '—'}
                      </td>
                      <td className="px-3 py-2 text-faint">{fmtAgo(j.createdAt)}</td>
                      <td className="px-3 py-2">
                        {j.status === 'PENDING_REVIEW' ? (
                          <div className="flex items-center justify-end gap-1">
                            <form action={approveAiJob.bind(null, j.id)}>
                              <button
                                type="submit"
                                className="rounded-lg bg-green/15 px-2 py-1 text-xs font-bold text-green"
                              >
                                Approve
                              </button>
                            </form>
                            <form action={rejectAiJob.bind(null, j.id)}>
                              <button
                                type="submit"
                                className="rounded-lg bg-down/15 px-2 py-1 text-xs font-bold text-down"
                              >
                                Reject
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-right text-xs text-faint">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
