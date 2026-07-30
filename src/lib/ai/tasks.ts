/**
 * AI writing tasks. Each builds a prompt for the provider-agnostic engine.
 * Output always enters the review queue — AI never publishes directly.
 */
export const AI_TASKS = [
  'TITLE',
  'SUMMARY',
  'REWRITE',
  'TRANSLATE',
  'SEO',
] as const

export type AiTask = (typeof AI_TASKS)[number]

export const aiTaskMeta: Record<AiTask, { label: string; maxTokens: number }> = {
  TITLE: { label: 'Generate Title', maxTokens: 120 },
  SUMMARY: { label: 'Summarize', maxTokens: 400 },
  REWRITE: { label: 'Rewrite', maxTokens: 1200 },
  TRANSLATE: { label: 'Translate (EN→ZH)', maxTokens: 1200 },
  SEO: { label: 'SEO Meta', maxTokens: 300 },
}

const SYSTEM =
  'You are an editorial assistant for Anisekai, an Anime & TCG news platform. ' +
  'Write clean, factual, engaging copy. Never invent facts. Return only the ' +
  'requested output with no preamble.'

export function buildPrompt(task: AiTask, content: string): {
  system: string
  prompt: string
  maxTokens: number
} {
  const meta = aiTaskMeta[task]
  const prompts: Record<AiTask, string> = {
    TITLE: `Write one concise, engaging headline (max 12 words) for this content:\n\n${content}`,
    SUMMARY: `Write a 2-3 sentence summary of this content:\n\n${content}`,
    REWRITE: `Rewrite this content to be clearer and more engaging, preserving all facts:\n\n${content}`,
    TRANSLATE: `Translate this content from English to Simplified Chinese, keeping tone and meaning:\n\n${content}`,
    SEO: `Produce an SEO meta title (max 60 chars) and meta description (max 155 chars) for this content. Format as "Title: ...\\nDescription: ...":\n\n${content}`,
  }
  return { system: SYSTEM, prompt: prompts[task], maxTokens: meta.maxTokens }
}
