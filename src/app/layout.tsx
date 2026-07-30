import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Anisekai — AI-powered Anime & TCG Intelligence',
    template: '%s · Anisekai',
  },
  description:
    'Anisekai is an AI-powered Anime & Trading Card Game (TCG) intelligence platform: leaks, episodes, TCG market, trends and news, updated daily.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

// Runs before paint to apply the saved theme and avoid a flash of the wrong theme.
const themeInit = `(function(){try{var t=localStorage.getItem('anisekai-theme');if(!t){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
