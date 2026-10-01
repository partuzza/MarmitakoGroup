import { ref, watch } from 'vue'
import { usuario } from './auth'

// ES: Ids de los cursos a los que está apuntado el alumno con sesión (los guarda el servidor)
// EN: Ids of the courses the logged-in student is enrolled in (stored by the server)
export const misCursos = ref([])

async function pedir(method, curso) {
  const r = await fetch('api/mis-cursos', method === 'GET' ? {} : {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ curso }),
  })
  if (!r.ok) throw new Error(r.status)
  misCursos.value = (await r.json()).cursos
}

// ES: Se recargan al entrar y se vacían al salir. Los profesores no se apuntan a cursos
// EN: Reloaded on login and cleared on logout. Teachers don't enrol in courses
watch(usuario, (u) => {
  misCursos.value = []
  if (u && !u.docente) pedir('GET').catch(() => {})
}, { immediate: true })

export const apuntarme = (id) => pedir('POST', id)
export const darmeDeBaja = (id) => pedir('DELETE', id)
