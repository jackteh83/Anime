import 'server-only'
import type { AiAdapter, AiProviderId, GenerateInput, GenerateResult } from './types'
import { resolveProvider } from './config'
import { anthropicAdapter } from './providers/anthropic'
import { geminiAdapter } from './providers/gemini'
import { openAiCompatibleAdapter } from './providers/openai-compatible'

const adapters: Record<AiProviderId, AiAdapter> = {
  anthropic: anthropicAdapter,
  gemini: geminiAdapter,
  openai: openAiCompatibleAdapter('openai', 'https://api.openai.com/v1'),
  xai: openAiCompatibleAdapter('xai', 'https://api.x.ai/v1'),
  openrouter: openAiCompatibleAdapter(
    'openrouter',
    'https://openrouter.ai/api/v1',
  ),
}

/** Run one generation through the configured (or overridden) provider. */
export async function runProvider(
  input: GenerateInput,
  override?: { provider?: AiProviderId; model?: string },
): Promise<GenerateResult> {
  const cfg = resolveProvider(override)
  if (!cfg.apiKey) {
    throw new Error(
      `No API key configured for provider "${cfg.id}". Set it in Vercel env.`,
    )
  }
  return adapters[cfg.id].generate(cfg, input)
}

export * from './types'
export { PROVIDERS, PROVIDER_IDS, providerConfigured, resolveProvider } from './config'
