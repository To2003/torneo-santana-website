import { FechaSection } from '@/components/fixture/fecha-section'
import { getTodosLosPartidos, getEquipos, getEquipoLibre, getLinkVideoFecha } from '@/lib/google-sheets'

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

  // Orden: la próxima fecha a jugar (la primera con resultados pendientes) va primero,
  // seguida de las fechas ya jugadas de más reciente a más antigua, y por último las
  // fechas futuras que todavía no llegaron (en orden cronológico)
  const numerosFecha = Object.keys(partidosPorFecha).map(Number)
  const fechaJugada = (n: number) => partidosPorFecha[n].partidos.every(p => p.jugado)

  const jugadas = numerosFecha.filter(fechaJugada).sort((a, b) => b - a)
  const noJugadas = numerosFecha.filter(n => !fechaJugada(n)).sort((a, b) => a - b)

  const fechas = noJugadas.length > 0
    ? [noJugadas[0], ...jugadas, ...noJugadas.slice(1)]
    : jugadas

  // Equipo que descansa en cada fecha
  const equiposLibrePorFecha = Object.fromEntries(
    await Promise.all(fechas.map(async (f) => [f, await getEquipoLibre(f, equipos)] as const))
  )

  // Link al video de cada fecha (uno solo por fecha, no por partido)
  const linksVideoPorFecha = Object.fromEntries(
    await Promise.all(fechas.map(async (f) => [f, await getLinkVideoFecha(f)] as const))
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
          {fechas.map((numeroFecha, index) => {
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
                defaultExpanded={index < 2}
                linkVideo={linksVideoPorFecha[numeroFecha]}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}