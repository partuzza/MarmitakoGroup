import { createRouter, createWebHashHistory } from 'vue-router'
import Inicio from '../views/Inicio.vue'
import Cursos from '../views/Cursos.vue'

const titulos = {
  inicio: 'Marmitako Group | Ciberseguridad para jóvenes',
  cursos: 'Cursos | Marmitako Group',
}

const router = createRouter({
  // Hash history: funciona en cualquier hosting estático (GitHub Pages) sin configurar nada
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/cursos', name: 'cursos', component: Cursos },
  ],
  scrollBehavior(to) {
    if (to.query.ir) return { el: '#' + to.query.ir }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = titulos[to.name] ?? titulos.inicio
})

export default router
