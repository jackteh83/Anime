import type { Tone } from '@/components/ui'

/* ------------------------------- Episodes ------------------------------- */

export const upcomingEpisodes = [
  { title: 'Demon Slayer', sub: 'S4 Episode 8 — The Hashira Unite', when: 'Today, 11:00 PM', platform: 'Crunchyroll', tag: 'NOW', tone: 'primary' as Tone },
  { title: 'Jujutsu Kaisen', sub: 'S2 Episode 24 — Hidden Inventory 4', when: 'Today, 2:00 AM', platform: 'Crunchyroll', tag: 'UP NEXT', tone: 'purple' as Tone },
  { title: 'One Piece', sub: 'Episode 1116 — The Will of D.', when: 'Tomorrow, 6:00 PM', platform: 'Netflix', tag: 'UP NEXT', tone: 'orange' as Tone },
  { title: 'Kaiju No. 8', sub: 'Episode 12 — The Power of No. 8', when: 'Tomorrow, 11:00 PM', platform: 'Crunchyroll', tag: 'UP NEXT', tone: 'blue' as Tone },
]

export const currentlyAiring = [
  { title: 'My Hero Academia', sub: 'S7 Episode 15 — Tartarus', next: 'Episode 16 · 2 days left', rating: 9.1, tone: 'green' as Tone },
  { title: 'Black Clover', sub: 'Episode 171 — The Final Battle Begins', next: 'Episode 172 · 3 days left', rating: 8.7, tone: 'primary' as Tone },
  { title: 'Blue Lock', sub: 'Episode 24 — Awakening', next: 'Episode 25 · Tomorrow', rating: 8.9, tone: 'blue' as Tone },
  { title: 'Chainsaw Man', sub: 'Episode 12 — Katana vs Chainsaw', next: 'Episode 13 · 1 week left', rating: 8.8, tone: 'orange' as Tone },
  { title: 'Tokyo Revengers', sub: 'Episode 38 — A Cry Baby', next: 'Episode 39 · 5 days left', rating: 8.2, tone: 'purple' as Tone },
]

export const recentlyAired = [
  { title: 'One Piece', sub: 'Episode 1115', rating: 9.9, tone: 'primary' as Tone },
  { title: 'Jujutsu Kaisen', sub: 'Episode 23', rating: 9.8, tone: 'purple' as Tone },
  { title: 'Demon Slayer', sub: 'S4 Episode 7', rating: 9.7, tone: 'orange' as Tone },
  { title: 'Kaiju No. 8', sub: 'Episode 11', rating: 9.2, tone: 'blue' as Tone },
  { title: 'Wind Breaker', sub: 'Episode 8', rating: 9.2, tone: 'green' as Tone },
]

export const topRatedWeek = [
  { rank: 1, title: 'One Piece Episode 1114', rating: 9.8 },
  { rank: 2, title: 'Demon Slayer S4 Ep 6', rating: 9.7 },
  { rank: 3, title: 'Jujutsu Kaisen S2 Ep 22', rating: 9.6 },
  { rank: 4, title: 'Kaiju No. 8 Ep 10', rating: 9.5 },
  { rank: 5, title: 'Frieren Episode 25', rating: 9.4 },
]

/* --------------------------------- TCG ---------------------------------- */

export const tcgGames = [
  'One Piece', 'Pokémon', 'Union Arena', 'Yu-Gi-Oh!', 'Weiss Schwarz', 'Digimon', 'Dragon Ball Super',
]

export const metaDecks = [
  { rank: 1, name: 'Purple Luffy', leader: 'Monkey D. Luffy', winRate: 62.1, placements: 1243, tone: 'purple' as Tone },
  { rank: 2, name: 'Enel Control', leader: 'Enel', winRate: 59.7, placements: 989, tone: 'yellow' as Tone },
  { rank: 3, name: 'Zoro / Sanji', leader: 'Roronoa Zoro', winRate: 57.3, placements: 903, tone: 'green' as Tone },
  { rank: 4, name: 'Yellow Katakuri', leader: 'Charlotte Katakuri', winRate: 54.1, placements: 812, tone: 'orange' as Tone },
  { rank: 5, name: 'Law Control', leader: 'Trafalgar Law', winRate: 53.3, placements: 764, tone: 'blue' as Tone },
]

export const cardReveals = [
  { name: 'Monkey D. Luffy', set: 'OP-12', rarity: 'Leader Card', tone: 'primary' as Tone },
  { name: 'Sabo', set: 'OP-12', rarity: 'SR', tone: 'orange' as Tone },
  { name: 'Yamato', set: 'OP-12', rarity: 'SR', tone: 'blue' as Tone },
  { name: 'Boa Hancock', set: 'OP-12', rarity: 'SR', tone: 'pink' as Tone },
  { name: 'Charlotte Katakuri', set: 'OP-12', rarity: 'SR', tone: 'purple' as Tone },
]

export const trendingCards = [
  { rank: 1, name: 'Monkey D. Luffy', code: 'OP05-119', rarity: 'SEC', heat: '98.7K', tone: 'primary' as Tone },
  { rank: 2, name: 'Portgas D. Ace', code: 'OP02-013', rarity: 'SR', heat: '56.3K', tone: 'orange' as Tone },
  { rank: 3, name: 'Shanks', code: 'OP01-120', rarity: 'SEC', heat: '41.8K', tone: 'blue' as Tone },
  { rank: 4, name: 'Trafalgar Law', code: 'OP04-069', rarity: 'SR', heat: '38.6K', tone: 'green' as Tone },
  { rank: 5, name: 'Nami', code: 'OP03-040', rarity: 'SR', heat: '28.9K', tone: 'yellow' as Tone },
]

export const upcomingTournaments = [
  { date: 'MAY 24', name: 'One Piece Championship 2026', where: 'Regionals — Asia · Tokyo, Japan' },
  { date: 'MAY 30', name: 'Store Showdown', where: 'Local Tournament · Los Angeles, USA' },
  { date: 'JUN 07', name: 'One Piece Championship 2026', where: 'Regionals — Europe · Paris, France' },
  { date: 'JUN 14', name: 'Treasure Cup', where: 'Online Tournament · Online Event' },
]

/* -------------------------------- Trends -------------------------------- */

export const trendingTop10 = [
  { rank: 1, title: 'One Piece Chapter 1156', cat: 'Anime Leaks', score: '98.7K', change: 98.7, level: 'Extreme', tone: 'primary' as Tone },
  { rank: 2, title: 'Jujutsu Kaisen Chapter 260', cat: 'Anime Leaks', score: '56.3K', change: 56.3, level: 'Very High', tone: 'purple' as Tone },
  { rank: 3, title: 'Demon Slayer S4 Episode 6', cat: 'Episodes', score: '41.8K', change: 41.8, level: 'High', tone: 'orange' as Tone },
  { rank: 4, title: 'Kaiju No.8 Chapter 116', cat: 'Anime Leaks', score: '38.6K', change: 38.6, level: 'High', tone: 'blue' as Tone },
  { rank: 5, title: 'One Piece TCG OP-12', cat: 'TCG', score: '28.9K', change: 28.9, level: 'Medium', tone: 'green' as Tone },
  { rank: 6, title: 'Chainsaw Man Part 2', cat: 'Anime Leaks', score: '25.4K', change: 25.4, level: 'Medium', tone: 'primary' as Tone },
  { rank: 7, title: 'Bleach TYBW Part 4', cat: 'Episodes', score: '19.2K', change: 19.2, level: 'Medium', tone: 'cyan' as Tone },
  { rank: 8, title: 'Yu-Gi-Oh! TCG INFO', cat: 'TCG', score: '16.7K', change: 16.7, level: 'Low', tone: 'yellow' as Tone },
  { rank: 9, title: 'Boruto Two Blue Vortex', cat: 'Anime Leaks', score: '15.3K', change: 15.3, level: 'Low', tone: 'blue' as Tone },
  { rank: 10, title: 'My Hero Academia 430', cat: 'Episodes', score: '14.1K', change: 14.1, level: 'Low', tone: 'green' as Tone },
]

export const trendingKeywords = [
  'One Piece', 'Jujutsu Kaisen', 'Demon Slayer', 'Chapter 1156', 'Kaiju No.8',
  'Sukuna', 'Luffy', 'Gojo', 'Bleach', 'Boruto', 'OP-12', 'Spoiler', 'Yu-Gi-Oh',
]

export const trendByCategory = [
  { label: 'Anime Leaks', value: '6,532', change: 42.7, tone: 'primary' as Tone },
  { label: 'Episodes', value: '4,821', change: 28.3, tone: 'blue' as Tone },
  { label: 'TCG', value: '3,245', change: 31.6, tone: 'green' as Tone },
  { label: 'News', value: '2,104', change: 18.9, tone: 'orange' as Tone },
  { label: 'Rumors', value: '1,876', change: 15.4, tone: 'primary' as Tone },
]

/* --------------------------------- News --------------------------------- */

export const newsCategories = [
  { name: 'Anime', count: 1245 },
  { name: 'Manga', count: 486 },
  { name: 'Industry', count: 312 },
  { name: 'Movies', count: 189 },
  { name: 'Games', count: 276 },
  { name: 'Figures', count: 153 },
  { name: 'TCG', count: 342 },
  { name: 'Events', count: 98 },
  { name: 'Interviews', count: 67 },
]

export const breakingNews = [
  { time: '09:45', title: 'Kaiju No. 8 Season 2 Confirmed, Teaser PV Released', tag: 'Anime', tone: 'primary' as Tone },
  { time: '09:10', title: 'My Hero Academia Final Season New Visual & Air Date', tag: 'Anime', tone: 'purple' as Tone },
  { time: '08:30', title: 'Pokémon Horizons: Season 2 New Trailer Out', tag: 'Anime', tone: 'blue' as Tone },
  { time: '07:50', title: 'One Piece Chapter 1116 Official Release Date Announced', tag: 'Manga', tone: 'green' as Tone },
  { time: '07:20', title: 'Dragon Ball DAIMA Episode 18 Preview Images', tag: 'Anime', tone: 'orange' as Tone },
]
