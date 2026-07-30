import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getSession } from '@/lib/auth'
import { Logo } from '@/components/logo'
import { RegisterForm } from './register-form'

export const metadata: Metadata = { title: 'Register' }
export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const session = await getSession()
  if (session) redirect('/library')

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-16">
      <Logo />
      <p className="mt-2 text-sm text-muted">Join the Anisekai community</p>
      <div className="mt-6 w-full rounded-card border border-line bg-surface p-6">
        <RegisterForm />
      </div>
    </div>
  )
}
