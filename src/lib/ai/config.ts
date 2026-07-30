import type { AiProviderId, ResolvedProvider } from './types'

/**
 * Provider registry. Each entry declares the default model and the env var that
 * holds its API key. Provider/model selection is configuration only — the CMS
 * Settings screen will edit these at runtime later; for now they come from env.
 */
export const PROVIDERS: Record<
  AiProviderId,
  { label: string; defaultModel: string; apiKeyEnv: string }
> = {
  anthropic: {
    label: 'Anthropic Claude',
    defaultModel: 'claude-opus-5',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
  },
  openai: {
    label: 'OpenAI',
    defaultModel: 'gpt-4o',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  gemini: {
    label: 'Google Gemini',
    defaultModel: 'gemini-2.0-flash',
    apiKeyEnv: 'GEMINI_API_KEY',
  },
  xai: {
    label: 'xAI Grok',
    defaultModel: 'grok-2-latest',
    apiKeyEnv: 'XAI_API_KEY',
  },
  openrouter: {
    label: 'OpenRouter',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    apiKeyEnv: 'OPENROUTER_API_KEY',
  },
}

export const PROVIDER_IDS = Object.keys(PROVIDERS) as AiProviderId[]

export function isProviderId(v: string): v is AiProviderId {
  return v in PROVIDERS
}

/** True when the provider's API key is present in the environment. */
export function providerConfigured(id: AiProviderId): boolean {
  return !!process.env[PROVIDERS[id].apiKeyEnv]
}

/**
 * Resolve the active provider from env, with a caller override.
 * AI_PROVIDER / AI_MODEL set the default; an override wins for a single call.
 */
export function resolveProvider(override?: {
  provider?: AiProviderId
  model?: string
}): ResolvedProvider {
  const id = (override?.provider ??
    (process.env.AI_PROVIDER as AiProviderId | undefined) ??
    'anthropic') as AiProviderId
  const meta = PROVIDERS[id] ?? PROVIDERS.anthropic
  const model =
    override?.model || process.env.AI_MODEL || meta.defaultModel
  const apiKey = process.env[meta.apiKeyEnv] ?? ''
  return { id, model, apiKey }
}
