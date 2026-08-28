'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Trash2, MessageCircle } from 'lucide-react'
import { useCart } from './cart-context'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger
} from '@/components/ui/sheet'

const WHATSAPP_NUMERO = '5491162482927'

function formatearPrecio(n: number) {
  return `$${n.toLocaleString('es-AR')}`
}

export function CarritoBoton() {
  const [open, setOpen] = useState(false)
  const { items, cambiarCantidad, quitarItem, totalItems, totalPrecio } = useCart()

  const mensajeWhatsapp = () => {
    const lineas = items.map((item) => {
      const detalle = [item.talle && `Talle: ${item.talle}`, item.color && `Color: ${item.color}`]
        .filter(Boolean)
        .join(', ')
      return `- ${item.nombre}${detalle ? ` (${detalle})` : ''} x${item.cantidad} - ${formatearPrecio(item.precio * item.cantidad)}`
    }).join('\n')

    return `¡Hola! Quiero comprar:\n${lineas}\n\nTotal: ${formatearPrecio(totalPrecio)}`
  }

  const linkWhatsapp = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensajeWhatsapp())}`

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative rounded-md p-2 text-white transition-colors hover:bg-white/10"
          aria-label="Ver carrito"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-torneo-accent text-[10px] font-bold text-black">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Todavía no agregaste nada al carrito.
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{item.nombre}</p>
                    {(item.talle || item.color) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.talle && `Talle ${item.talle}`, item.color && `Color ${item.color}`].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold text-torneo-primary">{formatearPrecio(item.precio)}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-muted"
                        aria-label="Restar"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-muted"
                        aria-label="Sumar"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => quitarItem(item.id)}
                    aria-label="Quitar del carrito"
                    className="text-muted-foreground transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t border-border">
              <div className="flex items-center justify-between text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatearPrecio(totalPrecio)}</span>
              </div>
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5a]"
              >
                <MessageCircle className="h-4 w-4" />
                Confirmar compra por WhatsApp
              </a>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
