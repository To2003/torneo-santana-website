import type { Equipo, Partido, ConfiguracionTorneo } from './types'
import { equiposMock, partidosMock, configuracionMock } from './mock-data'

// Configuración de Google Sheets
const SHEET_ID = process.env.GOOGLE_SHEETS_ID
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY

// Cache de 60 segundos para evitar muchas requests
const CACHE_REVALIDATE = 60

interface SheetResponse {
  values: string[][]
}

// Función genérica para obtener datos de una hoja
async function getSheetData(sheetName: string): Promise<string[][] | null> {
  if (!SHEET_ID || !API_KEY) {
    console.log('[v0] Google Sheets no configurado, usando datos mock')
    return null
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`
    const res = await fetch(url, { 
      next: { revalidate: CACHE_REVALIDATE }
    })

    if (!res.ok) {
      console.error('[v0] Error fetching sheet:', sheetName, res.status)
      return null
    }

    const data: SheetResponse = await res.json()
    return data.values || []
  } catch (error) {
    console.error('[v0] Error fetching Google Sheets:', error)
    return null
  }
}

// Obtener equipos desde Google Sheets o mock
export async function getEquipos(): Promise<Equipo[]> {
  const data = await getSheetData('Equipos')
  
  if (!data || data.length < 2) {
    return equiposMock
  }

  // Saltar la fila de encabezados
  const rows = data.slice(1)
  
  return rows.map((row, index) => ({
    id: String(index + 1),
    nombre: row[0] || '',
    slug: (row[0] || '').toLowerCase().replace(/\s+/g, '-'),
    logo: row[1] || `/equipos/default.png`,
    colorPrimario: row[2] || '#1a5f7a',
    jugadores: (row[3] || '').split(',').map(j => j.trim()).filter(Boolean),
    instagram: row[4] || undefined,
    whatsapp: row[5] || undefined
  }))
}

// Obtener configuración del torneo
export async function getConfiguracion(): Promise<ConfiguracionTorneo> {
  const data = await getSheetData('Configuracion')
  
  if (!data || data.length < 2) {
    return configuracionMock
  }

  // La configuración está en formato clave-valor en columnas A y B
  const config: Record<string, string> = {}
  data.slice(1).forEach(row => {
    if (row[0] && row[1]) {
      config[row[0].toLowerCase()] = row[1]
    }
  })

  return {
    nombre: config['nombre'] || configuracionMock.nombre,
    descripcion: config['descripcion'] || configuracionMock.descripcion,
    reglas: (config['reglas'] || '').split('|').filter(Boolean),
    ubicacion: config['ubicacion'] || configuracionMock.ubicacion,
    googleMapsUrl: config['googlemapsurl'] || configuracionMock.googleMapsUrl,
    fechaInicio: config['fechainicio'],
    fechaFin: config['fechafin']
  }
}

// Obtener partidos de una fecha específica
export async function getPartidosFecha(numeroFecha: number): Promise<Partido[]> {
  const data = await getSheetData(`Fecha ${numeroFecha}`)
  
  if (!data || data.length < 2) {
    // Devolver partidos mock de esa fecha
    return partidosMock.filter(p => p.fecha === numeroFecha)
  }

  const rows = data.slice(1)
  
  return rows.map((row, index) => ({
    id: `${numeroFecha}-${index + 1}`,
    fecha: numeroFecha,
    dia: row[0] || '',
    hora: row[1] || '',
    equipoLocal: row[2] || '',
    equipoVisitante: row[3] || '',
    cancha: row[4] || 'Cancha 1',
    setsLocal: row[5] ? parseInt(row[5]) : undefined,
    setsVisitante: row[6] ? parseInt(row[6]) : undefined,
    jugado: Boolean(row[5] && row[6])
  }))
}

// Obtener todos los partidos de todas las fechas
export async function getTodosLosPartidos(): Promise<Partido[]> {
  // Si no hay Google Sheets configurado, usar mock
  if (!SHEET_ID || !API_KEY) {
    return partidosMock
  }

  // Intentar cargar todas las fechas (máximo 20 fechas)
  const partidos: Partido[] = []
  
  for (let fecha = 1; fecha <= 20; fecha++) {
    const partidosFecha = await getPartidosFecha(fecha)
    if (partidosFecha.length === 0) break
    partidos.push(...partidosFecha)
  }

  return partidos.length > 0 ? partidos : partidosMock
}

// Obtener próximos partidos (no jugados)
export async function getProximosPartidos(limit: number = 6): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos
    .filter(p => !p.jugado)
    .slice(0, limit)
}

// Obtener resultados (partidos jugados)
export async function getResultados(): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => p.jugado)
}

// Calcular tabla de posiciones
export async function getTablaPosiciones() {
  const equipos = await getEquipos()
  const partidos = await getTodosLosPartidos()
  
  const posiciones = equipos.map(equipo => {
    const partidosEquipo = partidos.filter(p => 
      (p.equipoLocal === equipo.id || p.equipoVisitante === equipo.id) && p.jugado
    )
    
    let ganados = 0
    let perdidos = 0
    let setsF = 0
    let setsC = 0
    
    partidosEquipo.forEach(p => {
      const esLocal = p.equipoLocal === equipo.id
      const misSets = esLocal ? (p.setsLocal || 0) : (p.setsVisitante || 0)
      const susSets = esLocal ? (p.setsVisitante || 0) : (p.setsLocal || 0)
      
      setsF += misSets
      setsC += susSets
      
      if (misSets > susSets) ganados++
      else perdidos++
    })
    
    return {
      equipo,
      posicion: 0,
      pj: partidosEquipo.length,
      g: ganados,
      p: perdidos,
      sf: setsF,
      sc: setsC,
      ds: setsF - setsC,
      pts: ganados * 3
    }
  })
  
  // Ordenar por puntos, luego por diferencia de sets
  posiciones.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    return b.ds - a.ds
  })
  
  // Asignar posiciones
  posiciones.forEach((pos, index) => {
    pos.posicion = index + 1
  })
  
  return posiciones
}

// Obtener un equipo por slug
export async function getEquipoBySlug(slug: string): Promise<Equipo | null> {
  const equipos = await getEquipos()
  return equipos.find(e => e.slug === slug) || null
}

// Obtener partidos de un equipo específico
export async function getPartidosEquipo(equipoId: string): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => p.equipoLocal === equipoId || p.equipoVisitante === equipoId)
}
