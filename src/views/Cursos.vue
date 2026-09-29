<script setup>
import { ref, computed } from 'vue'
import { cursos, NIVELES } from '../data/cursos'
import CursoCard from '../components/CursoCard.vue'

const filtros = { todos: 'Todos', ...NIVELES }
const nivel = ref('todos')
const busqueda = ref('')
const mensaje = ref('')

const lista = computed(() => {
  const txt = busqueda.value.trim().toLowerCase()
  return cursos.filter((c) =>
    (nivel.value === 'todos' || c.nivel === nivel.value) &&
    (c.titulo + ' ' + c.desc).toLowerCase().includes(txt),
  )
})

function inscribir(curso) {
  mensaje.value = `Demo: te has inscrito en “${curso.titulo}”. Aquí irá el formulario real.`
}
</script>

<template>
  <section>
    <div class="wrap">
      <h1 style="font-size:clamp(2.2rem,4.5vw,3.2rem);margin-bottom:12px">Cursos de ciberseguridad</h1>
      <p class="lead">Elige tu nivel o busca por tema. Todos los cursos son prácticos y sin requisitos previos, salvo los avanzados.</p>

      <div class="filters" role="group" aria-label="Filtrar por nivel">
        <button
          v-for="(nombre, clave) in filtros"
          :key="clave"
          class="chip"
          :aria-pressed="nivel === clave"
          @click="nivel = clave"
        >{{ nombre }}</button>
      </div>
      <label class="sr" for="q">Buscar curso</label>
      <input id="q" v-model="busqueda" type="search" placeholder="Buscar: phishing, redes, contraseñas…" style="max-width:420px;margin-bottom:28px">

      <div class="grid">
        <CursoCard v-for="c in lista" :key="c.titulo" :curso="c" @inscribir="inscribir" />
      </div>
      <p v-if="!lista.length" class="empty">No hay cursos con ese filtro. Prueba con otra palabra o elige “Todos”.</p>
      <p class="msg" aria-live="polite">{{ mensaje }}</p>
    </div>
  </section>
</template>
