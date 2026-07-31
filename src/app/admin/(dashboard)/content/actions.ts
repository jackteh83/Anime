'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { uniqueSlug } from '@/lib/slug'
import { PUBLISH_STATUSES } from '@/lib/content'

const newsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  excerpt: z.string().max(300).optional().or(z.literal('')),
  body: z.string().optional().or(z.literal('')),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(PUBLISH_STATUSES),
  seoTitle: z.string().max(160).optional().or(z.literal('')),
  seoDesc: z.string().max(300).optional().or(z.literal('')),
  scheduledAt: z.string().optional().or(z.literal('')),
})

export type ContentFormState = { error?: string }

function parse(formData: FormData) {
  return newsSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt') ?? '',
    body: formData.get('body') ?? '',
    categoryId: formData.get('categoryId') ?? '',
    status: formData.get('status'),
    seoTitle: formData.get('seoTitle') ?? '',
    seoDesc: formData.get('seoDesc') ?? '',
    scheduledAt: formData.get('scheduledAt') ?? '',
  })
}

function scheduledAtFrom(value: string | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

// When an item becomes PUBLISHED, stamp publishedAt once.
function publishedAtFor(status: string, existing: Date | null): Date | null {
  if (status === 'PUBLISHED') return existing ?? new Date()
  return existing
}

export async function createNews(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const parsed = parse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const d = parsed.data

  await prisma.news.create({
    data: {
      title: d.title,
      slug: uniqueSlug(d.title),
      excerpt: d.excerpt || null,
      body: d.body || null,
      categoryId: d.categoryId || null,
      status: d.status,
      seoTitle: d.seoTitle || null,
      seoDesc: d.seoDesc || null,
      scheduledAt: scheduledAtFrom(d.scheduledAt),
      authorId: session.userId,
      publishedAt: publishedAtFor(d.status, null),
    },
  })

  revalidatePath('/admin/content')
  redirect('/admin/content')
}

export async function updateNews(
  id: string,
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const parsed = parse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const d = parsed.data

  const existing = await prisma.news.findUnique({
    where: { id },
    select: { publishedAt: true },
  })
  if (!existing) return { error: 'Article not found' }

  await prisma.news.update({
    where: { id },
    data: {
      title: d.title,
      excerpt: d.excerpt || null,
      body: d.body || null,
      categoryId: d.categoryId || null,
      status: d.status,
      seoTitle: d.seoTitle || null,
      seoDesc: d.seoDesc || null,
      scheduledAt: scheduledAtFrom(d.scheduledAt),
      publishedAt: publishedAtFor(d.status, existing.publishedAt),
    },
  })

  revalidatePath('/admin/content')
  revalidatePath(`/admin/content/${id}`)
  redirect('/admin/content')
}

/** Quick status transition from the list (Publish / Archive / etc.). */
export async function setNewsStatus(id: string, status: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!PUBLISH_STATUSES.includes(status as never)) return

  const existing = await prisma.news.findUnique({
    where: { id },
    select: { publishedAt: true },
  })
  if (!existing) return

  await prisma.news.update({
    where: { id },
    data: { status: status as never, publishedAt: publishedAtFor(status, existing.publishedAt) },
  })
  revalidatePath('/admin/content')
}

/** Soft delete (sets deletedAt; keeps the row for audit). */
export async function deleteNews(id: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  await prisma.news.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  })
  revalidatePath('/admin/content')
}
