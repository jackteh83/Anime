'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { put } from '@vercel/blob'
import sharp from 'sharp'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export type UploadState = { error?: string; ok?: string }

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function uploadMedia(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: 'Blob storage not configured — set BLOB_READ_WRITE_TOKEN.' }
  }

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Choose a file to upload.' }
  }
  if (!file.type.startsWith('image/')) {
    return { error: 'Only image uploads are supported here.' }
  }
  if (file.size > MAX_BYTES) {
    return { error: 'File is larger than 10 MB.' }
  }

  const alt = (formData.get('alt') as string) || file.name

  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    const meta = await sharp(bytes).metadata()
    const key = `media/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}`

    const blob = await put(key, bytes, {
      access: 'public',
      contentType: file.type,
    })

    await prisma.media.create({
      data: {
        url: blob.url,
        type: 'IMAGE',
        alt,
        width: meta.width ?? null,
        height: meta.height ?? null,
        sizeBytes: file.size,
        aiGenerated: false,
        approved: true, // manual uploads are trusted; AI images default to false
        uploaderId: session.userId,
      },
    })

    revalidatePath('/admin/media')
    return { ok: 'Uploaded.' }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Upload failed' }
  }
}

export async function toggleApproveMedia(id: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  const m = await prisma.media.findUnique({ where: { id }, select: { approved: true } })
  if (!m) return
  await prisma.media.update({ where: { id }, data: { approved: !m.approved } })
  revalidatePath('/admin/media')
}

export async function deleteMedia(id: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  await prisma.media.update({ where: { id }, data: { deletedAt: new Date() } })
  revalidatePath('/admin/media')
}
