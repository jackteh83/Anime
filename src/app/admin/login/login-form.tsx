'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, Loader2, Lock } from 'lucide-react'
import { login, type LoginState } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text">
          Email
        </label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@anisekai.com"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text">
          Password
        </label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
