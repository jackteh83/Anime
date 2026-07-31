'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { DownloadCloud, Layers, Loader2, type LucideIcon } from 'lucide-react'
import { fetchNowAction, fetchCardsAction, type FetchState } from './actions'

function SubmitButton({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {pending ? 'Fetching…' : label}
    </button>
  )
}

function Collector({
  action,
  label,
  icon,
  hint,
}: {
  action: (prev: FetchState, fd: FormData) => Promise<FetchState>
  label: string
  icon: LucideIcon
  hint: string
}) {
  const [state, formAction] = useActionState<FetchState, FormData>(action, {})
  return (
    <div>
      <form action={formAction} className="flex items-center gap-3">
        <SubmitButton label={label} icon={icon} />
        <p className="text-xs text-muted">{hint}</p>
      </form>

      {state.error && (
        <p className="mt-3 text-sm font-semibold text-primary">{state.error}</p>
      )}
      {state.ok && (
        <div className="mt-3 rounded-lg border border-line bg-surface-2 p-3 text-sm">
          <p className="font-semibold text-text">
            Processed {state.inserted} item{state.inserted === 1 ? '' : 's'}.
          </p>
          {state.detail && state.detail.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {state.detail.map((d) => (
                <li key={d.source} className="flex items-center justify-between gap-3">
                  <span>{d.source}</span>
                  <span className={d.error ? 'text-primary' : 'text-green'}>
                    {d.error ? d.error : `+${d.inserted}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export function CollectPanel() {
  return (
    <div className="space-y-5">
      <Collector
        action={fetchNowAction}
        label="Fetch news"
        icon={DownloadCloud}
        hint="Pulls new articles from every enabled RSS feed into News. Real, source-attributed — never AI-fabricated."
      />
      <div className="border-t border-line" />
      <Collector
        action={fetchCardsAction}
        label="Fetch TCG prices"
        icon={Layers}
        hint="Refreshes Pokémon TCG cards + real market prices from pokemontcg.io into the Card table."
      />
    </div>
  )
}
