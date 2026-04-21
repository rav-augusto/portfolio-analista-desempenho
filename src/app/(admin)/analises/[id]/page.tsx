'use client'

import { useEffect, useReducer, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { convertToWebP } from '@/lib/imageUtils'

import { Jogo, Print, AnaliseState, initialAnaliseState, analiseReducer } from '@/types/analise'
import {
  OrgOfensivaTab,
  OrgDefensivaTab,
  TransicoesTab,
  BolasParadasTab,
  GoleiroTab,
  DadosAvancadosTab,
  AdversarioTab,
  ConclusoesTab,
  PrintsTaticosTab,
} from '@/components/analises/tabs'

const tabs = [
  { id: 'ofensiva', label: 'Org. Ofensiva' },
  { id: 'defensiva', label: 'Org. Defensiva' },
  { id: 'trans_of', label: 'Trans. Ofensiva' },
  { id: 'trans_def', label: 'Trans. Defensiva' },
  { id: 'bp_of', label: 'BP Ofensiva' },
  { id: 'bp_def', label: 'BP Defensiva' },
  { id: 'goleiro', label: 'Goleiro' },
  { id: 'avancados', label: 'Dados Avancados' },
  { id: 'adversario', label: 'Adversario' },
  { id: 'geral', label: 'Conclusoes' },
  { id: 'prints', label: 'Prints Taticos' },
]

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

  // Usar reducer ao inves de 80+ useState
  const [state, dispatch] = useReducer(analiseReducer, initialAnaliseState)

  // Prints Taticos
  const [prints, setPrints] = useState<Print[]>([])
  const [uploadingPrint, setUploadingPrint] = useState(false)
  const [newPrintDescricao, setNewPrintDescricao] = useState('')
  const [newPrintMomento, setNewPrintMomento] = useState('')
  const [newPrintTempo, setNewPrintTempo] = useState('')

  const handleFieldChange = (field: keyof AnaliseState, value: string | number) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }

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

      // Carregar todos os dados do banco
      dispatch({
        type: 'LOAD_DATA',
        data: {
          // Organizacao Ofensiva
          sistema_tatico: a.sistema_tatico || '',
          saida_bola_tipo: a.saida_bola_tipo || '',
          participacao_gk_nivel: a.participacao_gk_nivel || '',
          lado_preferencial: a.lado_preferencial || '',
          qualidade_criacao: a.qualidade_criacao || 0,
          posse_bola: a.posse_bola || 0,
          finalizacoes_total: a.finalizacoes_total || 0,
          finalizacoes_gol: a.finalizacoes_gol || 0,
          finalizacoes_fora: a.finalizacoes_fora || 0,
          finalizacoes_bloqueadas: a.finalizacoes_bloqueadas || 0,
          finalizacoes_dentro_area: a.finalizacoes_dentro_area || 0,
          finalizacoes_fora_area: a.finalizacoes_fora_area || 0,
          grandes_chances: a.grandes_chances || 0,
          grandes_chances_perdidas: a.grandes_chances_perdidas || 0,
          cruzamentos_total: a.cruzamentos_total || 0,
          cruzamentos_certos: a.cruzamentos_certos || 0,
          passes_total: a.passes_total || 0,
          passes_certos: a.passes_certos || 0,
          passes_terco_final: a.passes_terco_final || 0,
          passes_progressivos: a.passes_progressivos || 0,
          conducoes_progressivas: a.conducoes_progressivas || 0,
          entradas_area: a.entradas_area || 0,
          org_ofensiva_obs: a.org_ofensiva_obs || '',

          // Organizacao Defensiva
          bloco_defensivo: a.bloco_defensivo || '',
          marcacao_tipo: a.marcacao_tipo || '',
          pressao_intensidade: a.pressao_intensidade || 0,
          linha_defensiva_altura: a.linha_defensiva_altura || '',
          compactacao_bloco: a.compactacao_bloco || 0,
          duelos_defensivos_pct: a.duelos_defensivos_pct || 0,
          recuperacoes_bola: a.recuperacoes_bola || 0,
          recuperacoes_terco_ofensivo: a.recuperacoes_terco_ofensivo || 0,
          interceptacoes: a.interceptacoes || 0,
          desarmes: a.desarmes || 0,
          desarmes_certos: a.desarmes_certos || 0,
          duelos_total: a.duelos_total || 0,
          duelos_ganhos: a.duelos_ganhos || 0,
          duelos_aereos_total: a.duelos_aereos_total || 0,
          duelos_aereos_ganhos: a.duelos_aereos_ganhos || 0,
          faltas_cometidas: a.faltas_cometidas || 0,
          cartoes_amarelos: a.cartoes_amarelos || 0,
          cartoes_vermelhos: a.cartoes_vermelhos || 0,
          org_defensiva_obs: a.org_defensiva_obs || '',

          // Transicao Ofensiva
          primeira_acao_tipo: a.primeira_acao_tipo || '',
          trans_ofensiva_velocidade: a.trans_ofensiva_velocidade || 0,
          trans_ofensiva_efetividade: a.trans_ofensiva_efetividade || 0,
          trans_ofensiva_jogadores: a.trans_ofensiva_jogadores || 0,
          contra_ataques: a.contra_ataques || 0,
          contra_ataques_finalizados: a.contra_ataques_finalizados || 0,
          gols_contra_ataque: a.gols_contra_ataque || 0,
          acoes_pos_perda: a.acoes_pos_perda || 0,
          acoes_pos_perda_sucesso: a.acoes_pos_perda_sucesso || 0,
          contra_ataques_sofridos: a.contra_ataques_sofridos || 0,
          gols_sofridos_contra_ataque: a.gols_sofridos_contra_ataque || 0,
          trans_ofensiva_obs: a.trans_ofensiva_obs || '',

          // Transicao Defensiva
          reacao_perda_tipo: a.reacao_perda_tipo || '',
          trans_defensiva_velocidade: a.trans_defensiva_velocidade || 0,
          tempo_reacao_segundos: a.tempo_reacao_segundos || 0,
          trans_defensiva_obs: a.trans_defensiva_obs || '',

          // Bolas Paradas Ofensivas
          escanteios_total: a.escanteios_total || 0,
          escanteios_perigosos: a.escanteios_perigosos || 0,
          escanteio_tipo_cobranca: a.escanteio_tipo_cobranca || '',
          escanteios_curto: a.escanteios_curto || 0,
          escanteios_longo: a.escanteios_longo || 0,
          faltas_area: a.faltas_area || 0,
          faltas_diretas: a.faltas_diretas || 0,
          faltas_cruzadas: a.faltas_cruzadas || 0,
          penaltis_favor: a.penaltis_favor || 0,
          penaltis_convertidos: a.penaltis_convertidos || 0,
          laterais_total: a.laterais_total || 0,
          laterais_ofensivos: a.laterais_ofensivos || 0,
          gols_bola_parada: a.gols_bola_parada || 0,
          bp_ofensiva_obs: a.escanteio_movimentacoes || '',

          // Bolas Paradas Defensivas
          bp_def_marcacao_tipo: a.bp_def_marcacao_tipo || '',
          bp_def_solidez: a.bp_def_solidez || 0,
          gols_sofridos_bp: a.gols_sofridos_bp || 0,
          escanteios_contra: a.escanteios_contra || 0,
          faltas_contra_area: a.faltas_contra_area || 0,
          penaltis_contra: a.penaltis_contra || 0,
          penaltis_defendidos: a.penaltis_defendidos || 0,
          bp_defensiva_obs: a.bp_vulnerabilidades || '',

          // Goleiro
          defesas_total: a.defesas_total || 0,
          defesas_dificeis: a.defesas_dificeis || 0,
          saidas_gol: a.saidas_gol || 0,
          passes_gk_total: a.passes_gk_total || 0,
          passes_gk_certos: a.passes_gk_certos || 0,

          // Posse e Territorio
          posse_terco_defensivo: a.posse_terco_defensivo || 0,
          posse_terco_medio: a.posse_terco_medio || 0,
          posse_terco_ofensivo: a.posse_terco_ofensivo || 0,
          campo_ofensivo_pct: a.campo_ofensivo_pct || 0,

          // Intensidade
          distancia_total: a.distancia_total || 0,
          sprints: a.sprints || 0,
          alta_intensidade_metros: a.alta_intensidade_metros || 0,

          // Eficiencia
          xg_favor: a.xg_favor || 0,
          xg_contra: a.xg_contra || 0,
          ppda: a.ppda || 0,

          // Geral
          nota_geral: a.nota_geral || 0,
          indice_ofensivo: a.indice_ofensivo || 0,
          indice_defensivo: a.indice_defensivo || 0,
          conclusoes: a.conclusoes || '',
          recomendacoes_treino: a.recomendacoes_treino || '',
          pontos_fortes: a.pontos_fortes || '',
          pontos_fracos: a.pontos_fracos || '',
          jogadores_destaque: a.jogadores_destaque || '',

          // Adversario
          adv_finalizacoes_total: a.adv_finalizacoes_total || 0,
          adv_finalizacoes_gol: a.adv_finalizacoes_gol || 0,
          adv_finalizacoes_fora: a.adv_finalizacoes_fora || 0,
          adv_finalizacoes_bloqueadas: a.adv_finalizacoes_bloqueadas || 0,
          adv_passes_total: a.adv_passes_total || 0,
          adv_passes_certos: a.adv_passes_certos || 0,
          adv_faltas_cometidas: a.adv_faltas_cometidas || 0,
          adv_cartoes_amarelos: a.adv_cartoes_amarelos || 0,
          adv_cartoes_vermelhos: a.adv_cartoes_vermelhos || 0,
          adv_escanteios: a.adv_escanteios || 0,
          adv_impedimentos: a.adv_impedimentos || 0,
          adv_posse_bola: a.adv_posse_bola || 0,
          impedimentos: a.impedimentos || 0,
        }
      })

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
      // Org Ofensiva
      sistema_tatico: state.sistema_tatico || null,
      saida_bola_tipo: state.saida_bola_tipo || null,
      participacao_gk_nivel: state.participacao_gk_nivel || null,
      lado_preferencial: state.lado_preferencial || null,
      qualidade_criacao: state.qualidade_criacao,
      posse_bola: state.posse_bola,
      finalizacoes_total: state.finalizacoes_total,
      finalizacoes_gol: state.finalizacoes_gol,
      finalizacoes_fora: state.finalizacoes_fora,
      finalizacoes_bloqueadas: state.finalizacoes_bloqueadas,
      org_ofensiva_obs: state.org_ofensiva_obs || null,
      finalizacoes_dentro_area: state.finalizacoes_dentro_area,
      finalizacoes_fora_area: state.finalizacoes_fora_area,
      grandes_chances: state.grandes_chances,
      grandes_chances_perdidas: state.grandes_chances_perdidas,
      cruzamentos_total: state.cruzamentos_total,
      cruzamentos_certos: state.cruzamentos_certos,
      passes_total: state.passes_total,
      passes_certos: state.passes_certos,
      passes_terco_final: state.passes_terco_final,
      passes_progressivos: state.passes_progressivos,
      conducoes_progressivas: state.conducoes_progressivas,
      entradas_area: state.entradas_area,
      // Org Defensiva
      bloco_defensivo: state.bloco_defensivo || null,
      marcacao_tipo: state.marcacao_tipo || null,
      pressao_intensidade: state.pressao_intensidade,
      linha_defensiva_altura: state.linha_defensiva_altura || null,
      compactacao_bloco: state.compactacao_bloco,
      duelos_defensivos_pct: state.duelos_defensivos_pct,
      org_defensiva_obs: state.org_defensiva_obs || null,
      recuperacoes_bola: state.recuperacoes_bola,
      recuperacoes_terco_ofensivo: state.recuperacoes_terco_ofensivo,
      interceptacoes: state.interceptacoes,
      desarmes: state.desarmes,
      desarmes_certos: state.desarmes_certos,
      duelos_total: state.duelos_total,
      duelos_ganhos: state.duelos_ganhos,
      duelos_aereos_total: state.duelos_aereos_total,
      duelos_aereos_ganhos: state.duelos_aereos_ganhos,
      faltas_cometidas: state.faltas_cometidas,
      cartoes_amarelos: state.cartoes_amarelos,
      cartoes_vermelhos: state.cartoes_vermelhos,
      // Trans Ofensiva
      primeira_acao_tipo: state.primeira_acao_tipo || null,
      trans_ofensiva_velocidade: state.trans_ofensiva_velocidade,
      trans_ofensiva_efetividade: state.trans_ofensiva_efetividade,
      trans_ofensiva_jogadores: state.trans_ofensiva_jogadores,
      contra_ataques: state.contra_ataques,
      contra_ataques_finalizados: state.contra_ataques_finalizados,
      gols_contra_ataque: state.gols_contra_ataque,
      trans_ofensiva_obs: state.trans_ofensiva_obs || null,
      acoes_pos_perda: state.acoes_pos_perda,
      acoes_pos_perda_sucesso: state.acoes_pos_perda_sucesso,
      contra_ataques_sofridos: state.contra_ataques_sofridos,
      gols_sofridos_contra_ataque: state.gols_sofridos_contra_ataque,
      // Trans Defensiva
      reacao_perda_tipo: state.reacao_perda_tipo || null,
      trans_defensiva_velocidade: state.trans_defensiva_velocidade,
      tempo_reacao_segundos: state.tempo_reacao_segundos,
      trans_defensiva_obs: state.trans_defensiva_obs || null,
      // BP Ofensiva
      escanteios_total: state.escanteios_total,
      escanteios_perigosos: state.escanteios_perigosos,
      escanteio_tipo_cobranca: state.escanteio_tipo_cobranca || null,
      faltas_area: state.faltas_area,
      gols_bola_parada: state.gols_bola_parada,
      escanteio_movimentacoes: state.bp_ofensiva_obs || null,
      escanteios_curto: state.escanteios_curto,
      escanteios_longo: state.escanteios_longo,
      faltas_diretas: state.faltas_diretas,
      faltas_cruzadas: state.faltas_cruzadas,
      penaltis_favor: state.penaltis_favor,
      penaltis_convertidos: state.penaltis_convertidos,
      laterais_total: state.laterais_total,
      laterais_ofensivos: state.laterais_ofensivos,
      // BP Defensiva
      bp_def_marcacao_tipo: state.bp_def_marcacao_tipo || null,
      bp_def_solidez: state.bp_def_solidez,
      gols_sofridos_bp: state.gols_sofridos_bp,
      bp_vulnerabilidades: state.bp_defensiva_obs || null,
      escanteios_contra: state.escanteios_contra,
      faltas_contra_area: state.faltas_contra_area,
      penaltis_contra: state.penaltis_contra,
      penaltis_defendidos: state.penaltis_defendidos,
      // Goleiro
      defesas_total: state.defesas_total,
      defesas_dificeis: state.defesas_dificeis,
      saidas_gol: state.saidas_gol,
      passes_gk_total: state.passes_gk_total,
      passes_gk_certos: state.passes_gk_certos,
      // Posse e Territorio
      posse_terco_defensivo: state.posse_terco_defensivo,
      posse_terco_medio: state.posse_terco_medio,
      posse_terco_ofensivo: state.posse_terco_ofensivo,
      campo_ofensivo_pct: state.campo_ofensivo_pct,
      // Intensidade
      distancia_total: state.distancia_total || null,
      sprints: state.sprints,
      alta_intensidade_metros: state.alta_intensidade_metros,
      // Eficiencia
      xg_favor: state.xg_favor || null,
      xg_contra: state.xg_contra || null,
      ppda: state.ppda || null,
      // Geral
      nota_geral: state.nota_geral,
      indice_ofensivo: state.indice_ofensivo,
      indice_defensivo: state.indice_defensivo,
      conclusoes: state.conclusoes || null,
      recomendacoes_treino: state.recomendacoes_treino || null,
      pontos_fortes: state.pontos_fortes || null,
      pontos_fracos: state.pontos_fracos || null,
      jogadores_destaque: state.jogadores_destaque || null,
      // Adversario
      adv_finalizacoes_total: state.adv_finalizacoes_total,
      adv_finalizacoes_gol: state.adv_finalizacoes_gol,
      adv_finalizacoes_fora: state.adv_finalizacoes_fora,
      adv_finalizacoes_bloqueadas: state.adv_finalizacoes_bloqueadas,
      adv_passes_total: state.adv_passes_total,
      adv_passes_certos: state.adv_passes_certos,
      adv_faltas_cometidas: state.adv_faltas_cometidas,
      adv_cartoes_amarelos: state.adv_cartoes_amarelos,
      adv_cartoes_vermelhos: state.adv_cartoes_vermelhos,
      adv_escanteios: state.adv_escanteios,
      adv_impedimentos: state.adv_impedimentos,
      adv_posse_bola: state.adv_posse_bola,
      impedimentos: state.impedimentos,
    }).eq('id', params.id)

    if (error) {
      console.error('Erro Supabase:', error)
      setError(`Erro ao salvar analise: ${error.message || error.code || 'Erro desconhecido'}`)
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

    const webpBlob = await convertToWebP(file, 0.85, 1200)
    const webpFile = new File([webpBlob], 'print.webp', { type: 'image/webp' })
    const fileName = `${params.id}/${Date.now()}.webp`

    const { error: uploadError } = await supabase.storage
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
        <Link
          href={`/analises/${params.id}/dashboard`}
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Jogo Selection */}
        <div className="rounded-2xl p-6 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <label className="block text-sm font-medium text-amber-500 mb-2">
            Jogo *
          </label>
          <select
            value={jogoId}
            onChange={(e) => setJogoId(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
          >
            <option value="">Selecione um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {Array.isArray(jogo.clubes) ? jogo.clubes[0]?.nome : jogo.clubes?.nome} x {jogo.adversario} - {formatDate(jogo.data_jogo)} ({jogo.competicao}{jogo.fase && ` - ${jogo.fase}`})
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl shadow-sm overflow-hidden mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
          <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-700">
            <span className="text-sm font-medium text-slate-400 mr-2">Secao:</span>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={
                  activeTab === tab.id
                    ? { backgroundColor: '#e2e8f0', color: '#1e293b' }
                    : { backgroundColor: '#334155', color: '#94a3b8' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'ofensiva' && <OrgOfensivaTab state={state} onChange={handleFieldChange} />}
            {activeTab === 'defensiva' && <OrgDefensivaTab state={state} onChange={handleFieldChange} />}
            {activeTab === 'trans_of' && <TransicoesTab state={state} onChange={handleFieldChange} tipo="ofensiva" />}
            {activeTab === 'trans_def' && <TransicoesTab state={state} onChange={handleFieldChange} tipo="defensiva" />}
            {activeTab === 'bp_of' && <BolasParadasTab state={state} onChange={handleFieldChange} tipo="ofensiva" />}
            {activeTab === 'bp_def' && <BolasParadasTab state={state} onChange={handleFieldChange} tipo="defensiva" />}
            {activeTab === 'goleiro' && <GoleiroTab state={state} onChange={handleFieldChange} />}
            {activeTab === 'avancados' && <DadosAvancadosTab state={state} onChange={handleFieldChange} />}
            {activeTab === 'adversario' && <AdversarioTab state={state} onChange={handleFieldChange} />}
            {activeTab === 'geral' && <ConclusoesTab state={state} onChange={handleFieldChange} />}
            {activeTab === 'prints' && (
              <PrintsTaticosTab
                prints={prints}
                uploadingPrint={uploadingPrint}
                newPrintDescricao={newPrintDescricao}
                newPrintMomento={newPrintMomento}
                newPrintTempo={newPrintTempo}
                onDescricaoChange={setNewPrintDescricao}
                onMomentoChange={setNewPrintMomento}
                onTempoChange={setNewPrintTempo}
                onUpload={handleUploadPrint}
                onDelete={handleDeletePrint}
              />
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
  )
}
