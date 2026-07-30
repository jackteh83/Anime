'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { AlertCircle, Loader2, Save } from 'lucide-react'
import { PUBLISH_STATUSES, statusMeta } from '@/lib/content'
import type { ContentFormState } from './actions'

type Category = { id: string; name: string }

export type NewsInitial = {
  title?: string
  excerpt?: string
  body?: string
  categoryId?: string
  status?: string
  seoTitle?: string
  seoDesc?: string
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

export function NewsForm({
  action,
  categories,
  initial = {},
}: {
  action: (prev: ContentFormState, formData: FormData) => Promise<ContentFormState>
  categories: Category[]
  initial?: NewsInitial
}) {
  const [state, formAction] = useActionState<ContentFormState, FormData>(action, {})

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* main column */}
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
              placeholder="Article title"
              className={inputClass}
            />
          </div>
          <div className="mb-4">
            <label className={labelClass}>Excerpt</label>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={initial.excerpt}
              placeholder="Short summary shown in listings"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Body</label>
            <textarea
              name="body"
              rows={12}
              defaultValue={initial.body}
              placeholder="Article content (markdown supported later)"
              className={inputClass}
            />
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text">SEO</h2>
          <div className="mb-4">
            <label className={labelClass}>SEO Title</label>
            <input name="seoTitle" defaultValue={initial.seoTitle} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea name="seoDesc" rows={2} defaultValue={initial.seoDesc} className={inputClass} />
          </div>
        </div>
      </div>

      {/* side column */}
      <div className="space-y-4">
        <div className="rounded-card border border-line bg-surface p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text">Publish</h2>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            defaultValue={initial.status ?? 'DRAFT'}
            className={inputClass}
          >
            {PUBLISH_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusMeta[s].label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted">
            AI-generated content should stay in <b>Pending Review</b> until an
            editor approves it.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <SaveButton />
            <Link
              href="/admin/content"
              className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-muted hover:text-text"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          <label className={labelClass}>Category</label>
          <select name="categoryId" defaultValue={initial.categoryId ?? ''} className={inputClass}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  )
}
