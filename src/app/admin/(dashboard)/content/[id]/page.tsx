import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { prisma } from '@/lib/db'
import { NewsForm } from '../news-form'
import { updateNews } from '../actions'

export const metadata: Metadata = { title: 'Edit Article' }

export default async function EditContentPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const [article, categories] = await Promise.all([
    prisma.news.findFirst({ where: { id, deletedAt: null } }),
    prisma.category.findMany({
      where: { type: 'NEWS' },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  if (!article) notFound()

  // Bind the id so the form's action matches the (prev, formData) signature.
  const action = updateNews.bind(null, article.id)

  return (
    <div>
      <AdminPageHeader
        title="Edit Article"
        subtitle={article.title}
        icon={FileText}
      />
      <NewsForm
        action={action}
        categories={categories}
        initial={{
          title: article.title,
          excerpt: article.excerpt ?? '',
          body: article.body ?? '',
          categoryId: article.categoryId ?? '',
          status: article.status,
          seoTitle: article.seoTitle ?? '',
          seoDesc: article.seoDesc ?? '',
          scheduledAt: article.scheduledAt
            ? new Date(article.scheduledAt).toISOString().slice(0, 16)
            : '',
        }}
      />
    </div>
  )
}
