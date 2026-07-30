import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Content' }

export default function ContentPage() {
  return (
    <div>
      <AdminPageHeader
        title="Content Management"
        subtitle="Anime Leaks · Episodes · TCG · Trends · News"
        icon={FileText}
      />
      <ModulePlaceholder
        title="Content Management"
        points={[
          'Create, edit, delete, draft, preview, publish, archive',
          'Scheduling and bulk operations',
          'Per-type editors for Leaks, Episodes, TCG, Trends, News',
          'AI actions inline: generate, rewrite, translate, summarize, SEO',
        ]}
      />
    </div>
  )
}
