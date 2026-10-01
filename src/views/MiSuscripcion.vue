<script setup>
import { computed } from 'vue'
import { idioma, t } from '../i18n'
import { usuario } from '../auth'
import { planesParticulares, planesEscuelas } from '../data/planes'

// ES: El plan del usuario lo da el servidor (usuarios.json); aquí se buscan sus textos y precio
// EN: The user's plan comes from the server (usuarios.json); here we look up its texts and price
const escuela = computed(() => planesEscuelas.some((p) => p.id === usuario.value.plan))
const plan = computed(() => [...planesParticulares, ...planesEscuelas].find((p) => p.id === usuario.value.plan))
const estado = computed(() => (escuela.value ? 'escuela' : usuario.value.suscrito ? 'activa' : 'gratis'))

const precio = (p) => {
  if (p.precio === null) return t('precios.medida')
  if (p.precio === 0) return t('precios.gratis')
  return p.precio.toLocaleString(idioma.value, { maximumFractionDigits: 2 }) + ' €'
}
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('miSuscripcion.titulo') }}</h1>
      <p class="lead">{{ t('miSuscripcion.hola', { nombre: usuario.nombre, email: usuario.email }) }}</p>

      <div class="mi-plan">
        <article v-if="plan" class="plan destacado">
          <p class="etiqueta">{{ t('miSuscripcion.estado.' + estado) }}</p>
          <h2>{{ plan.nombre[idioma] }}</h2>
          <p class="precio">{{ precio(plan) }}<span v-if="plan.periodo"> {{ t('precios.' + plan.periodo) }}</span></p>
          <p class="alumnos">{{ plan.subtitulo[idioma] }}</p>
          <ul><li v-for="i in plan.items[idioma]" :key="i">{{ i }}</li></ul>
        </article>

        <div class="mi-plan-acciones">
          <template v-if="estado === 'gratis'">
            <h2>{{ t('miSuscripcion.mejorarTitulo') }}</h2>
            <p>{{ t('miSuscripcion.mejorarTexto') }}</p>
            <RouterLink class="btn" to="/precios">{{ t('cursos.muroBoton') }}</RouterLink>
          </template>
          <template v-else-if="estado === 'escuela'">
            <h2>{{ t('miSuscripcion.escuelaTitulo') }}</h2>
            <p>{{ t('miSuscripcion.escuelaTexto') }}</p>
            <RouterLink class="btn alt" :to="{ path: '/precios', query: { para: 'escuelas' } }">{{ t('miSuscripcion.verPlanes') }}</RouterLink>
          </template>
          <template v-else>
            <h2>{{ t('miSuscripcion.activaTitulo') }}</h2>
            <p>{{ t('miSuscripcion.activaTexto') }}</p>
            <RouterLink class="btn alt" to="/precios">{{ t('miSuscripcion.verPlanes') }}</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
