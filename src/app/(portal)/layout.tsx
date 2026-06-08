'use client'

import '@/styles/app.css'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { AppShell, Spinner, type AppMenuItem } from '@/components/app'
import {
  User,
  LayoutDashboard,
  TrendingUp,
  GitCompare,
} from 'lucide-react'

const portalMenu: AppMenuItem[] = [
  { href: '/portal', icon: User, label: 'Meu Perfil' },
  { href: '/portal/dashboard', icon: LayoutDashboard, label: 'Meu Dashboard' },
  { href: '/portal/evolucao', icon: TrendingUp, label: 'Minha Evolucao' },
  { href: '/portal/comparar', icon: GitCompare, label: 'Comparar Atletas' },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()
  const { isLoading, isAtleta, isMaster, isAnalista } = useUser()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) router.push('/login')
    }
    checkAuth()
  }, [router, supabase.auth])

  useEffect(() => {
    if (!isLoading && (isMaster || isAnalista)) {
      router.push('/dashboard')
    }
  }, [isLoading, isMaster, isAnalista, router])

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-app flex items-center justify-center">
        <Spinner size="lg" label="Carregando..." />
      </div>
    )
  }

  if (!isAtleta) return null

  return (
    <AppShell
      menuItems={portalMenu}
      subtitle="Portal do Atleta"
      tone="portal"
      roleLabel="Atleta"
    >
      {children}
    </AppShell>
  )
}
