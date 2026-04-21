'use client'

import { Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react'
import { Print } from '@/types/analise'

const momentos = [
  { value: 'ofensiva', label: 'Organizacao Ofensiva' },
  { value: 'defensiva', label: 'Organizacao Defensiva' },
  { value: 'transicao', label: 'Transicao' },
  { value: 'bola_parada', label: 'Bola Parada' },
]

type Props = {
  prints: Print[]
  uploadingPrint: boolean
  newPrintDescricao: string
  newPrintMomento: string
  newPrintTempo: string
  onDescricaoChange: (value: string) => void
  onMomentoChange: (value: string) => void
  onTempoChange: (value: string) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: (print: Print) => void
}

export function PrintsTaticosTab({
  prints,
  uploadingPrint,
  newPrintDescricao,
  newPrintMomento,
  newPrintTempo,
  onDescricaoChange,
  onMomentoChange,
  onTempoChange,
  onUpload,
  onDelete,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="border border-dashed border-slate-600 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-slate-100 mb-4">Adicionar Print Tatico</h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">Momento do Jogo</label>
            <select
              value={newPrintMomento}
              onChange={(e) => onMomentoChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
            >
              <option value="">Selecione</option>
              {momentos.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">Tempo (ex: 32&apos;)</label>
            <input
              type="text"
              value={newPrintTempo}
              onChange={(e) => onTempoChange(e.target.value)}
              placeholder="Ex: 15', 45+2'"
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">Descricao</label>
            <input
              type="text"
              value={newPrintDescricao}
              onChange={(e) => onDescricaoChange(e.target.value)}
              placeholder="Ex: Saida de bola com 3 jogadores"
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ backgroundColor: '#0f172a', border: '1px solid #475569', color: '#e2e8f0' }}
            />
          </div>
        </div>
        <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl py-4 transition-colors">
          {uploadingPrint ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          ) : (
            <Upload className="w-5 h-5 text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-300">
            {uploadingPrint ? 'Enviando...' : 'Clique para enviar imagem'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            disabled={uploadingPrint}
            className="hidden"
          />
        </label>
      </div>

      {/* Prints List */}
      {prints.length === 0 ? (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">Nenhum print adicionado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {prints.map((print) => (
            <div key={print.id} className="border border-slate-700 rounded-xl overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={print.imagem_url}
                  alt={print.descricao || 'Print tatico'}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onDelete(print)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {print.momento && (
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
                      {momentos.find(m => m.value === print.momento)?.label || print.momento}
                    </span>
                  )}
                  {print.tempo_jogo && (
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                      {print.tempo_jogo}
                    </span>
                  )}
                </div>
                {print.descricao && (
                  <p className="text-sm text-slate-300">{print.descricao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
