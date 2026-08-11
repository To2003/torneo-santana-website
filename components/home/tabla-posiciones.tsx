'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TablaSimple } from '@/components/shared/tabla-simple'
import type { Posicion } from '@/lib/types'

interface TablaPosicionesProps {
  general: Posicion[]
  torneoA: Posicion[]
  torneoB: Posicion[]
  className?: string
}

export function TablaPosiciones({ general, torneoA, torneoB, className }: TablaPosicionesProps) {
  const [vistaGeneral, setVistaGeneral] = useState(false)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setVistaGeneral((v) => !v)}
          className="rounded-lg bg-[#1f4e78] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1f4e78]/90"
        >
          {vistaGeneral ? 'Ver por Torneo' : 'Ver Tabla General'}
        </button>
      </div>

      {vistaGeneral ? (
        <TablaSimple titulo="Tabla General" posiciones={general} />
      ) : (
        <div className="space-y-4">
          <TablaSimple titulo="Torneo A" posiciones={torneoA} />
          <TablaSimple titulo="Torneo B" posiciones={torneoB} />
        </div>
      )}
    </div>
  )
}
