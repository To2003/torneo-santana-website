import { CheckCircle, MapPin, ExternalLink } from 'lucide-react'
import type { ConfiguracionTorneo } from '@/lib/types'

interface InfoTorneoProps {
  config: ConfiguracionTorneo
}

export function InfoTorneo({ config }: InfoTorneoProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Reglas */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-torneo-primary">
              <CheckCircle className="h-6 w-6" />
              Reglas del Torneo
            </h3>
            <ul className="space-y-3">
              {config.reglas.map((regla, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-torneo-accent text-sm font-bold text-black">
                    {index + 1}
                  </span>
                  <span className="text-foreground/80">{regla}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ubicación */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-torneo-primary">
              <MapPin className="h-6 w-6" />
              Ubicacion
            </h3>
            <p className="mb-4 text-foreground/80">{config.ubicacion}</p>
            
            {/* Map placeholder */}
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <div className="aspect-video bg-gradient-to-br from-torneo-primary/20 to-torneo-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-torneo-primary/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Mapa del club</p>
                </div>
              </div>
            </div>
            
            {config.googleMapsUrl && (
              <a 
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-torneo-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir en Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
