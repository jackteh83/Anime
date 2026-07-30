import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { getSession } from '@/lib/auth'
import { getSettings } from '@/lib/settings'
import { AdsForm, GeneralForm, LocalizationForm } from './settings-forms'

export const metadata: Metadata = { title: 'Settings' }

const MANAGER_ROLES = ['Super Admin', 'Administrator']

export default async function SettingsPage() {
  const session = await getSession()
  const canManage = !!session && MANAGER_ROLES.includes(session.role)

  const [general, localization, ads] = await Promise.all([
    getSettings('general'),
    getSettings('localization'),
    getSettings('ads'),
  ])

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        subtitle="Website, localization, and advertisement configuration"
        icon={Settings}
      />

      {!canManage && (
        <p className="mb-4 rounded-lg border border-orange/40 bg-orange/10 px-3 py-2 text-sm text-orange">
          Read-only view. Only Super Admin and Administrator can change settings.
        </p>
      )}

      <div className="space-y-4">
        <GeneralForm initial={general} canManage={canManage} />
        <LocalizationForm initial={localization} canManage={canManage} />
        <AdsForm initial={ads} canManage={canManage} />
      </div>
    </div>
  )
}
