<script setup>
defineProps({ partes: { type: Array, required: true } })
</script>

<template>
  <p class="url"><span v-for="(p, i) in partes" :key="i" :class="p.tipo">{{ p.texto }}</span></p>
</template>

<style scoped>
.url { font: .95rem/1.6 var(--mono); word-break: break-all; color: #8fa3c2; background: var(--suave); padding: 10px 12px; border-left: 2px solid var(--texto); }
.subdominio { color: var(--gris); }
.dominio { color: var(--texto); font-weight: 500; text-decoration: underline; text-underline-offset: 3px; }
.engano { color: var(--rojo); text-decoration: line-through; }
</style>
