'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

const MANAGER_ROLES = ['Super Admin', 'Administrator']

async function requireManager() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!MANAGER_ROLES.includes(session.role)) {
    return { session, allowed: false as const }
  }
  return { session, allowed: true as const }
}

/** Change a user's role. Only Super Admin / Administrator, never your own. */
export async function setUserRole(userId: string, roleId: string) {
  const { session, allowed } = await requireManager()
  if (!allowed) return
  if (userId === session.userId) return // can't change your own role

  const role = await prisma.role.findUnique({ where: { id: roleId } })
  if (!role) return

  await prisma.user.update({ where: { id: userId }, data: { roleId } })
  revalidatePath('/admin/users')
}

/** Soft-delete (deactivate) a member. Never yourself. */
export async function deactivateUser(userId: string) {
  const { session, allowed } = await requireManager()
  if (!allowed) return
  if (userId === session.userId) return

  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  })
  revalidatePath('/admin/users')
}

/** Restore a deactivated member. */
export async function restoreUser(userId: string) {
  const { allowed } = await requireManager()
  if (!allowed) return
  await prisma.user.update({ where: { id: userId }, data: { deletedAt: null } })
  revalidatePath('/admin/users')
}
