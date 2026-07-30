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

/* --------------------------- Anime Leaks --------------------------- */

export const LEAK_TYPES = [
  'MANGA',
  'ANIME',
  'RAWS',
  'SPOILERS',
  'CONFIRMED',
  'SUMMARY',
] as const
export type LeakTypeValue = (typeof LEAK_TYPES)[number]

export const leakTypeMeta: Record<LeakTypeValue, { label: string; tone: Tone }> = {
  MANGA: { label: 'Manga Leak', tone: 'green' },
  ANIME: { label: 'Anime Leak', tone: 'orange' },
  RAWS: { label: 'Raws', tone: 'blue' },
  SPOILERS: { label: 'Spoilers', tone: 'purple' },
  CONFIRMED: { label: 'Confirmed', tone: 'cyan' },
  SUMMARY: { label: 'Summary', tone: 'pink' },
}

export const LEAK_STATUSES = ['RUMORED', 'EARLY', 'CONFIRMED', 'RELEASED'] as const
export type LeakStatusValue = (typeof LEAK_STATUSES)[number]

export const leakStatusMeta: Record<LeakStatusValue, { label: string; tone: Tone }> = {
  RUMORED: { label: 'Rumored', tone: 'muted' },
  EARLY: { label: 'Early', tone: 'orange' },
  CONFIRMED: { label: 'Confirmed', tone: 'blue' },
  RELEASED: { label: 'Released', tone: 'green' },
}

/* ------------------------- content type nav ------------------------ */

export const CONTENT_TYPES = [
  { key: 'news', label: 'News', href: '/admin/content' },
  { key: 'leaks', label: 'Anime Leaks', href: '/admin/content/leaks' },
  { key: 'episodes', label: 'Episodes', href: '/admin/content/episodes' },
  { key: 'tcg', label: 'TCG', href: '/admin/content/tcg' },
  { key: 'trends', label: 'Trends', href: '/admin/content/trends' },
] as const

export type ContentTypeKey = (typeof CONTENT_TYPES)[number]['key']
