<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { idioma, t } from '../i18n'
import { usuario } from '../auth'
import { misCursos, apuntarme } from '../misCursos'
import { cursos, NIVELES, esLibre } from '../data/cursos'
import TarjetaCurso from '../components/TarjetaCurso.vue'

const router = useRouter()
const nivel = ref('todos')
const busqueda = ref('')
const aviso = ref('')

// ES: Filtra por nivel y por texto (en el idioma activo)
// EN: Filters by level and by text (in the active language)
const lista = computed(() => {
  const txt = busqueda.value.trim().toLowerCase()
  return cursos.filter((c) =>
    (nivel.value === 'todos' || c.nivel === nivel.value) &&
    (c.titulo[idioma.value] + ' ' + c.desc[idioma.value]).toLowerCase().includes(txt),
  )
})

// ES: Con suscripción se ve todo. Sin ella, solo los cursos libres; de los demás asoman unos pocos, borrosos, detrás del aviso
// EN: With a subscription everything is visible. Without one, only the free courses; a few of the rest peek out, blurred, behind the notice
const suscrito = computed(() => Boolean(usuario.value?.suscrito))
const visibles = computed(() => lista.value.filter((c) => suscrito.value || esLibre(c.id)))
const cerrados = computed(() => (suscrito.value ? [] : lista.value.filter((c) => !esLibre(c.id))))
const bloqueados = computed(() => cerrados.value.slice(0, 3))

// ES: Sin sesión, «Inscribirme» lleva al login y luego vuelve aquí
// EN: Without a session, "Enrol" goes to the login and then comes back here
async function inscribirme(c) {
  if (!usuario.value) return router.push({ name: 'login', query: { volver: '/cursos' } })
  try {
    await apuntarme(c.id)
    aviso.value = t('cursos.inscrito', { curso: c.titulo[idioma.value] })
  } catch {
    aviso.value = t('cursos.errorInscribir')
  }
}

// ES: El aviso de suscripción aparece con una animación cuando el usuario llega haciendo scroll hasta el muro
// EN: The subscription notice animates in when the user scrolls down to the wall
const muro = ref(null)
const avisoVisible = ref(false)
const observador = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) avisoVisible.value = true
}, { threshold: 0.25 })
watch(muro, (el, anterior) => {
  if (anterior) observador.unobserve(anterior)
  if (el) observador.observe(el)
})
onUnmounted(() => observador.disconnect())
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('cursos.titulo') }}</h1>
      <p class="lead">{{ t('cursos.intro') }}</p>

      <div class="controles">
        <label class="sr" for="nivel">{{ t('cursos.nivel') }}</label>
        <select id="nivel" v-model="nivel">
          <option value="todos">{{ t('cursos.todos') }}</option>
          <option v-for="n in NIVELES" :key="n" :value="n">{{ t('niveles.' + n) }}</option>
        </select>
        <label class="sr" for="q">{{ t('cursos.buscar') }}</label>
        <input id="q" v-model="busqueda" type="search" :placeholder="t('cursos.placeholder')">
      </div>

      <div v-if="visibles.length" class="cursos-grid">
        <TarjetaCurso v-for="c in visibles" :key="c.id" :curso="c">
          <span class="num">{{ c.horas }} · {{ c.precio ? c.precio + ' €' : t('cursos.gratis') }}</span>
          <RouterLink v-if="misCursos.includes(c.id)" class="apuntado" to="/mis-cursos">✓ {{ t('cursos.apuntado') }}</RouterLink>
          <button v-else-if="!usuario?.docente" class="link-btn" @click="inscribirme(c)">{{ t('cursos.inscribirme') }}</button>
        </TarjetaCurso>
      </div>
      <p v-else-if="!cerrados.length" class="empty">{{ t('cursos.vacio') }}</p>

      <p class="msg" aria-live="polite">{{ aviso }}</p>

      <div v-if="cerrados.length" ref="muro" class="muro">
        <div class="cursos-grid bloqueados" aria-hidden="true" inert>
          <TarjetaCurso v-for="c in bloqueados" :key="c.id" :curso="c" />
        </div>
        <div class="muro-aviso" :class="{ visible: avisoVisible }">
          <p class="candado" aria-hidden="true">🔒</p>
          <h2>{{ t('cursos.muroTitulo') }}</h2>
          <p>{{ t('cursos.muroTexto', { n: cerrados.length }) }}</p>
          <RouterLink class="btn" to="/precios">{{ t('cursos.muroBoton') }}</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
