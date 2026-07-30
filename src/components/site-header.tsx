'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Search, X } from 'lucide-react'
import { mainNav } from '@/lib/nav'
import { logoutMember } from '@/app/(site)/auth-actions'
import { isStaff } from '@/lib/auth-roles'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

type HeaderUser = { username: string; role: string } | null

export function SiteHeader({ user }: { user?: HeaderUser }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        {/* mobile menu button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:text-text lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Logo withTagline />

        {/* desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-text"
              >
                {item.label}
                {item.children && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                )}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full w-56 translate-y-1 rounded-xl border border-line bg-bg-elevated p-1.5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-text"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Notifications"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-text sm:flex"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pl-1 pr-2 transition-colors hover:border-line-strong"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-line bg-bg-elevated p-1.5 shadow-xl">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold text-text">{user.username}</p>
                    <p className="text-[11px] text-faint">{user.role}</p>
                  </div>
                  <Link
                    href="/library"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-text"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" /> My Library
                  </Link>
                  {isStaff(user.role) && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-text"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" /> CMS Control Center
                    </Link>
                  )}
                  <form action={logoutMember}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface-2 hover:text-down"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <nav className="border-t border-line bg-bg-elevated px-4 py-3 lg:hidden">
          {mainNav.map((item) => (
            <div key={item.href} className="py-1">
              <Link
                href={item.href}
                className="block rounded-lg px-2 py-2 text-sm font-semibold text-text hover:bg-surface-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 border-l border-line pl-3">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-lg px-2 py-1.5 text-sm text-muted hover:text-text"
                      onClick={() => setMobileOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  )
}
