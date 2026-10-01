<script setup>
import { ref } from 'vue'
import { idioma, t } from '../i18n'
import { planes } from '../data/planes'

const centro = ref('')
const email = ref('')
const enviado = ref(false)

// ES: De momento solo confirma en pantalla; falta conectar con un servidor o servicio de correo
// EN: For now it only confirms on screen; still needs a server or email service behind it
function enviar() {
  enviado.value = true
  centro.value = ''
  email.value = ''
}
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('precios.titulo') }}</h1>
      <p class="lead">{{ t('precios.intro') }}</p>

      <div class="planes">
        <article v-for="p in planes" :key="p.id" class="plan" :class="{ destacado: p.destacado }">
          <p v-if="p.destacado" class="etiqueta">{{ t('precios.destacado') }}</p>
          <h2>{{ p.nombre[idioma] }}</h2>
          <p class="precio">{{ p.precio ? p.precio.toLocaleString(idioma) + ' €' : t('precios.medida') }}<span v-if="p.precio"> {{ t('precios.ano') }}</span></p>
          <p class="alumnos">{{ p.alumnos[idioma] }}</p>
          <ul><li v-for="i in p.items[idioma]" :key="i">{{ i }}</li></ul>
          <a class="btn" href="#pedir" @click.prevent="$refs.pedir.scrollIntoView({ behavior: 'smooth' })">{{ t('precios.pedir') }}</a>
        </article>
      </div>

      <h2 id="pedir" ref="pedir">{{ t('precios.formTitulo') }}</h2>
      <p class="lead">{{ t('precios.formIntro') }}</p>
      <form class="box" @submit.prevent="enviar">
        <label class="sr" for="centro">{{ t('precios.centro') }}</label>
        <input id="centro" v-model="centro" type="text" :placeholder="t('precios.centro')" required>
        <label class="sr" for="correo-centro">{{ t('inicio.correo') }}</label>
        <input id="correo-centro" v-model="email" type="email" :placeholder="t('inicio.placeholder')" required>
        <button class="btn" type="submit">{{ t('precios.enviar') }}</button>
      </form>
      <p class="msg" aria-live="polite">{{ enviado ? t('precios.gracias') : '' }}</p>
    </div>
  </section>
</template>
