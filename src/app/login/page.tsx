'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui'
import { CircleDot, LogIn, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-amber-500 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-amber-500 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center">
              <CircleDot className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">Olhar da Base</span>
              <span className="block text-sm text-slate-300">Performance Analysis</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Transformando dados em{' '}
            <span className="text-amber-500">vantagem competitiva</span>
          </h1>

          <p className="text-slate-300 text-lg">
            Plataforma de analise de desempenho para desenvolvimento de atletas de base.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <CircleDot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Olhar da Base</span>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl shadow-2xl p-8 lg:p-10" style={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>Bem-vindo de volta</h2>
              <p className="mt-1" style={{ color: '#cbd5e1' }}>Entre para acessar o painel admin</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#f59e0b' }}>Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#f1f5f9' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#f59e0b' }}>Senha</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#f1f5f9' }}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm text-center p-4 rounded-xl border border-red-500/30">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#f59e0b', color: '#0f172a' }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back Link */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-8 hover:text-white transition-colors"
            style={{ color: '#cbd5e1' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}
