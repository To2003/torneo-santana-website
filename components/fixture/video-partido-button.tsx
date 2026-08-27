'use client'

import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { extraerYoutubeId } from '@/lib/utils'

export function VideoPartidoButton({ link }: { link: string }) {
  const [open, setOpen] = useState(false)
  const youtubeId = extraerYoutubeId(link)

  // Si no reconocemos el link como YouTube, lo abrimos directo afuera
  // (no tiene sentido embeberlo a ciegas)
  if (!youtubeId) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-torneo-primary/20 bg-torneo-primary/5 py-2 text-sm font-semibold text-torneo-primary transition-colors hover:bg-torneo-primary/10"
      >
        <Play className="h-4 w-4 fill-current" />
        Ver video
      </a>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-torneo-primary/20 bg-torneo-primary/5 py-2 text-sm font-semibold text-torneo-primary transition-colors hover:bg-torneo-primary/10"
      >
        <Play className="h-4 w-4 fill-current" />
        Ver video
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl gap-3 p-4 sm:max-w-3xl">
          <DialogTitle className="sr-only">Video del partido</DialogTitle>

          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            {open && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
                title="Video del partido"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm font-medium text-torneo-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir en YouTube
          </a>
        </DialogContent>
      </Dialog>
    </>
  )
}
