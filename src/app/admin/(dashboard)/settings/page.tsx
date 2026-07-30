import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        subtitle="Website, theme, languages, email and more"
        icon={Settings}
      />
      <ModulePlaceholder
        title="Settings"
        points={[
          'Website information, theme, languages, time zone',
          'Email configuration and security',
          'Backup and cache controls',
          'Advertisement positions (managed from CMS)',
        ]}
      />
    </div>
  )
}
