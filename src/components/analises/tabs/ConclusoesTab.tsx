'use client'

import { TextareaField } from '@/components/forms'
import { AnaliseState } from '@/types/analise'

type Props = {
  state: AnaliseState
  onChange: (field: keyof AnaliseState, value: string | number) => void
}

export function ConclusoesTab({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Pontos Fortes e Fracos */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Avaliacao Geral</h3>
        <div className="grid grid-cols-2 gap-4">
          <TextareaField
            label="Pontos Fortes"
            value={state.pontos_fortes}
            onChange={(v) => onChange('pontos_fortes', v)}
            placeholder="O que a equipe fez bem..."
            labelColor="text-green-500"
          />
          <TextareaField
            label="Pontos Fracos"
            value={state.pontos_fracos}
            onChange={(v) => onChange('pontos_fracos', v)}
            placeholder="O que precisa melhorar..."
            labelColor="text-red-500"
          />
        </div>
      </div>

      {/* Jogadores Destaque */}
      <TextareaField
        label="Jogadores Destaque"
        value={state.jogadores_destaque}
        onChange={(v) => onChange('jogadores_destaque', v)}
        placeholder="Jogadores que se destacaram positiva ou negativamente..."
        rows={2}
      />

      {/* Conclusoes */}
      <TextareaField
        label="Conclusoes da Analise"
        value={state.conclusoes}
        onChange={(v) => onChange('conclusoes', v)}
        placeholder="Principais pontos observados na partida..."
        rows={4}
      />

      {/* Recomendacoes */}
      <TextareaField
        label="Recomendacoes para Treino"
        value={state.recomendacoes_treino}
        onChange={(v) => onChange('recomendacoes_treino', v)}
        placeholder="Aspectos a trabalhar nos proximos treinos..."
        rows={4}
      />
    </div>
  )
}
