import { ref } from 'vue'

// ES: Usuario con sesión iniciada ({ email, nombre, suscrito, docente }) o null.
//     La cookie de sesión es HttpOnly: aquí solo guardamos lo que nos dice el servidor
// EN: Logged-in user ({ email, nombre, suscrito, docente }) or null.
//     The session cookie is HttpOnly: here we only keep what the server tells us
export const usuario = ref(null)

// ES: Pregunta al servidor quién hay conectado. Si el servidor no está (p. ej. GitHub Pages), se sigue sin sesión
// EN: Asks the server who is logged in. If there is no server (e.g. GitHub Pages), it just stays logged out
export const sesionLista = fetch('api/yo')
  .then((r) => (r.ok ? r.json() : { usuario: null }))
  .then((d) => { usuario.value = d.usuario })
  .catch(() => {})

// ES: Devuelve null si ha ido bien o la clave del mensaje de error (ver i18n → login.errores)
// EN: Returns null on success or the error message key (see i18n → login.errores)
export async function entrar(email, clave) {
  let r
  try {
    r = await fetch('api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, clave }),
    })
  } catch {
    return 'servidor'
  }
  if (r.status === 401) return 'credenciales'
  if (r.status === 429) return 'demasiados'
  if (!r.ok) return 'servidor'
  usuario.value = (await r.json()).usuario
  return null
}

export async function salir() {
  try {
    await fetch('api/logout', { method: 'POST' })
  } finally {
    usuario.value = null
  }
}
