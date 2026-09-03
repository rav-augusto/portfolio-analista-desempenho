'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils/cn'
import { FORMACOES, getFormacao } from '@/lib/formacoes'
import { ArrowLeft, Save, Loader2, Download, User, UsersRound } from 'lucide-react'
import { Card, Button, Select, Input, Textarea, Badge, Spinner } from '@/components/app'

type Clube = { id: string; nome: string; escudo_url: string | null }
type Jogo = { id: string; adversario: string; data_jogo: string; clube_id: string }
type Atleta = {
  id: string
  nome: string
  foto_url: string | null
  numero_camisa: number | null
  posicao: string | null
  clube_id: string
}
type Membro = {
  id: string
  nome: string
  funcao: string
  foto_url: string | null
  clube_id: string
}

type Origin = { kind: 'slot'; slotId: string } | { kind: 'roster' }

const primeiroNome = (nomeCompleto: string) => nomeCompleto.trim().split(/\s+/)[0]

export function EscalacaoEditor({ escalacaoId }: { escalacaoId?: string }) {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useUser()

  const [carregando, setCarregando] = useState(!!escalacaoId)
  const [salvando, setSalvando] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [erro, setErro] = useState('')

  const [clubes, setClubes] = useState<Clube[]>([])
  const [clubeId, setClubeId] = useState('')
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [jogoId, setJogoId] = useState('')
  const [formacaoId, setFormacaoId] = useState(FORMACOES[0].id)
  const [nome, setNome] = useState('')
  const [treinador, setTreinador] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [membros, setMembros] = useState<Membro[]>([])
  const [slots, setSlots] = useState<Record<string, string | null>>({})
  const [suplentes, setSuplentes] = useState<Set<string>>(new Set())
  const [staffIds, setStaffIds] = useState<Set<string>>(new Set())
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)

  const formacao = useMemo(() => getFormacao(formacaoId), [formacaoId])
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('clubes').select('id, nome, escudo_url').order('nome').then(({ data }) => {
      if (data) setClubes(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!escalacaoId) return
    const carregar = async () => {
      const { data: esc } = await supabase.from('escalacoes').select('*').eq('id', escalacaoId).single()
      if (!esc) { setCarregando(false); return }
      setClubeId(esc.clube_id)
      setJogoId(esc.jogo_id || '')
      setFormacaoId(esc.formacao)
      setNome(esc.nome || '')
      setTreinador(esc.treinador || '')
      setObservacoes(esc.observacoes || '')

      const { data: rel } = await supabase
        .from('escalacao_atletas')
        .select('atleta_id, slot_id, titular')
        .eq('escalacao_id', escalacaoId)

      if (rel) {
        const novosSlots: Record<string, string | null> = {}
        const novosSuplentes = new Set<string>()
        for (const r of rel) {
          if (r.titular && r.slot_id) novosSlots[r.slot_id] = r.atleta_id
          else novosSuplentes.add(r.atleta_id)
        }
        setSlots(novosSlots)
        setSuplentes(novosSuplentes)
      }

      const { data: staffRel } = await supabase
        .from('escalacao_staff')
        .select('membro_id')
        .eq('escalacao_id', escalacaoId)
      if (staffRel) setStaffIds(new Set(staffRel.map(r => r.membro_id)))

      setCarregando(false)
    }
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escalacaoId])

  useEffect(() => {
    if (!clubeId) { setJogos([]); setAtletas([]); setMembros([]); return }
    supabase.from('jogos').select('id, adversario, data_jogo, clube_id').eq('clube_id', clubeId).order('data_jogo', { ascending: false }).then(({ data }) => {
      if (data) setJogos(data)
    })
    supabase.from('atletas').select('id, nome, foto_url, numero_camisa, posicao, clube_id').eq('clube_id', clubeId).order('numero_camisa', { ascending: true }).then(({ data }) => {
      if (data) setAtletas(data)
    })
    supabase.from('comissao_tecnica').select('id, nome, funcao, foto_url, clube_id').eq('clube_id', clubeId).order('nome').then(({ data }) => {
      if (data) setMembros(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubeId])

  useEffect(() => {
    if (!jogoId) return
    const jogo = jogos.find(j => j.id === jogoId)
    if (jogo && !nome) setNome(`vs ${jogo.adversario}`)
    supabase.from('analises_jogo').select('sistema_tatico').eq('jogo_id', jogoId).maybeSingle().then(({ data }) => {
      if (data?.sistema_tatico && FORMACOES.some(f => f.id === data.sistema_tatico)) {
        setFormacaoId(data.sistema_tatico)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jogoId])

  const slotByAtleta = useMemo(() => {
    const m = new Map<string, string>()
    for (const [slotId, atletaId] of Object.entries(slots)) {
      if (atletaId) m.set(atletaId, slotId)
    }
    return m
  }, [slots])

  const atletasMap = useMemo(() => new Map(atletas.map(a => [a.id, a])), [atletas])

  const toggleSuplente = (atletaId: string) => {
    setSuplentes(prev => {
      const next = new Set(prev)
      if (next.has(atletaId)) next.delete(atletaId)
      else next.add(atletaId)
      return next
    })
  }

  const toggleStaff = (membroId: string) => {
    setStaffIds(prev => {
      const next = new Set(prev)
      if (next.has(membroId)) next.delete(membroId)
      else next.add(membroId)
      return next
    })
  }

  const beginDrag = useCallback((atletaId: string, from: Origin) => (e: React.PointerEvent) => {
    e.preventDefault()
    setDraggingId(atletaId)
    setDragPos({ x: e.clientX, y: e.clientY })

    const handleMove = (ev: PointerEvent) => setDragPos({ x: ev.clientX, y: ev.clientY })

    const handleUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      setDraggingId(null)
      setDragPos(null)

      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
      const slotEl = el?.closest('[data-slot]') as HTMLElement | null
      const rosterEl = el?.closest('[data-roster-drop]') as HTMLElement | null

      if (slotEl) {
        const targetSlot = slotEl.getAttribute('data-slot')!
        setSlots(prev => {
          const next = { ...prev }
          const occupant = next[targetSlot] ?? null
          if (from.kind === 'slot') {
            if (from.slotId === targetSlot) return prev
            next[from.slotId] = occupant
          }
          next[targetSlot] = atletaId
          return next
        })
        setSuplentes(prev => {
          if (!prev.has(atletaId)) return prev
          const next = new Set(prev)
          next.delete(atletaId)
          return next
        })
      } else if (rosterEl && from.kind === 'slot') {
        setSlots(prev => ({ ...prev, [from.slotId]: null }))
      }
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }, [])

  const totalTitulares = Object.values(slots).filter(Boolean).length

  const handleSalvar = async () => {
    setErro('')
    if (!clubeId) { setErro('Selecione o clube.'); return }
    setSalvando(true)

    const payload = {
      clube_id: clubeId,
      jogo_id: jogoId || null,
      nome: nome || null,
      formacao: formacaoId,
      treinador: treinador || null,
      observacoes: observacoes || null,
    }

    let id = escalacaoId

    if (id) {
      const { error } = await supabase.from('escalacoes').update(payload).eq('id', id)
      if (error) { setErro('Erro ao salvar escalação.'); setSalvando(false); return }
      await supabase.from('escalacao_atletas').delete().eq('escalacao_id', id)
      await supabase.from('escalacao_staff').delete().eq('escalacao_id', id)
    } else {
      const { data, error } = await supabase.from('escalacoes').insert({ ...payload, criado_por: user?.id || null }).select('id').single()
      if (error || !data) { setErro('Erro ao criar escalação.'); setSalvando(false); return }
      id = data.id
    }

    const linhas = [
      ...Object.entries(slots)
        .filter((entry): entry is [string, string] => !!entry[1])
        .map(([slotId, atletaId]) => ({ escalacao_id: id, atleta_id: atletaId, slot_id: slotId, titular: true, ordem: 0 })),
      ...Array.from(suplentes).map((atletaId, i) => ({ escalacao_id: id, atleta_id: atletaId, slot_id: null, titular: false, ordem: i })),
    ]

    if (linhas.length > 0) {
      const { error } = await supabase.from('escalacao_atletas').insert(linhas)
      if (error) { setErro('Escalação salva, mas houve erro ao salvar o elenco.'); setSalvando(false); return }
    }

    if (staffIds.size > 0) {
      const staffLinhas = Array.from(staffIds).map((membroId, i) => ({ escalacao_id: id, membro_id: membroId, ordem: i }))
      const { error } = await supabase.from('escalacao_staff').insert(staffLinhas)
      if (error) { setErro('Escalação salva, mas houve erro ao salvar a comissão técnica.'); setSalvando(false); return }
    }

    setSalvando(false)
    router.push('/escalacoes')
  }

  const handleExportar = async () => {
    if (!exportRef.current) return
    setExportando(true)
    try {
      const canvas = await html2canvas(exportRef.current, { backgroundColor: '#0a0a0b', scale: 2 })
      const fileName = `escalacao-${(nome || 'time').toLowerCase().replace(/\s+/g, '-')}.png`
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) return

      const file = new File([blob], fileName, { type: 'image/png' })
      const nav = navigator as Navigator & {
        canShare?: (data?: { files?: File[] }) => boolean
        share?: (data: { files?: File[]; title?: string }) => Promise<void>
      }

      // No celular, abre a folha de compartilhamento nativa (WhatsApp, etc.) direto.
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        try {
          await nav.share({ files: [file], title: nome || 'Escalação' })
          return
        } catch {
          // Usuário cancelou o compartilhamento ou o navegador recusou — cai para o download.
        }
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportando(false)
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando escalação..." /></div>
  }

  const clubeAtual = clubes.find(c => c.id === clubeId)
  const titularesOrdenados = formacao.slots
    .filter(s => slots[s.id])
    .map(s => ({ slot: s, atleta: atletasMap.get(slots[s.id]!) }))
    .filter((x): x is { slot: typeof formacao.slots[number]; atleta: Atleta } => !!x.atleta)
  const suplentesOrdenados = Array.from(suplentes).map(id => atletasMap.get(id)).filter((a): a is Atleta => !!a)
  const membrosMap = new Map(membros.map(m => [m.id, m]))
  const staffOrdenado = Array.from(staffIds).map(id => membrosMap.get(id)).filter((m): m is Membro => !!m)

  const linhaAtletaExport = (atleta: Atleta, cor: 'brand' | 'info') => (
    <div key={atleta.id} className="flex items-center gap-2.5">
      <div className={cn('relative w-9 h-9 rounded-full bg-surface border-2 overflow-hidden grid place-items-center shrink-0', cor === 'brand' ? 'border-brand' : 'border-info')}>
        {atleta.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
        ) : <User className="w-4 h-4 text-faint" />}
        {atleta.numero_camisa != null && (
          <span className={cn('absolute -bottom-1 -right-1 min-w-4 h-4 px-1 rounded-full text-app text-[9px] font-bold grid place-items-center border-2 border-app', cor === 'brand' ? 'bg-brand' : 'bg-info')}>{atleta.numero_camisa}</span>
        )}
      </div>
      <span className={cn('text-sm truncate', cor === 'brand' ? 'text-strong font-medium' : 'text-soft')}>{atleta.nome}</span>
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/escalacoes" className="p-1.5 sm:p-2 text-faint hover:text-soft hover:bg-surface-2 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-strong tracking-tight">{escalacaoId ? 'Editar escalação' : 'Nova escalação'}</h1>
          <p className="text-sm text-soft mt-1">Arraste os atletas do elenco para o campo</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" onClick={handleExportar} disabled={exportando || totalTitulares === 0}>
            {exportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">Compartilhar imagem</span>
          </Button>
          <Button onClick={handleSalvar} disabled={salvando}>
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Salvar</span>
          </Button>
        </div>
      </div>

      {erro && <div className="bg-negative/10 text-negative text-sm p-3 rounded-xl border border-negative/20 mb-4">{erro}</div>}

      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            label="Clube"
            value={clubeId}
            onChange={(e) => { setClubeId(e.target.value); setJogoId(''); setSlots({}); setSuplentes(new Set()); setStaffIds(new Set()) }}
          >
            <option value="">Selecione</option>
            {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
          <Select label="Jogo (opcional)" value={jogoId} onChange={(e) => setJogoId(e.target.value)} disabled={!clubeId}>
            <option value="">Sem jogo vinculado</option>
            {jogos.map(j => <option key={j.id} value={j.id}>{j.adversario} — {new Date(j.data_jogo + 'T12:00:00').toLocaleDateString('pt-BR')}</option>)}
          </Select>
          <Select label="Formação" value={formacaoId} onChange={(e) => setFormacaoId(e.target.value)}>
            {FORMACOES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </Select>
          <Input label="Título" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: vs Palmeiras" />
        </div>
      </Card>

      {!clubeId ? (
        <Card className="text-center py-12">
          <p className="text-soft text-sm">Selecione um clube para montar a escalação.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6">
          <Card padding="sm">
            <div
              className="relative w-full max-w-[420px] mx-auto aspect-[68/100] rounded-2xl overflow-hidden select-none"
              style={{ background: 'repeating-linear-gradient(180deg, #1c6b3a 0, #1c6b3a 12.5%, #195f33 12.5%, #195f33 25%)' }}
            >
              <CampoMarcacoes />
              {formacao.slots.map(slot => {
                const atletaId = slots[slot.id]
                const atleta = atletaId ? atletasMap.get(atletaId) : null
                return (
                  <div
                    key={slot.id}
                    data-slot={slot.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                    style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  >
                    {atleta ? (
                      <div
                        onPointerDown={beginDrag(atleta.id, { kind: 'slot', slotId: slot.id })}
                        className={cn('touch-none flex flex-col items-center gap-0.5 cursor-grab active:cursor-grabbing', draggingId === atleta.id && 'opacity-30')}
                      >
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border-2 border-brand overflow-hidden grid place-items-center shadow-lg shadow-black/40">
                          {atleta.foto_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                          ) : <User className="w-4 h-4 text-faint" />}
                          {atleta.numero_camisa != null && (
                            <span className="absolute -bottom-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-app text-[9px] font-bold grid place-items-center tabular-nums border border-app">{atleta.numero_camisa}</span>
                          )}
                        </div>
                        <span className="max-w-[60px] truncate text-[9px] text-white font-semibold text-center leading-tight bg-black/50 px-1 rounded">{primeiroNome(atleta.nome)}</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-white/40 grid place-items-center text-[9px] text-white/70 font-bold">
                        {slot.label}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-center text-xs text-faint mt-3">{totalTitulares} de {formacao.slots.length} posições preenchidas</p>
          </Card>

          <div className="flex flex-col gap-4">
            <Card padding="sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint mb-3 px-1">Elenco — arraste para o campo</p>
              <div data-roster-drop className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
                {atletas.length === 0 ? (
                  <p className="text-sm text-faint text-center py-6">Nenhum atleta cadastrado nesse clube.</p>
                ) : atletas.map(atleta => {
                  const slotId = slotByAtleta.get(atleta.id)
                  const emCampo = !!slotId
                  const isSuplente = suplentes.has(atleta.id)
                  return (
                    <div key={atleta.id} className={cn('flex items-center gap-2.5 p-2 rounded-xl border transition-colors', emCampo ? 'bg-brand-soft border-brand/30' : isSuplente ? 'bg-info/5 border-info/30' : 'bg-app border-line')}>
                      <div
                        onPointerDown={!emCampo ? beginDrag(atleta.id, { kind: 'roster' }) : undefined}
                        className={cn('shrink-0 relative w-10 h-10 rounded-full bg-surface-2 border overflow-hidden grid place-items-center', emCampo ? 'border-brand' : 'border-line cursor-grab active:cursor-grabbing touch-none', draggingId === atleta.id && 'opacity-30')}
                      >
                        {atleta.foto_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                        ) : <User className="w-4 h-4 text-faint" />}
                        {atleta.numero_camisa != null && (
                          <span className="absolute -bottom-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-brand text-app text-[9px] font-bold grid place-items-center tabular-nums border border-app">{atleta.numero_camisa}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-strong truncate">{atleta.nome}</p>
                        <p className="text-[11px] text-faint truncate">{atleta.posicao || 'Sem posição'}</p>
                      </div>
                      {emCampo ? (
                        <Badge variant="brand" size="sm">{formacao.slots.find(s => s.id === slotId)?.label}</Badge>
                      ) : (
                        <button type="button" onClick={() => toggleSuplente(atleta.id)} className={cn('text-[10px] font-semibold px-2 py-1 rounded-lg border shrink-0 transition-colors', isSuplente ? 'bg-info/15 text-info border-info/30' : 'text-faint border-line hover:text-strong hover:border-line-strong')}>
                          {isSuplente ? 'Banco' : '+ banco'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card padding="sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-faint mb-3 px-1">Comissão técnica</p>
              {membros.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-faint mb-2">Nenhum membro cadastrado nesse clube.</p>
                  <Link href="/comissao-tecnica/novo" className="text-xs text-brand hover:text-brand-hover">Cadastrar treinador / staff</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mb-4">
                  {membros.map(membro => {
                    const selecionado = staffIds.has(membro.id)
                    return (
                      <button
                        type="button"
                        key={membro.id}
                        onClick={() => toggleStaff(membro.id)}
                        className={cn('flex items-center gap-2.5 p-2 rounded-xl border text-left transition-colors', selecionado ? 'bg-brand-soft border-brand/30' : 'bg-app border-line hover:border-line-strong')}
                      >
                        <div className="shrink-0 w-9 h-9 rounded-full bg-surface-2 border border-line overflow-hidden grid place-items-center">
                          {membro.foto_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={membro.foto_url} alt={membro.nome} className="w-full h-full object-cover" />
                          ) : <UsersRound className="w-4 h-4 text-faint" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-strong truncate">{membro.nome}</p>
                          <p className="text-[11px] text-faint truncate">{membro.funcao}</p>
                        </div>
                        {selecionado && <Badge variant="brand" size="sm">Na escalação</Badge>}
                      </button>
                    )
                  })}
                </div>
              )}
              <Input label="Treinador (texto livre, opcional)" value={treinador} onChange={(e) => setTreinador(e.target.value)} placeholder="Usado só se a comissão acima estiver vazia" className="mb-3" />
              <Textarea label="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Notas sobre a escalação (opcional)" rows={3} />
            </Card>
          </div>
        </div>
      )}

      {draggingId && dragPos && (
        <div
          className="fixed z-50 pointer-events-none w-12 h-12 rounded-full border-2 border-brand overflow-hidden shadow-2xl shadow-black/60"
          style={{ left: dragPos.x - 24, top: dragPos.y - 24 }}
        >
          {atletasMap.get(draggingId)?.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={atletasMap.get(draggingId)!.foto_url!} alt="" className="w-full h-full object-cover bg-surface" />
          ) : <div className="w-full h-full bg-surface grid place-items-center"><User className="w-5 h-5 text-faint" /></div>}
        </div>
      )}

      {/* Template de exportação, renderizado fora da viewport e capturado via html2canvas */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden>
        <div ref={exportRef} className="w-[900px] bg-app p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-line">
            {clubeAtual?.escudo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={clubeAtual.escudo_url} alt="" className="w-14 h-14 object-contain" />
            )}
            <div>
              <p className="text-2xl font-bold text-strong">{clubeAtual?.nome || 'Time'}</p>
              <p className="text-sm text-soft">{nome || 'Escalação'} · {formacao.label}{treinador ? ` · Treinador: ${treinador}` : ''}</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div
              className="relative w-[420px] aspect-[68/100] rounded-2xl overflow-hidden shrink-0"
              style={{ background: 'repeating-linear-gradient(180deg, #1c6b3a 0, #1c6b3a 12.5%, #195f33 12.5%, #195f33 25%)' }}
            >
              <CampoMarcacoes />
              {titularesOrdenados.map(({ slot, atleta }) => (
                <div key={slot.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  <div className="relative w-14 h-14 rounded-full bg-surface border-2 border-brand overflow-hidden grid place-items-center shadow-lg">
                    {atleta.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={atleta.foto_url} alt={atleta.nome} className="w-full h-full object-cover" />
                    ) : <User className="w-6 h-6 text-faint" />}
                    {atleta.numero_camisa != null && (
                      <span className="absolute -bottom-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-brand text-app text-[11px] font-bold grid place-items-center border-2 border-app">{atleta.numero_camisa}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2.5">Titulares</p>
                <div className="flex flex-col gap-2">
                  {titularesOrdenados.map(({ atleta }) => linhaAtletaExport(atleta, 'brand'))}
                </div>
              </div>
              {suplentesOrdenados.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-info mb-2.5">Suplentes</p>
                  <div className="flex flex-col gap-2">
                    {suplentesOrdenados.map(atleta => linhaAtletaExport(atleta, 'info'))}
                  </div>
                </div>
              )}
              {staffOrdenado.length > 0 ? (
                <div className="mt-auto pt-4 border-t border-line">
                  <p className="text-xs font-bold uppercase tracking-widest text-faint mb-2">Comissão Técnica</p>
                  <div className="flex flex-wrap gap-3">
                    {staffOrdenado.map(membro => (
                      <div key={membro.id} className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-surface border border-line overflow-hidden grid place-items-center shrink-0">
                          {membro.foto_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={membro.foto_url} alt={membro.nome} className="w-full h-full object-cover" />
                          ) : <UsersRound className="w-4 h-4 text-faint" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-strong truncate">{membro.nome}</p>
                          <p className="text-[10px] text-faint truncate">{membro.funcao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : treinador ? (
                <div className="mt-auto pt-4 border-t border-line">
                  <p className="text-xs text-faint uppercase tracking-wider">Treinador</p>
                  <p className="text-sm text-strong font-medium">{treinador}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampoMarcacoes() {
  return (
    <svg viewBox="0 0 68 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <g fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4">
        <rect x="1" y="1" width="66" height="98" />
        <line x1="1" y1="50" x2="67" y2="50" />
        <circle cx="34" cy="50" r="9" />
        <circle cx="34" cy="50" r="0.6" fill="rgba(255,255,255,0.5)" stroke="none" />
        <rect x="14" y="1" width="40" height="16" />
        <rect x="24" y="1" width="20" height="6" />
        <rect x="14" y="83" width="40" height="16" />
        <rect x="24" y="93" width="20" height="6" />
        <path d="M 25 17 A 9 9 0 0 0 43 17" />
        <path d="M 25 83 A 9 9 0 0 1 43 83" />
      </g>
    </svg>
  )
}
