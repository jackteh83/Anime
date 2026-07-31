'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import type { SeoSettings } from '@/lib/settings'
import { saveSeo, type SettingsState } from '../settings/actions'

const inputClass =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary'
const labelClass = 'mb-1.5 block text-sm font-semibold text-text'

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save
    </button>
  )
}

export function SeoForm({ initial, canManage }: { initial: SeoSettings; canManage: boolean }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveSeo, {})
  return (
    <form action={action} className="rounded-card border border-line bg-surface p-5">
      <fieldset disabled={!canManage} className="space-y-4">
        <div>
          <label className={labelClass}>Meta Title Template</label>
          <input name="metaTitleTemplate" defaultValue={initial.metaTitleTemplate} className={inputClass} />
          <p className="mt-1 text-xs text-faint">Use %s for the page title, e.g. “%s · Anisekai”.</p>
        </div>
        <div>
          <label className={labelClass}>Default Meta Description</label>
          <textarea name="defaultDescription" rows={3} defaultValue={initial.defaultDescription} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Keywords</label>
          <input name="keywords" defaultValue={initial.keywords} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Open Graph Image URL</label>
          <input name="ogImageUrl" defaultValue={initial.ogImageUrl} placeholder="https://…" className={inputClass} />
        </div>
        <label className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5">
          <span className="text-sm text-text">Allow search engines to index the site (robots)</span>
          <input type="checkbox" name="robotsAllow" defaultChecked={initial.robotsAllow} className="h-4 w-4 accent-[var(--primary)]" />
        </label>
      </fieldset>
      {canManage && <SaveButton />}
      {state.ok && <p className="mt-2 flex items-center gap-1.5 text-sm text-green"><CheckCircle2 className="h-4 w-4" />{state.ok}</p>}
      {state.error && <p className="mt-2 text-sm text-down">{state.error}</p>}
    </form>
  )
}
