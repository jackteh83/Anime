import type { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Analytics' }

export default function AnalyticsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        subtitle="Traffic, content and AI performance"
        icon={BarChart3}
      />
      <ModulePlaceholder
        title="Analytics"
        points={[
          'Traffic and popular articles',
          'Trending searches and click statistics',
          'User growth',
          'AI performance metrics',
        ]}
      />
    </div>
  )
}
