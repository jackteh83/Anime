import 'server-only'
import { prisma } from '@/lib/db'
import type { Tone } from '@/components/ui'

/**
 * Single source of truth for TCG cards. The homepage "Top Hot Cards" widget and
 * the /tcg page's Trending / Market widgets all read from here, so the
 * dashboard preview is the first N rows of the same real card data — real
 * TCGplayer / Cardmarket prices, never AI-fabricated.
 */
export type CardRow = {
  name: string
  code: string
  rarity: string
  setName: string
  imageUrl: string | null
  price: number | null
  priceChange: number
  tone: Tone
}

const TONES: Tone[] = ['blue', 'pink', 'orange', 'purple', 'green', 'cyan', 'yellow']

function toneFor(i: number): Tone {
  return TONES[i % TONES.length]
}

export function formatPrice(p: number | null): string {
  if (p == null) return '—'
  return `$${p.toFixed(2)}`
}

/** Most valuable cards first (real market price desc). */
export async function getTopCards(take = 5): Promise<CardRow[]> {
  try {
    const rows = await prisma.card.findMany({
      where: { deletedAt: null, marketPrice: { not: null } },
      orderBy: { marketPrice: 'desc' },
      take,
    })
    return rows.map((c, i) => ({
      name: c.name,
      code: c.code,
      rarity: c.rarity ?? '',
      setName: c.setName ?? '',
      imageUrl: c.imageUrl,
      price: c.marketPrice != null ? Number(c.marketPrice) : null,
      priceChange: c.priceChange ?? 0,
      tone: toneFor(i),
    }))
  } catch {
    return []
  }
}

/** Biggest recent price movers (largest absolute change first). */
export async function getMarketMovers(take = 4): Promise<CardRow[]> {
  try {
    const rows = await prisma.card.findMany({
      where: { deletedAt: null, marketPrice: { not: null } },
      orderBy: { priceChange: 'desc' },
      take,
    })
    return rows.map((c, i) => ({
      name: c.name,
      code: c.code,
      rarity: c.rarity ?? '',
      setName: c.setName ?? '',
      imageUrl: c.imageUrl,
      price: c.marketPrice != null ? Number(c.marketPrice) : null,
      priceChange: c.priceChange ?? 0,
      tone: toneFor(i),
    }))
  } catch {
    return []
  }
}
