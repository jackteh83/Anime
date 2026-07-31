import type { Metadata } from 'next'
import { Flame, Layers } from 'lucide-react'
import { SectionHero, SectionTabs } from '@/components/section-hero'
import { Pill, StatChange, Thumb, Widget } from '@/components/ui'
import {
  cardReveals,
  metaDecks,
  tcgGames,
  trendingCards,
  upcomingTournaments,
} from '@/lib/section-data'
import { marketWatch as seedMarket, tcgReleases } from '@/lib/homepage-data'
import { getTopCards, getMarketMovers, formatPrice } from '@/lib/tcg-data'

export const metadata: Metadata = {
  title: 'TCG Hub',
  description: 'Your ultimate destination for anime TCG news, cards, meta decks, and tournaments.',
}

// Rendered per-request: real card prices from the database.
export const dynamic = 'force-dynamic'

const tabs = [
  { label: 'Overview', href: '/tcg' },
  { label: 'New Releases', href: '/tcg?tab=new' },
  { label: 'Card Reveals', href: '/tcg/reveals' },
  { label: 'Meta Decks', href: '/tcg/decks' },
  { label: 'Market Watch', href: '/tcg/market' },
  { label: 'Tournaments', href: '/tcg/tournaments' },
]

export default async function TcgPage() {
  // Single source of truth: same real card data the homepage widgets read.
  const topCards = await getTopCards(6)
  const movers = await getMarketMovers(5)

  const trending =
    topCards.length > 0
      ? topCards.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          code: c.code,
          rarity: c.rarity || c.setName,
          heat: formatPrice(c.price),
          tone: c.tone,
        }))
      : trendingCards

  const market =
    movers.length > 0
      ? movers.map((c) => ({
          set: c.name,
          sub: c.setName || c.rarity,
          price: formatPrice(c.price),
          change: c.priceChange,
        }))
      : seedMarket

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      <SectionHero
        title="TCG Hub"
        subtitle="Your ultimate destination for anime TCG news, cards, meta decks, and tournaments."
        icon={Layers}
        stats={[
          { value: '24', label: 'New Cards Today' },
          { value: '15', label: 'Tournaments' },
          { value: '8.6K', label: 'Players Online' },
        ]}
      />
      <SectionTabs tabs={tabs} active="Overview" />

      {/* Game selector */}
      <div className="flex flex-wrap gap-2">
        {tcgGames.map((g, i) => (
          <span
            key={g}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              i === 0
                ? 'bg-primary-soft text-primary'
                : 'border border-line bg-surface text-muted'
            }`}
          >
            {g}
          </span>
        ))}
      </div>

      {/* New releases */}
      <Widget title="New Releases" viewAllHref="/tcg?tab=new">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tcgReleases.map((r) => (
            <div key={r.title} className="text-center">
              <Thumb tone={r.tone} label={r.title} className="mx-auto mb-2 h-36 w-full" />
              <p className="text-sm font-bold text-text">{r.title}</p>
              <p className="truncate text-xs text-muted">{r.sub}</p>
              <p className="text-[11px] text-faint">{r.date}</p>
            </div>
          ))}
        </div>
      </Widget>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Meta decks */}
        <Widget title="Top Meta Decks" className="lg:col-span-2" viewAllHref="/tcg/decks">
          <ul className="space-y-2">
            {metaDecks.map((d) => (
              <li key={d.rank} className="flex items-center gap-3 rounded-lg bg-surface-2 p-3">
                <span className="text-lg font-extrabold text-primary">
                  {String(d.rank).padStart(2, '0')}
                </span>
                <Thumb tone={d.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-text">{d.name}</p>
                  <p className="truncate text-xs text-muted">Leader: {d.leader}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-text">{d.winRate}%</p>
                  <p className="text-[11px] text-faint">{d.placements} top</p>
                </div>
              </li>
            ))}
          </ul>
        </Widget>

        {/* Market watch */}
        <Widget title="Market Watch" viewAllHref="/tcg/market">
          <table className="w-full text-sm">
            <tbody>
              {market.map((m) => (
                <tr key={m.set} className="border-b border-line last:border-0">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Thumb tone="primary" size="sm" className="h-8 w-8" />
                      <div>
                        <p className="text-sm font-semibold text-text">{m.set}</p>
                        <p className="text-[11px] text-faint">{m.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-text">{m.price}</td>
                  <td className="py-2.5 pl-2 text-right"><StatChange value={m.change} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Card reveals */}
        <Widget title="Latest Card Reveals" className="lg:col-span-2" viewAllHref="/tcg/reveals">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cardReveals.map((c) => (
              <div key={c.name} className="text-center">
                <Thumb tone={c.tone} label="Sample" className="mx-auto mb-2 h-36 w-full" />
                <p className="truncate text-sm font-bold text-text">{c.name}</p>
                <p className="text-[11px] text-faint">{c.set}</p>
                <Pill tone={c.tone} className="mt-1">{c.rarity}</Pill>
              </div>
            ))}
          </div>
        </Widget>

        {/* Trending cards */}
        <Widget title="Trending Cards" viewAllHref="/tcg">
          <ul className="space-y-3">
            {trending.map((c) => (
              <li key={c.rank} className="flex items-center gap-3">
                <span className="w-5 text-sm font-extrabold text-primary">
                  {String(c.rank).padStart(2, '0')}
                </span>
                <Thumb tone={c.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text">{c.name}</p>
                  <p className="text-[11px] text-faint">
                    {c.code} · {c.rarity}
                  </p>
                </div>
                <span className="heat-text flex items-center gap-1 text-xs">
                  <Flame className="h-3 w-3" />
                  {c.heat}
                </span>
              </li>
            ))}
          </ul>
        </Widget>
      </div>

      {/* Tournaments */}
      <Widget title="Upcoming Tournaments" viewAllHref="/tcg/tournaments">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingTournaments.map((t) => (
            <div key={t.name} className="flex gap-3 rounded-lg bg-surface-2 p-3">
              <div className="shrink-0 rounded-lg bg-primary-soft px-2 py-1 text-center">
                <p className="text-xs font-bold text-primary">{t.date}</p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{t.name}</p>
                <p className="truncate text-xs text-muted">{t.where}</p>
              </div>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  )
}
