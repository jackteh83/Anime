import 'server-only'
import type { AiAdapter, AiProviderId } from '../types'

/**
 * Shared adapter for OpenAI-compatible Chat Completions APIs (OpenAI, xAI Grok,
 * OpenRouter). Only the base URL and provider id differ.
 */
export function openAiCompatibleAdapter(
  providerId: AiProviderId,
  baseUrl: string,
): AiAdapter {
  return {
    async generate(cfg, input) {
      const messages = [
        ...(input.system
          ? [{ role: 'system', content: input.system }]
          : []),
        { role: 'user', content: input.prompt },
      ]

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify({
          model: cfg.model,
          max_tokens: input.maxTokens ?? 1024,
          messages,
        }),
      })

      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(`${providerId} error ${res.status}: ${detail.slice(0, 300)}`)
      }

      const data = (await res.json()) as {
        model?: string
        choices?: { message?: { content?: string } }[]
        usage?: { prompt_tokens?: number; completion_tokens?: number }
      }

      return {
        text: (data.choices?.[0]?.message?.content ?? '').trim(),
        provider: providerId,
        model: data.model ?? cfg.model,
        usage: {
          inputTokens: data.usage?.prompt_tokens ?? 0,
          outputTokens: data.usage?.completion_tokens ?? 0,
        },
      }
    },
  }
}
