import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16: this file was formerly `middleware.ts`. It runs on the nodejs
// runtime and is used only for a lightweight optimistic check — the real JWT
// verification + role check happens in src/app/admin/layout.tsx.
const SESSION_COOKIE = 'anisekai-session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/admin/login'
  const hasSession = request.cookies.has(SESSION_COOKIE)

  // Gate the CMS: no cookie -> send to login (preserve intended destination).
  // The login page is always reachable; redirecting authed users away from it
  // is handled in the login page itself to avoid loops on stale cookies.
  if (!isLogin && !hasSession) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
