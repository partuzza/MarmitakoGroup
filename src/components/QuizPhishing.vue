<script setup>
import { ref, computed } from 'vue'
import { t } from '../i18n'
import { analizarUrl } from '../utils/analizarUrl'
import UrlColoreada from './UrlColoreada.vue'

// ES: La explicación de cada pregunta está en i18n → quiz.porque[id]
// EN: Each question's explanation lives in i18n → quiz.porque[id]
const PREGUNTAS = [
  { url: 'https://www.bbva.es/personas.html', phishing: false, id: 'bbva' },
  { url: 'https://bbva.es.acceso-clientes.com/login', phishing: true, id: 'bbvaFalso' },
  { url: 'https://www.correos.es/es/es/herramientas/localizador', phishing: false, id: 'correos' },
  { url: 'http://correos-entrega-pendiente.top/pago', phishing: true, id: 'correosFalso' },
  { url: 'https://accounts.google.com/signin', phishing: false, id: 'google' },
  { url: 'https://g0ogle-security.com/verify', phishing: true, id: 'googleFalso' },
  { url: 'https://www.paypal.com@paypal-seguro.xyz/', phishing: true, id: 'paypalArroba' },
  { url: 'https://www.netflix.com/es/login', phishing: false, id: 'netflix' },
  { url: 'https://netflix-pago-rechazado.web.app', phishing: true, id: 'netflixFalso' },
  { url: 'https://sede.agenciatributaria.gob.es/', phishing: false, id: 'hacienda' },
  { url: 'https://agenciatributaria-reembolso.com/devolucion', phishing: true, id: 'haciendaFalso' },
  { url: 'https://www.amazon.es/gp/your-account/order-history', phishing: false, id: 'amazon' },
  { url: 'https://arnazon.es/pedido-bloqueado', phishing: true, id: 'amazonFalso' },
  { url: 'http://185.23.44.12/instagram/login.php', phishing: true, id: 'instagramIp' },
  { url: 'https://www.instagram.com/accounts/password/reset/', phishing: false, id: 'instagram' },
]
// ES: Preguntas por partida
// EN: Questions per round
const TOTAL = 8

const ronda = ref([])
const actual = ref(0)
const respuesta = ref(null)
const aciertos = ref(0)

const pregunta = computed(() => ronda.value[actual.value])
const analisis = computed(() => pregunta.value && analizarUrl(pregunta.value.url))
const acertada = computed(() => respuesta.value === pregunta.value?.phishing)
const terminado = computed(() => actual.value >= ronda.value.length)

function empezar() {
  ronda.value = [...PREGUNTAS].sort(() => Math.random() - 0.5).slice(0, TOTAL)
  actual.value = 0
  aciertos.value = 0
  respuesta.value = null
}

function responder(esPhishing) {
  if (respuesta.value !== null) return
  respuesta.value = esPhishing
  if (acertada.value) aciertos.value++
}

function siguiente() {
  respuesta.value = null
  actual.value++
}

empezar()
</script>

<template>
  <div class="quiz">
    <template v-if="!terminado">
      <p class="contador">{{ t('quiz.contador', { n: actual + 1, total: ronda.length }) }}</p>
      <p class="url-simple">{{ pregunta.url }}</p>

      <div v-if="respuesta === null" class="acciones">
        <button class="btn alt" @click="responder(false)">{{ t('quiz.legitimo') }}</button>
        <button class="btn" @click="responder(true)">{{ t('quiz.phishing') }}</button>
      </div>

      <div v-else class="feedback" :class="acertada ? 'bien' : 'mal'" aria-live="polite">
        <UrlColoreada :partes="analisis.partes" />
        <p><strong>{{ acertada ? t('quiz.correcto') : t('quiz.fallo') }}</strong> · {{ t('quiz.porque.' + pregunta.id) }}</p>
        <button class="btn" @click="siguiente">{{ t('quiz.siguiente') }}</button>
      </div>
    </template>

    <div v-else class="final" aria-live="polite">
      <p class="nota">{{ aciertos }}/{{ ronda.length }}</p>
      <button class="btn" @click="empezar">{{ t('quiz.otraVez') }}</button>
    </div>
  </div>
</template>

<style scoped>
.quiz { max-width: 640px; display: grid; gap: 16px; }
.contador { font-size: .85rem; color: var(--gris); }
.url-simple { font: 1rem var(--mono); border: 1px solid var(--linea); padding: 14px; word-break: break-all; }
.acciones { display: flex; gap: 8px; }
.feedback { display: grid; gap: 12px; justify-items: start; }
.bien strong { color: var(--verde); }
.mal strong { color: var(--rojo); }
.final { display: grid; gap: 16px; justify-items: start; }
.nota { font: 700 2.5rem var(--serif); line-height: 1; }
</style>
