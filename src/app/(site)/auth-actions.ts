'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import {
  createSessionCookie,
  destroySessionCookie,
  hashPassword,
  verifyPassword,
} from '@/lib/auth'

export type AuthState = { error?: string }

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be 3-20 characters')
    .max(20, 'Username must be 3-20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Use letters, numbers, and underscores only'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export async function registerMember(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const { username, email, password } = parsed.data
  const emailLc = email.toLowerCase()

  const memberRole = await prisma.role.findUnique({ where: { name: 'Member' } })
  if (!memberRole) {
    return { error: 'Member role missing — run the database seed first.' }
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: emailLc }, { username }] },
    select: { id: true },
  })
  if (existing) {
    return { error: 'That email or username is already taken.' }
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email: emailLc,
      username,
      passwordHash,
      // Email verification hooks in later; auto-verify for now.
      emailVerified: new Date(),
      roleId: memberRole.id,
      profile: { create: {} },
    },
  })

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: 'Member',
  })
  redirect('/library')
}

export async function loginMember(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { role: true },
  })
  if (!user || !user.passwordHash) {
    return { error: 'Invalid email or password' }
  }
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    return { error: 'Invalid email or password' }
  }

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role.name,
  })
  redirect('/library')
}

export async function logoutMember() {
  await destroySessionCookie()
  redirect('/')
}
