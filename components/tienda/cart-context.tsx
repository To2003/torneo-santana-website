'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ItemCarrito } from '@/lib/types'

interface CartContextValue {
  items: ItemCarrito[]
  agregarItem: (item: Omit<ItemCarrito, 'cantidad'> & { cantidad?: number }) => void
  quitarItem: (id: string) => void
  cambiarCantidad: (id: string, cantidad: number) => void
  vaciarCarrito: () => void
  totalItems: number
  totalPrecio: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'torneo-santana-carrito'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [cargado, setCargado] = useState(false)

  // Recuperamos el carrito guardado en este navegador (si hay)
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY)
      if (guardado) setItems(JSON.parse(guardado))
    } catch {
      // localStorage no disponible o dato corrupto: arrancamos con carrito vacío
    } finally {
      setCargado(true)
    }
  }, [])

  // Guardamos cada cambio, pero recién después de haber cargado lo existente
  // (si no, pisaríamos el carrito guardado con un array vacío al montar)
  useEffect(() => {
    if (!cargado) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // si falla el guardado (ej. modo privado) no rompemos nada
    }
  }, [items, cargado])

  const agregarItem: CartContextValue['agregarItem'] = (item) => {
    setItems(prev => {
      const existente = prev.find(i => i.id === item.id)
      if (existente) {
        return prev.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + (item.cantidad ?? 1) } : i)
      }
      return [...prev, { ...item, cantidad: item.cantidad ?? 1 }]
    })
  }

  const quitarItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const cambiarCantidad = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      quitarItem(id)
      return
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }

  const vaciarCarrito = () => setItems([])

  const totalItems = items.reduce((suma, i) => suma + i.cantidad, 0)
  const totalPrecio = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  return (
    <CartContext.Provider value={{ items, agregarItem, quitarItem, cambiarCantidad, vaciarCarrito, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de un CartProvider')
  return ctx
}
