import Papa from 'papaparse'
import type { Equipo, Partido, ConfiguracionTorneo, HabilitacionTorneos, Posicion, InstagramPost, Sancion, JugadorBuenaFe, JugadorConEstadisticas, Producto } from './types'
import { equiposMock, partidosMock, configuracionMock } from './mock-data'

// Usamos tu ID de planilla. Asegurate de que esté Pública (Cualquier usuario con el vínculo -> Lector)
const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1uSkYMWMITS2kaRx_XRe4XgMx6HXb0YieFaFXgQH3iu8'
const CACHE_REVALIDATE = 20 // 20 segundos de caché

// Función para leer la hoja pública en formato CSV
async function getSheetData(sheetName: string): Promise<string[][] | null> {
  try {
    // headers=1 fuerza a Google a tratar solo la fila 1 como encabezado. Sin
    // esto, si una columna viene vacía en las primeras filas de datos (ej.
    // "Numero" sin completar), Google intenta "adivinar" cuántas filas son
    // encabezado y puede tragarse esas filas enteras, fusionándolas con el
    // título en vez de devolverlas como datos
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&headers=1`

    const res = await fetch(url, { next: { revalidate: CACHE_REVALIDATE } })
    const text = await res.text()

    // Si el spreadsheet entero no es accesible, Google devuelve HTML en vez de CSV.
    // OJO: si el nombre de la PESTAÑA no existe, Google NO tira error acá -
    // devuelve silenciosamente el contenido de la primera pestaña del archivo
    // (por eso mapearColumnasPartidos valida que el formato sea el esperado)
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

// Interpreta el texto de un checkbox de Sheets (TRUE/FALSE, VERDADERO/FALSO) como booleano
function parseCheckbox(valor?: string): boolean {
  if (!valor) return false
  const v = valor.trim().toUpperCase()
  return v === 'TRUE' || v === 'VERDADERO' || v === '1'
}

// Interpreta un número entero de Sheets tolerando vacíos, espacios y texto no numérico
function parseNumero(valor?: string): number {
  if (!valor) return 0
  const n = parseInt(valor.trim(), 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

// Quita caracteres invisibles que suelen colarse al pegar texto en Sheets
// (word joiner, zero-width space, BOM, etc.) y espacios de sobra
function limpiarTexto(valor: string): string {
  return valor.replace(/[​-‍﻿⁠]/g, '').trim()
}

// Normaliza un nombre de equipo para comparar sin importar mayúsculas,
// acentos o espacios (ej: "SUPER AMIGOS" y "Superamigos" deben matchear)
function normalizarNombre(valor: string): string {
  return limpiarTexto(valor)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

// Genera un slug de URL 100% ASCII (sin tildes, ñ, ü, etc.) para evitar
// problemas de codificación de caracteres en las rutas /equipos/[slug]
function generarSlug(valor: string): string {
  return limpiarTexto(valor)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Convierte un link para compartir de Google Drive (el que se copia con
// "Compartir -> Cualquier usuario con el enlace") en una URL de imagen
// directa que sirve para un <img src>. Si no reconoce el formato, devuelve
// el link tal cual (por si ya es una URL de imagen de otro lado).
function normalizarUrlImagen(valor: string, ancho = 800): string {
  const url = limpiarTexto(valor || '')
  if (!url) return ''

  const patronesDrive = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // drive.google.com/file/d/ID/view
    /\/d\/([a-zA-Z0-9_-]+)/,       // drive.google.com/d/ID
    /[?&]id=([a-zA-Z0-9_-]+)/,     // drive.google.com/open?id=ID o uc?id=ID
  ]

  for (const patron of patronesDrive) {
    const match = url.match(patron)
    if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w${ancho}`
  }

  return url
}

// --- Lectura de columnas por nombre de encabezado ---------------------------
// En vez de leer cada hoja por posición fija (row[4], row[5]...), buscamos la
// columna por el TEXTO de su encabezado. Así, si alguien agrega, saca o
// reordena una columna en el Sheet, el sitio la sigue encontrando sola en vez
// de leer el dato de al lado y romperse en silencio (nos pasó varias veces).

// Busca el índice de una columna por su encabezado (tolerante a mayúsculas,
// acentos y espacios). Devuelve -1 si no la encuentra.
function indiceColumna(encabezados: string[], nombreColumna: string): number {
  const objetivo = normalizarNombre(nombreColumna)
  return encabezados.findIndex(h => normalizarNombre(h || '') === objetivo)
}

// Arma un "lector" para una fila: col(row, 'Nombre de Columna') devuelve el
// valor de esa columna en esa fila, buscándola por el encabezado.
function lectorDeFilas(encabezados: string[]) {
  return (row: string[], nombreColumna: string): string => {
    const idx = indiceColumna(encabezados, nombreColumna)
    return idx >= 0 ? (row[idx] || '') : ''
  }
}

export async function getEquipos(): Promise<Equipo[]> {
  const data = await getSheetData('Equipos')

  if (!data || data.length < 2) return equiposMock

  const encabezados = data[0]
  const col = lectorDeFilas(encabezados)
  const rows = data.slice(1)

  // Colores por defecto por si el equipo no especifica uno en la hoja
  const coloresFallback = ['#1a5f7a', '#e63946', '#2a9d8f', '#f4a261', '#e76f51', '#264653']

  return rows
    .filter(row => col(row, 'Nombre del Equipo') && normalizarNombre(col(row, 'Nombre del Equipo')) !== 'libre')
    .map((row, index) => {
      const nombre = limpiarTexto(col(row, 'Nombre del Equipo'))

      // El plantel de jugadores ahora vive en la hoja "Lista Buena Fe"
      // (ver getJugadoresBuenaFe / getPlantelConEstadisticas)
      const jugadores: string[] = []

      // Usamos el color de la hoja si existe, sino usamos el fallback
      const colorRaw = col(row, 'Color del Equipo').trim()
      const colorPrimario = colorRaw !== '' ? colorRaw : coloresFallback[index % coloresFallback.length]

      // Zona de la temporada regular (Zona 1 / Zona 2)
      const grupoRaw = col(row, 'ZONA').trim()
      const grupo: '1' | '2' = grupoRaw === '2' ? '2' : '1'

      // Escudo del equipo (link de Drive u otra URL de imagen)
      const logoRaw = col(row, 'Link Escudo').trim()
      const logo = logoRaw !== '' ? normalizarUrlImagen(logoRaw) : undefined

      // Clasificado a Playoff (Copa de Oro/Plata se calcula sola,
      // ver getEquiposCopaDeOro, ya no depende de ninguna columna)
      const playoff = parseCheckbox(col(row, 'PLAYOFF'))

      return {
        id: String(index + 1),
        nombre: nombre,
        slug: generarSlug(nombre),
        colorPrimario: colorPrimario,
        jugadores: jugadores,
        grupo,
        logo,
        playoff,
      }
    })
}

export async function getConfiguracion(): Promise<ConfiguracionTorneo> {
  return configuracionMock // Mantenemos el mock para la config por ahora
}

// Lee la hoja "Equipos", donde se habilita/deshabilita la visibilidad pública
// de cada torneo (Copa de Oro/Plata y Playoff). El checkbox on/off vive en la
// columna inmediatamente a la derecha de "Habilitar Torneos" (esa columna no
// tiene su propio encabezado, así que la ubicamos en relación a la de al lado)
export async function getHabilitacionTorneos(): Promise<HabilitacionTorneos> {
  const data = await getSheetData('Equipos')

  const habilitacion: HabilitacionTorneos = { copaDeOro: false, playoff: false }
  if (!data || data.length < 2) return habilitacion

  const idxLabel = indiceColumna(data[0], 'Habilitar Torneos')
  if (idxLabel < 0) return habilitacion
  const idxCheckbox = idxLabel + 1

  data.slice(1).forEach(row => {
    const etiqueta = (row[idxLabel] || '').trim().toUpperCase()
    if (!etiqueta) return

    const habilitado = parseCheckbox(row[idxCheckbox])
    if (etiqueta.includes('PLAYOFF')) habilitacion.playoff = habilitado
    else if (etiqueta.includes('COPA')) habilitacion.copaDeOro = habilitado
  })

  return habilitacion
}

interface FilaPartido {
  fecha: number
  horario: string
  local: string
  resLocal: string
  resVisitante: string
  visitante: string
  mvp: string
  linkVideo: string
}

interface ColumnasPartidos {
  fecha: number
  horario: number
  local: number
  resLocal: number
  resVisitante: number
  visitante: number
  mvp: number
  linkVideo: number
}

// Arma el mapa de columnas de la hoja "Partidos". Todo se busca por nombre de
// encabezado, EXCEPTO los dos resultados ("R"), que van anclados a "Equipo
// Local"/"Equipo Visitante" (únicos, sí se pueden buscar por nombre) porque
// el encabezado "R" se repite dos veces y no hay forma de distinguirlos por
// texto solo.
function mapearColumnasPartidos(encabezados: string[]): ColumnasPartidos | null {
  const fecha = indiceColumna(encabezados, 'Fecha')
  const local = indiceColumna(encabezados, 'Equipo Local')
  const visitante = indiceColumna(encabezados, 'Equipo Visitante')
  if (fecha < 0 || local < 0 || visitante < 0) return null

  return {
    fecha,
    horario: indiceColumna(encabezados, 'Horario'),
    local,
    resLocal: local + 1,
    resVisitante: visitante - 1,
    visitante,
    mvp: indiceColumna(encabezados, 'MVP del Partido'),
    linkVideo: indiceColumna(encabezados, 'Link Partido')
  }
}

// Lee la hoja "Partidos": todas las fechas juntas, una fila por partido, con
// una columna "Fecha" (1, 2, 3...) al principio. Reemplaza a las ~20 pestañas
// separadas "Fecha 1", "Fecha 2"... que usábamos antes: una sola consulta a
// Google en vez de una por fecha, y cargar un partido nuevo es solo agregar
// una fila más abajo en la misma tabla.
async function getFilasPartidos(): Promise<FilaPartido[]> {
  const data = await getSheetData('Partidos')
  if (!data || data.length < 2) return []

  const columnas = mapearColumnasPartidos(data[0])
  if (!columnas) {
    console.error('[Partidos] La hoja "Partidos" no tiene el formato esperado (deben existir las columnas "Fecha", "Equipo Local" y "Equipo Visitante")')
    return []
  }

  return data.slice(1)
    .map(row => ({
      fecha: parseNumero(row[columnas.fecha]),
      horario: row[columnas.horario] || '',
      local: row[columnas.local] || '',
      resLocal: row[columnas.resLocal] || '',
      resVisitante: row[columnas.resVisitante] || '',
      visitante: row[columnas.visitante] || '',
      mvp: columnas.mvp >= 0 ? (row[columnas.mvp] || '') : '',
      linkVideo: columnas.linkVideo >= 0 ? (row[columnas.linkVideo] || '') : ''
    }))
    .filter(f => f.fecha > 0 && f.local.trim() !== '' && f.visitante.trim() !== '')
}

// Encuentra el equipo que descansa (fila "Queda / LIBRE") en una fecha dada
export async function getEquipoLibre(numeroFecha: number, equipos: Equipo[]): Promise<Equipo | null> {
  const filas = await getFilasPartidos()

  for (const fila of filas) {
    if (fila.fecha !== numeroFecha) continue

    const localEsLibre = ['libre', 'queda'].includes(normalizarNombre(fila.local))
    const visitanteEsLibre = ['libre', 'queda'].includes(normalizarNombre(fila.visitante))

    if (visitanteEsLibre && !localEsLibre) {
      return equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(fila.local)) || null
    }
    if (localEsLibre && !visitanteEsLibre) {
      return equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(fila.visitante)) || null
    }
  }

  return null
}

// Link al video de la fecha completa (una transmisión/grabación por fecha,
// no por partido). Toma el primer valor no vacío de "Link Partido" en esa fecha
export async function getLinkVideoFecha(numeroFecha: number): Promise<string | undefined> {
  const filas = await getFilasPartidos()
  const filaConLink = filas.find(f => f.fecha === numeroFecha && f.linkVideo.trim() !== '')
  return filaConLink ? limpiarTexto(filaConLink.linkVideo) : undefined
}

export async function getTodosLosPartidos(): Promise<Partido[]> {
  const [equipos, filas] = await Promise.all([getEquipos(), getFilasPartidos()])
  const partidos: Partido[] = []

  filas.forEach((fila, index) => {
    const localEsLibre = ['libre', 'queda'].includes(normalizarNombre(fila.local))
    const visitanteEsLibre = ['libre', 'queda'].includes(normalizarNombre(fila.visitante))
    if (localEsLibre || visitanteEsLibre) return

    // Buscar IDs de equipos (comparación tolerante a mayúsculas, acentos y espacios)
    const local = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(fila.local))
    const visitante = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(fila.visitante))
    if (!local || !visitante) return

    const jugado = fila.resLocal !== "" && fila.resLocal !== "-" && fila.resVisitante !== "" && fila.resVisitante !== "-"
    const mvp = fila.mvp.trim() !== '' ? fila.mvp.trim() : undefined

    partidos.push({
      id: `${fila.fecha}-${index + 1}`,
      fecha: fila.fecha,
      dia: `Fecha ${fila.fecha}`,
      hora: fila.horario,
      equipoLocal: local.id,
      equipoVisitante: visitante.id,
      cancha: 'Cancha 1',
      setsLocal: jugado ? parseInt(fila.resLocal) : undefined,
      setsVisitante: jugado ? parseInt(fila.resVisitante) : undefined,
      jugado: jugado,
      mvp: jugado ? mvp : undefined
    })
  })

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

// Busca el nombre completo de un jugador a partir del texto libre de la
// columna MVP (puede venir como nombre completo, apodo, o con "(Equipo)"
// pegado al final). Busca primero entre los jugadores de los dos equipos del
// partido y, si no encuentra nada ahí, en toda la Lista Buena Fe por las
// dudas de que el equipo esté mal cargado. Si no matchea a nadie, devuelve
// el texto tal cual vino de la hoja
function resolverNombreMvp(mvpTexto: string, jugadoresBuenaFe: JugadorBuenaFe[], equipoIds: (string | undefined)[]): string {
  const candidatosDelPartido = jugadoresBuenaFe.filter(j => equipoIds.includes(j.equipoId))
  const match = candidatosDelPartido.find(j => coincideNombreJugador(mvpTexto, j.nombre, j.apodo))
    || jugadoresBuenaFe.find(j => coincideNombreJugador(mvpTexto, j.nombre, j.apodo))

  return match ? match.nombre : mvpTexto
}

export async function getUltimosMVPs(): Promise<Partido[]> {
  const partidos = await getResultados()
  const partidosConMvp = partidos.filter(p => p.mvp)

  if (partidosConMvp.length === 0) return []

  // Encontrar el número de fecha más alto que tenga al menos un MVP
  const ultimaFechaConMvp = Math.max(...partidosConMvp.map(p => p.fecha))

  // Filtrar solo los MVPs de esa fecha específica
  const mvpsUltimaFecha = partidosConMvp.filter(p => p.fecha === ultimaFechaConMvp)

  // Si en la hoja pusieron un apodo (ej. "Juani"), mostramos el nombre
  // completo del jugador según la Lista Buena Fe
  const jugadoresBuenaFe = await getJugadoresBuenaFe()

  return mvpsUltimaFecha.map(p => ({
    ...p,
    mvp: resolverNombreMvp(p.mvp as string, jugadoresBuenaFe, [p.equipoLocal, p.equipoVisitante])
  }))
}

function calcularTabla(equipos: Equipo[], partidos: Partido[], sanciones: Sancion[] = []): Posicion[] {
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
    const ptsBase = (pg * 4) + (g2 * 2) + (pp * 1) + (p3 * 1)

    // Se descuentan los puntos de las sanciones que le corresponden a este equipo
    const puntosDescontados = sanciones
      .filter(s => s.equipoId === equipo.id)
      .reduce((total, s) => total + s.puntos, 0)

    return {
      equipo,
      posicion: 0,
      pj: partidosEquipo.length,
      pg,
      pp,
      g2,
      p3,
      pts: ptsBase - puntosDescontados,
      puntosDescontados
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

// Tabla de posiciones de la temporada regular, filtrada por zona (Zona 1 / Zona 2)
export async function getTablaPosicionesPorGrupo(grupo: '1' | '2'): Promise<Posicion[]> {
  const [equipos, partidos, sanciones] = await Promise.all([
    getEquipos(),
    getTodosLosPartidos(),
    getSanciones()
  ])
  const equiposDelGrupo = equipos.filter(e => e.grupo === grupo)
  return calcularTabla(equiposDelGrupo, partidos, sanciones)
}

// Copa de Oro = los 4 mejores de cada zona (según la tabla regular), cruzados
// entre zonas. Copa de Plata = todos los demás. Se recalcula solo, no depende
// de ningún checkbox manual en el Sheet.
async function getEquiposCopaDeOro(): Promise<Set<string>> {
  const [posicionesZona1, posicionesZona2] = await Promise.all([
    getTablaPosicionesPorGrupo('1'),
    getTablaPosicionesPorGrupo('2')
  ])

  const top4Zona1 = posicionesZona1.slice(0, 4).map(p => p.equipo.id)
  const top4Zona2 = posicionesZona2.slice(0, 4).map(p => p.equipo.id)

  return new Set([...top4Zona1, ...top4Zona2])
}

// Tabla de posiciones filtrada a los equipos de un torneo/instancia específica.
// Copa de ORO/PLATA: automático, ver getEquiposCopaDeOro. Los puntos de esa
// tabla arrancan de los partidos que esos equipos ya se sacaron entre sí (no
// arranca de cero, y no cuenta partidos contra equipos que no clasificaron).
// Playoff: por ahora sigue siendo manual, los tildados en la columna "PLAYOFF".
export async function getTablaPosicionesPorTorneo(torneo: 'copaDeOro' | 'copaDePlata' | 'playoff'): Promise<Posicion[]> {
  const [equipos, partidos, sanciones] = await Promise.all([
    getEquipos(),
    getTodosLosPartidos(),
    getSanciones()
  ])

  if (torneo === 'playoff') {
    const equiposClasificados = equipos.filter(e => e.playoff)
    return calcularTabla(equiposClasificados, partidos, sanciones)
  }

  const equiposCopaDeOro = await getEquiposCopaDeOro()
  const equiposClasificados = equipos.filter(e =>
    torneo === 'copaDeOro' ? equiposCopaDeOro.has(e.id) : !equiposCopaDeOro.has(e.id)
  )

  // Solo cuentan los partidos jugados ENTRE equipos que clasificaron a esta
  // misma instancia (ambos lados del partido deben estar en el grupo)
  const idsClasificados = new Set(equiposClasificados.map(e => e.id))
  const partidosDelGrupo = partidos.filter(p =>
    idsClasificados.has(p.equipoLocal) && idsClasificados.has(p.equipoVisitante)
  )

  return calcularTabla(equiposClasificados, partidosDelGrupo, sanciones)
}

export async function getEquipoBySlug(slug: string): Promise<Equipo | null> {
  const equipos = await getEquipos()
  return equipos.find(e => e.slug === slug) || null
}

export async function getPartidosEquipo(equipoId: string): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => p.equipoLocal === equipoId || p.equipoVisitante === equipoId)
}

// Compara un texto libre (ej. la columna MVP: "Lucas Zuñiga (San José)", o la
// columna Jugador de Sanciones) contra el nombre completo y/o apodo de un
// jugador. Tolerante a mayúsculas, acentos, espacios y a un "(equipo)" que
// suele quedar pegado al final del texto libre
function coincideNombreJugador(textoLibre: string, nombre: string, apodo?: string): boolean {
  const limpio = normalizarNombre(textoLibre.replace(/\([^)]*\)\s*$/, ''))
  if (!limpio) return false
  if (limpio === normalizarNombre(nombre)) return true
  if (apodo && limpio === normalizarNombre(apodo)) return true
  return false
}

// Lee la hoja "Lista Buena Fe": el padrón de jugadores por equipo.
// Columnas: Nombre Jugador | Apodo (opcional) | Numero (no la usamos)
// | Nombre del Equipo (las columnas MVPs/SANCIONES de esa hoja son solo
// referencia manual para el organizador; el sitio las calcula solo, no las lee)
export async function getJugadoresBuenaFe(): Promise<JugadorBuenaFe[]> {
  const [data, equipos] = await Promise.all([
    getSheetData('Lista Buena Fe'),
    getEquipos()
  ])
  if (!data || data.length < 2) return []

  const encabezados = data[0]
  const col = lectorDeFilas(encabezados)

  return data.slice(1)
    .filter(row => col(row, 'Nombre Jugador').trim() !== '')
    .map((row, index) => {
      const nombre = limpiarTexto(col(row, 'Nombre Jugador'))
      const apodoRaw = limpiarTexto(col(row, 'Apodo'))
      const equipoNombreRaw = limpiarTexto(col(row, 'Nombre del Equipo'))

      const equipoMatch = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(equipoNombreRaw))
      if (equipoNombreRaw && !equipoMatch) {
        console.error(`[Lista Buena Fe] No se encontró el equipo "${equipoNombreRaw}" para el jugador "${nombre}" (fila ${index + 2})`)
      }

      return {
        id: String(index + 1),
        nombre,
        apodo: apodoRaw !== '' ? apodoRaw : undefined,
        equipoId: equipoMatch?.id,
        equipoNombre: equipoMatch ? equipoMatch.nombre : equipoNombreRaw
      }
    })
}

// Arma el plantel de un equipo con la cantidad de MVPs y sanciones de cada
// jugador. Usa la "Lista Buena Fe" cuando el equipo ya está cargado ahí;
// si todavía no lo está, cae de vuelta a la lista de texto libre de la
// columna "Jugadores" de la hoja Equipos (sin apodo, matcheo solo por nombre)
export async function getPlantelConEstadisticas(equipo: Equipo): Promise<JugadorConEstadisticas[]> {
  const [jugadoresBuenaFe, partidosEquipo, sanciones] = await Promise.all([
    getJugadoresBuenaFe(),
    getPartidosEquipo(equipo.id),
    getSanciones()
  ])

  const jugadoresDelEquipo = jugadoresBuenaFe.filter(j => j.equipoId === equipo.id)

  const jugadores: { nombre: string; apodo?: string }[] = jugadoresDelEquipo.length > 0
    ? jugadoresDelEquipo.map(j => ({ nombre: j.nombre, apodo: j.apodo }))
    : equipo.jugadores.map(nombre => ({ nombre }))

  const mvpsDelEquipo = partidosEquipo.filter(p => p.jugado && p.mvp).map(p => p.mvp as string)
  const sancionesDelEquipo = sanciones.filter(s => s.equipoId === equipo.id && s.jugador)

  return jugadores.map(({ nombre, apodo }) => ({
    nombre,
    apodo,
    mvps: mvpsDelEquipo.filter(mvp => coincideNombreJugador(mvp, nombre, apodo)).length,
    sanciones: sancionesDelEquipo.filter(s => coincideNombreJugador(s.jugador as string, nombre, apodo)).length
  }))
}

// Lee la hoja "Instagram" para el carrusel de posteos de la home.
// Columnas: Imagen (link de Drive) | Link al posteo/perfil | Texto (opcional)
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const data = await getSheetData('Instagram')
  if (!data) return []

  // La hoja tiene un título arriba, así que buscamos la fila que tenga el
  // encabezado "IMAGENES" en vez de asumir que los datos arrancan en la fila 2
  const indiceEncabezado = data.findIndex(row => indiceColumna(row, 'IMAGENES') >= 0)
  if (indiceEncabezado < 0) return []

  const encabezados = data[indiceEncabezado]
  const col = lectorDeFilas(encabezados)
  const rows = data.slice(indiceEncabezado + 1)

  return rows
    .filter(row => col(row, 'IMAGENES').trim() !== '')
    .map((row, index) => ({
      id: String(index + 1),
      imagen: normalizarUrlImagen(col(row, 'IMAGENES')),
      link: col(row, 'LINK').trim() !== '' ? limpiarTexto(col(row, 'LINK')) : 'https://instagram.com',
      texto: col(row, 'TEXTO').trim() !== '' ? limpiarTexto(col(row, 'TEXTO')) : undefined,
    }))
}

// Lee la hoja "Sanciones". Columnas: Equipo | Causa Sancion | Puntos
// | Jugador (opcional) | Fechas Suspencion
// Devuelve la más reciente primero (última fila del sheet primero) e ignora
// las filas sin ningún efecto real (sin puntos y sin fechas de suspensión)
export async function getSanciones(): Promise<Sancion[]> {
  const [data, equipos] = await Promise.all([
    getSheetData('Sanciones'),
    getEquipos()
  ])

  if (!data || data.length < 2) return []

  const encabezados = data[0]
  const col = lectorDeFilas(encabezados)

  const sanciones = data.slice(1)
    .map((row, index): Sancion | null => {
      const equipoNombreRaw = limpiarTexto(col(row, 'Equipo'))
      if (!equipoNombreRaw) return null

      const puntos = parseNumero(col(row, 'Puntos'))
      const fechasSuspension = parseNumero(col(row, 'Fechas Suspencion'))

      // Sin puntos ni fechas de suspensión no tiene ningún efecto: se ignora
      if (puntos === 0 && fechasSuspension === 0) return null

      const equipoMatch = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(equipoNombreRaw))
      if (!equipoMatch) {
        console.error(`[Sanciones] No se encontró un equipo que matchee "${equipoNombreRaw}" (fila ${index + 2} de la hoja Sanciones)`)
      }

      const jugadorRaw = limpiarTexto(col(row, 'Jugador'))

      return {
        id: String(index + 1),
        equipoNombre: equipoMatch ? equipoMatch.nombre : equipoNombreRaw,
        equipoId: equipoMatch?.id,
        causa: limpiarTexto(col(row, 'Causa Sancion')),
        puntos,
        jugador: jugadorRaw !== '' ? jugadorRaw : undefined,
        fechasSuspension
      }
    })
    .filter((s): s is Sancion => s !== null)

  // Más reciente primero: la última fila cargada en el sheet va arriba
  return sanciones.reverse()
}

// Convierte "$55.000" -> 55000
function parsePrecio(valor: string): number {
  const limpio = (valor || '').replace(/[^\d]/g, '')
  const n = parseInt(limpio, 10)
  return Number.isFinite(n) ? n : 0
}

// Convierte "S, M, L Y XLL" -> ["S","M","L","XLL"]. "-" o vacío -> []
function parseOpciones(valor: string): string[] {
  const limpio = limpiarTexto(valor || '')
  if (!limpio || limpio === '-') return []

  return limpio
    .split(/,|\s+y\s+/i)
    .map(v => v.trim())
    .filter(v => v !== '' && v !== '-')
}

// Lee la hoja "Tienda". Columnas: Nombre Producto | Tipo Producto | Precio
// | Descripcion Producto | Imagen | Talles | Colores
export async function getProductos(): Promise<Producto[]> {
  const data = await getSheetData('Tienda')
  if (!data || data.length < 2) return []

  const encabezados = data[0]
  const col = lectorDeFilas(encabezados)

  return data.slice(1)
    .filter(row => col(row, 'Nombre Producto').trim() !== '')
    .map((row, index) => ({
      id: String(index + 1),
      nombre: limpiarTexto(col(row, 'Nombre Producto')),
      tipo: limpiarTexto(col(row, 'Tipo Producto')),
      precio: parsePrecio(col(row, 'Precio')),
      descripcion: limpiarTexto(col(row, 'Descripcion Producto')),
      imagen: col(row, 'Imagen').trim() !== '' ? normalizarUrlImagen(col(row, 'Imagen')) : undefined,
      talles: parseOpciones(col(row, 'Talles')),
      colores: parseOpciones(col(row, 'Colores'))
    }))
}

// Lee la columna "Status Shop" de la hoja "Tienda": un único on/off global
// para toda la tienda (puede estar en cualquier fila, tomamos el primer valor
// no vacío que encontremos). Si no hay ningún valor cargado todavía, la
// tienda queda abierta por defecto
export async function getEstadoTienda(): Promise<boolean> {
  const data = await getSheetData('Tienda')
  if (!data || data.length < 2) return true

  const idxEstado = indiceColumna(data[0], 'Status Shop')
  if (idxEstado < 0) return true

  for (const row of data.slice(1)) {
    const valor = row[idxEstado]
    if (valor && valor.trim() !== '') return parseCheckbox(valor)
  }

  return true
}
