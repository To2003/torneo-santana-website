import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeamAvatar } from '@/components/shared/team-avatar'
import type { Posicion } from '@/lib/types'

interface Corte {
  // Los equipos hasta esta posición (inclusive) quedan marcados como clasificados
  posicion: number
  etiqueta: string
}

interface TablaSimpleProps {
  titulo: string
  posiciones: Posicion[]
  corte?: Corte
}

const COLUMNAS: { sigla: string; nombre: string }[] = [
  { sigla: 'PJ', nombre: 'Partidos jugados' },
  { sigla: 'PG', nombre: 'Partidos ganados' },
  { sigla: 'PP', nombre: 'Partidos perdidos' },
  { sigla: 'G2', nombre: 'Bonus por ganar 2 a 0' },
  { sigla: 'P3', nombre: 'Bonus por perder 1 a 2' }
]

export function TablaSimple({ titulo, posiciones, corte }: TablaSimpleProps) {
  const sancionados = posiciones.filter(p => p.puntosDescontados > 0)

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
      <div className="flex items-baseline justify-between gap-4 bg-[#0d2340] px-5 py-3">
        <h2 className="text-lg font-bold text-white">{titulo}</h2>
        {posiciones.length > 0 && (
          <span className="text-sm text-white/60">{posiciones.length} equipos</span>
        )}
      </div>

      {posiciones.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Todavía no hay equipos clasificados en esta instancia.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th scope="col" className="sticky left-0 z-10 w-12 bg-white py-2.5 pl-4 pr-2 text-left font-medium">
                  <abbr title="Posición" className="no-underline">Pos</abbr>
                </th>
                <th scope="col" className="sticky left-12 z-10 bg-white px-2 py-2.5 text-left font-medium">Equipo</th>
                <th scope="col" className="w-16 px-3 py-2.5 text-right font-semibold text-[#0d2340]">
                  <abbr title="Puntos" className="no-underline">Pts</abbr>
                </th>
                {COLUMNAS.map(c => (
                  <th key={c.sigla} scope="col" className="w-14 px-3 py-2.5 text-right font-medium">
                    <abbr title={c.nombre} className="cursor-help no-underline">{c.sigla}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posiciones.map((pos) => {
                const clasificado = corte ? pos.posicion <= corte.posicion : false
                const ultimoClasificado = corte?.posicion === pos.posicion
                const lider = pos.posicion === 1

                return (
                  <tr
                    key={pos.equipo.id}
                    className={cn(
                      'group border-b border-slate-100 last:border-0 hover:bg-slate-50',
                      ultimoClasificado && 'border-b-2 border-dashed border-b-[#f5a623]/60'
                    )}
                  >
                    <td
                      className={cn(
                        'sticky left-0 z-10 bg-white py-3 pl-4 pr-2 group-hover:bg-slate-50',
                        clasificado && 'shadow-[inset_4px_0_0_#f5a623]'
                      )}
                    >
                      <span className={cn('text-base font-semibold', lider ? 'text-[#c47f0a]' : 'text-slate-400')}>
                        {pos.posicion}
                      </span>
                    </td>

                    <td className="sticky left-12 z-10 bg-white px-2 py-3 group-hover:bg-slate-50">
                      <Link
                        href={`/equipos/${pos.equipo.slug}`}
                        className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e78] focus-visible:ring-offset-2"
                      >
                        <TeamAvatar
                          nombre={pos.equipo.nombre}
                          colorPrimario={pos.equipo.colorPrimario}
                          logo={pos.equipo.logo}
                          className="h-9 w-9"
                          textClassName="text-xs"
                        />
                        <span className="whitespace-nowrap font-semibold text-slate-800 decoration-[#f5a623] decoration-2 underline-offset-4 hover:underline">
                          {pos.equipo.nombre}
                          {pos.puntosDescontados > 0 && <span className="text-red-600"> (*)</span>}
                        </span>
                      </Link>
                    </td>

                    <td className="px-3 py-3 text-right text-xl font-black text-[#0d2340]">{pos.pts}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{pos.pj}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{pos.pg}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{pos.pp}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{pos.g2}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{pos.p3}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {(corte || sancionados.length > 0) && posiciones.length > 0 && (
        <div className="space-y-1.5 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs">
          {corte && (
            <p className="flex items-center gap-2 text-slate-600">
              <span aria-hidden="true" className="h-3 w-1 rounded-full bg-[#f5a623]" />
              {corte.etiqueta}
            </p>
          )}
          {sancionados.map(pos => (
            <p key={pos.equipo.id} className="text-red-600">
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
    <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
      <div className="bg-[#0d2340] px-5 py-3">
        <h2 className="text-lg font-bold text-white">{titulo}</h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
        <Trophy className="h-8 w-8 text-slate-300" aria-hidden="true" />
        <p className="font-semibold text-slate-600">{titulo} todavía no empezó</p>
        <p className="text-sm text-slate-500">La tabla aparece acá cuando arranque esta instancia.</p>
      </div>
    </div>
  )
}
