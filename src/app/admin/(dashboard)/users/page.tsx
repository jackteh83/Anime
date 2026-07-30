import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Users' }

export default function UsersPage() {
  return (
    <div>
      <AdminPageHeader
        title="User Management"
        subtitle="Roles, permissions and member accounts"
        icon={Users}
      />
      <ModulePlaceholder
        title="User Management"
        points={[
          'Roles: Super Admin, Administrator, Editor, Moderator, Author',
          'Configurable permissions per role',
          'Manage member accounts and moderators',
          'Audit of staff actions',
        ]}
      />
    </div>
  )
}
