import type { Tone } from '@/components/ui'

/** Publish statuses shared across all content types. */
export const PUBLISH_STATUSES = [
  'DRAFT',
  'PENDING_REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const

export type PublishStatusValue = (typeof PUBLISH_STATUSES)[number]

export const statusMeta: Record<
  PublishStatusValue,
  { label: string; tone: Tone }
> = {
  DRAFT: { label: 'Draft', tone: 'muted' },
  PENDING_REVIEW: { label: 'Pending Review', tone: 'orange' },
  SCHEDULED: { label: 'Scheduled', tone: 'blue' },
  PUBLISHED: { label: 'Published', tone: 'green' },
  ARCHIVED: { label: 'Archived', tone: 'muted' },
}

export function statusLabel(s: string): string {
  return statusMeta[s as PublishStatusValue]?.label ?? s
}
