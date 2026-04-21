'use client'

type FormationType = '3-5-2' | '4-3-3' | '4-4-2' | '4-2-3-1' | '4-1-4-1' | '3-4-3' | '5-3-2' | '5-4-1' | string

interface TacticalFormationProps {
  formation: FormationType
}

const formationPositions: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    { x: 50, y: 88 },
    { x: 18, y: 70 }, { x: 38, y: 73 }, { x: 62, y: 73 }, { x: 82, y: 70 },
    { x: 30, y: 48 }, { x: 50, y: 44 }, { x: 70, y: 48 },
    { x: 22, y: 22 }, { x: 50, y: 18 }, { x: 78, y: 22 },
  ],
  '4-4-2': [
    { x: 50, y: 88 },
    { x: 18, y: 70 }, { x: 38, y: 73 }, { x: 62, y: 73 }, { x: 82, y: 70 },
    { x: 18, y: 46 }, { x: 38, y: 48 }, { x: 62, y: 48 }, { x: 82, y: 46 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
  '4-2-3-1': [
    { x: 50, y: 88 },
    { x: 18, y: 70 }, { x: 38, y: 73 }, { x: 62, y: 73 }, { x: 82, y: 70 },
    { x: 35, y: 54 }, { x: 65, y: 54 },
    { x: 22, y: 34 }, { x: 50, y: 36 }, { x: 78, y: 34 },
    { x: 50, y: 18 },
  ],
  '4-1-4-1': [
    { x: 50, y: 88 },
    { x: 18, y: 70 }, { x: 38, y: 73 }, { x: 62, y: 73 }, { x: 82, y: 70 },
    { x: 50, y: 56 },
    { x: 18, y: 38 }, { x: 38, y: 40 }, { x: 62, y: 40 }, { x: 82, y: 38 },
    { x: 50, y: 18 },
  ],
  '3-5-2': [
    { x: 50, y: 88 },
    { x: 30, y: 72 }, { x: 50, y: 75 }, { x: 70, y: 72 },
    { x: 12, y: 46 }, { x: 32, y: 50 }, { x: 50, y: 52 }, { x: 68, y: 50 }, { x: 88, y: 46 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
  '3-4-3': [
    { x: 50, y: 88 },
    { x: 30, y: 72 }, { x: 50, y: 75 }, { x: 70, y: 72 },
    { x: 18, y: 48 }, { x: 40, y: 50 }, { x: 60, y: 50 }, { x: 82, y: 48 },
    { x: 22, y: 22 }, { x: 50, y: 18 }, { x: 78, y: 22 },
  ],
  '5-3-2': [
    { x: 50, y: 88 },
    { x: 12, y: 66 }, { x: 30, y: 72 }, { x: 50, y: 75 }, { x: 70, y: 72 }, { x: 88, y: 66 },
    { x: 30, y: 46 }, { x: 50, y: 48 }, { x: 70, y: 46 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
  '5-4-1': [
    { x: 50, y: 88 },
    { x: 12, y: 66 }, { x: 30, y: 72 }, { x: 50, y: 75 }, { x: 70, y: 72 }, { x: 88, y: 66 },
    { x: 18, y: 44 }, { x: 38, y: 46 }, { x: 62, y: 46 }, { x: 82, y: 44 },
    { x: 50, y: 18 },
  ],
}

export function TacticalFormation({ formation }: TacticalFormationProps) {
  const positions = formationPositions[formation] || formationPositions['4-3-3']

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="w-full" style={{ maxWidth: '160px' }}>
        {/* Campo */}
        <rect x="2" y="2" width="96" height="96" rx="2" fill="#1a472a" />
        <rect x="6" y="6" width="88" height="88" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

        {/* Linha meio */}
        <line x1="6" y1="50" x2="94" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

        {/* Areas */}
        <rect x="25" y="6" width="50" height="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <rect x="25" y="80" width="50" height="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

        {/* Jogadores */}
        {positions.map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={i === 0 ? 4.5 : 4}
            fill={i === 0 ? '#f59e0b' : '#3b82f6'}
          />
        ))}
      </svg>
      <span className="text-lg font-bold text-white mt-2">{formation || '4-3-3'}</span>
    </div>
  )
}

export default TacticalFormation
