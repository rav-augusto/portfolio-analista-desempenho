'use client'

import { cn } from '@/lib/utils/cn'
import { CircleDot, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#competencias', label: 'Competencias' },
  { href: '#analises', label: 'Analises' },
  { href: '#metodologia', label: 'Metodologia' },
  { href: '#contato', label: 'Contato' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Detectar seção ativa
      const sections = navLinks.map(link => link.href.replace('#', ''))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar menu ao clicar em link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled && 'bg-dark/95 backdrop-blur-sm shadow-md'
      )}
    >
      <div className="flex items-center justify-between" style={{ width: '100%', maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <CircleDot className="w-7 h-7 text-accent" />
          <span>
            Augusto <span className="text-accent">Nunes</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-white font-medium relative py-2 transition-colors',
                  'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all',
                  'hover:after:w-full',
                  activeSection === link.href.replace('#', '') && 'after:w-full'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            'fixed top-0 right-0 w-4/5 h-screen bg-dark-light transform transition-transform duration-300 md:hidden',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col pt-20 px-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  'text-white text-lg font-medium py-4 border-b border-white/10 transition-colors',
                  'hover:text-accent',
                  activeSection === link.href.replace('#', '') && 'text-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
