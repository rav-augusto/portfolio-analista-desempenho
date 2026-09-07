'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { ArrowLeft, Save, Loader2, Download } from 'lucide-react'
import { Card, Button, Select, Input, Textarea, Spinner } from '@/components/app'
import { BarraFerramentas } from '@/components/desenho/BarraFerramentas'
import { desenharForma, desenharCampo, CORES_DESENHO, FERRAMENTAS_ARRASTO, type Forma, type FerramentaDesenho } from '@/lib/desenho'

type Clube = { id: string; nome: string }

const LARGURA = 680
const ALTURA = 1000

export function PranchetaEditor({ pranchetaId }: { pranchetaId?: string }) {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useUser()

  const [carregando, setCarregando] = useState(!!pranchetaId)
  const [salvando, setSalvando] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [erro, setErro] = useState('')

  const [clubes, setClubes] = useState<Clube[]>([])
  const [clubeId, setClubeId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [formas, setFormas] = useState<Forma[]>([])
  const [emProgresso, setEmProgresso] = useState<Forma | null>(null)
  const [ferramenta, setFerramenta] = useState<FerramentaDesenho>('ficha')
  const [cor, setCor] = useState(CORES_DESENHO[0])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    supabase.from('clubes').select('id, nome').order('nome').then(({ data }) => {
      if (data) setClubes(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!pranchetaId) return
    supabase.from('pranchetas').select('*').eq('id', pranchetaId).single().then(({ data }) => {
      if (data) {
        setClubeId(data.clube_id)
        setTitulo(data.titulo || '')
        setObservacoes(data.observacoes || '')
        setFormas(Array.isArray(data.formas) ? data.formas : [])
      }
      setCarregando(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pranchetaId])

  const redesenhar = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    desenharCampo(ctx, canvas.width, canvas.height)
    for (const f of formas) desenharForma(ctx, f, canvas.width, canvas.height)
    if (emProgresso) desenharForma(ctx, emProgresso, canvas.width, canvas.height)
  }, [formas, emProgresso])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && (canvas.width !== LARGURA || canvas.height !== ALTURA)) {
      canvas.width = LARGURA
      canvas.height = ALTURA
    }
    redesenhar()
  }, [redesenhar])

  const paraPercentual = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const { x, y } = paraPercentual(e)
    if (ferramenta === 'texto') {
      const texto = window.prompt('Texto:')
      if (texto && texto.trim()) setFormas(prev => [...prev, { tipo: 'texto', x1: x, y1: y, texto: texto.trim(), cor }])
      return
    }
    if (ferramenta === 'ficha') {
      const numero = formas.filter(f => f.tipo === 'ficha' && f.cor === cor).length + 1
      setFormas(prev => [...prev, { tipo: 'ficha', x1: x, y1: y, numero, cor }])
      return
    }
    setEmProgresso({ tipo: ferramenta, x1: x, y1: y, x2: x, y2: y, cor })
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!emProgresso) return
    const { x, y } = paraPercentual(e)
    setEmProgresso(prev => (prev && FERRAMENTAS_ARRASTO.has(prev.tipo) ? { ...prev, x2: x, y2: y } : prev))
  }

  const handlePointerUp = () => {
    if (emProgresso) {
      setFormas(prev => [...prev, emProgresso])
      setEmProgresso(null)
    }
  }

  const desfazer = () => setFormas(prev => prev.slice(0, -1))
  const limparTudo = () => setFormas([])

  const handleSalvar = async () => {
    setErro('')
    if (!clubeId) { setErro('Selecione o clube.'); return }
    setSalvando(true)

    const canvas = canvasRef.current
    let imagemUrl: string | null = null
    if (canvas) {
      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))
      if (blob) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
        const { error: uploadError } = await supabase.storage.from('pranchetas').upload(fileName, blob)
        if (!uploadError) {
          const { data } = supabase.storage.from('pranchetas').getPublicUrl(fileName)
          imagemUrl = data.publicUrl
        }
      }
    }

    const payload = {
      clube_id: clubeId,
      titulo: titulo || null,
      observacoes: observacoes || null,
      formas,
      imagem_url: imagemUrl,
    }

    const { error } = pranchetaId
      ? await supabase.from('pranchetas').update(payload).eq('id', pranchetaId)
      : await supabase.from('pranchetas').insert({ ...payload, criado_por: user?.id || null })

    if (error) { setErro('Erro ao salvar a prancheta.'); setSalvando(false); return }
    router.push('/prancheta')
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
      a.download = `prancheta-${(titulo || 'jogada').toLowerCase().replace(/\s+/g, '-')}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportando(false)
    }
  }

  if (carregando) {
    return <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando prancheta..." /></div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/prancheta" className="p-1.5 sm:p-2 text-faint hover:text-soft hover:bg-surface-2 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-strong tracking-tight">{pranchetaId ? 'Editar prancheta' : 'Nova prancheta'}</h1>
          <p className="text-sm text-soft mt-1">Monte jogada, esquema ou exercício do zero</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" onClick={handleExportar} disabled={exportando}>
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
          <Select label="Clube" value={clubeId} onChange={(e) => setClubeId(e.target.value)}>
            <option value="">Selecione</option>
            {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
          <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Saída de bola contra pressão alta" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        <Card padding="sm">
          <BarraFerramentas
            ferramenta={ferramenta}
            onFerramenta={setFerramenta}
            cor={cor}
            onCor={setCor}
            podeDesfazer={formas.length > 0}
            onDesfazer={desfazer}
            onLimpar={limparTudo}
          />
          <div className="w-full overflow-hidden rounded-xl border border-line" style={{ maxWidth: 520, margin: '0 auto' }}>
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-auto touch-none cursor-crosshair"
            />
          </div>
          <p className="text-xs text-faint text-center mt-3">Ficha coloca jogador; escolha a cor pra distinguir os dois times</p>
        </Card>

        <Card padding="sm">
          <Textarea label="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Contexto do exercício/jogada" rows={8} />
        </Card>
      </div>
    </div>
  )
}
