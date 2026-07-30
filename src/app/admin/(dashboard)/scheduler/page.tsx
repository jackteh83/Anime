import type { Metadata } from 'next'
import { CalendarClock } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Scheduler' }

export default function SchedulerPage() {
  return (
    <div>
      <AdminPageHeader
        title="Scheduler"
        subtitle="Automate publishing and AI/data refresh"
        icon={CalendarClock}
      />
      <ModulePlaceholder
        title="Scheduler"
        points={[
          'Scheduled publishing and republishing',
          'Scheduled AI processing tasks',
          'RSS / API refresh intervals',
          'Cache refresh jobs',
        ]}
      />
    </div>
  )
}
