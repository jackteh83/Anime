'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { DownloadCloud, Loader2 } from 'lucide-react'
import { fetchNowAction, type FetchState } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <DownloadCloud className="h-4 w-4" />
      )}
      {pending ? 'Fetching…' : 'Fetch now'}
    </button>
  )
}

export function FetchNow() {
  const [state, action] = useActionState<FetchState, FormData>(fetchNowAction, {})
  return (
    <div>
      <form action={action} className="flex items-center gap-3">
        <SubmitButton />
        <p className="text-xs text-muted">
          Pulls new articles from every enabled feed into the review-free News
          list. Real, source-attributed content — never AI-fabricated.
        </p>
      </form>

      {state.error && (
        <p className="mt-3 text-sm font-semibold text-primary">{state.error}</p>
      )}
      {state.ok && (
        <div className="mt-3 rounded-lg border border-line bg-surface-2 p-3 text-sm">
          <p className="font-semibold text-text">
            Added {state.inserted} new article{state.inserted === 1 ? '' : 's'}.
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
