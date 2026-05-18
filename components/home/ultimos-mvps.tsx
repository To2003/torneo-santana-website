import { Star, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Partido, Equipo } from '@/lib/types'

interface UltimosMVPsProps {
  partidos: Partido[]
  equipos: Equipo[]
  className?: string
}

export function UltimosMVPs({ partidos, equipos, className }: UltimosMVPsProps) {
  const getEquipo = (id: string) => equipos.find(e => e.id === id)

  // Si no hay MVPs para mostrar, devolvemos un estado vacío o null
  if (!partidos || partidos.length === 0) {
    return (
      <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-lg', className)}>
        <div className="bg-amber-400 px-4 py-3">
          <h2 className="text-center text-lg font-black uppercase tracking-wider text-amber-950 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            Últimos MVPs
          </h2>
        </div>
        <div className="p-6 text-center text-sm text-muted-foreground italic bg-slate-50/50">
          Aún no se han registrado MVPs en esta fecha.
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-lg', className)}>
      <div className="bg-amber-400 px-4 py-3">
        <h2 className="text-center text-lg font-black uppercase tracking-wider text-amber-950 flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5" />
          Últimos MVPs
        </h2>
      </div>
      
      <div className="divide-y divide-border">
        {partidos.map((partido) => {
          const equipoLocal = getEquipo(partido.equipoLocal)
          const equipoVisitante = getEquipo(partido.equipoVisitante)
          
          if (!equipoLocal || !equipoVisitante) return null
          
          const ganoLocal = (partido.setsLocal || 0) > (partido.setsVisitante || 0)
          
          return (
            <div key={partido.id} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-slate-50/80">
              {/* Ícono de Estrella */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm border border-amber-200">
                <Star className="h-5 w-5 fill-amber-500" />
              </div>
              
              {/* Info del MVP */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate text-base font-bold text-slate-800 tracking-tight">
                  {partido.mvp}
                </span>
                
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-bold text-amber-600/80 bg-amber-100/50 px-1.5 rounded">F{partido.fecha}</span>
                  <div className="flex items-center gap-1 truncate font-medium">
                    <span className={cn("truncate", ganoLocal ? "text-green-600 font-bold" : "text-slate-600")}>
                      {equipoLocal.nombre}
                    </span>
                    <span className="text-[10px] opacity-50 px-0.5 shrink-0">vs</span>
                    <span className={cn("truncate", !ganoLocal ? "text-green-600 font-bold" : "text-slate-600")}>
                      {equipoVisitante.nombre}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
