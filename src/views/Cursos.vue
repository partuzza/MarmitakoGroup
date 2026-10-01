<script setup>
import { ref, computed } from 'vue'
import { idioma, t } from '../i18n'
import { cursos, NIVELES } from '../data/cursos'

const nivel = ref('todos')
const busqueda = ref('')
const inscrito = ref(null)

// ES: Filtra por nivel y por texto (en el idioma activo)
// EN: Filters by level and by text (in the active language)
const lista = computed(() => {
  const txt = busqueda.value.trim().toLowerCase()
  return cursos.filter((c) =>
    (nivel.value === 'todos' || c.nivel === nivel.value) &&
    (c.titulo[idioma.value] + ' ' + c.desc[idioma.value]).toLowerCase().includes(txt),
  )
})
</script>

<template>
  <section>
    <div class="wrap">
      <h1>{{ t('cursos.titulo') }}</h1>
      <p class="lead">{{ t('cursos.intro') }}</p>

      <div class="controles">
        <label class="sr" for="nivel">{{ t('cursos.nivel') }}</label>
        <select id="nivel" v-model="nivel">
          <option value="todos">{{ t('cursos.todos') }}</option>
          <option v-for="n in NIVELES" :key="n" :value="n">{{ t('niveles.' + n) }}</option>
        </select>
        <label class="sr" for="q">{{ t('cursos.buscar') }}</label>
        <input id="q" v-model="busqueda" type="search" :placeholder="t('cursos.placeholder')">
      </div>

      <div v-if="lista.length" class="tabla-scroll">
        <table class="tabla">
          <thead>
            <tr>
              <th>{{ t('cursos.cols.curso') }}</th>
              <th class="col-desc">{{ t('cursos.cols.desc') }}</th>
              <th>{{ t('cursos.cols.nivel') }}</th>
              <th class="col-horas">{{ t('cursos.cols.horas') }}</th>
              <th>{{ t('cursos.cols.precio') }}</th>
              <th><span class="sr">{{ t('cursos.cols.accion') }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in lista" :key="c.id">
              <td>{{ c.titulo[idioma] }}</td>
              <td class="col-desc"><p>{{ c.desc[idioma] }}</p></td>
              <td>{{ t('niveles.' + c.nivel) }}</td>
              <td class="col-horas num">{{ c.horas }}</td>
              <td class="num">{{ c.precio ? c.precio + ' €' : t('cursos.gratis') }}</td>
              <td class="accion"><button class="link-btn" @click="inscrito = c">{{ t('cursos.inscribirme') }}</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="empty">{{ t('cursos.vacio') }}</p>
      <p class="msg" aria-live="polite">{{ inscrito ? t('cursos.inscrito', { curso: inscrito.titulo[idioma] }) : '' }}</p>
    </div>
  </section>
</template>
