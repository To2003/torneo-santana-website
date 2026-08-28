'use client'

import { useState } from 'react'
import { ShoppingCart, ImageOff } from 'lucide-react'
import { useCart } from './cart-context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Producto } from '@/lib/types'

function formatearPrecio(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export function ProductoCard({ producto }: { producto: Producto }) {
  const { agregarItem } = useCart()
  const [talle, setTalle] = useState<string | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)
  const [imagenError, setImagenError] = useState(false)
  const [agregado, setAgregado] = useState(false)

  const necesitaTalle = producto.talles.length > 0
  const necesitaColor = producto.colores.length > 0
  const puedeAgregar = (!necesitaTalle || talle) && (!necesitaColor || color)

  const handleAgregar = () => {
    if (!puedeAgregar) return

    const idLinea = [producto.id, talle, color].filter(Boolean).join('-')
    agregarItem({
      id: idLinea,
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      talle,
      color
    })

    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md transition-shadow hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center bg-slate-100">
        {producto.imagen && !imagenError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImagenError(true)}
          />
        ) : (
          <ImageOff className="h-10 w-10 text-muted-foreground/40" />
        )}
        {producto.tipo && (
          <span className="absolute left-2 top-2 rounded-full bg-torneo-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {producto.tipo}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold uppercase tracking-wide text-foreground">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
        )}
        <span className="text-lg font-black text-torneo-primary">{formatearPrecio(producto.precio)}</span>

        {necesitaTalle && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-14 shrink-0 text-muted-foreground">Talle</span>
            <Select value={talle} onValueChange={setTalle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegí un talle" />
              </SelectTrigger>
              <SelectContent>
                {producto.talles.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {necesitaColor && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-14 shrink-0 text-muted-foreground">Color</span>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegí un color" />
              </SelectTrigger>
              <SelectContent>
                {producto.colores.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <button
          type="button"
          onClick={handleAgregar}
          disabled={!puedeAgregar}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-torneo-primary py-2 text-sm font-semibold text-white transition-colors hover:bg-torneo-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {agregado ? '¡Agregado!' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
