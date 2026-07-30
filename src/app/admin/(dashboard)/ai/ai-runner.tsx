'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Sparkles } from 'lucide-react'
import { AI_TASKS, aiTaskMeta } from '@/lib/ai/tasks'
import { PROVIDERS, PROVIDER_IDS } from '@/lib/ai/config'
import { runAiTask, type AiRunState } from './actions'

function RunButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {pending ? 'Generating…' : 'Generate'}
    </button>
  )
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary'

export function AiRunner({ configured }: { configured: string[] }) {
  const [state, formAction] = useActionState<AiRunState, FormData>(runAiTask, {})

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <form action={formAction} className="rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text">
          Test Generation
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">Task</label>
            <select name="task" defaultValue="SUMMARY" className={inputClass}>
              {AI_TASKS.map((t) => (
                <option key={t} value={t}>
                  {aiTaskMeta[t].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-text">
              Provider
            </label>
            <select name="provider" defaultValue="" className={inputClass}>
              <option value="">Default (from config)</option>
              {PROVIDER_IDS.map((id) => (
                <option key={id} value={id} disabled={!configured.includes(id)}>
                  {PROVIDERS[id].label}
                  {configured.includes(id) ? '' : ' — no key'}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-text">
            Model (optional)
          </label>
          <input name="model" placeholder="override model id" className={inputClass} />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-text">
            Content
          </label>
          <textarea
            name="content"
            rows={8}
            placeholder="Paste the article, leak summary, or text to process…"
            className={inputClass}
          />
        </div>
        <div className="mt-4">
          <RunButton />
        </div>
      </form>

      <div className="rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-text">
          Output
        </h2>
        {state.error ? (
          <p className="rounded-lg border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">
            {state.error}
          </p>
        ) : state.result ? (
          <div>
            <p className="mb-2 text-xs text-faint">
              {state.provider} · {state.model} · queued to Pending Review
            </p>
            <div className="whitespace-pre-wrap rounded-lg bg-surface-2 p-3 text-sm text-text">
              {state.result}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">
            Run a task to see AI output here. Every result is logged and enters
            the review queue — AI never publishes directly.
          </p>
        )}
      </div>
    </div>
  )
}
