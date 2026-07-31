import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  LayoutTemplate,
  RotateCcw,
} from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { Pill } from '@/components/ui'
import { getSession } from '@/lib/auth'
import { HOMEPAGE_SECTIONS, getHomepageConfig } from '@/lib/homepage-config'
import { moveSection, resetHomepage, toggleSection } from './actions'

export const metadata: Metadata = { title: 'Homepage Builder' }

const MANAGER_ROLES = ['Super Admin', 'Administrator', 'Editor']
const LABELS = Object.fromEntries(HOMEPAGE_SECTIONS.map((s) => [s.key, s.label]))

export default async function HomepageBuilderPage() {
  const session = await getSession()
  const canManage = !!session && MANAGER_ROLES.includes(session.role)
  const layout = await getHomepageConfig()
  const visibleCount = layout.filter((s) => s.visible).length

  return (
    <div>
      <AdminPageHeader
        title="Homepage Builder"
        subtitle="Show / hide and reorder the homepage sections — no code required"
        icon={LayoutTemplate}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted hover:text-text"
            >
              Preview site
            </Link>
            {canManage && (
              <form action={resetHomepage}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-muted hover:text-text"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </form>
            )}
          </div>
        }
      />

      {!canManage && (
        <p className="mb-4 rounded-lg border border-orange/40 bg-orange/10 px-3 py-2 text-sm text-orange">
          Read-only view. Editors and admins can rearrange the homepage.
        </p>
      )}

      <p className="mb-4 text-sm text-muted">
        {visibleCount} of {layout.length} sections visible. The approved design
        loads top-to-bottom in this order.
      </p>

      <div className="space-y-2">
        {layout.map((s, i) => (
          <div
            key={s.key}
            className={`flex items-center gap-3 rounded-card border border-line bg-surface p-4 ${
              s.visible ? '' : 'opacity-60'
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-sm font-bold text-muted">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text">{LABELS[s.key] ?? s.key}</p>
              <Pill tone={s.visible ? 'green' : 'muted'} className="mt-1">
                {s.visible ? 'Visible' : 'Hidden'}
              </Pill>
            </div>
            {canManage && (
              <div className="flex shrink-0 items-center gap-1">
                <form action={moveSection.bind(null, s.key, 'up')}>
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </form>
                <form action={moveSection.bind(null, s.key, 'down')}>
                  <button
                    type="submit"
                    disabled={i === layout.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </form>
                <form action={toggleSection.bind(null, s.key)}>
                  <button
                    type="submit"
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                      s.visible ? 'bg-surface-2 text-muted' : 'bg-green/15 text-green'
                    }`}
                  >
                    {s.visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {s.visible ? 'Hide' : 'Show'}
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
