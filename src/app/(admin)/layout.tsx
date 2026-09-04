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
  Activity,
  Shirt,
  UsersRound,
} from 'lucide-react'

const adminMenu: AppMenuItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', hideForProfessor: true },
  { href: '/dashboard-atletas', icon: TrendingUp, label: 'Evolucao Atletas', hideForProfessor: true },
  { href: '/dashboard-avaliacoes', icon: Target, label: 'Comparativo', hideForProfessor: true },
  { href: '/comparar-atletas', icon: GitCompare, label: 'Comparar Atletas', hideForProfessor: true },
  { href: '/guia-avaliacao', icon: BookOpen, label: 'Guia de Avaliacao', hideForProfessor: true },
  { href: '/clubes', icon: Shield, label: 'Clubes', hideForProfessor: true },
  { href: '/atletas', icon: Users, label: 'Atletas' },
  { href: '/comissao-tecnica', icon: UsersRound, label: 'Comissão Técnica' },
  { href: '/escalacoes', icon: Shirt, label: 'Escalações' },
  { href: '/jogos', icon: Gamepad2, label: 'Jogos', hideForProfessor: true },
  { href: '/analises', icon: FileBarChart, label: 'Analises de Jogo', hideForProfessor: true },
  { href: '/avaliacoes', icon: Star, label: 'Avaliacoes Atletas', hideForProfessor: true },
  { href: '/avaliacao-fisica', icon: Activity, label: 'Avaliacao Fisica', hideForProfessor: true },
  { href: '/usuarios', icon: UserCog, label: 'Usuarios', masterOnly: true },
]

const ROTAS_PROFESSOR = ['/atletas', '/comissao-tecnica', '/escalacoes']

const roleLabels: Record<string, string> = {
  master: 'Master',
  analista: 'Analista',
  atleta: 'Atleta',
  professor: 'Professor',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { user, isLoading, isAtleta, isProfessor } = useUser()

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

  useEffect(() => {
    if (!isLoading && isProfessor && !ROTAS_PROFESSOR.some(r => pathname.startsWith(r))) {
      router.push('/escalacoes')
    }
  }, [isLoading, isProfessor, pathname, router])

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
