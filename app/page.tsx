import { Hero } from '@/components/home/hero'
import { TablaPosiciones } from '@/components/home/tabla-posiciones'
import { UltimosMVPs } from '@/components/home/ultimos-mvps'
import { InfoTorneo } from '@/components/home/info-torneo'
import { InstagramCarousel } from '@/components/home/instagram-carousel'
import {
  getConfiguracion,
  getTablaPosicionesPorGrupo,
  getUltimosMVPs,
  getEquipos,
  getInstagramPosts
} from '@/lib/google-sheets'

// Datos de respaldo oficiales por si el Sheets falla, viene vacío o está desactualizado
const configRespaldo = {
  nombre: 'Torneo Santana',
  descripcion: 'El torneo de voley mixto mas emocionante de la zona. Competencia amateur los días sábados.',
  reglas: [
    'Partido Ganado: 4 puntos',
    'Bonus por partido ganado en 2 sets (2-0): 2 puntos',
    'Partido perdido: 1 punto',
    'Bonus por partido perdido en 3 sets (1-2): 1 punto',
    'Torneo de voley MIXTO: mínimo 3 mujeres en cancha en todo momento'
  ],
  ubicacion: 'Maestro Santana 335, B1642 BQH, Provincia de Buenos Aires',
  googleMapsUrl: 'https://maps.google.com/?q=Maestro+Santana+310,+B1642+BQH,+Provincia+de+Buenos+Aires',
  fechaInicio: 'Clausura 2026',
  fechaFin: 'Diciembre a confirmar'
}

export default async function HomePage() {
  const [configSheet, posicionesTorneoA, posicionesTorneoB, ultimosMVPs, equipos, instagramPosts] = await Promise.all([
    getConfiguracion(),
    getTablaPosicionesPorGrupo('1'),
    getTablaPosicionesPorGrupo('2'),
    getUltimosMVPs(),
    getEquipos(),
    getInstagramPosts()
  ])

  // LÓGICA DE SEGURIDAD: Si el Sheets viene vacío o sin reglas, inyectamos el respaldo oficial
  const config = {
    nombre: configSheet?.nombre || configRespaldo.nombre,
    descripcion: configSheet?.descripcion || configRespaldo.descripcion,
    ubicacion: configSheet?.ubicacion || configRespaldo.ubicacion,
    googleMapsUrl: configSheet?.googleMapsUrl || configRespaldo.googleMapsUrl,
    fechaInicio: configSheet?.fechaInicio || configRespaldo.fechaInicio,
    fechaFin: configSheet?.fechaFin || configRespaldo.fechaFin,
    // Si la lista de reglas del excel está vacía, mete las 6 reglas oficiales automáticamente
    reglas: configSheet?.reglas && configSheet.reglas.length > 0
      ? configSheet.reglas
      : configRespaldo.reglas
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero config={config} />

      {/* Main Content */}
      <section className="bg-court py-8">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tabla de Posiciones - 2 columnas en desktop */}
            <div className="min-w-0 lg:col-span-2">
              <TablaPosiciones
                torneoA={posicionesTorneoA}
                torneoB={posicionesTorneoB}
              />
            </div>

            {/* Sidebar - Ultimos MVPs */}
            <div className="min-w-0 lg:col-span-1">
              <UltimosMVPs
                partidos={ultimosMVPs}
                equipos={equipos}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel de Instagram */}
      <InstagramCarousel posts={instagramPosts} />

      {/* Info del Torneo */}
      <InfoTorneo config={config} />
    </div>
  )
}