import type { Metadata } from 'next'
import { LayoutTemplate } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Homepage Builder' }

export default function HomepageBuilderPage() {
  return (
    <div>
      <AdminPageHeader
        title="Homepage Builder"
        subtitle="Configure the homepage dashboard without code"
        icon={LayoutTemplate}
      />
      <ModulePlaceholder
        title="Homepage Builder"
        points={[
          'Drag & drop widgets, reorder, show / hide',
          'Configure widget content and featured items',
          'Hero banner configuration and scheduling',
          'No code changes required for any layout edit',
        ]}
      />
    </div>
  )
}
