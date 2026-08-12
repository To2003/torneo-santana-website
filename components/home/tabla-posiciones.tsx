import { cn } from '@/lib/utils'
import { TablaSimple } from '@/components/shared/tabla-simple'
import type { Posicion } from '@/lib/types'

interface TablaPosicionesProps {
  torneoA: Posicion[]
  torneoB: Posicion[]
  className?: string
}

export function TablaPosiciones({ torneoA, torneoB, className }: TablaPosicionesProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <TablaSimple titulo="Zona 1" posiciones={torneoA} />
      <TablaSimple titulo="Zona 2" posiciones={torneoB} />
    </div>
  )
}
