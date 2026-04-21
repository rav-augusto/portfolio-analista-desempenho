'use client'

import { ScaleInput, SelectField, NumberField, TextareaField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
  tipo: 'ofensiva' | 'defensiva'
}

export function TransicoesTab({ state, onChange, tipo }: Props) {
  if (tipo === 'ofensiva') {
    return (
      <div className="space-y-6">
        {/* Padrao de Transicao */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Padrao de Transicao</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SelectField
              label="Primeira Acao"
              value={state.primeira_acao_tipo}
              onChange={(v) => onChange('primeira_acao_tipo', v)}
              options={[
                { value: 'bola_longa', label: 'Bola Longa' },
                { value: 'conducao', label: 'Conducao' },
                { value: 'passe_curto', label: 'Passe Curto' },
                { value: 'diagonal', label: 'Diagonal' },
              ]}
            />
            <ScaleInput label="Velocidade" value={state.trans_ofensiva_velocidade} onChange={(v) => onChange('trans_ofensiva_velocidade', v)} />
            <ScaleInput label="Efetividade" value={state.trans_ofensiva_efetividade} onChange={(v) => onChange('trans_ofensiva_efetividade', v)} />
            <NumberField label="Jogadores Envolvidos" value={state.trans_ofensiva_jogadores} onChange={(v) => onChange('trans_ofensiva_jogadores', v)} max={11} />
          </div>
        </div>

        {/* Contra-Ataques */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Contra-Ataques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberField label="Criados" value={state.contra_ataques} onChange={(v) => onChange('contra_ataques', v)} />
            <NumberField label="Finalizados" value={state.contra_ataques_finalizados} onChange={(v) => onChange('contra_ataques_finalizados', v)} />
            <NumberField label="Gols" value={state.gols_contra_ataque} onChange={(v) => onChange('gols_contra_ataque', v)} />
          </div>
        </div>

        <TextareaField
          label="Observacoes"
          value={state.trans_ofensiva_obs}
          onChange={(v) => onChange('trans_ofensiva_obs', v)}
          placeholder="Observacoes sobre a transicao ofensiva..."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Padrao de Reacao */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Padrao de Reacao a Perda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SelectField
            label="Reacao a Perda"
            value={state.reacao_perda_tipo}
            onChange={(v) => onChange('reacao_perda_tipo', v)}
            options={[
              { value: 'pressao_imediata', label: 'Pressao Imediata' },
              { value: 'recuo_organizado', label: 'Recuo Organizado' },
              { value: 'mista', label: 'Mista' },
            ]}
          />
          <ScaleInput label="Velocidade Recomp." value={state.trans_defensiva_velocidade} onChange={(v) => onChange('trans_defensiva_velocidade', v)} />
          <NumberField label="Tempo Reacao (seg)" value={state.tempo_reacao_segundos} onChange={(v) => onChange('tempo_reacao_segundos', v)} max={30} />
        </div>
      </div>

      {/* Acoes Pos-Perda */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Acoes Pos-Perda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NumberField label="Acoes Total" value={state.acoes_pos_perda} onChange={(v) => onChange('acoes_pos_perda', v)} />
          <NumberField label="Acoes com Sucesso" value={state.acoes_pos_perda_sucesso} onChange={(v) => onChange('acoes_pos_perda_sucesso', v)} />
          <NumberField label="C.Ataques Sofridos" value={state.contra_ataques_sofridos} onChange={(v) => onChange('contra_ataques_sofridos', v)} />
          <NumberField label="Gols Sofr. C.Ataque" value={state.gols_sofridos_contra_ataque} onChange={(v) => onChange('gols_sofridos_contra_ataque', v)} />
        </div>
      </div>

      <TextareaField
        label="Observacoes"
        value={state.trans_defensiva_obs}
        onChange={(v) => onChange('trans_defensiva_obs', v)}
        placeholder="Observacoes sobre a transicao defensiva..."
      />
    </div>
  )
}
