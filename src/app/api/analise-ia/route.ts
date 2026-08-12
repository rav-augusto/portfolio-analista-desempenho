import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { montarPromptAnalise, SISTEMA_ANALISE, type DadosAnaliseIA } from '@/lib/stats/ia'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Análise por IA não configurada. Adicione a variável ANTHROPIC_API_KEY nas variáveis de ambiente da Vercel.' },
      { status: 503 }
    )
  }

  let dados: DadosAnaliseIA
  try {
    dados = (await req.json()) as DadosAnaliseIA
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }

  if (!dados?.nome) {
    return NextResponse.json({ error: 'Atleta sem dados suficientes para análise.' }, { status: 400 })
  }

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: SISTEMA_ANALISE,
      messages: [{ role: 'user', content: montarPromptAnalise(dados) }],
    })

    const texto = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim()

    if (!texto) {
      return NextResponse.json({ error: 'A IA não retornou uma análise. Tente novamente.' }, { status: 502 })
    }

    return NextResponse.json({ analise: texto })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao gerar análise.'
    return NextResponse.json({ error: `Falha na IA: ${msg}` }, { status: 502 })
  }
}
