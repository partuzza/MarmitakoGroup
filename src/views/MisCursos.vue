<script setup>
import { ref, computed } from 'vue'
import { idioma, t } from '../i18n'
import { misCursos, darmeDeBaja } from '../misCursos'
import { cursos } from '../data/cursos'
import TarjetaCurso from '../components/TarjetaCurso.vue'

const aviso = ref('')

// ES: Se muestran en el orden en que se apuntó el alumno
// EN: Shown in the order the student enrolled
const lista = computed(() => misCursos.value.map((id) => cursos.find((c) => c.id === id)).filter(Boolean))

async function baja(c) {
  try {
    await darmeDeBaja(c.id)
    aviso.value = t('misCursos.dadoDeBaja', { curso: c.titulo[idioma.value] })
  } catch {
    aviso.value = t('cursos.errorInscribir')
  }
}
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('misCursos.titulo') }}</h1>
      <p class="lead">{{ t('misCursos.intro') }}</p>

      <div v-if="lista.length" class="cursos-grid">
        <TarjetaCurso v-for="c in lista" :key="c.id" :curso="c">
          <span class="num">{{ c.horas }}</span>
          <button class="link-btn baja" @click="baja(c)">{{ t('misCursos.baja') }}</button>
        </TarjetaCurso>
      </div>
      <div v-else class="empty">
        <p>{{ t('misCursos.vacio') }}</p>
        <RouterLink class="enlace-flecha" to="/cursos">{{ t('misCursos.verCursos') }}</RouterLink>
      </div>

      <p class="msg" aria-live="polite">{{ aviso }}</p>
    </div>
  </section>
</template>
