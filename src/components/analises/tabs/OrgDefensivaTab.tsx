'use client'

import { ScaleInput, SelectField, NumberField, TextareaField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
}

export function OrgDefensivaTab({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Configuracao Defensiva */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Configuracao Defensiva</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SelectField
            label="Bloco Defensivo"
            value={state.bloco_defensivo}
            onChange={(v) => onChange('bloco_defensivo', v)}
            options={[
              { value: 'alto', label: 'Alto' },
              { value: 'medio', label: 'Medio' },
              { value: 'baixo', label: 'Baixo' },
            ]}
          />
          <SelectField
            label="Tipo de Marcacao"
            value={state.marcacao_tipo}
            onChange={(v) => onChange('marcacao_tipo', v)}
            options={[
              { value: 'individual', label: 'Individual' },
              { value: 'zona', label: 'Zona' },
              { value: 'mista', label: 'Mista' },
            ]}
          />
          <SelectField
            label="Linha Defensiva"
            value={state.linha_defensiva_altura}
            onChange={(v) => onChange('linha_defensiva_altura', v)}
            options={[
              { value: 'alta', label: 'Alta' },
              { value: 'media', label: 'Media' },
              { value: 'baixa', label: 'Baixa' },
            ]}
          />
          <ScaleInput label="Compactacao" value={state.compactacao_bloco} onChange={(v) => onChange('compactacao_bloco', v)} />
        </div>
      </div>

      {/* Recuperacao de Bola */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Recuperacao de Bola</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Recuperacoes" value={state.recuperacoes_bola} onChange={(v) => onChange('recuperacoes_bola', v)} />
          <NumberField label="Recup. Terco Ofens." value={state.recuperacoes_terco_ofensivo} onChange={(v) => onChange('recuperacoes_terco_ofensivo', v)} />
          <NumberField label="Interceptacoes" value={state.interceptacoes} onChange={(v) => onChange('interceptacoes', v)} />
          <ScaleInput label="Pressao" value={state.pressao_intensidade} onChange={(v) => onChange('pressao_intensidade', v)} />
        </div>
      </div>

      {/* Desarmes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Desarmes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Desarmes Total" value={state.desarmes} onChange={(v) => onChange('desarmes', v)} />
          <NumberField label="Desarmes Certos" value={state.desarmes_certos} onChange={(v) => onChange('desarmes_certos', v)} />
          <NumberField label="Duelos Def. (%)" value={state.duelos_defensivos_pct} onChange={(v) => onChange('duelos_defensivos_pct', v)} max={100} />
        </div>
      </div>

      {/* Duelos */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Duelos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Duelos Total" value={state.duelos_total} onChange={(v) => onChange('duelos_total', v)} />
          <NumberField label="Duelos Ganhos" value={state.duelos_ganhos} onChange={(v) => onChange('duelos_ganhos', v)} />
          <NumberField label="Aereos Total" value={state.duelos_aereos_total} onChange={(v) => onChange('duelos_aereos_total', v)} />
          <NumberField label="Aereos Ganhos" value={state.duelos_aereos_ganhos} onChange={(v) => onChange('duelos_aereos_ganhos', v)} />
        </div>
      </div>

      {/* Disciplina */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Disciplina</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NumberField label="Faltas Cometidas" value={state.faltas_cometidas} onChange={(v) => onChange('faltas_cometidas', v)} />
          <NumberField label="Cartoes Amarelos" value={state.cartoes_amarelos} onChange={(v) => onChange('cartoes_amarelos', v)} />
          <NumberField label="Cartoes Vermelhos" value={state.cartoes_vermelhos} onChange={(v) => onChange('cartoes_vermelhos', v)} />
        </div>
      </div>

      <TextareaField
        label="Observacoes"
        value={state.org_defensiva_obs}
        onChange={(v) => onChange('org_defensiva_obs', v)}
        placeholder="Observacoes sobre a organizacao defensiva..."
      />
    </div>
  )
}
