import type { Metadata } from 'next'
import { Tv } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'
import { ContentTypeTabs } from '@/components/admin/content-type-tabs'

export const metadata: Metadata = { title: 'Episodes' }

export default function EpisodesContentPage() {
  return (
    <div>
      <AdminPageHeader
        title="Episodes"
        subtitle="Airing schedule, countdowns and previews"
        icon={Tv}
      />
      <ContentTypeTabs active="episodes" />
      <ModulePlaceholder
        title="Episode Management"
        points={[
          'CRUD tied to an Anime parent (title, number, air date, platform)',
          'Airing status: upcoming, airing, released, delayed',
          'Countdown, preview images and PV/trailer links',
          'Reuses the News/Leaks list + form + publish workflow pattern',
        ]}
      />
    </div>
  )
}
