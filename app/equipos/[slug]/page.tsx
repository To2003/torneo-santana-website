import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Instagram, MessageCircle, Users, Calendar } from 'lucide-react'
import { getEquipoBySlug, getEquipos, getPartidosEquipo } from '@/lib/google-sheets'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const equipo = await getEquipoBySlug(slug)
  if (!equipo) return { title: 'Equipo no encontrado | Torneo Santana' }
  return { title: `${equipo.nombre} | Torneo Santana`, description: `Informacion del equipo ${equipo.nombre}.` }
}

export async function generateStaticParams() {
  const equipos = await getEquipos()
  return equipos.map((equipo) => ({ slug: equipo.slug }))
}

export default async function EquipoDetallePage({ params }: Props) {
  const { slug } = await params
  const [equipo, equipos] = await Promise.all([getEquipoBySlug(slug), getEquipos()])

  if (!equipo) notFound()

  const partidos = await getPartidosEquipo(equipo.id)
  const partidosJugados = partidos.filter(p => p.jugado)
  const proximosPartidos = partidos.filter(p => !p.jugado)

  let ganados = 0, perdidos = 0, g2 = 0, p3 = 0
  partidosJugados.forEach(p => {
    const esLocal = p.equipoLocal === equipo.id
    const misSets = esLocal ? (p.setsLocal || 0) : (p.setsVisitante || 0)
    const susSets = esLocal ? (p.setsVisitante || 0) : (p.setsLocal || 0)
    if (misSets > susSets) {
      ganados++; if (susSets === 0) g2++;
    } else if (susSets > misSets) {
      perdidos++; if (misSets === 1) p3++;
    }
  })

  const puntosTotales = (ganados * 4) + (g2 * 2) + (perdidos * 1) + (p3 * 1)
  const getEquipoById = (id: string) => equipos.find(e => e.id === id)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${equipo.colorPrimario} 0%, ${equipo.colorPrimario}dd 100%)` }}>
        <div className="mx-auto max-w-7xl px-4">
          <Link href="/equipos" className="mb-6 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a equipos
          </Link>
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-4xl font-bold shadow-xl" style={{ color: equipo.colorPrimario }}>
              {equipo.nombre.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">{equipo.nombre}</h1>
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                <div className="rounded-lg bg-white/20 px-4 py-2"><span className="block text-2xl font-bold text-white">{partidosJugados.length}</span><span className="text-xs text-white/80">Partidos</span></div>
                <div className="rounded-lg bg-white/20 px-4 py-2"><span className="block text-2xl font-bold text-white">{ganados}</span><span className="text-xs text-white/80">Ganados</span></div>
                <div className="rounded-lg bg-white/20 px-4 py-2"><span className="block text-2xl font-bold text-white">{perdidos}</span><span className="text-xs text-white/80">Perdidos</span></div>
                <div className="rounded-lg bg-white/20 px-4 py-2"><span className="block text-2xl font-bold text-white">{puntosTotales}</span><span className="text-xs text-white/80">Puntos</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-2 items-start">

            {/* Jugadores */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg h-full">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#1f4e78]"><Users className="h-6 w-6" /> Plantel ({equipo.jugadores.length} jugadores)</h2>
              {equipo.jugadores.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {equipo.jugadores.map((jugador, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 border border-slate-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: equipo.colorPrimario }}>{index + 1}</div>
                      <span className="font-medium text-slate-700">{jugador}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">Lista de buena fe aún no cargada.</p>
              )}
            </div>

            {/* Próximos partidos (DISEÑO MAXIMIZADO) */}
            <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-lg h-full">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#1f4e78]">
                <Calendar className="h-6 w-6" /> Próximos Partidos
              </h2>
              {proximosPartidos.length > 0 ? (
                <div className="flex flex-1 flex-col justify-center space-y-4">
                  {proximosPartidos.slice(0, 3).map((partido) => {
                    const rival = getEquipoById(partido.equipoLocal === equipo.id ? partido.equipoVisitante : partido.equipoLocal)

                    return (
                      <div
                        key={partido.id}
                        className="relative flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300 md:p-8"
                      >
                        {/* Detalles del Encuentro */}
                        <div className="flex flex-col justify-center">
                          <span className="rounded bg-[#1f4e78] px-3.5 py-1.5 text-sm font-black text-white w-fit tracking-wider shadow-sm">
                            FECHA {partido.fecha}
                          </span>
                          <span className="mt-3 text-base font-bold text-slate-500 tracking-wide flex items-center gap-1.5">
                            {partido.hora} | {partido.cancha}
                          </span>
                        </div>

                        {/* Rival e Imagen a Gran Tamaño */}
                        <div className="flex items-center gap-4 text-right sm:gap-6">
                          <div className="flex flex-col justify-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rival</span>
                            <span className="text-lg font-black text-slate-800 md:text-xl">vs {rival?.nombre || 'TBD'}</span>
                          </div>

                          {/* Escudo del Rival Agrandado (h-16 w-16) */}
                          <div
                            className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-black text-white shadow-md border-4 border-white transition-transform hover:scale-105"
                            style={{ backgroundColor: rival?.colorPrimario || '#ccc' }}
                          >
                            {rival?.nombre.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="w-full text-muted-foreground bg-slate-50 p-6 rounded-lg text-center border border-slate-100 italic">No hay partidos programados en el horizonte</p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de partidos */}
          {partidosJugados.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-[#1f4e78]">Resultados</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {partidosJugados.map((partido) => {
                  const rival = getEquipoById(partido.equipoLocal === equipo.id ? partido.equipoVisitante : partido.equipoLocal)
                  const esLocal = partido.equipoLocal === equipo.id
                  const misSets = esLocal ? partido.setsLocal : partido.setsVisitante
                  const susSets = esLocal ? partido.setsVisitante : partido.setsLocal
                  const gano = (misSets || 0) > (susSets || 0)

                  return (
                    <div key={partido.id} className={`flex items-center justify-between rounded-lg p-4 shadow-sm transition-transform hover:-translate-y-[2px] ${gano ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-red-50 border-l-4 border-l-red-500'}`}>
                      <div className="flex items-center gap-4">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black shadow-sm ${gano ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{gano ? 'V' : 'D'}</span>
                        <div>
                          <p className="font-bold text-slate-800">vs {rival?.nombre || 'TBD'}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Fecha {partido.fecha}</p>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${gano ? 'text-green-700' : 'text-red-700'}`}>{misSets} - {susSets}</span>
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