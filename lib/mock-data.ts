import type { Equipo, Partido, ConfiguracionTorneo } from './types'

export const equiposMock: Equipo[] = []
export const partidosMock: Partido[] = []

export const configuracionMock: ConfiguracionTorneo = {
  nombre: 'Torneo Santana',
  descripcion: 'Cargando...',
  reglas: [],
  ubicacion: 'Maestro Santana 310, B1642 BQH, Provincia de Buenos Aires',
  googleMapsUrl: '',
  fechaInicio: '',
  fechaFin: ''
}