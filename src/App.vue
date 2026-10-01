<script setup>
import { idioma, t } from './i18n'
</script>

<template>
  <header class="top">
    <div class="wrap">
      <RouterLink class="logo" to="/">Ziber</RouterLink>
      <nav aria-label="Principal">
        <RouterLink to="/">{{ t('menu.inicio') }}</RouterLink>
        <RouterLink to="/cursos">{{ t('menu.cursos') }}</RouterLink>
        <RouterLink to="/phishing-test">{{ t('menu.phishing') }}</RouterLink>
        <RouterLink to="/precios">{{ t('menu.precios') }}</RouterLink>
        <RouterLink to="/panel">{{ t('menu.panel') }}</RouterLink>
        <RouterLink :to="{ path: '/', query: { ir: 'contacto' } }" active-class="" exact-active-class="contacto">{{ t('menu.contacto') }}</RouterLink>
        <button class="idioma" :lang="idioma === 'es' ? 'en' : 'es'" @click="idioma = idioma === 'es' ? 'en' : 'es'">{{ t('menu.cambiar') }}</button>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <div class="wrap">
      <span>{{ t('pie.lugar') }}</span>
      <span>{{ t('pie.nota') }}</span>
    </div>
  </footer>
</template>
