'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  createSessionCookie,
  destroySessionCookie,
  isStaff,
  verifyPassword,
} from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  next: z.string().optional(),
})

export type LoginState = { error?: string }

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') ?? undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { email, password, next } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { role: true },
  })

  // Uniform error to avoid leaking which accounts exist.
  if (!user || !user.passwordHash) {
    return { error: 'Invalid email or password' }
  }
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    return { error: 'Invalid email or password' }
  }
  if (!isStaff(user.role.name)) {
    return { error: 'This account does not have CMS access' }
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role.name,
  })

  const dest = next && next.startsWith('/admin') ? next : '/admin'
  redirect(dest)
}

export async function logout() {
  await destroySessionCookie()
  redirect('/admin/login')
}
