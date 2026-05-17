import { EquipoGrid } from '@/components/equipos/equipo-grid'
import { getEquipos } from '@/lib/google-sheets'

export const metadata = {
  title: 'Equipos | Torneo Santana',
  description: 'Conoce todos los equipos participantes del Torneo Santana de voley.'
}

export default async function EquiposPage() {
  const equipos = await getEquipos()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Equipos <span className="text-torneo-accent">Participantes</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            {equipos.length} equipos compitiendo en esta temporada
          </p>
        </div>
      </section>

      {/* Grid de equipos */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl px-4">
          <EquipoGrid equipos={equipos} />
        </div>
      </section>
    </div>
  )
}
