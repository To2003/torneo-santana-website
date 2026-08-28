'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProductoCard } from './producto-card'
import type { Producto } from '@/lib/types'

export function TiendaCatalogo({ productos }: { productos: Producto[] }) {
  const [filtro, setFiltro] = useState<string | null>(null)

  // Categorías tal cual aparecen en la hoja, sin duplicados. Si mañana
  // agregan una nueva ("Accesorios", etc.) aparece sola, sin tocar código
  const categorias = useMemo(() => {
    const vistas = new Set<string>()
    const lista: string[] = []
    productos.forEach((p) => {
      if (p.tipo && !vistas.has(p.tipo)) {
        vistas.add(p.tipo)
        lista.push(p.tipo)
      }
    })
    return lista
  }, [productos])

  const productosFiltrados = filtro ? productos.filter((p) => p.tipo === filtro) : productos

  return (
    <div className="space-y-6">
      {/* Con una sola categoría no hace falta mostrar filtros */}
      {categorias.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setFiltro(null)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors',
              filtro === null
                ? 'border-torneo-primary bg-torneo-primary text-white'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            )}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setFiltro(categoria)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors',
                filtro === categoria
                  ? 'border-torneo-primary bg-torneo-primary text-white'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              )}
            >
              {categoria}
            </button>
          ))}
        </div>
      )}

      {productosFiltrados.length === 0 ? (
        <p className="text-center italic text-muted-foreground">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  )
}
