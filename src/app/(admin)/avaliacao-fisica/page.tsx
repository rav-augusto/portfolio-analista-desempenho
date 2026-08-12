'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, Save, Search, Trash2, Pencil, X } from 'lucide-react'
import { estimarMaturacaoMirwald, idadeCronologicaEm } from '@/lib/stats/desenvolvimento'

type Atleta = { id: string; nome: string; posicao: string | null; data_nascimento: string | null }

type AvaliacaoFisicaRow = {
  id: string
  data_avaliacao: string
  altura_avaliacao: number | null
  peso_avaliacao: number | null
  envergadura: number | null
  velocidade_10m: number | null
  velocidade_30m: number | null
  salto_vertical: number | null
  agilidade_teste: number | null
  yoyo_nivel: string | null
  yoyo_distancia: number | null
  idade_biologica: number | null
  estagio_phv: string | null
  sentar_alcancar: number | null
  observacoes: string | null
}

const hoje = () => new Date().toISOString().slice(0, 10)

const campoInicial = {
  data_avaliacao: hoje(),
  altura_avaliacao: '',
  peso_avaliacao: '',
  altura_sentado: '', // cm — só para o cálculo de maturação (não é salvo)
  envergadura: '',
  velocidade_10m: '',
  velocidade_30m: '',
  salto_vertical: '',
  agilidade_teste: '',
  yoyo_nivel: '',
  yoyo_distancia: '',
  idade_biologica: '',
  estagio_phv: '',
  sentar_alcancar: '',
  observacoes: '',
}

const INPUT_CLS = 'w-full px-3 py-2 text-sm rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30'
const INPUT_STYLE = { backgroundColor: '#1e293b', border: '1px solid #475569' } as const

// Componente de campo no nível do módulo (fora do render) — evita perda de foco.
function Campo({ label, value, onChange, step, placeholder, dica }: {
  label: string
  value: string
  onChange: (v: string) => void
  step?: string
  placeholder?: string
  dica?: string
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-slate-400 mb-1">{label}</label>
      <input
        type={step ? 'number' : 'text'}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLS}
        style={INPUT_STYLE}
      />
      {dica && <p className="text-[9px] text-slate-500 mt-1">{dica}</p>}
    </div>
  )
}

export default function AvaliacaoFisicaPage() {
  const supabase = createClient()
  const [atletas, setAtletas] = useState<Atleta[]>([])
  const [busca, setBusca] = useState('')
  const [atletaSel, setAtletaSel] = useState('')
  const [historico, setHistorico] = useState<AvaliacaoFisicaRow[]>([])
  const [form, setForm] = useState({ ...campoInicial })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [ultimaEstimativa, setUltimaEstimativa] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('atletas').select('id, nome, posicao, data_nascimento').order('nome')
      if (data) setAtletas(data)
    }
    load()
  }, [supabase])

  const loadHistorico = useCallback(async () => {
    if (!atletaSel) {
      setHistorico([])
      return
    }
    const { data } = await supabase
      .from('avaliacoes_fisicas')
      .select('*')
      .eq('atleta_id', atletaSel)
      .order('data_avaliacao', { ascending: false })
    if (data) setHistorico(data)
  }, [atletaSel, supabase])

  useEffect(() => {
    loadHistorico()
  }, [loadHistorico])

  const set = (campo: keyof typeof campoInicial, valor: string) => setForm(f => ({ ...f, [campo]: valor }))

  const numero = (v: string) => (v.trim() === '' ? null : Number(v))
  const inteiro = (v: string) => (v.trim() === '' ? null : parseInt(v, 10))

  // Idade cronológica do atleta na data da avaliação
  const atletaObj = atletas.find(a => a.id === atletaSel)
  const idadeAnos = atletaObj ? idadeCronologicaEm(atletaObj.data_nascimento, form.data_avaliacao || hoje()) : null

  // Estimativa de maturação (Mirwald) a partir de altura + peso + altura sentado + idade
  const estimativa = useMemo(
    () =>
      estimarMaturacaoMirwald({
        alturaCm: form.altura_avaliacao ? Number(form.altura_avaliacao) * 100 : null,
        alturaSentadoCm: form.altura_sentado ? Number(form.altura_sentado) : null,
        pesoKg: form.peso_avaliacao ? Number(form.peso_avaliacao) : null,
        idadeAnos,
      }),
    [form.altura_avaliacao, form.altura_sentado, form.peso_avaliacao, idadeAnos]
  )

  // Auto-preenche estágio PHV + idade biológica quando a estimativa muda (usuário pode ajustar depois)
  useEffect(() => {
    if (!estimativa) return
    const chave = `${estimativa.estagioPHV}:${estimativa.idadeBiologica}`
    if (chave !== ultimaEstimativa) {
      setForm(f => ({ ...f, estagio_phv: estimativa.estagioPHV, idade_biologica: String(estimativa.idadeBiologica) }))
      setUltimaEstimativa(chave)
    }
  }, [estimativa, ultimaEstimativa])

  const handleSalvar = async () => {
    if (!atletaSel) {
      setMsg({ tipo: 'erro', texto: 'Selecione um atleta.' })
      return
    }
    setSaving(true)
    setMsg(null)
    const payload = {
      atleta_id: atletaSel,
      data_avaliacao: form.data_avaliacao || hoje(),
      altura_avaliacao: numero(form.altura_avaliacao),
      peso_avaliacao: numero(form.peso_avaliacao),
      envergadura: numero(form.envergadura),
      velocidade_10m: numero(form.velocidade_10m),
      velocidade_30m: numero(form.velocidade_30m),
      salto_vertical: numero(form.salto_vertical),
      agilidade_teste: numero(form.agilidade_teste),
      yoyo_nivel: form.yoyo_nivel.trim() || null,
      yoyo_distancia: inteiro(form.yoyo_distancia),
      idade_biologica: numero(form.idade_biologica),
      estagio_phv: form.estagio_phv || null,
      sentar_alcancar: numero(form.sentar_alcancar),
      observacoes: form.observacoes.trim() || null,
    }
    const { error } = editId
      ? await supabase.from('avaliacoes_fisicas').update(payload).eq('id', editId)
      : await supabase.from('avaliacoes_fisicas').insert(payload)
    setSaving(false)
    if (error) {
      setMsg({ tipo: 'erro', texto: `Erro ao salvar: ${error.message}` })
      return
    }
    setMsg({ tipo: 'ok', texto: editId ? 'Avaliação física atualizada!' : 'Avaliação física salva!' })
    setForm({ ...campoInicial })
    setEditId(null)
    setUltimaEstimativa('')
    loadHistorico()
  }

  const handleEditar = (h: AvaliacaoFisicaRow) => {
    setEditId(h.id)
    setUltimaEstimativa('bloqueado') // não sobrescreve os valores carregados
    setForm({
      data_avaliacao: h.data_avaliacao,
      altura_avaliacao: h.altura_avaliacao?.toString() ?? '',
      peso_avaliacao: h.peso_avaliacao?.toString() ?? '',
      altura_sentado: '',
      envergadura: h.envergadura?.toString() ?? '',
      velocidade_10m: h.velocidade_10m?.toString() ?? '',
      velocidade_30m: h.velocidade_30m?.toString() ?? '',
      salto_vertical: h.salto_vertical?.toString() ?? '',
      agilidade_teste: h.agilidade_teste?.toString() ?? '',
      yoyo_nivel: h.yoyo_nivel ?? '',
      yoyo_distancia: h.yoyo_distancia?.toString() ?? '',
      idade_biologica: h.idade_biologica?.toString() ?? '',
      estagio_phv: h.estagio_phv ?? '',
      sentar_alcancar: h.sentar_alcancar?.toString() ?? '',
      observacoes: h.observacoes ?? '',
    })
    setMsg(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelarEdicao = () => {
    setEditId(null)
    setForm({ ...campoInicial })
    setUltimaEstimativa('')
    setMsg(null)
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Excluir esta avaliação física?')) return
    const { error } = await supabase.from('avaliacoes_fisicas').delete().eq('id', id)
    if (!error) loadHistorico()
  }

  const atletasFiltrados = busca
    ? atletas.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()) || (a.posicao ?? '').toLowerCase().includes(busca.toLowerCase()))
    : atletas

  const imc = form.altura_avaliacao && form.peso_avaliacao
    ? (Number(form.peso_avaliacao) / Math.pow(Number(form.altura_avaliacao), 2)).toFixed(1)
    : '—'

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100">Avaliação Física</h1>
          <p className="text-sm text-slate-400">Testes físicos e maturação — separado da avaliação de jogo</p>
        </div>
      </div>

      {/* Seletor de atleta */}
      <div className="rounded-2xl p-4 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input type="text" placeholder="Buscar atleta..." value={busca} onChange={e => setBusca(e.target.value)}
              className="w-full px-4 py-2 rounded-xl focus:outline-none" style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }} />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
          <select value={atletaSel} onChange={e => setAtletaSel(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl focus:outline-none" style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}>
            <option value="">Selecione um atleta</option>
            {atletasFiltrados.map(a => (
              <option key={a.id} value={a.id}>{a.nome}{a.posicao ? ` - ${a.posicao}` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {atletaSel && (
        <>
          {/* Formulário */}
          <div className="rounded-2xl p-4 md:p-6 shadow-sm mb-6" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold text-slate-100">{editId ? 'Editar avaliação física' : 'Nova avaliação física'}</h3>
                {editId && (
                  <button onClick={handleCancelarEdicao} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg" style={{ border: '1px solid #475569' }}>
                    <X className="w-3 h-3" /> cancelar
                  </button>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Data</label>
                <input type="date" value={form.data_avaliacao} onChange={e => set('data_avaliacao', e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg text-slate-200 focus:outline-none" style={INPUT_STYLE} />
              </div>
            </div>

            <div className="space-y-4">
              {/* Antropométricos */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-blue-400 mb-3">Antropométricos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Campo label="Altura (m)" value={form.altura_avaliacao} onChange={v => set('altura_avaliacao', v)} step="0.01" placeholder="1.75" />
                  <Campo label="Peso (kg)" value={form.peso_avaliacao} onChange={v => set('peso_avaliacao', v)} step="0.1" placeholder="65.5" />
                  <Campo label="Envergadura (m)" value={form.envergadura} onChange={v => set('envergadura', v)} step="0.01" placeholder="1.80" />
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">IMC</label>
                    <div className="px-3 py-2 text-sm rounded-lg text-amber-400 font-semibold" style={INPUT_STYLE}>{imc}</div>
                  </div>
                </div>
              </div>

              {/* Velocidade */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-amber-400 mb-3">Velocidade</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="10 metros (s)" value={form.velocidade_10m} onChange={v => set('velocidade_10m', v)} step="0.01" placeholder="1.85" dica="Explosão inicial (menor = melhor)" />
                  <Campo label="30 metros (s)" value={form.velocidade_30m} onChange={v => set('velocidade_30m', v)} step="0.01" placeholder="4.25" dica="Velocidade máxima (menor = melhor)" />
                </div>
              </div>

              {/* Potência / Agilidade / Flexibilidade */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-emerald-400 mb-3">Potência, agilidade e flexibilidade</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Campo label="Salto vertical (cm)" value={form.salto_vertical} onChange={v => set('salto_vertical', v)} step="0.5" placeholder="45.5" />
                  <Campo label="Agilidade (s)" value={form.agilidade_teste} onChange={v => set('agilidade_teste', v)} step="0.01" placeholder="9.50" dica="Menor = melhor" />
                  <Campo label="Sentar e alcançar (cm)" value={form.sentar_alcancar} onChange={v => set('sentar_alcancar', v)} step="0.1" placeholder="25.0" />
                </div>
              </div>

              {/* Resistência */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
                <h4 className="text-sm font-semibold text-rose-400 mb-3">Resistência (Yo-Yo)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Nível" value={form.yoyo_nivel} onChange={v => set('yoyo_nivel', v)} placeholder="15.1" />
                  <Campo label="Distância (m)" value={form.yoyo_distancia} onChange={v => set('yoyo_distancia', v)} step="1" placeholder="1200" />
                </div>
              </div>

              {/* Maturação (calculada automaticamente - Mirwald) */}
              <div className="rounded-xl p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #06b6d455' }}>
                <h4 className="text-sm font-semibold text-cyan-400 mb-1">🧬 Maturação (calculada automaticamente)</h4>
                <p className="text-[10px] text-slate-500 mb-3">Preencha <b>altura</b>, <b>peso</b> e <b>altura sentado</b> — o sistema estima o estágio PHV e a idade biológica pela equação de Mirwald (meninos). Você pode ajustar depois.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  <Campo label="Altura sentado (cm)" value={form.altura_sentado} onChange={v => set('altura_sentado', v)} step="0.1" placeholder="90" dica="Sentado, tronco ereto" />
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Idade na avaliação</label>
                    <div className="px-3 py-2 text-sm rounded-lg text-slate-300" style={INPUT_STYLE}>{idadeAnos != null ? `${idadeAnos} anos` : '—'}</div>
                  </div>
                </div>
                {idadeAnos == null && form.altura_sentado && (
                  <p className="text-[10px] text-amber-400 mb-3">O atleta não tem data de nascimento cadastrada — sem a idade não dá pra calcular. Cadastre em Atletas.</p>
                )}
                {estimativa && (
                  <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: '#0e2a33', border: '1px solid #06b6d4' }}>
                    <p className="text-xs text-cyan-300 font-semibold mb-1">✓ Estimativa automática (Mirwald)</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Idade biológica ≈ <b className="text-cyan-300">{estimativa.idadeBiologica} anos</b> · Estágio <b className="text-cyan-300">{estimativa.estagioPHV === 'pre' ? 'pré-PHV (antes do estirão)' : estimativa.estagioPHV === 'durante' ? 'durante o estirão' : 'pós-PHV (depois do estirão)'}</b> · {estimativa.maturityOffset >= 0 ? `+${estimativa.maturityOffset}` : estimativa.maturityOffset} anos do pico (APHV ≈ {estimativa.aphv})
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Já preenchido nos campos abaixo — ajuste se tiver medição oficial do clube.</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Idade biológica (anos)" value={form.idade_biologica} onChange={v => set('idade_biologica', v)} step="0.1" placeholder="14.5" />
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Estágio PHV</label>
                    <select value={form.estagio_phv} onChange={e => set('estagio_phv', e.target.value)} className={INPUT_CLS} style={INPUT_STYLE}>
                      <option value="">Não informado</option>
                      <option value="pre">Antes do estirão (pré-PHV)</option>
                      <option value="durante">Em pleno estirão (durante)</option>
                      <option value="pos">Depois do estirão (pós-PHV)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-1">Observações</label>
                <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} rows={2}
                  className={INPUT_CLS} style={INPUT_STYLE} placeholder="Notas do teste físico..." />
              </div>
            </div>

            {msg && (
              <p className={`text-sm mt-3 ${msg.tipo === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{msg.texto}</p>
            )}

            <button onClick={handleSalvar} disabled={saving}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff' }}>
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : editId ? 'Atualizar avaliação' : 'Salvar avaliação física'}
            </button>
          </div>

          {/* Histórico */}
          <div className="rounded-2xl p-4 md:p-6 shadow-sm" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <h3 className="text-base md:text-lg font-semibold text-slate-100 mb-3">Histórico de avaliações físicas</h3>
            {historico.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma avaliação física registrada ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase text-slate-500 border-b border-slate-700">
                      <th className="py-2 pr-3">Data</th>
                      <th className="py-2 pr-3">Alt/Peso</th>
                      <th className="py-2 pr-3">Vel 30m</th>
                      <th className="py-2 pr-3">Salto</th>
                      <th className="py-2 pr-3">Yo-Yo</th>
                      <th className="py-2 pr-3">Id. biológica</th>
                      <th className="py-2 pr-3">PHV</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {historico.map(h => (
                      <tr key={h.id} className="border-b border-slate-800">
                        <td className="py-2 pr-3">{new Date(h.data_avaliacao + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                        <td className="py-2 pr-3">{h.altura_avaliacao ?? '—'}m / {h.peso_avaliacao ?? '—'}kg</td>
                        <td className="py-2 pr-3">{h.velocidade_30m ?? '—'}s</td>
                        <td className="py-2 pr-3">{h.salto_vertical ?? '—'}cm</td>
                        <td className="py-2 pr-3">{h.yoyo_distancia ?? '—'}m</td>
                        <td className="py-2 pr-3">{h.idade_biologica ?? '—'}</td>
                        <td className="py-2 pr-3">{h.estagio_phv ?? '—'}</td>
                        <td className="py-2 text-right whitespace-nowrap">
                          <button onClick={() => handleEditar(h)} className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleExcluir(h.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
