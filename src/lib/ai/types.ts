/**
 * Provider-agnostic AI contracts. Switching provider/model is config + API key
 * only — no adapter consumer imports a vendor SDK directly (see docs/04_AI_Engine).
 */

export type AiProviderId =
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'xai'
  | 'openrouter'

export type GenerateInput = {
  system?: string
  prompt: string
  maxTokens?: number
}

export type GenerateResult = {
  text: string
  provider: AiProviderId
  model: string
  usage: { inputTokens: number; outputTokens: number }
}

export type ResolvedProvider = {
  id: AiProviderId
  model: string
  apiKey: string
}

/** Every vendor adapter implements this one method. */
export interface AiAdapter {
  generate(cfg: ResolvedProvider, input: GenerateInput): Promise<GenerateResult>
}
