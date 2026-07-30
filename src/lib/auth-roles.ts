// Role helpers with no server-only dependencies — safe to import in client
// components (e.g. the header) as well as server code.

/** Roles allowed into the CMS control center. */
export const STAFF_ROLES = [
  'Super Admin',
  'Administrator',
  'Editor',
  'Moderator',
  'Author',
]

export function isStaff(role: string | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role)
}
