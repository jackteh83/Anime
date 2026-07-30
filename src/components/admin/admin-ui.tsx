import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import type { ReactNode } from 'react'

export function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-extrabold text-text">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'primary',
  icon: Icon,
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'primary' | 'green' | 'blue' | 'orange' | 'purple'
  icon?: LucideIcon
}) {
  const toneText: Record<string, string> = {
    primary: 'text-primary',
    green: 'text-green',
    blue: 'text-blue',
    orange: 'text-orange',
    purple: 'text-purple',
  }
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">
          {label}
        </p>
        {Icon && <Icon className={`h-4 w-4 ${toneText[tone]}`} />}
      </div>
      <p className="mt-2 text-2xl font-extrabold text-text">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-card border border-line bg-surface p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-sm font-bold uppercase tracking-wide text-text">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

/** Placeholder for CMS modules whose full UI ships in a later phase. */
export function ModulePlaceholder({
  title,
  points,
}: {
  title: string
  points: string[]
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface p-8 text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-orange">
        <Construction className="h-6 w-6" />
      </span>
      <h2 className="text-lg font-bold text-text">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        This module is scaffolded and reserved. Planned capabilities:
      </p>
      <ul className="mx-auto mt-4 flex max-w-md flex-col gap-2 text-left">
        {points.map((p) => (
          <li
            key={p}
            className="flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted"
          >
            <span className="mt-0.5 text-primary">•</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}
