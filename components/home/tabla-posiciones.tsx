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
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">PJ</th>
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">PG</th>
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">PP</th>
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">G2</th>
              <th className="px-2 py-3 text-center font-semibold text-torneo-primary">P3</th>
              <th className="px-2 py-3 text-center font-bold text-torneo-primary">PTS</th>
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: pos.equipo.colorPrimario }}
                    >
                      {pos.equipo.nombre.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium whitespace-nowrap">{pos.equipo.nombre}</span>
                  </div>
                </td>

                {/* Estadísticas */}
                <td className="px-2 py-3 text-center font-medium">{pos.pj}</td>
                <td className="px-2 py-3 text-center font-bold text-green-600">{pos.pg}</td>
                <td className="px-2 py-3 text-center font-medium text-red-500">{pos.pp}</td>
                <td className="px-2 py-3 text-center font-semibold text-blue-600">{pos.g2}</td>
                <td className="px-2 py-3 text-center font-medium text-orange-500">{pos.p3}</td>
                <td className="px-2 py-3 text-center">
                  <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-torneo-primary px-2 py-1 text-sm font-bold text-white">
                    {pos.pts}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda Oficial del Reglamento */}
      <div className="flex flex-col gap-1 border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center">
        <span><strong className="text-foreground">PG:</strong> Partido Ganado (4 pts) | </span>
        <span><strong className="text-foreground">G2:</strong> Bonus ganado en 2 sets (2 pts) | </span>
        <span><strong className="text-foreground">PP:</strong> Partido perdido (1 pts) | </span>
        <span><strong className="text-foreground">P3:</strong> Bonus perdido en 3 sets (1 pts)</span>
      </div>
    </div>
  )
}