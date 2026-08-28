// Tipos para el Torneo de Voley

export interface Equipo {
  id: string
  nombre: string
  slug: string
  colorPrimario: string
  jugadores: string[]
  instagram?: string
  whatsapp?: string
  grupo: '1' | '2'
  copaDeOro: boolean
  playoff: boolean
  logo?: string
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
  mvp?: string
}

export interface Posicion {
  equipo: Equipo
  posicion: number
  pj: number // Partidos jugados
  pg: number // Partidos ganados
  pp: number // Partidos perdidos
  g2: number // Bonus ganados en 2 sets
  p3: number // Bonus perdidos en 3 sets
  pts: number // Puntos totales (ya con sanciones descontadas)
  puntosDescontados: number // Suma de puntos restados por sanciones
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

export interface HabilitacionTorneos {
  copaDeOro: boolean
  playoff: boolean
}

export interface InstagramPost {
  id: string
  imagen: string
  link: string
  texto?: string
}

export interface Sancion {
  id: string
  equipoNombre: string // nombre a mostrar (el del equipo matcheado, o el crudo de la hoja si no matcheó)
  equipoId?: string // id del equipo si se pudo matchear
  causa: string
  puntos: number // 0 si la sanción no descuenta puntos
  jugador?: string // vacío si la sanción es al equipo entero
  fechasSuspension: number // 0 si no hay suspensión
}

export interface JugadorBuenaFe {
  id: string
  nombre: string
  apodo?: string
  equipoId?: string // id del equipo si se pudo matchear
  equipoNombre: string // nombre a mostrar (el matcheado, o el crudo de la hoja si no matcheó)
}

export interface JugadorConEstadisticas {
  nombre: string
  apodo?: string
  mvps: number
  sanciones: number
}

export interface Producto {
  id: string
  nombre: string
  tipo: string
  precio: number
  descripcion: string
  imagen?: string
  talles: string[]
  colores: string[]
}

export interface ItemCarrito {
  id: string // productoId + talle + color: clave única de esa combinación
  productoId: string
  nombre: string
  precio: number
  imagen?: string
  talle?: string
  color?: string
  cantidad: number
}
