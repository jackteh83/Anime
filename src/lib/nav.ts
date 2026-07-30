/**
 * Primary site navigation. Mirrors the approved header design.
 * `children` render as a dropdown on desktop.
 */
export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string; desc?: string }[]
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Anime Leaks',
    href: '/leaks',
    children: [
      { label: 'All Leaks', href: '/leaks' },
      { label: 'Manga Leaks', href: '/leaks?type=manga' },
      { label: 'Raws', href: '/leaks?type=raws' },
      { label: 'Spoilers', href: '/leaks?type=spoilers' },
      { label: 'Leak Timeline', href: '/leaks/timeline' },
    ],
  },
  {
    label: 'Episodes',
    href: '/episodes',
    children: [
      { label: 'Airing Today', href: '/episodes?tab=today' },
      { label: 'Weekly Schedule', href: '/episodes/schedule' },
      { label: 'Upcoming', href: '/episodes?tab=upcoming' },
      { label: 'Recently Aired', href: '/episodes?tab=recent' },
    ],
  },
  {
    label: 'TCG Hub',
    href: '/tcg',
    children: [
      { label: 'New Releases', href: '/tcg?tab=new' },
      { label: 'Card Reveals', href: '/tcg/reveals' },
      { label: 'Meta Decks', href: '/tcg/decks' },
      { label: 'Market Watch', href: '/tcg/market' },
      { label: 'Tournaments', href: '/tcg/tournaments' },
    ],
  },
  {
    label: 'Community',
    href: '/community',
    children: [
      { label: 'Discussions', href: '/community/discussions' },
      { label: 'Polls & Surveys', href: '/community/polls' },
      { label: 'Fan Clubs', href: '/community/clubs' },
      { label: 'Events', href: '/community/events' },
    ],
  },
  { label: 'News', href: '/news' },
  { label: 'Trends', href: '/trends' },
]

export const footerNav = {
  Explore: [
    { label: 'Anime Leaks', href: '/leaks' },
    { label: 'Episodes', href: '/episodes' },
    { label: 'TCG Hub', href: '/tcg' },
    { label: 'News', href: '/news' },
    { label: 'Trends', href: '/trends' },
  ],
  Community: [
    { label: 'Discussions', href: '/community/discussions' },
    { label: 'Polls & Surveys', href: '/community/polls' },
    { label: 'Fan Clubs', href: '/community/clubs' },
    { label: 'Events', href: '/community/events' },
    { label: 'Leaderboards', href: '/community/leaderboards' },
  ],
  Resources: [
    { label: 'Release Calendar', href: '/episodes/schedule' },
    { label: 'Leak Timeline', href: '/leaks/timeline' },
    { label: 'TCG Market', href: '/tcg/market' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Help Center', href: '/help' },
  ],
  About: [
    { label: 'About Anisekai', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'DMCA Policy', href: '/dmca' },
  ],
}
