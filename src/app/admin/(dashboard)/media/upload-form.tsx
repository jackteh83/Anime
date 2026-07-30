'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle, CheckCircle2, Loader2, Upload } from 'lucide-react'
import { uploadMedia, type UploadState } from './actions'

function UploadButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      {pending ? 'Uploading…' : 'Upload'}
    </button>
  )
}

export function UploadForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction] = useActionState<UploadState, FormData>(uploadMedia, {})

  return (
    <form action={formAction} className="rounded-card border border-line bg-surface p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text">Image file</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            disabled={disabled}
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-muted file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-bold file:text-on-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-text">Alt text</label>
          <input
            name="alt"
            disabled={disabled}
            placeholder="Describe the image (accessibility + SEO)"
            className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-text outline-none focus:border-primary"
          />
        </div>
      </div>
      {state.error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-down">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </p>
      )}
      {state.ok && (
        <p className="mt-3 flex items-center gap-2 text-sm text-green">
          <CheckCircle2 className="h-4 w-4" /> {state.ok}
        </p>
      )}
      <div className="mt-4">
        <UploadButton />
      </div>
    </form>
  )
}
