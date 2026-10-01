<script setup>
import { idioma, t } from './i18n'
import { usuario } from './auth'
import MenuUsuario from './components/MenuUsuario.vue'
</script>

<template>
  <header class="top">
    <div class="wrap">
      <RouterLink class="logo" to="/">Ziber</RouterLink>
      <nav aria-label="Principal">
        <RouterLink to="/">{{ t('menu.inicio') }}</RouterLink>
        <RouterLink to="/cursos">{{ t('menu.cursos') }}</RouterLink>
        <RouterLink to="/phishing-test">{{ t('menu.phishing') }}</RouterLink>
        <RouterLink v-if="!usuario" to="/precios">{{ t('menu.precios') }}</RouterLink>
        <RouterLink v-if="usuario?.docente" to="/panel">{{ t('menu.panel') }}</RouterLink>
        <RouterLink :to="{ path: '/', query: { ir: 'contacto' } }" active-class="" exact-active-class="contacto">{{ t('menu.contacto') }}</RouterLink>
        <MenuUsuario v-if="usuario" />
        <RouterLink v-else to="/login">{{ t('menu.entrar') }}</RouterLink>
        <button class="idioma" :lang="idioma === 'es' ? 'en' : 'es'" @click="idioma = idioma === 'es' ? 'en' : 'es'">{{ t('menu.cambiar') }}</button>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <div class="wrap pie-columnas">
      <div class="pie-marca">
        <RouterLink class="logo" to="/">Ziber</RouterLink>
        <p>{{ t('pie.desc') }}</p>
      </div>
      <nav :aria-label="t('pie.explorar')">
        <h2>{{ t('pie.explorar') }}</h2>
        <RouterLink to="/cursos">{{ t('menu.cursos') }}</RouterLink>
        <RouterLink to="/phishing-test">{{ t('menu.phishing') }}</RouterLink>
        <RouterLink to="/precios">{{ t('menu.precios') }}</RouterLink>
      </nav>
      <nav :aria-label="t('pie.empresa')">
        <h2>{{ t('pie.empresa') }}</h2>
        <RouterLink to="/">{{ t('menu.inicio') }}</RouterLink>
        <RouterLink :to="{ path: '/', query: { ir: 'contacto' } }">{{ t('menu.contacto') }}</RouterLink>
        <RouterLink :to="{ path: '/precios', query: { para: 'escuelas' } }">{{ t('precios.escuelas') }}</RouterLink>
      </nav>
    </div>
    <div class="wrap pie-final">
      <span>© {{ t('pie.lugar') }}</span>
      <span>{{ t('pie.nota') }}</span>
    </div>
  </footer>
</template>
