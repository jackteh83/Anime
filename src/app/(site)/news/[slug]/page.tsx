import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Pill } from '@/components/ui'
import { prisma } from '@/lib/db'
import { newsAgo } from '@/lib/news-data'

// Rendered per-request so a freshly ingested article is instantly reachable.
export const dynamic = 'force-dynamic'

async function loadArticle(slug: string) {
  try {
    return await prisma.news.findFirst({
      where: { slug, status: 'PUBLISHED', deletedAt: null },
      include: { category: true },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await loadArticle(slug)
  if (!article) return { title: 'News' }
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDesc ?? article.excerpt ?? undefined,
  }
}

/**
 * Split an ingested body into its prose and the trailing "Source: <url>" line
 * that the RSS collector appends, so we can render the attribution as a link.
 */
function splitBody(body: string | null): { prose: string; source: string | null } {
  if (!body) return { prose: '', source: null }
  const match = body.match(/\n\nSource:\s*(.+)\s*$/)
  if (!match) return { prose: body, source: null }
  return { prose: body.slice(0, match.index).trim(), source: match[1].trim() }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await loadArticle(slug)
  if (!article) notFound()

  const { prose, source } = splitBody(article.body)
  const sourceUrl = source && /^https?:\/\//.test(source) ? source : null

  return (
    <div className="mx-auto max-w-[820px] space-y-5 px-4 py-6 sm:px-6">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" /> Back to News
      </Link>

      <article className="overflow-hidden rounded-card border border-line bg-surface">
        <div className="h-52 w-full bg-gradient-to-br from-primary/30 via-surface-2 to-surface" />
        <div className="p-6 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill tone="primary">{article.category?.name ?? 'News'}</Pill>
            <span className="text-[11px] text-faint">
              {newsAgo(article.publishedAt)}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight text-text sm:text-3xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-3 text-base text-muted">{article.excerpt}</p>
          )}

          {prose && prose !== article.excerpt && (
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-text/90">
              {prose.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {source && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="text-xs text-faint">
                Aggregated from the original source. Read the full story:
              </p>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  {sourceUrl} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="mt-1 text-sm font-semibold text-text">{source}</p>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
