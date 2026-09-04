'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CircleDot, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils/cn'

export type AppMenuItem = {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  masterOnly?: boolean
  hideForProfessor?: boolean
}

type Tone = 'brand' | 'portal'

interface AppShellProps {
  menuItems: AppMenuItem[]
  subtitle: string
  roleLabel: string
  tone?: Tone
  children: React.ReactNode
}

export function AppShell({
  menuItems,
  subtitle,
  roleLabel,
  tone = 'brand',
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { user, isMaster, isProfessor } = useUser()

  const filteredItems = useMemo(
    () => menuItems.filter((i) => (!i.masterOnly || isMaster) && (!i.hideForProfessor || !isProfessor)),
    [menuItems, isMaster, isProfessor]
  )

  // Travar scroll do body quando drawer aberto no mobile
  useEffect(() => {
    if (sidebarOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [sidebarOpen])

  // Fechar drawer ao mudar de rota
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const accentText = tone === 'portal' ? 'text-portal' : 'text-brand'
  const logoBg = tone === 'portal' ? 'bg-portal' : 'bg-brand'
  const activeBg =
    tone === 'portal'
      ? 'bg-portal text-app shadow-sm shadow-portal/30'
      : 'bg-brand text-app shadow-sm shadow-brand/30'

  const initial = (user?.nome ?? user?.email ?? '?').charAt(0).toUpperCase()

  return (
    <div className="min-h-dvh bg-app text-strong">
      {/* Mobile header */}
      <header
        className="lg:hidden sticky top-0 z-30 bg-app/95 backdrop-blur border-b border-line"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', logoBg)}>
              <CircleDot className="w-5 h-5 text-app" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="font-semibold text-strong truncate text-sm">Olhar da Base</p>
              <p className={cn('text-[10px] font-semibold uppercase tracking-[0.15em] truncate', accentText)}>
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            className="shrink-0 p-2 rounded-lg text-soft hover:text-strong hover:bg-surface-2 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Backdrop (so mobile, com fade) */}
      <div
        className={cn(
          'fixed inset-0 bg-overlay/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar / Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs lg:w-64 bg-surface border-r border-line flex flex-col transition-transform duration-200 lg:translate-x-0 lg:z-30',
          !sidebarOpen && 'max-lg:-translate-x-full'
        )}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label="Menu principal"
      >
        <div className="p-5 border-b border-line flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', logoBg)}>
              <CircleDot className="w-6 h-6 text-app" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-strong leading-tight truncate">Olhar da Base</p>
              <p
                className={cn(
                  'text-[10px] font-semibold uppercase tracking-[0.18em] mt-0.5',
                  accentText
                )}
              >
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
            className="lg:hidden shrink-0 p-2 -mr-1 rounded-lg text-soft hover:text-strong hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 overscroll-contain">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 h-11 rounded-lg text-sm transition-colors',
                  isActive
                    ? cn(activeBg, 'font-semibold')
                    : 'text-soft hover:text-strong hover:bg-surface-2'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-surface-2 border border-line flex items-center justify-center shrink-0">
              <span className={cn('text-sm font-bold', accentText)}>{initial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-strong truncate">
                {user?.nome ?? user?.email}
              </p>
              <p className="text-[11px] text-faint truncate">{roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 h-10 px-3 rounded-lg text-sm font-medium text-soft hover:text-negative hover:bg-negative/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="lg:ml-64">
        <div
          className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6 lg:p-8"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
