'use client'

import { GraduationCap, Target, Users } from 'lucide-react'
import Image from 'next/image'

export function SobreSection() {
  return (
    <section id="sobre" className="py-16 bg-gray-100">
      <div style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent mb-2">
            Quem sou
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-wider text-dark">
            SOBRE MIM
          </h2>
        </div>

        {/* Grid 1.5fr 1fr como original */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
          {/* Conteudo */}
          <div>
            <div className="mb-8">
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Analista de Desempenho formado pela <strong className="text-dark">Confederacao Brasileira de Futebol</strong>, com foco especializado em categorias de base.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Minha paixao pelo futebol vai alem das quatro linhas. Acredito que a analise de desempenho e fundamental para o desenvolvimento de jovens atletas, identificando talentos e potencializando suas caracteristicas individuais para o sucesso coletivo.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <GraduationCap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-dark">Formacao CBF</h4>
                  <p className="text-sm text-gray-500">Licenca B - Analise de Desempenho (2025)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-dark">Foco</h4>
                  <p className="text-sm text-gray-500">Categorias de Base (Sub-12 a Sub-17)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-dark">Objetivo</h4>
                  <p className="text-sm text-gray-500">Desenvolvimento integral do atleta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <div className="bg-white rounded-xl p-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src="/images/foto-augusto.png"
                  alt="Augusto Nunes - Analista de Desempenho"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Badge CBF */}
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center gap-1">
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-500">Certificado CBF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
