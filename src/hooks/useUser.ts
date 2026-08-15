'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Usuario, UserContext } from '@/types/user'

export function useUser(): UserContext {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  // Marca se já fizemos a 1ª carga. Recargas em segundo plano (ex.: token renovado
  // ao voltar o foco da aba) NÃO devem mexer no isLoading — senão o layout troca a
  // página por um spinner e remonta tudo, zerando formulários que o usuário preencheu.
  const initialisedRef = useRef(false)

  const fetchUser = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      setError(null)

      const supabase = createClient()

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!authUser) {
        setUser(null)
        return
      }

      // Get user from usuarios table with related atleta data
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select(`
          *,
          atleta:atletas(
            id,
            nome,
            foto_url,
            posicao,
            clube:clubes(nome)
          )
        `)
        .eq('id', authUser.id)
        .single()

      if (userError) {
        // User not in usuarios table - might be first login
        // Create default user record as analista
        if (userError.code === 'PGRST116') {
          const { data: newUser, error: insertError } = await supabase
            .from('usuarios')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              nome: authUser.email!.split('@')[0],
              role: 'analista',
              ativo: true
            })
            .select()
            .single()

          if (insertError) {
            // If insert fails, it's probably RLS - user doesn't have permission
            // Set a minimal user object based on auth
            setUser({
              id: authUser.id,
              email: authUser.email!,
              nome: authUser.email!.split('@')[0],
              role: 'analista',
              atleta_id: null,
              ativo: true,
              created_at: new Date().toISOString()
            })
            return
          }

          setUser(newUser)
          return
        }

        throw userError
      }

      setUser(usuario)
    } catch (err) {
      console.error('Error fetching user:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch user'))
    } finally {
      if (!silent) setIsLoading(false)
      initialisedRef.current = true
    }
  }, [])

  useEffect(() => {
    fetchUser()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Logout: limpa. Qualquer outro evento sem sessão também.
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        setIsLoading(false)
        return
      }
      // Login real antes de termos carregado o usuário: recarrega em segundo plano.
      // IMPORTANTE: ignoramos TOKEN_REFRESHED / USER_UPDATED / INITIAL_SESSION —
      // esses disparam ao voltar o foco da aba e não devem recarregar/remontar a página.
      if (event === 'SIGNED_IN' && !initialisedRef.current) {
        fetchUser(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser])

  // Role checks
  const isMaster = user?.role === 'master'
  const isAnalista = user?.role === 'analista'
  const isAtleta = user?.role === 'atleta'

  // Permission helpers
  const canCreate = isMaster || isAnalista
  const canManageUsers = isMaster

  const canEdit = useCallback((criadoPor: string | null | undefined): boolean => {
    if (!user) return false
    if (isMaster) return true
    if (isAtleta) return false
    return criadoPor === user.id
  }, [user, isMaster, isAtleta])

  const canDelete = useCallback((criadoPor: string | null | undefined): boolean => {
    if (!user) return false
    if (isMaster) return true
    if (isAtleta) return false
    return criadoPor === user.id
  }, [user, isMaster, isAtleta])

  return {
    user,
    isLoading,
    error,
    isMaster,
    isAnalista,
    isAtleta,
    canCreate,
    canEdit,
    canDelete,
    canManageUsers,
    refresh: fetchUser
  }
}
