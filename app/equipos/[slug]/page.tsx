import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Instagram, MessageCircle, Users } from 'lucide-react'
import { getEquipoBySlug, getEquipos, getPartidosEquipo } from '@/lib/google-sheets'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const equipo = await getEquipoBySlug(slug)

  if (!equipo) {
    return { title: 'Equipo no encontrado | Torneo Santana' }
  }

  return {
    title: `${equipo.nombre} | Torneo Santana`,
    description: `Informacion del equipo ${equipo.nombre} en el Torneo Santana de voley.`
  }
}

export async function generateStaticParams() {
  const equipos = await getEquipos()
  return equipos.map((equipo) => ({ slug: equipo.slug }))
}

export default async function EquipoDetallePage({ params }: Props) {
  const { slug } = await params
  const [equipo, equipos] = await Promise.all([
    getEquipoBySlug(slug),
    getEquipos()
  ])

  if (!equipo) {
    notFound()
  }

  const partidos = await getPartidosEquipo(equipo.id)
  const partidosJugados = partidos.filter(p => p.jugado)
  const proximosPartidos = partidos.filter(p => !p.jugado)

  // Calcular estadisticas con el sistema oficial (Voley)
  let ganados = 0, perdidos = 0, g2 = 0, p3 = 0

  partidosJugados.forEach(p => {
    const esLocal = p.equipoLocal === equipo.id
    const misSets = esLocal ? (p.setsLocal || 0) : (p.setsVisitante || 0)
    const susSets = esLocal ? (p.setsVisitante || 0) : (p.setsLocal || 0)

    if (misSets > susSets) {
      ganados++
      if (susSets === 0) g2++
    } else if (susSets > misSets) {
      perdidos++
      if (misSets === 1) p3++
    }
  })

  // Los puntos reales de este equipo en la tabla
  const puntosTotales = (ganados * 4) + (g2 * 2) + (perdidos * 1) + (p3 * 1)

  const getEquipoById = (id: string) => equipos.find(e => e.id === id)

  // Verificamos si tiene un logo personalizado válido (que no sea el default.png que poníamos por código)
  const tieneLogo = equipo.logo && !equipo.logo.includes('default.png')

  return (
    <div className="min-h-screen">
      {/* Header con color del equipo */}
      <section
        className="py-12"
        style={{
          background: `linear-gradient(135deg, ${equipo.colorPrimario} 0%, ${equipo.colorPrimario}dd 100%)`
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          {/* Back button */}
          <Link
            href="/equipos"
            className="mb-6 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a equipos
          </Link>

          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Logo o Iniciales */}
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-4xl font-bold shadow-xl"
              style={{ color: equipo.colorPrimario }}>
              {tieneLogo ? (
                // Usamos la etiqueta <img> nativa para evitar problemas de next.config con Imgur
                <img
                  src={equipo.logo}
                  alt={`Escudo de ${equipo.nombre}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                equipo.nombre.substring(0, 2).toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                {equipo.nombre}
              </h1>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                <div className="rounded-lg bg-white/20 px-4 py-2">
                  <span className="block text-2xl font-bold text-white">{partidosJugados.length}</span>
                  <span className="text-xs text-white/80">Partidos</span>
                </div>
                <div className="rounded-lg bg-white/20 px-4 py-2">
                  <span className="block text-2xl font-bold text-white">{ganados}</span>
                  <span className="text-xs text-white/80">Ganados</span>
                </div>
                <div className="rounded-lg bg-white/20 px-4 py-2">
                  <span className="block text-2xl font-bold text-white">{perdidos}</span>
                  <span className="text-xs text-white/80">Perdidos</span>
                </div>
                <div className="rounded-lg bg-white/20 px-4 py-2">
                  <span className="block text-2xl font-bold text-white">{puntosTotales}</span>
                  <span className="text-xs text-white/80">Puntos</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Jugadores */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-torneo-primary">
                <Users className="h-6 w-6" />
                Plantel ({equipo.jugadores.length} jugadores)
              </h2>
              {equipo.jugadores.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {equipo.jugadores.map((jugador, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                        style={{ backgroundColor: equipo.colorPrimario }}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-700">{jugador}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">Lista de buena fe aún no cargada.</p>
              )}
            </div>

            {/* Proximos partidos */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-torneo-primary">
                Proximos Partidos
              </h2>
              {proximosPartidos.length > 0 ? (
                <div className="space-y-3">
                  {proximosPartidos.slice(0, 5).map((partido) => {
                    const rival = getEquipoById(
                      partido.equipoLocal === equipo.id
                        ? partido.equipoVisitante
                        : partido.equipoLocal
                    )

                    return (
                      <div
                        key={partido.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-slate-100"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            vs {rival?.nombre || 'TBD'}
                          </p>
                          <p className="text-sm text-slate-500">
                            Fecha {partido.fecha} - {partido.hora}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay partidos programados</p>
              )}
            </div>
          </div>

          {/* Historial de partidos */}
          {partidosJugados.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-torneo-primary">
                Resultados
              </h2>
              <div className="space-y-3">
                {partidosJugados.map((partido) => {
                  const rival = getEquipoById(
                    partido.equipoLocal === equipo.id
                      ? partido.equipoVisitante
                      : partido.equipoLocal
                  )
                  const esLocal = partido.equipoLocal === equipo.id
                  const misSets = esLocal ? partido.setsLocal : partido.setsVisitante
                  const susSets = esLocal ? partido.setsVisitante : partido.setsLocal
                  const gano = (misSets || 0) > (susSets || 0)

                  return (
                    <div
                      key={partido.id}
                      className={`flex items-center justify-between rounded-lg p-4 shadow-sm transition-transform hover:-translate-y-[2px] ${gano ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-red-50 border-l-4 border-l-red-500'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow-sm ${gano ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                          {gano ? 'V' : 'D'}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">
                            vs {rival?.nombre || 'TBD'}
                          </p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Fecha {partido.fecha}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${gano ? 'text-green-700' : 'text-red-700'}`}>
                        {misSets} - {susSets}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}