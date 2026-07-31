import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { publishDueScheduled } from '@/lib/scheduler'

export const dynamic = 'force-dynamic'

/**
 * Publishes any scheduled content that is due. Triggered by Vercel Cron
 * (see vercel.json) or any external scheduler. When CRON_SECRET is set the
 * request must carry `Authorization: Bearer <CRON_SECRET>` — Vercel Cron sends
 * this automatically.
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
    const published = await publishDueScheduled()
    return NextResponse.json({ ok: true, published })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'failed' },
      { status: 500 },
    )
  }
}
