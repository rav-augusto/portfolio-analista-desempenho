'use client'

import {
  ClipboardList,
  Video,
  BarChart3,
  MessageSquare,
  Database,
  Users,
  Eye,
  Target,
  Lightbulb
} from 'lucide-react'

const timelineItems = [
  { letra: 'P', titulo: 'Planejar', descricao: 'Definicao de objetivos, metricas e aspectos a serem observados antes de cada jogo ou treino.' },
  { letra: 'R', titulo: 'Registrar', descricao: 'Captacao de video com equipamentos adequados e anotacoes em tempo real dos eventos relevantes.' },
  { letra: 'A', titulo: 'Analisar', descricao: 'Revisao detalhada do material, identificacao de padroes, pontos fortes e aspectos a melhorar.' },
  { letra: 'I', titulo: 'Informar', descricao: 'Criacao de relatorios em video e apresentacoes para comissao tecnica e atletas.' },
  { letra: 'A', titulo: 'Armazenar', descricao: 'Organizacao e backup de todo material para consultas futuras e acompanhamento de evolucao.' },
]

const ofertas = [
  { titulo: 'Analise de Adversarios', descricao: 'Relatorios em video com padroes taticos, pontos fortes e vulnerabilidades (3-5 jogos)', icone: Eye },
  { titulo: 'Filmagem de Treinos', descricao: 'Registro e organizacao de sessoes para analise posterior e arquivo historico', icone: Video },
  { titulo: 'Feedback Individual', descricao: 'Compilados personalizados por atleta para acelerar a evolucao tecnico-tatica', icone: Users },
  { titulo: 'Suporte Tatico', descricao: 'Pranchas taticas e cortes de video para prelecoes e reunioes tecnicas', icone: Target },
]

export function MetodologiaSection() {
  return (
    <section id="metodologia" className="py-16 bg-gradient-to-br from-primary-dark to-dark">
      <div style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent mb-2">
            Como Trabalho
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-wider text-white">
            METODOLOGIA PRAIA
          </h2>
        </div>

        {/* Timeline PRAIA - Vertical como o original */}
        <div className="relative max-w-[800px] mx-auto mb-16">
          {/* Linha vertical */}
          <div className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-white/20" />

          <div className="space-y-8">
            {timelineItems.map((item, index) => (
              <div key={item.letra + index} className="flex gap-6 relative">
                {/* Icone */}
                <div className="w-[60px] h-[60px] rounded-full bg-accent flex items-center justify-center flex-shrink-0 z-10">
                  <span className="font-display text-2xl text-white">{item.letra}</span>
                </div>

                {/* Conteudo */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-white text-lg font-semibold mb-2">{item.titulo}</h3>
                  <p className="text-gray-400 text-sm">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* O que posso oferecer */}
        <div className="text-center">
          <h3 className="text-xl text-white mb-8">O que posso oferecer ao seu clube</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ofertas.map(oferta => (
              <div
                key={oferta.titulo}
                className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all hover:bg-white/10 hover:-translate-y-1"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <oferta.icone className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-white font-semibold mb-2">{oferta.titulo}</h4>
                <p className="text-gray-400 text-sm">{oferta.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
