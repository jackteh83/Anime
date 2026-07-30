import 'server-only'
import type { AiAdapter } from '../types'

/** Google Gemini adapter via the generateContent REST endpoint. */
export const geminiAdapter: AiAdapter = {
  async generate(cfg, input) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent?key=${cfg.apiKey}`

    const body: Record<string, unknown> = {
      contents: [{ role: 'user', parts: [{ text: input.prompt }] }],
      generationConfig: { maxOutputTokens: input.maxTokens ?? 1024 },
    }
    if (input.system) {
      body.systemInstruction = { parts: [{ text: input.system }] }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`gemini error ${res.status}: ${detail.slice(0, 300)}`)
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
    }

    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? '')
      .join('')
      .trim()

    return {
      text,
      provider: 'gemini',
      model: cfg.model,
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      },
    }
  },
}
