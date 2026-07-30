import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import type { AiAdapter } from '../types'

/**
 * Anthropic adapter — the only provider that uses an official SDK (per stack
 * rules). Others use fetch. Model comes from config (default claude-opus-5).
 */
export const anthropicAdapter: AiAdapter = {
  async generate(cfg, input) {
    const client = new Anthropic({ apiKey: cfg.apiKey })
    const res = await client.messages.create({
      model: cfg.model,
      max_tokens: input.maxTokens ?? 1024,
      // Keep content-generation cheap and fast; correctness over deep reasoning.
      output_config: { effort: 'low' },
      ...(input.system ? { system: input.system } : {}),
      messages: [{ role: 'user', content: input.prompt }],
    })

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()

    return {
      text,
      provider: 'anthropic',
      model: res.model,
      usage: {
        inputTokens: res.usage.input_tokens,
        outputTokens: res.usage.output_tokens,
      },
    }
  },
}
