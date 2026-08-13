'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  { key: 'forca', label: 'Força', shortLabel: 'FOR', desc: 'Capacidade física de impor-se nos duelos, proteger a bola e disputar divididas. Inclui força de membros superiores e inferiores, resistência muscular e potência nos saltos e arrancadas.', hasHelp: true },
  { key: 'velocidade', label: 'Velocidade', shortLabel: 'VEL', desc: 'Rapidez de deslocamento com e sem bola, aceleração inicial, velocidade máxima e tempo de reação. Fundamental para transições ofensivas e defensivas.', hasHelp: true },
  { key: 'tecnica', label: 'Técnica', shortLabel: 'TEC', desc: 'Qualidade do domínio de bola, passe curto e longo, condução, finalização e dribles. Avalia a execução precisa dos fundamentos do futebol.', hasHelp: true },
  { key: 'dinamica', label: 'Dinâmica', shortLabel: 'DIN', desc: 'Movimentação constante durante o jogo, intensidade nas ações e capacidade de repetir sprints e esforços de alta intensidade ao longo da partida.', hasHelp: true },
  { key: 'inteligencia', label: 'Inteligência', shortLabel: 'INT', desc: 'Leitura de jogo, antecipação das jogadas, tomada de decisão rápida e visão espacial. Capacidade de entender o contexto tático e fazer escolhas assertivas.', hasHelp: true },
  { key: 'um_contra_um', label: '1 contra 1', shortLabel: '1v1', desc: 'Capacidade de superar o adversário direto no ataque através de dribles e fintas, e de marcar/desarmar na defesa em situações de duelo individual.', hasHelp: true },
  { key: 'atitude', label: 'Atitude', shortLabel: 'ATI', desc: 'Comportamento competitivo, liderança em campo, comunicação com companheiros, concentração e mentalidade vencedora. Postura diante de adversidades.', hasHelp: true },
  { key: 'potencial', label: 'Potencial', shortLabel: 'POT', desc: 'Margem de evolução considerando idade, características físicas, técnicas e capacidade de aprendizado. Projeção de desenvolvimento futuro do atleta.', hasHelp: true },
]

// Princípios Ofensivos
const principiosOfensivos = [
  { key: 'penetracao', label: 'Penetração', shortLabel: 'PEN', desc: 'Ação de avançar com a bola em direção ao gol adversário.', diagram: DiagramPenetracao },
  { key: 'cobertura_ofensiva', label: 'Cobertura Ofensiva', shortLabel: 'COF', desc: 'Ação de aproximação de quem está com a bola.', diagram: DiagramCoberturaOfensiva },
  { key: 'espaco_com_bola', label: 'Espaço com Bola', shortLabel: 'ECB', desc: 'Movimento com posse para ganhar vantagem espacial.', diagram: DiagramEspacoComBola },
  { key: 'espaco_sem_bola', label: 'Espaço sem Bola', shortLabel: 'ESB', desc: 'Movimentação à frente da linha da bola.', diagram: DiagramEspacoSemBola },
  { key: 'mobilidade', label: 'Mobilidade', shortLabel: 'MOB', desc: 'Movimento nas costas da última linha defensiva.', diagram: DiagramMobilidade },
  { key: 'unidade_ofensiva', label: 'Unidade Ofensiva', shortLabel: 'UOF', desc: 'Organização coordenada das linhas de ataque.', diagram: DiagramUnidadeOfensiva },
]

// Princípios Defensivos
const principiosDefensivos = [
  { key: 'contencao', label: 'Contenção', shortLabel: 'CON', desc: 'Ação de retardar o avanço do portador da bola.', diagram: DiagramContencao },
  { key: 'cobertura_defensiva', label: 'Cobertura Defensiva', shortLabel: 'CDF', desc: 'Posicionamento de apoio ao jogador que faz a contenção.', diagram: DiagramCoberturaDefensiva },
  { key: 'equilibrio_recuperacao', label: 'Equilíbrio Recuperação', shortLabel: 'ERE', desc: 'Posicionamento para recuperar a posse.', diagram: DiagramEquilibrioRecuperacao },
  { key: 'equilibrio_defensivo', label: 'Equilíbrio Defensivo', shortLabel: 'EDF', desc: 'Movimentação zonal para estabilidade defensiva.', diagram: DiagramEquilibrioDefensivo },
  { key: 'concentracao_def', label: 'Concentração', shortLabel: 'CNC', desc: 'Ações de proteção em zonas de maior risco.', diagram: DiagramConcentracao },
  { key: 'unidade_defensiva', label: 'Unidade Defensiva', shortLabel: 'UDF', desc: 'Organização coordenada das linhas de defesa.', diagram: DiagramUnidadeDefensiva },
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

const estagiosPHV = [
  { value: 'pre', label: 'Pré-PHV (Antes do pico de crescimento)' },
  { value: 'durante', label: 'Durante PHV (No pico de crescimento)' },
  { value: 'pos', label: 'Pós-PHV (Após o pico de crescimento)' },
]

export default function EditarAvaliacaoPage() {
  const params = useParams()
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [atletaId, setAtletaId] = useState('')
  const [jogoId, setJogoId] = useState('')
  const [contextoTreino, setContextoTreino] = useState('')
  const [dataAvaliacao, setDataAvaliacao] = useState('')
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

  // Minutos jogados, gols e assistencias
  const [minutosJogados, setMinutosJogados] = useState('')
  const [gols, setGols] = useState('0')
  const [assistencias, setAssistencias] = useState('0')

  // Detalhes dos Gols
  const [golsPeDireito, setGolsPeDireito] = useState(0)
  const [golsPeEsquerdo, setGolsPeEsquerdo] = useState(0)
  const [golsCabeca, setGolsCabeca] = useState(0)
  const [golsDentroArea, setGolsDentroArea] = useState(0)
  const [golsForaArea, setGolsForaArea] = useState(0)
  const [golsJogada, setGolsJogada] = useState(0)
  const [golsPenalti, setGolsPenalti] = useState(0)
  const [golsFalta, setGolsFalta] = useState(0)
  const [golsContraAtaque, setGolsContraAtaque] = useState(0)

  // Detalhes das Assistências
  const [assistPasse, setAssistPasse] = useState(0)
  const [assistCruzamento, setAssistCruzamento] = useState(0)
  const [assistLancamento, setAssistLancamento] = useState(0)
  const [assistBolaPparada, setAssistBolaPparada] = useState(0)

  // Estatísticas do jogo (eventos - migração 007/010)
  const [eventos, setEventos] = useState<Record<string, string>>({})
  const setEv = (k: string, v: string) => setEventos(p => ({ ...p, [k]: v }))
  const evNum = (k: string) => (eventos[k] && eventos[k].trim() !== '' ? parseInt(eventos[k]) : null)

  // Contexto do jogo (migração 009)
  const [ctx, setCtx] = useState<Record<string, string>>({})
  const setCtxV = (k: string, v: string) => setCtx(p => ({ ...p, [k]: v }))
  const ctxNum = (k: string) => (ctx[k] && ctx[k].trim() !== '' ? parseInt(ctx[k]) : null)

  // Avaliação Física - Dados Antropométricos
  const [alturaAvaliacao, setAlturaAvaliacao] = useState('')
  const [pesoAvaliacao, setPesoAvaliacao] = useState('')
  const [envergadura, setEnvergadura] = useState('')

  // Avaliação Física - Testes de Velocidade
  const [velocidade10m, setVelocidade10m] = useState('')
  const [velocidade30m, setVelocidade30m] = useState('')

  // Avaliação Física - Potência e Agilidade
  const [saltoVertical, setSaltoVertical] = useState('')
  const [agilidadeTeste, setAgilidadeTeste] = useState('')

  // Avaliação Física - Resistência
  const [yoyoNivel, setYoyoNivel] = useState('')
  const [yoyoDistancia, setYoyoDistancia] = useState('')

  // Avaliação Física - Maturação
  const [idadeBiologica, setIdadeBiologica] = useState('')
  const [estagioPHV, setEstagioPHV] = useState('')

  // Avaliação Física - Flexibilidade
  const [sentarAlcancar, setSentarAlcancar] = useState('')

  // Conclusões
  const [pontosFortes, setPontosFortes] = useState('')
  const [pontosDesenvolver, setPontosDesenvolver] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const [atletasRes, jogosRes, avaliacaoRes] = await Promise.all([
        supabase.from('atletas').select('id, nome, foto_url, clubes(nome)').order('nome'),
        supabase.from('jogos').select('id, adversario, data_jogo, clubes(nome)').order('data_jogo', { ascending: false }),
        supabase.from('avaliacoes_atleta').select('*').eq('id', params.id).single()
      ])

      if (atletasRes.data) setAtletas(atletasRes.data)
      if (jogosRes.data) setJogos(jogosRes.data)

      if (avaliacaoRes.data) {
        const av = avaliacaoRes.data
        setAtletaId(av.atleta_id)
        setJogoId(av.jogo_id || '')
        setContextoTreino(av.contexto_treino || '')
        setDataAvaliacao(av.data_avaliacao)
        setTipo(av.tipo)

        setNotas({
          forca: String(av.forca || 3),
          velocidade: String(av.velocidade || 3),
          tecnica: String(av.tecnica || 3),
          dinamica: String(av.dinamica || 3),
          inteligencia: String(av.inteligencia || 3),
          um_contra_um: String(av.um_contra_um || 3),
          atitude: String(av.atitude || 3),
          potencial: String(av.potencial || 3),
        })

        setObsCBF({
          forca: av.obs_forca || '',
          velocidade: av.obs_velocidade || '',
          tecnica: av.obs_tecnica || '',
          dinamica: av.obs_dinamica || '',
          inteligencia: av.obs_inteligencia || '',
          um_contra_um: av.obs_um_contra_um || '',
          atitude: av.obs_atitude || '',
          potencial: av.obs_potencial || '',
        })

        setNotasOfensivos({
          penetracao: String(av.penetracao || 3),
          cobertura_ofensiva: String(av.cobertura_ofensiva || 3),
          espaco_com_bola: String(av.espaco_com_bola || 3),
          espaco_sem_bola: String(av.espaco_sem_bola || 3),
          mobilidade: String(av.mobilidade || 3),
          unidade_ofensiva: String(av.unidade_ofensiva || 3),
        })

        setObsOfensivos({
          penetracao: av.obs_penetracao || '',
          cobertura_ofensiva: av.obs_cobertura_ofensiva || '',
          espaco_com_bola: av.obs_espaco_com_bola || '',
          espaco_sem_bola: av.obs_espaco_sem_bola || '',
          mobilidade: av.obs_mobilidade || '',
          unidade_ofensiva: av.obs_unidade_ofensiva || '',
        })

        setNotasDefensivos({
          contencao: String(av.contencao || 3),
          cobertura_defensiva: String(av.cobertura_defensiva || 3),
          equilibrio_recuperacao: String(av.equilibrio_recuperacao || 3),
          equilibrio_defensivo: String(av.equilibrio_defensivo || 3),
          concentracao_def: String(av.concentracao_def || 3),
          unidade_defensiva: String(av.unidade_defensiva || 3),
        })

        setObsDefensivos({
          contencao: av.obs_contencao || '',
          cobertura_defensiva: av.obs_cobertura_defensiva || '',
          equilibrio_recuperacao: av.obs_equilibrio_recuperacao || '',
          equilibrio_defensivo: av.obs_equilibrio_defensivo || '',
          concentracao_def: av.obs_concentracao_def || '',
          unidade_defensiva: av.obs_unidade_defensiva || '',
        })

        setPontosFortes(av.pontos_fortes || '')
        setPontosDesenvolver(av.pontos_desenvolver || '')
        setObservacoes(av.observacoes || '')
        setMinutosJogados(av.minutos_jogados ? String(av.minutos_jogados) : '')
        setGols(av.gols ? String(av.gols) : '0')
        setAssistencias(av.assistencias ? String(av.assistencias) : '0')

        // Detalhes dos Gols
        setGolsPeDireito(av.gols_pe_direito || 0)
        setGolsPeEsquerdo(av.gols_pe_esquerdo || 0)
        setGolsCabeca(av.gols_cabeca || 0)
        setGolsDentroArea(av.gols_dentro_area || 0)
        setGolsForaArea(av.gols_fora_area || 0)
        setGolsJogada(av.gols_jogada || 0)
        setGolsPenalti(av.gols_penalti || 0)
        setGolsFalta(av.gols_falta || 0)
        setGolsContraAtaque(av.gols_contra_ataque || 0)

        // Detalhes das Assistências
        setAssistPasse(av.assist_passe || 0)
        setAssistCruzamento(av.assist_cruzamento || 0)
        setAssistLancamento(av.assist_lancamento || 0)
        setAssistBolaPparada(av.assist_bola_parada || 0)

        // Estatísticas do jogo (eventos 007/010)
        const evKeys = ['finalizacoes_no_alvo', 'finalizacoes_fora', 'finalizacoes_bloqueadas', 'toques_area', 'dribles_tentados', 'dribles_certos', 'passes_certos', 'passes_errados', 'passes_decisivos', 'duelos_ganhos', 'duelos_perdidos', 'desarmes', 'interceptacoes', 'bolas_recuperadas', 'perdas_posse']
        const evLoaded: Record<string, string> = {}
        evKeys.forEach(k => { if (av[k] != null) evLoaded[k] = String(av[k]) })
        setEventos(evLoaded)

        // Contexto do jogo (009)
        const ctxLoaded: Record<string, string> = {}
        ;['condicao_entrada', 'situacao_jogo', 'resultado_jogo', 'nivel_adversario', 'importancia_jogo'].forEach(k => { if (av[k]) ctxLoaded[k] = String(av[k]) })
        ;['gols_decisivos', 'assistencias_decisivas'].forEach(k => { if (av[k] != null) ctxLoaded[k] = String(av[k]) })
        setCtx(ctxLoaded)

        // Avaliação Física
        setAlturaAvaliacao(av.altura_avaliacao != null ? String(av.altura_avaliacao) : '')
        setPesoAvaliacao(av.peso_avaliacao != null ? String(av.peso_avaliacao) : '')
        setEnvergadura(av.envergadura != null ? String(av.envergadura) : '')
        setVelocidade10m(av.velocidade_10m != null ? String(av.velocidade_10m) : '')
        setVelocidade30m(av.velocidade_30m != null ? String(av.velocidade_30m) : '')
        setSaltoVertical(av.salto_vertical != null ? String(av.salto_vertical) : '')
        setAgilidadeTeste(av.agilidade_teste != null ? String(av.agilidade_teste) : '')
        setYoyoNivel(av.yoyo_nivel || '')
        setYoyoDistancia(av.yoyo_distancia != null ? String(av.yoyo_distancia) : '')
        setIdadeBiologica(av.idade_biologica != null ? String(av.idade_biologica) : '')
        setEstagioPHV(av.estagio_phv || '')
        setSentarAlcancar(av.sentar_alcancar != null ? String(av.sentar_alcancar) : '')
      }

      setLoading(false)
    }
    loadData()
  }, [supabase, params.id])

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
    setSaving(true)
    setError('')

    const { error } = await supabase.from('avaliacoes_atleta').update({
      atleta_id: atletaId,
      jogo_id: jogoId || null,
      contexto_treino: contextoTreino || null,
      data_avaliacao: dataAvaliacao,
      tipo,
      minutos_jogados: minutosJogados ? parseInt(minutosJogados) : null,
      gols: gols ? parseInt(gols) : 0,
      assistencias: assistencias ? parseInt(assistencias) : 0,
      // Detalhes dos Gols
      gols_pe_direito: golsPeDireito,
      gols_pe_esquerdo: golsPeEsquerdo,
      gols_cabeca: golsCabeca,
      gols_dentro_area: golsDentroArea,
      gols_fora_area: golsForaArea,
      gols_jogada: golsJogada,
      gols_penalti: golsPenalti,
      gols_falta: golsFalta,
      gols_contra_ataque: golsContraAtaque,
      // Detalhes das Assistências
      assist_passe: assistPasse,
      assist_cruzamento: assistCruzamento,
      assist_lancamento: assistLancamento,
      assist_bola_parada: assistBolaPparada,
      // Estatísticas do jogo (eventos 007)
      finalizacoes_no_alvo: evNum('finalizacoes_no_alvo'),
      finalizacoes_fora: evNum('finalizacoes_fora'),
      finalizacoes_bloqueadas: evNum('finalizacoes_bloqueadas'),
      passes_certos: evNum('passes_certos'),
      passes_errados: evNum('passes_errados'),
      passes_decisivos: evNum('passes_decisivos'),
      duelos_ganhos: evNum('duelos_ganhos'),
      duelos_perdidos: evNum('duelos_perdidos'),
      desarmes: evNum('desarmes'),
      interceptacoes: evNum('interceptacoes'),
      perdas_posse: evNum('perdas_posse'),
      // Eventos avançados (010)
      dribles_tentados: evNum('dribles_tentados'),
      dribles_certos: evNum('dribles_certos'),
      bolas_recuperadas: evNum('bolas_recuperadas'),
      toques_area: evNum('toques_area'),
      // Contexto e impacto (009)
      condicao_entrada: ctx.condicao_entrada || null,
      situacao_jogo: ctx.situacao_jogo || null,
      resultado_jogo: ctx.resultado_jogo || null,
      nivel_adversario: ctx.nivel_adversario || null,
      importancia_jogo: ctx.importancia_jogo || null,
      gols_decisivos: ctxNum('gols_decisivos'),
      assistencias_decisivas: ctxNum('assistencias_decisivas'),
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
      observacoes: observacoes || null,
      // Avaliação Física
      altura_avaliacao: alturaAvaliacao ? parseFloat(alturaAvaliacao) : null,
      peso_avaliacao: pesoAvaliacao ? parseFloat(pesoAvaliacao) : null,
      envergadura: envergadura ? parseFloat(envergadura) : null,
      velocidade_10m: velocidade10m ? parseFloat(velocidade10m) : null,
      velocidade_30m: velocidade30m ? parseFloat(velocidade30m) : null,
      salto_vertical: saltoVertical ? parseFloat(saltoVertical) : null,
      agilidade_teste: agilidadeTeste ? parseFloat(agilidadeTeste) : null,
      yoyo_nivel: yoyoNivel || null,
      yoyo_distancia: yoyoDistancia ? parseInt(yoyoDistancia) : null,
      idade_biologica: idadeBiologica ? parseFloat(idadeBiologica) : null,
      estagio_phv: estagioPHV || null,
      sentar_alcancar: sentarAlcancar ? parseFloat(sentarAlcancar) : null,
    }).eq('id', params.id)

    if (error) {
      console.error(error)
      setError('Erro ao salvar avaliação.')
      setSaving(false)
      return
    }

    // Redirecionar para a página do atleta
    if (atletaId) {
      router.push(`/avaliacoes/atleta/${atletaId}`)
    } else {
      router.push('/avaliacoes')
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR')

  // URL de volta baseada no atleta da avaliação
  const backUrl = atletaId ? `/avaliacoes/atleta/${atletaId}` : '/avaliacoes'

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
    const cor = getScoreColor(numValue)
    const floor = Math.floor(numValue)
    const temHalf = numValue - floor === 0.5
    const fundoChip = (i: number) =>
      i <= floor ? cor : i === floor + 1 && temHalf ? `linear-gradient(90deg, ${cor} 50%, #1e293b 50%)` : '#1e293b'
    return (
      <div key={dim.key} className="rounded-lg px-2.5 py-2" style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <span className="text-xs font-medium text-slate-200 truncate">{dim.label}</span>
          <div className="flex items-center gap-0.5 shrink-0">
            {showHelp && (
              <button
                type="button"
                onClick={() => openHelp(dim.label, dim.desc, dim.diagram)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                title="Ver detalhes"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setObsModal({ open: true, key: dim.key, label: dim.label, type: obsType, value: obs })}
              className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${hasObs ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-700'}`}
              title={hasObs ? 'Editar observação' : 'Adicionar observação'}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-[2px] flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setValue(dim.key, String(i))}
                aria-label={`Nota ${i}`}
                className="flex-1 h-3.5 rounded-[3px] transition-all hover:brightness-110"
                style={{ background: fundoChip(i) }}
              />
            ))}
          </div>
          <span className="text-sm font-black tabular-nums w-5 text-center shrink-0" style={{ color: cor }}>{value}</span>
          <button
            type="button"
            onClick={() => setValue(dim.key, temHalf ? String(floor) : String(Math.min(5, numValue + 0.5)))}
            title="Meio ponto (ex.: 3,5)"
            aria-label="Meio ponto"
            className="w-6 h-6 rounded-md text-[11px] font-bold shrink-0 transition-all"
            style={temHalf ? { backgroundColor: cor, color: '#0f172a' } : { backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
          >
            ½
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
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
          <h1 className="text-lg font-bold text-slate-100">Editar Avaliação</h1>
          <p className="text-xs text-slate-400">Atualize as dimensões da avaliação do atleta</p>
        </div>
      </div>

      {/* Painel de Performance - Barra Compacta */}
      <div className="rounded-2xl px-3 py-2" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* Foto do Atleta */}
          {atletaId && atletas.find(a => a.id === atletaId)?.foto_url ? (
            <img
              src={atletas.find(a => a.id === atletaId)?.foto_url || ''}
              alt="Atleta"
              className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full object-cover border-2 border-amber-500/50 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-400 text-lg sm:text-xl font-bold">
                {atletaId ? atletas.find(a => a.id === atletaId)?.nome?.charAt(0) || '?' : '?'}
              </span>
            </div>
          )}

          {/* Gráfico Completo com Labels */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-700/30 rounded-lg px-2 sm:px-3 py-1">
              <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]">
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
                          font: { size: 6, weight: 'bold' as const },
                          color: '#94a3b8'
                        }
                      }
                    }
                  }}
                />
              </div>
              <div className="text-center">
                <span className="text-blue-400 text-xl sm:text-2xl font-black">{mediaGeral}</span>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium">MÉDIA</p>
              </div>
            </div>
          </div>

          {/* Mini Gráficos CBF, OFE, DEF */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <Radar data={getRadarDataCBF()} options={{...radarOptions, scales: { r: { ...radarOptions.scales.r, ticks: { display: false }, pointLabels: { display: false } }}}} />
              </div>
              <div className="text-center">
                <span className="text-amber-400 text-[10px] sm:text-xs font-bold">{mediaCBF}</span>
                <p className="text-[6px] sm:text-[7px] text-slate-500">CBF</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <Radar data={getRadarDataOfensivo()} options={{...radarOptions, scales: { r: { ...radarOptions.scales.r, ticks: { display: false }, pointLabels: { display: false } }}}} />
              </div>
              <div className="text-center">
                <span className="text-green-400 text-[10px] sm:text-xs font-bold">{mediaOfensivo}</span>
                <p className="text-[6px] sm:text-[7px] text-slate-500">OFE</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <Radar data={getRadarDataDefensivo()} options={{...radarOptions, scales: { r: { ...radarOptions.scales.r, ticks: { display: false }, pointLabels: { display: false } }}}} />
              </div>
              <div className="text-center">
                <span className="text-red-400 text-[10px] sm:text-xs font-bold">{mediaDefensivo}</span>
                <p className="text-[6px] sm:text-[7px] text-slate-500">DEF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <form onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <div className="rounded-2xl p-3 sm:p-5 mb-4" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
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
                <>
                  <div>
                    <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Jogo (Vídeo)</label>
                    <select value={jogoId} onChange={(e) => setJogoId(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}>
                      <option value="">Opcional...</option>
                      {jogos.map((jogo) => (<option key={jogo.id} value={jogo.id}>{getClubeName(jogo.clubes)} x {jogo.adversario} - {formatDate(jogo.data_jogo)}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-amber-500 uppercase mb-2">Minutos Jogados</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={minutosJogados}
                      onChange={(e) => setMinutosJogados(e.target.value)}
                      placeholder="Ex: 90"
                      className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-500 uppercase mb-2">Gols</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={gols}
                      onChange={(e) => setGols(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30"
                      style={{ backgroundColor: '#0f172a', border: '1px solid #22c55e', color: '#e2e8f0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-500 uppercase mb-2">Assistencias</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={assistencias}
                      onChange={(e) => setAssistencias(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      style={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6', color: '#e2e8f0' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Detalhes de Gols */}
            {tipo === 'jogo' && parseInt(gols || '0') > 0 && (
              <div className="mt-4 rounded-xl p-3 sm:p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #22c55e40' }}>
                <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <span>⚽</span> Detalhes dos {gols} Gol{parseInt(gols) > 1 ? 's' : ''}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Parte do corpo */}
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-2">Parte do Corpo</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Pé Direito</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsPeDireito}
                          onChange={(e) => setGolsPeDireito(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Pé Esquerdo</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsPeEsquerdo}
                          onChange={(e) => setGolsPeEsquerdo(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Cabeça</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsCabeca}
                          onChange={(e) => setGolsCabeca(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                    </div>
                  </div>
                  {/* Zona */}
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-2">Zona do Gol</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Dentro da Área</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsDentroArea}
                          onChange={(e) => setGolsDentroArea(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Fora da Área</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsForaArea}
                          onChange={(e) => setGolsForaArea(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                    </div>
                  </div>
                  {/* Tipo */}
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase mb-2">Tipo de Gol</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Jogada</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsJogada}
                          onChange={(e) => setGolsJogada(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Pênalti</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsPenalti}
                          onChange={(e) => setGolsPenalti(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Bola Parada</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsFalta}
                          onChange={(e) => setGolsFalta(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">Contra-ataque</span>
                        <input type="number" min="0" max={parseInt(gols || '0')} value={golsContraAtaque}
                          onChange={(e) => setGolsContraAtaque(parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalhes de Assistências */}
            {tipo === 'jogo' && parseInt(assistencias || '0') > 0 && (
              <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #3b82f640' }}>
                <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <span>🎯</span> Detalhes das {assistencias} Assistência{parseInt(assistencias) > 1 ? 's' : ''}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Passe</span>
                    <input type="number" min="0" max={parseInt(assistencias || '0')} value={assistPasse}
                      onChange={(e) => setAssistPasse(parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Cruzamento</span>
                    <input type="number" min="0" max={parseInt(assistencias || '0')} value={assistCruzamento}
                      onChange={(e) => setAssistCruzamento(parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Lançamento</span>
                    <input type="number" min="0" max={parseInt(assistencias || '0')} value={assistLancamento}
                      onChange={(e) => setAssistLancamento(parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Bola Parada</span>
                    <input type="number" min="0" max={parseInt(assistencias || '0')} value={assistBolaPparada}
                      onChange={(e) => setAssistBolaPparada(parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-sm text-center rounded-lg"
                      style={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#e2e8f0' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Contexto do jogo (migração 009) */}
            {tipo === 'jogo' && (
              <div className="mt-4 rounded-xl p-3 sm:p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2"><span>🎯</span> Contexto do jogo <span className="text-[10px] text-slate-500 font-normal">(opcional — pondera a produção)</span></h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {([
                    { k: 'condicao_entrada', label: 'Entrada', opts: [['titular', 'Titular'], ['reserva', 'Reserva']] },
                    { k: 'situacao_jogo', label: 'Situação', opts: [['ganhando', 'Ganhando'], ['empatando', 'Empatando'], ['perdendo', 'Perdendo']] },
                    { k: 'resultado_jogo', label: 'Resultado', opts: [['vitoria', 'Vitória'], ['empate', 'Empate'], ['derrota', 'Derrota']] },
                    { k: 'nivel_adversario', label: 'Adversário', opts: [['forte', 'Forte'], ['medio', 'Médio'], ['fraco', 'Fraco']] },
                    { k: 'importancia_jogo', label: 'Importância', opts: [['amistoso', 'Amistoso'], ['campeonato', 'Campeonato'], ['decisao', 'Decisão']] },
                  ] as { k: string; label: string; opts: [string, string][] }[]).map(({ k, label, opts }) => (
                    <div key={k}>
                      <label className="block text-[10px] text-slate-400 mb-1">{label}</label>
                      <select value={ctx[k] ?? ''} onChange={(e) => setCtxV(k, e.target.value)} className="w-full px-2 py-1.5 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                        <option value="">—</option>
                        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Gols decisivos</label>
                    <input type="number" min="0" value={ctx.gols_decisivos ?? ''} onChange={(e) => setCtxV('gols_decisivos', e.target.value)} placeholder="0" className="w-full px-2 py-1.5 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Assist. decisivas</label>
                    <input type="number" min="0" value={ctx.assistencias_decisivas ?? ''} onChange={(e) => setCtxV('assistencias_decisivas', e.target.value)} placeholder="0" className="w-full px-2 py-1.5 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Estatísticas do jogo (eventos - migração 007/010) */}
            {tipo === 'jogo' && (
              <div className="mt-4 rounded-xl p-3 sm:p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2"><span>📊</span> Estatísticas do jogo <span className="text-[10px] text-slate-500 font-normal">(opcional)</span></h4>
                {([
                  { titulo: 'Finalizações', cor: '#22c55e', campos: [['finalizacoes_no_alvo', 'No alvo'], ['finalizacoes_fora', 'Para fora'], ['finalizacoes_bloqueadas', 'Bloqueadas'], ['toques_area', 'Toques na área']] },
                  { titulo: '1 contra 1 (dribles)', cor: '#ec4899', campos: [['dribles_tentados', 'Tentados'], ['dribles_certos', 'Certos']] },
                  { titulo: 'Passes', cor: '#3b82f6', campos: [['passes_certos', 'Certos'], ['passes_errados', 'Errados'], ['passes_decisivos', 'Decisivos']] },
                  { titulo: 'Duelos e recuperação', cor: '#f59e0b', campos: [['duelos_ganhos', 'Duelos ganhos'], ['duelos_perdidos', 'Duelos perdidos'], ['desarmes', 'Desarmes'], ['interceptacoes', 'Interceptações'], ['bolas_recuperadas', 'Bolas recuperadas']] },
                  { titulo: 'Controle de bola', cor: '#a855f7', campos: [['perdas_posse', 'Perdas de posse']] },
                ] as { titulo: string; cor: string; campos: [string, string][] }[]).map((grupo) => (
                  <div key={grupo.titulo} className="mb-3 last:mb-0">
                    <p className="text-[10px] uppercase mb-1.5 font-medium" style={{ color: grupo.cor }}>{grupo.titulo}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {grupo.campos.map(([k, label]) => (
                        <div key={k}>
                          <label className="block text-[10px] text-slate-400 mb-1 truncate">{label}</label>
                          <input
                            type="number" min="0" value={eventos[k] ?? ''} onChange={(e) => setEv(k, e.target.value)} placeholder="0"
                            className="w-full px-2 py-1.5 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                            style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
            <div className="p-3 sm:p-4">
              <div className="grid gap-3 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-400 mb-2 px-1">Dimensões CBF</h3>
                  <div className="space-y-1.5">
                    {dimensoesCBF.map((dim) => renderDimensionCard(dim, notas[dim.key], (key, val) => setNotas(prev => ({ ...prev, [key]: val })), obsCBF[dim.key] || '', 'cbf'))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-2 px-1">Princípios Ofensivos</h3>
                  <div className="space-y-1.5">
                    {principiosOfensivos.map((dim) => renderDimensionCard(dim, notasOfensivos[dim.key], (key, val) => setNotasOfensivos(prev => ({ ...prev, [key]: val })), obsOfensivos[dim.key] || '', 'ofensivo'))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-red-400 mb-2 px-1">Princípios Defensivos</h3>
                  <div className="space-y-1.5">
                    {principiosDefensivos.map((dim) => renderDimensionCard(dim, notasDefensivos[dim.key], (key, val) => setNotasDefensivos(prev => ({ ...prev, [key]: val })), obsDefensivos[dim.key] || '', 'defensivo'))}
                  </div>
                </div>
              {activeTab === 'fisico' && (
                <div className="space-y-4">
                  {/* Dados Antropométricos */}
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Dados Antropométricos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Altura (m)</label>
                        <input type="number" step="0.01" min="1.00" max="2.50" value={alturaAvaliacao} onChange={(e) => setAlturaAvaliacao(e.target.value)} placeholder="1.75"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Peso (kg)</label>
                        <input type="number" step="0.1" min="30" max="150" value={pesoAvaliacao} onChange={(e) => setPesoAvaliacao(e.target.value)} placeholder="65.5"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Envergadura (m)</label>
                        <input type="number" step="0.01" min="1.00" max="2.50" value={envergadura} onChange={(e) => setEnvergadura(e.target.value)} placeholder="1.80"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">IMC</label>
                        <div className="px-3 py-2 text-sm rounded-lg text-amber-400 font-semibold"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          {alturaAvaliacao && pesoAvaliacao ? (parseFloat(pesoAvaliacao) / Math.pow(parseFloat(alturaAvaliacao), 2)).toFixed(1) : '-'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testes de Velocidade */}
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Testes de Velocidade
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">10 metros (segundos)</label>
                        <input type="number" step="0.01" min="1.00" max="5.00" value={velocidade10m} onChange={(e) => setVelocidade10m(e.target.value)} placeholder="1.85"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <p className="text-[9px] text-slate-500 mt-1">Explosao inicial</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">30 metros (segundos)</label>
                        <input type="number" step="0.01" min="3.00" max="8.00" value={velocidade30m} onChange={(e) => setVelocidade30m(e.target.value)} placeholder="4.25"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <p className="text-[9px] text-slate-500 mt-1">Velocidade maxima</p>
                      </div>
                    </div>
                  </div>

                  {/* Potência e Agilidade */}
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Potencia e Agilidade
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Salto Vertical (cm)</label>
                        <input type="number" step="0.5" min="10" max="100" value={saltoVertical} onChange={(e) => setSaltoVertical(e.target.value)} placeholder="45.5"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <p className="text-[9px] text-slate-500 mt-1">Potencia de pernas</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Teste Agilidade (segundos)</label>
                        <input type="number" step="0.01" min="5.00" max="20.00" value={agilidadeTeste} onChange={(e) => setAgilidadeTeste(e.target.value)} placeholder="9.50"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <p className="text-[9px] text-slate-500 mt-1">Teste T ou Illinois</p>
                      </div>
                    </div>
                  </div>

                  {/* Resistência */}
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Resistencia (Yo-Yo Test)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Nivel Alcancado</label>
                        <input type="text" value={yoyoNivel} onChange={(e) => setYoyoNivel(e.target.value)} placeholder="15.1"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Distancia (metros)</label>
                        <input type="number" min="100" max="5000" value={yoyoDistancia} onChange={(e) => setYoyoDistancia(e.target.value)} placeholder="1200"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                      </div>
                    </div>
                  </div>

                  {/* Maturação */}
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="text-sm font-semibold text-pink-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      Maturacao
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Idade Biologica</label>
                        <input type="number" step="0.1" min="8" max="25" value={idadeBiologica} onChange={(e) => setIdadeBiologica(e.target.value)} placeholder="14.5"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <p className="text-[9px] text-slate-500 mt-1">Estimada pelo clube/medico</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Estagio PHV</label>
                        <select value={estagioPHV} onChange={(e) => setEstagioPHV(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                          <option value="">Selecione...</option>
                          {estagiosPHV.map(e => (
                            <option key={e.value} value={e.value}>{e.label}</option>
                          ))}
                        </select>
                        <p className="text-[9px] text-slate-500 mt-1">Pico de Velocidade de Crescimento</p>
                      </div>
                    </div>
                  </div>

                  {/* Flexibilidade */}
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      Flexibilidade
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">Sentar e Alcancar (cm)</label>
                        <input type="number" step="0.5" min="-20" max="60" value={sentarAlcancar} onChange={(e) => setSentarAlcancar(e.target.value)} placeholder="25.0"
                          className="w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                          style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                        <p className="text-[9px] text-slate-500 mt-1">Flexibilidade da cadeia posterior</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300 mb-2 px-1">Conclusões</h3>
                  <div className="space-y-2">
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                      <label className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Pontos fortes</label>
                      <textarea value={pontosFortes} onChange={(e) => setPontosFortes(e.target.value)} rows={3} placeholder="Principais qualidades..." className="w-full px-2.5 py-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none placeholder:text-slate-500" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    </div>
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                      <label className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Pontos a desenvolver</label>
                      <textarea value={pontosDesenvolver} onChange={(e) => setPontosDesenvolver(e.target.value)} rows={3} placeholder="Aspectos a melhorar..." className="w-full px-2.5 py-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none placeholder:text-slate-500" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    </div>
                    <div className="rounded-lg p-2.5" style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                      <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Observações gerais</label>
                      <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} placeholder="Outras observações..." className="w-full px-2.5 py-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500/30 resize-none placeholder:text-slate-500" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-500/10 text-red-400 text-xs p-3 rounded-lg border border-red-500/30 mb-4">{error}</div>}

          <div className="flex justify-end gap-2 pt-2">
          <Link href={backUrl} className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">Cancelar</Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-medium text-xs hover:bg-amber-400 transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
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
