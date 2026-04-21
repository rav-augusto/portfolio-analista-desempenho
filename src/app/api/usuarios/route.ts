import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
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
    const { email, nome, senha, role, atleta_id } = body

    if (!email || !nome || !role) {
      return NextResponse.json({ error: 'Email, nome e role sao obrigatorios' }, { status: 400 })
    }

    if (!senha || senha.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter no minimo 6 caracteres' }, { status: 400 })
    }

    // Check if email already exists in usuarios table
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Email ja cadastrado' }, { status: 400 })
    }

    // Create admin client with service role to create auth user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Configuracao do servidor incompleta' }, { status: 500 })
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Create the auth user with password
    const { data: authData, error: authCreateError } = await adminClient.auth.admin.createUser({
      email: email.toLowerCase(),
      password: senha,
      email_confirm: true // Auto-confirm email
    })

    if (authCreateError || !authData.user) {
      console.error('Error creating auth user:', authCreateError)
      return NextResponse.json({
        error: authCreateError?.message || 'Erro ao criar usuario de autenticacao'
      }, { status: 500 })
    }

    // Insert into usuarios table with the auth user's ID
    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        nome,
        role,
        atleta_id: atleta_id || null,
        ativo: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user record:', insertError)
      // Try to delete the auth user since we couldn't create the record
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: 'Erro ao criar registro do usuario' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Usuario criado com sucesso!'
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
