'use client'

import { NumberField, ScaleInput } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
}

export function DadosAvancadosTab({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Posse e Territorio */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Posse por Terco</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Terco Defensivo (%)" value={state.posse_terco_defensivo} onChange={(v) => onChange('posse_terco_defensivo', v)} max={100} />
          <NumberField label="Terco Medio (%)" value={state.posse_terco_medio} onChange={(v) => onChange('posse_terco_medio', v)} max={100} />
          <NumberField label="Terco Ofensivo (%)" value={state.posse_terco_ofensivo} onChange={(v) => onChange('posse_terco_ofensivo', v)} max={100} />
          <NumberField label="Campo Ofensivo (%)" value={state.campo_ofensivo_pct} onChange={(v) => onChange('campo_ofensivo_pct', v)} max={100} />
        </div>
      </div>

      {/* Intensidade GPS */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Intensidade (GPS)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumberField label="Distancia Total (km)" value={state.distancia_total} onChange={(v) => onChange('distancia_total', v)} max={200} />
          <NumberField label="Sprints" value={state.sprints} onChange={(v) => onChange('sprints', v)} />
          <NumberField label="Alta Intensidade (m)" value={state.alta_intensidade_metros} onChange={(v) => onChange('alta_intensidade_metros', v)} max={10000} />
        </div>
      </div>

      {/* Eficiencia */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Eficiencia</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="xG a Favor" value={state.xg_favor} onChange={(v) => onChange('xg_favor', v)} max={10} />
          <NumberField label="xG Contra" value={state.xg_contra} onChange={(v) => onChange('xg_contra', v)} max={10} />
          <NumberField label="PPDA" value={state.ppda} onChange={(v) => onChange('ppda', v)} max={50} />
          <NumberField label="Impedimentos" value={state.impedimentos} onChange={(v) => onChange('impedimentos', v)} />
        </div>
      </div>

      {/* Notas */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Notas e Indices</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ScaleInput label="Nota Geral" value={state.nota_geral} onChange={(v) => onChange('nota_geral', v)} />
          <ScaleInput label="Indice Ofensivo" value={state.indice_ofensivo} onChange={(v) => onChange('indice_ofensivo', v)} />
          <ScaleInput label="Indice Defensivo" value={state.indice_defensivo} onChange={(v) => onChange('indice_defensivo', v)} />
        </div>
      </div>
    </div>
  )
}
