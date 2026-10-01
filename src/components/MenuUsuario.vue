<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '../i18n'
import { usuario, salir } from '../auth'

const route = useRoute()
const router = useRouter()
const abierto = ref(false)
const raiz = ref(null)

// ES: Se cierra al cambiar de página, al pulsar fuera o con Escape
// EN: Closes on page change, on an outside click or with Escape
watch(() => route.fullPath, () => { abierto.value = false })
function clicFuera(e) {
  if (raiz.value && !raiz.value.contains(e.target)) abierto.value = false
}
function tecla(e) {
  if (e.key === 'Escape' && abierto.value) {
    abierto.value = false
    raiz.value?.querySelector('button')?.focus()
  }
}
onMounted(() => {
  document.addEventListener('click', clicFuera)
  document.addEventListener('keydown', tecla)
})
onUnmounted(() => {
  document.removeEventListener('click', clicFuera)
  document.removeEventListener('keydown', tecla)
})

// ES: Al salir desde una página que necesita sesión, se manda al login
// EN: When logging out from a page that needs a session, go to the login
async function cerrarSesion() {
  abierto.value = false
  await salir()
  if (route.meta.docente || route.meta.alumno || route.meta.sesion) router.push('/login')
}
</script>

<template>
  <div ref="raiz" class="menu-usuario">
    <button class="sesion" :aria-expanded="abierto" aria-controls="menu-usuario-lista" :title="usuario.email" @click="abierto = !abierto">
      {{ usuario.nombre }}
      <svg class="flecha" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
    <ul v-show="abierto" id="menu-usuario-lista" class="desplegable">
      <li><RouterLink to="/mi-suscripcion">{{ t('menu.miSuscripcion') }}</RouterLink></li>
      <li v-if="!usuario.docente"><RouterLink to="/mis-cursos">{{ t('menu.misCursos') }}</RouterLink></li>
      <li><button @click="cerrarSesion">{{ t('menu.salir') }}</button></li>
    </ul>
  </div>
</template>
