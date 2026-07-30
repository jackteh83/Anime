import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { prisma } from '@/lib/db'
import { NewsForm } from '../news-form'
import { createNews } from '../actions'

export const metadata: Metadata = { title: 'New Article' }

export default async function NewContentPage() {
  const categories = await prisma.category.findMany({
    where: { type: 'NEWS' },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div>
      <AdminPageHeader
        title="New Article"
        subtitle="Create a news article"
        icon={FileText}
      />
      <NewsForm action={createNews} categories={categories} />
    </div>
  )
}
