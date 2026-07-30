import type { Metadata } from 'next'
import { Layers } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'
import { ContentTypeTabs } from '@/components/admin/content-type-tabs'

export const metadata: Metadata = { title: 'TCG' }

export default function TcgContentPage() {
  return (
    <div>
      <AdminPageHeader
        title="TCG"
        subtitle="Games, cards, decks and market data"
        icon={Layers}
      />
      <ContentTypeTabs active="tcg" />
      <ModulePlaceholder
        title="TCG Management"
        points={[
          'Manage TCG games, cards (code, rarity, market price), and meta decks',
          'Card reveals and new-release calendar',
          'Market watch prices and price movers',
          'Reuses the shared list + form + publish workflow pattern',
        ]}
      />
    </div>
  )
}
