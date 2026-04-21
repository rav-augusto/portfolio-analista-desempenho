'use client'

import { ScaleInput, SelectField, NumberField, TextareaField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

const sistemasTaticos = ['3-5-2', '4-3-3', '4-4-2', '4-2-3-1', '4-1-4-1', '3-4-3', '5-3-2', '5-4-1']

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
}

export function OrgOfensivaTab({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Configuracao Tatica */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Configuracao Tatica</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SelectField
            label="Sistema Tatico"
            value={state.sistema_tatico}
            onChange={(v) => onChange('sistema_tatico', v)}
            options={sistemasTaticos.map(s => ({ value: s, label: s }))}
          />
          <SelectField
            label="Saida de Bola"
            value={state.saida_bola_tipo}
            onChange={(v) => onChange('saida_bola_tipo', v)}
            options={[
              { value: 'curta', label: 'Curta' },
              { value: 'longa', label: 'Longa' },
              { value: 'mista', label: 'Mista' },
            ]}
          />
          <SelectField
            label="Lado Preferencial"
            value={state.lado_preferencial}
            onChange={(v) => onChange('lado_preferencial', v)}
            options={[
              { value: 'central', label: 'Central' },
              { value: 'direita', label: 'Direita' },
              { value: 'esquerda', label: 'Esquerda' },
              { value: 'equilibrado', label: 'Equilibrado' },
            ]}
          />
          <NumberField label="Posse de Bola (%)" value={state.posse_bola} onChange={(v) => onChange('posse_bola', v)} max={100} />
        </div>
      </div>

      {/* Finalizacoes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Finalizacoes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <NumberField label="Total" value={state.finalizacoes_total} onChange={(v) => onChange('finalizacoes_total', v)} />
          <NumberField label="No Gol" value={state.finalizacoes_gol} onChange={(v) => onChange('finalizacoes_gol', v)} />
          <NumberField label="Fora" value={state.finalizacoes_fora} onChange={(v) => onChange('finalizacoes_fora', v)} />
          <NumberField label="Bloqueadas" value={state.finalizacoes_bloqueadas} onChange={(v) => onChange('finalizacoes_bloqueadas', v)} />
          <NumberField label="Dentro Area" value={state.finalizacoes_dentro_area} onChange={(v) => onChange('finalizacoes_dentro_area', v)} />
          <NumberField label="Fora Area" value={state.finalizacoes_fora_area} onChange={(v) => onChange('finalizacoes_fora_area', v)} />
        </div>
      </div>

      {/* Chances */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Chances Criadas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Grandes Chances" value={state.grandes_chances} onChange={(v) => onChange('grandes_chances', v)} />
          <NumberField label="Chances Perdidas" value={state.grandes_chances_perdidas} onChange={(v) => onChange('grandes_chances_perdidas', v)} />
          <NumberField label="Entradas na Area" value={state.entradas_area} onChange={(v) => onChange('entradas_area', v)} />
          <ScaleInput label="Qualidade Criacao" value={state.qualidade_criacao} onChange={(v) => onChange('qualidade_criacao', v)} />
        </div>
      </div>

      {/* Passes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Passes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <NumberField label="Total" value={state.passes_total} onChange={(v) => onChange('passes_total', v)} />
          <NumberField label="Certos" value={state.passes_certos} onChange={(v) => onChange('passes_certos', v)} />
          <NumberField label="Terco Final" value={state.passes_terco_final} onChange={(v) => onChange('passes_terco_final', v)} />
          <NumberField label="Progressivos" value={state.passes_progressivos} onChange={(v) => onChange('passes_progressivos', v)} />
          <NumberField label="Cruzamentos" value={state.cruzamentos_total} onChange={(v) => onChange('cruzamentos_total', v)} />
          <NumberField label="Cruzam. Certos" value={state.cruzamentos_certos} onChange={(v) => onChange('cruzamentos_certos', v)} />
        </div>
      </div>

      {/* Conducoes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Conducao e Progressao</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumberField label="Conducoes Progressivas" value={state.conducoes_progressivas} onChange={(v) => onChange('conducoes_progressivas', v)} />
          <SelectField
            label="Participacao GK"
            value={state.participacao_gk_nivel}
            onChange={(v) => onChange('participacao_gk_nivel', v)}
            options={[
              { value: 'alta', label: 'Alta' },
              { value: 'media', label: 'Media' },
              { value: 'baixa', label: 'Baixa' },
            ]}
          />
        </div>
      </div>

      <TextareaField
        label="Observacoes"
        value={state.org_ofensiva_obs}
        onChange={(v) => onChange('org_ofensiva_obs', v)}
        placeholder="Observacoes sobre a organizacao ofensiva..."
      />
    </div>
  )
}
