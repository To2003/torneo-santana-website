import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Equipo } from '@/lib/types'

interface EquipoCardProps {
  equipo: Equipo
}

export function EquipoCard({ equipo }: EquipoCardProps) {
  return (
    <Link
      href={`/equipos/${equipo.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
    >
      {/* Logo area */}
      <div
        className="relative flex h-32 items-center justify-center"
        style={{ backgroundColor: `${equipo.colorPrimario}15` }}
      >
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: equipo.colorPrimario }}>
          {equipo.logo && !equipo.logo.includes('default.png') ? (
            <img src={equipo.logo} alt={equipo.nombre} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            equipo.nombre.substring(0, 2).toUpperCase()
          )}
        </div>

        {/* Color accent bar */}
        <div
          className="absolute bottom-0 left-0 h-1 w-full"
          style={{ backgroundColor: equipo.colorPrimario }}
        />
      </div>

      {/* Team name */}
      <div className="p-4 text-center">
        <h3 className="mb-3 text-lg font-bold uppercase tracking-wide text-foreground">
          {equipo.nombre}
        </h3>

        {/* Ver Perfil button */}
        <span
          className="inline-block rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: equipo.colorPrimario }}
        >
          Ver Perfil
        </span>
      </div>
    </Link>
  )
}
