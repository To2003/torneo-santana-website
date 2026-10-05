import { TablaSimple } from '@/components/shared/tabla-simple'
import type { Posicion } from '@/lib/types'

export interface TablaTorneo {
  titulo: string
  posiciones: Posicion[]
}

interface TablaPosicionesProps {
  titulo: string
  tablas: TablaTorneo[]
  className?: string
}

export function TablaPosiciones({ titulo, tablas, className }: TablaPosicionesProps) {
  return (
    <div className={className}>
      <h2 className="mb-4 text-center text-xl font-black uppercase tracking-wide text-[#1f4e78]">{titulo}</h2>
      <div className="space-y-4">
        {tablas.map((tabla) => (
          <TablaSimple key={tabla.titulo} titulo={tabla.titulo} posiciones={tabla.posiciones} />
        ))}
      </div>
    </div>
  )
}
