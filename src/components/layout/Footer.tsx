'use client'

import { CircleDot } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark py-12">
      <div style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Logo e descrição */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
            <CircleDot className="w-7 h-7 text-accent" />
            <span>
              Augusto <span className="text-accent">Nunes</span>
            </span>
          </Link>
          <p className="text-gray-400">
            Analista de Desempenho | Categorias de Base
          </p>
        </div>

        {/* Quote */}
        <div className="text-center mb-8">
          <p className="text-accent italic text-lg">
            &quot;Coletar, Analisar, Filtrar, Gerar Conhecimento e Aplicar&quot;
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Augusto Nunes. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
