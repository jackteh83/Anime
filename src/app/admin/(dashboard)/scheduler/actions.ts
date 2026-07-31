'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { publishDueScheduled } from '@/lib/scheduler'

export async function publishDueNow() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!['Super Admin', 'Administrator', 'Editor'].includes(session.role)) return
  await publishDueScheduled()
  revalidatePath('/admin/scheduler')
  revalidatePath('/admin/content')
  revalidatePath('/news')
}
