export type UserRole = 'master' | 'analista' | 'atleta'

export type Usuario = {
  id: string
  email: string
  nome: string
  role: UserRole
  atleta_id: string | null
  ativo: boolean
  created_at: string
  updated_at?: string
  // Relacionamento opcional
  atleta?: {
    id: string
    nome: string
    foto_url: string | null
    posicao: string | null
    clube?: {
      nome: string
    } | null
  } | null
}

export type UserContext = {
  user: Usuario | null
  isLoading: boolean
  error: Error | null
  // Role checks
  isMaster: boolean
  isAnalista: boolean
  isAtleta: boolean
  // Permission helpers
  canCreate: boolean
  canEdit: (criadoPor: string | null | undefined) => boolean
  canDelete: (criadoPor: string | null | undefined) => boolean
  canManageUsers: boolean
  // Refresh function
  refresh: () => Promise<void>
}

export type CreateUsuarioInput = {
  email: string
  nome: string
  role: UserRole
  atleta_id?: string | null
}

export type UpdateUsuarioInput = {
  nome?: string
  role?: UserRole
  atleta_id?: string | null
  ativo?: boolean
}
