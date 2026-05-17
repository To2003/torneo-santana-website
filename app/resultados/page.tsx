import { FechaSection } from '@/components/fixture/fecha-section'
import { getResultados, getEquipos } from '@/lib/google-sheets'

export const metadata = {
  title: 'Resultados | Torneo Santana',
  description: 'Resultados de todos los partidos jugados en el Torneo Santana de voley.'
}

export default async function ResultadosPage() {
  const [partidos, equipos] = await Promise.all([
    getResultados(),
    getEquipos()
  ])

  // Agrupar partidos por fecha (orden inverso - mas recientes primero)
  const partidosPorFecha = partidos.reduce((acc, partido) => {
    const key = partido.fecha
    if (!acc[key]) acc[key] = { partidos: [], dia: partido.dia }
    acc[key].partidos.push(partido)
    return acc
  }, {} as Record<number, { partidos: typeof partidos, dia: string }>)

  const fechas = Object.keys(partidosPorFecha).map(Number).sort((a, b) => b - a) // Inverso

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            <span className="text-torneo-accent">Resultados</span> del Torneo
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {partidos.length} partidos jugados hasta el momento
          </p>
        </div>
      </section>

      {/* Resultados */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl space-y-8 px-4">
          {fechas.length > 0 ? (
            fechas.map((numeroFecha) => {
              const { partidos: partidosFecha, dia } = partidosPorFecha[numeroFecha]
              
              return (
                <FechaSection 
                  key={numeroFecha}
                  fecha={numeroFecha}
                  dia={dia}
                  partidos={partidosFecha}
                  equipos={equipos}
                  showResultados={true}
                />
              )
            })
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-lg">
              <p className="text-lg text-muted-foreground">
                Aun no hay partidos jugados. Los resultados apareceran aqui cuando se jueguen las fechas.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
