'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { convertToWebP } from '@/lib/imageUtils'

type Jogo = {
  id: string
  adversario: string
  data_jogo: string
  competicao: string
  fase: string | null
  clubes: { nome: string } | null
}

type Print = {
  id: string
  imagem_url: string
  descricao: string | null
  momento: string | null
  tempo_jogo: string | null
}

const tabs = [
  { id: 'ofensiva', label: 'Org. Ofensiva' },
  { id: 'defensiva', label: 'Org. Defensiva' },
  { id: 'trans_of', label: 'Trans. Ofensiva' },
  { id: 'trans_def', label: 'Trans. Defensiva' },
  { id: 'bp_of', label: 'BP Ofensiva' },
  { id: 'bp_def', label: 'BP Defensiva' },
  { id: 'geral', label: 'Conclusoes' },
  { id: 'prints', label: 'Prints Taticos' },
]

const momentos = [
  { value: 'ofensiva', label: 'Organizacao Ofensiva' },
  { value: 'defensiva', label: 'Organizacao Defensiva' },
  { value: 'transicao', label: 'Transicao' },
  { value: 'bola_parada', label: 'Bola Parada' },
]

const sistemasTaticos = ['3-5-2', '4-3-3', '4-4-2', '4-2-3-1', '4-1-4-1', '3-4-3', '5-3-2', '5-4-1']
const blocosDefensivos = ['Alto', 'Medio', 'Baixo']

export default function EditarAnalisePage() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [jogoId, setJogoId] = useState('')
  const [activeTab, setActiveTab] = useState('ofensiva')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  // Organizacao Ofensiva
  const [sistemaTatico, setSistemaTatico] = useState('')
  const [orgOfensivaObs, setOrgOfensivaObs] = useState('')
  const [saidaBola, setSaidaBola] = useState('')
  const [participacaoGoleiro, setParticipacaoGoleiro] = useState('')
  const [linhasPasse, setLinhasPasse] = useState('')
  const [amplitude, setAmplitude] = useState('')
  const [criacaoCentral, setCriacaoCentral] = useState('')
  const [criacaoDireita, setCriacaoDireita] = useState('')
  const [criacaoEsquerda, setCriacaoEsquerda] = useState('')
  const [finalizacoesTotal, setFinalizacoesTotal] = useState('')
  const [finalizacoesGol, setFinalizacoesGol] = useState('')
  const [finalizacoesFora, setFinalizacoesFora] = useState('')
  const [finalizacoesBloqueadas, setFinalizacoesBloqueadas] = useState('')

  // Organizacao Defensiva
  const [blocoDefensivo, setBlocoDefensivo] = useState('')
  const [orgDefensivaObs, setOrgDefensivaObs] = useState('')
  const [tipoMarcacao, setTipoMarcacao] = useState('')
  const [pressao, setPressao] = useState('')
  const [coberturas, setCoberturas] = useState('')
  const [linhaDefensiva, setLinhaDefensiva] = useState('')
  const [vulnerabilidades, setVulnerabilidades] = useState('')

  // Transicao Ofensiva
  const [transOfensivaObs, setTransOfensivaObs] = useState('')
  const [primeiraAcao, setPrimeiraAcao] = useState('')
  const [velocidadeTransicao, setVelocidadeTransicao] = useState('')
  const [contraAtaques, setContraAtaques] = useState('')
  const [contraAtaquesFinalizados, setContraAtaquesFinalizados] = useState('')
  const [golsContraAtaque, setGolsContraAtaque] = useState('')

  // Transicao Defensiva
  const [transDefensivaObs, setTransDefensivaObs] = useState('')
  const [reacaoPerda, setReacaoPerda] = useState('')
  const [tempoReacao, setTempoReacao] = useState('')

  // Bolas Paradas Ofensivas
  const [escanteioCobrador, setEscanteioCobrador] = useState('')
  const [escanteioTipo, setEscanteioTipo] = useState('')
  const [escanteioMovimentacoes, setEscanteioMovimentacoes] = useState('')
  const [faltasCaracteristicas, setFaltasCaracteristicas] = useState('')

  // Bolas Paradas Defensivas
  const [escanteioDefMarcacao, setEscanteioDefMarcacao] = useState('')
  const [escanteioDefPosicaoGk, setEscanteioDefPosicaoGk] = useState('')
  const [escanteioDefPrimeiroPau, setEscanteioDefPrimeiroPau] = useState('')
  const [escanteioDefSegundoPau, setEscanteioDefSegundoPau] = useState('')
  const [bpVulnerabilidades, setBpVulnerabilidades] = useState('')

  // Geral
  const [conclusoes, setConclusoes] = useState('')
  const [recomendacoesTreino, setRecomendacoesTreino] = useState('')

  // Prints Taticos
  const [prints, setPrints] = useState<Print[]>([])
  const [uploadingPrint, setUploadingPrint] = useState(false)
  const [newPrintDescricao, setNewPrintDescricao] = useState('')
  const [newPrintMomento, setNewPrintMomento] = useState('')
  const [newPrintTempo, setNewPrintTempo] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const [jogosRes, analiseRes, printsRes] = await Promise.all([
        supabase.from('jogos').select('id, adversario, data_jogo, competicao, fase, clubes(nome)').order('data_jogo', { ascending: false }),
        supabase.from('analises_jogo').select('*').eq('id', params.id).single(),
        supabase.from('prints_taticos').select('*').eq('analise_id', params.id).order('created_at', { ascending: false })
      ])

      if (jogosRes.data) setJogos(jogosRes.data)
      if (printsRes.data) setPrints(printsRes.data)

      if (analiseRes.error || !analiseRes.data) {
        router.push('/analises')
        return
      }

      const a = analiseRes.data
      setJogoId(a.jogo_id)
      setSistemaTatico(a.sistema_tatico || '')
      setOrgOfensivaObs(a.org_ofensiva_obs || '')
      setSaidaBola(a.saida_bola || '')
      setParticipacaoGoleiro(a.participacao_goleiro || '')
      setLinhasPasse(a.linhas_passe || '')
      setAmplitude(a.amplitude || '')
      setCriacaoCentral(a.criacao_central || '')
      setCriacaoDireita(a.criacao_direita || '')
      setCriacaoEsquerda(a.criacao_esquerda || '')
      setFinalizacoesTotal(a.finalizacoes_total?.toString() || '')
      setFinalizacoesGol(a.finalizacoes_gol?.toString() || '')
      setFinalizacoesFora(a.finalizacoes_fora?.toString() || '')
      setFinalizacoesBloqueadas(a.finalizacoes_bloqueadas?.toString() || '')
      setBlocoDefensivo(a.bloco_defensivo || '')
      setOrgDefensivaObs(a.org_defensiva_obs || '')
      setTipoMarcacao(a.tipo_marcacao || '')
      setPressao(a.pressao || '')
      setCoberturas(a.coberturas || '')
      setLinhaDefensiva(a.linha_defensiva || '')
      setVulnerabilidades(a.vulnerabilidades || '')
      setTransOfensivaObs(a.trans_ofensiva_obs || '')
      setPrimeiraAcao(a.primeira_acao || '')
      setVelocidadeTransicao(a.velocidade_transicao || '')
      setContraAtaques(a.contra_ataques?.toString() || '')
      setContraAtaquesFinalizados(a.contra_ataques_finalizados?.toString() || '')
      setGolsContraAtaque(a.gols_contra_ataque?.toString() || '')
      setTransDefensivaObs(a.trans_defensiva_obs || '')
      setReacaoPerda(a.reacao_perda || '')
      setTempoReacao(a.tempo_reacao || '')
      setEscanteioCobrador(a.escanteio_cobrador || '')
      setEscanteioTipo(a.escanteio_tipo || '')
      setEscanteioMovimentacoes(a.escanteio_movimentacoes || '')
      setFaltasCaracteristicas(a.faltas_caracteristicas || '')
      setEscanteioDefMarcacao(a.escanteio_def_marcacao || '')
      setEscanteioDefPosicaoGk(a.escanteio_def_posicao_gk || '')
      setEscanteioDefPrimeiroPau(a.escanteio_def_primeiro_pau || '')
      setEscanteioDefSegundoPau(a.escanteio_def_segundo_pau || '')
      setBpVulnerabilidades(a.bp_vulnerabilidades || '')
      setConclusoes(a.conclusoes || '')
      setRecomendacoesTreino(a.recomendacoes_treino || '')
      setLoading(false)
    }
    loadData()
  }, [params.id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('analises_jogo').update({
      jogo_id: jogoId,
      sistema_tatico: sistemaTatico || null,
      org_ofensiva_obs: orgOfensivaObs || null,
      saida_bola: saidaBola || null,
      participacao_goleiro: participacaoGoleiro || null,
      linhas_passe: linhasPasse || null,
      amplitude: amplitude || null,
      criacao_central: criacaoCentral || null,
      criacao_direita: criacaoDireita || null,
      criacao_esquerda: criacaoEsquerda || null,
      finalizacoes_total: finalizacoesTotal ? parseInt(finalizacoesTotal) : 0,
      finalizacoes_gol: finalizacoesGol ? parseInt(finalizacoesGol) : 0,
      finalizacoes_fora: finalizacoesFora ? parseInt(finalizacoesFora) : 0,
      finalizacoes_bloqueadas: finalizacoesBloqueadas ? parseInt(finalizacoesBloqueadas) : 0,
      bloco_defensivo: blocoDefensivo || null,
      org_defensiva_obs: orgDefensivaObs || null,
      tipo_marcacao: tipoMarcacao || null,
      pressao: pressao || null,
      coberturas: coberturas || null,
      linha_defensiva: linhaDefensiva || null,
      vulnerabilidades: vulnerabilidades || null,
      trans_ofensiva_obs: transOfensivaObs || null,
      primeira_acao: primeiraAcao || null,
      velocidade_transicao: velocidadeTransicao || null,
      contra_ataques: contraAtaques ? parseInt(contraAtaques) : 0,
      contra_ataques_finalizados: contraAtaquesFinalizados ? parseInt(contraAtaquesFinalizados) : 0,
      gols_contra_ataque: golsContraAtaque ? parseInt(golsContraAtaque) : 0,
      trans_defensiva_obs: transDefensivaObs || null,
      reacao_perda: reacaoPerda || null,
      tempo_reacao: tempoReacao || null,
      escanteio_cobrador: escanteioCobrador || null,
      escanteio_tipo: escanteioTipo || null,
      escanteio_movimentacoes: escanteioMovimentacoes || null,
      faltas_caracteristicas: faltasCaracteristicas || null,
      escanteio_def_marcacao: escanteioDefMarcacao || null,
      escanteio_def_posicao_gk: escanteioDefPosicaoGk || null,
      escanteio_def_primeiro_pau: escanteioDefPrimeiroPau || null,
      escanteio_def_segundo_pau: escanteioDefSegundoPau || null,
      bp_vulnerabilidades: bpVulnerabilidades || null,
      conclusoes: conclusoes || null,
      recomendacoes_treino: recomendacoesTreino || null
    }).eq('id', params.id)

    if (error) {
      setError('Erro ao salvar analise')
      setSaving(false)
      return
    }

    router.push('/analises')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const handleUploadPrint = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPrint(true)

    // Converter para WebP (menor tamanho)
    const webpBlob = await convertToWebP(file, 0.85, 1200)
    const webpFile = new File([webpBlob], 'print.webp', { type: 'image/webp' })
    const fileName = `${params.id}/${Date.now()}.webp`

    const { error: uploadError, data } = await supabase.storage
      .from('prints')
      .upload(fileName, webpFile)

    if (uploadError) {
      setError('Erro ao fazer upload do print')
      setUploadingPrint(false)
      return
    }

    const { data: urlData } = supabase.storage.from('prints').getPublicUrl(fileName)

    const { data: printData, error: insertError } = await supabase
      .from('prints_taticos')
      .insert({
        analise_id: params.id,
        imagem_url: urlData.publicUrl,
        descricao: newPrintDescricao || null,
        momento: newPrintMomento || null,
        tempo_jogo: newPrintTempo || null
      })
      .select()
      .single()

    if (insertError) {
      setError('Erro ao salvar print')
      setUploadingPrint(false)
      return
    }

    setPrints([printData, ...prints])
    setNewPrintDescricao('')
    setNewPrintMomento('')
    setNewPrintTempo('')
    setUploadingPrint(false)
  }

  const handleDeletePrint = async (print: Print) => {
    if (!confirm('Tem certeza que deseja excluir este print?')) return

    // Extract filename from URL
    const urlParts = print.imagem_url.split('/prints/')
    if (urlParts.length > 1) {
      await supabase.storage.from('prints').remove([urlParts[1]])
    }

    const { error } = await supabase.from('prints_taticos').delete().eq('id', print.id)

    if (!error) {
      setPrints(prints.filter(p => p.id !== print.id))
    }
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
          href="/analises"
          className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Editar Analise</h1>
          <p className="text-slate-400 mt-1">Atualize a analise tatico-tecnica</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Jogo Selection */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700 mb-6">
          <label className="block text-sm font-medium text-amber-500 mb-2">
            Jogo *
          </label>
          <select
            value={jogoId}
            onChange={(e) => setJogoId(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="">Selecione um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.clubes?.nome} x {jogo.adversario} - {formatDate(jogo.data_jogo)} ({jogo.competicao}{jogo.fase && ` - ${jogo.fase}`})
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 overflow-hidden mb-6">
          <div className="flex overflow-x-auto border-b border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-500 border-b-2 border-amber-500 bg-amber-500/5'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Organizacao Ofensiva */}
            {activeTab === 'ofensiva' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Sistema Tatico</label>
                    <select
                      value={sistemaTatico}
                      onChange={(e) => setSistemaTatico(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="">Selecione</option>
                      {sistemasTaticos.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Observacoes Gerais</label>
                  <textarea value={orgOfensivaObs} onChange={(e) => setOrgOfensivaObs(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Saida de Bola</label>
                    <textarea value={saidaBola} onChange={(e) => setSaidaBola(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Participacao do Goleiro</label>
                    <textarea value={participacaoGoleiro} onChange={(e) => setParticipacaoGoleiro(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Linhas de Passe</label>
                    <textarea value={linhasPasse} onChange={(e) => setLinhasPasse(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Amplitude</label>
                    <textarea value={amplitude} onChange={(e) => setAmplitude(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Criacao Central</label>
                    <textarea value={criacaoCentral} onChange={(e) => setCriacaoCentral(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Criacao Direita</label>
                    <textarea value={criacaoDireita} onChange={(e) => setCriacaoDireita(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Criacao Esquerda</label>
                    <textarea value={criacaoEsquerda} onChange={(e) => setCriacaoEsquerda(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Finalizacoes Total</label>
                    <input type="number" min="0" value={finalizacoesTotal} onChange={(e) => setFinalizacoesTotal(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">No Gol</label>
                    <input type="number" min="0" value={finalizacoesGol} onChange={(e) => setFinalizacoesGol(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Fora</label>
                    <input type="number" min="0" value={finalizacoesFora} onChange={(e) => setFinalizacoesFora(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Bloqueadas</label>
                    <input type="number" min="0" value={finalizacoesBloqueadas} onChange={(e) => setFinalizacoesBloqueadas(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Organizacao Defensiva */}
            {activeTab === 'defensiva' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Bloco Defensivo</label>
                    <select value={blocoDefensivo} onChange={(e) => setBlocoDefensivo(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                      <option value="">Selecione</option>
                      {blocosDefensivos.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Tipo de Marcacao</label>
                    <input type="text" value={tipoMarcacao} onChange={(e) => setTipoMarcacao(e.target.value)} placeholder="Ex: Individual, Zona, Mista" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Observacoes Gerais</label>
                  <textarea value={orgDefensivaObs} onChange={(e) => setOrgDefensivaObs(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Pressao</label>
                    <textarea value={pressao} onChange={(e) => setPressao(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Coberturas</label>
                    <textarea value={coberturas} onChange={(e) => setCoberturas(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Linha Defensiva</label>
                    <textarea value={linhaDefensiva} onChange={(e) => setLinhaDefensiva(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Vulnerabilidades</label>
                    <textarea value={vulnerabilidades} onChange={(e) => setVulnerabilidades(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Transicao Ofensiva */}
            {activeTab === 'trans_of' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Observacoes Gerais</label>
                  <textarea value={transOfensivaObs} onChange={(e) => setTransOfensivaObs(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Primeira Acao</label>
                    <input type="text" value={primeiraAcao} onChange={(e) => setPrimeiraAcao(e.target.value)} placeholder="Ex: Bola longa, Jogo curto" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Velocidade da Transicao</label>
                    <input type="text" value={velocidadeTransicao} onChange={(e) => setVelocidadeTransicao(e.target.value)} placeholder="Ex: Rapida, Lenta, Equilibrada" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Contra-Ataques</label>
                    <input type="number" min="0" value={contraAtaques} onChange={(e) => setContraAtaques(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Finalizados</label>
                    <input type="number" min="0" value={contraAtaquesFinalizados} onChange={(e) => setContraAtaquesFinalizados(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Gols</label>
                    <input type="number" min="0" value={golsContraAtaque} onChange={(e) => setGolsContraAtaque(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Transicao Defensiva */}
            {activeTab === 'trans_def' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Observacoes Gerais</label>
                  <textarea value={transDefensivaObs} onChange={(e) => setTransDefensivaObs(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Reacao a Perda</label>
                    <textarea value={reacaoPerda} onChange={(e) => setReacaoPerda(e.target.value)} rows={2} placeholder="Ex: Pressao imediata, Recuo organizado" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Tempo de Reacao</label>
                    <input type="text" value={tempoReacao} onChange={(e) => setTempoReacao(e.target.value)} placeholder="Ex: Imediato, Lento, 3-5 segundos" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Bolas Paradas Ofensivas */}
            {activeTab === 'bp_of' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Cobrador de Escanteio</label>
                    <input type="text" value={escanteioCobrador} onChange={(e) => setEscanteioCobrador(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Tipo de Cobranca</label>
                    <input type="text" value={escanteioTipo} onChange={(e) => setEscanteioTipo(e.target.value)} placeholder="Ex: Fechado, Aberto, Rasteiro" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Movimentacoes em Escanteios</label>
                  <textarea value={escanteioMovimentacoes} onChange={(e) => setEscanteioMovimentacoes(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Caracteristicas em Faltas</label>
                  <textarea value={faltasCaracteristicas} onChange={(e) => setFaltasCaracteristicas(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
              </div>
            )}

            {/* Bolas Paradas Defensivas */}
            {activeTab === 'bp_def' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Marcacao em Escanteios</label>
                    <input type="text" value={escanteioDefMarcacao} onChange={(e) => setEscanteioDefMarcacao(e.target.value)} placeholder="Ex: Individual, Zona, Mista" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Posicao do Goleiro</label>
                    <textarea value={escanteioDefPosicaoGk} onChange={(e) => setEscanteioDefPosicaoGk(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Primeiro Pau</label>
                    <input type="text" value={escanteioDefPrimeiroPau} onChange={(e) => setEscanteioDefPrimeiroPau(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-500 mb-2">Segundo Pau</label>
                    <input type="text" value={escanteioDefSegundoPau} onChange={(e) => setEscanteioDefSegundoPau(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Vulnerabilidades em Bolas Paradas</label>
                  <textarea value={bpVulnerabilidades} onChange={(e) => setBpVulnerabilidades(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
              </div>
            )}

            {/* Conclusoes */}
            {activeTab === 'geral' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Conclusoes da Analise</label>
                  <textarea value={conclusoes} onChange={(e) => setConclusoes(e.target.value)} rows={5} placeholder="Principais pontos observados na partida..." className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">Recomendacoes para Treino</label>
                  <textarea value={recomendacoesTreino} onChange={(e) => setRecomendacoesTreino(e.target.value)} rows={5} placeholder="Aspectos a trabalhar nos proximos treinos..." className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                </div>
              </div>
            )}

            {/* Prints Taticos */}
            {activeTab === 'prints' && (
              <div className="space-y-6">
                {/* Upload Form */}
                <div className="border border-dashed border-slate-600 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-slate-100 mb-4">Adicionar Print Tatico</h4>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-500 mb-2">Momento do Jogo</label>
                      <select
                        value={newPrintMomento}
                        onChange={(e) => setNewPrintMomento(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="">Selecione</option>
                        {momentos.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-500 mb-2">Tempo (ex: 32&apos;)</label>
                      <input
                        type="text"
                        value={newPrintTempo}
                        onChange={(e) => setNewPrintTempo(e.target.value)}
                        placeholder="Ex: 15', 45+2'"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-500 mb-2">Descricao</label>
                      <input
                        type="text"
                        value={newPrintDescricao}
                        onChange={(e) => setNewPrintDescricao(e.target.value)}
                        placeholder="Ex: Saida de bola com 3 jogadores"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl py-4 transition-colors">
                    {uploadingPrint ? (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    ) : (
                      <Upload className="w-5 h-5 text-slate-400" />
                    )}
                    <span className="text-sm font-medium text-slate-300">
                      {uploadingPrint ? 'Enviando...' : 'Clique para enviar imagem'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPrint}
                      disabled={uploadingPrint}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Prints List */}
                {prints.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">Nenhum print adicionado ainda</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {prints.map((print) => (
                      <div key={print.id} className="border border-slate-700 rounded-xl overflow-hidden">
                        <div className="aspect-video relative">
                          <img
                            src={print.imagem_url}
                            alt={print.descricao || 'Print tatico'}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeletePrint(print)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            {print.momento && (
                              <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
                                {momentos.find(m => m.value === print.momento)?.label || print.momento}
                              </span>
                            )}
                            {print.tempo_jogo && (
                              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                {print.tempo_jogo}
                              </span>
                            )}
                          </div>
                          {print.descricao && (
                            <p className="text-sm text-slate-300">{print.descricao}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-400 text-sm p-4 rounded-xl border border-red-800 mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link
            href="/analises"
            className="px-6 py-2 text-slate-400 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
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
  )
}
