import type { Indice } from '@/lib/stats/indices'
import { classificarIndice } from '@/lib/stats/indices'

type Props = {
  titulo: string
  subtitulo?: string
  indice: Indice
  cor: string // cor principal (hex)
}

// Card de índice composto (0-100) com anel + quebra por componente.
// Transparente: sempre mostra as partes e os pesos renormalizados.
export function IndiceCard({ titulo, subtitulo, indice, cor }: Props) {
  const raio = 34
  const circ = 2 * Math.PI * raio
  const dash = indice.disponivel ? (indice.valor / 100) * circ : 0

  const dispon = indice.componentes.filter(c => c.disponivel)
  const somaPesos = dispon.reduce((a, c) => a + c.peso, 0) || 1

  return (
    <div className="rounded-xl p-3 md:p-4" style={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}>
      <div className="flex items-center gap-3 md:gap-4">
        {/* Anel */}
        <div className="relative flex-shrink-0" style={{ width: 84, height: 84 }}>
          <svg className="-rotate-90" width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r={raio} stroke="#1e293b" strokeWidth="7" fill="none" />
            {indice.disponivel && (
              <circle
                cx="42"
                cy="42"
                r={raio}
                stroke={cor}
                strokeWidth="7"
                fill="none"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-black" style={{ color: indice.disponivel ? cor : '#64748b' }}>
              {indice.disponivel ? indice.valor : '—'}
            </span>
            <span className="text-[8px] md:text-[9px] text-slate-500">/ 100</span>
          </div>
        </div>

        {/* Título + classificação + componentes */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-sm md:text-base font-semibold text-slate-100">{titulo}</h4>
            {indice.disponivel && (
              <span className="text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${cor}22`, color: cor }}>
                {classificarIndice(indice.valor)}
              </span>
            )}
          </div>
          {subtitulo && <p className="text-[10px] md:text-xs text-slate-500 mb-2">{subtitulo}</p>}

          {indice.disponivel ? (
            <div className="space-y-1.5 mt-1">
              {dispon.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className="text-[10px] md:text-[11px] text-slate-400 w-28 md:w-36 flex-shrink-0 truncate" title={c.detalhe}>{c.label}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: cor, opacity: 0.85 }} />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-semibold text-slate-300 w-8 text-right">{Math.round(c.score)}</span>
                  <span className="text-[9px] text-slate-600 w-8 text-right hidden sm:inline">{Math.round((c.peso / somaPesos) * 100)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 mt-1">Dados insuficientes para calcular ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}
