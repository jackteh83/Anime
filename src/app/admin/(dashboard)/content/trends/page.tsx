import type { Metadata } from 'next'
import { TrendingUp } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'
import { ContentTypeTabs } from '@/components/admin/content-type-tabs'

export const metadata: Metadata = { title: 'Trends' }

export default function TrendsContentPage() {
  return (
    <div>
      <AdminPageHeader
        title="Trends"
        subtitle="Real-time anime & TCG trend tracking"
        icon={TrendingUp}
      />
      <ContentTypeTabs active="trends" />
      <ModulePlaceholder
        title="Trend Management"
        points={[
          'Trend subjects with score, 24h change and sentiment',
          'Heatmap and trending keywords configuration',
          'AI trend prediction inputs',
          'Captured over time for day / week / month views',
        ]}
      />
    </div>
  )
}
