<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="top">
    <div class="wrap">
      <RouterLink class="logo" to="/">Marmitako<b>Group</b></RouterLink>
      <nav aria-label="Principal">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/cursos">Cursos</RouterLink>
        <RouterLink :to="{ path: '/', query: { ir: 'contacto' } }">Contacto</RouterLink>
        <RouterLink v-if="route.name === 'inicio'" class="btn" to="/cursos">Ver cursos</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <div class="wrap">
      <span>Marmitako Group · Nazaret · 2026</span>
      <span>Demo de plataforma web de ciberseguridad</span>
    </div>
  </footer>
</template>
