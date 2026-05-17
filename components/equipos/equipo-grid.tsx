import { EquipoCard } from './equipo-card'
import type { Equipo } from '@/lib/types'

interface EquipoGridProps {
  equipos: Equipo[]
}

export function EquipoGrid({ equipos }: EquipoGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {equipos.map((equipo) => (
        <EquipoCard key={equipo.id} equipo={equipo} />
      ))}
    </div>
  )
}
