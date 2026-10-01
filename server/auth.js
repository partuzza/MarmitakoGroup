// ES: Login de demo sin base de datos:
//      - Los usuarios están en usuarios.json con la contraseña en hash (scrypt), nunca en texto plano
//      - La sesión es una cookie HttpOnly firmada con SESSION_SECRET (HMAC): el navegador no puede leerla ni falsificarla
// EN: Demo login without a database:
//      - Users live in usuarios.json with the password hashed (scrypt), never in plain text
//      - The session is an HttpOnly cookie signed with SESSION_SECRET (HMAC): the browser can't read or forge it
import { readFileSync } from 'node:fs'
import { scrypt, randomBytes, createHmac, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)
const usuarios = JSON.parse(readFileSync(new URL('./usuarios.json', import.meta.url)))

const COOKIE = 'sesion'
const DURACION = 7 * 24 * 60 * 60 // ES: 7 días, en segundos · EN: 7 days, in seconds

// ES: Sin SESSION_SECRET se inventa uno al arrancar: funciona, pero las sesiones se cierran al reiniciar el servidor.
//     Se lee al usarlo (no al importar) porque index.js carga el .env después de los imports
// EN: Without SESSION_SECRET one is made up at startup: it works, but sessions end when the server restarts.
//     It's read on use (not on import) because index.js loads .env after the imports
let secreto
const SECRETO = () => (secreto ??= process.env.SESSION_SECRET || randomBytes(32).toString('hex'))
export const secretoFijo = () => Boolean(process.env.SESSION_SECRET)

// ES: Hash de relleno para que un correo que no existe tarde lo mismo que una contraseña mal puesta
// EN: Dummy hash so an unknown email takes as long as a wrong password
const HASH_FALSO = `${'0'.repeat(32)}:${'0'.repeat(128)}`

async function claveCorrecta(clave, guardada) {
  const [sal, hash] = guardada.split(':')
  const calculado = await scryptAsync(clave, Buffer.from(sal, 'hex'), 64)
  return timingSafeEqual(calculado, Buffer.from(hash, 'hex'))
}

const firmar = (texto) => createHmac('sha256', SECRETO()).update(texto).digest('base64url')

// ES: Datos que se pueden enseñar al navegador (sin el hash)
// EN: Data that can be shown to the browser (without the hash)
const publico = ({ email, nombre, plan, suscrito, docente }) => ({ email, nombre, plan, suscrito, docente })

export async function comprobar(email, clave) {
  const usuario = usuarios.find((u) => u.email === String(email).trim().toLowerCase())
  const ok = await claveCorrecta(String(clave), usuario?.clave ?? HASH_FALSO)
  return ok && usuario ? publico(usuario) : null
}

// ES: Cookie = email|caducidad.firma
// EN: Cookie = email|expiry.signature
export function cookieSesion(req, email) {
  const datos = Buffer.from(`${email}|${Math.floor(Date.now() / 1000) + DURACION}`).toString('base64url')
  return `${COOKIE}=${datos}.${firmar(datos)}; ${atributos(req)}; Max-Age=${DURACION}`
}

export const cookieBorrada = (req) => `${COOKIE}=; ${atributos(req)}; Max-Age=0`

// ES: Secure solo si la web va por HTTPS (en localhost va por HTTP y si no, el navegador no guardaría la cookie)
// EN: Secure only when the site runs on HTTPS (localhost uses HTTP, and the browser would otherwise drop the cookie)
function atributos(req) {
  const https = req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted
  return `Path=/; HttpOnly; SameSite=Lax${https ? '; Secure' : ''}`
}

// ES: Devuelve el usuario de la cookie si la firma es válida y no ha caducado; si no, null
// EN: Returns the cookie's user if the signature is valid and not expired; otherwise null
export function usuarioDe(req) {
  const valor = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1)
  if (!valor) return null
  const [datos, firma] = valor.split('.')
  if (!datos || !firma) return null
  const esperada = Buffer.from(firmar(datos))
  const recibida = Buffer.from(firma)
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null
  const [email, caduca] = Buffer.from(datos, 'base64url').toString().split('|')
  if (Number(caduca) < Date.now() / 1000) return null
  const usuario = usuarios.find((u) => u.email === email)
  return usuario ? publico(usuario) : null
}
