import { TablaPlayoffs } from '@/components/playoffs/tabla-playoffs'
import { getTablaPosicionesPorTorneo, getHabilitacionTorneos } from '@/lib/google-sheets'

export const metadata = {
  title: 'Playoffs | Torneo Santana',
  description: 'Copa de Oro, Copa de Plata y Playoff del Torneo Santana de voley.'
}

export default async function PlayoffsPage() {
  const [copaDeOro, copaDePlata, playoff, habilitacion] = await Promise.all([
    getTablaPosicionesPorTorneo('copaDeOro'),
    getTablaPosicionesPorTorneo('copaDePlata'),
    getTablaPosicionesPorTorneo('playoff'),
    getHabilitacionTorneos()
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Fase <span className="text-torneo-accent">Final</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Copa de Oro, Copa de Plata y Playoff del Torneo Santana
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl px-4">
          <TablaPlayoffs
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
