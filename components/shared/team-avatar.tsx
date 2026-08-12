'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TeamAvatarProps {
  nombre: string
  colorPrimario: string
  logo?: string
  className?: string
  textClassName?: string
  // 'solido': fondo de color, texto blanco (uso por defecto)
  // 'contorno': fondo blanco, texto/borde del color del equipo (header de detalle)
  variant?: 'solido' | 'contorno'
}

export function TeamAvatar({ nombre, colorPrimario, logo, className, textClassName, variant = 'solido' }: TeamAvatarProps) {
  const [fallo, setFallo] = useState(false)
  const mostrarLogo = Boolean(logo) && !fallo

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold shadow-sm',
        variant === 'solido' ? 'border border-slate-200 text-white' : 'bg-white',
        className
      )}
      style={{
        backgroundColor: variant === 'solido' ? colorPrimario : undefined,
        color: variant === 'contorno' ? colorPrimario : undefined,
      }}
    >
      {mostrarLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={nombre}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFallo(true)}
        />
      ) : (
        <span className={textClassName}>{nombre.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  )
}
