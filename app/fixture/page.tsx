import { FechaSection } from '@/components/fixture/fecha-section'
import { getTodosLosPartidos, getEquipos, getEquipoLibre } from '@/lib/google-sheets'

export const metadata = {
  title: 'Fixture | Torneo Santana',
  description: 'Calendario completo de partidos del Torneo Santana de voley.'
}

export default async function FixturePage() {
  const [partidos, equipos] = await Promise.all([
    getTodosLosPartidos(),
    getEquipos()
  ])

  // Agrupar partidos por fecha
  const partidosPorFecha = partidos.reduce((acc, partido) => {
    const key = partido.fecha
    if (!acc[key]) acc[key] = { partidos: [], dia: partido.dia }
    acc[key].partidos.push(partido)
    return acc
  }, {} as Record<number, { partidos: typeof partidos, dia: string }>)

  const fechas = Object.keys(partidosPorFecha).map(Number).sort((a, b) => a - b)

  // Equipo que descansa en cada fecha
  const equiposLibrePorFecha = Object.fromEntries(
    await Promise.all(fechas.map(async (f) => [f, await getEquipoLibre(f, equipos)] as const))
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Calendario <span className="text-torneo-accent">Completo</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Todos los partidos del torneo organizados por fecha
          </p>
        </div>
      </section>

      {/* Fixture */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl space-y-8 px-4">
          {fechas.map((numeroFecha) => {
            const { partidos: partidosFecha, dia } = partidosPorFecha[numeroFecha]

            return (
              <FechaSection
                key={numeroFecha}
                fecha={numeroFecha}
                dia={dia}
                partidos={partidosFecha}
                equipos={equipos}
                showResultados={true}
                equipoLibre={equiposLibrePorFecha[numeroFecha]}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}