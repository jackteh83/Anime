import 'server-only'
import { prisma } from '@/lib/db'

/**
 * Publish all News whose scheduled time has arrived. Used by both the manual
 * "Publish due now" button and the /api/cron/publish endpoint.
 */
export async function publishDueScheduled(): Promise<number> {
  const now = new Date()
  const res = await prisma.news.updateMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { not: null, lte: now },
      deletedAt: null,
    },
    data: { status: 'PUBLISHED', publishedAt: now },
  })
  return res.count
}
