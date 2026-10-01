<script setup>
import { ref } from 'vue'
import { t } from '../i18n'

const activa = ref(null)

function alternar(clave) {
  activa.value = activa.value === clave ? null : clave
}
</script>

<template>
  <div class="mail" role="group" :aria-label="t('mail.aria')">
    <div class="mail-cab">
      <div>{{ t('mail.de') }}: soporte@banc0-seguro.com</div>
      <div>{{ t('mail.asunto') }}:
        <button class="flag" :aria-pressed="activa === 'urgencia'" @click="alternar('urgencia')">{{ t('mail.asuntoTexto') }}</button>
      </div>
    </div>
    <div class="mail-cuerpo">
      <p>{{ t('mail.saludo') }}
        <button class="flag" :aria-pressed="activa === 'enlaceFalso'" @click="alternar('enlaceFalso')">{{ t('mail.enlace') }}</button>
        {{ t('mail.final') }}</p>
      <p class="mail-note" aria-live="polite">{{ activa ? t('mail.' + activa) : t('mail.ayuda') }}</p>
    </div>
  </div>
</template>
