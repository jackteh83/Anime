import Link from 'next/link'
import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { getSession } from '@/lib/auth'
import { getSettings } from '@/lib/settings'
import { SeoForm } from './seo-form'

export const metadata: Metadata = { title: 'SEO Manager' }

const MANAGER_ROLES = ['Super Admin', 'Administrator', 'Editor']

export default async function SeoPage() {
  const session = await getSession()
  const canManage = !!session && MANAGER_ROLES.includes(session.role)
  const seo = await getSettings('seo')

  return (
    <div>
      <AdminPageHeader
        title="SEO Manager"
        subtitle="Global metadata, Open Graph, sitemap and robots"
        icon={Search}
      />

      {!canManage && (
        <p className="mb-4 rounded-lg border border-orange/40 bg-orange/10 px-3 py-2 text-sm text-orange">
          Read-only view. Editors and admins can change SEO settings.
        </p>
      )}

      <SeoForm initial={seo} canManage={canManage} />

      <div className="mt-4 rounded-card border border-line bg-surface p-5">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-text">Generated files</h2>
        <p className="text-sm text-muted">
          These update automatically from your published content and the settings
          above:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/sitemap.xml" target="_blank" className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:text-primary">
            /sitemap.xml
          </Link>
          <Link href="/robots.txt" target="_blank" className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:text-primary">
            /robots.txt
          </Link>
        </div>
      </div>
    </div>
  )
}
