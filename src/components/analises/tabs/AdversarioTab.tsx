'use client'

import { NumberField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
}

export function AdversarioTab({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Finalizacoes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Finalizacoes do Adversario</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Total" value={state.adv_finalizacoes_total} onChange={(v) => onChange('adv_finalizacoes_total', v)} />
          <NumberField label="No Gol" value={state.adv_finalizacoes_gol} onChange={(v) => onChange('adv_finalizacoes_gol', v)} />
          <NumberField label="Fora" value={state.adv_finalizacoes_fora} onChange={(v) => onChange('adv_finalizacoes_fora', v)} />
          <NumberField label="Bloqueadas" value={state.adv_finalizacoes_bloqueadas} onChange={(v) => onChange('adv_finalizacoes_bloqueadas', v)} />
        </div>
      </div>

      {/* Passes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Passes do Adversario</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Passes Total" value={state.adv_passes_total} onChange={(v) => onChange('adv_passes_total', v)} />
          <NumberField label="Passes Certos" value={state.adv_passes_certos} onChange={(v) => onChange('adv_passes_certos', v)} />
          <NumberField label="Posse de Bola (%)" value={state.adv_posse_bola} onChange={(v) => onChange('adv_posse_bola', v)} max={100} />
        </div>
      </div>

      {/* Disciplina */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Disciplina do Adversario</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Faltas Cometidas" value={state.adv_faltas_cometidas} onChange={(v) => onChange('adv_faltas_cometidas', v)} />
          <NumberField label="Cartoes Amarelos" value={state.adv_cartoes_amarelos} onChange={(v) => onChange('adv_cartoes_amarelos', v)} />
          <NumberField label="Cartoes Vermelhos" value={state.adv_cartoes_vermelhos} onChange={(v) => onChange('adv_cartoes_vermelhos', v)} />
        </div>
      </div>

      {/* Outros */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Outros</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumberField label="Escanteios" value={state.adv_escanteios} onChange={(v) => onChange('adv_escanteios', v)} />
          <NumberField label="Impedimentos" value={state.adv_impedimentos} onChange={(v) => onChange('adv_impedimentos', v)} />
        </div>
      </div>
    </div>
  )
}
