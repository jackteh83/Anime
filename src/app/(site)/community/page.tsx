import type { Metadata } from 'next'
import { Award, Eye, Heart, MessageCircle, MessageSquare, Users } from 'lucide-react'
import { SectionHero } from '@/components/section-hero'
import { Pill, Thumb, Widget } from '@/components/ui'
import {
  communityAchievements,
  communityCategories,
  communityEvents,
  communityPoll,
  featuredFanContent,
  hotDiscussions,
  onlineMembers,
  popularTags,
} from '@/lib/section-data'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Connect. Discuss. Share your passion. Join the anime & TCG community.',
}

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
      <SectionHero
        title="Community"
        subtitle="Connect. Discuss. Share your passion. Join the world's most active anime & TCG community!"
        icon={Users}
        stats={[
          { value: '128K', label: 'Members' },
          { value: '3.2K', label: 'Online Now' },
          { value: '48.7K', label: 'Posts Today' },
          { value: '1.2M', label: 'Total Discussions' },
        ]}
      />

      {/* Category cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {communityCategories.map((c) => (
          <div key={c.name} className="rounded-card border border-line bg-surface p-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <p className="mt-2 font-bold text-text">{c.name}</p>
            <p className="text-xs text-muted">{c.sub}</p>
            <Pill tone={c.tone} className="mt-2">{c.meta}</Pill>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          <Widget
            title={
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-primary" /> Hot Discussions
              </span>
            }
            viewAllHref="/community/discussions"
          >
            <ul className="divide-y divide-line">
              {hotDiscussions.map((d) => (
                <li key={d.title} className="flex items-center gap-3 py-3">
                  <Thumb tone={d.tone} size="sm" className="rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Pill tone={d.tone}>{d.tag}</Pill>
                      <p className="truncate text-sm font-semibold text-text">{d.title}</p>
                    </div>
                    <p className="text-[11px] text-faint">
                      {d.author} · {d.when}
                    </p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 text-xs text-faint sm:flex">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {d.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {d.views}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Featured Fan Content" viewAllHref="/community/clubs">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featuredFanContent.map((f) => (
                <div key={f.title} className="overflow-hidden rounded-lg border border-line bg-surface-2">
                  <Thumb tone={f.tone} className="h-28 w-full rounded-none" />
                  <div className="p-2">
                    <p className="truncate text-sm font-semibold text-text">{f.title}</p>
                    <p className="truncate text-[11px] text-faint">{f.author}</p>
                    <span className="mt-1 flex items-center gap-1 text-xs text-pink">
                      <Heart className="h-3 w-3 fill-pink" />
                      {f.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Community Poll">
            <p className="mb-3 font-semibold text-text">{communityPoll.question}</p>
            <ul className="space-y-2">
              {communityPoll.options.map((o) => (
                <li key={o.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-text">{o.label}</span>
                    <span className="font-bold text-text">{o.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${o.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-faint">{communityPoll.votes} · 2 days left</p>
          </Widget>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Widget title="Online Members" viewAllHref="/community">
            <ul className="space-y-3">
              {onlineMembers.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <div className="relative">
                    <Thumb tone={m.tone} size="sm" className="rounded-full" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-green" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-text">{m.name}</span>
                  <Pill tone={m.tone}>{m.rank}</Pill>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Upcoming Events" viewAllHref="/community/events">
            <ul className="space-y-3">
              {communityEvents.map((e) => (
                <li key={e.title} className="flex gap-3">
                  <div className="shrink-0 rounded-lg bg-primary-soft px-2 py-1 text-center">
                    <p className="text-[11px] font-bold text-primary">{e.date}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{e.title}</p>
                    <p className="truncate text-xs text-muted">{e.when}</p>
                    <p className="text-[11px] text-faint">{e.going}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget title="Community Achievements">
            <div className="grid grid-cols-2 gap-3">
              {communityAchievements.map((a) => (
                <div key={a.name} className="rounded-lg bg-surface-2 p-3 text-center">
                  <Award className="mx-auto h-6 w-6 text-orange" />
                  <p className="mt-1 text-xs font-bold text-text">{a.name}</p>
                  <p className="text-[10px] text-faint">{a.sub}</p>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Popular Tags">
            <div className="flex flex-wrap gap-2">
              {popularTags.map((t) => (
                <span key={t} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-muted">
                  {t}
                </span>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  )
}
