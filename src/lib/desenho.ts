// Motor de desenho compartilhado entre Anotacoes Taticas (em cima de foto/video)
// e Prancheta Tatica (campo em branco). Coordenadas de formas sao sempre
// percentuais (0-100) do tamanho do canvas, pra funcionar em qualquer resolucao.

export type Forma =
  | { tipo: 'seta' | 'linha' | 'corrida' | 'conducao' | 'circulo' | 'area'; x1: number; y1: number; x2: number; y2: number; cor: string }
  | { tipo: 'texto'; x1: number; y1: number; texto: string; cor: string }
  | { tipo: 'ficha'; x1: number; y1: number; numero: number; cor: string }

export type FerramentaDesenho = 'seta' | 'conducao' | 'corrida' | 'linha' | 'circulo' | 'area' | 'texto' | 'ficha'

export const CORES_DESENHO = ['#ef4444', '#eab308', '#3b82f6', '#ffffff', '#22c55e', '#a855f7']

// Ferramentas que sao criadas arrastando (ponto inicial -> ponto final).
// "ficha" e "texto" sao criadas com um unico clique/toque.
export const FERRAMENTAS_ARRASTO = new Set<FerramentaDesenho>(['seta', 'conducao', 'corrida', 'linha', 'circulo', 'area'])

function desenharSeta(ctx: CanvasRenderingContext2D, x2: number, y2: number, angulo: number, tamanho: number) {
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - tamanho * Math.cos(angulo - Math.PI / 6), y2 - tamanho * Math.sin(angulo - Math.PI / 6))
  ctx.lineTo(x2 - tamanho * Math.cos(angulo + Math.PI / 6), y2 - tamanho * Math.sin(angulo + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

function desenharLinhaOndulada(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, amplitude: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy) || 1
  const segmentos = Math.max(8, Math.floor(dist / 10))
  const nx = -dy / dist
  const ny = dx / dist
  ctx.beginPath()
  for (let i = 0; i <= segmentos; i++) {
    const t = i / segmentos
    const offset = Math.sin(t * Math.PI * 5) * amplitude
    const px = x1 + dx * t + nx * offset
    const py = y1 + dy * t + ny * offset
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

export function desenharForma(ctx: CanvasRenderingContext2D, f: Forma, w: number, h: number) {
  const x1 = (f.x1 / 100) * w
  const y1 = (f.y1 / 100) * h
  ctx.lineWidth = Math.max(3, w * 0.005)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.setLineDash([])
  ctx.strokeStyle = f.cor
  ctx.fillStyle = f.cor

  if (f.tipo === 'texto') {
    const tamanhoFonte = Math.max(18, w * 0.028)
    ctx.font = `bold ${tamanhoFonte}px system-ui, sans-serif`
    ctx.textBaseline = 'top'
    const largura = ctx.measureText(f.texto).width
    ctx.fillStyle = 'rgba(0,0,0,0.65)'
    ctx.fillRect(x1 - 5, y1 - 3, largura + 10, tamanhoFonte + 8)
    ctx.fillStyle = f.cor
    ctx.fillText(f.texto, x1, y1)
    return
  }

  if (f.tipo === 'ficha') {
    const raio = Math.max(16, w * 0.032)
    ctx.beginPath()
    ctx.arc(x1, y1, raio, 0, Math.PI * 2)
    ctx.fillStyle = f.cor
    ctx.fill()
    ctx.lineWidth = Math.max(2, w * 0.003)
    ctx.strokeStyle = '#ffffff'
    ctx.stroke()
    const corTexto = corContrastante(f.cor)
    ctx.fillStyle = corTexto
    ctx.font = `bold ${raio}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(f.numero), x1, y1 + 1)
    ctx.textAlign = 'start'
    ctx.textBaseline = 'alphabetic'
    return
  }

  const x2 = (f.x2 / 100) * w
  const y2 = (f.y2 / 100) * h

  if (f.tipo === 'circulo') {
    const raio = Math.hypot(x2 - x1, y2 - y1)
    ctx.beginPath()
    ctx.arc(x1, y1, raio, 0, Math.PI * 2)
    ctx.stroke()
    return
  }

  if (f.tipo === 'area') {
    const raio = Math.hypot(x2 - x1, y2 - y1)
    ctx.globalAlpha = 0.28
    ctx.beginPath()
    ctx.arc(x1, y1, raio, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(x1, y1, raio, 0, Math.PI * 2)
    ctx.stroke()
    return
  }

  const angulo = Math.atan2(y2 - y1, x2 - x1)
  const tamSeta = Math.max(16, w * 0.022)

  if (f.tipo === 'corrida') {
    ctx.setLineDash([Math.max(10, w * 0.016), Math.max(8, w * 0.012)])
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.setLineDash([])
    desenharSeta(ctx, x2, y2, angulo, tamSeta)
    return
  }

  if (f.tipo === 'conducao') {
    desenharLinhaOndulada(ctx, x1, y1, x2, y2, Math.max(6, w * 0.01))
    desenharSeta(ctx, x2, y2, angulo, tamSeta)
    return
  }

  // linha / seta
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  if (f.tipo === 'seta') desenharSeta(ctx, x2, y2, angulo, tamSeta)
}

function corContrastante(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminancia > 0.6 ? '#111111' : '#ffffff'
}

// Desenha o campo (gramado listrado + marcacoes) direto no canvas, em pixels,
// a partir das mesmas coordenadas (viewBox 68x100) usadas no SVG da escalacao.
export function desenharCampo(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sx = w / 68
  const sy = h / 100

  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1c6b3a' : '#195f33'
    ctx.fillRect(0, i * 12.5 * sy, w, 12.5 * sy)
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = Math.max(1, w * 0.004)

  const retangulo = (x: number, y: number, largura: number, altura: number) => {
    ctx.strokeRect(x * sx, y * sy, largura * sx, altura * sy)
  }

  retangulo(1, 1, 66, 98)
  ctx.beginPath(); ctx.moveTo(1 * sx, 50 * sy); ctx.lineTo(67 * sx, 50 * sy); ctx.stroke()
  ctx.beginPath(); ctx.arc(34 * sx, 50 * sy, 9 * sx, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(34 * sx, 50 * sy, 0.6 * sx, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill()
  retangulo(14, 1, 40, 16)
  retangulo(24, 1, 20, 6)
  retangulo(14, 83, 40, 16)
  retangulo(24, 93, 20, 6)
  ctx.beginPath(); ctx.arc(34 * sx, 17 * sy, 9 * sx, 0, Math.PI, false); ctx.stroke()
  ctx.beginPath(); ctx.arc(34 * sx, 83 * sy, 9 * sx, Math.PI, 0, false); ctx.stroke()
}
