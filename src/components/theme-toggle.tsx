'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'dark' | 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
    setTheme(current)
    setMounted(true)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('anisekai-theme', next)
    } catch {
      /* ignore storage errors (private mode) */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark / light mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-text"
    >
      {mounted && theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
