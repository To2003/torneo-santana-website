'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Vuelve a pedir los datos de la página actual cada cierto intervalo,
// para que los cambios en el Google Sheets aparezcan solos sin apretar F5
export function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs)
    return () => clearInterval(id)
  }, [router, intervalMs])

  return null
}
