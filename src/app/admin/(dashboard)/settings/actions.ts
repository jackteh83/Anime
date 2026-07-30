'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { SETTING_DEFAULTS, type SettingKey } from '@/lib/settings'

const MANAGER_ROLES = ['Super Admin', 'Administrator']

export type SettingsState = { ok?: string; error?: string }

async function upsert(key: SettingKey, value: Prisma.InputJsonObject) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
  revalidatePath('/admin/settings')
}

export async function saveGeneral(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!MANAGER_ROLES.includes(session.role)) return { error: 'Not permitted' }

  const value = {
    siteName: (formData.get('siteName') as string)?.trim() || SETTING_DEFAULTS.general.siteName,
    tagline: (formData.get('tagline') as string)?.trim() ?? '',
    siteUrl: (formData.get('siteUrl') as string)?.trim() ?? '',
    contactEmail: (formData.get('contactEmail') as string)?.trim() ?? '',
  }
  try {
    await upsert('general', value)
    return { ok: 'General settings saved.' }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Save failed' }
  }
}

export async function saveLocalization(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!MANAGER_ROLES.includes(session.role)) return { error: 'Not permitted' }

  const value = {
    defaultLanguage: (formData.get('defaultLanguage') as string) || 'en',
    zhToggle: formData.get('zhToggle') === 'on',
    timezone: (formData.get('timezone') as string) || 'UTC',
  }
  try {
    await upsert('localization', value)
    return { ok: 'Localization settings saved.' }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Save failed' }
  }
}

export async function saveAds(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!MANAGER_ROLES.includes(session.role)) return { error: 'Not permitted' }

  const value = {
    heroBanner: formData.get('heroBanner') === 'on',
    sidebar: formData.get('sidebar') === 'on',
    betweenWidgets: formData.get('betweenWidgets') === 'on',
    articlePages: formData.get('articlePages') === 'on',
    footer: formData.get('footer') === 'on',
  }
  try {
    await upsert('ads', value)
    return { ok: 'Ad settings saved.' }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Save failed' }
  }
}
