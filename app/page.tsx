import { Hero } from '@/components/home/hero'
import { TablaPosiciones } from '@/components/home/tabla-posiciones'
import { ProximosPartidos } from '@/components/home/proximos-partidos'
import { InfoTorneo } from '@/components/home/info-torneo'
import {
  getConfiguracion,
  getTablaPosiciones,
  getProximosPartidos,
  getEquipos
} from '@/lib/google-sheets'

export default async function HomePage() {
  const [config, posiciones, proximosPartidos, equipos] = await Promise.all([
    getConfiguracion(),
    getTablaPosiciones(),
    getProximosPartidos(6),
    getEquipos()
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero config={config} />

      {/* Main Content */}
      <section className="bg-court py-8">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tabla de Posiciones - 2 columnas en desktop */}
            <div className="lg:col-span-2">
              <TablaPosiciones posiciones={posiciones} />
            </div>

            {/* Sidebar - Proximos Partidos */}
            <div className="lg:col-span-1">
              <ProximosPartidos
                partidos={proximosPartidos}
                equipos={equipos}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info del Torneo */}
      <InfoTorneo config={config} />
    </div>
  )
}
