import { Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeamAvatar } from '@/components/shared/team-avatar'
import type { Partido, Equipo } from '@/lib/types'

interface PartidoCardProps {
  partido: Partido
  equipoLocal: Equipo
  equipoVisitante: Equipo
  showResultado?: boolean
}

export function PartidoCard({ partido, equipoLocal, equipoVisitante, showResultado = false }: PartidoCardProps) {
  const tieneResultado = partido.jugado && partido.setsLocal !== undefined && partido.setsVisitante !== undefined

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all hover:shadow-lg">
      {/* Header con hora y cancha */}
      <div className="flex items-center justify-between bg-torneo-primary px-4 py-2 text-white">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{partido.hora}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{partido.cancha}</span>
        </div>
      </div>

      {/* Equipos */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">

          {/* Equipo Local */}
          <div className="flex flex-1 flex-col items-center text-center">
            <TeamAvatar
              nombre={equipoLocal.nombre}
              colorPrimario={equipoLocal.colorPrimario}
              logo={equipoLocal.logo}
              className="mb-2 h-16 w-16 shadow-md"
              textClassName="text-xl"
            />
            <span className="text-sm font-semibold leading-tight text-slate-700">{equipoLocal.nombre}</span>
          </div>

          {/* VS / Resultado */}
          <div className="flex flex-col items-center">
            {tieneResultado && showResultado ? (
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-3xl font-black",
                  (partido.setsLocal || 0) > (partido.setsVisitante || 0) ? "text-green-600" : "text-muted-foreground"
                )}>
                  {partido.setsLocal}
                </span>
                <span className="text-xl font-bold text-muted-foreground">-</span>
                <span className={cn(
                  "text-3xl font-black",
                  (partido.setsVisitante || 0) > (partido.setsLocal || 0) ? "text-green-600" : "text-muted-foreground"
                )}>
                  {partido.setsVisitante}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-muted-foreground">VS</span>
            )}
            {tieneResultado && showResultado && (
              <span className="mt-1 text-xs text-muted-foreground font-medium">Sets</span>
            )}
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-1 flex-col items-center text-center">
            <TeamAvatar
              nombre={equipoVisitante.nombre}
              colorPrimario={equipoVisitante.colorPrimario}
              logo={equipoVisitante.logo}
              className="mb-2 h-16 w-16 shadow-md"
              textClassName="text-xl"
            />
            <span className="text-sm font-semibold leading-tight text-slate-700">{equipoVisitante.nombre}</span>
          </div>

        </div>
      </div>
    </div>
  )
}