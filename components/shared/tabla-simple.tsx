import Link from 'next/link'
import { Medal, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TeamAvatar } from '@/components/shared/team-avatar'
import type { Posicion } from '@/lib/types'

interface Corte {
  // Los equipos hasta esta posición (inclusive) quedan marcados como clasificados
  posicion: number
  etiqueta: string
}

export type VarianteTabla = 'oro' | 'plata'

interface TablaSimpleProps {
  titulo: string
  posiciones: Posicion[]
  corte?: Corte
  variante?: VarianteTabla
}

// Detalles metálicos para las copas: franja bajo el encabezado y color del título
const VARIANTES: Record<VarianteTabla, { franja: string; titulo: string }> = {
  oro: {
    franja: 'bg-[linear-gradient(90deg,#b8860b,#f7d774_35%,#d4a017_65%,#f7d774)]',
    titulo: 'text-[#f5c542]'
  },
  plata: {
    franja: 'bg-[linear-gradient(90deg,#8e959e,#e8ebef_35%,#aab1ba_65%,#e8ebef)]',
    titulo: 'text-[#dfe3e8]'
  }
}

// Podio: círculo oro/plata/bronce en el puesto y fondo tenue en la fila (opaco, porque las celdas fijas lo repiten)
const PODIO: Record<number, { fondo: string; puesto: string }> = {
  1: { fondo: 'bg-[#fff8e1]', puesto: 'bg-[#f5c518] text-[#4a3500]' },
  2: { fondo: 'bg-[#eef2f7]', puesto: 'bg-[#c3ccd8] text-[#2d3748]' },
  3: { fondo: 'bg-[#fff1e6]', puesto: 'bg-[#e07b24] text-white' }
}
const SIN_PODIO = { fondo: 'bg-white group-hover:bg-slate-50', puesto: 'bg-slate-100 text-slate-500' }

// Cada estadística con su color, igual en la sigla y en los números, para ubicarla de un vistazo
const COLUMNAS: { sigla: string; nombre: string; campo: 'pj' | 'pg' | 'pp' | 'g2' | 'p3'; color: string }[] = [
  { sigla: 'PJ', nombre: 'Partidos jugados', campo: 'pj', color: 'text-sky-700' },
  { sigla: 'PG', nombre: 'Partidos ganados', campo: 'pg', color: 'text-emerald-600' },
  { sigla: 'PP', nombre: 'Partidos perdidos', campo: 'pp', color: 'text-rose-600' },
  { sigla: 'G2', nombre: 'Bonus por ganar 2 a 0', campo: 'g2', color: 'text-violet-600' },
  { sigla: 'P3', nombre: 'Bonus por perder 1 a 2', campo: 'p3', color: 'text-amber-600' }
]

// Columna de puntos fija en mobile, pegada a Equipo, con sombra para marcar dónde scrollea el resto
const PTS_FIJO = 'max-md:sticky max-md:left-52 max-md:z-10 max-md:shadow-[6px_0_6px_-6px_rgba(13,35,64,0.35)]'

export function TablaSimple({ titulo, posiciones, corte, variante }: TablaSimpleProps) {
  const sancionados = posiciones.filter(p => p.puntosDescontados > 0)
  const estilo = variante ? VARIANTES[variante] : null

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-4 bg-[#0d2340] px-5 py-3">
        <h2 className={cn('flex items-center gap-2 text-lg font-bold', estilo?.titulo ?? 'text-white')}>
          {estilo && <Medal className="h-5 w-5" aria-hidden="true" />}
          {titulo}
        </h2>
        {posiciones.length > 0 && (
          <span className="text-sm text-white/60">{posiciones.length} equipos</span>
        )}
      </div>
      {estilo && <div aria-hidden="true" className={cn('h-1.5', estilo.franja)} />}

      {posiciones.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Todavía no hay equipos clasificados en esta instancia.
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* En mobile: Pos, Equipo y Pts quedan fijos con anchos exactos (12 + 40 = left-52 para Pts);
              la última columna absorbe el espacio sobrante para que los offsets no se corran */}
          <table className="w-full text-sm tabular-nums max-md:min-w-[31rem] max-md:table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="max-md:w-40" />
              <col className="w-14 md:w-24" />
              {COLUMNAS.map((c, i) => (
                <col key={c.sigla} className={i < COLUMNAS.length - 1 ? 'w-12 md:w-20' : 'md:w-20'} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th scope="col" className="sticky left-0 z-10 bg-white py-2.5 pl-3 pr-1 text-left font-medium">
                  <abbr title="Posición" className="no-underline">Pos</abbr>
                </th>
                <th scope="col" className="sticky left-12 z-10 bg-white px-2 py-2.5 text-left font-medium">Equipo</th>
                <th scope="col" className={cn('bg-white px-2 py-2.5 text-center font-semibold text-[#0d2340]', PTS_FIJO)}>
                  <abbr title="Puntos" className="no-underline">Pts</abbr>
                </th>
                {COLUMNAS.map(c => (
                  <th key={c.sigla} scope="col" className={cn('px-2 py-2.5 text-center font-semibold', c.color)}>
                    <abbr title={c.nombre} className="cursor-help no-underline">{c.sigla}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posiciones.map((pos) => {
                const clasificado = corte ? pos.posicion <= corte.posicion : false
                const ultimoClasificado = corte?.posicion === pos.posicion
                const podio = PODIO[pos.posicion] ?? SIN_PODIO

                return (
                  <tr
                    key={pos.equipo.id}
                    className={cn(
                      'group border-b border-slate-100 last:border-0',
                      podio.fondo,
                      ultimoClasificado && 'border-b-2 border-dashed border-b-[#f5a623]/60'
                    )}
                  >
                    <td
                      className={cn(
                        'sticky left-0 z-10 py-3 pl-3 pr-1',
                        podio.fondo,
                        clasificado && 'shadow-[inset_4px_0_0_#f5a623]'
                      )}
                    >
                      <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold', podio.puesto)}>
                        {pos.posicion}
                      </span>
                    </td>

                    <td className={cn('sticky left-12 z-10 px-2 py-3', podio.fondo)}>
                      <Link
                        href={`/equipos/${pos.equipo.slug}`}
                        title={pos.equipo.nombre}
                        className="flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#1f4e78] focus-visible:ring-offset-2 md:gap-3"
                      >
                        <TeamAvatar
                          nombre={pos.equipo.nombre}
                          colorPrimario={pos.equipo.colorPrimario}
                          logo={pos.equipo.logo}
                          className="h-8 w-8 shrink-0 md:h-9 md:w-9"
                          textClassName="text-xs"
                        />
                        <span className="min-w-0 truncate font-semibold text-slate-800 decoration-[#f5a623] decoration-2 underline-offset-4 hover:underline md:overflow-visible md:whitespace-nowrap">
                          {pos.equipo.nombre}
                          {pos.puntosDescontados > 0 && <span className="text-red-600"> (*)</span>}
                        </span>
                      </Link>
                    </td>

                    <td className={cn('px-2 py-3 text-center text-xl font-black text-[#0d2340]', PTS_FIJO, podio.fondo)}>{pos.pts}</td>
                    {COLUMNAS.map(c => (
                      <td key={c.sigla} className={cn('px-2 py-3 text-center font-medium', c.color)}>{pos[c.campo]}</td>
                    ))}
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
