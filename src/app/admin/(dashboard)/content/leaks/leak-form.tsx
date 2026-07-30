'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import {
  LEAK_STATUSES,
  LEAK_TYPES,
  PUBLISH_STATUSES,
  leakStatusMeta,
  leakTypeMeta,
  statusMeta,
} from '@/lib/content'
import type { LeakFormState } from './actions'

export type LeakInitial = {
  title?: string
  series?: string
  summary?: string
  type?: string
  leakStatus?: string
  status?: string
  sourceUrl?: string
  leakerName?: string
  heat?: number
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? 'Saving…' : 'Save'}
    </button>
  )
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary'
const labelClass = 'mb-1.5 block text-sm font-semibold text-text'

export function LeakForm({
  action,
  initial = {},
}: {
  action: (prev: LeakFormState, formData: FormData) => Promise<LeakFormState>
  initial?: LeakInitial
}) {
  const [state, formAction] = useActionState<LeakFormState, FormData>(action, {})

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {state.error && (
          <div className="flex items-center gap-2 rounded-lg border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}
        <div className="rounded-card border border-line bg-surface p-5">
          <div className="mb-4">
            <label className={labelClass}>Title</label>
            <input
              name="title"
              required
              defaultValue={initial.title}
              placeholder="e.g. One Piece Chapter 1156 — Full Summary"
              className={inputClass}
            />
          </div>
          <div className="mb-4">
            <label className={labelClass}>Series</label>
            <input
              name="series"
              required
              defaultValue={initial.series}
              placeholder="e.g. One Piece"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Summary</label>
            <textarea
              name="summary"
              rows={10}
              defaultValue={initial.summary}
              placeholder="Leak details / summary"
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Source URL</label>
              <input
                name="sourceUrl"
                type="url"
                defaultValue={initial.sourceUrl}
                placeholder="https://…"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Leaker Name</label>
              <input
                name="leakerName"
                defaultValue={initial.leakerName}
                placeholder="e.g. Redon"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text">Publish</h2>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={initial.status ?? 'DRAFT'} className={inputClass}>
            {PUBLISH_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusMeta[s].label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted">
            AI-collected leaks stay in <b>Pending Review</b> until approved.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <SaveButton />
            <Link
              href="/admin/content/leaks"
              className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-muted hover:text-text"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-5 space-y-4">
          <div>
            <label className={labelClass}>Leak Type</label>
            <select name="type" defaultValue={initial.type ?? 'MANGA'} className={inputClass}>
              {LEAK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {leakTypeMeta[t].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Leak Status</label>
            <select
              name="leakStatus"
              defaultValue={initial.leakStatus ?? 'RUMORED'}
              className={inputClass}
            >
              {LEAK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {leakStatusMeta[s].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Heat</label>
            <input
              name="heat"
              type="number"
              min={0}
              defaultValue={initial.heat ?? 0}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
