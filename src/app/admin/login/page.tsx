import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getSession, isStaff } from '@/lib/auth'
import { Logo } from '@/components/logo'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'CMS Login',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ next?: string }>
}) {
  // Already signed in with a valid staff session -> go straight to the CMS.
  const session = await getSession()
  if (session && isStaff(session.role)) {
    redirect('/admin')
  }

  const { next } = await props.searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-2 text-sm text-muted">
            Control Center — staff sign in
          </p>
        </div>
        <div className="rounded-card border border-line bg-surface p-6">
          <LoginForm next={next} />
        </div>
        <p className="mt-4 text-center text-xs text-faint">
          Anisekai CMS · authorized personnel only
        </p>
      </div>
    </div>
  )
}
