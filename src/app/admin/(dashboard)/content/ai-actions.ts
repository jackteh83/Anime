'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { runProvider } from '@/lib/ai'
import { AI_TASKS, buildPrompt, type AiTask } from '@/lib/ai/tasks'

const schema = z.object({
  task: z.enum(AI_TASKS),
  content: z.string().min(5),
})

export type AssistResult = { text?: string; error?: string }

/**
 * Editor-side AI helper: runs a single task on the given content, logs an
 * AiJob + AiLog, and returns the text to the client to fill a form field.
 * Output is never auto-saved — the editor decides what to keep.
 */
export async function assistContent(
  task: AiTask,
  content: string,
): Promise<AssistResult> {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated' }

  const parsed = schema.safeParse({ task, content })
  if (!parsed.success) {
    return { error: 'Add more content before using AI assist.' }
  }

  const { system, prompt, maxTokens } = buildPrompt(task, content)
  const job = await prisma.aiJob.create({
    data: {
      type: task,
      status: 'RUNNING',
      input: { task, source: 'editor', contentPreview: content.slice(0, 500) },
    },
  })

  const startedAt = Date.now()
  try {
    const res = await runProvider({ system, prompt, maxTokens })
    await prisma.$transaction([
      prisma.aiJob.update({
        where: { id: job.id },
        data: {
          status: 'PENDING_REVIEW',
          provider: res.provider,
          model: res.model,
          output: { text: res.text },
        },
      }),
      prisma.aiLog.create({
        data: {
          jobId: job.id,
          provider: res.provider,
          model: res.model,
          promptVersion: 'v1',
          processingMs: Date.now() - startedAt,
          tokensUsed: res.usage.inputTokens + res.usage.outputTokens,
        },
      }),
    ])
    return { text: res.text }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    await prisma.aiJob.update({
      where: { id: job.id },
      data: { status: 'FAILED', error: message },
    })
    return { error: message }
  }
}
