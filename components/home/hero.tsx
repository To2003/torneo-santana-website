import { MapPin, Calendar, Trophy } from 'lucide-react'
import type { ConfiguracionTorneo } from '@/lib/types'

interface HeroProps {
  config: ConfiguracionTorneo
}

export function Hero({ config }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12 md:py-16">
      {/* Volleyball net pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.5) 49%, rgba(255,255,255,0.5) 51%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.5) 49%, rgba(255,255,255,0.5) 51%, transparent 51%)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Decorative volleyball */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-torneo-accent/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-torneo-accent/10 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-torneo-accent/20 px-4 py-2">
            <Trophy className="h-4 w-4 text-torneo-accent" />
            <span className="text-sm font-semibold text-torneo-accent">Temporada 2024</span>
          </div>
          
          {/* Title */}
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            <span className="text-balance">Bienvenidos al</span>
            <br />
            <span className="text-torneo-accent">{config.nombre}</span>
          </h1>
          
          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 text-pretty">
            {config.descripcion}
          </p>
          
          {/* Info badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
            {config.fechaInicio && (
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2">
                <Calendar className="h-4 w-4 text-torneo-accent" />
                <span>{config.fechaInicio} - {config.fechaFin}</span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2">
              <MapPin className="h-4 w-4 text-torneo-accent" />
              <span>{config.ubicacion.split(' - ')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
