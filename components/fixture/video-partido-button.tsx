'use client'

import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { extraerYoutubeId } from '@/lib/utils'

interface VideoPartidoButtonProps {
  link: string
  label?: string
}

export function VideoPartidoButton({ link, label = 'Ver video' }: VideoPartidoButtonProps) {
  const [reproduciendo, setReproduciendo] = useState(false)
  const youtubeId = extraerYoutubeId(link)

  // Si no reconocemos el link como YouTube, no hay miniatura posible:
  // lo mandamos directo afuera
  if (!youtubeId) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg border border-torneo-primary/20 bg-torneo-primary/5 py-2.5 text-sm font-semibold text-torneo-primary transition-colors hover:bg-torneo-primary/10"
      >
        <Play className="h-4 w-4 fill-current" />
        {label}
      </a>
    )
  }

  // Ya se hizo click en la preview: reproducimos el video embebido, ahí mismo
  if (reproduciendo) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={label}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Preview: miniatura real del video con botón de play superpuesto
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setReproduciendo(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-slate-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={label}
          className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 fill-torneo-primary text-torneo-primary" />
          </span>
        </div>
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white">
          {label}
        </span>
      </button>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-torneo-primary hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Ver en YouTube
      </a>
    </div>
  )
}
