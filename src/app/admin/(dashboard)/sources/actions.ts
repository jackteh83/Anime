'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { ingestAllRss } from '@/lib/ingest/run'

async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export type FetchState = {
  ok?: boolean
  error?: string
  inserted?: number
  detail?: { source: string; inserted: number; error?: string }[]
}

/** Manually run the RSS collector now (mirrors the daily cron). */
export async function fetchNowAction(
  _prev: FetchState,
  _formData: FormData,
): Promise<FetchState> {
  await requireSession()
  try {
    const results = await ingestAllRss()
    const inserted = results.reduce((n, r) => n + r.inserted, 0)
    revalidatePath('/admin/sources')
    revalidatePath('/news')
    revalidatePath('/')
    return { ok: true, inserted, detail: results }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Fetch failed' }
  }
}

const addSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  url: z.string().url('Enter a valid feed URL'),
})

export async function addSourceAction(formData: FormData) {
  await requireSession()
  const parsed = addSchema.safeParse({
    name: formData.get('name'),
    url: formData.get('url'),
  })
  if (!parsed.success) return
  const existing = await prisma.rssSource.findFirst({
    where: { url: parsed.data.url },
  })
  if (!existing) {
    await prisma.rssSource.create({
      data: {
        name: parsed.data.name,
        url: parsed.data.url,
        type: 'RSS',
        enabled: true,
        category: 'NEWS',
      },
    })
  }
  revalidatePath('/admin/sources')
}

export async function toggleSourceAction(id: string, enabled: boolean) {
  await requireSession()
  await prisma.rssSource.update({ where: { id }, data: { enabled } })
  revalidatePath('/admin/sources')
}

export async function deleteSourceAction(id: string) {
  await requireSession()
  await prisma.rssSource.delete({ where: { id } })
  revalidatePath('/admin/sources')
}
