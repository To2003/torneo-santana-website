import Link from 'next/link'
import { Github, Linkedin, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-torneo-primary/20 bg-gradient-to-b from-[#1a3a5c] to-[#0d2340]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
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
          </nav>

          {/* Desarrollador */}
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Web Design by</p>
              <p className="text-sm font-bold text-white">Tomás Aguilar</p>
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <a
                href="https://github.com/To2003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 transition-colors hover:text-torneo-accent"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/tomas-aguilar-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 transition-colors hover:text-torneo-accent"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://tomas-aguilar-portolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 transition-colors hover:text-torneo-accent"
                title="Portfolio"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-white/50 border-t border-white/10 pt-6">
          {new Date().getFullYear()} Torneo Santana
        </p>
      </div>
    </footer>
  )
}
