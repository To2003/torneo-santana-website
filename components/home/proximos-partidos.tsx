import Link from 'next/link'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Partido, Equipo } from '@/lib/types'

interface ProximosPartidosProps {
  partidos: Partido[]
  equipos: Equipo[]
  className?: string
}

export function ProximosPartidos({ partidos, equipos, className }: ProximosPartidosProps) {
  const getEquipo = (id: string) => equipos.find(e => e.id === id)

  // Group by fecha
  const partidosPorFecha = partidos.reduce((acc, partido) => {
    const key = `Fecha ${partido.fecha}`
    if (!acc[key]) acc[key] = []
    acc[key].push(partido)
    return acc
  }, {} as Record<string, Partido[]>)

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-lg', className)}>
      {/* Header */}
      <div className="bg-torneo-accent px-4 py-3">
        <h2 className="text-center text-lg font-bold uppercase tracking-wider text-black">
          Fixture
          <span className="block text-sm font-medium">Proximos Partidos</span>
        </h2>
      </div>
      
      {/* Partidos */}
      <div className="divide-y divide-border">
        {Object.entries(partidosPorFecha).slice(0, 2).map(([fecha, partidosFecha]) => (
          <div key={fecha}>
            {partidosFecha.map((partido) => {
              const equipoLocal = getEquipo(partido.equipoLocal)
              const equipoVisitante = getEquipo(partido.equipoVisitante)
              
              if (!equipoLocal || !equipoVisitante) return null

              return (
                <div key={partido.id} className="px-4 py-3">
                  {/* Fecha badge */}
                  <div className="mb-2 flex items-center justify-center">
                    <span className="rounded-full bg-torneo-court px-3 py-1 text-xs font-semibold text-white">
                      {fecha} - {partido.dia} - {partido.hora}
                    </span>
                  </div>
                  
                  {/* Match */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: equipoLocal.colorPrimario }}
                      >
                        {equipoLocal.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold">{equipoLocal.nombre.split(' ')[0]}</span>
                    </div>
                    
                    <span className="px-2 text-muted-foreground">VS</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{equipoVisitante.nombre.split(' ')[0]}</span>
                      <div 
                        className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: equipoVisitante.colorPrimario }}
                      >
                        {equipoVisitante.nombre.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Cancha */}
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    {partido.cancha}
                  </p>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      {/* Ver más */}
      <div className="border-t border-border p-3">
        <Link 
          href="/fixture"
          className="block w-full rounded-lg bg-torneo-primary py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-torneo-primary-dark"
        >
          Ver Fixture Completo
        </Link>
      </div>
    </div>
  )
}
