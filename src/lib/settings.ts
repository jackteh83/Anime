import 'server-only'
import { prisma } from '@/lib/db'

/** Setting groups stored as one JSON row per key in SiteSetting. */
export type GeneralSettings = {
  siteName: string
  tagline: string
  siteUrl: string
  contactEmail: string
}

export type LocalizationSettings = {
  defaultLanguage: string // 'en'
  zhToggle: boolean
  timezone: string
}

export type AdsSettings = {
  heroBanner: boolean
  sidebar: boolean
  betweenWidgets: boolean
  articlePages: boolean
  footer: boolean
}

export const SETTING_DEFAULTS = {
  general: {
    siteName: 'Anisekai',
    tagline: 'AI-powered Anime & TCG intelligence',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    contactEmail: '',
  } satisfies GeneralSettings,
  localization: {
    defaultLanguage: 'en',
    zhToggle: true,
    timezone: 'UTC',
  } satisfies LocalizationSettings,
  ads: {
    heroBanner: false,
    sidebar: false,
    betweenWidgets: false,
    articlePages: false,
    footer: false,
  } satisfies AdsSettings,
}

export type SettingKey = keyof typeof SETTING_DEFAULTS

/** Read a setting group merged over its defaults (falls back on any DB error). */
export async function getSettings<K extends SettingKey>(
  key: K,
): Promise<(typeof SETTING_DEFAULTS)[K]> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } })
    return { ...SETTING_DEFAULTS[key], ...((row?.value as object) ?? {}) }
  } catch {
    return SETTING_DEFAULTS[key]
  }
}
