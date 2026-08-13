import type { Equipo, Partido, ConfiguracionTorneo } from './types'

export const equiposMock: Equipo[] = []
export const partidosMock: Partido[] = []

export const configuracionMock: ConfiguracionTorneo = {
  nombre: 'Torneo Santana',
  descripcion: 'El torneo de voley mixto mas emocionante de la zona. Competencia amateur abierta a todos los equipos que quieran participar. ¡Veni a disfrutar del mejor voley!',
  reglas: [
    'Torneo de voley MIXTO: minimo 3 mujeres en cancha en todo momento',
    'Partidos al mejor de 3 sets',
    'Sets a 25 puntos (3er set a 15 puntos)',
    '2 puntos de diferencia para ganar el set',
    'Se otorgan 4 puntos por victoria'
  ],
  ubicacion: 'Maestro Santana 335, B1642 BQH, Provincia de Buenos Aires',
  googleMapsUrl: 'https://maps.google.com/?q=Maestro+Santana+310,+B1642+BQH,+Provincia+de+Buenos+Aires',
  fechaInicio: '15 de Agosto 2026',
  fechaFin: 'Diciembre a confirmar'
}
