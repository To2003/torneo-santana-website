import { notFound } from 'next/navigation'
import Link from 'next/link'
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

  // Calcular estadisticas
  let ganados = 0, perdidos = 0, setsF = 0, setsC = 0
  partidosJugados.forEach(p => {
    const esLocal = p.equipoLocal === equipo.id
    const misSets = esLocal ? (p.setsLocal || 0) : (p.setsVisitante || 0)
    const susSets = esLocal ? (p.setsVisitante || 0) : (p.setsLocal || 0)
    setsF += misSets
    setsC += susSets
    if (misSets > susSets) ganados++
    else perdidos++
  })

  const getEquipoById = (id: string) => equipos.find(e => e.id === id)

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
            {/* Logo */}
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-4xl font-bold shadow-xl"
                 style={{ color: equipo.colorPrimario }}>
              {equipo.nombre.substring(0, 2).toUpperCase()}
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
                  <span className="block text-2xl font-bold text-white">{ganados * 3}</span>
                  <span className="text-xs text-white/80">Puntos</span>
                </div>
              </div>
              
              {/* Social links */}
              <div className="mt-4 flex justify-center gap-3 md:justify-start">
                {equipo.instagram && (
                  <a 
                    href={`https://instagram.com/${equipo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/90"
                    style={{ color: equipo.colorPrimario }}
                  >
                    <Instagram className="h-4 w-4" />
                    {equipo.instagram}
                  </a>
                )}
                {equipo.whatsapp && (
                  <a 
                    href={`https://wa.me/${equipo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contactar
                  </a>
                )}
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
              <div className="grid gap-2 sm:grid-cols-2">
                {equipo.jugadores.map((jugador, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: equipo.colorPrimario }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium">{jugador}</span>
                  </div>
                ))}
              </div>
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
                    const esLocal = partido.equipoLocal === equipo.id
                    
                    return (
                      <div 
                        key={partido.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {esLocal ? 'vs' : '@'} {rival?.nombre || 'TBD'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {partido.dia} - {partido.hora}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Fecha {partido.fecha}
                        </span>
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
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        gano ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                          gano ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {gano ? 'V' : 'D'}
                        </span>
                        <div>
                          <p className="font-medium">
                            {esLocal ? 'vs' : '@'} {rival?.nombre || 'TBD'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Fecha {partido.fecha} - {partido.dia}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">
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
