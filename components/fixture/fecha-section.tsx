'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PartidoCard } from './partido-card'
import { VideoPartidoButton } from './video-partido-button'
import { TeamAvatar } from '@/components/shared/team-avatar'
import type { Partido, Equipo } from '@/lib/types'

interface FechaSectionProps {
  fecha: number
  dia: string
  partidos: Partido[]
  equipos: Equipo[]
  showResultados?: boolean
  equipoLibre?: Equipo | null
  defaultExpanded?: boolean
  linkVideo?: string
}

function EquipoLibreCard({ equipo }: { equipo: Equipo }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-slate-50/60 p-6 text-center">
      <TeamAvatar
        nombre={equipo.nombre}
        colorPrimario={equipo.colorPrimario}
        logo={equipo.logo}
        className="h-16 w-16 shadow-md"
        textClassName="text-xl"
      />
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Descansa esta fecha</span>
        <span className="block text-base font-bold text-slate-700">{equipo.nombre}</span>
      </div>
    </div>
  )
}

export function FechaSection({ fecha, dia, partidos, equipos, showResultados = false, equipoLibre, defaultExpanded = true, linkVideo }: FechaSectionProps) {
  const [expandido, setExpandido] = useState(defaultExpanded)
  const getEquipo = (id: string) => equipos.find(e => e.id === id)

  // Agrupar por dia
  const partidosPorDia = partidos.reduce((acc, partido) => {
    const key = partido.dia
    if (!acc[key]) acc[key] = []
    acc[key].push(partido)
    return acc
  }, {} as Record<string, Partido[]>)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      {/* Header (clickeable para solapar/desplegar) */}
      <button
        type="button"
        onClick={() => setExpandido((v) => !v)}
        className="flex w-full items-center gap-4 bg-gradient-to-r from-torneo-primary to-torneo-primary-dark px-6 py-4 text-left"
        aria-expanded={expandido}
      >
        <span className="h-5 w-5 shrink-0" />
        <h3 className="flex-1 text-center text-xl font-bold uppercase tracking-wider text-white">
          Fecha {fecha}
        </h3>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-white transition-transform', expandido && 'rotate-180')} />
      </button>

      {/* Partidos agrupados por dia */}
      {expandido && (
      <div className="divide-y divide-border">
        {Object.entries(partidosPorDia).map(([diaPartido, partidosDia], idxDia, dias) => {
          const esUltimoDia = idxDia === dias.length - 1

          return (
            <div key={diaPartido}>
              {/* Dia header */}
              <div className="bg-torneo-accent px-4 py-2">
                <h4 className="text-center font-semibold text-black uppercase tracking-wide">
                  {diaPartido}
                </h4>
              </div>

              {/* Partidos del dia */}
              <div className="grid gap-4 p-4 md:grid-cols-2">
                {partidosDia.map((partido) => {
                  const equipoLocal = getEquipo(partido.equipoLocal)
                  const equipoVisitante = getEquipo(partido.equipoVisitante)

                  if (!equipoLocal || !equipoVisitante) return null

                  return (
                    <PartidoCard
                      key={partido.id}
                      partido={partido}
                      equipoLocal={equipoLocal}
                      equipoVisitante={equipoVisitante}
                      showResultado={showResultados}
                    />
                  )
                })}
                {esUltimoDia && equipoLibre && <EquipoLibreCard equipo={equipoLibre} />}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {expandido && linkVideo && (
        <div className="border-t border-border p-4">
          <VideoPartidoButton link={linkVideo} label={`Ver video de la Fecha ${fecha}`} />
        </div>
      )}
    </div>
  )
}
