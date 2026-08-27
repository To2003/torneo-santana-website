import { AlertTriangle, User, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Sancion } from '@/lib/types'

interface SancionesCardProps {
  sanciones: Sancion[]
  className?: string
}

function formatearCantidad(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`
}

export function SancionesCard({ sanciones, className }: SancionesCardProps) {
  const hayScroll = sanciones.length > 7

  return (
    <div className={cn('overflow-hidden rounded-xl border-2 border-[#F5B92E] bg-white shadow-lg', className)}>
      <div className="bg-[#F5B92E] px-4 py-3">
        <h2 className="flex items-center justify-center gap-2 text-center text-lg font-black uppercase tracking-wider text-[#5C3A00]">
          <AlertTriangle className="h-5 w-5" />
          Sanciones
        </h2>
      </div>

      {sanciones.length === 0 ? (
        <div className="bg-slate-50/50 p-6 text-center text-sm italic text-muted-foreground">
          No hay sanciones registradas
        </div>
      ) : (
        <div className={cn('divide-y divide-border', hayScroll && 'max-h-[600px] overflow-y-auto')}>
          {sanciones.map((sancion, index) => (
            <div
              key={sancion.id}
              className="flex items-start gap-3 px-4 py-3"
              style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#FAFAF8' }}
            >
              {/* Ícono de alerta */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F5C6C6] bg-[#FCEBEB] text-[#E24B4A] shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>

              {/* Info central */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base font-bold text-[#1B3A5C]">
                  {sancion.equipoNombre}
                </span>

                {sancion.jugador && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="truncate">{sancion.jugador}</span>
                  </div>
                )}

                {sancion.causa && (
                  <p className="mt-0.5 truncate text-xs text-slate-400">{sancion.causa}</p>
                )}
              </div>

              {/* Badges apilados */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                {sancion.puntos > 0 && (
                  <span className="inline-flex items-center rounded-full bg-[#FCEBEB] px-2 py-0.5 text-xs font-bold text-[#A32D2D]">
                    −{sancion.puntos} {sancion.puntos === 1 ? 'pt' : 'pts'}
                  </span>
                )}
                {sancion.fechasSuspension > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FAEEDA] px-2 py-0.5 text-xs font-bold text-[#854F0B]">
                    <Ban className="h-3 w-3" />
                    {formatearCantidad(sancion.fechasSuspension, 'fecha', 'fechas')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
