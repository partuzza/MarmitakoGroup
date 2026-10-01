<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '../i18n'
import { usuario, entrar, salir } from '../auth'

const route = useRoute()
const router = useRouter()
const email = ref('')
const clave = ref('')
const error = ref(null)
const enviando = ref(false)

// ES: Si viene del panel docente se explica que es solo para profesores
// EN: If coming from the teacher dashboard, explain it's for teachers only
const desdePanel = computed(() => String(route.query.volver || '').startsWith('/panel'))

// ES: Usuarios de prueba que se enseñan en pantalla (la contraseña de los tres es la misma)
// EN: Test users shown on screen (all three share the same password)
const DEMO = ['alumno@ziber.com', 'suscrito@ziber.com', 'profe@ziber.com']

async function enviar() {
  enviando.value = true
  error.value = await entrar(email.value, clave.value)
  enviando.value = false
  clave.value = ''
  // ES: Solo se vuelve a rutas internas (empiezan por una sola /) para no redirigir a otra web
  // EN: Only redirect back to internal routes (starting with a single /) so it can't send you to another site
  const volver = String(route.query.volver || '')
  if (!error.value) router.push(/^\/(?!\/)/.test(volver) ? volver : '/cursos')
}
</script>

<template>
  <section>
    <div class="wrap login">
      <h1>{{ t('login.titulo') }}</h1>

      <template v-if="usuario">
        <p class="lead">{{ t('login.dentro', { nombre: usuario.nombre }) }}</p>
        <p v-if="desdePanel" class="error">{{ t('login.soloDocentes') }}</p>
        <button class="btn alt" @click="salir">{{ t('menu.salir') }}</button>
      </template>

      <template v-else>
        <p class="lead">{{ desdePanel ? t('login.necesario') : route.query.volver ? t('login.paraSeguir') : t('login.intro') }}</p>
        <form class="login-form" @submit.prevent="enviar">
          <label for="login-email">{{ t('login.correo') }}</label>
          <input id="login-email" v-model="email" type="email" autocomplete="username" required>
          <label for="login-clave">{{ t('login.clave') }}</label>
          <input id="login-clave" v-model="clave" type="password" autocomplete="current-password" required>
          <button class="btn" type="submit" :disabled="enviando">{{ t('login.boton') }}</button>
        </form>
        <p class="error" role="alert">{{ error ? t('login.errores.' + error) : '' }}</p>

        <div class="demo">
          <p>{{ t('login.demo') }} <code>ziber2026</code></p>
          <ul>
            <li v-for="d in DEMO" :key="d"><button class="link-btn" type="button" @click="email = d"><code>{{ d }}</code></button> — {{ t('login.roles.' + d.split('@')[0]) }}</li>
          </ul>
        </div>
      </template>
    </div>
  </section>
</template>
