/** Convert an arbitrary title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Append a short random suffix to keep slugs unique when titles collide. */
export function uniqueSlug(input: string): string {
  const base = slugify(input) || 'item'
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}
