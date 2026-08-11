import { TablaSimple, ProximamenteCard } from '@/components/shared/tabla-simple'
import type { Posicion, HabilitacionTorneos } from '@/lib/types'

interface TablaPlayoffsProps {
  copaDeOro: Posicion[]
  copaDePlata: Posicion[]
  playoff: Posicion[]
  habilitacion: HabilitacionTorneos
}

export function TablaPlayoffs({ copaDeOro, copaDePlata, playoff, habilitacion }: TablaPlayoffsProps) {
  return (
    <div className="space-y-6">
      {/* Copa de Oro / Copa de Plata: se habilitan juntas con un solo toggle */}
      {habilitacion.copaDeOro ? (
        <div className="space-y-4">
          <TablaSimple titulo="Copa de Oro" posiciones={copaDeOro} />
          <TablaSimple titulo="Copa de Plata" posiciones={copaDePlata} />
        </div>
      ) : (
        <ProximamenteCard titulo="Copa de Oro/Plata" />
      )}

      {/* Playoff: toggle independiente */}
      {habilitacion.playoff ? (
        <TablaSimple titulo="Playoff" posiciones={playoff} />
      ) : (
        <ProximamenteCard titulo="Playoff" />
      )}
    </div>
  )
}
