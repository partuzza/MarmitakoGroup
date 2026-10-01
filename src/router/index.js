import { createRouter, createWebHashHistory } from 'vue-router'
import { watch } from 'vue'
import { idioma, t } from '../i18n'
import { usuario, sesionLista } from '../auth'
import Inicio from '../views/Inicio.vue'
import Cursos from '../views/Cursos.vue'
import PhishingTest from '../views/PhishingTest.vue'
import Precios from '../views/Precios.vue'
import Panel from '../views/Panel.vue'
import Login from '../views/Login.vue'
import MisCursos from '../views/MisCursos.vue'
import MiSuscripcion from '../views/MiSuscripcion.vue'

const router = createRouter({
  // ES: Hash history: funciona en cualquier hosting estático (GitHub Pages) sin configurar nada
  // EN: Hash history: works on any static hosting (GitHub Pages) with no extra setup
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/cursos', name: 'cursos', component: Cursos },
    { path: '/phishing-test', name: 'phishing-test', component: PhishingTest },
    { path: '/precios', name: 'precios', component: Precios },
    { path: '/panel', name: 'panel', component: Panel, meta: { docente: true } },
    { path: '/mis-cursos', name: 'mis-cursos', component: MisCursos, meta: { alumno: true } },
    { path: '/mi-suscripcion', name: 'mi-suscripcion', component: MiSuscripcion, meta: { sesion: true } },
    { path: '/login', name: 'login', component: Login },
  ],
  // ES: ?ir=contacto hace scroll a esa sección; si no, vuelve arriba
  // EN: ?ir=contacto scrolls to that section; otherwise goes back to the top
  //     Si solo cambia la query en la misma página (p. ej. una pestaña), no se mueve
  //     If only the query changes on the same page (e.g. a tab), it stays put
  scrollBehavior(to, from) {
    if (to.query.ir) return { el: '#' + to.query.ir }
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

// ES: meta.sesion → cualquiera con sesión; meta.docente → solo profesores; meta.alumno → solo alumnos (un profesor va a su panel). Sin permiso, al login y luego se vuelve aquí.
//     Es solo para la navegación: quien protege los datos de verdad es el servidor (/api/panel, /api/mis-cursos)
// EN: meta.sesion → anyone logged in; meta.docente → teachers only; meta.alumno → students only (a teacher goes to their dashboard). Without access, to the login and then back here.
//     This only handles navigation: the server is what really protects the data (/api/panel, /api/mis-cursos)
router.beforeEach(async (to) => {
  await sesionLista
  const u = usuario.value
  if (to.meta.docente && !u?.docente) return { name: 'login', query: { volver: to.fullPath } }
  if ((to.meta.alumno || to.meta.sesion) && !u) return { name: 'login', query: { volver: to.fullPath } }
  if (to.meta.alumno && u.docente) return { name: 'panel' }
})

// ES: Título de la pestaña según la página y el idioma
// EN: Tab title based on the page and the language
function ponerTitulo() {
  const nombre = router.currentRoute.value.name ?? 'inicio'
  document.title = t(`titulos.${nombre}`)
}
router.afterEach(ponerTitulo)
watch(idioma, ponerTitulo)

export default router
