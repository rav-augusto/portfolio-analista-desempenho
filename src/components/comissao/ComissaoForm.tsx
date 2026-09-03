'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { convertToWebP } from '@/lib/imageUtils'
import { ArrowLeft, Save, Loader2, Upload, UsersRound } from 'lucide-react'
import { Card, Button, Select, Input, Spinner } from '@/components/app'

type Clube = { id: string; nome: string }

const FUNCOES = [
  'Treinador',
  'Auxiliar Técnico',
  'Preparador Físico',
  'Preparador de Goleiros',
  'Analista de Desempenho',
  'Fisioterapeuta',
  'Massagista',
  'Roupeiro',
  'Coordenador Técnico',
  'Outro',
]

export function ComissaoForm({ membroId }: { membroId?: string }) {
  const router = useRouter()
  const supabase = createClient()
  const { user: usuario } = useUser()

  const [carregando, setCarregando] = useState(!!membroId)
  const [clubes, setClubes] = useState<Clube[]>([])
  const [clubeId, setClubeId] = useState('')
  const [nome, setNome] = useState('')
  const [funcao, setFuncao] = useState(FUNCOES[0])
  const [funcaoCustom, setFuncaoCustom] = useState('')
  const [telefone, setTelefone] = useState('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoAtualUrl, setFotoAtualUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('clubes').select('id, nome').order('nome').then(({ data }) => {
      if (data) setClubes(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!membroId) return
    supabase.from('comissao_tecnica').select('*').eq('id', membroId).single().then(({ data }) => {
      if (data) {
        setClubeId(data.clube_id)
        setNome(data.nome)
        if (FUNCOES.includes(data.funcao)) {
          setFuncao(data.funcao)
        } else {
          setFuncao('Outro')
          setFuncaoCustom(data.funcao)
        }
        setTelefone(data.telefone || '')
        setFotoAtualUrl(data.foto_url)
      }
      setCarregando(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membroId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const webpBlob = await convertToWebP(file, 0.85, 400)
      const webpFile = new File([webpBlob], 'foto.webp', { type: 'image/webp' })
      setFotoFile(webpFile)
      setFotoPreview(URL.createObjectURL(webpBlob))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let fotoUrl = fotoAtualUrl

    if (fotoFile) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
      const { error: uploadError } = await supabase.storage.from('comissao').upload(fileName, fotoFile)
      if (uploadError) { setError('Erro ao fazer upload da foto'); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('comissao').getPublicUrl(fileName)
      fotoUrl = urlData.publicUrl
    }

    const payload = {
      clube_id: clubeId,
      nome,
      funcao: funcao === 'Outro' ? (funcaoCustom || 'Outro') : funcao,
      telefone: telefone || null,
      foto_url: fotoUrl,
    }

    const { error } = membroId
      ? await supabase.from('comissao_tecnica').update(payload).eq('id', membroId)
      : await supabase.from('comissao_tecnica').insert({ ...payload, criado_por: usuario?.id || null })

    if (error) { setError('Erro ao salvar membro'); setLoading(false); return }

    router.push('/comissao-tecnica')
  }

  if (carregando) {
    return <div className="flex justify-center py-16"><Spinner size="lg" label="Carregando..." /></div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/comissao-tecnica" className="p-1.5 sm:p-2 text-faint hover:text-soft hover:bg-surface-2 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-strong tracking-tight">{membroId ? 'Editar membro' : 'Novo membro'}</h1>
          <p className="text-sm text-soft mt-1">Treinador, auxiliares e demais integrantes do departamento</p>
        </div>
      </div>

      <Card padding="md" className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-faint mb-1.5">Foto</label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-surface-2/80 transition-colors overflow-hidden border-2 border-dashed border-line shrink-0"
              >
                {fotoPreview || fotoAtualUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fotoPreview || fotoAtualUrl || ''} alt="Preview" className="w-full h-full object-cover" />
                ) : <UsersRound className="w-7 h-7 text-faint" />}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 text-sm text-soft hover:text-strong">
                <Upload className="w-4 h-4" /> Selecionar foto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Clube" value={clubeId} onChange={(e) => setClubeId(e.target.value)} required>
              <option value="">Selecione</option>
              {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Select label="Função" value={funcao} onChange={(e) => setFuncao(e.target.value)}>
              {FUNCOES.map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>

          {funcao === 'Outro' && (
            <Input label="Especifique a função" value={funcaoCustom} onChange={(e) => setFuncaoCustom(e.target.value)} placeholder="Ex: Nutricionista" />
          )}

          <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: Arthur Trevisan" />
          <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />

          {error && <div className="bg-negative/10 text-negative text-sm p-3 rounded-xl border border-negative/20">{error}</div>}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-line">
            <Link href="/comissao-tecnica" className="px-4 py-2 text-center text-soft hover:bg-surface-2 rounded-xl transition-colors order-2 sm:order-1">Cancelar</Link>
            <Button type="submit" disabled={loading} className="order-1 sm:order-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
