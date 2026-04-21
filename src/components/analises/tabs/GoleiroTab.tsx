'use client'

import { NumberField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
}

export function GoleiroTab({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Defesas */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Defesas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Defesas Total" value={state.defesas_total} onChange={(v) => onChange('defesas_total', v)} />
          <NumberField label="Defesas Dificeis" value={state.defesas_dificeis} onChange={(v) => onChange('defesas_dificeis', v)} />
          <NumberField label="Saidas do Gol" value={state.saidas_gol} onChange={(v) => onChange('saidas_gol', v)} />
        </div>
      </div>

      {/* Passes do GK */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Passes do Goleiro</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Passes Total" value={state.passes_gk_total} onChange={(v) => onChange('passes_gk_total', v)} />
          <NumberField label="Passes Certos" value={state.passes_gk_certos} onChange={(v) => onChange('passes_gk_certos', v)} />
        </div>
      </div>
    </div>
  )
}
