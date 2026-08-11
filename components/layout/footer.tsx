import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-torneo-primary/20 bg-gradient-to-b from-[#1a3a5c] to-[#0d2340]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <img src="/logo-torneo.png" alt="Torneo Santana" className="h-10 w-10 rounded-full" />
            <span className="text-lg font-bold uppercase text-white">
              Torneo <span className="text-torneo-accent">Santana</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/equipos" className="text-white/70 hover:text-white transition-colors">
              Equipos
            </Link>
            <Link href="/fixture" className="text-white/70 hover:text-white transition-colors">
              Fixture
            </Link>
            <Link href="/resultados" className="text-white/70 hover:text-white transition-colors">
              Resultados
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-white/50">
            {new Date().getFullYear()} Torneo Santana
          </p>
        </div>
      </div>
    </footer>
  )
}
