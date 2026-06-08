'use client'

import '@/styles/app.css'
import { useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { AppShell, Spinner, type AppMenuItem } from '@/components/app'
import {
  LayoutDashboard,
  Shield,
  Users,
  Gamepad2,
  FileBarChart,
  Star,
  TrendingUp,
  Target,
  BookOpen,
  GitCompare,
  UserCog,
} from 'lucide-react'

const adminMenu: AppMenuItem[] = [
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

const roleLabels: Record<string, string> = {
  master: 'Master',
  analista: 'Analista',
  atleta: 'Atleta',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { user, isLoading, isAtleta } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) router.push('/login')
    }
    checkAuth()
  }, [router, supabase.auth])

  useEffect(() => {
    if (!isLoading && isAtleta && !pathname.startsWith('/portal')) {
      router.push('/portal')
    }
  }, [isLoading, isAtleta, pathname, router])

  const roleLabel = useMemo(
    () => (user?.role ? roleLabels[user.role] ?? 'Usuario' : ''),
    [user]
  )

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-app flex items-center justify-center">
        <Spinner size="lg" label="Carregando..." />
      </div>
    )
  }

  if (isAtleta) return null

  return (
    <AppShell
      menuItems={adminMenu}
      subtitle="Painel Admin"
      tone="brand"
      roleLabel={roleLabel}
    >
      {children}
    </AppShell>
  )
}
