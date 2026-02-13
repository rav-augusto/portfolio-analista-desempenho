'use client'

import { Button } from '@/components/ui'
import { Mail, Phone, Send } from 'lucide-react'

export function ContatoSection() {
  return (
    <section id="contato" className="py-16 bg-gray-100">
      <div style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent mb-2">
            Vamos conversar
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-wider text-dark">
            ENTRE EM CONTATO
          </h2>
        </div>

        {/* Grid 2 colunas */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <div>
            <h3 className="text-2xl font-semibold text-dark mb-4">
              Vamos trabalhar juntos
            </h3>
            <p className="text-gray-600 mb-8">
              Estou disponivel para novos projetos de analise de desempenho, com flexibilidade
              de horarios para atender as necessidades do seu clube.
            </p>

            {/* Itens de contato */}
            <div className="space-y-4">
              <a
                href="mailto:rav.augusto@gmail.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-[50px] h-[50px] rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Email</span>
                  <span className="text-dark font-medium group-hover:text-primary transition-colors">rav.augusto@gmail.com</span>
                </div>
              </a>

              <a
                href="tel:+5543991127447"
                className="flex items-center gap-4 group"
              >
                <div className="w-[50px] h-[50px] rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Telefone</span>
                  <span className="text-dark font-medium group-hover:text-primary transition-colors">(43) 9 9112-7447</span>
                </div>
              </a>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-10 text-center text-white">
            <div className="text-5xl mb-6 opacity-80">
              <Send className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Pronto para contribuir!
            </h3>
            <p className="opacity-90 mb-8">
              Busco uma oportunidade de aprendizado e contribuicao mutua.
              Vamos transformar dados em resultados juntos.
            </p>
            <a
              href="mailto:rav.augusto@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-accent hover:text-white transition-colors"
            >
              <Send className="w-5 h-5" />
              Enviar Mensagem
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
