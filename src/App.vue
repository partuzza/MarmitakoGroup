<script setup>
import { useRoute, useRouter } from 'vue-router'
import { idioma, t } from './i18n'
import { usuario, salir } from './auth'

const route = useRoute()
const router = useRouter()

// ES: Al salir desde una página solo para profesores, se manda al login
// EN: When logging out from a teachers-only page, go to the login
async function cerrarSesion() {
  await salir()
  if (route.meta.docente) router.push('/login')
}
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
        <button v-if="usuario" class="sesion" :title="usuario.email" @click="cerrarSesion">{{ usuario.nombre }} · {{ t('menu.salir') }}</button>
        <RouterLink v-else to="/login">{{ t('menu.entrar') }}</RouterLink>
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
