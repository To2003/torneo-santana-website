'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/equipos', label: 'Equipos' },
  { href: '/fixture', label: 'Fixture' }
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-[#1a3a5c] to-[#0d2340] shadow-lg">
      {/* Volleyball net pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.3) 49%, rgba(255,255,255,0.3) 51%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.3) 49%, rgba(255,255,255,0.3) 51%, transparent 51%)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center">
            {/* Volleyball icon */}
            <svg viewBox="0 0 100 100" className="h-12 w-12">
              <circle cx="50" cy="50" r="45" fill="#FFD54F" stroke="#F9A825" strokeWidth="3" />
              <path d="M50 5 Q50 50 95 50" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
              <path d="M50 5 Q50 50 5 50" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
              <path d="M5 50 Q50 50 50 95" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
              <path d="M95 50 Q50 50 50 95" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
              <path d="M20 20 Q50 50 80 20" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
              <path d="M20 80 Q50 50 80 80" fill="none" stroke="#FFF" strokeWidth="2" opacity="0.6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold uppercase tracking-wider text-white">Torneo</span>
            <span className="text-2xl font-black uppercase tracking-widest text-torneo-accent">Santana</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors',
                  isActive
                    ? 'text-torneo-accent'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="relative border-t border-white/10 md:hidden">
          <div className="flex flex-col px-4 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors',
                    isActive
                      ? 'text-torneo-accent bg-white/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
