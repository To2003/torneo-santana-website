import { TablaSimple, type VarianteTabla } from '@/components/shared/tabla-simple'
import type { Posicion } from '@/lib/types'

export interface TablaTorneo {
  titulo: string
  posiciones: Posicion[]
  corte?: { posicion: number; etiqueta: string }
  variante?: VarianteTabla
}

interface TablaPosicionesProps {
  titulo: string
  tablas: TablaTorneo[]
  className?: string
}

export function TablaPosiciones({ titulo, tablas, className }: TablaPosicionesProps) {
  return (
    <div className={className}>
      <h2 className="mb-4 flex items-center gap-2.5 text-xl font-bold text-white drop-shadow-sm">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        {titulo}
      </h2>
      <div className="space-y-6">
        {tablas.map((tabla) => (
          <TablaSimple key={tabla.titulo} titulo={tabla.titulo} posiciones={tabla.posiciones} corte={tabla.corte} variante={tabla.variante} />
        ))}
      </div>
    </div>
  )
}
