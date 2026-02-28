'use client'

// Diagramas SVG profissionais para os Princípios Táticos
// Estilo Tactical Pad - minimalista e limpo

// Componente base do campo
const Field = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 120 80" className="w-full h-full">
    {/* Campo de fundo */}
    <rect x="0" y="0" width="120" height="80" fill="#2d8a4e" />

    {/* Linhas do campo */}
    <rect x="5" y="5" width="110" height="70" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
    <line x1="60" y1="5" x2="60" y2="75" stroke="#fff" strokeWidth="1" opacity="0.4" />
    <circle cx="60" cy="40" r="12" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />

    {/* Area esquerda */}
    <rect x="5" y="20" width="18" height="40" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
    <rect x="5" y="30" width="8" height="20" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />

    {/* Area direita */}
    <rect x="97" y="20" width="18" height="40" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />
    <rect x="107" y="30" width="8" height="20" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4" />

    {children}
  </svg>
)

// Jogador atacante (azul)
const PlayerBlue = ({ cx, cy, label }: { cx: number; cy: number; label?: string }) => (
  <g>
    <circle cx={cx} cy={cy} r="5" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5" />
    {label && <text x={cx} y={cy + 2} fill="#fff" fontSize="5" textAnchor="middle" fontWeight="bold">{label}</text>}
  </g>
)

// Jogador defensor (vermelho)
const PlayerRed = ({ cx, cy, label }: { cx: number; cy: number; label?: string }) => (
  <g>
    <circle cx={cx} cy={cy} r="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
    {label && <text x={cx} y={cy + 2} fill="#fff" fontSize="5" textAnchor="middle" fontWeight="bold">{label}</text>}
  </g>
)

// Bola
const Ball = ({ cx, cy }: { cx: number; cy: number }) => (
  <circle cx={cx} cy={cy} r="3" fill="#fff" stroke="#333" strokeWidth="0.5" />
)

// Seta de movimento
const Arrow = ({ x1, y1, x2, y2, color = '#f97316', dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) => {
  const id = `arrow-${x1}-${y1}-${x2}-${y2}`.replace(/\./g, '-')
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? "4,2" : "none"}
        markerEnd={`url(#${id})`}
      />
    </g>
  )
}

// Zona destacada
const Zone = ({ x, y, width, height, color = '#22c55e' }: { x: number; y: number; width: number; height: number; color?: string }) => (
  <rect x={x} y={y} width={width} height={height} fill={color} opacity="0.25" rx="3" />
)

// === PRINCÍPIOS OFENSIVOS ===

export const DiagramPenetracao = () => (
  <Field>
    {/* Zona de penetração */}
    <Zone x={70} y={25} width={25} height={30} />

    {/* Atacante com bola */}
    <PlayerBlue cx={45} cy={40} />
    <Ball cx={50} cy={40} />

    {/* Seta de penetração */}
    <Arrow x1={53} y1={40} x2={78} y2={40} />

    {/* Defensores */}
    <PlayerRed cx={85} cy={35} />
    <PlayerRed cx={85} cy={45} />
  </Field>
)

export const DiagramCoberturaOfensiva = () => (
  <Field>
    {/* Atacante com bola */}
    <PlayerBlue cx={55} cy={40} />
    <Ball cx={60} cy={40} />

    {/* Jogadores dando cobertura */}
    <PlayerBlue cx={40} cy={28} />
    <PlayerBlue cx={40} cy={52} />

    {/* Linhas de passe (cobertura) */}
    <Arrow x1={55} y1={37} x2={43} y2={30} color="#22c55e" dashed />
    <Arrow x1={55} y1={43} x2={43} y2={50} color="#22c55e" dashed />

    {/* Defensor */}
    <PlayerRed cx={70} cy={40} />
  </Field>
)

export const DiagramEspacoComBola = () => (
  <Field>
    {/* Zona livre para conduzir */}
    <Zone x={55} y={20} width={25} height={25} />

    {/* Atacante com bola */}
    <PlayerBlue cx={45} cy={45} />
    <Ball cx={50} cy={45} />

    {/* Seta conduzindo para o espaço */}
    <Arrow x1={52} y1={43} x2={68} y2={32} />

    {/* Defensores deixando espaço */}
    <PlayerRed cx={80} cy={25} />
    <PlayerRed cx={80} cy={55} />
  </Field>
)

export const DiagramEspacoSemBola = () => (
  <Field>
    {/* Zona de espaço nas costas */}
    <Zone x={70} y={30} width={20} height={20} color="#22c55e" />

    {/* Portador da bola */}
    <PlayerBlue cx={35} cy={40} />
    <Ball cx={40} cy={40} />

    {/* Atacante buscando espaço */}
    <PlayerBlue cx={55} cy={55} />

    {/* Movimento para o espaço */}
    <Arrow x1={58} y1={52} x2={75} y2={38} />

    {/* Linha de passe potencial */}
    <Arrow x1={42} y1={38} x2={72} y2={36} color="#22c55e" dashed />

    {/* Linha defensiva */}
    <line x1="65" y1="20" x2="65" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" opacity="0.6" />
    <PlayerRed cx={65} cy={35} />
    <PlayerRed cx={65} cy={50} />
  </Field>
)

export const DiagramMobilidade = () => (
  <Field>
    {/* Portador da bola */}
    <PlayerBlue cx={35} cy={40} />
    <Ball cx={40} cy={40} />

    {/* Atacante fazendo movimento de mobilidade */}
    <PlayerBlue cx={60} cy={50} />

    {/* Movimento nas costas da defesa */}
    <Arrow x1={63} y1={48} x2={85} y2={35} />

    {/* Linha defensiva */}
    <line x1="70" y1="20" x2="70" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" opacity="0.6" />

    {/* Passe em profundidade */}
    <Arrow x1={42} y1={38} x2={82} y2={33} color="#22c55e" dashed />

    {/* Defensores */}
    <PlayerRed cx={70} cy={35} />
    <PlayerRed cx={70} cy={50} />
  </Field>
)

export const DiagramUnidadeOfensiva = () => (
  <Field>
    {/* Linha de defesa */}
    <PlayerBlue cx={25} cy={30} />
    <PlayerBlue cx={25} cy={50} />

    {/* Linha de meio */}
    <PlayerBlue cx={45} cy={25} />
    <PlayerBlue cx={45} cy={40} />
    <PlayerBlue cx={45} cy={55} />

    {/* Linha de ataque */}
    <PlayerBlue cx={65} cy={35} />
    <PlayerBlue cx={65} cy={45} />

    {/* Linhas de conexão */}
    <line x1="25" y1="30" x2="25" y2="50" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
    <line x1="45" y1="25" x2="45" y2="55" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
    <line x1="65" y1="35" x2="65" y2="45" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />

    {/* Conexões horizontais */}
    <line x1="25" y1="40" x2="65" y2="40" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,2" opacity="0.3" />

    <Ball cx={50} cy={40} />
  </Field>
)

// === PRINCÍPIOS DEFENSIVOS ===

export const DiagramContencao = () => (
  <Field>
    {/* Atacante com bola */}
    <PlayerRed cx={55} cy={40} />
    <Ball cx={50} cy={40} />

    {/* Defensor fazendo contenção */}
    <PlayerBlue cx={40} cy={40} />

    {/* Seta de pressão */}
    <Arrow x1={43} y1={40} x2={47} y2={40} color="#3b82f6" />

    {/* Impedindo progressão */}
    <text x="30" y="35" fill="#fff" fontSize="6" opacity="0.8">PRESS</text>

    {/* Gol protegido */}
    <rect x="5" y="32" width="3" height="16" fill="#fff" opacity="0.3" />
  </Field>
)

export const DiagramCoberturaDefensiva = () => (
  <Field>
    {/* Atacante com bola */}
    <PlayerRed cx={55} cy={40} />
    <Ball cx={50} cy={40} />

    {/* Defensor fazendo contenção */}
    <PlayerBlue cx={42} cy={40} />

    {/* Defensor fazendo cobertura */}
    <PlayerBlue cx={30} cy={35} />

    {/* Linha de cobertura */}
    <Arrow x1={33} y1={36} x2={39} y2={39} color="#22c55e" dashed />

    {/* Seta de apoio */}
    <text x="22" y="30" fill="#22c55e" fontSize="5" opacity="0.9">COB</text>
  </Field>
)

export const DiagramEquilibrioRecuperacao = () => (
  <Field>
    {/* Linha central */}
    <line x1="60" y1="10" x2="60" y2="70" stroke="#fff" strokeWidth="1.5" opacity="0.5" />

    {/* Bola perdida */}
    <Ball cx={65} cy={40} />
    <PlayerRed cx={70} cy={40} />

    {/* Jogadores recuperando */}
    <PlayerBlue cx={75} cy={25} />
    <PlayerBlue cx={75} cy={55} />

    {/* Movimento de recuperação */}
    <Arrow x1={72} y1={28} x2={58} y2={38} color="#f97316" />
    <Arrow x1={72} y1={52} x2={58} y2={42} color="#f97316" />

    <text x="45" y="40" fill="#fff" fontSize="5" opacity="0.8">RECUP</text>
  </Field>
)

export const DiagramEquilibrioDefensivo = () => (
  <Field>
    {/* Zonas de equilíbrio */}
    <Zone x={20} y={15} width={25} height={50} color="#3b82f6" />
    <Zone x={47} y={15} width={25} height={50} color="#3b82f6" />
    <Zone x={74} y={15} width={25} height={50} color="#3b82f6" />

    {/* Defensores equilibrados */}
    <PlayerBlue cx={32} cy={40} />
    <PlayerBlue cx={60} cy={40} />
    <PlayerBlue cx={87} cy={40} />

    {/* Bola */}
    <Ball cx={60} cy={55} />
    <PlayerRed cx={65} cy={55} />

    <text x="55" y="25" fill="#fff" fontSize="5" opacity="0.8">ZONAS</text>
  </Field>
)

export const DiagramConcentracao = () => (
  <Field>
    {/* Zona de concentração */}
    <ellipse cx="25" cy="40" rx="18" ry="22" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,2" />

    {/* Defensores concentrados */}
    <PlayerBlue cx={20} cy={30} />
    <PlayerBlue cx={20} cy={50} />
    <PlayerBlue cx={32} cy={40} />
    <PlayerBlue cx={15} cy={40} />

    {/* Atacantes */}
    <PlayerRed cx={50} cy={30} />
    <PlayerRed cx={50} cy={50} />
    <Ball cx={45} cy={40} />

    <text x="18" y="65" fill="#fff" fontSize="5" opacity="0.8">CONC</text>
  </Field>
)

export const DiagramUnidadeDefensiva = () => (
  <Field>
    {/* Linha de defesa */}
    <PlayerBlue cx={25} cy={28} />
    <PlayerBlue cx={25} cy={40} />
    <PlayerBlue cx={25} cy={52} />

    {/* Linha de meio defensivo */}
    <PlayerBlue cx={42} cy={32} />
    <PlayerBlue cx={42} cy={48} />

    {/* Linhas de conexão */}
    <line x1="25" y1="28" x2="25" y2="52" stroke="#22c55e" strokeWidth="2" opacity="0.5" />
    <line x1="42" y1="32" x2="42" y2="48" stroke="#22c55e" strokeWidth="2" opacity="0.5" />

    {/* Conexão entre linhas */}
    <line x1="25" y1="40" x2="42" y2="40" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />

    {/* Atacantes */}
    <PlayerRed cx={65} cy={35} />
    <PlayerRed cx={65} cy={50} />
    <Ball cx={60} cy={42} />

    <text x="28" y="65" fill="#fff" fontSize="5" opacity="0.8">BLOCO</text>
  </Field>
)

// Mapeamento dos diagramas
export const tacticalDiagrams: Record<string, React.ComponentType> = {
  penetracao: DiagramPenetracao,
  cobertura_ofensiva: DiagramCoberturaOfensiva,
  espaco_com_bola: DiagramEspacoComBola,
  espaco_sem_bola: DiagramEspacoSemBola,
  mobilidade: DiagramMobilidade,
  unidade_ofensiva: DiagramUnidadeOfensiva,
  contencao: DiagramContencao,
  cobertura_defensiva: DiagramCoberturaDefensiva,
  equilibrio_recuperacao: DiagramEquilibrioRecuperacao,
  equilibrio_defensivo: DiagramEquilibrioDefensivo,
  concentracao_def: DiagramConcentracao,
  unidade_defensiva: DiagramUnidadeDefensiva,
}
