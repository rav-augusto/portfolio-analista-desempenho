'use client'

import { ScaleInput, SelectField, NumberField, TextareaField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
  tipo: 'ofensiva' | 'defensiva'
}

export function BolasParadasTab({ state, onChange, tipo }: Props) {
  if (tipo === 'ofensiva') {
    return (
      <div className="space-y-6">
        {/* Escanteios */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Escanteios</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <NumberField label="Total" value={state.escanteios_total} onChange={(v) => onChange('escanteios_total', v)} />
            <NumberField label="Perigosos" value={state.escanteios_perigosos} onChange={(v) => onChange('escanteios_perigosos', v)} />
            <NumberField label="Curtos" value={state.escanteios_curto} onChange={(v) => onChange('escanteios_curto', v)} />
            <NumberField label="Longos" value={state.escanteios_longo} onChange={(v) => onChange('escanteios_longo', v)} />
            <SelectField
              label="Tipo Cobranca"
              value={state.escanteio_tipo_cobranca}
              onChange={(v) => onChange('escanteio_tipo_cobranca', v)}
              options={[
                { value: 'fechado', label: 'Fechado' },
                { value: 'aberto', label: 'Aberto' },
                { value: 'rasteiro', label: 'Rasteiro' },
                { value: 'curto', label: 'Curto' },
              ]}
            />
          </div>
        </div>

        {/* Faltas */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Faltas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberField label="Faltas na Area" value={state.faltas_area} onChange={(v) => onChange('faltas_area', v)} />
            <NumberField label="Faltas Diretas" value={state.faltas_diretas} onChange={(v) => onChange('faltas_diretas', v)} />
            <NumberField label="Faltas Cruzadas" value={state.faltas_cruzadas} onChange={(v) => onChange('faltas_cruzadas', v)} />
          </div>
        </div>

        {/* Penaltis e Laterais */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Penaltis e Laterais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberField label="Penaltis a Favor" value={state.penaltis_favor} onChange={(v) => onChange('penaltis_favor', v)} />
            <NumberField label="Penaltis Convertidos" value={state.penaltis_convertidos} onChange={(v) => onChange('penaltis_convertidos', v)} />
            <NumberField label="Laterais Total" value={state.laterais_total} onChange={(v) => onChange('laterais_total', v)} />
            <NumberField label="Laterais Ofensivos" value={state.laterais_ofensivos} onChange={(v) => onChange('laterais_ofensivos', v)} />
          </div>
        </div>

        {/* Resultado */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Resultado</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Gols de Bola Parada" value={state.gols_bola_parada} onChange={(v) => onChange('gols_bola_parada', v)} />
          </div>
        </div>

        <TextareaField
          label="Observacoes"
          value={state.bp_ofensiva_obs}
          onChange={(v) => onChange('bp_ofensiva_obs', v)}
          placeholder="Observacoes sobre bolas paradas ofensivas..."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Marcacao em BP */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Marcacao em Bola Parada</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SelectField
            label="Tipo de Marcacao"
            value={state.bp_def_marcacao_tipo}
            onChange={(v) => onChange('bp_def_marcacao_tipo', v)}
            options={[
              { value: 'individual', label: 'Individual' },
              { value: 'zona', label: 'Zona' },
              { value: 'mista', label: 'Mista' },
            ]}
          />
          <ScaleInput label="Solidez" value={state.bp_def_solidez} onChange={(v) => onChange('bp_def_solidez', v)} />
          <NumberField label="Gols Sofridos BP" value={state.gols_sofridos_bp} onChange={(v) => onChange('gols_sofridos_bp', v)} />
        </div>
      </div>

      {/* Estatisticas */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Estatisticas Defensivas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Escanteios Contra" value={state.escanteios_contra} onChange={(v) => onChange('escanteios_contra', v)} />
          <NumberField label="Faltas Contra Area" value={state.faltas_contra_area} onChange={(v) => onChange('faltas_contra_area', v)} />
          <NumberField label="Penaltis Contra" value={state.penaltis_contra} onChange={(v) => onChange('penaltis_contra', v)} />
          <NumberField label="Penaltis Defendidos" value={state.penaltis_defendidos} onChange={(v) => onChange('penaltis_defendidos', v)} />
        </div>
      </div>

      <TextareaField
        label="Observacoes"
        value={state.bp_defensiva_obs}
        onChange={(v) => onChange('bp_defensiva_obs', v)}
        placeholder="Observacoes sobre bolas paradas defensivas..."
      />
    </div>
  )
}
