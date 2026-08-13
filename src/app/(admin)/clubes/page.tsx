'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Shield, Search, Users, CalendarDays, MapPin } from 'lucide-react'
import Link from 'next/link'
import {
  PageHeader,
  Button,
  Input,
  Select,
  StatCard,
  Card,
  EmptyState,
  Spinner,
  Modal,
} from '@/components/app'

type Clube = {
  id: string
  nome: string
  cidade: string
  estado: string
  escudo_url: string | null
  created_at: string
}

export default function ClubesPage() {
  const [clubes, setClubes] = useState<Clube[]>([])
  const [atletasPorClube, setAtletasPorClube] = useState<Record<string, number>>({})
  const [jogosPorClube, setJogosPorClube] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [aExcluir, setAExcluir] = useState<Clube | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadClubes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadClubes = async () => {
    const [clubesRes, atletasRes, jogosRes] = await Promise.all([
      supabase.from('clubes').select('*').order('nome'),
      supabase.from('atletas').select('clube_id'),
      supabase.from('jogos').select('clube_id'),
    ])

    if (clubesRes.data) setClubes(clubesRes.data)

    const contar = (rows: { clube_id: string | null }[] | null) => {
      const map: Record<string, number> = {}
      for (const r of rows ?? []) {
        if (r.clube_id) map[r.clube_id] = (map[r.clube_id] || 0) + 1
      }
      return map
    }
    setAtletasPorClube(contar(atletasRes.data))
    setJogosPorClube(contar(jogosRes.data))
    setLoading(false)
  }

  const confirmarExclusao = async () => {
    if (!aExcluir) return
    setDeleting(true)
    const { error } = await supabase.from('clubes').delete().eq('id', aExcluir.id)
    if (!error) setClubes(prev => prev.filter(c => c.id !== aExcluir.id))
    setDeleting(false)
    setAExcluir(null)
  }

  const estados = useMemo(
    () => Array.from(new Set(clubes.map(c => c.estado).filter(Boolean))).sort(),
    [clubes]
  )

  const filteredClubes = useMemo(
    () =>
      clubes.filter(c => {
        const q = search.toLowerCase()
        const matchBusca =
          c.nome.toLowerCase().includes(q) || (c.cidade || '').toLowerCase().includes(q)
        const matchEstado = !estado || c.estado === estado
        return matchBusca && matchEstado
      }),
    [clubes, search, estado]
  )

  const totalAtletas = useMemo(
    () => Object.values(atletasPorClube).reduce((a, b) => a + b, 0),
    [atletasPorClube]
  )

  return (
    <div>
      <PageHeader
        eyebrow="Clubes"
        title="Clubes parceiros"
        description="Clubes cadastrados, com atletas e jogos vinculados"
        actions={
          <Link href="/clubes/novo">
            <Button>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo clube</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Clubes" value={loading ? '—' : clubes.length} icon={Shield} tone="brand" />
        <StatCard label="Atletas vinculados" value={loading ? '—' : totalAtletas} icon={Users} tone="info" />
        <StatCard label="Estados" value={loading ? '—' : estados.length} icon={MapPin} tone="positive" />
        <StatCard label="Jogos registrados" value={loading ? '—' : Object.values(jogosPorClube).reduce((a, b) => a + b, 0)} icon={CalendarDays} tone="violet" />
      </div>

      {/* Toolbar */}
      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar clube ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="sm:w-52">
            <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos os estados</option>
              {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </Select>
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" label="Carregando clubes..." />
        </div>
      ) : filteredClubes.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Nenhum clube encontrado"
          description="Ajuste a busca ou cadastre um novo clube parceiro."
          action={
            <Link href="/clubes/novo">
              <Button size="sm"><Plus className="w-4 h-4" />Novo clube</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredClubes.map((clube) => (
            <Card key={clube.id} padding="none" className="group overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-app border border-line">
                  {clube.escudo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={clube.escudo_url} alt={clube.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-6 h-6 text-faint" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-strong truncate">{clube.nome}</h3>
                  <p className="text-xs text-soft flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {clube.cidade}{clube.estado ? ` · ${clube.estado}` : ''}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-line/70 px-4 py-2.5">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-soft">
                    <Users className="w-3.5 h-3.5 text-info" />
                    <b className="text-strong tabular-nums">{atletasPorClube[clube.id] || 0}</b> atletas
                  </span>
                  <span className="flex items-center gap-1.5 text-soft">
                    <CalendarDays className="w-3.5 h-3.5 text-brand" />
                    <b className="text-strong tabular-nums">{jogosPorClube[clube.id] || 0}</b> jogos
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/clubes/${clube.id}`}
                    className="p-1.5 text-faint hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setAExcluir(clube)}
                    className="p-1.5 text-faint hover:text-negative hover:bg-negative/10 rounded-lg transition-colors"
                    aria-label="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de exclusão */}
      <Modal
        isOpen={!!aExcluir}
        onClose={() => setAExcluir(null)}
        title="Excluir clube"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAExcluir(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={confirmarExclusao} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-soft">
          Tem certeza que deseja excluir <b className="text-strong">{aExcluir?.nome}</b>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
