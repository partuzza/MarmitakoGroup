<script setup>
import { NIVELES } from '../data/cursos'

defineProps({ curso: { type: Object, required: true } })
defineEmits(['inscribir'])
</script>

<template>
  <article class="card">
    <span class="tag" :class="curso.nivel">{{ NIVELES[curso.nivel] }}</span>
    <h3>{{ curso.titulo }}</h3>
    <p>{{ curso.desc }}</p>
    <div class="meta">
      <span>{{ curso.horas }}</span>
      <span class="price">{{ curso.precio ? curso.precio + ' €' : 'Gratis' }}</span>
    </div>
    <button class="btn" @click="$emit('inscribir', curso)">Inscribirme</button>
  </article>
</template>
