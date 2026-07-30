'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNav } from '@/lib/admin-nav'
import { Logo } from '@/components/logo'

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-bg-elevated lg:flex">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary-soft text-primary'
                  : 'text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-line p-3 text-[11px] text-faint">
        Anisekai CMS · v0.1
      </div>
    </aside>
  )
}
