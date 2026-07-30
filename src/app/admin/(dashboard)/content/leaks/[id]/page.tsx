import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Zap } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { prisma } from '@/lib/db'
import { LeakForm } from '../leak-form'
import { updateLeak } from '../actions'

export const metadata: Metadata = { title: 'Edit Leak' }

export default async function EditLeakPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const leak = await prisma.animeLeak.findFirst({ where: { id, deletedAt: null } })
  if (!leak) notFound()

  const action = updateLeak.bind(null, leak.id)

  return (
    <div>
      <AdminPageHeader title="Edit Leak" subtitle={leak.title} icon={Zap} />
      <LeakForm
        action={action}
        initial={{
          title: leak.title,
          series: leak.series,
          summary: leak.summary ?? '',
          type: leak.type,
          leakStatus: leak.leakStatus,
          status: leak.status,
          sourceUrl: leak.sourceUrl ?? '',
          leakerName: leak.leakerName ?? '',
          heat: leak.heat,
        }}
      />
    </div>
  )
}
