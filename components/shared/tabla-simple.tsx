import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeamAvatar } from '@/components/shared/team-avatar'
import type { Posicion } from '@/lib/types'

export function TablaSimple({ titulo, posiciones }: { titulo: string; posiciones: Posicion[] }) {
  const sancionados = posiciones.filter(p => p.puntosDescontados > 0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="bg-[#1f4e78] px-4 py-3">
        <h2 className="text-center text-lg font-bold uppercase tracking-wider text-white">{titulo}</h2>
      </div>

      {posiciones.length === 0 ? (
        <div className="p-8 text-center text-sm italic text-muted-foreground">
          Todavía no hay equipos clasificados en esta instancia.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="sticky left-0 z-10 w-12 bg-slate-50 px-2 py-3 text-center font-semibold text-[#1f4e78]">POS</th>
                <th className="sticky left-12 z-10 border-r border-border bg-slate-50 px-2 py-3 text-left font-semibold text-[#1f4e78]">EQUIPO</th>
                <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">PG</th>
                <th className="px-2 py-3 text-center font-bold text-[#1f4e78]">PTS</th>
                <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">PJ</th>
                <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">PP</th>
                <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">G2</th>
                <th className="px-2 py-3 text-center font-semibold text-[#1f4e78]">P3</th>
              </tr>
            </thead>
            <tbody>
              {posiciones.map((pos) => {
                const filaBg = pos.posicion === 1 ? 'bg-yellow-50' : pos.posicion === 2 ? 'bg-slate-100' : pos.posicion === 3 ? 'bg-orange-50' : 'bg-card'

                return (
                  <tr key={pos.equipo.id} className={cn('border-b border-border/50 transition-colors hover:bg-muted/50', filaBg)}>
                    <td className={cn('sticky left-0 z-10 px-2 py-3 text-center', filaBg)}>
                      <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold', pos.posicion === 1 && 'bg-yellow-400 text-yellow-900', pos.posicion === 2 && 'bg-slate-300 text-slate-800', pos.posicion === 3 && 'bg-orange-400 text-orange-950', pos.posicion > 3 && 'bg-slate-100 text-slate-500')}>
                        {pos.posicion}
                      </span>
                    </td>

                    <td className={cn('sticky left-12 z-10 border-r border-border px-2 py-3', filaBg)}>
                      <div className="flex items-center gap-3">
                        <TeamAvatar
                          nombre={pos.equipo.nombre}
                          colorPrimario={pos.equipo.colorPrimario}
                          logo={pos.equipo.logo}
                          className="h-9 w-9"
                          textClassName="text-xs"
                        />
                        <span className="font-bold text-slate-700 whitespace-nowrap">
                          {pos.equipo.nombre}
                          {pos.puntosDescontados > 0 && <span className="text-red-500"> (*)</span>}
                        </span>
                      </div>
                    </td>

                    <td className="px-2 py-3 text-center font-bold text-green-600">{pos.pg}</td>
                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-[#1f4e78] px-2 py-1 text-sm font-bold text-white shadow-sm">
                        {pos.pts}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center font-medium">{pos.pj}</td>
                    <td className="px-2 py-3 text-center font-medium text-red-500">{pos.pp}</td>
                    <td className="px-2 py-3 text-center font-semibold text-blue-600">{pos.g2}</td>
                    <td className="px-2 py-3 text-center font-medium text-orange-500">{pos.p3}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {sancionados.length > 0 && (
        <div className="space-y-1 border-t border-border bg-slate-50/50 px-4 py-3">
          {sancionados.map(pos => (
            <p key={pos.equipo.id} className="text-xs text-red-500">
              (*) {pos.equipo.nombre}: se descontaron {pos.puntosDescontados} {pos.puntosDescontados === 1 ? 'punto' : 'puntos'}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProximamenteCard({ titulo }: { titulo: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="bg-[#1f4e78] px-4 py-3">
        <h2 className="text-center text-lg font-bold uppercase tracking-wider text-white">{titulo}</h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
        <Trophy className="h-8 w-8 text-muted-foreground/40" />
        <p className="font-semibold text-muted-foreground">{titulo} vendrá pronto</p>
        <p className="text-sm text-muted-foreground/70">Esta instancia del torneo todavía no está disponible.</p>
      </div>
    </div>
  )
}
