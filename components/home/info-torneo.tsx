import { CheckCircle, MapPin, ExternalLink } from 'lucide-react'
import type { ConfiguracionTorneo } from '@/lib/types'

interface InfoTorneoProps {
  config: ConfiguracionTorneo
}

export function InfoTorneo({ config }: InfoTorneoProps) {
  // Dirección y enlaces exactos para Maestro Santana 310, San Isidro
  const direccionReal = "Maestro Santana 310, B1642 BQH, Provincia de Buenos Aires";
  const googleMapsUrlReal = "https://maps.google.com/?q=Maestro+Santana+310,+B1642+BQH,+Provincia+de+Buenos+Aires";

  // URL de Embed generada específicamente para esa dirección exacta
  const iframeSrcReal = "https://maps.google.com/maps?q=Maestro%20Santana%20310%20San%20Isidro&t=&z=15&ie=UTF8&iwloc=&output=embed";

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
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-torneo-primary">
                <MapPin className="h-6 w-6" />
                Ubicación
              </h3>
              {/* Prioriza la dirección exacta que pasaste */}
              <p className="mb-4 text-foreground/80 font-semibold text-sm">
                {config.ubicacion && config.ubicacion.length > 5 ? config.ubicacion : direccionReal}
              </p>

              {/* Mapa Interactivo apuntando a Maestro Santana 310 */}
              <div className="overflow-hidden rounded-lg border border-border shadow-inner bg-slate-100 relative group">
                <iframe
                  src={iframeSrcReal}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full grayscale-[10%] transition-all group-hover:grayscale-0"
                />
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center">
              <a
                href={config.googleMapsUrl && config.googleMapsUrl.includes('http') ? config.googleMapsUrl : googleMapsUrlReal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1f4e78] hover:text-[#1f4e78]/80 hover:underline transition-colors bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200/60 shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir ubicación en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}