import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bot,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  Search,
  Settings,
  Users,
} from 'lucide-react'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

/** CMS Control Center modules (see docs/03_CMS_Control_Center.md). */
export const adminNav: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Homepage Builder', href: '/admin/homepage', icon: LayoutTemplate },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'SEO Manager', href: '/admin/seo', icon: Search },
  { label: 'Scheduler', href: '/admin/scheduler', icon: CalendarClock },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'AI Engine', href: '/admin/ai', icon: Bot },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]
