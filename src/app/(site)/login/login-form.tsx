'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { AlertCircle, Loader2, LogIn } from 'lucide-react'
import { loginMember, type AuthState } from '../auth-actions'

const inputClass =
  'w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export function MemberLoginForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(loginMember, {})
  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text">Email</label>
        <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-text">Password</label>
        <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className={inputClass} />
      </div>
      <SubmitButton />
      <p className="text-center text-sm text-muted">
        New to Anisekai?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  )
}
