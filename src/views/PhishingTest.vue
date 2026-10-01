<script setup>
import { ref, computed } from 'vue'
import { t } from '../i18n'
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

// ES: Si Google la tiene en su lista negra, manda sobre el análisis local
// EN: If Google has it on its blocklist, that overrides the local analysis
const nivel = computed(() => (google.value?.peligrosa ? 'peligro' : res.value?.nivel))

async function analizar() {
  res.value = analizarUrl(enlace.value)
  google.value = null
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

        <div aria-live="polite">
          <p v-if="res && !res.valido" class="empty">{{ t('phishing.invalido') }}</p>

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
.pestanas { display: flex; gap: 24px; border-bottom: 1px solid var(--linea); margin-bottom: 28px; }
.pestanas button { background: none; border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; padding: 6px 0; font: inherit; color: var(--gris); cursor: pointer; }
.pestanas button[aria-selected=true] { color: var(--texto); border-color: var(--texto); }
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
