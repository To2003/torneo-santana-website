'use client'

import { useState } from 'react'
import { Instagram, ImageOff } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import type { InstagramPost } from '@/lib/types'

const GRADIENTE_IG = 'bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]'

function InstagramSlide({ post }: { post: InstagramPost }) {
  const [fallo, setFallo] = useState(false)

  return (
    <a href={post.link} target="_blank" rel="noopener noreferrer" className="group block">
      {/* Anillo degradado estilo "historia" de Instagram */}
      <div className={`rounded-2xl p-[3px] shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${GRADIENTE_IG}`}>
        <div className="relative aspect-square overflow-hidden rounded-[14px] bg-slate-100 ring-2 ring-white">
          {fallo ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <ImageOff className="h-7 w-7" />
              <span className="text-[10px] font-medium">Sin imagen</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.imagen}
              alt={post.texto || 'Publicación de Instagram'}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
              onError={() => setFallo(true)}
            />
          )}

          {/* Overlay al pasar el mouse */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
            <Instagram className="h-8 w-8 text-white drop-shadow-md" />
          </div>
        </div>
      </div>

      {post.texto && (
        <p className="mt-2 line-clamp-2 text-center text-xs font-medium text-muted-foreground">
          {post.texto}
        </p>
      )}
    </a>
  )
}

interface InstagramCarouselProps {
  posts: InstagramPost[]
}

export function InstagramCarousel({ posts }: InstagramCarouselProps) {
  if (posts.length === 0) return null

  return (
    <section className="relative overflow-hidden py-14">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#feda75]/10 via-[#d62976]/5 to-[#4f5bd5]/10" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#d62976]/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#4f5bd5]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${GRADIENTE_IG}`}>
            <Instagram className="h-6 w-6 text-white" />
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-torneo-primary sm:text-3xl">
            Seguinos en Instagram
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Las últimas fotos del torneo</p>
        </div>

        <div className="relative px-0 sm:px-12">
          <Carousel opts={{ align: 'start', loop: posts.length > 4 }} className="mx-auto max-w-5xl">
            <CarouselContent>
              {posts.map((post) => (
                <CarouselItem key={post.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                  <InstagramSlide post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
