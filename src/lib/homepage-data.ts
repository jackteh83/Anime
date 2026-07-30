/**
 * Placeholder homepage data mirroring the approved dashboard mockup.
 * In later phases this is replaced by CMS / DB queries; the widget components
 * consume these shapes so the swap is drop-in.
 */
import type { Tone } from '@/components/ui'

export const todaysTrend = [
  { rank: 1, title: 'One Piece Chapter 1156', tag: 'Leak', tone: 'primary' as Tone, heat: '98.7K' },
  { rank: 2, title: 'Jujutsu Kaisen Ep 24', tag: 'Preview', tone: 'blue' as Tone, heat: '56.3K' },
  { rank: 3, title: 'Kaiju No.8 Ep 13', tag: 'Preview', tone: 'blue' as Tone, heat: '41.8K' },
  { rank: 4, title: 'One Piece TCG OP09', tag: 'New Cards', tone: 'green' as Tone, heat: '38.6K' },
  { rank: 5, title: 'Dragon Ball Super', tag: 'Rumor', tone: 'purple' as Tone, heat: '28.9K' },
]

export const heroPreviews = [
  { title: 'Jujutsu Kaisen', sub: 'Episode 24 Preview', badge: 'PV Released', tone: 'blue' as Tone },
  { title: 'Demon Slayer', sub: 'Infinity Castle Arc', badge: 'New Visual', tone: 'primary' as Tone },
  { title: 'Kaiju No.8', sub: 'Episode 13 Preview', badge: 'Countdown', tone: 'orange' as Tone },
]

export const leakTimeline = [
  { day: 'MON', label: 'Spoiler', status: 'completed' as const },
  { day: 'TUE', label: 'Raw Scans', status: 'completed' as const },
  { day: 'WED', label: 'Summary', status: 'in-progress' as const },
  { day: 'THU', label: 'Official Preview', status: 'next' as const },
  { day: 'FRI', label: 'Official Release', status: 'upcoming' as const },
]

export const episodeHubList = [
  { title: 'Jujutsu Kaisen Season 2', sub: 'Episode 24', left: '2 days left', tone: 'purple' as Tone },
  { title: 'Demon Slayer', sub: 'Infinity Castle Arc Ep 1', left: '5 days left', tone: 'primary' as Tone },
  { title: 'Kaiju No.8 Season 2', sub: 'Episode 13', left: '3 days left', tone: 'orange' as Tone },
]

export const tcgReleases = [
  { title: 'OP-12', sub: 'Legacy of Will', date: 'Jul 25, 2026', tone: 'primary' as Tone },
  { title: 'Pokémon TCG', sub: 'Destined Rivals', date: 'Jul 18, 2026', tone: 'yellow' as Tone },
  { title: 'Union Arena', sub: 'Vol.6', date: 'Jul 11, 2026', tone: 'green' as Tone },
  { title: 'Weiss Schwarz', sub: 'Re:Zero Vol.3', date: 'Jul 04, 2026', tone: 'blue' as Tone },
  { title: 'Yu-Gi-Oh!', sub: 'Burst of Destiny', date: 'Jun 28, 2026', tone: 'purple' as Tone },
]

export const marketWatch = [
  { set: 'One Piece OP09', sub: 'Emperors in the New World', price: '$98.45', change: 12.4 },
  { set: 'Pokémon TCG', sub: 'Destined Rivals', price: '$64.32', change: 8.7 },
  { set: 'One Piece OP08', sub: 'Two Legends', price: '$72.10', change: -3.6 },
  { set: 'Yu-Gi-Oh! INFO', sub: 'The Infinite Forbidden', price: '$39.21', change: 5.1 },
]

export const topMeta = [
  { rank: 1, name: 'Purple Luffy', winRate: 62.1, tone: 'purple' as Tone },
  { rank: 2, name: 'Enel', winRate: 59.7, tone: 'yellow' as Tone },
  { rank: 3, name: 'Zoro / Sanji', winRate: 57.3, tone: 'green' as Tone },
]

export const communityPredictions = [
  { q: 'Who will die in Egghead Arc?', votes: '12.4K votes' },
  { q: 'Will Sabo return in Chapter 1156?', votes: '8.7K votes' },
  { q: 'Who will get the next Bounty Buff?', votes: '9.1K votes' },
]

export const leakerAccuracy = [
  { name: 'Leaker A', pct: 98 },
  { name: 'Leaker B', pct: 93 },
  { name: 'Leaker C', pct: 87 },
  { name: 'Leaker D', pct: 78 },
]

export const latestNews = [
  { title: 'Dandadan Season 2 New Trailer Released', cat: 'Anime News', tone: 'primary' as Tone, ago: '2h ago' },
  { title: 'Pokémon TCG Destined Rivals Full Card List', cat: 'TCG News', tone: 'green' as Tone, ago: '4h ago' },
  { title: 'Bleach TYBW Part 4 Episode Titles Leaked', cat: 'Leaks', tone: 'purple' as Tone, ago: '1h ago' },
  { title: 'Dragon Ball Super New Movie Rumor', cat: 'Rumor', tone: 'orange' as Tone, ago: '6h ago' },
]

export const topHotCards = [
  { name: 'God Slayer Karten', rank: '#4821', change: 2.4, tone: 'blue' as Tone },
  { name: 'Neon Verse', rank: '#3482', change: 1.7, tone: 'pink' as Tone },
  { name: 'Asta Reborn OCR', rank: '#2913', change: -0.8, tone: 'orange' as Tone },
  { name: 'Mystic Warriors', rank: '#1923', change: 3.1, tone: 'purple' as Tone },
  { name: 'Eternal Champions', rank: '#1209', change: 0.6, tone: 'green' as Tone },
]
