import { getProductos } from '@/lib/google-sheets'
import { ProductoCard } from '@/components/tienda/producto-card'

export const metadata = {
  title: 'Tienda | Torneo Santana',
  description: 'Productos oficiales del Torneo Santana de voley.'
}

export default async function TiendaPage() {
  const productos = await getProductos()

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
          {productos.length === 0 ? (
            <p className="text-center italic text-muted-foreground">
              Todavía no hay productos cargados.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
