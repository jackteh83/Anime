import type { Metadata } from 'next'
import { Image as ImageIcon } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'Media Library' }

export default function MediaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        subtitle="Images · Videos · AI-generated · Uploads"
        icon={ImageIcon}
      />
      <ModulePlaceholder
        title="Media Library"
        points={[
          'Upload to Vercel Blob, folder management, tags',
          'Search, replace, delete assets',
          'AI-generated images land here and require approval',
          'sharp-based thumbnails and aspect-ratio tools',
        ]}
      />
    </div>
  )
}
