import { PartidoCard } from './partido-card'
import type { Partido, Equipo } from '@/lib/types'

interface FechaSectionProps {
  fecha: number
  dia: string
  partidos: Partido[]
  equipos: Equipo[]
  showResultados?: boolean
}

export function FechaSection({ fecha, dia, partidos, equipos, showResultados = false }: FechaSectionProps) {
  const getEquipo = (id: string) => equipos.find(e => e.id === id)

  // Agrupar por dia
  const partidosPorDia = partidos.reduce((acc, partido) => {
    const key = partido.dia
    if (!acc[key]) acc[key] = []
    acc[key].push(partido)
    return acc
  }, {} as Record<string, Partido[]>)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-torneo-primary to-torneo-primary-dark px-6 py-4">
        <h3 className="text-center text-xl font-bold uppercase tracking-wider text-white">
          Fecha {fecha}
        </h3>
      </div>

      {/* Partidos agrupados por dia */}
      <div className="divide-y divide-border">
        {Object.entries(partidosPorDia).map(([diaPartido, partidosDia]) => (
          <div key={diaPartido}>
            {/* Dia header */}
            <div className="bg-torneo-accent px-4 py-2">
              <h4 className="text-center font-semibold text-black uppercase tracking-wide">
                {diaPartido}
              </h4>
            </div>
            
            {/* Partidos del dia */}
            <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {partidosDia.map((partido) => {
                const equipoLocal = getEquipo(partido.equipoLocal)
                const equipoVisitante = getEquipo(partido.equipoVisitante)
                
                if (!equipoLocal || !equipoVisitante) return null
                
                return (
                  <PartidoCard 
                    key={partido.id}
                    partido={partido}
                    equipoLocal={equipoLocal}
                    equipoVisitante={equipoVisitante}
                    showResultado={showResultados}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
