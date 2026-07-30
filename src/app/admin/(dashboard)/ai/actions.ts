'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { runProvider } from '@/lib/ai'
import { isProviderId } from '@/lib/ai/config'
import { AI_TASKS, buildPrompt, type AiTask } from '@/lib/ai/tasks'

const runSchema = z.object({
  task: z.enum(AI_TASKS),
  content: z.string().min(5, 'Provide some content to process'),
  provider: z.string().optional(),
  model: z.string().optional(),
})

export type AiRunState = {
  error?: string
  result?: string
  provider?: string
  model?: string
}

export async function runAiTask(
  _prev: AiRunState,
  formData: FormData,
): Promise<AiRunState> {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const parsed = runSchema.safeParse({
    task: formData.get('task'),
    content: formData.get('content'),
    provider: formData.get('provider') || undefined,
    model: formData.get('model') || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }
  const { task, content, provider, model } = parsed.data
  const override =
    provider && isProviderId(provider) ? { provider, model } : { model }

  const { system, prompt, maxTokens } = buildPrompt(task as AiTask, content)

  // Every AI run is tracked as a job; output enters Pending Review, never
  // auto-published.
  const job = await prisma.aiJob.create({
    data: {
      type: task as AiTask,
      status: 'RUNNING',
      input: { task, contentPreview: content.slice(0, 500) },
    },
  })

  const startedAt = Date.now()
  try {
    const res = await runProvider({ system, prompt, maxTokens }, override)
    const ms = Date.now() - startedAt

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
          processingMs: ms,
          tokensUsed: res.usage.inputTokens + res.usage.outputTokens,
        },
      }),
    ])

    revalidatePath('/admin/ai')
    return {
      result: res.text,
      provider: res.provider,
      model: res.model,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    await prisma.$transaction([
      prisma.aiJob.update({
        where: { id: job.id },
        data: { status: 'FAILED', error: message },
      }),
      prisma.aiLog.create({
        data: {
          jobId: job.id,
          provider: override.provider ?? 'unknown',
          model: override.model ?? 'unknown',
          processingMs: Date.now() - startedAt,
          error: message,
        },
      }),
    ])
    revalidatePath('/admin/ai')
    return { error: message }
  }
}

/** Editor approves the AI output (marks the job consumed). */
export async function approveAiJob(id: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  await prisma.aiJob.update({ where: { id }, data: { status: 'PUBLISHED' } })
  revalidatePath('/admin/ai')
}

/** Editor rejects the AI output. */
export async function rejectAiJob(id: string) {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  await prisma.aiJob.update({ where: { id }, data: { status: 'FAILED' } })
  revalidatePath('/admin/ai')
}
