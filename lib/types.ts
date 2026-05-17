// Tipos para el Torneo de Voley

export interface Equipo {
  id: string
  nombre: string
  slug: string
  logo: string
  colorPrimario: string
  jugadores: string[]
  instagram?: string
  whatsapp?: string
}

export interface Partido {
  id: string
  fecha: number // Número de fecha (1, 2, 3...)
  dia: string // "Sábado 19 Octubre"
  hora: string // "14:00"
  equipoLocal: string // ID del equipo
  equipoVisitante: string // ID del equipo
  cancha: string
  setsLocal?: number
  setsVisitante?: number
  puntosLocal?: number[]
  puntosVisitante?: number[]
  jugado: boolean
}

export interface Posicion {
  equipo: Equipo
  posicion: number
  pj: number // Partidos jugados
  g: number // Ganados
  p: number // Perdidos
  sf: number // Sets a favor
  sc: number // Sets en contra
  ds: number // Diferencia de sets
  pts: number // Puntos
}

export interface ConfiguracionTorneo {
  nombre: string
  descripcion: string
  reglas: string[]
  ubicacion: string
  googleMapsUrl?: string
  fechaInicio?: string
  fechaFin?: string
}

export interface FechaFixture {
  numero: number
  dia: string
  partidos: Partido[]
}
