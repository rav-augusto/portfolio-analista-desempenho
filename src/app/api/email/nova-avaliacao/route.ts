import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify caller is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { atleta_id, avaliacao_id } = body

    if (!atleta_id || !avaliacao_id) {
      return NextResponse.json({ error: 'atleta_id e avaliacao_id sao obrigatorios' }, { status: 400 })
    }

    // Get athlete data with email
    const { data: atleta, error: atletaError } = await supabase
      .from('atletas')
      .select('id, nome, email, clubes(nome)')
      .eq('id', atleta_id)
      .single()

    if (atletaError || !atleta) {
      return NextResponse.json({ error: 'Atleta nao encontrado' }, { status: 404 })
    }

    // Check if athlete has email
    if (!atleta.email) {
      return NextResponse.json({
        success: false,
        message: 'Atleta nao possui email cadastrado',
        skipped: true
      })
    }

    // Get evaluation data
    const { data: avaliacao, error: avalError } = await supabase
      .from('avaliacoes_atleta')
      .select('*, jogos(adversario, data_jogo)')
      .eq('id', avaliacao_id)
      .single()

    if (avalError || !avaliacao) {
      return NextResponse.json({ error: 'Avaliacao nao encontrada' }, { status: 404 })
    }

    // Calculate average scores
    const mediaCBF = (
      (avaliacao.forca || 0) +
      (avaliacao.velocidade || 0) +
      (avaliacao.tecnica || 0) +
      (avaliacao.dinamica || 0) +
      (avaliacao.inteligencia || 0) +
      (avaliacao.um_contra_um || 0) +
      (avaliacao.atitude || 0) +
      (avaliacao.potencial || 0)
    ) / 8

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured, skipping email')
      return NextResponse.json({
        success: false,
        message: 'Servico de email nao configurado',
        skipped: true
      })
    }

    // Format date
    const dataAvaliacao = new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    // Build email content
    const clubeNome = atleta.clubes ? (atleta.clubes as any).nome : 'Seu clube'
    const jogoInfo = avaliacao.jogos
      ? `Jogo: vs ${(avaliacao.jogos as any).adversario}`
      : `Tipo: ${avaliacao.tipo}`

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
    <!-- Header -->
    <div style="background-color: #f59e0b; padding: 24px; text-align: center;">
      <h1 style="color: #0f172a; margin: 0; font-size: 24px;">Olhar da Base</h1>
      <p style="color: #0f172a; margin: 8px 0 0 0; opacity: 0.8;">Nova Avaliacao Disponivel</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 24px 0;">
        Ola <strong>${atleta.nome}</strong>,
      </p>

      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px 0;">
        Uma nova avaliacao foi registrada para voce pelo time tecnico do <strong style="color: #f59e0b;">${clubeNome}</strong>.
      </p>

      <!-- Evaluation Card -->
      <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #334155;">
        <p style="color: #f59e0b; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 1px;">
          Avaliacao
        </p>
        <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 4px 0;">
          ${dataAvaliacao}
        </p>
        <p style="color: #64748b; font-size: 14px; margin: 0;">
          ${jogoInfo}
        </p>
      </div>

      <!-- Score -->
      <div style="text-align: center; margin-bottom: 24px;">
        <p style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">
          Media Geral CBF
        </p>
        <p style="color: #f59e0b; font-size: 48px; font-weight: bold; margin: 0;">
          ${mediaCBF.toFixed(1)}
        </p>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">
          de 5.0
        </p>
      </div>

      ${avaliacao.pontos_fortes ? `
      <div style="background-color: #166534; background-opacity: 0.2; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="color: #4ade80; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">
          Pontos Fortes
        </p>
        <p style="color: #e2e8f0; font-size: 14px; margin: 0;">
          ${avaliacao.pontos_fortes}
        </p>
      </div>
      ` : ''}

      ${avaliacao.pontos_desenvolver ? `
      <div style="background-color: #854d0e; background-opacity: 0.2; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <p style="color: #fbbf24; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">
          Pontos a Desenvolver
        </p>
        <p style="color: #e2e8f0; font-size: 14px; margin: 0;">
          ${avaliacao.pontos_desenvolver}
        </p>
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px 0;">
          Acesse o portal para ver todos os detalhes da sua avaliacao.
        </p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/portal" style="display: inline-block; background-color: #f59e0b; color: #0f172a; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Ver Avaliacao Completa
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        Este email foi enviado automaticamente pelo sistema Olhar da Base.
      </p>
    </div>
  </div>
</body>
</html>
`

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Olhar da Base <noreply@resend.dev>',
        to: atleta.email,
        subject: `Nova Avaliacao - ${dataAvaliacao}`,
        html: emailHtml
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return NextResponse.json({
        success: false,
        message: 'Erro ao enviar email',
        error: errorData
      }, { status: 500 })
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso',
      email_id: result.id
    })
  } catch (error: any) {
    console.error('Error in POST /api/email/nova-avaliacao:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
