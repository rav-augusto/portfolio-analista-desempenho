'use client'

import { useParams } from 'next/navigation'
import { ComissaoForm } from '@/components/comissao/ComissaoForm'

export default function EditarMembroComissaoPage() {
  const params = useParams()
  const id = params.id as string
  return <ComissaoForm membroId={id} />
}
