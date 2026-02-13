import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ClubeEditForm } from './ClubeEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarClubePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: clube, error } = await supabase
    .from('clubes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !clube) {
    notFound()
  }

  return <ClubeEditForm clube={clube} />
}
