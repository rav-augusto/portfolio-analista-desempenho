// Boletim do PAI — uma pagina, linguagem simples, sem jargao ("IDA", "percentil"
// nao aparecem aqui). Mesmo padrao do dossie.ts (HTML string + window.print()).

import type { DimKey } from './benchmark'
import {
  classificarRitmo,
  serieAtletaVsCurva,
  calcularProximoObjetivo,
  idadeDecimalEm,
  type PontoAvaliacao,
  type RitmoDimensao,
  type RitmoStatus,
} from './curva'

export type AtletaBoletim = {
  nome: string
  posicao: string | null
  clube: string
  dataNascimento: string | null
  fotoUrl: string | null
}

export type BoletimParams = {
  atleta: AtletaBoletim
  pontos: PontoAvaliacao[] // avaliacoes ordenadas por data (mais antiga primeiro)
  dataAvaliacao: string | null // ultima avaliacao (usado no cabecalho)
  // Dimensoes a mostrar no boletim (definidas por quem gera — pai nao precisa
  // ver as 20 do analista, mas o filtro fica com quem chama pra nao inventar).
  dimensoesMostrar: { key: DimKey; label: string }[]
}

const esc = (s: string | null | undefined): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const fmt = (n: number, casas = 1) => n.toFixed(casas)

const STATUS_LABEL: Record<RitmoStatus, string> = {
  acima: 'Acima do esperado',
  acompanhando: 'Acompanhando a idade',
  abaixo_fechando: 'Fechando a diferença',
  atencao: 'Merece atenção',
  sem_dados: 'Sem referência ainda',
}

const STATUS_COR: Record<RitmoStatus, string> = {
  acima: '#16a34a',
  acompanhando: '#0891b2',
  abaixo_fechando: '#d97706',
  atencao: '#dc2626',
  sem_dados: '#64748b',
}

// Grafico simples SVG "atleta vs curva" para UMA dimensao (linha do tempo).
function graficoCurvaSVG(
  titulo: string,
  serie: { labels: string[]; atleta: (number | null)[]; esperado: (number | null)[] }
): string {
  const W = 460, H = 180
  const padL = 34, padR = 12, padT = 20, padB = 30
  const inner = { w: W - padL - padR, h: H - padT - padB }
  const n = serie.labels.length
  if (n === 0) return ''

  const x = (i: number) => padL + (n === 1 ? inner.w / 2 : (i * inner.w) / (n - 1))
  const y = (v: number) => padT + inner.h - (Math.min(5, Math.max(0, v)) / 5) * inner.h

  let grid = ''
  for (let i = 0; i <= 5; i++) {
    const yy = padT + (inner.h * (5 - i)) / 5
    grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="#e2e8f0" stroke-width="1"/>`
    grid += `<text x="${padL - 6}" y="${yy + 3}" font-size="9" fill="#94a3b8" text-anchor="end">${i}</text>`
  }

  const pathFrom = (arr: (number | null)[], cor: string, tracejado = false) => {
    let d = ''
    let dots = ''
    let last = false
    arr.forEach((v, i) => {
      if (v == null) { last = false; return }
      const xi = x(i), yi = y(v)
      d += `${last ? 'L' : 'M'}${xi.toFixed(1)},${yi.toFixed(1)}`
      dots += `<circle cx="${xi.toFixed(1)}" cy="${yi.toFixed(1)}" r="3" fill="${cor}"/>`
      last = true
    })
    const dashAttr = tracejado ? ' stroke-dasharray="4,4"' : ''
    return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="2"${dashAttr}/>${dots}`
  }

  // Decimacao: com muitas avaliacoes, mostrar so alguns rotulos pra nao sobrepor.
  // Alvo ~6 rotulos por grafico. Primeiro e ultimo sempre marcados.
  const maxLabels = 6
  const passo = n <= maxLabels ? 1 : Math.ceil((n - 1) / (maxLabels - 1))
  const mostrar = (i: number) => i === 0 || i === n - 1 || i % passo === 0
  const labels = serie.labels
    .map((l, i) => mostrar(i)
      ? `<text x="${x(i).toFixed(1)}" y="${H - 12}" font-size="9" fill="#64748b" text-anchor="middle">${esc(l)}</text>`
      : '')
    .join('')

  return `
    <div class="grafico">
      <div class="grafico-titulo">${esc(titulo)}</div>
      <svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">
        ${grid}
        ${pathFrom(serie.esperado, '#94a3b8', true)}
        ${pathFrom(serie.atleta, '#d97706', false)}
        ${labels}
      </svg>
      <div class="grafico-legenda">
        <span><i style="background:#d97706"></i>Seu filho</span>
        <span><i style="background:#94a3b8;border-radius:0;height:2px"></i>Esperado para a idade</span>
      </div>
    </div>
  `
}

export function gerarBoletimHTML(p: BoletimParams): string {
  const dataNasc = p.atleta.dataNascimento
  const idade = dataNasc ? idadeDecimalEm(dataNasc, p.dataAvaliacao ?? undefined) : null
  const dataFmt = p.dataAvaliacao
    ? new Date(p.dataAvaliacao + 'T12:00:00').toLocaleDateString('pt-BR')
    : ''

  const foto = p.atleta.fotoUrl
    ? `<img src="${esc(p.atleta.fotoUrl)}" alt="foto" class="foto"/>`
    : `<div class="foto foto-vazia">${esc(p.atleta.nome.charAt(0).toUpperCase())}</div>`

  const infoLinha = [
    p.atleta.posicao,
    p.atleta.clube,
    idade != null ? `${idade} anos` : null,
  ]
    .filter(Boolean)
    .map(v => esc(String(v)))
    .join(' &nbsp;•&nbsp; ')

  // Ritmo por dimensao. So mostra as que tem dados.
  const ritmos: RitmoDimensao[] = dataNasc
    ? p.dimensoesMostrar
        .map(d => classificarRitmo(d.key, p.pontos, dataNasc, p.atleta.posicao))
        .filter((r): r is RitmoDimensao => r != null)
    : []

  // Selecoes para o resumo do pai:
  // - 3 melhoras: dimensoes com status 'acima' primeiro, depois 'abaixo_fechando' (evoluindo)
  // - 2 focos: dimensoes com status 'atencao' primeiro, depois maiores 'abaixo_fechando'
  const pesoStatus = (s: RitmoStatus): number => {
    switch (s) {
      case 'acima': return 4
      case 'abaixo_fechando': return 3
      case 'acompanhando': return 2
      case 'atencao': return 1
      case 'sem_dados': return 0
    }
  }
  const melhoras = [...ritmos]
    .filter(r => r.status === 'acima' || r.status === 'abaixo_fechando')
    .sort((a, b) => pesoStatus(b.status) - pesoStatus(a.status))
    .slice(0, 3)
  const focos = [...ritmos]
    .filter(r => r.status === 'atencao' || (r.status === 'abaixo_fechando' && r.diferencaAtual < -0.5))
    .sort((a, b) => a.diferencaAtual - b.diferencaAtual)
    .slice(0, 2)

  // Grafico principal: usa a dimensao onde ele mais melhorou (ou a primeira com dados).
  const primeira = ritmos[0]
  const graficoPrincipal = primeira && dataNasc
    ? graficoCurvaSVG(
        primeira.label,
        serieAtletaVsCurva(primeira.key, p.pontos, dataNasc, p.atleta.posicao)
      )
    : ''

  // Grafico "media geral": constroi serie das dimensoes mostradas.
  const serieMedia = (() => {
    if (!dataNasc || ritmos.length === 0) return null
    const ord = [...p.pontos].sort((a, b) => a.data_avaliacao.localeCompare(b.data_avaliacao))
    const labels: string[] = []
    const atleta: (number | null)[] = []
    const esperado: (number | null)[] = []
    for (const pt of ord) {
      const d = new Date(pt.data_avaliacao + 'T12:00:00')
      labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
      // Media so das dimensoes mostradas que tem valor.
      const vs: number[] = []
      for (const dim of p.dimensoesMostrar) {
        const v = pt.valores[dim.key]
        if (typeof v === 'number') vs.push(v)
      }
      atleta.push(vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null)
      // Esperado medio: media dos esperados de todas as dimensoes mostradas na idade daquele ponto.
      const idadePt = idadeDecimalEm(dataNasc, pt.data_avaliacao)
      if (idadePt == null) { esperado.push(null); continue }
      // usa a curva por dimensao — vem via classificarRitmo/serieAtletaVsCurva, mas
      // aqui recalculamos rapidinho pela lista de series.
      const eperDim = p.dimensoesMostrar
        .map(dim => serieAtletaVsCurva(dim.key, [pt], dataNasc, p.atleta.posicao).esperado[0])
        .filter((v): v is number => typeof v === 'number')
      esperado.push(eperDim.length ? eperDim.reduce((a, b) => a + b, 0) / eperDim.length : null)
    }
    return { labels, atleta, esperado }
  })()

  const graficoMedia = serieMedia
    ? graficoCurvaSVG('Evolução geral (média das notas)', serieMedia)
    : ''

  // Proximo objetivo: pega os valores da ultima avaliacao.
  const ultima = [...p.pontos].sort((a, b) => a.data_avaliacao.localeCompare(b.data_avaliacao)).slice(-1)[0]
  const valoresUltimos = ultima?.valores ?? {}
  const objetivo = dataNasc
    ? calcularProximoObjetivo(p.atleta.posicao, dataNasc, valoresUltimos, 3)
    : null

  // Blocos de HTML
  const blocoStatus = ritmos.length > 0
    ? `
      <section>
        <h2>Como está a evolução</h2>
        <div class="ritmos">
          ${ritmos
            .map(r => `
              <div class="ritmo">
                <div class="ritmo-nome">${esc(r.label)}</div>
                <div class="ritmo-badge" style="background:${STATUS_COR[r.status]}22;color:${STATUS_COR[r.status]};border:1px solid ${STATUS_COR[r.status]}55">
                  ${STATUS_LABEL[r.status]}
                </div>
                <div class="ritmo-desc">${esc(r.descricao)}</div>
              </div>
            `)
            .join('')}
        </div>
      </section>
    `
    : ''

  const blocoMelhoras = melhoras.length > 0
    ? `
      <section>
        <h2>Onde melhorou</h2>
        <ul class="lista">
          ${melhoras
            .map(r => `<li><b>${esc(r.label)}</b> — ${esc(r.descricao)}</li>`)
            .join('')}
        </ul>
      </section>
    `
    : ''

  const blocoFocos = focos.length > 0
    ? `
      <section>
        <h2>Onde vamos trabalhar</h2>
        <ul class="lista">
          ${focos
            .map(r => `<li><b>${esc(r.label)}</b> — ${esc(r.descricao)}</li>`)
            .join('')}
        </ul>
      </section>
    `
    : ''

  const blocoObjetivo = objetivo && objetivo.distanciasPositivas.length > 0
    ? `
      <section>
        <h2>Próximo objetivo (próximos 3 meses)</h2>
        <p class="obj-desc">Meta até <b>${new Date(objetivo.dataAlvo + 'T12:00:00').toLocaleDateString('pt-BR')}</b> — o que a curva espera nessa idade:</p>
        <ul class="lista">
          ${objetivo.distanciasPositivas
            .map(d => `<li><b>${esc(d.label)}</b> — evoluir cerca de <b>+${fmt(d.delta, 1)}</b> na nota</li>`)
            .join('')}
        </ul>
      </section>
    `
    : ''

  const blocoSemCurva = ritmos.length > 0 && ritmos.every(r => r.status === 'sem_dados')
    ? `<p class="aviso">Ainda não temos uma curva de referência para essa idade. O boletim vai mostrar só a evolução do próprio atleta ao longo das avaliações.</p>`
    : ''

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Boletim de Evolução — ${esc(p.atleta.nome)}</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; background: #fff; line-height: 1.5; }
  .capa { display: flex; gap: 16px; align-items: center; border-bottom: 3px solid #d97706; padding-bottom: 16px; margin-bottom: 20px; }
  .foto { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid #d97706; }
  .foto-vazia { display: flex; align-items: center; justify-content: center; background: #f59e0b; color: #fff; font-size: 32px; font-weight: 700; }
  .capa h1 { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; }
  .capa .info { font-size: 13px; color: #475569; margin-top: 2px; }
  .capa .data { font-size: 12px; color: #64748b; margin-top: 6px; }
  .marca { margin-left: auto; text-align: right; }
  .marca .titulo { font-size: 12px; font-weight: 700; color: #d97706; letter-spacing: 1px; text-transform: uppercase; }
  .marca .sub { font-size: 11px; color: #64748b; }
  section { margin-bottom: 22px; page-break-inside: avoid; }
  h2 { font-size: 15px; margin: 0 0 10px; color: #0f172a; border-left: 4px solid #d97706; padding-left: 8px; }
  .ritmos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .ritmo { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; background: #f8fafc; }
  .ritmo-nome { font-size: 13px; font-weight: 700; color: #0f172a; }
  .ritmo-badge { display: inline-block; margin: 4px 0 6px; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
  .ritmo-desc { font-size: 12px; color: #475569; }
  .lista { margin: 0; padding-left: 18px; font-size: 13px; color: #334155; }
  .lista li { margin-bottom: 4px; }
  .grafico { border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; background: #fff; margin-bottom: 12px; }
  .grafico-titulo { font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .grafico-legenda { display: flex; gap: 16px; font-size: 11px; color: #64748b; margin-top: 4px; }
  .grafico-legenda i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
  .obj-desc { font-size: 12px; color: #475569; margin: 0 0 6px; }
  .aviso { font-size: 12px; color: #64748b; background: #f1f5f9; border-left: 3px solid #94a3b8; padding: 8px 10px; border-radius: 6px; }
  .rodape { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 12px; } .rodape { color: #64748b; } }
</style>
</head>
<body>
  <div class="capa">
    ${foto}
    <div>
      <h1>${esc(p.atleta.nome)}</h1>
      <div class="info">${infoLinha}</div>
      ${dataFmt ? `<div class="data">Boletim de ${esc(dataFmt)}</div>` : ''}
    </div>
    <div class="marca">
      <div class="titulo">Olhar da Base</div>
      <div class="sub">Boletim de Evolução</div>
    </div>
  </div>

  ${blocoSemCurva}
  ${graficoMedia}
  ${graficoPrincipal}
  ${blocoStatus}
  ${blocoMelhoras}
  ${blocoFocos}
  ${blocoObjetivo}

  <div class="rodape">
    Boletim gerado com base em ${p.pontos.length} avaliação${p.pontos.length !== 1 ? 'ões' : ''} —
    referência de nível esperado baseada em CBF Academy, com metodologia de análise de desempenho.
  </div>
</body>
</html>
  `.trim()
}

// Abre o boletim numa nova aba pronto para imprimir (mesmo padrao do dossie).
export function abrirBoletimParaImpressao(p: BoletimParams): boolean {
  const html = gerarBoletimHTML(p)
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.write(html)
  win.document.close()
  setTimeout(() => { try { win.focus(); win.print() } catch { /* bloqueado */ } }, 400)
  return true
}

// ============================================================================
// BOLETIM RAPIDO (modulo Escolinha) — le tabela `avaliacoes_rapidas` (JSONB).
// Sem curva CBF (as dimensoes das faixas menores nao tem benchmark de idade).
// Mostra: evolucao propria por dimensao, melhoras, focos, nota atual.
// ============================================================================

// Uma avaliacao rapida ordenada por data (mais antiga primeiro).
// `faixa` e a faixa registrada quando a avaliacao foi feita — importante quando
// o atleta muda de faixa (ex: 10->11 anos), pra nao misturar dimensoes de faixas
// diferentes num boletim so.
export type PontoAvaliacaoRapida = {
  data_avaliacao: string
  faixa?: string
  notas: Record<string, number>
}

export type BoletimRapidoParams = {
  atleta: AtletaBoletim
  pontos: PontoAvaliacaoRapida[]
  dataAvaliacao: string | null
  faixa: {
    key: string
    label: string
    idadeMin: number
    idadeMax: number
    cor: string
    descricao: string
    dimensoes: { key: string; label: string; descricao: string }[]
  }
  idadeAtleta: number | null // anos inteiros
}

// Grafico simples de linha do tempo — SO a linha do atleta (sem curva esperada).
function graficoSemCurvaSVG(
  titulo: string,
  labels: string[],
  valores: (number | null)[]
): string {
  const W = 460, H = 160
  const padL = 34, padR = 12, padT = 20, padB = 30
  const inner = { w: W - padL - padR, h: H - padT - padB }
  const n = labels.length
  if (n === 0) return ''

  const x = (i: number) => padL + (n === 1 ? inner.w / 2 : (i * inner.w) / (n - 1))
  const y = (v: number) => padT + inner.h - (Math.min(5, Math.max(0, v)) / 5) * inner.h

  let grid = ''
  for (let i = 0; i <= 5; i++) {
    const yy = padT + (inner.h * (5 - i)) / 5
    grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="#e2e8f0" stroke-width="1"/>`
    grid += `<text x="${padL - 6}" y="${yy + 3}" font-size="9" fill="#94a3b8" text-anchor="end">${i}</text>`
  }

  let d = ''
  let dots = ''
  let last = false
  valores.forEach((v, i) => {
    if (v == null) { last = false; return }
    const xi = x(i), yi = y(v)
    d += `${last ? 'L' : 'M'}${xi.toFixed(1)},${yi.toFixed(1)}`
    dots += `<circle cx="${xi.toFixed(1)}" cy="${yi.toFixed(1)}" r="3" fill="#d97706"/>`
    last = true
  })
  const linha = `<path d="${d}" fill="none" stroke="#d97706" stroke-width="2"/>${dots}`

  // Decimacao dos rotulos: max 6 (primeiro, ultimo, distribuidos).
  const maxLabels = 6
  const passo = n <= maxLabels ? 1 : Math.ceil((n - 1) / (maxLabels - 1))
  const mostrar = (i: number) => i === 0 || i === n - 1 || i % passo === 0
  const rotulos = labels
    .map((l, i) => mostrar(i)
      ? `<text x="${x(i).toFixed(1)}" y="${H - 12}" font-size="9" fill="#64748b" text-anchor="middle">${esc(l)}</text>`
      : '')
    .join('')

  return `
    <div class="grafico">
      <div class="grafico-titulo">${esc(titulo)}</div>
      <svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">
        ${grid}${linha}${rotulos}
      </svg>
    </div>
  `
}

export function gerarBoletimRapidoHTML(p: BoletimRapidoParams): string {
  const dataFmt = p.dataAvaliacao
    ? new Date(p.dataAvaliacao + 'T12:00:00').toLocaleDateString('pt-BR')
    : ''

  const foto = p.atleta.fotoUrl
    ? `<img src="${esc(p.atleta.fotoUrl)}" alt="foto" class="foto"/>`
    : `<div class="foto foto-vazia">${esc(p.atleta.nome.charAt(0).toUpperCase())}</div>`

  const infoLinha = [
    p.atleta.posicao,
    p.atleta.clube,
    p.idadeAtleta != null ? `${p.idadeAtleta} anos` : null,
  ]
    .filter(Boolean)
    .map(v => esc(String(v)))
    .join(' &nbsp;•&nbsp; ')

  // Filtra pontos por faixa REGISTRADA (fix bug #2 revisor): se atleta mudou de
  // faixa entre avaliacoes (ex: 10->11 anos), as antigas usam dimensoes diferentes
  // e nao devem ser cruzadas com as da faixa atual. Sem o filtro, o boletim mostra
  // "sem historico" no exato momento em que a crianca muda de faixa.
  // Pontos sem `faixa` gravada (ex: dados legado) sao considerados compativeis.
  const pontosFaixa = p.pontos.filter(pt => !pt.faixa || pt.faixa === p.faixa.key)
  const descartados = p.pontos.length - pontosFaixa.length
  const ord = [...pontosFaixa].sort((a, b) => a.data_avaliacao.localeCompare(b.data_avaliacao))
  const labels = ord.map(pt => {
    const d = new Date(pt.data_avaliacao + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  })

  // Grafico da media geral por dimensoes preenchidas em cada ponto.
  const serieMediaGeral = ord.map(pt => {
    const vs = p.faixa.dimensoes
      .map(d => pt.notas[d.key])
      .filter((v): v is number => typeof v === 'number')
    return vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null
  })
  const graficoGeral = graficoSemCurvaSVG('Evolução geral (média das notas)', labels, serieMediaGeral)

  // Grafico e resumo por dimensao.
  type ResumoDim = { key: string; label: string; primeiro: number; ultimo: number; delta: number }
  const resumos: ResumoDim[] = []
  const graficosDim: string[] = []
  for (const dim of p.faixa.dimensoes) {
    const vs = ord.map(pt => (typeof pt.notas[dim.key] === 'number' ? pt.notas[dim.key] : null))
    const preenchidos = vs.filter((v): v is number => v != null)
    if (preenchidos.length === 0) continue
    const primeiro = preenchidos[0]
    const ultimo = preenchidos[preenchidos.length - 1]
    resumos.push({ key: dim.key, label: dim.label, primeiro, ultimo, delta: ultimo - primeiro })
    // So gera grafico se tem 2+ pontos preenchidos (grafico de 1 ponto e' inutil).
    if (preenchidos.length >= 2) {
      graficosDim.push(graficoSemCurvaSVG(dim.label, labels, vs))
    }
  }

  const melhoras = [...resumos]
    .filter(r => r.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3)
  const focos = [...resumos]
    .filter(r => r.ultimo <= 2)
    .sort((a, b) => a.ultimo - b.ultimo)
    .slice(0, 2)

  const blocoMelhoras = melhoras.length > 0
    ? `<section>
        <h2>Onde melhorou</h2>
        <ul class="lista">
          ${melhoras.map(r => `<li><b>${esc(r.label)}</b> — subiu de ${r.primeiro} para ${r.ultimo}</li>`).join('')}
        </ul>
      </section>`
    : ''

  const blocoFocos = focos.length > 0
    ? `<section>
        <h2>Onde vamos trabalhar</h2>
        <ul class="lista">
          ${focos.map(r => `<li><b>${esc(r.label)}</b> — nota atual ${r.ultimo}, ainda precisa evoluir</li>`).join('')}
        </ul>
      </section>`
    : ''

  const blocoNotas = resumos.length > 0
    ? `<section>
        <h2>Notas atuais (0 a 5)</h2>
        <div class="ritmos">
          ${resumos.map(r => `
            <div class="ritmo">
              <div class="ritmo-nome">${esc(r.label)}</div>
              <div class="ritmo-badge" style="background:${p.faixa.cor}22;color:${p.faixa.cor};border:1px solid ${p.faixa.cor}55">
                Nota ${r.ultimo}
              </div>
              ${r.delta !== 0 ? `<div class="ritmo-desc">${r.delta > 0 ? 'Subiu' : 'Caiu'} ${Math.abs(r.delta)} desde a primeira avaliação.</div>` : '<div class="ritmo-desc">Estável desde a primeira avaliação.</div>'}
            </div>
          `).join('')}
        </div>
      </section>`
    : ''

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Boletim de Evolução — ${esc(p.atleta.nome)}</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; background: #fff; line-height: 1.5; }
  .capa { display: flex; gap: 16px; align-items: center; border-bottom: 3px solid ${p.faixa.cor}; padding-bottom: 16px; margin-bottom: 20px; }
  .foto { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid ${p.faixa.cor}; }
  .foto-vazia { display: flex; align-items: center; justify-content: center; background: ${p.faixa.cor}; color: #fff; font-size: 32px; font-weight: 700; }
  .capa h1 { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; }
  .capa .info { font-size: 13px; color: #475569; margin-top: 2px; }
  .capa .data { font-size: 12px; color: #64748b; margin-top: 6px; }
  .marca { margin-left: auto; text-align: right; }
  .marca .titulo { font-size: 12px; font-weight: 700; color: ${p.faixa.cor}; letter-spacing: 1px; text-transform: uppercase; }
  .marca .sub { font-size: 11px; color: #64748b; }
  .faixa-info { background: ${p.faixa.cor}12; border: 1px solid ${p.faixa.cor}55; border-radius: 10px; padding: 10px 14px; margin-bottom: 18px; }
  .faixa-info .lbl { font-size: 11px; font-weight: 700; color: ${p.faixa.cor}; letter-spacing: 1px; text-transform: uppercase; }
  .faixa-info .desc { font-size: 12px; color: #475569; margin-top: 2px; }
  section { margin-bottom: 22px; page-break-inside: avoid; }
  h2 { font-size: 15px; margin: 0 0 10px; color: #0f172a; border-left: 4px solid ${p.faixa.cor}; padding-left: 8px; }
  .ritmos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .ritmo { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; background: #f8fafc; }
  .ritmo-nome { font-size: 13px; font-weight: 700; color: #0f172a; }
  .ritmo-badge { display: inline-block; margin: 4px 0 6px; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
  .ritmo-desc { font-size: 12px; color: #475569; }
  .lista { margin: 0; padding-left: 18px; font-size: 13px; color: #334155; }
  .lista li { margin-bottom: 4px; }
  .grafico { border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; background: #fff; margin-bottom: 12px; }
  .grafico-titulo { font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .rodape { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 12px; } .rodape { color: #64748b; } }
</style>
</head>
<body>
  <div class="capa">
    ${foto}
    <div>
      <h1>${esc(p.atleta.nome)}</h1>
      <div class="info">${infoLinha}</div>
      ${dataFmt ? `<div class="data">Boletim de ${esc(dataFmt)}</div>` : ''}
    </div>
    <div class="marca">
      <div class="titulo">Olhar da Base</div>
      <div class="sub">Boletim de Evolução</div>
    </div>
  </div>

  <div class="faixa-info">
    <div class="lbl">Faixa ${esc(p.faixa.label)} (${p.faixa.idadeMin}${p.faixa.idadeMax === 999 ? '+ anos' : `–${p.faixa.idadeMax} anos`})</div>
    <div class="desc">${esc(p.faixa.descricao)}</div>
  </div>

  ${graficoGeral}
  ${blocoNotas}
  ${blocoMelhoras}
  ${blocoFocos}
  ${graficosDim.join('')}

  <div class="rodape">
    Boletim gerado com base em ${pontosFaixa.length} avaliação${pontosFaixa.length !== 1 ? 'ões' : ''} na faixa ${esc(p.faixa.label)}.
    ${descartados > 0 ? `Outra${descartados !== 1 ? 's' : ''} ${descartados} avaliação${descartados !== 1 ? 'ões' : ''} de faixa anterior não ${descartados !== 1 ? 'aparecem' : 'aparece'} aqui — cada faixa mede coisas diferentes.` : ''}
  </div>
</body>
</html>
  `.trim()
}

export function abrirBoletimRapidoParaImpressao(p: BoletimRapidoParams): boolean {
  const html = gerarBoletimRapidoHTML(p)
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.write(html)
  win.document.close()
  setTimeout(() => { try { win.focus(); win.print() } catch { /* bloqueado */ } }, 400)
  return true
}
