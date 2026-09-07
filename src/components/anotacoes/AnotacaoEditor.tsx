'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { ArrowLeft, Save, Loader2, Download, Upload, Camera } from 'lucide-react'
import { Card, Button, Select, Input, Textarea, Spinner } from '@/components/app'
import { BarraFerramentas } from '@/components/desenho/BarraFerramentas'
import { desenharForma, CORES_DESENHO, FERRAMENTAS_ARRASTO, type Forma, type FerramentaDesenho } from '@/lib/desenho'

type Atleta = { id: string; nome: string; clubes: { nome: string } | { nome: string }[] | null }

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
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const [formas, setFormas] = useState<Forma[]>([])
  const [emProgresso, setEmProgresso] = useState<Forma | null>(null)
  const [ferramenta, setFerramenta] = useState<FerramentaDesenho>('seta')
  const [cor, setCor] = useState(CORES_DESENHO[0])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
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
    setImagemPronta(false)
    setFormas([])
    setEmProgresso(null)
    if (file.type.startsWith('video/')) {
      setVideoUrl(URL.createObjectURL(file))
      setNovoArquivo(null)
      setNovaPreviewUrl(null)
      return
    }
    setVideoUrl(null)
    setNovoArquivo(file)
    setNovaPreviewUrl(URL.createObjectURL(file))
  }

  const capturarQuadro = () => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const off = document.createElement('canvas')
    off.width = video.videoWidth
    off.height = video.videoHeight
    const ctx = off.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    off.toBlob((blob) => {
      if (!blob) return
      setNovoArquivo(new File([blob], 'quadro-capturado.jpg', { type: 'image/jpeg' }))
      setNovaPreviewUrl(URL.createObjectURL(blob))
      setVideoUrl(null)
    }, 'image/jpeg', 0.92)
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
          {videoUrl ? (
            <div className="flex flex-col items-center">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                className="w-full rounded-xl border border-line bg-app max-h-[70vh]"
              />
              <p className="text-xs text-faint mt-2 text-center">O vídeo fica só no seu aparelho — nada é enviado. Pause no momento certo e capture o quadro.</p>
              <Button className="mt-3" onClick={capturarQuadro}>
                <Camera className="w-4 h-4" /> Capturar quadro
              </Button>
              <button type="button" onClick={() => { setVideoUrl(null); fileInputRef.current?.click() }} className="mt-2 text-xs text-brand hover:text-brand-hover">Escolher outro arquivo</button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleArquivo} className="hidden" />
            </div>
          ) : !imagemFonte ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-line rounded-2xl">
              <Upload className="w-8 h-8 text-faint mb-3" />
              <p className="text-sm text-soft mb-3">Envie um print, uma foto, ou o vídeo direto</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="w-3.5 h-3.5" /> Selecionar arquivo</Button>
              </div>
              <p className="text-xs text-faint mt-3">Vídeo: toca no seu aparelho, você pausa e captura o quadro — nada é enviado até isso</p>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleArquivo} className="hidden" />
            </div>
          ) : (
            <>
              <BarraFerramentas
                ferramenta={ferramenta}
                onFerramenta={setFerramenta}
                cor={cor}
                onCor={setCor}
                podeDesfazer={formas.length > 0}
                onDesfazer={desfazer}
                onLimpar={limparTudo}
                extra={
                  <>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="ml-auto text-xs text-brand hover:text-brand-hover">Trocar imagem/vídeo</button>
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleArquivo} className="hidden" />
                  </>
                }
              />

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
