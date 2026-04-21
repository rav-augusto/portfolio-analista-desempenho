'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Edit3, Play, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Jogo = {
  id: string
  adversario: string
  data_jogo: string
  competicao: string
  fase: string | null
  placar_clube: number | null
  placar_adversario: number | null
  video_url: string | null
  clubes: { nome: string; sigla?: string; escudo_url?: string } | { nome: string; sigla?: string; escudo_url?: string }[] | null
}

type Analise = Record<string, unknown>

const n = (v: unknown): number => (typeof v === 'number' ? v : 0)
const s = (v: unknown): string => (typeof v === 'string' ? v : '')

function getSigla(nome: string, siglaDb?: string | null): string {
  if (siglaDb) return siglaDb.toUpperCase()
  const words = nome.trim().split(/\s+/)
  if (words.length === 1) return nome.substring(0, 3).toUpperCase()
  return words.filter(w => !['de', 'da', 'do', 'dos', 'das', 'e'].includes(w.toLowerCase()))
    .map(w => w[0]).join('').substring(0, 3).toUpperCase()
}

// Card colorido
function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: color }}>
      <div className="text-white/80 text-xs font-medium mb-1">{label}</div>
      <div className="text-white text-2xl font-black">{value}</div>
    </div>
  )
}

// Seção com título
function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#1e293b', border: '1px solid #334155' }}>
      <div className="px-4 py-3" style={{ background: color }}>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

// Linha de stat simples
function StatLine({ label, value }: { label: string; value: string | number }) {
  if (!value || value === 0 || value === '0') return null
  return (
    <div className="flex justify-between py-2 border-b border-slate-700/50 last:border-0">
      <span style={{ color: '#94a3b8' }} className="text-sm">{label}</span>
      <span style={{ color: '#ffffff' }} className="text-sm font-semibold">{value}</span>
    </div>
  )
}

// Rating stars
function RatingStars({ value, label }: { value: number; label: string }) {
  if (!value) return null
  return (
    <div className="text-center">
      <div className="flex justify-center gap-0.5 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className="w-4 h-4"
            style={{
              fill: i <= value ? '#f59e0b' : 'transparent',
              color: i <= value ? '#f59e0b' : '#475569'
            }}
          />
        ))}
      </div>
      <div className="text-xs" style={{ color: '#94a3b8' }}>{label}</div>
    </div>
  )
}

export default function DashboardAnalisePage() {
  const [analise, setAnalise] = useState<Analise | null>(null)
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const id = params.id as string
      if (!id) return setLoading(false)

      const { data: a } = await supabase.from('analises_jogo').select('*').eq('id', id).single()
      if (!a) return setLoading(false)
      setAnalise(a as Analise)

      if (a.jogo_id) {
        const { data: j } = await supabase
          .from('jogos')
          .select('id, adversario, data_jogo, competicao, fase, placar_clube, placar_adversario, video_url, clubes(nome, sigla, escudo_url)')
          .eq('id', a.jogo_id)
          .single()
        if (j) setJogo(j as Jogo)
      }
      setLoading(false)
    }
    loadData()
  }, [params.id, supabase])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#f59e0b' }} />
    </div>
  )

  if (!analise) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a', color: '#64748b' }}>
      Analise nao encontrada
    </div>
  )

  const clubeObj = jogo?.clubes ? (Array.isArray(jogo.clubes) ? jogo.clubes[0] : jogo.clubes) : null
  const clube = clubeObj?.nome || 'Time'
  const clubeEscudo = clubeObj?.escudo_url || null
  const clubeSigla = getSigla(clube, clubeObj?.sigla)
  const adversario = jogo?.adversario || 'Adversario'

  const gf = jogo?.placar_clube ?? 0
  const gc = jogo?.placar_adversario ?? 0
  const resultado = gf > gc ? 'V' : gf < gc ? 'D' : 'E'
  const resultadoColor = resultado === 'V' ? '#22c55e' : resultado === 'D' ? '#ef4444' : '#f59e0b'

  // Dados da análise
  const a = analise

  // Verificar se seções têm dados
  const hasOrgOfensiva = n(a.posse_bola) || n(a.finalizacoes_total) || n(a.passes_total) || s(a.sistema_tatico)
  const hasOrgDefensiva = n(a.recuperacoes_bola) || n(a.desarmes) || n(a.interceptacoes) || s(a.bloco_defensivo)
  const hasTransicoes = n(a.contra_ataques) || n(a.trans_ofensiva_velocidade) || n(a.trans_defensiva_velocidade)
  const hasBolasParadas = n(a.escanteios_total) || n(a.gols_bola_parada) || n(a.penaltis_favor)
  const hasGoleiro = n(a.defesas_total) || n(a.defesas_dificeis) || n(a.saidas_gol)
  const hasDadosAvancados = n(a.xg_favor) || n(a.ppda) || n(a.nota_geral)
  const hasConclusoes = s(a.pontos_fortes) || s(a.pontos_fracos) || s(a.conclusoes)

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      {/* Header centralizado */}
      <div className="max-w-md mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link href="/analises" className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1e293b', color: '#94a3b8' }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
              {jogo?.competicao}{jogo?.fase ? ` - ${jogo.fase}` : ''}
            </div>
            <div className="text-xs" style={{ color: '#64748b' }}>
              {jogo?.data_jogo ? new Date(jogo.data_jogo + 'T12:00:00').toLocaleDateString('pt-BR') : ''}
            </div>
          </div>
          <Link href={`/analises/${params.id}`} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1e293b', color: '#94a3b8' }}>
            <Edit3 className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Layout 3 colunas lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 320px)', gap: '16px', justifyContent: 'center', padding: '0 16px 24px' }}>

        {/* COLUNA ESQUERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Organização Ofensiva */}
          {hasOrgOfensiva && (
              <Section title="Organizacao Ofensiva" color="linear-gradient(135deg, #22c55e, #16a34a)">
                <StatLine label="Sistema Tatico" value={s(a.sistema_tatico)} />
                <StatLine label="Saida de Bola" value={s(a.saida_bola_tipo)} />
                <StatLine label="Lado Preferencial" value={s(a.lado_preferencial)} />
                <StatLine label="Grandes Chances" value={n(a.grandes_chances)} />
                <StatLine label="Chances Perdidas" value={n(a.grandes_chances_perdidas)} />
                <StatLine label="Entradas na Area" value={n(a.entradas_area)} />
                <StatLine label="Passes Certos" value={n(a.passes_certos)} />
                <StatLine label="Passes Terco Final" value={n(a.passes_terco_final)} />
                <StatLine label="Cruzamentos" value={n(a.cruzamentos_total)} />
                {s(a.org_ofensiva_obs) && (
                  <div className="mt-3 p-3 rounded-xl" style={{ background: '#0f172a' }}>
                    <div className="text-xs mb-1" style={{ color: '#64748b' }}>Obs</div>
                    <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.org_ofensiva_obs)}</div>
                  </div>
                )}
              </Section>
            )}

            {/* Transições */}
            {hasTransicoes && (
              <Section title="Transicoes" color="linear-gradient(135deg, #a855f7, #7c3aed)">
                <StatLine label="Primeira Acao" value={s(a.primeira_acao_tipo)} />
                <StatLine label="Contra-Ataques" value={n(a.contra_ataques)} />
                <StatLine label="Finalizados" value={n(a.contra_ataques_finalizados)} />
                <StatLine label="Gols C.Ataque" value={n(a.gols_contra_ataque)} />
                <StatLine label="Reacao a Perda" value={s(a.reacao_perda_tipo)} />
                {(n(a.trans_ofensiva_velocidade) > 0 || n(a.trans_ofensiva_efetividade) > 0) && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <RatingStars value={n(a.trans_ofensiva_velocidade)} label="Velocidade" />
                    <RatingStars value={n(a.trans_ofensiva_efetividade)} label="Efetividade" />
                  </div>
                )}
              </Section>
            )}

            {/* Goleiro */}
            {hasGoleiro && (
              <Section title="Goleiro" color="linear-gradient(135deg, #06b6d4, #0891b2)">
                <StatLine label="Defesas" value={n(a.defesas_total)} />
                <StatLine label="Defesas Dificeis" value={n(a.defesas_dificeis)} />
                <StatLine label="Saidas do Gol" value={n(a.saidas_gol)} />
                <StatLine label="Passes GK" value={n(a.passes_gk_certos) > 0 ? `${n(a.passes_gk_certos)}/${n(a.passes_gk_total)}` : ''} />
              </Section>
            )}
        </div>

        {/* COLUNA CENTRAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Placar */}
        <div className="rounded-2xl p-6 text-center" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <div className="flex justify-center mb-3">
            {clubeEscudo ? (
              <Image src={clubeEscudo} alt={clube} width={64} height={64} className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}>
                {clubeSigla.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="text-base font-bold mb-4" style={{ color: '#ffffff' }}>{clube}</div>
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-6xl font-black" style={{ color: '#ffffff' }}>{gf}</span>
            <span className="text-3xl" style={{ color: '#475569' }}>x</span>
            <span className="text-6xl font-black" style={{ color: '#475569' }}>{gc}</span>
          </div>
          <div className="text-sm mb-3" style={{ color: '#94a3b8' }}>vs {adversario}</div>
          <span className="inline-block text-sm font-bold px-6 py-2 rounded-full text-white" style={{ background: resultadoColor }}>
            {resultado === 'V' ? 'VITORIA' : resultado === 'D' ? 'DERROTA' : 'EMPATE'}
          </span>
        </div>

        {/* Notas/Ratings */}
            {(n(a.nota_geral) > 0 || n(a.indice_ofensivo) > 0 || n(a.indice_defensivo) > 0) && (
              <div className="rounded-2xl p-4" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <div className="grid grid-cols-3 gap-4">
                  <RatingStars value={n(a.nota_geral)} label="Geral" />
                  <RatingStars value={n(a.indice_ofensivo)} label="Ofensivo" />
                  <RatingStars value={n(a.indice_defensivo)} label="Defensivo" />
                </div>
              </div>
            )}

            {/* Cards principais */}
            <div className="grid grid-cols-2 gap-3">
              {n(a.posse_bola) > 0 && <StatCard label="Posse de Bola" value={`${n(a.posse_bola)}%`} color="linear-gradient(135deg, #f59e0b, #ea580c)" />}
              {n(a.finalizacoes_total) > 0 && <StatCard label="Finalizacoes" value={n(a.finalizacoes_total)} color="linear-gradient(135deg, #3b82f6, #2563eb)" />}
              {n(a.finalizacoes_gol) > 0 && <StatCard label="Chutes ao Gol" value={n(a.finalizacoes_gol)} color="linear-gradient(135deg, #22c55e, #16a34a)" />}
              {n(a.contra_ataques) > 0 && <StatCard label="Transicoes" value={n(a.contra_ataques)} color="linear-gradient(135deg, #a855f7, #7c3aed)" />}
              {n(a.passes_total) > 0 && <StatCard label="Passes" value={n(a.passes_total)} color="linear-gradient(135deg, #06b6d4, #0891b2)" />}
              {n(a.escanteios_total) > 0 && <StatCard label="Escanteios" value={n(a.escanteios_total)} color="linear-gradient(135deg, #ec4899, #db2777)" />}
              {n(a.recuperacoes_bola) > 0 && <StatCard label="Recuperacoes" value={n(a.recuperacoes_bola)} color="linear-gradient(135deg, #6366f1, #4f46e5)" />}
              {n(a.desarmes) > 0 && <StatCard label="Desarmes" value={n(a.desarmes)} color="linear-gradient(135deg, #64748b, #475569)" />}
            </div>

            {/* Video */}
            {jogo?.video_url && (
              <a
                href={jogo.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl py-4 text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
              >
                <Play className="w-5 h-5 fill-white" />
                Assistir Jogo
              </a>
          )}
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Organização Defensiva */}
            {hasOrgDefensiva && (
              <Section title="Organizacao Defensiva" color="linear-gradient(135deg, #ef4444, #dc2626)">
                <StatLine label="Bloco Defensivo" value={s(a.bloco_defensivo)} />
                <StatLine label="Tipo de Marcacao" value={s(a.marcacao_tipo)} />
                <StatLine label="Linha Defensiva" value={s(a.linha_defensiva_altura)} />
                <StatLine label="Interceptacoes" value={n(a.interceptacoes)} />
                <StatLine label="Duelos Ganhos" value={n(a.duelos_ganhos) > 0 ? `${n(a.duelos_ganhos)}/${n(a.duelos_total)}` : ''} />
                <StatLine label="Duelos Aereos" value={n(a.duelos_aereos_ganhos) > 0 ? `${n(a.duelos_aereos_ganhos)}/${n(a.duelos_aereos_total)}` : ''} />
                <StatLine label="Faltas Cometidas" value={n(a.faltas_cometidas)} />
                {(n(a.cartoes_amarelos) > 0 || n(a.cartoes_vermelhos) > 0) && (
                  <div className="flex items-center justify-between py-2">
                    <span style={{ color: '#94a3b8' }} className="text-sm">Cartoes</span>
                    <div className="flex gap-3">
                      {n(a.cartoes_amarelos) > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-6 rounded-sm" style={{ background: '#facc15' }} />
                          <span className="font-semibold" style={{ color: '#ffffff' }}>{n(a.cartoes_amarelos)}</span>
                        </div>
                      )}
                      {n(a.cartoes_vermelhos) > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-6 rounded-sm" style={{ background: '#ef4444' }} />
                          <span className="font-semibold" style={{ color: '#ffffff' }}>{n(a.cartoes_vermelhos)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {s(a.org_defensiva_obs) && (
                  <div className="mt-3 p-3 rounded-xl" style={{ background: '#0f172a' }}>
                    <div className="text-xs mb-1" style={{ color: '#64748b' }}>Obs</div>
                    <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.org_defensiva_obs)}</div>
                  </div>
                )}
              </Section>
            )}

            {/* Bolas Paradas */}
            {hasBolasParadas && (
              <Section title="Bolas Paradas" color="linear-gradient(135deg, #ec4899, #db2777)">
                <StatLine label="Escanteios" value={n(a.escanteios_total)} />
                <StatLine label="Escanteios Perigosos" value={n(a.escanteios_perigosos)} />
                <StatLine label="Tipo Cobranca" value={s(a.escanteio_tipo_cobranca)} />
                <StatLine label="Penaltis a Favor" value={n(a.penaltis_favor)} />
                <StatLine label="Gols BP" value={n(a.gols_bola_parada)} />
              </Section>
            )}

            {/* Dados Avançados */}
            {hasDadosAvancados && (
              <Section title="Dados Avancados" color="linear-gradient(135deg, #6366f1, #4f46e5)">
                <StatLine label="xG a Favor" value={n(a.xg_favor) > 0 ? n(a.xg_favor).toFixed(2) : ''} />
                <StatLine label="xG Contra" value={n(a.xg_contra) > 0 ? n(a.xg_contra).toFixed(2) : ''} />
                <StatLine label="PPDA" value={n(a.ppda) > 0 ? n(a.ppda).toFixed(1) : ''} />
                <StatLine label="Campo Ofensivo" value={n(a.campo_ofensivo_pct) > 0 ? `${n(a.campo_ofensivo_pct)}%` : ''} />
              </Section>
          )}
        </div>

      </div>

      {/* Conclusões - centralizado */}
      {hasConclusoes && (
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {s(a.pontos_fortes) && (
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #22c55e20, #16a34a20)', border: '1px solid #22c55e40' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#22c55e' }}>PONTOS FORTES</div>
                <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.pontos_fortes)}</div>
              </div>
            )}
            {s(a.pontos_fracos) && (
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #ef444420, #dc262620)', border: '1px solid #ef444440' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#ef4444' }}>PONTOS A MELHORAR</div>
                <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.pontos_fracos)}</div>
              </div>
            )}
            {s(a.conclusoes) && (
              <div className="rounded-2xl p-4" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#94a3b8' }}>CONCLUSOES</div>
                <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.conclusoes)}</div>
              </div>
            )}
            {s(a.recomendacoes_treino) && (
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #3b82f620, #2563eb20)', border: '1px solid #3b82f640' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#3b82f6' }}>RECOMENDACOES DE TREINO</div>
                <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.recomendacoes_treino)}</div>
              </div>
            )}
            {s(a.jogadores_destaque) && (
              <div className="rounded-2xl p-4 lg:col-span-2" style={{ background: 'linear-gradient(135deg, #f59e0b20, #ea580c20)', border: '1px solid #f59e0b40' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#f59e0b' }}>JOGADORES DESTAQUE</div>
                <div className="text-sm" style={{ color: '#e2e8f0' }}>{s(a.jogadores_destaque)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  )
}
