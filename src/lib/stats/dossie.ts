// Gera um dossiê imprimível (PDF via "Salvar como PDF" do navegador) do atleta.
// Abre uma nova janela com layout claro e chama window.print(). Sem dependências externas.

import { explicarMedias, explicarInsights, type EstatisticasJogo, type ComparativoPosicao } from './desempenho'
import type { PerfilMaturacao, ResumoMetrica } from './desenvolvimento'
import { classificarIndice, type Indice } from './indices'
import type { MetricaEficiencia, ContextoProducao } from './eventos'
import { classificarPercentil, corPercentil, type MetricaPercentil } from './percentis'

export type DossieAtleta = {
  nome: string
  posicao: string | null
  clube: string
  idade: number | null
  altura: number | null
  peso: number | null
  fotoUrl: string | null
}

export type DossieMediasGrupo = {
  geral: number
  cbf: number
  ofe: number
  def: number
} | null

export type DossieParams = {
  atleta: DossieAtleta
  stats: EstatisticasJogo
  medias: DossieMediasGrupo
  comparativo: ComparativoPosicao | null
  ida?: Indice | null
  idp?: Indice | null
  maturacao?: PerfilMaturacao | null
  fisico?: ResumoMetrica[]
  eficiencia?: MetricaEficiencia[]
  contexto?: ContextoProducao | null
  parecer?: string | null
  radar?: { label: string; valor: number }[]
  dimensoes?: { grupo: 'CBF' | 'OFE' | 'DEF'; label: string; valor: number }[]
  percentis?: MetricaPercentil[]
  imc?: number | null
  pontosFortes: string | null
  pontosDesenvolver: string | null
  observacoes: string | null
  dataAvaliacao: string | null
}

const esc = (s: string | null | undefined): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const fmt = (n: number, casas = 2) => n.toFixed(casas)

// Converte o parecer (markdown simples: ## título, - item, **negrito**) em HTML.
const inlineMd = (t: string) => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
function parecerHTML(md: string): string {
  const lines = md.split('\n')
  let html = ''
  let inList = false
  const closeList = () => { if (inList) { html += '</ul>'; inList = false } }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { closeList(); continue }
    if (line.startsWith('## ')) { closeList(); html += `<h3>${inlineMd(line.slice(3))}</h3>`; continue }
    if (line.startsWith('- ')) { if (!inList) { html += '<ul>'; inList = true } html += `<li>${inlineMd(line.slice(2))}</li>`; continue }
    closeList(); html += `<p>${inlineMd(line)}</p>`
  }
  closeList()
  return html
}

// Radar imprimível (SVG puro, tema claro) — escala 0–5.
function radarSVG(pts: { label: string; valor: number }[]): string {
  const n = pts.length
  if (!n) return ''
  const cx = 160, cy = 150, R = 100, max = 5
  const ang = (i: number) => (-90 + i * (360 / n)) * Math.PI / 180
  const pt = (i: number, r: number): [number, number] => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))]
  const poly = (r: number) => pts.map((_, i) => pt(i, r).map(v => v.toFixed(1)).join(',')).join(' ')
  let rings = ''
  for (let lvl = 1; lvl <= max; lvl++) rings += `<polygon points="${poly(R * lvl / max)}" fill="none" stroke="#e2e8f0" stroke-width="1" />`
  let axes = '', labels = ''
  pts.forEach((p, i) => {
    const [x, y] = pt(i, R)
    axes += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`
    const [lx, ly] = pt(i, R + 15)
    const anchor = Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'
    labels += `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" font-size="9" font-weight="600" fill="#64748b" text-anchor="${anchor}">${esc(p.label)}</text>`
  })
  const dataPoly = pts.map((p, i) => pt(i, R * Math.min(max, Math.max(0, p.valor)) / max).map(v => v.toFixed(1)).join(',')).join(' ')
  let dots = ''
  pts.forEach((p, i) => { const [x, y] = pt(i, R * Math.min(max, Math.max(0, p.valor)) / max); dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="#d97706"/>` })
  return `<svg viewBox="0 0 320 300" width="300" xmlns="http://www.w3.org/2000/svg">${rings}${axes}<polygon points="${dataPoly}" fill="rgba(245,158,11,0.25)" stroke="#d97706" stroke-width="2"/>${dots}${labels}</svg>`
}

const statCard = (valor: string, rotulo: string, cor: string) => `
  <div class="stat">
    <div class="stat-valor" style="color:${cor}">${valor}</div>
    <div class="stat-rotulo">${esc(rotulo)}</div>
  </div>`

export function gerarDossieHTML(p: DossieParams): string {
  const { atleta, stats, medias, comparativo } = p
  const dataFmt = p.dataAvaliacao
    ? new Date(p.dataAvaliacao + 'T12:00:00').toLocaleDateString('pt-BR')
    : ''

  const infoLinha = [
    atleta.posicao,
    atleta.clube,
    atleta.idade != null ? `${atleta.idade} anos` : null,
    atleta.altura ? `${atleta.altura} cm` : null,
    atleta.peso ? `${atleta.peso} kg` : null,
  ]
    .filter(Boolean)
    .map(v => esc(String(v)))
    .join(' &nbsp;•&nbsp; ')

  const foto = atleta.fotoUrl
    ? `<img src="${esc(atleta.fotoUrl)}" alt="foto" class="foto" />`
    : `<div class="foto foto-vazia">${esc(atleta.nome.charAt(0).toUpperCase())}</div>`

  const blocoMedias = medias
    ? `
    <section>
      <h2>Médias de Avaliação (0–5)</h2>
      <div class="grid-4">
        ${statCard(fmt(medias.geral, 1), 'Geral', '#7c3aed')}
        ${statCard(fmt(medias.cbf, 1), 'CBF', '#d97706')}
        ${statCard(fmt(medias.ofe, 1), 'Ofensivo', '#16a34a')}
        ${statCard(fmt(medias.def, 1), 'Defensivo', '#dc2626')}
      </div>
    </section>`
    : ''

  const blocoComparativo = comparativo
    ? `
    <section>
      <h2>Comparativo com a posição — ${esc(comparativo.posicao)} <span class="sub">(${comparativo.atletasNaPosicao} atletas)</span></h2>
      <table>
        <thead><tr><th>Métrica</th><th>Atleta</th><th>Média posição</th><th>Diferença</th></tr></thead>
        <tbody>
          ${comparativo.metricas
            .map(
              m => `<tr>
                <td>${esc(m.label)}</td>
                <td class="num">${fmt(m.atleta)}</td>
                <td class="num">${fmt(m.media)}</td>
                <td class="num ${m.percentVsMedia >= 0 ? 'pos' : 'neg'}">${m.percentVsMedia >= 0 ? '+' : ''}${fmt(m.percentVsMedia, 0)}%</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>`
    : ''

  const fmtN = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
  const mat = p.maturacao
  const fisico = p.fisico ?? []
  const temMat = !!mat && mat.classificacao !== 'sem_dados'
  const blocoDesenvolvimento =
    temMat || fisico.length > 0 || p.imc != null
      ? `
    <section>
      <h2>Desenvolvimento — Físico e Maturação</h2>
      ${
        temMat
          ? `<div class="mat">
               <span class="badge">${esc(mat!.classificacaoLabel)}</span>
               <span>Idade real: <b>${mat!.idadeCronologica != null ? fmt(mat!.idadeCronologica, 1) : '—'}</b></span>
               <span>Idade biológica: <b>${mat!.idadeBiologica != null ? fmt(mat!.idadeBiologica, 1) : '—'}</b></span>
               <span>Diferença: <b>${mat!.diferenca != null ? `${mat!.diferenca > 0 ? '+' : ''}${fmt(mat!.diferenca, 1)}` : '—'}</b></span>
             </div>
             <p class="mat-desc">${esc(mat!.descricao)}</p>`
          : ''
      }
      ${
        fisico.length > 0
          ? `<table>
               <thead><tr><th>Teste físico</th><th>Atual</th><th>Início</th><th>Evolução</th></tr></thead>
               <tbody>
                 ${fisico
                   .map(
                     r => `<tr>
                       <td>${esc(r.label)}</td>
                       <td class="num">${fmtN(r.ultimo)} ${esc(r.unidade)}</td>
                       <td class="num">${fmtN(r.primeiro)} ${esc(r.unidade)}</td>
                       <td class="num ${r.melhorou === null ? '' : r.melhorou ? 'pos' : 'neg'}">${r.melhorou === null ? '1ª medição' : `${r.melhorou ? 'melhorou' : 'piorou'} ${fmtN(Math.abs(r.delta))} ${r.unidade}`}</td>
                     </tr>`
                   )
                   .join('')}
                 ${p.imc != null ? `<tr><td>IMC</td><td class="num">${fmtN(p.imc)}</td><td class="num">—</td><td class="num">peso / altura²</td></tr>` : ''}
               </tbody>
             </table>`
          : p.imc != null
            ? `<p>IMC atual: <b>${fmtN(p.imc)}</b></p>`
            : ''
      }
    </section>`
      : ''

  const indiceHTML = (nome: string, ind: Indice | null | undefined, cor: string) => {
    if (!ind || !ind.disponivel) return ''
    const comps = ind.componentes.filter(c => c.disponivel)
    return `<div class="indice">
      <div class="indice-topo">
        <span class="indice-valor" style="color:${cor}">${ind.valor}<small>/100</small></span>
        <div><b>${esc(nome)}</b><br/><span class="indice-classe" style="color:${cor}">${esc(classificarIndice(ind.valor))}</span></div>
      </div>
      <ul class="indice-comps">
        ${comps.map(c => `<li>${esc(c.label)} — <b>${Math.round(c.score)}</b> <span class="desc">(${esc(c.detalhe)})</span></li>`).join('')}
      </ul>
    </div>`
  }
  const blocoIndices =
    p.ida?.disponivel || p.idp?.disponivel
      ? `<section><h2>Índices Gerais</h2><div class="indices-grid">${indiceHTML('Desenvolvimento (IDA)', p.ida, '#0891b2')}${indiceHTML('Desempenho (IDP)', p.idp, '#d97706')}</div></section>`
      : ''

  const textoBloco = (titulo: string, cor: string, texto: string | null) =>
    texto
      ? `<div class="texto-bloco" style="border-left-color:${cor}">
           <h3 style="color:${cor}">${esc(titulo)}</h3>
           <p>${esc(texto)}</p>
         </div>`
      : ''

  const efic = p.eficiencia ?? []
  const blocoEficiencia =
    efic.length > 0
      ? `<section>
          <h2>Eficiência Técnica <span class="sub">(padrão de plataformas profissionais)</span></h2>
          <ul class="lista-exp">
            ${efic
              .map(m => `<li><b>${esc(m.valor)}</b> &nbsp;${esc(m.titulo)}<br/><span class="desc">${esc(m.descricao)}</span></li>`)
              .join('')}
          </ul>
        </section>`
      : ''

  const ctx = p.contexto
  const blocoContexto =
    ctx && ctx.disponivel && ctx.jogosComContexto > 0
      ? `<section>
          <h2>Produção Ajustada ao Contexto</h2>
          <div class="linha-medias">
            <span>Participações reais: <b>${fmtN(ctx.participacoes)}</b></span>
            <span>Ajustadas ao contexto: <b>${fmtN(ctx.participacoesAjustadas)}</b></span>
            <span>Fator médio: <b>${fmt(ctx.fator, 2)}×</b></span>
            <span class="desc" style="width:100%">Pondera gols e assistências pelo nível do adversário, importância do jogo e situação do placar em ${ctx.jogosComContexto} jogo(s) com contexto registrado. Fator acima de 1,00 indica produção em cenários mais difíceis.</span>
          </div>
        </section>`
      : ''

  const blocoParecer = p.parecer
    ? `<section class="parecer"><h2>Parecer do analista</h2>${parecerHTML(p.parecer)}</section>`
    : ''

  const blocoRadar = p.radar && p.radar.length
    ? `<section class="avoid"><h2>Perfil técnico — dimensões CBF (0–5)</h2><div class="radar-wrap">${radarSVG(p.radar)}</div></section>`
    : ''

  const dimGrupo = (nome: string, cor: string, arr: { label: string; valor: number }[]) =>
    arr.length
      ? `<div class="dim-grupo"><h4 style="color:${cor}">${esc(nome)}</h4>${arr
          .map(d => `<div class="dim-row"><span class="dim-label">${esc(d.label)}</span><div class="dim-track"><div class="dim-fill" style="width:${Math.min(100, (d.valor / 5) * 100).toFixed(0)}%;background:${cor}"></div></div><span class="dim-val">${fmt(d.valor, 1)}</span></div>`)
          .join('')}</div>`
      : ''
  const blocoDimensoes = p.dimensoes && p.dimensoes.length
    ? `<section class="avoid"><h2>Avaliação por dimensão</h2><div class="dim-grid">${dimGrupo('Dimensões CBF', '#d97706', p.dimensoes.filter(d => d.grupo === 'CBF'))}${dimGrupo('Ofensivos', '#16a34a', p.dimensoes.filter(d => d.grupo === 'OFE'))}${dimGrupo('Defensivos', '#dc2626', p.dimensoes.filter(d => d.grupo === 'DEF'))}</div></section>`
    : ''

  const blocoPercentis = p.percentis && p.percentis.length
    ? `<section class="avoid"><h2>Ranking percentil <span class="sub">vs atletas de mesma posição (${Math.max(...p.percentis.map(m => m.n))} atletas)</span></h2>
        <p class="pct-nota">Percentil = posição relativa entre os pares. <b>P75</b> significa melhor que 75% dos atletas da mesma posição. Ordenado do mais forte ao mais fraco.</p>
        <div class="pct-grid">
          ${p.percentis.map(m => `<div class="pct-row">
            <span class="pct-label">${esc(m.label)}</span>
            <div class="pct-track"><div class="pct-fill" style="width:${m.percentil}%;background:${corPercentil(m.percentil)}"></div></div>
            <span class="pct-val" style="color:${corPercentil(m.percentil)}">P${m.percentil}</span>
            <span class="pct-classe">${esc(classificarPercentil(m.percentil))}</span>
          </div>`).join('')}
        </div>
      </section>`
    : ''

  const blocoTextos =
    p.pontosFortes || p.pontosDesenvolver || p.observacoes
      ? `<section>
          <h2>Análise Técnica</h2>
          ${textoBloco('Pontos Fortes', '#16a34a', p.pontosFortes)}
          ${textoBloco('Pontos a Desenvolver', '#ea580c', p.pontosDesenvolver)}
          ${textoBloco('Observações', '#2563eb', p.observacoes)}
        </section>`
      : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Dossiê - ${esc(atleta.nome)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #1e293b; background: #fff; padding: 32px; }
  .topo { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px; }
  .marca { font-size: 20px; font-weight: 800; color: #0f172a; }
  .marca span { color: #f59e0b; }
  .data { font-size: 12px; color: #64748b; }
  .header-atleta { display: flex; gap: 20px; align-items: center; margin-bottom: 24px; }
  .foto { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid #e2e8f0; }
  .foto-vazia { display: flex; align-items: center; justify-content: center; background: #f1f5f9; color: #94a3b8; font-size: 36px; font-weight: 700; }
  .header-atleta h1 { font-size: 26px; color: #0f172a; }
  .header-atleta .info { font-size: 13px; color: #475569; margin-top: 4px; }
  section { margin-bottom: 22px; page-break-inside: avoid; }
  h2 { font-size: 15px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
  h2 .sub { font-size: 12px; color: #94a3b8; font-weight: 400; }
  .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 8px; text-align: center; }
  .stat-valor { font-size: 24px; font-weight: 800; line-height: 1; }
  .stat-rotulo { font-size: 10px; text-transform: uppercase; color: #64748b; margin-top: 6px; letter-spacing: .3px; }
  .linha-medias { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 12px; color: #475569; }
  .linha-medias b { color: #0f172a; }
  .lista-exp { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
  .lista-exp li { font-size: 13px; color: #0f172a; padding-left: 10px; border-left: 3px solid #f59e0b; }
  .lista-exp li b { font-size: 16px; color: #0f172a; margin-right: 2px; }
  .lista-exp .desc { font-size: 11px; color: #64748b; line-height: 1.4; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
  th { background: #f8fafc; font-size: 11px; text-transform: uppercase; color: #64748b; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.pos { color: #16a34a; font-weight: 700; }
  td.neg { color: #dc2626; font-weight: 700; }
  .indices-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .indice { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; background: #f8fafc; }
  .indice-topo { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .indice-valor { font-size: 30px; font-weight: 800; line-height: 1; }
  .indice-valor small { font-size: 12px; color: #94a3b8; font-weight: 600; }
  .indice-classe { font-size: 11px; font-weight: 700; }
  .indice-comps { list-style: none; font-size: 11px; color: #475569; }
  .indice-comps li { padding: 1px 0; }
  .indice-comps .desc { color: #94a3b8; }
  .mat { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; font-size: 12px; color: #475569; margin-bottom: 8px; }
  .mat b { color: #0f172a; }
  .mat .badge { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; padding: 3px 8px; border-radius: 6px; font-weight: 700; }
  .mat-desc { font-size: 12px; color: #475569; line-height: 1.5; margin-bottom: 10px; }
  .texto-bloco { border-left: 4px solid; padding: 8px 12px; margin-bottom: 10px; background: #f8fafc; border-radius: 0 8px 8px 0; }
  .texto-bloco h3 { font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
  .texto-bloco p { font-size: 13px; color: #334155; line-height: 1.5; }
  .rodape { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  .avoid { page-break-inside: avoid; }
  .radar-wrap { text-align: center; padding: 4px 0; }
  .parecer h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .4px; color: #0f172a; margin: 12px 0 4px; }
  .parecer p { font-size: 12.5px; color: #334155; line-height: 1.55; margin-bottom: 6px; }
  .parecer ul { margin: 4px 0 8px 18px; }
  .parecer li { font-size: 12.5px; color: #334155; line-height: 1.5; margin-bottom: 2px; }
  .parecer strong { color: #0f172a; }
  .dim-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .dim-grupo h4 { font-size: 11px; text-transform: uppercase; letter-spacing: .3px; margin-bottom: 6px; }
  .dim-row { display: grid; grid-template-columns: 1fr 56px 26px; align-items: center; gap: 6px; margin-bottom: 4px; }
  .dim-label { font-size: 10.5px; color: #475569; }
  .dim-track { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
  .dim-fill { height: 100%; border-radius: 3px; }
  .dim-val { font-size: 11px; font-weight: 700; color: #0f172a; text-align: right; font-variant-numeric: tabular-nums; }
  .pct-nota { font-size: 11px; color: #64748b; margin-bottom: 10px; }
  .pct-nota b { color: #0f172a; }
  .pct-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
  .pct-row { display: grid; grid-template-columns: 90px 1fr 34px 74px; align-items: center; gap: 8px; }
  .pct-label { font-size: 10.5px; color: #475569; }
  .pct-track { height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .pct-fill { height: 100%; border-radius: 4px; }
  .pct-val { font-size: 11px; font-weight: 800; text-align: right; font-variant-numeric: tabular-nums; }
  .pct-classe { font-size: 9.5px; color: #64748b; }
  @media print { body { padding: 0; } @page { margin: 16mm; } .dim-grid { grid-template-columns: 1fr 1fr 1fr; } }
</style>
</head>
<body>
  <div class="topo">
    <div class="marca">Olhar da <span>Base</span></div>
    <div class="data">Dossiê gerado em ${new Date().toLocaleDateString('pt-BR')}${dataFmt ? ` &nbsp;•&nbsp; Última avaliação: ${dataFmt}` : ''}</div>
  </div>

  <div class="header-atleta">
    ${foto}
    <div>
      <h1>${esc(atleta.nome)}</h1>
      <div class="info">${infoLinha}</div>
    </div>
  </div>

  <section>
    <h2>Números da Temporada</h2>
    <div class="grid-5">
      ${statCard(String(stats.gols), 'Gols', '#16a34a')}
      ${statCard(String(stats.assistencias), 'Assistências', '#2563eb')}
      ${statCard(String(stats.participacoes), 'Participações', '#7c3aed')}
      ${statCard(String(stats.jogos), 'Jogos', '#0f172a')}
      ${statCard(`${stats.minutos}'`, 'Minutos', '#d97706')}
    </div>
  </section>

  <section>
    <h2>Médias e Participação em Gol</h2>
    <ul class="lista-exp">
      ${explicarMedias(stats)
        .map(m => `<li><b>${esc(m.valor)}</b> &nbsp;${esc(m.titulo)}<br/><span class="desc">${esc(m.descricao)}</span></li>`)
        .join('')}
    </ul>
  </section>

  <section>
    <h2>Regularidade e Ritmo</h2>
    <ul class="lista-exp">
      ${explicarInsights(stats)
        .map(m => `<li><b>${esc(m.valor)}</b> &nbsp;${esc(m.titulo)}<br/><span class="desc">${esc(m.descricao)}</span></li>`)
        .join('')}
    </ul>
  </section>

  ${blocoParecer}
  ${blocoEficiencia}
  ${blocoContexto}
  ${blocoIndices}
  ${blocoMedias}
  ${blocoRadar}
  ${blocoDimensoes}
  ${blocoPercentis}
  ${blocoDesenvolvimento}
  ${blocoComparativo}
  ${blocoTextos}

  <div class="rodape">Olhar da Base — Sistema de gestão de atletas de base &nbsp;•&nbsp; Relatório confidencial</div>
</body>
</html>`
}

// Abre a janela de impressão com o dossiê. Retorna false se o popup foi bloqueado.
export function abrirDossieParaImpressao(params: DossieParams): boolean {
  const html = gerarDossieHTML(params)
  const win = window.open('', '_blank', 'width=900,height=1000')
  if (!win) return false
  win.document.open()
  win.document.write(html)
  win.document.close()
  // Aguarda render/imagens antes de imprimir.
  win.onload = () => {
    setTimeout(() => {
      win.focus()
      win.print()
    }, 300)
  }
  return true
}
