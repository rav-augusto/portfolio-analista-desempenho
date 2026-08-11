// Gera um dossiê imprimível (PDF via "Salvar como PDF" do navegador) do atleta.
// Abre uma nova janela com layout claro e chama window.print(). Sem dependências externas.

import type { EstatisticasJogo, ComparativoPosicao } from './desempenho'

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

  const textoBloco = (titulo: string, cor: string, texto: string | null) =>
    texto
      ? `<div class="texto-bloco" style="border-left-color:${cor}">
           <h3 style="color:${cor}">${esc(titulo)}</h3>
           <p>${esc(texto)}</p>
         </div>`
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
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
  th { background: #f8fafc; font-size: 11px; text-transform: uppercase; color: #64748b; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.pos { color: #16a34a; font-weight: 700; }
  td.neg { color: #dc2626; font-weight: 700; }
  .texto-bloco { border-left: 4px solid; padding: 8px 12px; margin-bottom: 10px; background: #f8fafc; border-radius: 0 8px 8px 0; }
  .texto-bloco h3 { font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
  .texto-bloco p { font-size: 13px; color: #334155; line-height: 1.5; }
  .rodape { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 0; } @page { margin: 16mm; } }
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
    <h2>Médias e Ritmo</h2>
    <div class="linha-medias">
      <span>⌀ Min/jogo: <b>${fmt(stats.medias.minutosPorJogo, 0)}'</b></span>
      <span>G+A/jogo: <b>${fmt(stats.medias.participacoesPorJogo)}</b></span>
      <span>Gols/partida (60'): <b>${fmt(stats.medias.golsPorPartida)}</b></span>
      <span>G+A/partida (60'): <b>${fmt(stats.medias.participacoesPorPartida)}</b></span>
      <span>Jogos decisivos: <b>${fmt(stats.insights.percentDecisivo, 0)}%</b></span>
      <span>Melhor sequência: <b>${stats.insights.melhorSequencia} jogos</b></span>
      ${stats.insights.minutosPorGol > 0 ? `<span>1 gol a cada: <b>${fmt(stats.insights.minutosPorGol, 0)}'</b></span>` : ''}
    </div>
  </section>

  ${blocoMedias}
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
