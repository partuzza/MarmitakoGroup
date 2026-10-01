import { createRouter, createWebHashHistory } from 'vue-router'
import { watch } from 'vue'
import { idioma, t } from '../i18n'
import Inicio from '../views/Inicio.vue'
import Cursos from '../views/Cursos.vue'
import PhishingTest from '../views/PhishingTest.vue'
import Precios from '../views/Precios.vue'
import Panel from '../views/Panel.vue'

const router = createRouter({
  // ES: Hash history: funciona en cualquier hosting estático (GitHub Pages) sin configurar nada
  // EN: Hash history: works on any static hosting (GitHub Pages) with no extra setup
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/cursos', name: 'cursos', component: Cursos },
    { path: '/phishing-test', name: 'phishing-test', component: PhishingTest },
    { path: '/precios', name: 'precios', component: Precios },
    { path: '/panel', name: 'panel', component: Panel },
  ],
  // ES: ?ir=contacto hace scroll a esa sección; si no, vuelve arriba
  // EN: ?ir=contacto scrolls to that section; otherwise goes back to the top
  scrollBehavior(to) {
    if (to.query.ir) return { el: '#' + to.query.ir }
    return { top: 0 }
  },
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
