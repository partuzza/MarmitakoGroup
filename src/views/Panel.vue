<script setup>
import { computed } from 'vue'
import { t } from '../i18n'
import { alumnosDemo } from '../data/planes'

// ES: Resumen de la clase calculado a partir de los datos de ejemplo
// EN: Class summary computed from the sample data
const media = (clave) => Math.round(alumnosDemo.reduce((s, a) => s + a[clave], 0) / alumnosDemo.length)
const resumen = computed(() => ({
  phishing: media('phishing'),
  claves: media('claves'),
  quiz: (alumnosDemo.reduce((s, a) => s + a.quiz, 0) / alumnosDemo.length).toFixed(1),
  riesgo: alumnosDemo.filter((a) => a.quiz < 5).length,
}))
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('panel.titulo') }}</h1>
      <p class="lead">{{ t('panel.aviso') }}</p>

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
            <tr v-for="a in alumnosDemo" :key="a.id">
              <td>{{ t('panel.alumno') }} {{ String(a.id).padStart(2, '0') }}</td>
              <td><progress max="100" :value="a.phishing" :aria-label="a.phishing + '%'"></progress> <span class="num">{{ a.phishing }}%</span></td>
              <td><progress max="100" :value="a.claves" :aria-label="a.claves + '%'"></progress> <span class="num">{{ a.claves }}%</span></td>
              <td class="num" :class="{ bajo: a.quiz < 5 }">{{ a.quiz }}/10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
