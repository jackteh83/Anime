import Link from 'next/link'
import { ExternalLink, LogOut } from 'lucide-react'
import { logout } from '@/app/admin/actions'
import type { SessionPayload } from '@/lib/auth'

export function AdminTopbar({ session }: { session: SessionPayload }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-bg px-4 sm:px-6">
      <div className="lg:hidden">
        <span className="text-lg font-extrabold">
          <span className="text-primary">ANI</span>
          <span className="text-text">SEKAI</span>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-text sm:flex"
        >
          View site <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
            {session.username.charAt(0).toUpperCase()}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold leading-tight text-text">
              {session.username}
            </p>
            <p className="text-[10px] leading-tight text-faint">
              {session.role}
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-down"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  )
}
