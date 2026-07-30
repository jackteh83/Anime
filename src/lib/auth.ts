import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export const SESSION_COOKIE = 'anisekai-session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export type SessionPayload = {
  userId: string
  email: string
  username: string
  role: string
}

function getKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

/** True when the app can sign/verify sessions (AUTH_SECRET is present). */
export function authConfigured(): boolean {
  return !!process.env.AUTH_SECRET
}

/* ------------------------------ passwords ------------------------------ */

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

/* ------------------------------- tokens -------------------------------- */

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getKey())
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/* ------------------------------- cookies ------------------------------- */

export async function createSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function destroySessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/** Reads and verifies the current session from cookies (Server Components/Actions). */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const store = await cookies()
    const token = store.get(SESSION_COOKIE)?.value
    if (!token) return null
    return await verifySession(token)
  } catch {
    // Never let a missing/invalid AUTH_SECRET or cookie crash a page render.
    return null
  }
}

export { STAFF_ROLES, isStaff } from './auth-roles'
