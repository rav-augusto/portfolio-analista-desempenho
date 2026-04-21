import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify caller is authenticated and is master
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Check if user is master
    const { data: callerUser, error: callerError } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (callerError || callerUser?.role !== 'master') {
      return NextResponse.json({ error: 'Apenas master pode criar usuarios' }, { status: 403 })
    }

    const body = await request.json()
    const { email, nome, role, atleta_id } = body

    if (!email || !nome || !role) {
      return NextResponse.json({ error: 'Email, nome e role sao obrigatorios' }, { status: 400 })
    }

    // Check if email already exists in usuarios table
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Email ja cadastrado' }, { status: 400 })
    }

    // Check if user exists in auth.users (they may have signed up already)
    // We can't directly query auth.users, but we can try to invite/create

    // Option 1: If user already exists in auth, just create the usuarios record
    // Option 2: Use Supabase invite to send password setup email

    // For now, we'll use the Supabase invite user feature
    // This requires the service role, so we'll do a workaround:
    // Create a pending record that will be linked when the user signs up

    // Generate a temporary UUID for the pending user
    const tempId = crypto.randomUUID()

    // Insert into usuarios with a pending status
    // When the user signs up with this email, we'll link them via a trigger or login hook
    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: tempId,
        email: email.toLowerCase(),
        nome,
        role,
        atleta_id: atleta_id || null,
        ativo: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      return NextResponse.json({ error: 'Erro ao criar usuario: ' + insertError.message }, { status: 500 })
    }

    // Try to use Supabase magic link invite (if configured)
    // This will send an email to the user to set up their account
    try {
      const { error: inviteError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`
        }
      })

      if (inviteError) {
        console.log('Invite email could not be sent:', inviteError.message)
        // Not a fatal error - user can still sign up manually
      }
    } catch (e) {
      console.log('Could not send invite email')
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Usuario criado. Um email foi enviado para configurar a senha.'
    })
  } catch (error: any) {
    console.error('Error in POST /api/usuarios:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // Verify caller is authenticated and is master
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Check if user is master
    const { data: callerUser, error: callerError } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (callerError || callerUser?.role !== 'master') {
      return NextResponse.json({ error: 'Apenas master pode atualizar usuarios' }, { status: 403 })
    }

    const body = await request.json()
    const { id, nome, role, atleta_id, ativo } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do usuario e obrigatorio' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (nome !== undefined) updateData.nome = nome
    if (role !== undefined) updateData.role = role
    if (atleta_id !== undefined) updateData.atleta_id = atleta_id
    if (ativo !== undefined) updateData.ativo = ativo

    const { data: updatedUser, error: updateError } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Erro ao atualizar usuario' }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    console.error('Error in PATCH /api/usuarios:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
