'use client'

import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { setUserRole } from './actions'

type Role = { id: string; name: string }

export function RoleSelect({
  userId,
  roleId,
  roles,
  disabled,
}: {
  userId: string
  roleId: string
  roles: Role[]
  disabled?: boolean
}) {
  const [pending, start] = useTransition()

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        defaultValue={roleId}
        disabled={disabled || pending}
        onChange={(e) => {
          const next = e.target.value
          start(async () => {
            await setUserRole(userId, next)
          })
        }}
        className="rounded-lg border border-line bg-surface-2 px-2 py-1 text-xs font-semibold text-text outline-none focus:border-primary disabled:opacity-60"
      >
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
    </span>
  )
}
