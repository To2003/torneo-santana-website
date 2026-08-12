'use client'

import { useState } from 'react'
import { Instagram, ImageOff } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import type { InstagramPost } from '@/lib/types'

function InstagramSlide({ post }: { post: InstagramPost }) {
  const [fallo, setFallo] = useState(false)

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-md transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {fallo ? (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imagen}
            alt={post.texto || 'Publicación de Instagram'}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={() => setFallo(true)}
          />
        )}
      </div>
      {post.texto && (
        <p className="line-clamp-2 p-2 text-center text-xs font-medium text-muted-foreground">
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
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 flex items-center justify-center gap-2 text-2xl font-black uppercase tracking-tight text-torneo-primary">
          <Instagram className="h-6 w-6" />
          Seguinos en Instagram
        </h2>

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
