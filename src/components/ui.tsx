import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

/** Category / status colours available as soft pill styles. */
export type Tone =
  | 'primary'
  | 'purple'
  | 'blue'
  | 'green'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'yellow'
  | 'muted'

const toneClass: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  purple: 'bg-purple/15 text-purple',
  blue: 'bg-blue/15 text-blue',
  green: 'bg-green/15 text-green',
  orange: 'bg-orange/15 text-orange',
  pink: 'bg-pink/15 text-pink',
  cyan: 'bg-cyan/15 text-cyan',
  yellow: 'bg-yellow/15 text-yellow',
  muted: 'bg-surface-2 text-muted',
}

export function Pill({
  children,
  tone = 'muted',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/** A dashboard widget container with a title row and optional "view all" link. */
export function Widget({
  title,
  icon,
  viewAllHref,
  viewAllLabel = 'View All',
  action,
  children,
  className = '',
}: {
  title?: ReactNode
  icon?: ReactNode
  viewAllHref?: string
  viewAllLabel?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-card border border-line bg-surface p-4 sm:p-5 ${className}`}
    >
      {(title || viewAllHref || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-text">
            {icon}
            {title}
          </h2>
          {action}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted transition-colors hover:text-primary"
            >
              {viewAllLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/** Coloured square placeholder used where cover art / thumbnails will go. */
export function Thumb({
  tone = 'primary',
  size = 'md',
  label,
  className = '',
}: {
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}) {
  const sizes = { sm: 'h-10 w-10', md: 'h-14 w-14', lg: 'h-20 w-16' }
  const grad: Record<Tone, string> = {
    primary: 'from-primary/40 to-primary/5',
    purple: 'from-purple/40 to-purple/5',
    blue: 'from-blue/40 to-blue/5',
    green: 'from-green/40 to-green/5',
    orange: 'from-orange/40 to-orange/5',
    pink: 'from-pink/40 to-pink/5',
    cyan: 'from-cyan/40 to-cyan/5',
    yellow: 'from-yellow/40 to-yellow/5',
    muted: 'from-surface-2 to-surface-2',
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${grad[tone]} ${sizes[size]} ${className}`}
    >
      {label && (
        <span className="px-1 text-center text-[9px] font-bold uppercase text-text/70">
          {label}
        </span>
      )}
    </div>
  )
}

export function StatChange({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span className={`text-xs font-bold ${up ? 'text-up' : 'text-down'}`}>
      {up ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  )
}
