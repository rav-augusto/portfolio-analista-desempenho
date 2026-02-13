'use client'

import { Button } from '@/components/ui'
import { ChevronDown, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-dark/90" />

      {/* Conteudo */}
      <div className="relative z-10 text-center" style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Titulo */}
        <h1 className="font-display text-[clamp(3rem,10vw,6rem)] text-white tracking-wider leading-tight animate-fade-in-down">
          ANALISTA DE{' '}
          <span className="relative inline-block">
            DESEMPENHO
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent" />
          </span>
        </h1>

        {/* Subtitulo */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mt-6 animate-fade-in-up delay-200">
          Transformando dados em vantagem competitiva para o desenvolvimento de atletas de base
        </p>

        {/* Botoes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up delay-400">
          <Button size="lg" onClick={() => document.getElementById('analises')?.scrollIntoView({ behavior: 'smooth' })}>
            Ver Analises
          </Button>
          <Button variant="secondary" size="lg" onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}>
            Contato
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 justify-center mt-16 animate-fade-in-up delay-600">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <div className="text-left">
              <span className="block text-3xl font-bold text-accent">4</span>
              <span className="text-gray-400 text-sm">Momentos do Jogo</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-accent" />
            <div className="text-left">
              <span className="block text-3xl font-bold text-accent">8</span>
              <span className="text-gray-400 text-sm">Dimensoes CBF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/50" />
      </div>
    </section>
  )
}
