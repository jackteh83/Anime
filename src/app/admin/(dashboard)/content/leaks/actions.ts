'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { uniqueSlug } from '@/lib/slug'
import { LEAK_STATUSES, LEAK_TYPES, PUBLISH_STATUSES } from '@/lib/content'

const leakSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  series: z.string().min(1, 'Series is required'),
  summary: z.string().max(2000).optional().or(z.literal('')),
  type: z.enum(LEAK_TYPES),
  leakStatus: z.enum(LEAK_STATUSES),
  status: z.enum(PUBLISH_STATUSES),
  sourceUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  leakerName: z.string().max(80).optional().or(z.literal('')),
  heat: z.coerce.number().int().min(0).max(1_000_000).optional(),
})

export type LeakFormState = { error?: string }

function parse(formData: FormData) {
  return leakSchema.safeParse({
    title: formData.get('title'),
    series: formData.get('series'),
    summary: formData.get('summary') ?? '',
    type: formData.get('type'),
    leakStatus: formData.get('leakStatus'),
    status: formData.get('status'),
    sourceUrl: formData.get('sourceUrl') ?? '',
    leakerName: formData.get('leakerName') ?? '',
    heat: formData.get('heat') ?? 0,
  })
}

function publishedAtFor(status: string, existing: Date | null): Date | null {
  if (status === 'PUBLISHED') return existing ?? new Date()
  return existing
}

export async function createLeak(
  _prev: LeakFormState,
  formData: FormData,
): Promise<LeakFormState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const parsed = parse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const d = parsed.data

  await prisma.animeLeak.create({
    data: {
      title: d.title,
      slug: uniqueSlug(d.title),
      series: d.series,
      summary: d.summary || null,
      type: d.type,
      leakStatus: d.leakStatus,
      status: d.status,
      sourceUrl: d.sourceUrl || null,
      leakerName: d.leakerName || null,
      heat: d.heat ?? 0,
      publishedAt: publishedAtFor(d.status, null),
    },
  })

  revalidatePath('/admin/content/leaks')
  redirect('/admin/content/leaks')
}

export async function updateLeak(
  id: string,
  _prev: LeakFormState,
  formData: FormData,
): Promise<LeakFormState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const parsed = parse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const d = parsed.data

  const existing = await prisma.animeLeak.findUnique({
    where: { id },
    select: { publishedAt: true },
  })
  if (!existing) return { error: 'Leak not found' }

  await prisma.animeLeak.update({
    where: { id },
    data: {
      title: d.title,
      series: d.series,
      summary: d.summary || null,
      type: d.type,
      leakStatus: d.leakStatus,
      status: d.status,
      sourceUrl: d.sourceUrl || null,
      leakerName: d.leakerName || null,
      heat: d.heat ?? 0,
      publishedAt: publishedAtFor(d.status, existing.publishedAt),
    },
  })

  revalidatePath('/admin/content/leaks')
  revalidatePath(`/admin/content/leaks/${id}`)
  redirect('/admin/content/leaks')
}

export async function setLeakStatus(id: string, status: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!PUBLISH_STATUSES.includes(status as never)) return

  const existing = await prisma.animeLeak.findUnique({
    where: { id },
    select: { publishedAt: true },
  })
  if (!existing) return

  await prisma.animeLeak.update({
    where: { id },
    data: {
      status: status as never,
      publishedAt: publishedAtFor(status, existing.publishedAt),
    },
  })
  revalidatePath('/admin/content/leaks')
}

export async function deleteLeak(id: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  await prisma.animeLeak.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'ARCHIVED' },
  })
  revalidatePath('/admin/content/leaks')
}
