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

const CORTE_ZONAS = { posicion: 4, etiqueta: 'Los 4 primeros de cada zona pasan a Copa de Oro' }

export function TablasTabs({ zona1, zona2, copaDeOro, copaDePlata, playoff, habilitacion }: TablasTabsProps) {
  // Arranca en el torneo que se está jugando ahora
  const inicial: PestanaId = habilitacion.playoff ? 'playoff' : habilitacion.copaDeOro ? 'copa' : 'zonas'
  const [activa, setActiva] = useState<PestanaId>(inicial)

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div role="tablist" aria-label="Torneos" className="inline-flex max-w-full overflow-x-auto rounded-full bg-[#0d2340] p-1 shadow-lg">
          {PESTANAS.map((pestana) => {
            const seleccionada = activa === pestana.id
            return (
              <button
                key={pestana.id}
                type="button"
                role="tab"
                aria-selected={seleccionada}
                onClick={() => setActiva(pestana.id)}
                className={cn(
                  'whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623]',
                  seleccionada ? 'bg-[#f5a623] text-[#0d2340]' : 'text-white/75 hover:text-white'
                )}
              >
                {pestana.label}
                {pestana.id === inicial && (
                  <span className={cn('ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle', seleccionada ? 'bg-[#0d2340]' : 'bg-[#f5a623]')} aria-label="en juego" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div role="tabpanel">
        {activa === 'zonas' && (
          <div className="space-y-6">
            <TablaSimple titulo="Zona 1" posiciones={zona1} corte={CORTE_ZONAS} />
            <TablaSimple titulo="Zona 2" posiciones={zona2} corte={CORTE_ZONAS} />
          </div>
        )}

        {activa === 'copa' && (
          habilitacion.copaDeOro ? (
            <div className="space-y-6">
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
    </div>
  )
}
