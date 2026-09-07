'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils/cn'
import {
  ArrowLeft, Save, Loader2, Download, Upload, ArrowUpRight, Minus, Circle, Type, Undo2, Trash2,
} from 'lucide-react'
import { Card, Button, Select, Input, Textarea, Spinner } from '@/components/app'

type Atleta = { id: string; nome: string; clubes: { nome: string } | { nome: string }[] | null }

type Ferramenta = 'seta' | 'linha' | 'circulo' | 'texto'

type Forma =
  | { tipo: 'seta' | 'linha' | 'circulo'; x1: number; y1: number; x2: number; y2: number; cor: string }
  | { tipo: 'texto'; x1: number; y1: number; texto: string; cor: string }

const CORES = ['#ef4444', '#eab308', '#3b82f6', '#ffffff', '#22c55e']

function desenharForma(ctx: CanvasRenderingContext2D, f: Forma, w: number, h: number) {
  const x1 = (f.x1 / 100) * w
  const y1 = (f.y1 / 100) * h
  ctx.strokeStyle = f.cor
  ctx.fillStyle = f.cor
  ctx.lineWidth = Math.max(3, w * 0.005)
  ctx.lineCap = 'round'

  if (f.tipo === 'texto') {
    const tamanhoFonte = Math.max(18, w * 0.028)
    ctx.font = `bold ${tamanhoFonte}px system-ui, sans-serif`
    ctx.textBaseline = 'top'
    const largura = ctx.measureText(f.texto).width
    ctx.fillStyle = 'rgba(0,0,0,0.65)'
    ctx.fillRect(x1 - 5, y1 - 3, largura + 10, tamanhoFonte + 8)
    ctx.fillStyle = f.cor
    ctx.fillText(f.texto, x1, y1)
    return
  }

  const x2 = (f.x2 / 100) * w
  const y2 = (f.y2 / 100) * h

  if (f.tipo === 'circulo') {
    const raio = Math.hypot(x2 - x1, y2 - y1)
    ctx.beginPath()
    ctx.arc(x1, y1, raio, 0, Math.PI * 2)
    ctx.stroke()
    return
  }

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  if (f.tipo === 'seta') {
    const angulo = Math.atan2(y2 - y1, x2 - x1)
    const tam = Math.max(16, w * 0.022)
    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - tam * Math.cos(angulo - Math.PI / 6), y2 - tam * Math.sin(angulo - Math.PI / 6))
    ctx.lineTo(x2 - tam * Math.cos(angulo + Math.PI / 6), y2 - tam * Math.sin(angulo + Math.PI / 6))
    ctx.closePath()
    ctx.fill()
  }
}

const FERRAMENTAS: { id: Ferramenta; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'seta', label: 'Seta', icon: ArrowUpRight },
  { id: 'linha', label: 'Linha', icon: Minus },
  { id: 'circulo', label: 'Círculo', icon: Circle },
  { id: 'texto', label: 'Texto', icon: Type },
]

export function AnotacaoEditor({ anotacaoId }: { anotacaoId?: string }) {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useUser()

  const [carregando, setCarregando] = useState(!!anotacaoId)
  const [salvando, setSalvando] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [erro, setErro] = useState('')

  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [atletaId, setAtletaId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [imagemUrlAtual, setImagemUrlAtual] = useState<string | null>(null)
  const [novoArquivo, setNovoArquivo] = useState<File | null>(null)
  const [novaPreviewUrl, setNovaPreviewUrl] = useState<string | null>(null)
  const [imagemPronta, setImagemPronta] = useState(false)

  const [formas, setFormas] = useState<Forma[]>([])
  const [emProgresso, setEmProgresso] = useState<Forma | null>(null)
  const [ferramenta, setFerramenta] = useState<Ferramenta>('seta')
  const [cor, setCor] = useState(CORES[0])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const imagemFonte = novaPreviewUrl || imagemUrlAtual

  useEffect(() => {
    supabase.from('atletas').select('id, nome, clubes(nome)').order('nome').then(({ data }) => {
      if (data) setAtletas(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!anotacaoId) return
    supabase.from('anotacoes_taticas').select('*').eq('id', anotacaoId).single().then(({ data }) => {
      if (data) {
        setAtletaId(data.atleta_id)
        setTitulo(data.titulo || '')
        setObservacoes(data.observacoes || '')
        setImagemUrlAtual(data.imagem_original_url)
        setFormas(Array.isArray(data.formas) ? data.formas : [])
      }
      setCarregando(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anotacaoId])

  const redesenhar = useCallback(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    for (const f of formas) desenharForma(ctx, f, canvas.width, canvas.height)
    if (emProgresso) desenharForma(ctx, emProgresso, canvas.width, canvas.height)
  }, [formas, emProgresso])

  useEffect(() => {
    redesenhar()
  }, [redesenhar])

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNovoArquivo(file)
    setNovaPreviewUrl(URL.createObjectURL(file))
    setImagemPronta(false)
    setFormas([])
    setEmProgresso(null)
  }

  const paraPercentual = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!imagemPronta) return
    e.preventDefault()
    const { x, y } = paraPercentual(e)
    if (ferramenta === 'texto') {
      const texto = window.prompt('Texto da anotação:')
      if (texto && texto.trim()) setFormas(prev => [...prev, { tipo: 'texto', x1: x, y1: y, texto: texto.trim(), cor }])
      return
    }
    setEmProgresso({ tipo: ferramenta, x1: x, y1: y, x2: x, y2: y, cor })
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!emProgresso) return
    const { x, y } = paraPercentual(e)
    setEmProgresso(prev => (prev && prev.tipo !== 'texto' ? { ...prev, x2: x, y2: y } : prev))
  }

  const handlePointerUp = () => {
    if (emProgresso) {
      setFormas(prev => [...prev, emProgresso])
      setEmProgresso(null)
    }
  }

  const desfazer = () => setFormas(prev => prev.slice(0, -1))
  const limparTudo = () => setFormas([])

  const uploadImagem = async (blob: Blob, ext: string): Promise<string | null> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('anotacoes').upload(fileName, blob)
    if (error) return null
    const { data } = supabase.storage.from('anotacoes').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSalvar = async () => {
    setErro('')
    if (!atletaId) { setErro('Selecione o atleta.'); return }
    if (!imagemFonte) { setErro('Envie uma imagem (print do vídeo) primeiro.'); return }
    setSalvando(true)

    let imagemOriginalUrl = imagemUrlAtual
    if (novoArquivo) {
      const ext = novoArquivo.name.split('.').pop() || 'jpg'
      const url = await uploadImagem(novoArquivo, ext)
      if (!url) { setErro('Erro ao enviar a imagem original.'); setSalvando(false); return }
      imagemOriginalUrl = url
    }

    const canvas = canvasRef.current
    if (!canvas) { setErro('Erro ao gerar a imagem anotada.'); setSalvando(false); return }
    const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
    let imagemAnotadaUrl: string | null = null
    if (blob) imagemAnotadaUrl = await uploadImagem(blob, 'jpg')

    const payload = {
      atleta_id: atletaId,
      titulo: titulo || null,
      observacoes: observacoes || null,
      imagem_original_url: imagemOriginalUrl,
      imagem_anotada_url: imagemAnotadaUrl,
      formas,
    }

    const { error } = anotacaoId
      ? await supabase.from('anotacoes_taticas').update(payload).eq('id', anotacaoId)
      : await supabase.from('anotacoes_taticas').insert({ ...payload, criado_por: user?.id || null })

    if (error) { setErro('Erro ao salvar a anotação.'); setSalvando(false); return }
    router.push('/anotacoes')
  }

  const handleExportar = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setExportando(true)
    try {
      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `anotacao-${(titulo || 'atleta').toLowerCase().replace(/\s+/g, '-')}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportando(false)
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando anotação..." /></div>
  }

  const getClubeNome = (c: Atleta['clubes']) => (Array.isArray(c) ? c[0]?.nome : c?.nome) || ''

  return (
    <div>
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/anotacoes" className="p-1.5 sm:p-2 text-faint hover:text-soft hover:bg-surface-2 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-strong tracking-tight">{anotacaoId ? 'Editar anotação' : 'Nova anotação'}</h1>
          <p className="text-sm text-soft mt-1">Desenhe em cima do print do vídeo ou da foto</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" onClick={handleExportar} disabled={exportando || !imagemPronta}>
            {exportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">Baixar JPG</span>
          </Button>
          <Button onClick={handleSalvar} disabled={salvando}>
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Salvar</span>
          </Button>
        </div>
      </div>

      {erro && <div className="bg-negative/10 text-negative text-sm p-3 rounded-xl border border-negative/20 mb-4">{erro}</div>}

      <Card padding="sm" className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select label="Atleta" value={atletaId} onChange={(e) => setAtletaId(e.target.value)}>
            <option value="">Selecione</option>
            {atletas.map(a => <option key={a.id} value={a.id}>{a.nome}{getClubeNome(a.clubes) ? ` — ${getClubeNome(a.clubes)}` : ''}</option>)}
          </Select>
          <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Posicionamento defensivo aos 12min" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        <Card padding="sm">
          {!imagemFonte ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-line rounded-2xl">
              <Upload className="w-8 h-8 text-faint mb-3" />
              <p className="text-sm text-soft mb-3">Envie um print do vídeo ou uma foto</p>
              <Button size="sm" onClick={() => fileInputRef.current?.click()}>Selecionar imagem</Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleArquivo} className="hidden" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {FERRAMENTAS.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFerramenta(f.id)}
                    className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', ferramenta === f.id ? 'bg-brand text-app border-brand' : 'bg-app text-soft border-line hover:border-line-strong')}
                  >
                    <f.icon className="w-3.5 h-3.5" /> {f.label}
                  </button>
                ))}
                <div className="w-px h-6 bg-line mx-1" />
                {CORES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCor(c)}
                    aria-label={`Cor ${c}`}
                    className={cn('w-6 h-6 rounded-full border-2', cor === c ? 'border-brand' : 'border-line')}
                    style={{ background: c }}
                  />
                ))}
                <div className="w-px h-6 bg-line mx-1" />
                <button type="button" onClick={desfazer} disabled={formas.length === 0} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-line text-soft hover:border-line-strong disabled:opacity-40">
                  <Undo2 className="w-3.5 h-3.5" /> Desfazer
                </button>
                <button type="button" onClick={limparTudo} disabled={formas.length === 0} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-line text-negative hover:border-negative/40 disabled:opacity-40">
                  <Trash2 className="w-3.5 h-3.5" /> Limpar
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="ml-auto text-xs text-brand hover:text-brand-hover">Trocar imagem</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleArquivo} className="hidden" />
              </div>

              <div className="relative w-full overflow-hidden rounded-xl border border-line bg-app">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imagemFonte}
                  alt=""
                  crossOrigin="anonymous"
                  className="hidden"
                  onLoad={() => { setImagemPronta(true); redesenhar() }}
                />
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="w-full h-auto touch-none cursor-crosshair"
                />
              </div>
            </>
          )}
        </Card>

        <Card padding="sm">
          <Textarea label="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="O que você quer destacar pro atleta/responsável" rows={8} />
        </Card>
      </div>
    </div>
  )
}
