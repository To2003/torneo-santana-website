import type { Equipo, Partido, ConfiguracionTorneo } from './types'

// Equipos reales del torneo
export const equiposMock: Equipo[] = [
  {
    id: '1',
    nombre: 'Antivoley',
    slug: 'antivoley',
    logo: '/equipos/antivoley.png',
    colorPrimario: '#22C55E',
    jugadores: [],
    instagram: '@antivoley'
  },
  {
    id: '2',
    nombre: 'Whisky',
    slug: 'whisky',
    logo: '/equipos/whisky.png',
    colorPrimario: '#D97706',
    jugadores: [],
    instagram: '@whisky'
  },
  {
    id: '3',
    nombre: 'Alter',
    slug: 'alter',
    logo: '/equipos/alter.png',
    colorPrimario: '#3B82F6',
    jugadores: [],
    instagram: '@alter'
  },
  {
    id: '4',
    nombre: 'Exa',
    slug: 'exa',
    logo: '/equipos/exa.png',
    colorPrimario: '#EF4444',
    jugadores: [],
    instagram: '@exa'
  },
  {
    id: '5',
    nombre: 'Los Chicos de Suarez',
    slug: 'los-chicos-de-suarez',
    logo: '/equipos/los-chicos-de-suarez.png',
    colorPrimario: '#8B5CF6',
    jugadores: [],
    instagram: '@loschicosdesuarez'
  },
  {
    id: '6',
    nombre: 'Team Rio',
    slug: 'team-rio',
    logo: '/equipos/team-rio.png',
    colorPrimario: '#06B6D4',
    jugadores: [],
    instagram: '@teamrio'
  },
  {
    id: '7',
    nombre: 'Rejunte',
    slug: 'rejunte',
    logo: '/equipos/rejunte.png',
    colorPrimario: '#F59E0B',
    jugadores: [],
    instagram: '@rejunte'
  },
  {
    id: '8',
    nombre: 'Old Fashion',
    slug: 'old-fashion',
    logo: '/equipos/old-fashion.png',
    colorPrimario: '#1F2937',
    jugadores: [],
    instagram: '@oldfashion'
  },
  {
    id: '9',
    nombre: 'Super Amigos',
    slug: 'super-amigos',
    logo: '/equipos/super-amigos.png',
    colorPrimario: '#DC2626',
    jugadores: [],
    instagram: '@superamigos'
  },
  {
    id: '10',
    nombre: 'Barra Libre',
    slug: 'barra-libre',
    logo: '/equipos/barra-libre.png',
    colorPrimario: '#059669',
    jugadores: [],
    instagram: '@barralibre'
  },
  {
    id: '11',
    nombre: 'Los Lobos',
    slug: 'los-lobos',
    logo: '/equipos/los-lobos.png',
    colorPrimario: '#6B7280',
    jugadores: [],
    instagram: '@loslobos'
  },
  {
    id: '12',
    nombre: 'Team Venezuela',
    slug: 'team-venezuela',
    logo: '/equipos/team-venezuela.png',
    colorPrimario: '#FACC15',
    jugadores: [],
    instagram: '@teamvenezuela'
  },
  {
    id: '13',
    nombre: 'Furiosos',
    slug: 'furiosos',
    logo: '/equipos/furiosos.png',
    colorPrimario: '#EF4444',
    jugadores: [],
    instagram: '@furiosos'
  }
]

// Partidos - Fixture del torneo (solo sabados de 15 a 20hs)
export const partidosMock: Partido[] = [
  // Fecha 1
  { id: '1-1', fecha: 1, dia: 'Sabado 6 Abril', hora: '15:00', equipoLocal: '1', equipoVisitante: '2', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '1-2', fecha: 1, dia: 'Sabado 6 Abril', hora: '16:00', equipoLocal: '3', equipoVisitante: '4', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '1-3', fecha: 1, dia: 'Sabado 6 Abril', hora: '17:00', equipoLocal: '5', equipoVisitante: '6', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },
  { id: '1-4', fecha: 1, dia: 'Sabado 6 Abril', hora: '18:00', equipoLocal: '7', equipoVisitante: '8', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '1-5', fecha: 1, dia: 'Sabado 6 Abril', hora: '19:00', equipoLocal: '9', equipoVisitante: '10', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '1-6', fecha: 1, dia: 'Sabado 6 Abril', hora: '20:00', equipoLocal: '11', equipoVisitante: '12', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  
  // Fecha 2
  { id: '2-1', fecha: 2, dia: 'Sabado 13 Abril', hora: '15:00', equipoLocal: '2', equipoVisitante: '3', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '2-2', fecha: 2, dia: 'Sabado 13 Abril', hora: '16:00', equipoLocal: '4', equipoVisitante: '5', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '2-3', fecha: 2, dia: 'Sabado 13 Abril', hora: '17:00', equipoLocal: '6', equipoVisitante: '7', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '2-4', fecha: 2, dia: 'Sabado 13 Abril', hora: '18:00', equipoLocal: '8', equipoVisitante: '9', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },
  { id: '2-5', fecha: 2, dia: 'Sabado 13 Abril', hora: '19:00', equipoLocal: '10', equipoVisitante: '11', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '2-6', fecha: 2, dia: 'Sabado 13 Abril', hora: '20:00', equipoLocal: '12', equipoVisitante: '13', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  
  // Fecha 3
  { id: '3-1', fecha: 3, dia: 'Sabado 20 Abril', hora: '15:00', equipoLocal: '1', equipoVisitante: '4', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '3-2', fecha: 3, dia: 'Sabado 20 Abril', hora: '16:00', equipoLocal: '3', equipoVisitante: '6', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '3-3', fecha: 3, dia: 'Sabado 20 Abril', hora: '17:00', equipoLocal: '5', equipoVisitante: '8', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '3-4', fecha: 3, dia: 'Sabado 20 Abril', hora: '18:00', equipoLocal: '7', equipoVisitante: '10', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 2, jugado: true },
  { id: '3-5', fecha: 3, dia: 'Sabado 20 Abril', hora: '19:00', equipoLocal: '9', equipoVisitante: '12', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '3-6', fecha: 3, dia: 'Sabado 20 Abril', hora: '20:00', equipoLocal: '11', equipoVisitante: '13', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },

  // Fecha 4
  { id: '4-1', fecha: 4, dia: 'Sabado 27 Abril', hora: '15:00', equipoLocal: '2', equipoVisitante: '5', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '4-2', fecha: 4, dia: 'Sabado 27 Abril', hora: '16:00', equipoLocal: '4', equipoVisitante: '7', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '4-3', fecha: 4, dia: 'Sabado 27 Abril', hora: '17:00', equipoLocal: '6', equipoVisitante: '9', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '4-4', fecha: 4, dia: 'Sabado 27 Abril', hora: '18:00', equipoLocal: '8', equipoVisitante: '11', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '4-5', fecha: 4, dia: 'Sabado 27 Abril', hora: '19:00', equipoLocal: '10', equipoVisitante: '13', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },
  { id: '4-6', fecha: 4, dia: 'Sabado 27 Abril', hora: '20:00', equipoLocal: '1', equipoVisitante: '12', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },

  // Fecha 5
  { id: '5-1', fecha: 5, dia: 'Sabado 4 Mayo', hora: '15:00', equipoLocal: '3', equipoVisitante: '8', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '5-2', fecha: 5, dia: 'Sabado 4 Mayo', hora: '16:00', equipoLocal: '5', equipoVisitante: '10', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '5-3', fecha: 5, dia: 'Sabado 4 Mayo', hora: '17:00', equipoLocal: '7', equipoVisitante: '12', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '5-4', fecha: 5, dia: 'Sabado 4 Mayo', hora: '18:00', equipoLocal: '9', equipoVisitante: '1', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '5-5', fecha: 5, dia: 'Sabado 4 Mayo', hora: '19:00', equipoLocal: '11', equipoVisitante: '2', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '5-6', fecha: 5, dia: 'Sabado 4 Mayo', hora: '20:00', equipoLocal: '4', equipoVisitante: '13', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },

  // Fecha 6
  { id: '6-1', fecha: 6, dia: 'Sabado 11 Mayo', hora: '15:00', equipoLocal: '6', equipoVisitante: '1', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '6-2', fecha: 6, dia: 'Sabado 11 Mayo', hora: '16:00', equipoLocal: '8', equipoVisitante: '2', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '6-3', fecha: 6, dia: 'Sabado 11 Mayo', hora: '17:00', equipoLocal: '10', equipoVisitante: '3', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },
  { id: '6-4', fecha: 6, dia: 'Sabado 11 Mayo', hora: '18:00', equipoLocal: '12', equipoVisitante: '4', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '6-5', fecha: 6, dia: 'Sabado 11 Mayo', hora: '19:00', equipoLocal: '13', equipoVisitante: '5', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '6-6', fecha: 6, dia: 'Sabado 11 Mayo', hora: '20:00', equipoLocal: '7', equipoVisitante: '9', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },

  // Fecha 7
  { id: '7-1', fecha: 7, dia: 'Sabado 18 Mayo', hora: '15:00', equipoLocal: '1', equipoVisitante: '3', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '7-2', fecha: 7, dia: 'Sabado 18 Mayo', hora: '16:00', equipoLocal: '2', equipoVisitante: '6', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '7-3', fecha: 7, dia: 'Sabado 18 Mayo', hora: '17:00', equipoLocal: '4', equipoVisitante: '9', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '7-4', fecha: 7, dia: 'Sabado 18 Mayo', hora: '18:00', equipoLocal: '5', equipoVisitante: '12', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '7-5', fecha: 7, dia: 'Sabado 18 Mayo', hora: '19:00', equipoLocal: '8', equipoVisitante: '13', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },
  { id: '7-6', fecha: 7, dia: 'Sabado 18 Mayo', hora: '20:00', equipoLocal: '10', equipoVisitante: '7', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 2, jugado: true },

  // Fecha 8
  { id: '8-1', fecha: 8, dia: 'Sabado 25 Mayo', hora: '15:00', equipoLocal: '11', equipoVisitante: '1', cancha: 'Cancha 1', setsLocal: 1, setsVisitante: 2, jugado: true },
  { id: '8-2', fecha: 8, dia: 'Sabado 25 Mayo', hora: '16:00', equipoLocal: '13', equipoVisitante: '3', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '8-3', fecha: 8, dia: 'Sabado 25 Mayo', hora: '17:00', equipoLocal: '2', equipoVisitante: '9', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 0, jugado: true },
  { id: '8-4', fecha: 8, dia: 'Sabado 25 Mayo', hora: '18:00', equipoLocal: '4', equipoVisitante: '11', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },
  { id: '8-5', fecha: 8, dia: 'Sabado 25 Mayo', hora: '19:00', equipoLocal: '6', equipoVisitante: '12', cancha: 'Cancha 1', setsLocal: 0, setsVisitante: 2, jugado: true },
  { id: '8-6', fecha: 8, dia: 'Sabado 25 Mayo', hora: '20:00', equipoLocal: '8', equipoVisitante: '10', cancha: 'Cancha 1', setsLocal: 2, setsVisitante: 1, jugado: true },

  // Fecha 9 - Segun la imagen del fixture
  { id: '9-1', fecha: 9, dia: 'Sabado 9 Mayo', hora: '15:00', equipoLocal: '1', equipoVisitante: '2', cancha: 'Cancha 1', jugado: false },
  { id: '9-2', fecha: 9, dia: 'Sabado 9 Mayo', hora: '16:00', equipoLocal: '3', equipoVisitante: '4', cancha: 'Cancha 1', jugado: false },
  { id: '9-3', fecha: 9, dia: 'Sabado 9 Mayo', hora: '17:00', equipoLocal: '5', equipoVisitante: '6', cancha: 'Cancha 1', jugado: false },
  { id: '9-4', fecha: 9, dia: 'Sabado 9 Mayo', hora: '18:00', equipoLocal: '7', equipoVisitante: '8', cancha: 'Cancha 1', jugado: false },
  { id: '9-5', fecha: 9, dia: 'Sabado 9 Mayo', hora: '19:00', equipoLocal: '9', equipoVisitante: '10', cancha: 'Cancha 1', jugado: false },
  { id: '9-6', fecha: 9, dia: 'Sabado 9 Mayo', hora: '20:00', equipoLocal: '11', equipoVisitante: '12', cancha: 'Cancha 1', jugado: false },
  // Furiosos (13) queda libre esta fecha, juega el 16/5
]

export const configuracionMock: ConfiguracionTorneo = {
  nombre: 'Torneo Santana',
  descripcion: 'El torneo de voley mixto mas emocionante de la zona. Competencia amateur abierta a todos los equipos que quieran participar. ¡Veni a disfrutar del mejor voley!',
  reglas: [
    'Torneo de voley MIXTO: minimo 3 mujeres en cancha en todo momento',
    'Partidos al mejor de 3 sets',
    'Sets a 25 puntos (3er set a 15 puntos)',
    '2 puntos de diferencia para ganar el set',
    'Se otorgan 3 puntos por victoria',
    'En caso de empate en puntos, desempata diferencia de sets'
  ],
  ubicacion: 'Club Deportivo Santana - Av. San Martin 1234, Buenos Aires',
  googleMapsUrl: 'https://maps.google.com/?q=-34.6037,-58.3816',
  fechaInicio: '6 de Abril 2024',
  fechaFin: '15 de Junio 2024'
}
