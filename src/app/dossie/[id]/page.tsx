'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Página pública (sem login) que mostra o snapshot do dossiê salvo.
// O link é "não listado": só quem tem o UUID acessa.
export default function DossiePublicoPage() {
  const params = useParams()
  const id = params.id as string
  const [html, setHtml] = useState<string | null>(null)
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('dossies_publicos')
        .select('html')
        .eq('id', id)
        .single()
      if (error || !data) setErro(true)
      else setHtml((data as { html: string }).html)
      setCarregando(false)
    }
    load()
  }, [id])

  const imprimir = () => {
    const win = iframeRef.current?.contentWindow
    if (win) { win.focus(); win.print() }
  }

  if (carregando) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', color: '#94a3b8', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
          Carregando dossiê...
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    )
  }

  if (erro || !html) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
          <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Dossiê não encontrado</h1>
          <p style={{ fontSize: 14, color: '#94a3b8' }}>O link pode ter expirado ou estar incorreto. Peça um novo link ao responsável pela avaliação.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#334155' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(10,15,26,.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #1e293b' }}>
        <span style={{ color: '#f5a623', fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>Olhar da <span style={{ color: '#e2e8f0' }}>Base</span></span>
        <button
          onClick={imprimir}
          style={{ background: '#f5a623', color: '#20160a', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui, sans-serif' }}
        >
          🖨 Salvar / imprimir PDF
        </button>
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        title="Dossiê do atleta"
        style={{ width: '100%', height: 'calc(100dvh - 52px)', border: 'none', background: '#fff' }}
      />
    </div>
  )
}
