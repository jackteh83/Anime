import Link from 'next/link'

/**
 * Anisekai wordmark. "ANI" in brand red, "SEKAI" in text color, trailing red dot —
 * matching the approved logo lockup.
 */
export function Logo({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <Link href="/" className="group flex flex-col leading-none">
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-primary">ANI</span>
        <span className="text-text">SEKAI</span>
        <span className="text-primary">.</span>
      </span>
      {withTagline && (
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
          Anime · TCG · Leaks
        </span>
      )}
    </Link>
  )
}
