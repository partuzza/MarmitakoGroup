<script setup>
import { ref, computed } from 'vue'
import { t } from '../i18n'

// ES: Los datos los da el servidor solo a profesores con sesión (datos de ejemplo, no son alumnos reales)
// EN: The server only gives this data to logged-in teachers (sample data, not real students)
const alumnos = ref([])
const error = ref(false)
fetch('api/panel')
  .then((r) => (r.ok ? r.json() : Promise.reject()))
  .then((d) => { alumnos.value = d.alumnos })
  .catch(() => { error.value = true })

// ES: Resumen de la clase calculado a partir de los datos de ejemplo
// EN: Class summary computed from the sample data
const media = (clave) => Math.round(alumnos.value.reduce((s, a) => s + a[clave], 0) / alumnos.value.length)
const resumen = computed(() => ({
  phishing: media('phishing'),
  claves: media('claves'),
  quiz: (alumnos.value.reduce((s, a) => s + a.quiz, 0) / alumnos.value.length).toFixed(1),
  riesgo: alumnos.value.filter((a) => a.quiz < 5).length,
}))
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('panel.titulo') }}</h1>
      <p class="lead">{{ t('panel.aviso') }}</p>

      <p v-if="error" class="error">{{ t('panel.error') }}</p>
      <template v-else-if="alumnos.length">
        <div class="resumen">
          <div><strong>{{ resumen.phishing }}%</strong><span>{{ t('panel.mediaPhishing') }}</span></div>
          <div><strong>{{ resumen.claves }}%</strong><span>{{ t('panel.mediaClaves') }}</span></div>
          <div><strong>{{ resumen.quiz }}/10</strong><span>{{ t('panel.mediaQuiz') }}</span></div>
          <div><strong>{{ resumen.riesgo }}</strong><span>{{ t('panel.riesgo') }}</span></div>
        </div>

        <div class="tabla-scroll">
          <table class="tabla">
            <thead>
              <tr>
                <th>{{ t('panel.alumno') }}</th>
                <th>{{ t('panel.cPhishing') }}</th>
                <th>{{ t('panel.cClaves') }}</th>
                <th>{{ t('panel.cQuiz') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in alumnos" :key="a.id">
                <td>{{ t('panel.alumno') }} {{ String(a.id).padStart(2, '0') }}</td>
                <td><progress max="100" :value="a.phishing" :aria-label="a.phishing + '%'"></progress> <span class="num">{{ a.phishing }}%</span></td>
                <td><progress max="100" :value="a.claves" :aria-label="a.claves + '%'"></progress> <span class="num">{{ a.claves }}%</span></td>
                <td class="num" :class="{ bajo: a.quiz < 5 }">{{ a.quiz }}/10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </section>
</template>
