'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  CircleDot,
  LayoutDashboard,
  Users,
  Trophy,
  BarChart3,
  FileText,
  LogOut,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clubes', label: 'Clubes', icon: Users },
  { href: '/admin/jogos', label: 'Jogos', icon: Trophy },
  { href: '/admin/analises', label: 'Analises', icon: BarChart3 },
  { href: '/admin/atletas', label: 'Atletas', icon: FileText },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-72 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <CircleDot className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold text-white">Olhar da Base</span>
            <span className="block text-xs text-gray-500">Painel Admin</span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-accent text-white shadow-lg shadow-accent/25'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className={cn(
                    'w-5 h-5 transition-transform',
                    isActive && 'scale-110'
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Ver Site */}
      <div className="px-4 pb-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Ver Site</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-400">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{userEmail}</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}
