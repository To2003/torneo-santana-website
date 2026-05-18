import Papa from 'papaparse'
import type { Equipo, Partido, ConfiguracionTorneo } from './types'
import { equiposMock, partidosMock, configuracionMock } from './mock-data'

// Usamos tu ID de planilla. Asegurate de que esté Pública (Cualquier usuario con el vínculo -> Lector)
const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1uSkYMWMITS2kaRx_XRe4XgMx6HXb0YieFaFXgQH3iu8'
const CACHE_REVALIDATE = 60 // 60 segundos de caché

// Función para leer la hoja pública en formato CSV
async function getSheetData(sheetName: string): Promise<string[][] | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

    const res = await fetch(url, { next: { revalidate: CACHE_REVALIDATE } })
    const text = await res.text()

    // Si la hoja no existe, Google devuelve un HTML
    if (text.includes('<html')) return null

    // Parseamos el CSV
    const result = Papa.parse(text, { header: false })
    return result.data as string[][]
  } catch (error) {
    console.error(`[v0] Error fetching Google Sheets (${sheetName}):`, error)
    return null
  }
}

// En lib/google-sheets.ts

export async function getEquipos(): Promise<Equipo[]> {
  const data = await getSheetData('Equipos')

  if (!data || data.length < 2) return equiposMock

  // Saltar la fila 1 (encabezados)
  const rows = data.slice(1)

  // Colores por defecto por si el equipo no especifica uno en la Columna D
  const coloresFallback = ['#1a5f7a', '#e63946', '#2a9d8f', '#f4a261', '#e76f51', '#264653']

  return rows
    .filter(row => row[0] && row[0] !== 'LIBRE') // Ignorar filas vacías
    .map((row, index) => {
      // Extraemos las nuevas columnas (si están vacías, usamos valores por defecto)
      const nombre = row[0]
      const urlEscudo = row[1] && row[1].trim() !== "" ? row[1].trim() : `/equipos/default.png`

      // Separamos la lista de jugadores por coma y quitamos espacios extra
      const jugadoresRaw = row[2] ? row[2].split(',') : []
      const jugadores = jugadoresRaw.map(j => j.trim()).filter(j => j !== "")

      // Usamos el color de la hoja si existe, sino usamos el fallback
      const colorPrimario = row[3] && row[3].trim() !== "" ? row[3].trim() : coloresFallback[index % coloresFallback.length]

      return {
        id: String(index + 1),
        nombre: nombre,
        slug: nombre.toLowerCase().replace(/\s+/g, '-'),
        logo: urlEscudo, // Ahora usa el link del Sheets!
        colorPrimario: colorPrimario, // Ahora usa el color del Sheets!
        jugadores: jugadores, // ¡Ahora el plantel tiene nombres!
      }
    })
}

export async function getConfiguracion(): Promise<ConfiguracionTorneo> {
  return configuracionMock // Mantenemos el mock para la config por ahora
}

export async function getPartidosFecha(numeroFecha: number, equipos: Equipo[]): Promise<Partido[]> {
  const data = await getSheetData(`Fecha ${numeroFecha}`)
  if (!data || data.length < 2) return []

  const rows = data.slice(1)
  const partidos: Partido[] = []

  rows.forEach((row, index) => {
    // Formato de 6 columnas: Horario | Local | Goles L | VS | Goles V | Visitante
    if (row.length < 6) return

    const horario = row[0]
    const nombreLocal = row[1]
    const resLocal = row[2]
    const resVisitante = row[4]
    const nombreVisitante = row[5]

    if (!nombreLocal || !nombreVisitante || nombreLocal === "LIBRE" || nombreVisitante === "LIBRE" || nombreVisitante === "Queda") return

    // Buscar IDs de equipos
    const local = equipos.find(e => e.nombre === nombreLocal)
    const visitante = equipos.find(e => e.nombre === nombreVisitante)

    if (local && visitante) {
      const jugado = resLocal !== "" && resLocal !== "-" && resVisitante !== "" && resVisitante !== "-"

      partidos.push({
        id: `${numeroFecha}-${index + 1}`,
        fecha: numeroFecha,
        dia: `Fecha ${numeroFecha}`,
        hora: horario,
        equipoLocal: local.id,
        equipoVisitante: visitante.id,
        cancha: 'Cancha 1',
        setsLocal: jugado ? parseInt(resLocal) : undefined,
        setsVisitante: jugado ? parseInt(resVisitante) : undefined,
        jugado: jugado
      })
    }
  })

  return partidos
}

export async function getTodosLosPartidos(): Promise<Partido[]> {
  const equipos = await getEquipos()
  const partidos: Partido[] = []

  // Buscar hasta un máximo de 20 fechas
  for (let fecha = 1; fecha <= 20; fecha++) {
    const partidosFecha = await getPartidosFecha(fecha, equipos)
    if (partidosFecha.length === 0) break // Si no encuentra la fecha, termina el loop
    partidos.push(...partidosFecha)
  }

  return partidos
}

export async function getProximosPartidos(limit: number = 6): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => !p.jugado).slice(0, limit)
}

export async function getResultados(): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => p.jugado)
}

export async function getTablaPosiciones() {
  const equipos = await getEquipos()
  const partidos = await getTodosLosPartidos()

  const posiciones = equipos.map(equipo => {
    // Filtrar los partidos que este equipo ya jugó
    const partidosEquipo = partidos.filter(p =>
      (p.equipoLocal === equipo.id || p.equipoVisitante === equipo.id) && p.jugado
    )

    let pg = 0
    let pp = 0
    let g2 = 0
    let p3 = 0

    partidosEquipo.forEach(p => {
      const esLocal = p.equipoLocal === equipo.id
      const misSets = esLocal ? (p.setsLocal || 0) : (p.setsVisitante || 0)
      const susSets = esLocal ? (p.setsVisitante || 0) : (p.setsLocal || 0)

      if (misSets > susSets) {
        pg++ // Ganó el partido
        if (susSets === 0) g2++ // Ganó en 2 sets directos (dejó al rival en 0)
      } else if (susSets > misSets) {
        pp++ // Perdió el partido
        if (misSets === 1) p3++ // Perdió en 3 sets (logró arrancar 1 set)
      }
    })

    // Cálculo matemático de los puntos del reglamento
    const pts = (pg * 4) + (g2 * 2) + (pp * 1) + (p3 * 1)

    return {
      equipo,
      posicion: 0,
      pj: partidosEquipo.length,
      pg,
      pp,
      g2,
      p3,
      pts
    }
  })

  // Ordenar por puntos, luego por partidos ganados, luego por bonus G2
  posiciones.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.pg !== a.pg) return b.pg - a.pg
    return b.g2 - a.g2
  })

  // Asignar los números de posición (1º, 2º, 3º...)
  posiciones.forEach((pos, index) => {
    pos.posicion = index + 1
  })

  return posiciones
}

export async function getEquipoBySlug(slug: string): Promise<Equipo | null> {
  const equipos = await getEquipos()
  return equipos.find(e => e.slug === slug) || null
}

export async function getPartidosEquipo(equipoId: string): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => p.equipoLocal === equipoId || p.equipoVisitante === equipoId)
}