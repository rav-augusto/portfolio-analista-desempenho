'use client'

import { useParams } from 'next/navigation'
import { AnotacaoEditor } from '@/components/anotacoes/AnotacaoEditor'

export default function EditarAnotacaoPage() {
  const params = useParams()
  const id = params.id as string
  return <AnotacaoEditor anotacaoId={id} />
}
