<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { idioma, t } from '../i18n'
import { usuario } from '../auth'
import { planesParticulares, planesEscuelas } from '../data/planes'

const route = useRoute()
const router = useRouter()

// ES: La pestaña va en la URL (?para=escuelas) para poder enlazarla directamente
// EN: The tab lives in the URL (?para=escuelas) so it can be linked directly
const para = computed(() => (route.query.para === 'escuelas' ? 'escuelas' : 'particulares'))
const planes = computed(() => (para.value === 'escuelas' ? planesEscuelas : planesParticulares))
const elegir = (p) => router.replace({ query: { para: p } })

const precio = (p) => {
  if (p.precio === null) return t('precios.medida')
  if (p.precio === 0) return t('precios.gratis')
  return p.precio.toLocaleString(idioma.value, { maximumFractionDigits: 2 }) + ' €'
}

// ES: Particulares: el pago aún no existe, así que solo se avisa (o se manda al login si no hay sesión)
// EN: Individuals: payment doesn't exist yet, so it only shows a notice (or sends you to the login if logged out)
const aviso = ref('')
function suscribirme() {
  if (!usuario.value) return router.push({ name: 'login', query: { volver: '/precios' } })
  aviso.value = t('precios.pagoDemo')
}

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

      <div class="pestanas" role="tablist" :aria-label="t('precios.tipo')">
        <button role="tab" :aria-selected="para === 'particulares'" @click="elegir('particulares')">{{ t('precios.particulares') }}</button>
        <button role="tab" :aria-selected="para === 'escuelas'" @click="elegir('escuelas')">{{ t('precios.escuelas') }}</button>
      </div>

      <p class="lead">{{ t(para === 'escuelas' ? 'precios.introEscuelas' : 'precios.introParticulares') }}</p>

      <div class="planes">
        <article v-for="p in planes" :key="p.id" class="plan" :class="{ destacado: p.destacado }">
          <p v-if="p.destacado" class="etiqueta">{{ t('precios.destacado') }}</p>
          <h2>{{ p.nombre[idioma] }}</h2>
          <p class="precio">{{ precio(p) }}<span v-if="p.periodo"> {{ t('precios.' + p.periodo) }}</span></p>
          <p class="alumnos">{{ p.subtitulo[idioma] }}</p>
          <ul><li v-for="i in p.items[idioma]" :key="i">{{ i }}</li></ul>

          <a v-if="para === 'escuelas'" class="btn" href="#pedir" @click.prevent="$refs.pedir.scrollIntoView({ behavior: 'smooth' })">{{ t('precios.pedir') }}</a>
          <RouterLink v-else-if="p.precio === 0" class="btn alt" to="/cursos">{{ t('precios.empezarGratis') }}</RouterLink>
          <button v-else-if="usuario?.suscrito" class="btn alt" disabled>{{ t('precios.yaSuscrito') }}</button>
          <button v-else class="btn" @click="suscribirme">{{ t('precios.suscribirme') }}</button>
        </article>
      </div>

      <p v-if="para === 'particulares'" class="msg" aria-live="polite">{{ aviso }}</p>

      <template v-else>
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
      </template>
    </div>
  </section>
</template>
