'use client'

import { SkillBar } from '@/components/ui'
import {
  Monitor,
  Video,
  LineChart,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Dumbbell,
  Footprints,
  Heart,
  Star,
  Shield,
  ArrowLeftRight,
  Flag
} from 'lucide-react'

const ferramentas = [
  { nome: 'OBS Studio', porcentagem: 90 },
  { nome: 'LongoMatch', porcentagem: 75 },
  { nome: 'DaVinci Resolve', porcentagem: 70 },
  { nome: 'Tactical-Board', porcentagem: 85 },
  { nome: 'Excel/Planilhas', porcentagem: 95 },
]

const momentos = [
  { nome: 'Org. Ofensiva', icone: TrendingUp },
  { nome: 'Org. Defensiva', icone: Shield },
  { nome: 'Transicao Ofensiva', icone: ArrowLeftRight },
  { nome: 'Transicao Defensiva', icone: ArrowLeftRight },
  { nome: 'Bolas Paradas', icone: Flag, full: true },
]

const dimensoes = [
  { nome: 'Forca', icone: Dumbbell },
  { nome: 'Velocidade', icone: Zap },
  { nome: 'Tecnica', icone: Footprints },
  { nome: 'Dinamica', icone: TrendingUp },
  { nome: 'Inteligencia', icone: Brain },
  { nome: '1x1', icone: Target },
  { nome: 'Atitude', icone: Heart },
  { nome: 'Potencial', icone: Star },
]

export function CompetenciasSection() {
  return (
    <section id="competencias" className="py-16 bg-gradient-to-br from-dark to-primary-dark">
      <div style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent mb-2">
            Habilidades
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-wider text-white">
            COMPETENCIAS TECNICAS
          </h2>
        </div>

        {/* Grid de 3 cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Card Ferramentas */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10 hover:-translate-y-1">
            <div className="w-[60px] h-[60px] rounded-lg bg-accent/20 flex items-center justify-center mb-6">
              <Monitor className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-6">Ferramentas</h3>
            <div className="space-y-4">
              {ferramentas.map(f => (
                <SkillBar key={f.nome} label={f.nome} percentage={f.porcentagem} />
              ))}
            </div>
          </div>

          {/* Card Analise de Jogo - Featured (verde) */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-6 transition-all hover:-translate-y-1">
            <div className="w-[60px] h-[60px] rounded-lg bg-accent/20 flex items-center justify-center mb-6">
              <Video className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-6">Analise de Jogo</h3>
            <div className="grid grid-cols-2 gap-3">
              {momentos.map(m => (
                <div
                  key={m.nome}
                  className={`bg-white/10 rounded-lg p-3 text-center ${m.full ? 'col-span-2' : ''}`}
                >
                  <m.icone className="w-5 h-5 text-white mx-auto mb-1" />
                  <span className="text-xs text-white/80">{m.nome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Metodologias */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10 hover:-translate-y-1">
            <div className="w-[60px] h-[60px] rounded-lg bg-accent/20 flex items-center justify-center mb-6">
              <LineChart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-6">Metodologias</h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border-l-[3px] border-accent rounded">
                <h4 className="text-white text-sm font-medium">Metodo PRAIA</h4>
                <p className="text-gray-400 text-xs">Planejar, Registrar, Analisar, Informar, Armazenar</p>
              </div>
              <div className="p-3 bg-white/5 border-l-[3px] border-accent rounded">
                <h4 className="text-white text-sm font-medium">Sistema CBF</h4>
                <p className="text-gray-400 text-xs">8 dimensoes de observacao padronizadas</p>
              </div>
              <div className="p-3 bg-white/5 border-l-[3px] border-accent rounded">
                <h4 className="text-white text-sm font-medium">PDI</h4>
                <p className="text-gray-400 text-xs">Plano de Desenvolvimento Individual</p>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Dimensoes CBF */}
        <div className="text-center">
          <h3 className="text-white text-xl mb-6">Sistema de Observacao CBF - 8 Dimensoes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dimensoes.map(d => (
              <div
                key={d.nome}
                className="bg-white/5 border border-white/10 rounded-lg p-4 transition-all hover:bg-accent/20 hover:border-accent hover:scale-105"
              >
                <d.icone className="w-6 h-6 text-accent mx-auto mb-2" />
                <span className="text-white text-sm font-medium">{d.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
