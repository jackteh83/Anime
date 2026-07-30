import type { Metadata } from 'next'
import { Zap } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { LeakForm } from '../leak-form'
import { createLeak } from '../actions'

export const metadata: Metadata = { title: 'New Leak' }

export default function NewLeakPage() {
  return (
    <div>
      <AdminPageHeader title="New Leak" subtitle="Add an anime / manga leak" icon={Zap} />
      <LeakForm action={createLeak} />
    </div>
  )
}
