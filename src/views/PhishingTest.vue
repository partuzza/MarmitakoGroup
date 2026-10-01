<script setup>
import { ref, computed } from 'vue'
import { t } from '../i18n'
import { usuario } from '../auth'
import { analizarUrl } from '../utils/analizarUrl'
import UrlColoreada from '../components/UrlColoreada.vue'
import QuizPhishing from '../components/QuizPhishing.vue'

const modo = ref('analizar')
const enlace = ref('')
const res = ref(null)
// ES: null | 'cargando' | { peligrosa, amenazas } — si la API no está disponible se queda en null
// EN: null | 'cargando' (loading) | { peligrosa, amenazas } — stays null if the API is unavailable
const google = ref(null)
// ES: Contador para ignorar respuestas lentas de un enlace anterior
// EN: Counter to ignore slow responses from a previous link
let consulta = 0

// ES: Sin suscripción solo se puede analizar ANALISIS_GRATIS enlaces; al pedir uno más sale el aviso de suscripción.
//     El contador se guarda en el navegador: basta para la demo, pero borrando los datos del sitio se reinicia
// EN: Without a subscription only ANALISIS_GRATIS links can be checked; asking for one more shows the subscription notice.
//     The counter is stored in the browser: fine for the demo, but clearing site data resets it
const ANALISIS_GRATIS = 1
function leerUsados() {
  try {
    return Number(localStorage.getItem('analisisUsados')) || 0
  } catch {
    return 0
  }
}
const usados = ref(leerUsados())
const suscrito = computed(() => Boolean(usuario.value?.suscrito))
const quedan = computed(() => Math.max(0, ANALISIS_GRATIS - usados.value))
const bloqueado = ref(false)

function contarAnalisis() {
  usados.value++
  try {
    localStorage.setItem('analisisUsados', usados.value)
  } catch {
    // ES: Sin localStorage el contador solo dura esta visita
    // EN: Without localStorage the counter only lasts this visit
  }
}

// ES: Si Google la tiene en su lista negra, manda sobre el análisis local
// EN: If Google has it on its blocklist, that overrides the local analysis
const nivel = computed(() => (google.value?.peligrosa ? 'peligro' : res.value?.nivel))

async function analizar() {
  const analisis = analizarUrl(enlace.value)
  google.value = null
  bloqueado.value = false
  // ES: Los enlaces no válidos no gastan el análisis gratis
  // EN: Invalid links don't use up the free check
  if (analisis?.valido && !suscrito.value) {
    if (quedan.value === 0) {
      res.value = null
      bloqueado.value = true
      return
    }
    contarAnalisis()
  }
  res.value = analisis
  if (!res.value?.valido || !res.value.href) return

  const id = ++consulta
  google.value = 'cargando'
  try {
    const r = await fetch('api/revisar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: res.value.href }),
    })
    const datos = r.ok ? await r.json() : null
    if (id === consulta) google.value = datos?.configurado ? datos : null
  } catch {
    if (id === consulta) google.value = null
  }
}
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('phishing.titulo') }}</h1>

      <div class="pestanas" role="tablist" :aria-label="t('phishing.modo')">
        <button role="tab" :aria-selected="modo === 'analizar'" @click="modo = 'analizar'">{{ t('phishing.analizar') }}</button>
        <button role="tab" :aria-selected="modo === 'quiz'" @click="modo = 'quiz'">{{ t('phishing.quiz') }}</button>
      </div>

      <div v-if="modo === 'analizar'" class="panel">
        <form class="box" @submit.prevent="analizar">
          <label class="sr" for="enlace">{{ t('phishing.enlace') }}</label>
          <input id="enlace" v-model="enlace" type="text" inputmode="url" autocomplete="off" spellcheck="false" :placeholder="t('phishing.placeholder')" required>
          <button class="btn" type="submit">{{ t('phishing.boton') }}</button>
        </form>
        <p v-if="!suscrito && quedan > 0" class="hint">{{ t('phishing.quedan', { n: quedan }) }}</p>

        <div aria-live="polite">
          <div v-if="bloqueado" class="aviso-pago">
            <p class="candado" aria-hidden="true">🔒</p>
            <h2>{{ t('phishing.limiteTitulo') }}</h2>
            <p>{{ t('phishing.limiteTexto') }}</p>
            <RouterLink class="btn" to="/precios">{{ t('cursos.muroBoton') }}</RouterLink>
            <p v-if="!usuario" class="aviso-login">
              {{ t('phishing.yaSuscrito') }}
              <RouterLink :to="{ name: 'login', query: { volver: '/phishing-test' } }">{{ t('menu.entrar') }}</RouterLink>
            </p>
          </div>

          <p v-else-if="res && !res.valido" class="empty">{{ t('phishing.invalido') }}</p>

          <article v-else-if="res" class="informe" :class="nivel">
            <p class="veredicto">{{ t('phishing.veredicto.' + nivel) }} <span>· {{ res.puntos }} {{ t('phishing.pts') }}</span></p>
            <UrlColoreada v-if="res.partes.length" :partes="res.partes" />
            <ul class="senales">
              <li v-if="google?.peligrosa" class="grave">{{ t('phishing.googleMal') }}</li>
              <li v-for="a in res.alertas" :key="a.clave" :class="{ grave: a.peso >= 4 }">{{ t('senales.' + a.clave, a.params) }}</li>
              <li v-for="b in res.buenas" :key="b.clave" class="bien">{{ t('senales.' + b.clave, b.params) }}</li>
              <li v-if="google && google !== 'cargando' && !google.peligrosa" class="bien">{{ t('phishing.googleBien') }}</li>
            </ul>
          </article>
        </div>
      </div>

      <QuizPhishing v-else />
    </div>
  </section>
</template>

<style scoped>
.panel { max-width: 640px; display: grid; gap: 28px; }
.informe { --c: var(--verde); display: grid; gap: 14px; }
.informe.sospechoso { --c: var(--ambar); }
.informe.peligro { --c: var(--rojo); }
.veredicto { font: 700 1.5rem var(--serif); color: var(--c); }
.veredicto span { font: 400 .9rem var(--sans); color: var(--gris); }
.senales { padding-left: 1.1em; display: grid; gap: 4px; font-size: .95rem; }
.senales li.grave { color: var(--rojo); }
.senales li.bien { color: var(--gris); }
</style>
