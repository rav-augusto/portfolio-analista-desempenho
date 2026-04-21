'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Usuario, UserContext } from '@/types/user'

export function useUser(): UserContext {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
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
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser()
      } else {
        setUser(null)
        setIsLoading(false)
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
