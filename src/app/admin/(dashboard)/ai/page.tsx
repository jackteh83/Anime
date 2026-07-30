import type { Metadata } from 'next'
import { Bot } from 'lucide-react'
import { AdminPageHeader, ModulePlaceholder } from '@/components/admin/admin-ui'

export const metadata: Metadata = { title: 'AI Engine' }

export default function AiEnginePage() {
  return (
    <div>
      <AdminPageHeader
        title="AI Engine"
        subtitle="Collect → classify → generate → review → publish"
        icon={Bot}
      />
      <ModulePlaceholder
        title="AI Engine"
        points={[
          'Provider-agnostic: OpenAI, Anthropic, Gemini, xAI, OpenRouter (API key only)',
          'Default + fallback provider and model selection',
          'Processing queue with statuses and duplicate detection',
          'AI never publishes directly — all output enters review',
          'Logging: provider, model, prompt version, tokens, timing, errors',
        ]}
      />
    </div>
  )
}
