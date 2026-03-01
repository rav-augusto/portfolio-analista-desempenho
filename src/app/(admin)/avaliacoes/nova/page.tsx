'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, Loader2, HelpCircle, X, TrendingUp, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import {
  DiagramPenetracao,
  DiagramCoberturaOfensiva,
  DiagramEspacoComBola,
  DiagramEspacoSemBola,
  DiagramMobilidade,
  DiagramUnidadeOfensiva,
  DiagramContencao,
  DiagramCoberturaDefensiva,
  DiagramEquilibrioRecuperacao,
  DiagramEquilibrioDefensivo,
  DiagramConcentracao,
  DiagramUnidadeDefensiva,
} from '@/components/TacticalDiagrams'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

type Atleta = {
  id: string
  nome: string
  foto_url: string | null
  clubes: { nome: string } | { nome: string }[] | null
}

type Jogo = {
  id: string
  adversario: string
  data_jogo: string
  clubes: { nome: string } | { nome: string }[] | null
}

const getClubeName = (clubes: { nome: string } | { nome: string }[] | null | undefined): string => {
  if (!clubes) return ''
  if (Array.isArray(clubes)) return clubes[0]?.nome || ''
  return clubes.nome || ''
}

// Dimensões CBF com descrições detalhadas
const dimensoesCBF = [
  { key: 'forca', label: 'Forca', shortLabel: 'FOR', desc: 'Capacidade fisica de impor-se nos duelos, proteger a bola e disputar divididas. Inclui forca de membros superiores e inferiores, resistencia muscular e potencia nos saltos e arrancadas.', hasHelp: true },
  { key: 'velocidade', label: 'Velocidade', shortLabel: 'VEL', desc: 'Rapidez de deslocamento com e sem bola, aceleracao inicial, velocidade maxima e tempo de reacao. Fundamental para transicoes ofensivas e defensivas.', hasHelp: true },
  { key: 'tecnica', label: 'Tecnica', shortLabel: 'TEC', desc: 'Qualidade do dominio de bola, passe curto e longo, conducao, finalizacao e dribles. Avalia a execucao precisa dos fundamentos do futebol.', hasHelp: true },
  { key: 'dinamica', label: 'Dinamica', shortLabel: 'DIN', desc: 'Movimentacao constante durante o jogo, intensidade nas acoes e capacidade de repetir sprints e esforcos de alta intensidade ao longo da partida.', hasHelp: true },
  { key: 'inteligencia', label: 'Inteligencia', shortLabel: 'INT', desc: 'Leitura de jogo, antecipacao das jogadas, tomada de decisao rapida e visao espacial. Capacidade de entender o contexto tatico e fazer escolhas assertivas.', hasHelp: true },
  { key: 'um_contra_um', label: '1 contra 1', shortLabel: '1v1', desc: 'Capacidade de superar o adversario direto no ataque atraves de dribles e fintas, e de marcar/desarmar na defesa em situacoes de duelo individual.', hasHelp: true },
  { key: 'atitude', label: 'Atitude', shortLabel: 'ATI', desc: 'Comportamento competitivo, lideranca em campo, comunicacao com companheiros, concentracao e mentalidade vencedora. Postura diante de adversidades.', hasHelp: true },
  { key: 'potencial', label: 'Potencial', shortLabel: 'POT', desc: 'Margem de evolucao considerando idade, caracteristicas fisicas, tecnicas e capacidade de aprendizado. Projecao de desenvolvimento futuro do atleta.', hasHelp: true },
]

// Princípios Ofensivos
const principiosOfensivos = [
  { key: 'penetracao', label: 'Penetracao', shortLabel: 'PEN', desc: 'Acao de avancar com a bola em direcao ao gol adversario.', diagram: DiagramPenetracao },
  { key: 'cobertura_ofensiva', label: 'Cobertura Ofensiva', shortLabel: 'COF', desc: 'Acao de aproximacao de quem esta com a bola.', diagram: DiagramCoberturaOfensiva },
  { key: 'espaco_com_bola', label: 'Espaco com Bola', shortLabel: 'ECB', desc: 'Movimento com posse para ganhar vantagem espacial.', diagram: DiagramEspacoComBola },
  { key: 'espaco_sem_bola', label: 'Espaco sem Bola', shortLabel: 'ESB', desc: 'Movimentacao a frente da linha da bola.', diagram: DiagramEspacoSemBola },
  { key: 'mobilidade', label: 'Mobilidade', shortLabel: 'MOB', desc: 'Movimento nas costas da ultima linha defensiva.', diagram: DiagramMobilidade },
  { key: 'unidade_ofensiva', label: 'Unidade Ofensiva', shortLabel: 'UOF', desc: 'Organizacao coordenada das linhas de ataque.', diagram: DiagramUnidadeOfensiva },
]

// Princípios Defensivos
const principiosDefensivos = [
  { key: 'contencao', label: 'Contencao', shortLabel: 'CON', desc: 'Acao de retardar o avanco do portador da bola.', diagram: DiagramContencao },
  { key: 'cobertura_defensiva', label: 'Cobertura Defensiva', shortLabel: 'CDF', desc: 'Posicionamento de apoio ao jogador que faz a contencao.', diagram: DiagramCoberturaDefensiva },
  { key: 'equilibrio_recuperacao', label: 'Equilibrio Recuperacao', shortLabel: 'ERE', desc: 'Posicionamento para recuperar a posse.', diagram: DiagramEquilibrioRecuperacao },
  { key: 'equilibrio_defensivo', label: 'Equilibrio Defensivo', shortLabel: 'EDF', desc: 'Movimentacao zonal para estabilidade defensiva.', diagram: DiagramEquilibrioDefensivo },
  { key: 'concentracao_def', label: 'Concentracao', shortLabel: 'CNC', desc: 'Acoes de protecao em zonas de maior risco.', diagram: DiagramConcentracao },
  { key: 'unidade_defensiva', label: 'Unidade Defensiva', shortLabel: 'UDF', desc: 'Organizacao coordenada das linhas de defesa.', diagram: DiagramUnidadeDefensiva },
]

const tipos = [
  { value: 'jogo', label: 'Avaliação de Jogo' },
  { value: 'treino', label: 'Avaliação de Treino' },
  { value: 'geral', label: 'Avaliação Geral' },
]

const tabs = [
  { id: 'cbf', label: 'Dimensões CBF' },
  { id: 'ofensivos', label: 'Princípios Ofensivos' },
  { id: 'defensivos', label: 'Princípios Defensivos' },
  { id: 'conclusoes', label: 'Conclusões' },
]

export default function NovaAvaliacaoPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [atletaId, setAtletaId] = useState('')
  const [jogoId, setJogoId] = useState('')
  const [contextoTreino, setContextoTreino] = useState('')
  const [dataAvaliacao, setDataAvaliacao] = useState(new Date().toISOString().split('T')[0])
  const [tipo, setTipo] = useState('jogo')
  const [activeTab, setActiveTab] = useState('cbf')
  const [helpModal, setHelpModal] = useState<{ open: boolean; title: string; desc: string; diagram?: React.ComponentType } | null>(null)
  const [obsModal, setObsModal] = useState<{ open: boolean; key: string; label: string; type: 'cbf' | 'ofensivo' | 'defensivo'; value: string } | null>(null)

  // Notas CBF
  const [notas, setNotas] = useState<Record<string, string>>({
    forca: '3', velocidade: '3', tecnica: '3', dinamica: '3',
    inteligencia: '3', um_contra_um: '3', atitude: '3', potencial: '3',
  })
  const [obsCBF, setObsCBF] = useState<Record<string, string>>({})

  // Notas Princípios Ofensivos
  const [notasOfensivos, setNotasOfensivos] = useState<Record<string, string>>({
    penetracao: '3', cobertura_ofensiva: '3', espaco_com_bola: '3',
    espaco_sem_bola: '3', mobilidade: '3', unidade_ofensiva: '3',
  })
  const [obsOfensivos, setObsOfensivos] = useState<Record<string, string>>({})

  // Notas Princípios Defensivos
  const [notasDefensivos, setNotasDefensivos] = useState<Record<string, string>>({
    contencao: '3', cobertura_defensiva: '3', equilibrio_recuperacao: '3',
    equilibrio_defensivo: '3', concentracao_def: '3', unidade_defensiva: '3',
  })
  const [obsDefensivos, setObsDefensivos] = useState<Record<string, string>>({})

  // Conclusões
  const [pontosFortes, setPontosFortes] = useState('')
  const [pontosDesenvolver, setPontosDesenvolver] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const [atletasRes, jogosRes] = await Promise.all([
        supabase.from('atletas').select('id, nome, foto_url, clubes(nome)').order('nome'),
        supabase.from('jogos').select('id, adversario, data_jogo, clubes(nome)').order('data_jogo', { ascending: false })
      ])
      if (atletasRes.data) setAtletas(atletasRes.data)
      if (jogosRes.data) setJogos(jogosRes.data)

      // Pre-selecionar atleta se veio da URL
      const atletaParam = searchParams.get('atleta')
      if (atletaParam) {
        setAtletaId(atletaParam)
      }
    }
    loadData()
  }, [supabase, searchParams])

  // Calcular médias
  const calcularMedia = (valores: Record<string, string>) => {
    const nums = Object.values(valores).map(v => parseFloat(v))
    return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
  }

  const mediaCBF = calcularMedia(notas)
  const mediaOfensivo = calcularMedia(notasOfensivos)
  const mediaDefensivo = calcularMedia(notasDefensivos)
  const mediaGeral = ((parseFloat(mediaCBF) + parseFloat(mediaOfensivo) + parseFloat(mediaDefensivo)) / 3).toFixed(1)

  // Configuração dos gráficos radar
  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 0,
        ticks: { stepSize: 1, font: { size: 8 }, color: '#94a3b8', backdropColor: 'transparent' },
        pointLabels: { font: { size: 9, weight: 'bold' as const }, color: '#e2e8f0' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: true,
  }

  // Dados do gráfico completo (todas as dimensões) - cor azul para diferenciar
  const getRadarDataCompleto = () => ({
    labels: [
      ...dimensoesCBF.map(d => d.shortLabel),
      ...principiosOfensivos.map(d => d.shortLabel),
      ...principiosDefensivos.map(d => d.shortLabel),
    ],
    datasets: [{
      data: [
        ...dimensoesCBF.map(d => parseFloat(notas[d.key])),
        ...principiosOfensivos.map(d => parseFloat(notasOfensivos[d.key])),
        ...principiosDefensivos.map(d => parseFloat(notasDefensivos[d.key])),
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointRadius: 2,
    }],
  })

  // Dados dos gráficos
  const getRadarDataCBF = () => ({
    labels: dimensoesCBF.map(d => d.shortLabel),
    datasets: [{
      data: dimensoesCBF.map(d => parseFloat(notas[d.key])),
      backgroundColor: 'rgba(245, 158, 11, 0.3)',
      borderColor: '#f59e0b',
      borderWidth: 2,
      pointBackgroundColor: '#f59e0b',
      pointBorderColor: '#fff',
      pointRadius: 3,
    }],
  })

  const getRadarDataOfensivo = () => ({
    labels: principiosOfensivos.map(d => d.shortLabel),
    datasets: [{
      data: principiosOfensivos.map(d => parseFloat(notasOfensivos[d.key])),
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
      borderColor: '#22c55e',
      borderWidth: 2,
      pointBackgroundColor: '#22c55e',
      pointBorderColor: '#fff',
      pointRadius: 3,
    }],
  })

  const getRadarDataDefensivo = () => ({
    labels: principiosDefensivos.map(d => d.shortLabel),
    datasets: [{
      data: principiosDefensivos.map(d => parseFloat(notasDefensivos[d.key])),
      backgroundColor: 'rgba(239, 68, 68, 0.3)',
      borderColor: '#ef4444',
      borderWidth: 2,
      pointBackgroundColor: '#ef4444',
      pointBorderColor: '#fff',
      pointRadius: 3,
    }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('avaliacoes_atleta').insert({
      atleta_id: atletaId,
      jogo_id: jogoId || null,
      contexto_treino: contextoTreino || null,
      data_avaliacao: dataAvaliacao,
      tipo,
      forca: parseFloat(notas.forca),
      velocidade: parseFloat(notas.velocidade),
      tecnica: parseFloat(notas.tecnica),
      dinamica: parseFloat(notas.dinamica),
      inteligencia: parseFloat(notas.inteligencia),
      um_contra_um: parseFloat(notas.um_contra_um),
      atitude: parseFloat(notas.atitude),
      potencial: parseFloat(notas.potencial),
      obs_forca: obsCBF.forca || null,
      obs_velocidade: obsCBF.velocidade || null,
      obs_tecnica: obsCBF.tecnica || null,
      obs_dinamica: obsCBF.dinamica || null,
      obs_inteligencia: obsCBF.inteligencia || null,
      obs_um_contra_um: obsCBF.um_contra_um || null,
      obs_atitude: obsCBF.atitude || null,
      obs_potencial: obsCBF.potencial || null,
      penetracao: parseFloat(notasOfensivos.penetracao),
      cobertura_ofensiva: parseFloat(notasOfensivos.cobertura_ofensiva),
      espaco_com_bola: parseFloat(notasOfensivos.espaco_com_bola),
      espaco_sem_bola: parseFloat(notasOfensivos.espaco_sem_bola),
      mobilidade: parseFloat(notasOfensivos.mobilidade),
      unidade_ofensiva: parseFloat(notasOfensivos.unidade_ofensiva),
      obs_penetracao: obsOfensivos.penetracao || null,
      obs_cobertura_ofensiva: obsOfensivos.cobertura_ofensiva || null,
      obs_espaco_com_bola: obsOfensivos.espaco_com_bola || null,
      obs_espaco_sem_bola: obsOfensivos.espaco_sem_bola || null,
      obs_mobilidade: obsOfensivos.mobilidade || null,
      obs_unidade_ofensiva: obsOfensivos.unidade_ofensiva || null,
      contencao: parseFloat(notasDefensivos.contencao),
      cobertura_defensiva: parseFloat(notasDefensivos.cobertura_defensiva),
      equilibrio_recuperacao: parseFloat(notasDefensivos.equilibrio_recuperacao),
      equilibrio_defensivo: parseFloat(notasDefensivos.equilibrio_defensivo),
      concentracao_def: parseFloat(notasDefensivos.concentracao_def),
      unidade_defensiva: parseFloat(notasDefensivos.unidade_defensiva),
      obs_contencao: obsDefensivos.contencao || null,
      obs_cobertura_defensiva: obsDefensivos.cobertura_defensiva || null,
      obs_equilibrio_recuperacao: obsDefensivos.equilibrio_recuperacao || null,
      obs_equilibrio_defensivo: obsDefensivos.equilibrio_defensivo || null,
      obs_concentracao_def: obsDefensivos.concentracao_def || null,
      obs_unidade_defensiva: obsDefensivos.unidade_defensiva || null,
      pontos_fortes: pontosFortes || null,
      pontos_desenvolver: pontosDesenvolver || null,
      observacoes: observacoes || null
    })

    if (error) {
      console.error(error)
      setError('Erro ao salvar avaliação.')
      setLoading(false)
      return
    }

    // Redirecionar para a página do atleta se veio de lá
    const atletaParam = searchParams.get('atleta')
    if (atletaParam) {
      router.push(`/avaliacoes/atleta/${atletaParam}`)
    } else {
      router.push('/avaliacoes')
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR')

  // URL de volta baseada no parâmetro de atleta
  const backUrl = searchParams.get('atleta') ? `/avaliacoes/atleta/${searchParams.get('atleta')}` : '/avaliacoes'

  const openHelp = (title: string, desc: string, diagram?: React.ComponentType) => {
    setHelpModal({ open: true, title, desc, diagram })
  }

  const getScoreColor = (score: number) => {
    if (score <= 2) return '#ef4444'
    if (score <= 3) return '#f59e0b'
    if (score <= 4) return '#84cc16'
    return '#22c55e'
  }

  const renderDimensionCard = (
    dim: { key: string; label: string; desc: string; diagram?: React.ComponentType; hasHelp?: boolean },
    value: string,
    setValue: (key: string, val: string) => void,
    obs: string,
    obsType: 'cbf' | 'ofensivo' | 'defensivo'
  ) => {
    const numValue = parseFloat(value)
    const hasObs = obs && obs.trim().length > 0
    const showHelp = dim.diagram || dim.hasHelp
    return (
      <div key={dim.key} className="rounded-xl p-3 transition-colors hover:opacity-90" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-300">{dim.label}</span>
            {showHelp && (
              <button type="button" onClick={() => openHelp(dim.label, dim.desc, dim.diagram)} className="text-slate-500 hover:text-amber-500">
                <HelpCircle className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setObsModal({ open: true, key: dim.key, label: dim.label, type: obsType, value: obs })}
              className={`${hasObs ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}
              title={hasObs ? 'Editar observação' : 'Adicionar observação'}
            >
              <MessageSquare className="w-3 h-3" />
            </button>
          </div>
          <span className="text-sm font-bold" style={{ color: getScoreColor(numValue) }}>{value}</span>
        </div>
        <input
          type="range" min="1" max="5" step="0.5" value={value}
          onChange={(e) => setValue(dim.key, e.target.value)}
          className="w-full h-1 rounded-full appearance-none cursor-pointer slider-mini"
          style={{ background: `linear-gradient(to right, ${getScoreColor(numValue)} ${((numValue - 1) / 4) * 100}%, #475569 ${((numValue - 1) / 4) * 100}%)` }}
        />
      </div>
    )
  }

  // Função para salvar observação do modal
  const saveObservation = (value: string) => {
    if (!obsModal) return
    const { key, type } = obsModal
    if (type === 'cbf') {
      setObsCBF(prev => ({ ...prev, [key]: value }))
    } else if (type === 'ofensivo') {
      setObsOfensivos(prev => ({ ...prev, [key]: value }))
    } else {
      setObsDefensivos(prev => ({ ...prev, [key]: value }))
    }
    setObsModal(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={backUrl} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-slate-700 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-100">Nova Avaliação</h1>
          <p className="text-xs text-slate-400">Preencha as dimensões para avaliar o atleta</p>
        </div>
      </div>

      {/* Painel de Performance - Barra Compacta */}
      <div className="rounded-2xl px-3 py-2" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex items-center gap-4">
          {/* Foto do Atleta */}
          {atletaId && atletas.find(a => a.id === atletaId)?.foto_url ? (
            <img
              src={atletas.find(a => a.id === atletaId)?.foto_url || ''}
              alt="Atleta"
              style={{ width: '72px', height: '72px' }}
              className="rounded-full object-cover border-2 border-amber-500/50 flex-shrink-0"
            />
          ) : (
            <div style={{ width: '72px', height: '72px' }} className="rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-400 text-xl font-bold">
                {atletaId ? atletas.find(a => a.id === atletaId)?.nome?.charAt(0) || '?' : '?'}
              </span>
            </div>
          )}

          {/* Gráfico Completo com Labels */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-3 py-1">
              <div style={{ width: '120px', height: '120px' }}>
                <Radar
                  data={getRadarDataCompleto()}
                  options={{
                    ...radarOptions,
                    scales: {
                      r: {
                        ...radarOptions.scales.r,
                        ticks: { display: false },
                        pointLabels: {
                          display: true,
                          font: { size: 7, weight: 'bold' as const },
                          color: '#94a3b8'
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="text-center">
                <span className="text-blue-400 text-2xl font-black">{mediaGeral}</span>
                <p className="text-[9px] text-slate-400 font-medium">MÉDIA</p>
              </div>
            </div>
          </div>

          {/* Mini Gráficos CBF, OFE, DEF */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <div style={{ width: '40px', height: '40px' }}>
                <Radar data={getRadarDataCBF()} options={{...radarOptions, scales: { r: { ...radarOptions.scales.r, ticks: { display: false }, pointLabels: { display: false } }}}} />
              </div>
              <div className="text-center">
                <span className="text-amber-400 text-xs font-bold">{mediaCBF}</span>
                <p className="text-[7px] text-slate-500">CBF</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div style={{ width: '40px', height: '40px' }}>
                <Radar data={getRadarDataOfensivo()} options={{...radarOptions, scales: { r: { ...radarOptions.scales.r, ticks: { display: false }, pointLabels: { display: false } }}}} />
              </div>
              <div className="text-center">
                <span className="text-green-400 text-xs font-bold">{mediaOfensivo}</span>
                <p className="text-[7px] text-slate-500">OFE</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div style={{ width: '40px', height: '40px' }}>
                <Radar data={getRadarDataDefensivo()} options={{...radarOptions, scales: { r: { ...radarOptions.scales.r, ticks: { display: false }, pointLabels: { display: false } }}}} />
              </div>
              <div className="text-center">
                <span className="text-red-400 text-xs font-bold">{mediaDefensivo}</span>
                <p className="text-[7px] text-slate-500">DEF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Atleta</label>
                <select value={atletaId} onChange={(e) => setAtletaId(e.target.value)} required
                  className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}>
                  <option value="">Selecione...</option>
                  {atletas.map((atleta) => (
                    <option key={atleta.id} value={atleta.id}>{atleta.nome} {getClubeName(atleta.clubes) && `(${getClubeName(atleta.clubes)})`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} required
                  className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}>
                  {tipos.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Data</label>
                <input type="date" value={dataAvaliacao} onChange={(e) => setDataAvaliacao(e.target.value)} required
                  className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }} />
              </div>
              {tipo === 'jogo' && (
                <div>
                  <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Jogo (Vídeo)</label>
                  <select value={jogoId} onChange={(e) => setJogoId(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}>
                    <option value="">Opcional...</option>
                    {jogos.map((jogo) => (<option key={jogo.id} value={jogo.id}>{getClubeName(jogo.clubes)} x {jogo.adversario} - {formatDate(jogo.data_jogo)}</option>))}
                  </select>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Contexto da Avaliação</label>
              <input
                type="text"
                value={contextoTreino}
                onChange={(e) => setContextoTreino(e.target.value)}
                placeholder="Ex: Observação em campo jogo X, Semana de treinos 10/02 a 15/02, etc."
                className="w-full px-4 py-3 text-sm rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl mb-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: '#475569' }}>
              <span className="text-sm font-medium text-slate-400">Dimensões:</span>
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
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
            </div>

            <div className="p-4">
              {activeTab === 'cbf' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {dimensoesCBF.map((dim) => renderDimensionCard(dim, notas[dim.key], (key, val) => setNotas(prev => ({ ...prev, [key]: val })), obsCBF[dim.key] || '', 'cbf'))}
                </div>
              )}
              {activeTab === 'ofensivos' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {principiosOfensivos.map((dim) => renderDimensionCard(dim, notasOfensivos[dim.key], (key, val) => setNotasOfensivos(prev => ({ ...prev, [key]: val })), obsOfensivos[dim.key] || '', 'ofensivo'))}
                </div>
              )}
              {activeTab === 'defensivos' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {principiosDefensivos.map((dim) => renderDimensionCard(dim, notasDefensivos[dim.key], (key, val) => setNotasDefensivos(prev => ({ ...prev, [key]: val })), obsDefensivos[dim.key] || '', 'defensivo'))}
                </div>
              )}
              {activeTab === 'conclusoes' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Pontos Fortes
                    </label>
                    <textarea value={pontosFortes} onChange={(e) => setPontosFortes(e.target.value)} rows={4} placeholder="Principais qualidades..."
                      className="w-full px-3 py-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none placeholder:text-slate-500"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </div>
                  <div className="rounded-xl p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Pontos a Desenvolver
                    </label>
                    <textarea value={pontosDesenvolver} onChange={(e) => setPontosDesenvolver(e.target.value)} rows={4} placeholder="Aspectos a melhorar..."
                      className="w-full px-3 py-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none placeholder:text-slate-500"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </div>
                  <div className="rounded-xl p-3" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Observações Gerais
                    </label>
                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={4} placeholder="Outras observações..."
                      className="w-full px-3 py-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/30 resize-none placeholder:text-slate-500"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg border border-red-500/30 mb-4">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
          <Link href={backUrl} className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">Cancelar</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-medium text-xs hover:bg-amber-400 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Salvar
          </button>
        </div>
      </form>

      {/* Modal de Ajuda */}
      {helpModal?.open && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 999998 }} onClick={() => setHelpModal(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999999, width: '300px', maxWidth: '90vw', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #475569', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{helpModal.title}</h3>
              <button type="button" onClick={() => setHelpModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              {helpModal.diagram && <div style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #475569' }}><helpModal.diagram /></div>}
              <p style={{ color: '#e2e8f0', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>{helpModal.desc}</p>
            </div>
          </div>
        </>
      )}

      {/* Modal de Observação */}
      {obsModal?.open && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 999998 }} onClick={() => setObsModal(null)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999999, width: '350px', maxWidth: '90vw', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #475569', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Observação: {obsModal.label}
              </h3>
              <button type="button" onClick={() => setObsModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <textarea
                autoFocus
                defaultValue={obsModal.value}
                rows={4}
                placeholder="Digite sua observação..."
                className="w-full px-3 py-2 text-sm bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 resize-none placeholder:text-slate-500"
                id="obs-textarea"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setObsModal(null)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.getElementById('obs-textarea') as HTMLTextAreaElement
                    saveObservation(textarea?.value || '')
                  }}
                  className="px-3 py-1.5 text-xs bg-amber-500 text-slate-900 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
