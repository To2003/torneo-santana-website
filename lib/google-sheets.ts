import Papa from 'papaparse'
import type { Equipo, Partido, ConfiguracionTorneo, HabilitacionTorneos, Posicion, InstagramPost, Sancion, JugadorBuenaFe, JugadorConEstadisticas } from './types'
import { equiposMock, partidosMock, configuracionMock } from './mock-data'

// Usamos tu ID de planilla. Asegurate de que esté Pública (Cualquier usuario con el vínculo -> Lector)
const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '1uSkYMWMITS2kaRx_XRe4XgMx6HXb0YieFaFXgQH3iu8'
const CACHE_REVALIDATE = 20 // 20 segundos de caché

// Función para leer la hoja pública en formato CSV
async function getSheetData(sheetName: string): Promise<string[][] | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

    const res = await fetch(url, { next: { revalidate: CACHE_REVALIDATE } })
    const text = await res.text()

    // Si el spreadsheet entero no es accesible, Google devuelve HTML en vez de CSV.
    // OJO: si el nombre de la PESTAÑA no existe, Google NO tira error acá -
    // devuelve silenciosamente el contenido de la primera pestaña del archivo.
    // Por eso funciones como getPartidosFecha validan además que el contenido
    // recibido tenga la forma esperada (ver esHojaDeFechaValida)
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
  return valor.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '').trim()
}

// Normaliza un nombre de equipo para comparar sin importar mayúsculas,
// acentos o espacios (ej: "SUPER AMIGOS" y "Superamigos" deben matchear)
function normalizarNombre(valor: string): string {
  return limpiarTexto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

// Genera un slug de URL 100% ASCII (sin tildes, ñ, ü, etc.) para evitar
// problemas de codificación de caracteres en las rutas /equipos/[slug]
function generarSlug(valor: string): string {
  return limpiarTexto(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

export async function getEquipos(): Promise<Equipo[]> {
  const data = await getSheetData('Equipos')

  if (!data || data.length < 2) return equiposMock

  // Saltar la fila 1 (encabezados)
  const rows = data.slice(1)

  // Colores por defecto por si el equipo no especifica uno en la Columna D
  const coloresFallback = ['#1a5f7a', '#e63946', '#2a9d8f', '#f4a261', '#e76f51', '#264653']

  return rows
    .filter(row => row[0] && normalizarNombre(row[0]) !== 'libre') // Ignorar filas vacías
    .map((row, index) => {
      // Extraemos las nuevas columnas (si están vacías, usamos valores por defecto)
      const nombre = limpiarTexto(row[0])

      // Separamos la lista de jugadores por coma y quitamos espacios extra
      const jugadoresRaw = row[2] ? row[2].split(',') : []
      const jugadores = jugadoresRaw.map(j => j.trim()).filter(j => j !== "")

      // Usamos el color de la hoja si existe, sino usamos el fallback
      const colorPrimario = row[3] && row[3].trim() !== "" ? row[3].trim() : coloresFallback[index % coloresFallback.length]

      // Columna B: zona de la temporada regular (Zona 1 / Zona 2)
      const grupoRaw = (row[1] || '').trim()
      const grupo: '1' | '2' = grupoRaw === '2' ? '2' : '1'

      // Columna E: escudo del equipo (link de Drive u otra URL de imagen)
      const logo = row[4] && row[4].trim() !== '' ? normalizarUrlImagen(row[4]) : undefined

      // Columna F: clasificado a Copa de Oro/Plata | Columna G: clasificado a Playoff
      const copaDeOro = parseCheckbox(row[5])
      const playoff = parseCheckbox(row[6])

      return {
        id: String(index + 1),
        nombre: nombre,
        slug: generarSlug(nombre),
        colorPrimario: colorPrimario, // Ahora usa el color del Sheets!
        jugadores: jugadores, // ¡Ahora el plantel tiene nombres!
        grupo,
        logo,
        copaDeOro,
        playoff,
      }
    })
}

export async function getConfiguracion(): Promise<ConfiguracionTorneo> {
  return configuracionMock // Mantenemos el mock para la config por ahora
}

// Lee las columnas G/H de la hoja "Equipos", donde se habilita/deshabilita
// la visibilidad pública de cada torneo (Copa de Oro/Plata y Playoff)
export async function getHabilitacionTorneos(): Promise<HabilitacionTorneos> {
  const data = await getSheetData('Equipos')

  const habilitacion: HabilitacionTorneos = { copaDeOro: false, playoff: false }
  if (!data || data.length < 2) return habilitacion

  data.slice(1).forEach(row => {
    const etiqueta = (row[7] || '').trim().toUpperCase()
    if (!etiqueta) return

    const habilitado = parseCheckbox(row[8])
    if (etiqueta.includes('PLAYOFF')) habilitacion.playoff = habilitado
    else if (etiqueta.includes('COPA')) habilitacion.copaDeOro = habilitado
  })

  return habilitacion
}

// Verifica que los datos correspondan realmente a una hoja de fecha (empieza
// con "Horario"). Protege contra pestañas cuyo nombre visible es "Fecha N"
// pero tiene un carácter invisible pegado, lo que hace que Google Sheets
// devuelva por error el contenido de otra hoja (típicamente "Equipos")
function esHojaDeFechaValida(data: string[][] | null, numeroFecha: number): boolean {
  const encabezado = (data?.[0]?.[0] || '').trim().toLowerCase()
  if (encabezado === 'horario') return true

  console.error(`[Fecha ${numeroFecha}] No se pudo leer "Fecha ${numeroFecha}" como hoja de partidos. O la pestaña todavía no existe, o -si ya la creaste- su nombre tiene un carácter invisible: probá renombrarla escribiendo "Fecha ${numeroFecha}" de cero (sin copiar/pegar).`)
  return false
}

export async function getPartidosFecha(numeroFecha: number, equipos: Equipo[]): Promise<Partido[]> {
  const data = await getSheetData(`Fecha ${numeroFecha}`)
  if (!data || data.length < 2 || !esHojaDeFechaValida(data, numeroFecha)) return []

  const rows = data.slice(1)
  const partidos: Partido[] = []

  rows.forEach((row, index) => {
    // Formato: Horario | Local | Goles L | VS | Goles V | Visitante | MVP (Opcional) | Link Partido (Opcional)
    if (row.length < 6) return

    const horario = row[0]
    const nombreLocal = row[1]
    const resLocal = row[2]
    const resVisitante = row[4]
    const nombreVisitante = row[5]
    const mvpRaw = row[6]
    const mvp = mvpRaw && mvpRaw.trim() !== "" ? mvpRaw.trim() : undefined

    if (!nombreLocal || !nombreVisitante) return
    const localEsLibre = ['libre', 'queda'].includes(normalizarNombre(nombreLocal))
    const visitanteEsLibre = ['libre', 'queda'].includes(normalizarNombre(nombreVisitante))
    if (localEsLibre || visitanteEsLibre) return

    // Buscar IDs de equipos (comparación tolerante a mayúsculas, acentos y espacios)
    const local = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(nombreLocal))
    const visitante = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(nombreVisitante))

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
        jugado: jugado,
        mvp: jugado ? mvp : undefined
      })
    }
  })

  return partidos
}

// Encuentra el equipo que descansa (fila "Queda / LIBRE") en una fecha dada
export async function getEquipoLibre(numeroFecha: number, equipos: Equipo[]): Promise<Equipo | null> {
  const data = await getSheetData(`Fecha ${numeroFecha}`)
  if (!data || data.length < 2 || !esHojaDeFechaValida(data, numeroFecha)) return null

  const rows = data.slice(1)

  for (const row of rows) {
    if (row.length < 6) continue

    const nombreLocal = row[1]
    const nombreVisitante = row[5]
    if (!nombreLocal || !nombreVisitante) continue

    const localEsLibre = ['libre', 'queda'].includes(normalizarNombre(nombreLocal))
    const visitanteEsLibre = ['libre', 'queda'].includes(normalizarNombre(nombreVisitante))

    if (visitanteEsLibre && !localEsLibre) {
      return equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(nombreLocal)) || null
    }
    if (localEsLibre && !visitanteEsLibre) {
      return equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(nombreVisitante)) || null
    }
  }

  return null
}

// Link al video de la fecha completa (una transmisión/grabación por fecha,
// no por partido). Toma el primer valor no vacío de la columna "Link Partido"
export async function getLinkVideoFecha(numeroFecha: number): Promise<string | undefined> {
  const data = await getSheetData(`Fecha ${numeroFecha}`)
  if (!data || data.length < 2 || !esHojaDeFechaValida(data, numeroFecha)) return undefined

  for (const row of data.slice(1)) {
    const link = row[7]
    if (link && link.trim() !== '') return limpiarTexto(link)
  }

  return undefined
}

export async function getTodosLosPartidos(): Promise<Partido[]> {
  const equipos = await getEquipos()
  
  // Buscar hasta un máximo de 20 fechas EN PARALELO para mejorar el rendimiento
  // Esto evita hacer llamadas en cascada que bloquean la carga de la página
  const promesas = Array.from({ length: 20 }, (_, i) => getPartidosFecha(i + 1, equipos))
  const resultados = await Promise.all(promesas)
  
  // Aplanar los resultados y devolver
  return resultados.flat()
}

export async function getProximosPartidos(limit: number = 6): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => !p.jugado).slice(0, limit)
}

export async function getResultados(): Promise<Partido[]> {
  const partidos = await getTodosLosPartidos()
  return partidos.filter(p => p.jugado)
}

export async function getUltimosMVPs(): Promise<Partido[]> {
  const partidos = await getResultados()
  const partidosConMvp = partidos.filter(p => p.mvp)
  
  if (partidosConMvp.length === 0) return []
  
  // Encontrar el número de fecha más alto que tenga al menos un MVP
  const ultimaFechaConMvp = Math.max(...partidosConMvp.map(p => p.fecha))
  
  // Filtrar y devolver solo los MVPs de esa fecha específica
  return partidosConMvp.filter(p => p.fecha === ultimaFechaConMvp)
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

// Tabla de posiciones filtrada a los equipos de un torneo/instancia específica.
// Copa de ORO: tildados en la columna E. Copa de PLATA: los que no lo están.
// Playoff: por ahora solo entran los tildados en la columna F.
export async function getTablaPosicionesPorTorneo(torneo: 'copaDeOro' | 'copaDePlata' | 'playoff'): Promise<Posicion[]> {
  const [equipos, partidos, sanciones] = await Promise.all([
    getEquipos(),
    getTodosLosPartidos(),
    getSanciones()
  ])

  const equiposClasificados = equipos.filter(e => {
    if (torneo === 'copaDeOro') return e.copaDeOro
    if (torneo === 'copaDePlata') return !e.copaDeOro
    return e.playoff
  })

  return calcularTabla(equiposClasificados, partidos, sanciones)
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
// Columnas: A) Nombre Jugador | B) Apodo (opcional) | C) Nombre del Equipo
// (las columnas MVPs/SANCIONES de esa hoja son solo referencia manual para
// el organizador; el sitio las calcula solo, no las lee)
export async function getJugadoresBuenaFe(): Promise<JugadorBuenaFe[]> {
  const [data, equipos] = await Promise.all([
    getSheetData('Lista Buena Fe'),
    getEquipos()
  ])
  if (!data || data.length < 2) return []

  return data.slice(1)
    .filter(row => row[0] && row[0].trim() !== '')
    .map((row, index) => {
      const nombre = limpiarTexto(row[0])
      const apodoRaw = limpiarTexto(row[1] || '')
      const equipoNombreRaw = limpiarTexto(row[2] || '')

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
// Columnas: A) Imagen (link de Drive) | B) Link al posteo/perfil | C) Texto (opcional)
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const data = await getSheetData('Instagram')
  if (!data) return []

  // La hoja tiene un título arriba, así que buscamos la fila de encabezados
  // ("IMAGENES") en vez de asumir que los datos arrancan en la fila 2
  const indiceEncabezado = data.findIndex(row => (row[1] || '').trim().toUpperCase() === 'IMAGENES')
  const rows = indiceEncabezado >= 0 ? data.slice(indiceEncabezado + 1) : data.slice(1)

  return rows
    .filter(row => row[1] && row[1].trim() !== '')
    .map((row, index) => ({
      id: String(index + 1),
      imagen: normalizarUrlImagen(row[1]),
      link: row[2] && row[2].trim() !== '' ? limpiarTexto(row[2]) : 'https://instagram.com',
      texto: row[3] && row[3].trim() !== '' ? limpiarTexto(row[3]) : undefined,
    }))
}

// Lee la hoja "Sanciones". Columnas: A) Equipo | B) Causa Sancion | C) Puntos
// | D) Jugador (opcional) | E) Fechas Suspencion
// Devuelve la más reciente primero (última fila del sheet primero) e ignora
// las filas sin ningún efecto real (sin puntos y sin fechas de suspensión)
export async function getSanciones(): Promise<Sancion[]> {
  const [data, equipos] = await Promise.all([
    getSheetData('Sanciones'),
    getEquipos()
  ])

  if (!data || data.length < 2) return []

  const sanciones = data.slice(1)
    .map((row, index): Sancion | null => {
      const equipoNombreRaw = limpiarTexto(row[0] || '')
      if (!equipoNombreRaw) return null

      const puntos = parseNumero(row[2])
      const fechasSuspension = parseNumero(row[4])

      // Sin puntos ni fechas de suspensión no tiene ningún efecto: se ignora
      if (puntos === 0 && fechasSuspension === 0) return null

      const equipoMatch = equipos.find(e => normalizarNombre(e.nombre) === normalizarNombre(equipoNombreRaw))
      if (!equipoMatch) {
        console.error(`[Sanciones] No se encontró un equipo que matchee "${equipoNombreRaw}" (fila ${index + 2} de la hoja Sanciones)`)
      }

      const jugadorRaw = limpiarTexto(row[3] || '')

      return {
        id: String(index + 1),
        equipoNombre: equipoMatch ? equipoMatch.nombre : equipoNombreRaw,
        equipoId: equipoMatch?.id,
        causa: limpiarTexto(row[1] || ''),
        puntos,
        jugador: jugadorRaw !== '' ? jugadorRaw : undefined,
        fechasSuspension
      }
    })
    .filter((s): s is Sancion => s !== null)

  // Más reciente primero: la última fila cargada en el sheet va arriba
  return sanciones.reverse()
}