'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, User, X, Check, ZoomIn, ZoomOut } from 'lucide-react'
import Link from 'next/link'
import AvatarEditor from 'react-avatar-editor'
import { convertToWebP } from '@/lib/imageUtils'

type Clube = {
  id: string
  nome: string
}

const posicoes = [
  'Goleiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Zagueiro',
  'Volante',
  'Meio-Campo',
  'Meia Atacante',
  'Ponta Direita',
  'Ponta Esquerda',
  'Centroavante',
  'Atacante'
]

const pesDominantes = [
  { value: 'direito', label: 'Destro' },
  { value: 'esquerdo', label: 'Canhoto' },
  { value: 'ambidestro', label: 'Ambidestro' }
]

const categorias = [
  'Sub-9',
  'Sub-10',
  'Sub-11',
  'Sub-12',
  'Sub-13',
  'Sub-14',
  'Sub-15',
  'Sub-16',
  'Sub-17',
  'Sub-20',
  'Profissional'
]

const nacionalidades = [
  'Brasil',
  'Argentina',
  'Uruguai',
  'Paraguai',
  'Chile',
  'Colômbia',
  'Venezuela',
  'Peru',
  'Equador',
  'Bolívia',
  'Portugal',
  'Espanha',
  'Itália',
  'Alemanha',
  'França',
  'Inglaterra',
  'Holanda',
  'Bélgica',
  'Outro'
]

export default function EditarAtletaPage() {
  const [clubes, setClubes] = useState<Clube[]>([])
  const [clubeId, setClubeId] = useState('')
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [posicao, setPosicao] = useState('')
  const [posicaoSecundaria, setPosicaoSecundaria] = useState('')
  const [categoria, setCategoria] = useState('')
  const [numeroCamisa, setNumeroCamisa] = useState('')
  const [peDominante, setPeDominante] = useState('')
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [nacionalidade, setNacionalidade] = useState('Brasil')
  const [naturalidade, setNaturalidade] = useState('')
  const [telefone, setTelefone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [nomeResponsavel, setNomeResponsavel] = useState('')
  const [telefoneResponsavel, setTelefoneResponsavel] = useState('')
  const [clubesAnteriores, setClubesAnteriores] = useState('')
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoCropped, setFotoCropped] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [zoom, setZoom] = useState(1.2)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<AvatarEditor>(null)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const [clubesRes, atletaRes] = await Promise.all([
        supabase.from('clubes').select('id, nome').order('nome'),
        supabase.from('atletas').select('*').eq('id', params.id).single()
      ])

      if (clubesRes.data) setClubes(clubesRes.data)

      if (atletaRes.error || !atletaRes.data) {
        router.push('/atletas')
        return
      }

      const a = atletaRes.data
      setClubeId(a.clube_id || '')
      setNome(a.nome)
      setDataNascimento(a.data_nascimento || '')
      setPosicao(a.posicao || '')
      setPosicaoSecundaria(a.posicao_secundaria || '')
      setCategoria(a.categoria || '')
      setNumeroCamisa(a.numero_camisa?.toString() || '')
      setPeDominante(a.pe_dominante || '')
      setAltura(a.altura?.toString() || '')
      setPeso(a.peso?.toString() || '')
      setNacionalidade(a.nacionalidade || 'Brasil')
      setNaturalidade(a.naturalidade || '')
      setTelefone(a.telefone || '')
      setInstagram(a.instagram || '')
      setNomeResponsavel(a.nome_responsavel || '')
      setTelefoneResponsavel(a.telefone_responsavel || '')
      setClubesAnteriores(a.clubes_anteriores || '')
      setFotoUrl(a.foto_url)
      setFotoCropped(a.foto_url)
      setLoading(false)
    }
    loadData()
  }, [params.id, router, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoPreview(reader.result as string)
        setShowEditor(true)
        setZoom(1.2)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropConfirm = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      canvas.toBlob(async (blob) => {
        if (blob) {
          const webpBlob = await convertToWebP(blob, 0.85, 400)
          const croppedUrl = URL.createObjectURL(webpBlob)
          setFotoCropped(croppedUrl)
          setFotoFile(new File([webpBlob], 'foto.webp', { type: 'image/webp' }))
        }
      }, 'image/png', 1)
    }
    setShowEditor(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    let newFotoUrl = fotoUrl

    if (fotoFile) {
      const fileExt = fotoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('atletas')
        .upload(fileName, fotoFile)

      if (uploadError) {
        setError('Erro ao fazer upload da foto')
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage.from('atletas').getPublicUrl(fileName)
      newFotoUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('atletas').update({
      clube_id: clubeId,
      nome,
      data_nascimento: dataNascimento || null,
      posicao: posicao || null,
      posicao_secundaria: posicaoSecundaria || null,
      categoria: categoria || null,
      numero_camisa: numeroCamisa ? parseInt(numeroCamisa) : null,
      pe_dominante: peDominante || null,
      altura: altura ? parseFloat(altura) : null,
      peso: peso ? parseFloat(peso) : null,
      nacionalidade: nacionalidade || null,
      naturalidade: naturalidade || null,
      telefone: telefone || null,
      instagram: instagram || null,
      nome_responsavel: nomeResponsavel || null,
      telefone_responsavel: telefoneResponsavel || null,
      clubes_anteriores: clubesAnteriores || null,
      foto_url: newFotoUrl
    }).eq('id', params.id)

    if (error) {
      setError('Erro ao salvar atleta')
      setSaving(false)
      return
    }

    router.push('/atletas')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div>
      {/* Modal do Editor de Foto */}
      {showEditor && fotoPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">Ajustar Foto</h3>
              <p className="text-sm text-slate-400">Arraste a foto para enquadrar o rosto</p>
            </div>

            <div className="p-4 flex justify-center bg-slate-700">
              <AvatarEditor
                ref={editorRef}
                image={fotoPreview}
                width={250}
                height={250}
                border={30}
                borderRadius={125}
                color={[0, 0, 0, 0.6]}
                scale={zoom}
                rotate={0}
              />
            </div>

            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <ZoomOut className="w-4 h-4 text-slate-500" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <ZoomIn className="w-4 h-4 text-slate-500" />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="flex-1 px-4 py-2 text-slate-400 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  className="flex-1 px-4 py-2 text-white bg-amber-500 rounded-xl hover:bg-amber-400 transition-colors"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/atletas"
          className="p-2 text-slate-500 hover:text-slate-400 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Editar Atleta</h1>
          <p className="text-slate-400 mt-1">Atualize os dados do atleta</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Foto e Dados Básicos */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-700">Dados Básicos</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Foto do Atleta
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors overflow-hidden border-2 border-dashed border-slate-600"
                  >
                    {fotoCropped ? (
                      <img src={fotoCropped} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="text-sm text-slate-400">
                    <p>Clique para alterar</p>
                    <p className="text-xs">PNG ou JPG - Você poderá ajustar</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-amber-500 mb-2">Clube *</label>
                  <select
                    value={clubeId}
                    onChange={(e) => setClubeId(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Selecione um clube</option>
                    {clubes.map((clube) => (
                      <option key={clube.id} value={clube.id}>{clube.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-amber-500 mb-2">Categoria *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Selecione</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Nacionalidade</label>
                  <select
                    value={nacionalidade}
                    onChange={(e) => setNacionalidade(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {nacionalidades.map((nac) => (
                      <option key={nac} value={nac}>{nac}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">Naturalidade (Cidade/Estado)</label>
                <input
                  type="text"
                  value={naturalidade}
                  onChange={(e) => setNaturalidade(e.target.value)}
                  placeholder="Ex: São Paulo/SP"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-700">Características</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Posição Principal</label>
                  <select
                    value={posicao}
                    onChange={(e) => setPosicao(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Selecione</option>
                    {posicoes.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Posição Secundária</label>
                  <select
                    value={posicaoSecundaria}
                    onChange={(e) => setPosicaoSecundaria(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Selecione</option>
                    {posicoes.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Número</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={numeroCamisa}
                    onChange={(e) => setNumeroCamisa(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Pé Dominante</label>
                  <select
                    value={peDominante}
                    onChange={(e) => setPeDominante(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Selecione</option>
                    {pesDominantes.map((pe) => (
                      <option key={pe.value} value={pe.value}>{pe.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Altura (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1.00"
                    max="2.50"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    placeholder="1.75"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="150"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="70.5"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Clubes Anteriores</label>
                  <input
                    type="text"
                    value={clubesAnteriores}
                    onChange={(e) => setClubesAnteriores(e.target.value)}
                    placeholder="Ex: Palmeiras, Santos"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-700">Contato</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Instagram</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@usuario"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Responsável */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-700">Responsável (Categorias de Base)</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Nome do Responsável</label>
                  <input
                    type="text"
                    value={nomeResponsavel}
                    onChange={(e) => setNomeResponsavel(e.target.value)}
                    placeholder="Nome do pai/mãe"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Telefone do Responsável</label>
                  <input
                    type="tel"
                    value={telefoneResponsavel}
                    onChange={(e) => setTelefoneResponsavel(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-4 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
            <Link
              href="/atletas"
              className="px-6 py-2 text-slate-400 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
