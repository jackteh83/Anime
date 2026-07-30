import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSession } from '@/lib/auth'

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        user={session ? { username: session.username, role: session.role } : null}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
