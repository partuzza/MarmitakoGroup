<script setup>
import { ref } from 'vue'
import MailPhishing from '../components/MailPhishing.vue'

const email = ref('')
const mensaje = ref('')

function enviar() {
  mensaje.value = '¡Gracias! (Demo: el correo no se guarda todavía)'
  email.value = ''
}
</script>

<template>
  <div class="wrap hero">
    <div>
      <h1>Aprende ciberseguridad sin perderte por el camino</h1>
      <p>Cursos, guías y charlas para jóvenes de 18 a 29 años. Todo en un solo sitio, ordenado por niveles y sin jerga innecesaria.</p>
      <div class="cta">
        <RouterLink class="btn" to="/cursos">Explorar cursos</RouterLink>
        <RouterLink class="btn alt" :to="{ path: '/', query: { ir: 'como-funciona' } }">Cómo funciona</RouterLink>
      </div>
    </div>
    <div>
      <MailPhishing />
      <p class="hint">Así se aprende aquí: con ejemplos reales, paso a paso.</p>
    </div>
  </div>

  <section id="como-funciona" class="alt-bg">
    <div class="wrap">
      <h2>Una plataforma, tres formas de aprender</h2>
      <p class="lead">Hoy la información sobre ciberseguridad está dispersa, es muy técnica o cara. Aquí la reunimos y la adaptamos a quien empieza.</p>
      <div class="cols">
        <div class="col"><h3>Cursos</h3><p>Contenidos propios, estructurados por niveles: básico, intermedio y avanzado.</p></div>
        <div class="col"><h3>Guías</h3><p>Lecturas prácticas y recursos descargables adaptados al mundo digital real.</p></div>
        <div class="col"><h3>Charlas</h3><p>Calendario de eventos y webinars con profesionales del sector.</p></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <h2>Empieza donde estés</h2>
      <p class="lead">¿No sabes por dónde empezar? Elige tu nivel y avanza a tu ritmo.</p>
      <ol class="steps">
        <li><h3>Básico</h3><p>Contraseñas, phishing y hábitos seguros en tu día a día.</p></li>
        <li><h3>Intermedio</h3><p>Redes, cifrado y cómo funcionan los ataques más comunes.</p></li>
        <li><h3>Avanzado</h3><p>Análisis de vulnerabilidades y respuesta ante incidentes.</p></li>
      </ol>
      <div class="stats" style="margin-top:40px">
        <div><strong>+15</strong>contenidos formativos en 6 meses</div>
        <div><strong>10</strong>charlas o eventos en el primer año</div>
        <div><strong>+80%</strong>de satisfacción objetivo</div>
      </div>
    </div>
  </section>

  <section id="contacto" class="alt-bg">
    <div class="wrap">
      <h2>Entérate cuando abramos</h2>
      <p class="lead">Déjanos tu correo y te avisamos de los primeros cursos y charlas.</p>
      <form class="box" @submit.prevent="enviar">
        <label class="sr" for="email">Correo electrónico</label>
        <input id="email" v-model="email" type="email" placeholder="tu@correo.com" required>
        <button class="btn" type="submit">Avisadme</button>
      </form>
      <p class="msg" aria-live="polite">{{ mensaje }}</p>
    </div>
  </section>
</template>
