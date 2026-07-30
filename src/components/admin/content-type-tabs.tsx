import Link from 'next/link'
import { CONTENT_TYPES, type ContentTypeKey } from '@/lib/content'

/** Top-level content-type switcher shared across the Content module. */
export function ContentTypeTabs({ active }: { active: ContentTypeKey }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2 border-b border-line pb-3">
      {CONTENT_TYPES.map((t) => {
        const isActive = t.key === active
        return (
          <Link
            key={t.key}
            href={t.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary-soft text-primary'
                : 'text-muted hover:bg-surface-2 hover:text-text'
            }`}
          >
            {t.label}
          </Link>
        )
      })}
    </div>
  )
}
