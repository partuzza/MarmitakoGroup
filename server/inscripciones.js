// ES: Cursos a los que se ha apuntado cada usuario, sin base de datos:
//      - Al arrancar se parte de los cursos de ejemplo de usuarios.json
//      - Cada cambio se guarda en inscripciones.json (fuera de git) para que no se pierda al reiniciar
// EN: Courses each user has enrolled in, without a database:
//      - On startup it starts from the sample courses in usuarios.json
//      - Every change is saved to inscripciones.json (not in git) so it survives restarts
import { readFileSync, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { cursos, esLibre } from '../src/data/cursos.js'

const ARCHIVO = new URL('./inscripciones.json', import.meta.url)
const usuarios = JSON.parse(readFileSync(new URL('./usuarios.json', import.meta.url)))
const inscripciones = existsSync(ARCHIVO)
  ? JSON.parse(readFileSync(ARCHIVO))
  : Object.fromEntries(usuarios.map((u) => [u.email, u.cursos ?? []]))

const guardar = () => writeFile(ARCHIVO, JSON.stringify(inscripciones, null, 2) + '\n')

export const cursosDe = (email) => inscripciones[email] ?? []

// ES: Devuelve null si se ha apuntado o el motivo por el que no puede
// EN: Returns null on success or the reason it can't enrol
export async function apuntar(usuario, id) {
  if (!cursos.some((c) => c.id === id)) return 'no existe'
  if (usuario.docente) return 'solo alumnos'
  if (!usuario.suscrito && !esLibre(id)) return 'requiere suscripción'
  const lista = cursosDe(usuario.email)
  if (!lista.includes(id)) {
    inscripciones[usuario.email] = [...lista, id]
    await guardar()
  }
  return null
}

export async function darDeBaja(usuario, id) {
  inscripciones[usuario.email] = cursosDe(usuario.email).filter((c) => c !== id)
  await guardar()
}
