'use client'

// Avaliacao Rapida (modulo Escolinha). Pensada pro professor avaliar 70+ alunos
// em 15-20 min no celular. Dimensoes variam por FAIXA ETARIA (5-7, 8-10, 11-13,
// 14+) — decisao do analista em 2026-09-15. Ver src/lib/stats/faixas.ts.
// Salva na tabela nova `avaliacoes_rapidas` (JSONB). Nao mexe no sistema completo.

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import {
  ArrowLeft, ArrowRight, Check, Search, Shield, Zap, Save, RotateCcw,
} from 'lucide-react'
import {
  PageHeader, Card, Button, EmptyState, Spinner, Select, Input, Badge,
} from '@/components/app'
import { FAIXAS, faixaPorIdade, idadeAnosEm, type Faixa } from '@/lib/stats/faixas'

type Atleta = {
  id: string
  nome: string
  posicao: string | null
  foto_url: string | null
  data_nascimento: string | null
  clube_id: string | null
  clubes: { id: string; nome: string } | { id: string; nome: string }[] | null
}

type Clube = { id: string; nome: string }

type AvaliacaoRapidaRow = {
  id: string
  atleta_id: string
  data_avaliacao: string
  faixa: string
  notas: Record<string, number>
}

const hojeISO = () => new Date().toISOString().slice(0, 10)
const getClube = (c: Atleta['clubes']): { nome: string } | null => (Array.isArray(c) ? c[0] : c)

export default function AvaliacaoRapidaPage() {
  const supabase = createClient()
  const { user: usuario, isProfessor } = useUser()

  const [dataAvaliacao, setDataAvaliacao] = useState<string>(hojeISO())
  const [clubes, setClubes] = useState<Clube[]>([])
  const [clubeId, setClubeId] = useState<string>('')
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [avaliacoesHoje, setAvaliacoesHoje] = useState<Record<string, AvaliacaoRapidaRow>>({})
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  const [atletaAtual, setAtletaAtual] = useState<Atleta | null>(null)
  const [notas, setNotas] = useState<Record<string, number>>({})
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: cs } = await supabase.from('clubes').select('id, nome').order('nome')
      setClubes(cs || [])
      if (isProfessor && usuario?.clube_id) setClubeId(usuario.clube_id)
      else if (cs && cs.length === 1) setClubeId(cs[0].id)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfessor, usuario?.clube_id])

  const carregar = useCallback(async () => {
    if (!clubeId) { setAtletas([]); setAvaliacoesHoje({}); return }
    setLoading(true)
    const [{ data: as }, { data: avs }] = await Promise.all([
      supabase
        .from('atletas')
        .select('id, nome, posicao, foto_url, data_nascimento, clube_id, clubes(id, nome)')
        .eq('clube_id', clubeId)
        .order('nome'),
      supabase
        .from('avaliacoes_rapidas')
        .select('id, atleta_id, data_avaliacao, faixa, notas')
        .eq('data_avaliacao', dataAvaliacao)
        .eq('criado_por', usuario?.id ?? ''),
    ])
    setAtletas((as as unknown as Atleta[]) || [])
    const map: Record<string, AvaliacaoRapidaRow> = {}
    for (const a of (avs as AvaliacaoRapidaRow[] | null) || []) map[a.atleta_id] = a
    setAvaliacoesHoje(map)
    setLoading(false)
  }, [clubeId, dataAvaliacao, supabase, usuario?.id])

  useEffect(() => { carregar() }, [carregar])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return atletas
    return atletas.filter(a =>
      a.nome.toLowerCase().includes(q) ||
      (a.posicao?.toLowerCase() || '').includes(q)
    )
  }, [atletas, busca])

  const totalAvaliados = Object.keys(avaliacoesHoje).length

  // Faixa do atleta atual — calculada da idade dele na data da avaliacao.
  const faixaAtual: Faixa | null = useMemo(() => {
    if (!atletaAtual) return null
    return faixaPorIdade(idadeAnosEm(atletaAtual.data_nascimento, dataAvaliacao))
  }, [atletaAtual, dataAvaliacao])

  const abrir = (a: Atleta) => {
    const existente = avaliacoesHoje[a.id]
    setAtletaAtual(a)
    setNotas(existente?.notas ? { ...existente.notas } : {})
  }
  const fechar = () => { setAtletaAtual(null); setNotas({}) }

  const idx = atletaAtual ? filtrados.findIndex(a => a.id === atletaAtual.id) : -1
  const proximo = idx >= 0 && idx < filtrados.length - 1 ? filtrados[idx + 1] : null
  const anterior = idx > 0 ? filtrados[idx - 1] : null

  const podeSalvar = Object.values(notas).some(v => typeof v === 'number' && v > 0)

  const salvar = async (apos?: 'proximo' | 'anterior' | 'fechar'): Promise<boolean> => {
    if (!atletaAtual || !usuario?.id || !faixaAtual) return true
    // Guarda contra double-tap durante request em voo (fix bug #2 revisor):
    // sem isso, dois cliques rapidos criavam DUAS linhas na tabela.
    if (salvando) return true
    // Sem notas: nao persiste, so navega (fix bug #1 revisor — antes ficava preso).
    if (!podeSalvar) {
      if (apos === 'proximo' && proximo) abrir(proximo)
      else if (apos === 'anterior' && anterior) abrir(anterior)
      else if (apos === 'fechar') fechar()
      return true
    }
    setSalvando(true)
    const payload = {
      atleta_id: atletaAtual.id,
      data_avaliacao: dataAvaliacao,
      faixa: faixaAtual.key,
      notas,
      criado_por: usuario.id,
    }
    const existente = avaliacoesHoje[atletaAtual.id]
    const q = existente
      ? supabase.from('avaliacoes_rapidas').update(payload).eq('id', existente.id).select('id, atleta_id, data_avaliacao, faixa, notas').single()
      : supabase.from('avaliacoes_rapidas').insert(payload).select('id, atleta_id, data_avaliacao, faixa, notas').single()
    const { data, error } = await q
    setSalvando(false)
    if (error || !data) {
      alert(`Erro ao salvar: ${error?.message || 'desconhecido'}`)
      return false
    }
    setAvaliacoesHoje(prev => ({ ...prev, [atletaAtual.id]: data as AvaliacaoRapidaRow }))
    if (apos === 'proximo' && proximo) abrir(proximo)
    else if (apos === 'anterior' && anterior) abrir(anterior)
    else if (apos === 'fechar') fechar()
    return true
  }

  // -------------------- Lista de atletas --------------------
  if (!atletaAtual) {
    return (
      <div>
        <PageHeader
          eyebrow="Escolinha"
          title="Avaliação Rápida"
          description="Dimensões escolhidas automaticamente pela idade do menino. Feito pra celular na beira do campo."
        />

        <Card padding="sm" className="mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Input
                label="Data da avaliação"
                type="date"
                value={dataAvaliacao}
                onChange={e => setDataAvaliacao(e.target.value)}
              />
            </div>
            {!isProfessor && (
              <div className="flex-1">
                <Select
                  label="Clube"
                  value={clubeId}
                  onChange={e => setClubeId(e.target.value)}
                >
                  <option value="">Selecione um clube</option>
                  {clubes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </Select>
              </div>
            )}
            <div className="flex-1">
              <Input
                label="Buscar atleta"
                placeholder="Nome ou posição"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>
          {clubeId && (
            <div className="mt-3 text-xs text-soft flex items-center gap-2 flex-wrap">
              <Badge variant="brand" size="sm">
                <Check className="w-3 h-3" />
                {totalAvaliados} de {atletas.length} avaliados
              </Badge>
              {atletas.length > 0 && totalAvaliados === atletas.length && (
                <span className="text-positive font-semibold">Sessão concluída ✓</span>
              )}
              <span className="text-faint">
                Faixas: {FAIXAS.map(f => `${f.label} (${f.idadeMin}–${f.idadeMax === 999 ? '+' : f.idadeMax})`).join(' · ')}
              </span>
            </div>
          )}
        </Card>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando..." /></div>
        ) : !clubeId ? (
          <EmptyState
            icon={Shield}
            title="Selecione um clube"
            description="Escolha o clube pra ver a lista de atletas."
          />
        ) : filtrados.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="Nenhum atleta"
            description={busca ? "Nenhum atleta corresponde à busca." : "Este clube ainda não tem atletas cadastrados."}
            action={busca ? undefined : <Link href="/atletas/novo"><Button size="sm">Cadastrar atleta</Button></Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtrados.map(a => {
              const avaliado = !!avaliacoesHoje[a.id]
              const clube = getClube(a.clubes)
              const idade = idadeAnosEm(a.data_nascimento, dataAvaliacao)
              const faixa = faixaPorIdade(idade)
              return (
                <Card
                  key={a.id}
                  padding="none"
                  interactive
                  onClick={() => abrir(a)}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-line bg-surface-2 grid place-items-center">
                      {a.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.foto_url} alt={a.nome} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-faint">{a.nome.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-strong truncate">{a.nome}</p>
                      <p className="text-xs text-soft truncate">
                        {idade != null ? `${idade} anos` : 'Sem idade'}
                        {a.posicao && ` • ${a.posicao}`}
                        {clube && ` • ${clube.nome}`}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: faixa.cor }}>
                        {faixa.label} · {faixa.dimensoes.length} dimensões
                      </p>
                    </div>
                    {avaliado
                      ? <Badge variant="positive" size="sm"><Check className="w-3 h-3" />Avaliado</Badge>
                      : <ArrowRight className="w-4 h-4 text-faint shrink-0" />
                    }
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // -------------------- Modo de edicao --------------------
  const idade = idadeAnosEm(atletaAtual.data_nascimento, dataAvaliacao)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <Button variant="ghost" size="icon" onClick={() => salvar('fechar')} aria-label="Voltar">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-brand bg-surface-2 grid place-items-center">
          {atletaAtual.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={atletaAtual.foto_url} alt={atletaAtual.nome} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-faint">{atletaAtual.nome.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-strong truncate">{atletaAtual.nome}</p>
          <p className="text-xs text-soft truncate">
            {idade != null ? `${idade} anos` : 'Sem idade'}
            {atletaAtual.posicao && ` • ${atletaAtual.posicao}`} • {idx + 1} de {filtrados.length}
          </p>
        </div>
      </div>

      {/* Cabecalho da faixa — cor propria pra o professor saber que o conjunto muda por idade */}
      {faixaAtual && (
        <div
          className="rounded-xl p-3 mb-4 border"
          style={{
            background: `${faixaAtual.cor}15`,
            borderColor: `${faixaAtual.cor}55`,
          }}
        >
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: faixaAtual.cor }}>
            Faixa {faixaAtual.label}
          </p>
          <p className="text-xs text-soft mt-0.5">{faixaAtual.descricao}</p>
        </div>
      )}

      {/* Dimensoes da faixa */}
      <div className="space-y-3 sm:space-y-4">
        {faixaAtual?.dimensoes.map(dim => {
          const nota = notas[dim.key]
          return (
            <Card key={dim.key} padding="md">
              <div className="mb-3">
                <p className="font-bold text-strong">{dim.label}</p>
                <p className="text-xs text-soft">{dim.descricao}</p>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map(v => {
                  const ativo = nota === v
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setNotas(n => ({ ...n, [dim.key]: v }))}
                      className={
                        'h-14 sm:h-16 rounded-xl font-bold text-2xl transition-all ' +
                        (ativo
                          ? 'bg-brand text-app shadow-lg shadow-brand/30 scale-105'
                          : 'bg-surface-2 text-soft border border-line hover:border-line-strong active:scale-95')
                      }
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
              {typeof nota === 'number' && (
                <button
                  type="button"
                  onClick={() => setNotas(n => { const c = { ...n }; delete c[dim.key]; return c })}
                  className="mt-2 text-xs text-faint hover:text-soft inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Limpar
                </button>
              )}
            </Card>
          )
        })}
      </div>

      <div className="sticky bottom-0 mt-4 -mx-3 sm:mx-0 bg-app/95 backdrop-blur border-t border-line px-3 sm:px-0 py-3 flex items-center gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => salvar('anterior')}
          disabled={!anterior || salvando}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => proximo ? salvar('proximo') : salvar('fechar')}
          disabled={!podeSalvar || salvando}
          className="flex-[2]"
        >
          {salvando ? <Spinner size="sm" /> : proximo ? <><Save className="w-4 h-4" />Salvar e próximo<ArrowRight className="w-4 h-4" /></> : <><Save className="w-4 h-4" />Salvar e finalizar</>}
        </Button>
      </div>
    </div>
  )
}
