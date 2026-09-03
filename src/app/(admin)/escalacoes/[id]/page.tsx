'use client'

import { useParams } from 'next/navigation'
import { EscalacaoEditor } from '@/components/escalacao/EscalacaoEditor'

export default function EditarEscalacaoPage() {
  const params = useParams()
  const id = params.id as string
  return <EscalacaoEditor escalacaoId={id} />
}
