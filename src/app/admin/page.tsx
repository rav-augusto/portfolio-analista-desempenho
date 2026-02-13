import { createClient } from '@/lib/supabase/server'
import { Users, Trophy, BarChart3, FileText, Plus, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  // Buscar contagens
  const { count: clubesCount } = await supabase
    .from('clubes')
    .select('*', { count: 'exact', head: true })

  const { count: jogosCount } = await supabase
    .from('jogos')
    .select('*', { count: 'exact', head: true })

  const { count: analisesCount } = await supabase
    .from('analises_jogo')
    .select('*', { count: 'exact', head: true })

  const { count: atletasCount } = await supabase
    .from('atletas')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Clubes', value: clubesCount || 0, icon: Users, href: '/admin/clubes', color: 'from-blue-500 to-blue-600' },
    { label: 'Jogos', value: jogosCount || 0, icon: Trophy, href: '/admin/jogos', color: 'from-accent to-accent-dark' },
    { label: 'Analises', value: analisesCount || 0, icon: BarChart3, href: '/admin/analises', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Atletas', value: atletasCount || 0, icon: FileText, href: '/admin/atletas', color: 'from-purple-500 to-purple-600' },
  ]

  const quickActions = [
    { label: 'Novo Clube', icon: Users, href: '/admin/clubes/novo', description: 'Adicionar um clube' },
    { label: 'Novo Jogo', icon: Trophy, href: '/admin/jogos/novo', description: 'Registrar partida' },
    { label: 'Nova Analise', icon: BarChart3, href: '/admin/analises/nova', description: 'Criar analise tatica' },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visao geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors" />
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acoes Rapidas</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-accent/30 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                  <action.icon className="w-6 h-6 text-gray-600 group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">{action.label}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty State / Welcome */}
      {(clubesCount === 0) && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <Plus className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Comece agora</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Adicione seu primeiro clube para comecar a registrar jogos e criar analises taticas.
          </p>
          <Link
            href="/admin/clubes/novo"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Clube
          </Link>
        </div>
      )}
    </div>
  )
}
