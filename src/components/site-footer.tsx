import Link from 'next/link'
import { Globe, MessageCircle, Rss, Send } from 'lucide-react'
import { footerNav } from '@/lib/nav'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-bg-elevated">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Your daily source for anime leaks, TCG updates, episode previews,
              and anime news.
            </p>
            <div className="mt-4 flex gap-2">
              {[MessageCircle, Send, Rss, Globe].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-text"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-faint">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-text"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-line pt-6 text-sm text-faint sm:flex-row">
          <p>
            <span className="font-bold text-text">ANISEKAI</span>
            <span className="text-primary">.</span> — AI-powered Anime &amp; TCG
            intelligence.
          </p>
          <p>© {new Date().getFullYear()} Anisekai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
