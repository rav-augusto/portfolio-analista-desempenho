'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react'
import Link from 'next/link'
import { convertToWebP } from '@/lib/imageUtils'

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function EditarClubePage() {
  const [nome, setNome] = useState('')
  const [sigla, setSigla] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('SP')
  const [endereco, setEndereco] = useState('')
  const [estadioCt, setEstadioCt] = useState('')
  const [categoria, setCategoria] = useState('')
  const [instagram, setInstagram] = useState('')
  const [contatoNome, setContatoNome] = useState('')
  const [contatoEmail, setContatoEmail] = useState('')
  const [contatoTelefone, setContatoTelefone] = useState('')
  const [escudoUrl, setEscudoUrl] = useState<string | null>(null)
  const [escudoFile, setEscudoFile] = useState<File | null>(null)
  const [escudoPreview, setEscudoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const webpBlob = await convertToWebP(file, 0.85, 400)
      const webpFile = new File([webpBlob], 'escudo.webp', { type: 'image/webp' })
      setEscudoFile(webpFile)
      setEscudoPreview(URL.createObjectURL(webpBlob))
    }
  }

  useEffect(() => {
    const loadClube = async () => {
      const { data, error } = await supabase
        .from('clubes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) {
        router.push('/clubes')
        return
      }

      setNome(data.nome)
      setSigla(data.sigla || '')
      setCidade(data.cidade || '')
      setEstado(data.estado || 'SP')
      setEndereco(data.endereco || '')
      setEstadioCt(data.estadio_ct || '')
      setCategoria(data.categoria || '')
      setInstagram(data.instagram || '')
      setContatoNome(data.contato_nome || '')
      setContatoEmail(data.contato_email || '')
      setContatoTelefone(data.contato_telefone || '')
      setEscudoUrl(data.escudo_url)
      setEscudoPreview(data.escudo_url)
      setLoading(false)
    }
    loadClube()
  }, [params.id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    let newEscudoUrl = escudoUrl

    if (escudoFile) {
      const fileExt = escudoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('escudos')
        .upload(fileName, escudoFile)

      if (uploadError) {
        setError('Erro ao fazer upload do escudo')
        setSaving(false)
        return
      }

      const { data: urlData } = supabase.storage.from('escudos').getPublicUrl(fileName)
      newEscudoUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('clubes')
      .update({
        nome,
        sigla: sigla || null,
        cidade,
        estado,
        endereco: endereco || null,
        estadio_ct: estadioCt || null,
        categoria: categoria || null,
        instagram: instagram || null,
        contato_nome: contatoNome || null,
        contato_email: contatoEmail || null,
        contato_telefone: contatoTelefone || null,
        escudo_url: newEscudoUrl
      })
      .eq('id', params.id)

    if (error) {
      setError('Erro ao salvar clube')
      setSaving(false)
      return
    }

    router.push('/clubes')
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/clubes"
          className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Editar Clube</h1>
          <p className="text-slate-400 mt-1">Atualize as informacoes do clube</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Dados Basicos */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-700">Dados do Clube</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Escudo do Clube
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 bg-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors overflow-hidden border-2 border-dashed border-slate-600"
                  >
                    {escudoPreview ? (
                      <img src={escudoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                        <span className="text-xs text-slate-500">Upload</span>
                      </div>
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
                    <p>Clique para selecionar</p>
                    <p className="text-xs">PNG, JPG ou SVG</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Nome do Clube *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Ex: Sociedade Esportiva Palmeiras"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Sigla
                  </label>
                  <input
                    type="text"
                    value={sigla}
                    onChange={(e) => setSigla(e.target.value.toUpperCase())}
                    maxLength={10}
                    placeholder="Ex: PAL"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                    placeholder="Ex: Sao Paulo"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Estado *
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {estados.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Endereco Completo
                </label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua Turiassu, 1840 - Perdizes"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Estadio / Centro de Treinamento
                  </label>
                  <input
                    type="text"
                    value={estadioCt}
                    onChange={(e) => setEstadioCt(e.target.value)}
                    placeholder="Ex: Academia de Futebol"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Ex: Sub-9 ao Sub-17, Profissional"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@palmeiras"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 pb-2 border-b border-slate-700">Contato do Clube</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  value={contatoNome}
                  onChange={(e) => setContatoNome(e.target.value)}
                  placeholder="Ex: Joao Silva (Coordenador de Base)"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contatoEmail}
                    onChange={(e) => setContatoEmail(e.target.value)}
                    placeholder="contato@clube.com"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={contatoTelefone}
                    onChange={(e) => setContatoTelefone(e.target.value)}
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
              href="/clubes"
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
