'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import type {
  AdsSettings,
  GeneralSettings,
  LocalizationSettings,
} from '@/lib/settings'
import {
  saveAds,
  saveGeneral,
  saveLocalization,
  type SettingsState,
} from './actions'

const inputClass =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary'
const labelClass = 'mb-1.5 block text-sm font-semibold text-text'

function SaveBar({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save
    </button>
  )
}

function Feedback({ state }: { state: SettingsState }) {
  if (state.ok) return <p className="mt-2 flex items-center gap-1.5 text-sm text-green"><CheckCircle2 className="h-4 w-4" />{state.ok}</p>
  if (state.error) return <p className="mt-2 text-sm text-down">{state.error}</p>
  return null
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5">
      <span className="text-sm text-text">{label}</span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--primary)]" />
    </label>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text">{title}</h2>
      {children}
    </section>
  )
}

export function GeneralForm({ initial, canManage }: { initial: GeneralSettings; canManage: boolean }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveGeneral, {})
  return (
    <Panel title="Website Information">
      <form action={action}>
        <fieldset disabled={!canManage} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Site Name</label>
            <input name="siteName" defaultValue={initial.siteName} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input name="tagline" defaultValue={initial.tagline} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Site URL</label>
            <input name="siteUrl" defaultValue={initial.siteUrl} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Email</label>
            <input name="contactEmail" type="email" defaultValue={initial.contactEmail} className={inputClass} />
          </div>
        </fieldset>
        {canManage && <SaveBar />}
        <Feedback state={state} />
      </form>
    </Panel>
  )
}

export function LocalizationForm({ initial, canManage }: { initial: LocalizationSettings; canManage: boolean }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveLocalization, {})
  return (
    <Panel title="Localization">
      <form action={action}>
        <fieldset disabled={!canManage} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Default Language</label>
              <select name="defaultLanguage" defaultValue={initial.defaultLanguage} className={inputClass}>
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Time Zone</label>
              <input name="timezone" defaultValue={initial.timezone} className={inputClass} />
            </div>
          </div>
          <Toggle name="zhToggle" label="Show the ZH language toggle on the site" defaultChecked={initial.zhToggle} />
        </fieldset>
        {canManage && <SaveBar />}
        <Feedback state={state} />
      </form>
    </Panel>
  )
}

export function AdsForm({ initial, canManage }: { initial: AdsSettings; canManage: boolean }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveAds, {})
  return (
    <Panel title="Advertisement Positions">
      <form action={action}>
        <fieldset disabled={!canManage} className="grid gap-2 sm:grid-cols-2">
          <Toggle name="heroBanner" label="Hero Banner" defaultChecked={initial.heroBanner} />
          <Toggle name="sidebar" label="Sidebar" defaultChecked={initial.sidebar} />
          <Toggle name="betweenWidgets" label="Between Widgets" defaultChecked={initial.betweenWidgets} />
          <Toggle name="articlePages" label="Article Pages" defaultChecked={initial.articlePages} />
          <Toggle name="footer" label="Footer" defaultChecked={initial.footer} />
        </fieldset>
        {canManage && <SaveBar />}
        <Feedback state={state} />
      </form>
    </Panel>
  )
}
