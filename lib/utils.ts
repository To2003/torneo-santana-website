import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extrae el ID de video de un link de YouTube en cualquiera de sus formatos
// comunes (watch, youtu.be, embed, live, shorts). Devuelve null si no matchea.
export function extraerYoutubeId(url: string): string | null {
  const patrones = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const patron of patrones) {
    const match = url.match(patron)
    if (match) return match[1]
  }

  return null
}
