import { cn } from '@/lib/utils'
import type { Posicion } from '@/lib/types'

interface TablaPosicionesProps {
  posiciones: Posicion[]
  className?: string
}

export function TablaPosiciones({ posiciones, className }: TablaPosicionesProps) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card shadow-lg', className)}>
      <div className="bg-[#1f4e78] px-4 py-3">
        <h2 className="text-center text-lg font-bold uppercase tracking-wider text-white">Tabla de Puntos</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">POS</th>
              <th className="px-2 py-3 text-left font-semibold text-[#1f4e78]">EQUIPO</th>
              <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">PJ</th>
              <th className="hidden sm:table-cell px-2 py-3 text-center font-semibold text-[#1f4e78]">PG</th>
              <th className="hidden sm:table-cell px-2 py-3 text-center font-semibold text-[#1f4e78]">PP</th>
              <th className="hidden md:table-cell px-2 py-3 text-center font-semibold text-[#1f4e78]">G2</th>
              <th className="hidden md:table-cell px-2 py-3 text-center font-semibold text-[#1f4e78]">P3</th>
              <th className="px-2 py-3 text-center font-bold text-[#1f4e78]">PTS</th>
            </tr>
          </thead>
          <tbody>
            {posiciones.map((pos) => {
              // Verificamos si tiene logo
              const tieneLogo = pos.equipo.logo && !pos.equipo.logo.includes('default.png');

              return (
                <tr key={pos.equipo.id} className={cn('border-b border-border/50 transition-colors hover:bg-muted/50', pos.posicion === 1 && 'bg-yellow-50/50', pos.posicion === 2 && 'bg-slate-100/50', pos.posicion === 3 && 'bg-orange-50/50')}>
                  <td className="px-2 py-3 text-center">
                    <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold', pos.posicion === 1 && 'bg-yellow-400 text-yellow-900', pos.posicion === 2 && 'bg-slate-300 text-slate-800', pos.posicion === 3 && 'bg-orange-400 text-orange-950', pos.posicion > 3 && 'bg-slate-100 text-slate-500')}>
                      {pos.posicion}
                    </span>
                  </td>

                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      {/* ACÁ ESTÁ LA MAGIA DEL ESCUDO EN LA TABLA */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white shadow-sm border border-slate-200" style={{ backgroundColor: pos.equipo.colorPrimario }}>
                        {tieneLogo ? (
                          <img src={pos.equipo.logo} alt={pos.equipo.nombre} className="h-full w-full object-cover" />
                        ) : (
                          pos.equipo.nombre.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="max-w-[120px] sm:max-w-none truncate font-bold text-slate-700">{pos.equipo.nombre}</span>
                    </div>
                  </td>

                  <td className="px-2 py-3 text-center font-medium">{pos.pj}</td>
                  <td className="hidden sm:table-cell px-2 py-3 text-center font-bold text-green-600">{pos.pg}</td>
                  <td className="hidden sm:table-cell px-2 py-3 text-center font-medium text-red-500">{pos.pp}</td>
                  <td className="hidden md:table-cell px-2 py-3 text-center font-semibold text-blue-600">{pos.g2}</td>
                  <td className="hidden md:table-cell px-2 py-3 text-center font-medium text-orange-500">{pos.p3}</td>
                  <td className="px-2 py-3 text-center">
                    <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-[#1f4e78] px-2 py-1 text-sm font-bold text-white shadow-sm">
                      {pos.pts}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}