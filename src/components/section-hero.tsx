import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** Full-width section banner used at the top of each public section page. */
export function SectionHero({
  title,
  subtitle,
  icon: Icon,
  stats,
  children,
}: {
  title: string
  subtitle: string
  icon?: LucideIcon
  stats?: { value: string; label: string }[]
  children?: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-gradient-to-br from-primary/25 via-surface to-bg p-6 sm:p-8">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/15 to-transparent" />
      <div className="relative">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-text">
          {Icon && (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Icon className="h-6 w-6" />
            </span>
          )}
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">{subtitle}</p>
        {stats && (
          <div className="mt-5 flex flex-wrap gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-line bg-surface/60 px-4 py-2 backdrop-blur"
              >
                <p className="text-lg font-extrabold text-text">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-faint">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/** Simple horizontal tab bar (visual only) shown under a section hero. */
export function SectionTabs({
  tabs,
  active,
}: {
  tabs: { label: string; href: string }[]
  active: string
}) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto">
      {tabs.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            t.label === active
              ? 'bg-primary text-on-primary'
              : 'border border-line bg-surface text-muted hover:text-text'
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  )
}
