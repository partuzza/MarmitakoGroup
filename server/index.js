// ES: Mini servidor sin dependencias:
//      - POST /api/revisar → consulta Google Safe Browsing sin exponer la clave en el navegador
//      - En producción (pnpm start) también sirve la web ya compilada de dist/
// EN: Tiny dependency-free server:
//      - POST /api/revisar → queries Google Safe Browsing without exposing the key to the browser
//      - In production (pnpm start) it also serves the built website from dist/
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, normalize, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

try {
  process.loadEnvFile()
} catch {
  // ES: Sin .env: la consulta externa queda desactivada, el resto funciona igual
  // EN: No .env: the external lookup is disabled, everything else works the same
}

const PUERTO = Number(process.env.PORT) || 3001
const CLAVE = process.env.SAFE_BROWSING_KEY
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const MAX_CUERPO = 4096
const LIMITE_POR_MINUTO = 20

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

// ES: Tipos de amenaza que se consultan a Google
// EN: Threat types requested from Google
const AMENAZAS = {
  MALWARE: 'Distribuye malware (programas maliciosos).',
  SOCIAL_ENGINEERING: 'Web de phishing o engaño conocida.',
  UNWANTED_SOFTWARE: 'Instala software no deseado.',
  POTENTIALLY_HARMFUL_APPLICATION: 'Ofrece aplicaciones potencialmente dañinas.',
}

// ES: Límite sencillo de peticiones por IP para que nadie gaste la cuota de la API
// EN: Simple per-IP request limit so nobody burns through the API quota
const peticiones = new Map()
function permitido(ip) {
  const ahora = Date.now()
  const lista = (peticiones.get(ip) || []).filter((t) => ahora - t < 60_000)
  lista.push(ahora)
  peticiones.set(ip, lista)
  return lista.length <= LIMITE_POR_MINUTO
}

function json(res, estado, datos) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(datos))
}

// ES: Lee el JSON de la petición con un tamaño máximo
// EN: Reads the request JSON with a maximum size
async function leerCuerpo(req) {
  let cuerpo = ''
  for await (const trozo of req) {
    cuerpo += trozo
    if (cuerpo.length > MAX_CUERPO) throw new Error('demasiado grande')
  }
  return JSON.parse(cuerpo)
}

// ES: POST /api/revisar { url } → { configurado, peligrosa, amenazas }
// EN: POST /api/revisar { url } → { configurado, peligrosa, amenazas }
async function revisar(req, res) {
  if (!CLAVE) return json(res, 503, { configurado: false })
  if (!permitido(req.socket.remoteAddress)) return json(res, 429, { error: 'Demasiadas consultas. Espera un minuto.' })

  let url
  try {
    const { url: texto } = await leerCuerpo(req)
    url = new URL(String(texto))
    if (!['http:', 'https:'].includes(url.protocol) || url.href.length > 2048) throw new Error()
  } catch {
    return json(res, 400, { error: 'Enlace no válido.' })
  }

  try {
    const r = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${CLAVE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        client: { clientId: 'marmitako-group', clientVersion: '1.0' },
        threatInfo: {
          threatTypes: Object.keys(AMENAZAS),
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: url.href }],
        },
      }),
    })
    if (!r.ok) throw new Error(`Safe Browsing respondió ${r.status}`)
    const datos = await r.json()
    const tipos = [...new Set((datos.matches || []).map((m) => m.threatType))]
    json(res, 200, { configurado: true, peligrosa: tipos.length > 0, amenazas: tipos.map((t) => AMENAZAS[t] || t) })
  } catch (err) {
    console.error(err.message)
    json(res, 502, { error: 'No se pudo consultar la base de datos de Google.' })
  }
}

// ES: Sirve los archivos de dist/ sin dejar salir de la carpeta (evita path traversal)
// EN: Serves files from dist/ without letting paths escape the folder (prevents path traversal)
async function estatico(req, res) {
  const ruta = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '')
  let fichero = join(DIST, ruta || 'index.html')
  if (!fichero.startsWith(DIST)) fichero = join(DIST, 'index.html')
  try {
    const contenido = await readFile(fichero)
    res.writeHead(200, { 'Content-Type': TIPOS[extname(fichero)] || 'application/octet-stream' })
    res.end(contenido)
  } catch {
    try {
      res.writeHead(200, { 'Content-Type': TIPOS['.html'] })
      res.end(await readFile(join(DIST, 'index.html')))
    } catch {
      res.writeHead(404).end('Falta dist/. Ejecuta pnpm build.')
    }
  }
}

createServer((req, res) => {
  if (req.url === '/api/revisar' && req.method === 'POST') return revisar(req, res)
  if (req.url.startsWith('/api/')) return json(res, 404, { error: 'No existe.' })
  if (req.method === 'GET') return estatico(req, res)
  res.writeHead(405).end()
}).listen(PUERTO, () => {
  console.log(`API en http://localhost:${PUERTO}  (Safe Browsing: ${CLAVE ? 'activado' : 'sin clave, desactivado'})`)
})
