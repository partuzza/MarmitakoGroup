<script setup>
import { ref } from 'vue'
import { t } from '../i18n'
import MailPhishing from '../components/MailPhishing.vue'

const email = ref('')
const enviado = ref(false)

function enviar() {
  enviado.value = true
  email.value = ''
}
</script>

<template>
  <div class="wrap hero">
    <div>
      <h1>{{ t('inicio.titulo') }}</h1>
      <p>{{ t('inicio.intro') }}</p>
      <RouterLink class="enlace-flecha" to="/cursos">{{ t('inicio.verCursos') }}</RouterLink>
    </div>
    <div>
      <MailPhishing />
      <p class="hint">{{ t('inicio.ejemplo') }}</p>
    </div>
  </div>

  <section id="como-funciona">
    <div class="wrap">
      <h2>{{ t('inicio.queHay') }}</h2>
      <p class="lead">{{ t('inicio.queHayIntro') }}</p>
      <div class="filas">
        <div v-for="[titulo, texto] in t('inicio.filas')" :key="titulo"><h3>{{ titulo }}</h3><p>{{ texto }}</p></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>{{ t('inicio.empezar') }}</h2>
      <p class="lead">{{ t('inicio.empezarIntro') }}</p>
      <ol class="niveles">
        <li v-for="[nivel, texto] in t('inicio.niveles')" :key="nivel"><strong>{{ nivel }}</strong> <span>{{ texto }}</span></li>
      </ol>
      <p class="objetivos">{{ t('inicio.objetivos') }}</p>
    </div>
  </section>

  <section id="contacto">
    <div class="wrap">
      <h2>{{ t('inicio.avisame') }}</h2>
      <p class="lead">{{ t('inicio.avisameIntro') }}</p>
      <form class="box" @submit.prevent="enviar">
        <label class="sr" for="email">{{ t('inicio.correo') }}</label>
        <input id="email" v-model="email" type="email" :placeholder="t('inicio.placeholder')" required>
        <button class="btn" type="submit">{{ t('inicio.apuntarme') }}</button>
      </form>
      <p class="msg" aria-live="polite">{{ enviado ? t('inicio.gracias') : '' }}</p>
    </div>
  </section>
</template>
