<script setup>
import { idioma, t } from '../i18n'
import { imagenCurso } from '../data/cursos'

// ES: Tarjeta de un curso. Lo de abajo (precio, botones...) va en el slot
// EN: Course card. The bottom part (price, buttons...) goes in the slot
defineProps({ curso: { type: Object, required: true } })
</script>

<template>
  <article class="curso">
    <img :src="imagenCurso(curso)" alt="" loading="lazy" width="400" height="225">
    <div class="curso-cuerpo">
      <span class="nivel" :class="'nivel-' + curso.nivel">{{ t('niveles.' + curso.nivel) }}</span>
      <h2>{{ curso.titulo[idioma] }}</h2>
      <p>{{ curso.desc[idioma] }}</p>
      <div v-if="$slots.default" class="curso-pie"><slot /></div>
    </div>
  </article>
</template>
