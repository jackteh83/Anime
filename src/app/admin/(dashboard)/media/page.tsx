import Image from 'next/image'
import type { Metadata } from 'next'
import { CheckCircle2, Image as ImageIcon, Trash2, XCircle } from 'lucide-react'
import { AdminPageHeader, StatCard } from '@/components/admin/admin-ui'
import { prisma } from '@/lib/db'
import { UploadForm } from './upload-form'
import { deleteMedia, toggleApproveMedia } from './actions'

export const metadata: Metadata = { title: 'Media Library' }

function fmtSize(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default async function MediaPage() {
  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN

  const [items, total, aiCount, pending] = await Promise.all([
    prisma.media.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
    prisma.media.count({ where: { deletedAt: null } }),
    prisma.media.count({ where: { deletedAt: null, aiGenerated: true } }),
    prisma.media.count({ where: { deletedAt: null, approved: false } }),
  ])

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        subtitle="Images · Videos · AI-generated · Uploads"
        icon={ImageIcon}
      />

      <div className="mb-4 grid grid-cols-3 gap-4">
        <StatCard label="Assets" value={total.toLocaleString()} tone="primary" icon={ImageIcon} />
        <StatCard label="AI Generated" value={aiCount.toLocaleString()} tone="purple" />
        <StatCard label="Pending Approval" value={pending.toLocaleString()} tone="orange" />
      </div>

      {!hasBlob && (
        <p className="mb-4 rounded-lg border border-orange/40 bg-orange/10 px-3 py-2 text-sm text-orange">
          Vercel Blob is not configured. Add <b>BLOB_READ_WRITE_TOKEN</b> (Storage
          → Blob) to enable uploads.
        </p>
      )}

      <div className="mb-4">
        <UploadForm disabled={!hasBlob} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-card border border-line bg-surface p-10 text-center text-sm text-muted">
          No media yet. Upload an image to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="relative aspect-square bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={m.url}
                  alt={m.alt ?? ''}
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
                {m.aiGenerated && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-purple/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    AI
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-semibold text-text">{m.alt}</p>
                <p className="text-[11px] text-faint">
                  {m.width && m.height ? `${m.width}×${m.height} · ` : ''}
                  {fmtSize(m.sizeBytes)}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <form action={toggleApproveMedia.bind(null, m.id)}>
                    <button
                      type="submit"
                      className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-bold ${
                        m.approved ? 'bg-green/15 text-green' : 'bg-surface-2 text-faint'
                      }`}
                    >
                      {m.approved ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {m.approved ? 'Approved' : 'Approve'}
                    </button>
                  </form>
                  <form action={deleteMedia.bind(null, m.id)}>
                    <button
                      type="submit"
                      className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-surface-2 hover:text-down"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
