'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TablaSimple, ProximamenteCard } from '@/components/shared/tabla-simple'
import type { Posicion, HabilitacionTorneos } from '@/lib/types'

interface TablasTabsProps {
  zona1: Posicion[]
  zona2: Posicion[]
  copaDeOro: Posicion[]
  copaDePlata: Posicion[]
  playoff: Posicion[]
  habilitacion: HabilitacionTorneos
}

const PESTANAS = [
  { id: 'zonas', label: 'Zonas' },
  { id: 'copa', label: 'Copa de Oro/Plata' },
  { id: 'playoff', label: 'Playoff' }
] as const

type PestanaId = typeof PESTANAS[number]['id']

export function TablasTabs({ zona1, zona2, copaDeOro, copaDePlata, playoff, habilitacion }: TablasTabsProps) {
  const [activa, setActiva] = useState<PestanaId>('zonas')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2">
        {PESTANAS.map((pestana) => (
          <button
            key={pestana.id}
            type="button"
            onClick={() => setActiva(pestana.id)}
            className={cn(
              'rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors',
              activa === pestana.id
                ? 'border-[#1f4e78] bg-[#1f4e78] text-white'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            )}
          >
            {pestana.label}
          </button>
        ))}
      </div>

      {activa === 'zonas' && (
        <div className="space-y-4">
          <TablaSimple titulo="Zona 1" posiciones={zona1} />
          <TablaSimple titulo="Zona 2" posiciones={zona2} />
        </div>
      )}

      {activa === 'copa' && (
        habilitacion.copaDeOro ? (
          <div className="space-y-4">
            <TablaSimple titulo="Copa de Oro" posiciones={copaDeOro} />
            <TablaSimple titulo="Copa de Plata" posiciones={copaDePlata} />
          </div>
        ) : (
          <ProximamenteCard titulo="Copa de Oro/Plata" />
        )
      )}

      {activa === 'playoff' && (
        habilitacion.playoff ? (
          <TablaSimple titulo="Playoff" posiciones={playoff} />
        ) : (
          <ProximamenteCard titulo="Playoff" />
        )
      )}
    </div>
  )
}
