import { cn } from '@/lib/utils'
import type { Posicion } from '@/lib/types'

interface TablaPosicionesProps {
  posiciones: Posicion[]
  className?: string
}

export function TablaPosiciones({ posiciones, className }: TablaPosicionesProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-lg', className)}>
      {/* Header */}
      <div className="bg-torneo-primary px-4 py-3">
        <h2 className="text-center text-lg font-bold uppercase tracking-wider text-white">
          Tabla de Puntos
        </h2>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-torneo-primary/10">
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">POS</th>
              <th className="px-2 py-3 text-left font-semibold text-torneo-primary">EQUIPO</th>
              <th className="hidden px-2 py-3 text-center font-semibold text-torneo-primary sm:table-cell">PJ</th>
              <th className="hidden px-2 py-3 text-center font-semibold text-torneo-primary sm:table-cell">G</th>
              <th className="hidden px-2 py-3 text-center font-semibold text-torneo-primary sm:table-cell">P</th>
              <th className="hidden px-2 py-3 text-center font-semibold text-torneo-primary md:table-cell">SF</th>
              <th className="hidden px-2 py-3 text-center font-semibold text-torneo-primary md:table-cell">SC</th>
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">DS</th>
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">PTS</th>
            </tr>
          </thead>
          <tbody>
            {posiciones.map((pos) => (
              <tr 
                key={pos.equipo.id} 
                className={cn(
                  'border-b border-border/50 transition-colors hover:bg-muted/50',
                  pos.posicion === 1 && 'bg-pos-gold/10',
                  pos.posicion === 2 && 'bg-pos-silver/10',
                  pos.posicion === 3 && 'bg-pos-bronze/10'
                )}
              >
                {/* Posición */}
                <td className="px-2 py-3 text-center">
                  <span 
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold',
                      pos.posicion === 1 && 'bg-pos-gold text-black',
                      pos.posicion === 2 && 'bg-pos-silver text-black',
                      pos.posicion === 3 && 'bg-pos-bronze text-white',
                      pos.posicion > 3 && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {pos.posicion}
                  </span>
                </td>
                
                {/* Equipo */}
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: pos.equipo.colorPrimario }}
                    >
                      {pos.equipo.nombre.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{pos.equipo.nombre}</span>
                  </div>
                </td>
                
                {/* Stats */}
                <td className="hidden px-2 py-3 text-center text-muted-foreground sm:table-cell">{pos.pj}</td>
                <td className="hidden px-2 py-3 text-center text-green-600 font-medium sm:table-cell">{pos.g}</td>
                <td className="hidden px-2 py-3 text-center text-red-500 sm:table-cell">{pos.p}</td>
                <td className="hidden px-2 py-3 text-center text-muted-foreground md:table-cell">{pos.sf}</td>
                <td className="hidden px-2 py-3 text-center text-muted-foreground md:table-cell">{pos.sc}</td>
                <td className={cn(
                  'px-2 py-3 text-center font-medium',
                  pos.ds > 0 && 'text-green-600',
                  pos.ds < 0 && 'text-red-500',
                  pos.ds === 0 && 'text-muted-foreground'
                )}>
                  {pos.ds > 0 ? `+${pos.ds}` : pos.ds}
                </td>
                <td className="px-2 py-3 text-center">
                  <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-torneo-primary px-2 py-1 text-sm font-bold text-white">
                    {pos.pts}pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <span className="font-medium">PJ:</span> Partidos Jugados | 
        <span className="font-medium"> G:</span> Ganados | 
        <span className="font-medium"> P:</span> Perdidos | 
        <span className="font-medium"> SF:</span> Sets Favor | 
        <span className="font-medium"> SC:</span> Sets Contra | 
        <span className="font-medium"> DS:</span> Diferencia Sets
      </div>
    </div>
  )
}
