import { ShoppingBag } from 'lucide-react'
import { getProductos, getEstadoTienda } from '@/lib/google-sheets'
import { TiendaCatalogo } from '@/components/tienda/tienda-catalogo'

export const metadata = {
  title: 'Tienda | Torneo Santana',
  description: 'Productos oficiales del Torneo Santana de voley.'
}

export default async function TiendaPage() {
  const [productos, tiendaAbierta] = await Promise.all([
    getProductos(),
    getEstadoTienda()
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#1a3a5c] via-[#1a5f7a] to-[#0d2340] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Tienda <span className="text-torneo-accent">Oficial</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Productos del Torneo Santana
          </p>
        </div>
      </section>

      {/* Productos */}
      <section className="bg-court py-12">
        <div className="relative mx-auto max-w-7xl px-4">
          {!tiendaAbierta ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center shadow-lg">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
              <h2 className="text-lg font-bold text-foreground">Tienda cerrada temporalmente</h2>
              <p className="text-sm text-muted-foreground">
                Estamos actualizando la tienda. Volvé a pasar en un rato.
              </p>
            </div>
          ) : productos.length === 0 ? (
            <p className="text-center italic text-muted-foreground">
              Todavía no hay productos cargados.
            </p>
          ) : (
            <TiendaCatalogo productos={productos} />
          )}
        </div>
      </section>
    </div>
  )
}
