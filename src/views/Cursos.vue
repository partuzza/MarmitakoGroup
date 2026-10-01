<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { idioma, t } from '../i18n'
import { usuario } from '../auth'
import { cursos, NIVELES, CURSOS_GRATIS, imagenCurso } from '../data/cursos'

const nivel = ref('todos')
const busqueda = ref('')
const inscrito = ref(null)

// ES: Filtra por nivel y por texto (en el idioma activo)
// EN: Filters by level and by text (in the active language)
const lista = computed(() => {
  const txt = busqueda.value.trim().toLowerCase()
  return cursos.filter((c) =>
    (nivel.value === 'todos' || c.nivel === nivel.value) &&
    (c.titulo[idioma.value] + ' ' + c.desc[idioma.value]).toLowerCase().includes(txt),
  )
})

// ES: Con suscripción se ven todos. Sin ella, los primeros se ven enteros y de los siguientes solo asoman unos pocos, borrosos, detrás del aviso
// EN: With a subscription everything is visible. Without one, the first ones are fully visible and only a few of the next ones peek out, blurred, behind the notice
const visibles = computed(() => (usuario.value?.suscrito ? lista.value : lista.value.slice(0, CURSOS_GRATIS)))
const bloqueados = computed(() => lista.value.slice(CURSOS_GRATIS, CURSOS_GRATIS + 3))
const ocultos = computed(() => lista.value.length - visibles.value.length)

// ES: El aviso aparece con una animación cuando el usuario llega haciendo scroll hasta el muro
// EN: The notice animates in when the user scrolls down to the wall
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

      <div v-if="lista.length" class="cursos-grid">
        <article v-for="c in visibles" :key="c.id" class="curso">
          <img :src="imagenCurso(c)" alt="" loading="lazy" width="400" height="225">
          <div class="curso-cuerpo">
            <span class="nivel" :class="'nivel-' + c.nivel">{{ t('niveles.' + c.nivel) }}</span>
            <h2>{{ c.titulo[idioma] }}</h2>
            <p>{{ c.desc[idioma] }}</p>
            <div class="curso-pie">
              <span class="num">{{ c.horas }} · {{ c.precio ? c.precio + ' €' : t('cursos.gratis') }}</span>
              <button class="link-btn" @click="inscrito = c">{{ t('cursos.inscribirme') }}</button>
            </div>
          </div>
        </article>
      </div>
      <p v-else class="empty">{{ t('cursos.vacio') }}</p>

      <div v-if="ocultos > 0" ref="muro" class="muro">
        <div class="cursos-grid bloqueados" aria-hidden="true" inert>
          <article v-for="c in bloqueados" :key="c.id" class="curso">
            <img :src="imagenCurso(c)" alt="" loading="lazy" width="400" height="225">
            <div class="curso-cuerpo">
              <span class="nivel" :class="'nivel-' + c.nivel">{{ t('niveles.' + c.nivel) }}</span>
              <h2>{{ c.titulo[idioma] }}</h2>
              <p>{{ c.desc[idioma] }}</p>
            </div>
          </article>
        </div>
        <div class="muro-aviso" :class="{ visible: avisoVisible }">
          <p class="candado" aria-hidden="true">🔒</p>
          <h2>{{ t('cursos.muroTitulo') }}</h2>
          <p>{{ t('cursos.muroTexto', { n: ocultos }) }}</p>
          <RouterLink class="btn" to="/precios">{{ t('cursos.muroBoton') }}</RouterLink>
        </div>
      </div>

      <p class="msg" aria-live="polite">{{ inscrito ? t('cursos.inscrito', { curso: inscrito.titulo[idioma] }) : '' }}</p>
    </div>
  </section>
</template>
