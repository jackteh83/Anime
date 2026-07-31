import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ingestAllRss } from '@/lib/ingest/run'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Fetches all enabled RSS sources into the News table. Triggered by Vercel Cron
 * (see vercel.json) or any external scheduler. Secured by CRON_SECRET when set.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  try {
    const results = await ingestAllRss()
    const total = results.reduce((n, r) => n + r.inserted, 0)
    return NextResponse.json({ ok: true, inserted: total, results })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'failed' },
      { status: 500 },
    )
  }
}
