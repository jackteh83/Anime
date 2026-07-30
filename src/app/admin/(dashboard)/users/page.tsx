import type { Metadata } from 'next'
import { Ban, RotateCcw, Users } from 'lucide-react'
import { AdminPageHeader, StatCard } from '@/components/admin/admin-ui'
import { Pill } from '@/components/ui'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { RoleSelect } from './role-select'
import { deactivateUser, restoreUser } from './actions'

export const metadata: Metadata = { title: 'Users' }

const MANAGER_ROLES = ['Super Admin', 'Administrator']

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function UsersPage() {
  const session = await getSession()
  const canManage = !!session && MANAGER_ROLES.includes(session.role)

  const [users, roles, total, staffCount, memberCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { role: true },
      take: 100,
    }),
    prisma.role.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: { name: { not: 'Member' } } } }),
    prisma.user.count({ where: { role: { name: 'Member' } } }),
  ])

  return (
    <div>
      <AdminPageHeader
        title="User Management"
        subtitle="Roles, permissions and member accounts"
        icon={Users}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={total.toLocaleString()} tone="primary" icon={Users} />
        <StatCard label="Staff" value={staffCount.toLocaleString()} tone="purple" />
        <StatCard label="Members" value={memberCount.toLocaleString()} tone="green" />
      </div>

      {!canManage && (
        <p className="mb-4 rounded-lg border border-orange/40 bg-orange/10 px-3 py-2 text-sm text-orange">
          Read-only view. Only Super Admin and Administrator can change roles or
          deactivate accounts.
        </p>
      )}

      <div className="overflow-hidden rounded-card border border-line bg-surface">
        {users.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Status</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const deactivated = !!u.deletedAt
                  const isSelf = u.id === session?.userId
                  return (
                    <tr key={u.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                            {u.username.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-text">
                              {u.username}
                              {isSelf && <span className="ml-1 text-[11px] text-faint">(you)</span>}
                            </p>
                            <p className="truncate text-xs text-faint">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <RoleSelect
                          userId={u.id}
                          roleId={u.roleId}
                          roles={roles}
                          disabled={!canManage || isSelf}
                        />
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        {deactivated ? (
                          <Pill tone="muted">Deactivated</Pill>
                        ) : u.emailVerified ? (
                          <Pill tone="green">Active</Pill>
                        ) : (
                          <Pill tone="orange">Unverified</Pill>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-faint md:table-cell">
                        {fmtDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canManage && !isSelf ? (
                          deactivated ? (
                            <form action={restoreUser.bind(null, u.id)} className="inline">
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1 rounded-lg bg-green/15 px-2 py-1 text-xs font-bold text-green"
                              >
                                <RotateCcw className="h-3 w-3" /> Restore
                              </button>
                            </form>
                          ) : (
                            <form action={deactivateUser.bind(null, u.id)} className="inline">
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1 rounded-lg bg-down/15 px-2 py-1 text-xs font-bold text-down"
                              >
                                <Ban className="h-3 w-3" /> Deactivate
                              </button>
                            </form>
                          )
                        ) : (
                          <span className="text-xs text-faint">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
