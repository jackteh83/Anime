import { redirect } from 'next/navigation'
import { getSession, isStaff } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'

// Real authorization for the CMS. proxy.ts does the optimistic cookie check;
// here we verify the JWT and the staff role on every render.
export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()
  if (!session || !isStaff(session.role)) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar session={session} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
