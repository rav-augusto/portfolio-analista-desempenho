'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import {
  LayoutDashboard,
  Shield,
  Users,
  Gamepad2,
  FileBarChart,
  Star,
  LogOut,
  Menu,
  X,
  CircleDot,
  TrendingUp,
  Target,
  BookOpen,
  GitCompare,
  UserCog
} from 'lucide-react'

type MenuItem = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  masterOnly?: boolean
}

const allMenuItems: MenuItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard-atletas', icon: TrendingUp, label: 'Evolucao Atletas' },
  { href: '/dashboard-avaliacoes', icon: Target, label: 'Comparativo' },
  { href: '/comparar-atletas', icon: GitCompare, label: 'Comparar Atletas' },
  { href: '/guia-avaliacao', icon: BookOpen, label: 'Guia de Avaliacao' },
  { href: '/clubes', icon: Shield, label: 'Clubes' },
  { href: '/atletas', icon: Users, label: 'Atletas' },
  { href: '/jogos', icon: Gamepad2, label: 'Jogos' },
  { href: '/analises', icon: FileBarChart, label: 'Analises de Jogo' },
  { href: '/avaliacoes', icon: Star, label: 'Avaliacoes Atletas' },
  { href: '/usuarios', icon: UserCog, label: 'Usuarios', masterOnly: true },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { user: usuario, isLoading, isMaster, isAtleta } = useUser()

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => {
      if (item.masterOnly && !isMaster) return false
      return true
    })
  }, [isMaster])

  // Get role label for display
  const roleLabel = useMemo(() => {
    if (!usuario) return ''
    switch (usuario.role) {
      case 'master': return 'Master'
      case 'analista': return 'Analista'
      case 'atleta': return 'Atleta'
      default: return 'Usuario'
    }
  }, [usuario])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  // Redirect atleta users to portal
  useEffect(() => {
    if (!isLoading && isAtleta && !pathname.startsWith('/portal')) {
      router.push('/portal')
    }
  }, [isLoading, isAtleta, pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  // Prevent rendering admin layout for atleta users
  if (isAtleta) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <CircleDot className="w-5 h-5 text-slate-900" />
          </div>
          <span className="font-bold text-slate-100">Olhar da Base</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400 hover:text-slate-200">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <CircleDot className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <span className="block font-bold text-slate-100">Olhar da Base</span>
              <span className="block text-xs text-amber-500">Painel Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                  ${isActive
                    ? 'bg-amber-500 text-slate-900 font-semibold'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-500">
                {usuario?.nome?.charAt(0).toUpperCase() || usuario?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{usuario?.nome || usuario?.email}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
