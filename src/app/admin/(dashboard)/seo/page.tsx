import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'SEO Manager' }

export default function SeoPage() {
  return (
    <div>
      <AdminPageHeader
        title="SEO Manager"
        subtitle="Meta, Open Graph, sitemap and more"
        icon={Search}
      />
      <ModulePlaceholder
        title="SEO Manager"
        points={[
          'Meta title, description, keywords per entity',
          'Open Graph and canonical URL configuration',
          'Sitemap and robots management',
          'AI-assisted SEO title / meta generation',
        ]}
      />
    </div>
  )
}
