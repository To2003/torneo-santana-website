import { TablasTabs } from '@/components/tablas/tablas-tabs'
import {
  getTablaPosicionesPorGrupo,
  getTablaPosicionesPorTorneo,
  getHabilitacionTorneos
} from '@/lib/google-sheets'

export const metadata = {
  title: 'Tablas | Torneo Santana',
  description: 'Tablas de zonas, Copa de Oro/Plata y Playoff del Torneo Santana de voley.'
}

export default async function TablasPage() {
  const [zona1, zona2, copaDeOro, copaDePlata, playoff, habilitacion] = await Promise.all([
    getTablaPosicionesPorGrupo('1'),
    getTablaPosicionesPorGrupo('2'),
    getTablaPosicionesPorTorneo('copaDeOro'),
    getTablaPosicionesPorTorneo('copaDePlata'),
    getTablaPosicionesPorTorneo('playoff'),
    getHabilitacionTorneos()
  ])

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Tablas <span className="text-torneo-accent">del Torneo</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">Zonas, Copa de Oro/Plata y Playoff</p>
        </div>
      </section>

      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-5xl px-4">
          <TablasTabs
            zona1={zona1}
            zona2={zona2}
            copaDeOro={copaDeOro}
            copaDePlata={copaDePlata}
            playoff={playoff}
            habilitacion={habilitacion}
          />
        </div>
      </section>
    </div>
  )
}
