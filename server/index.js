// ES: Mini servidor sin dependencias:
//      - POST /api/revisar → consulta Google Safe Browsing sin exponer la clave en el navegador
//      - POST /api/login, POST /api/logout, GET /api/yo → login de demo (ver auth.js)
//      - GET /api/panel → datos del panel docente, solo para profesores
//      - En producción (pnpm start) también sirve la web ya compilada de dist/
// EN: Tiny dependency-free server:
//      - POST /api/revisar → queries Google Safe Browsing without exposing the key to the browser
//      - POST /api/login, POST /api/logout, GET /api/yo → demo login (see auth.js)
//      - GET /api/panel → teacher dashboard data, teachers only
//      - In production (pnpm start) it also serves the built website from dist/
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { join, normalize, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { comprobar, cookieSesion, cookieBorrada, usuarioDe, secretoFijo } from './auth.js'

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
const LOGINS_POR_MINUTO = 5
const ALUMNOS_DEMO = JSON.parse(readFileSync(new URL('./alumnos-demo.json', import.meta.url)))

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }

// ES: Tipos de amenaza que se consultan a Google
// EN: Threat types requested from Google
const AMENAZAS = {
  MALWARE: 'Distribuye malware (programas maliciosos).',
  SOCIAL_ENGINEERING: 'Web de phishing o engaño conocida.',
  UNWANTED_SOFTWARE: 'Instala software no deseado.',
  POTENTIALLY_HARMFUL_APPLICATION: 'Ofrece aplicaciones potencialmente dañinas.',
}

// ES: Límite sencillo de peticiones por IP y minuto (para no gastar la cuota de la API ni dejar probar contraseñas sin fin)
// EN: Simple per-IP, per-minute request limit (so nobody burns the API quota or guesses passwords endlessly)
function limitador(maximo) {
  const peticiones = new Map()
  return (ip) => {
    const ahora = Date.now()
    const lista = (peticiones.get(ip) || []).filter((t) => ahora - t < 60_000)
    lista.push(ahora)
    peticiones.set(ip, lista)
    return lista.length <= maximo
  }
}
const permitido = limitador(LIMITE_POR_MINUTO)
const loginPermitido = limitador(LOGINS_POR_MINUTO)

function json(res, estado, datos, cabeceras = {}) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8', ...cabeceras })
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

// ES: POST /api/login { email, clave } → { usuario } y deja la cookie de sesión
// EN: POST /api/login { email, clave } → { usuario } and sets the session cookie
async function login(req, res) {
  if (!loginPermitido(req.socket.remoteAddress)) return json(res, 429, { error: 'demasiados' })
  let usuario
  try {
    const { email, clave } = await leerCuerpo(req)
    usuario = await comprobar(email, clave)
  } catch {
    return json(res, 400, { error: 'datos' })
  }
  // ES: El mismo error si falla el correo o la contraseña, para no revelar qué correos existen
  // EN: Same error whether the email or the password is wrong, so it doesn't reveal which emails exist
  if (!usuario) return json(res, 401, { error: 'credenciales' })
  json(res, 200, { usuario }, { 'Set-Cookie': cookieSesion(req, usuario.email) })
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
  if (req.url === '/api/login' && req.method === 'POST') return login(req, res)
  if (req.url === '/api/logout' && req.method === 'POST') return json(res, 200, { ok: true }, { 'Set-Cookie': cookieBorrada(req) })
  if (req.url === '/api/yo' && req.method === 'GET') return json(res, 200, { usuario: usuarioDe(req) })
  if (req.url === '/api/panel' && req.method === 'GET') {
    const usuario = usuarioDe(req)
    if (!usuario) return json(res, 401, { error: 'sin sesión' })
    if (!usuario.docente) return json(res, 403, { error: 'solo docentes' })
    return json(res, 200, { alumnos: ALUMNOS_DEMO })
  }
  if (req.url.startsWith('/api/')) return json(res, 404, { error: 'No existe.' })
  if (req.method === 'GET') return estatico(req, res)
  res.writeHead(405).end()
}).listen(PUERTO, () => {
  console.log(`API en http://localhost:${PUERTO}  (Safe Browsing: ${CLAVE ? 'activado' : 'sin clave, desactivado'})`)
  if (!secretoFijo()) console.log('Sin SESSION_SECRET en .env: las sesiones se cerrarán al reiniciar el servidor')
})
