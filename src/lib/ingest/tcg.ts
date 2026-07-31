import 'server-only'

/**
 * Pokémon TCG card + market-price adapter. Data comes from the free, public
 * pokemontcg.io API (https://pokemontcg.io) — real card metadata and real
 * TCGplayer / Cardmarket prices, no AI fabrication. An API key is optional
 * (higher rate limits); set POKEMONTCG_API_KEY in Vercel to use one.
 */
export type CardItem = {
  code: string
  name: string
  rarity: string | null
  setName: string | null
  imageUrl: string | null
  marketPrice: number | null
  releaseDate: Date | null
}

const API = 'https://api.pokemontcg.io/v2/cards'

type RawPrices = Record<string, { market?: number | null } | undefined>

/** Pick the first available TCGplayer market price, else Cardmarket average. */
function extractPrice(card: {
  tcgplayer?: { prices?: RawPrices }
  cardmarket?: { prices?: { averageSellPrice?: number | null } }
}): number | null {
  const tp = card.tcgplayer?.prices
  if (tp) {
    for (const variant of Object.values(tp)) {
      const m = variant?.market
      if (typeof m === 'number' && m > 0) return m
    }
  }
  const cm = card.cardmarket?.prices?.averageSellPrice
  return typeof cm === 'number' && cm > 0 ? cm : null
}

function toDate(s: string | undefined): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Fetch the most recently released cards, normalized. Throws on network / HTTP
 * error so the caller can isolate the failure.
 */
export async function fetchPokemonCards(pageSize = 50): Promise<CardItem[]> {
  const params = new URLSearchParams({
    orderBy: '-set.releaseDate',
    pageSize: String(pageSize),
    select: 'id,name,number,rarity,set,images,tcgplayer,cardmarket',
  })
  const headers: Record<string, string> = {
    accept: 'application/json',
    'user-agent': 'AnisekaiBot/1.0 (+https://anisekai.app)',
  }
  const key = process.env.POKEMONTCG_API_KEY
  if (key) headers['X-Api-Key'] = key

  const res = await fetch(`${API}?${params.toString()}`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = (await res.json()) as {
    data?: Array<{
      id: string
      name: string
      rarity?: string
      set?: { name?: string; releaseDate?: string }
      images?: { small?: string; large?: string }
      tcgplayer?: { prices?: RawPrices }
      cardmarket?: { prices?: { averageSellPrice?: number | null } }
    }>
  }

  return (json.data ?? [])
    .map((c) => ({
      code: c.id,
      name: c.name,
      rarity: c.rarity ?? null,
      setName: c.set?.name ?? null,
      imageUrl: c.images?.small ?? c.images?.large ?? null,
      marketPrice: extractPrice(c),
      releaseDate: toDate(c.set?.releaseDate),
    }))
    .filter((c) => c.code && c.name)
}
