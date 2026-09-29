<script setup>
import { ref } from 'vue'

const AYUDA = 'Toca lo subrayado: ¿qué señales de alarma ves?'
const senales = {
  urgencia: 'Urgencia artificial: los estafadores te meten prisa para que no pienses.',
  enlace: 'El enlace no lleva al banco real. Pasa el ratón por encima antes de pulsar.',
}
const activa = ref(null)

function alternar(clave) {
  activa.value = activa.value === clave ? null : clave
}
</script>

<template>
  <div class="mail" role="group" aria-label="Ejemplo de correo de phishing">
    <small>De: soporte@banc0-seguro.com</small>
    <small>Asunto:
      <button class="flag" :aria-pressed="activa === 'urgencia'" @click="alternar('urgencia')">Tu cuenta será bloqueada en 24 h</button>
    </small>
    <hr>
    <p>Hola cliente, detectamos actividad extraña.
      <button class="flag" :aria-pressed="activa === 'enlace'" @click="alternar('enlace')">Verifica tus datos aquí</button>
      para evitar el bloqueo.</p>
    <p class="mail-note" aria-live="polite">{{ activa ? senales[activa] : AYUDA }}</p>
  </div>
</template>
