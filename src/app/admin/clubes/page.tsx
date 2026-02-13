import { createClient } from '@/lib/supabase/server'
import { Plus, Building2, MapPin, Phone, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function ClubesPage() {
  const supabase = await createClient()

  const { data: clubes, error } = await supabase
    .from('clubes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clubes</h1>
          <p className="text-gray-500 mt-1">Gerencie os clubes cadastrados</p>
        </div>
        <Link
          href="/admin/clubes/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light shadow-lg shadow-accent/25 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Novo Clube
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Erro ao carregar clubes: {error.message}
        </div>
      )}

      {clubes && clubes.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum clube cadastrado</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Comece adicionando seu primeiro clube para registrar jogos e analises</p>
          <Link
            href="/admin/clubes/novo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light shadow-lg shadow-accent/25 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Adicionar Clube
          </Link>
        </div>
      )}

      {clubes && clubes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_150px_150px_100px_50px] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500">
            <span>Clube</span>
            <span>Cidade</span>
            <span>Categoria</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-gray-100">
            {clubes.map((clube) => (
              <Link
                key={clube.id}
                href={`/admin/clubes/${clube.id}`}
                className="grid grid-cols-[1fr_150px_150px_100px_50px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {clube.escudo_url ? (
                    <img
                      src={clube.escudo_url}
                      alt={clube.nome}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">{clube.nome}</h3>
                    {clube.contato_telefone && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {clube.contato_telefone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-gray-600">
                  {clube.cidade && clube.estado ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {clube.cidade} - {clube.estado}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div>
                  {clube.categoria ? (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold bg-accent/10 text-accent rounded-full">
                      {clube.categoria}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${clube.ativo ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${clube.ativo ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {clube.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
