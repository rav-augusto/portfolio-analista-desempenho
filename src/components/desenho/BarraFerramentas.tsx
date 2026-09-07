'use client'

import { cn } from '@/lib/utils/cn'
import { ArrowUpRight, Waves, Footprints, Minus, Circle, Target, Type, UserRound, Undo2, Trash2 } from 'lucide-react'
import { CORES_DESENHO, type FerramentaDesenho } from '@/lib/desenho'

const FERRAMENTAS: { id: FerramentaDesenho; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'seta', label: 'Passe', icon: ArrowUpRight },
  { id: 'conducao', label: 'Condução', icon: Waves },
  { id: 'corrida', label: 'Corrida', icon: Footprints },
  { id: 'linha', label: 'Linha', icon: Minus },
  { id: 'circulo', label: 'Círculo', icon: Circle },
  { id: 'area', label: 'Área', icon: Target },
  { id: 'texto', label: 'Texto', icon: Type },
  { id: 'ficha', label: 'Jogador', icon: UserRound },
]

interface BarraFerramentasProps {
  ferramenta: FerramentaDesenho
  onFerramenta: (f: FerramentaDesenho) => void
  cor: string
  onCor: (c: string) => void
  podeDesfazer: boolean
  onDesfazer: () => void
  onLimpar: () => void
  extra?: React.ReactNode
}

export function BarraFerramentas({ ferramenta, onFerramenta, cor, onCor, podeDesfazer, onDesfazer, onLimpar, extra }: BarraFerramentasProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {FERRAMENTAS.map(f => (
        <button
          key={f.id}
          type="button"
          onClick={() => onFerramenta(f.id)}
          title={f.label}
          className={cn('inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors', ferramenta === f.id ? 'bg-brand text-app border-brand' : 'bg-app text-soft border-line hover:border-line-strong')}
        >
          <f.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{f.label}</span>
        </button>
      ))}
      <div className="w-px h-6 bg-line mx-1" />
      {CORES_DESENHO.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onCor(c)}
          aria-label={`Cor ${c}`}
          className={cn('w-6 h-6 rounded-full border-2', cor === c ? 'border-brand' : 'border-line')}
          style={{ background: c }}
        />
      ))}
      <div className="w-px h-6 bg-line mx-1" />
      <button type="button" onClick={onDesfazer} disabled={!podeDesfazer} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-line text-soft hover:border-line-strong disabled:opacity-40">
        <Undo2 className="w-3.5 h-3.5" /> Desfazer
      </button>
      <button type="button" onClick={onLimpar} disabled={!podeDesfazer} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-line text-negative hover:border-negative/40 disabled:opacity-40">
        <Trash2 className="w-3.5 h-3.5" /> Limpar
      </button>
      {extra}
    </div>
  )
}
