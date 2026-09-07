'use client'

import { useParams } from 'next/navigation'
import { PranchetaEditor } from '@/components/prancheta/PranchetaEditor'

export default function EditarPranchetaPage() {
  const params = useParams()
  const id = params.id as string
  return <PranchetaEditor pranchetaId={id} />
}
