'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import {
  getHomepageConfig,
  type HomepageSection,
} from '@/lib/homepage-config'

const MANAGER_ROLES = ['Super Admin', 'Administrator', 'Editor']

async function guard() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return MANAGER_ROLES.includes(session.role)
}

async function save(sections: HomepageSection[]) {
  await prisma.siteSetting.upsert({
    where: { key: 'homepage' },
    update: { value: { sections } },
    create: { key: 'homepage', value: { sections } },
  })
  revalidatePath('/admin/homepage')
  revalidatePath('/')
}

export async function toggleSection(key: string) {
  if (!(await guard())) return
  const layout = await getHomepageConfig()
  const next = layout.map((s) =>
    s.key === key ? { ...s, visible: !s.visible } : s,
  )
  await save(next)
}

export async function moveSection(key: string, dir: 'up' | 'down') {
  if (!(await guard())) return
  const layout = await getHomepageConfig()
  const i = layout.findIndex((s) => s.key === key)
  if (i === -1) return
  const j = dir === 'up' ? i - 1 : i + 1
  if (j < 0 || j >= layout.length) return
  const next = [...layout]
  ;[next[i], next[j]] = [next[j], next[i]]
  await save(next)
}

export async function resetHomepage() {
  if (!(await guard())) return
  await prisma.siteSetting.deleteMany({ where: { key: 'homepage' } })
  revalidatePath('/admin/homepage')
  revalidatePath('/')
}
