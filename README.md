# Marmitako Group

🇬🇧 [Read in English](README.en.md)

Web de ciberseguridad para jóvenes, hecha con **Vue 3 + Vite + Vue Router**. Disponible en **castellano e inglés** (botón en la cabecera).

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior (`node -v`)
- [pnpm](https://pnpm.io): `npm install -g pnpm` (o `corepack enable`)

## Arrancar el proyecto

```bash
git clone <url-del-repo>
cd MarmitakoGroup
pnpm install
pnpm dev
```

Abre http://localhost:5173

Después de cada `git pull`, si alguien ha añadido dependencias, vuelve a ejecutar `pnpm install`.

## Scripts

| Comando        | Qué hace                                  |
| -------------- | ----------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo con recarga en vivo |
| `pnpm build`   | Genera la versión final en `dist/`         |
| `pnpm preview` | Sirve `dist/` para probar el build         |
| `pnpm api`     | Arranca el servidor de la API (puerto 3001) |
| `pnpm start`   | Compila y sirve la web + API juntas (producción) |

## Analizador de enlaces y Google Safe Browsing

La página **Phishing Test** funciona sin nada más: analiza la URL en el navegador.
Opcionalmente también consulta la base de datos de webs peligrosas de Google. Para activarlo:

1. Entra en [Google Cloud Console](https://console.cloud.google.com/), crea un proyecto y activa **Safe Browsing API**.
2. En *Credenciales* crea una **clave de API** (es gratis).
3. Copia `.env.example` como `.env` y pega la clave en `SAFE_BROWSING_KEY=`.
4. Arranca en **dos terminales**:
   ```bash
   pnpm api   # terminal 1: servidor con la clave
   pnpm dev   # terminal 2: la web
   ```

> ⚠️ **Nunca subáis el archivo `.env` a git** (ya está en `.gitignore`). La clave solo vive en el servidor, nunca llega al navegador.

## Login de demo

Login sin base de datos: los usuarios están en `server/usuarios.json` (contraseñas guardadas con hash `scrypt`) y la sesión es una cookie `HttpOnly` firmada por el servidor. Necesita el servidor arrancado (`pnpm api` + `pnpm dev`, o `pnpm start`); en GitHub Pages no funciona.

| Usuario              | Contraseña  | Qué ve                                  |
| -------------------- | ----------- | --------------------------------------- |
| `alumno@ziber.com`   | `ziber2026` | 9 cursos, el aviso de suscripción y Mis cursos |
| `suscrito@ziber.com` | `ziber2026` | todos los cursos y Mis cursos           |
| `profe@ziber.com`    | `ziber2026` | todos los cursos y el panel docente     |

Los alumnos se apuntan a los cursos desde *Cursos* y los ven en *Mis cursos*. Al principio tienen los cursos de ejemplo de `server/usuarios.json`; los cambios se guardan en `server/inscripciones.json`, que no se sube a git. Para volver a los de ejemplo, borra ese archivo.

Opcional: pon un `SESSION_SECRET` en `.env` (ver `.env.example`) para que las sesiones no se cierren al reiniciar el servidor.

## Estructura

```
src/
  main.js              arranque de la app
  App.vue              cabecera, pie, botón de idioma y <RouterView>
  i18n/                traducciones: index.js (función t), es.js, en.js
  router/index.js      rutas y protección del panel docente
  auth.js              estado de la sesión (entrar, salir, quién hay conectado)
  misCursos.js         cursos a los que está apuntado el alumno
  views/Inicio.vue     página principal
  views/Cursos.vue     catálogo en tarjetas con filtros, buscador y aviso de suscripción
  views/Login.vue      formulario de login
  views/MisCursos.vue  cursos a los que se ha apuntado el alumno
  views/MiSuscripcion.vue plan del usuario con sesión
  views/PhishingTest.vue analizador de enlaces + quiz
  components/          MailPhishing, UrlColoreada, QuizPhishing, TarjetaCurso, MenuUsuario
  data/cursos.js       datos de los cursos (en los dos idiomas)
  utils/analizarUrl.js reglas de detección de phishing
  assets/style.css     estilos globales
server/index.js        API (Google Safe Browsing, login, panel) y servidor de producción
server/auth.js         comprobación de contraseñas y cookies de sesión
server/inscripciones.js apuntarse y darse de baja de cursos
server/usuarios.json   usuarios de prueba (con su plan y sus cursos de ejemplo)
server/alumnos-demo.json datos de ejemplo del panel docente
docs/Phishing-Test.pdf explicación de cómo funciona el Phishing Test
```

## Normas del equipo

- Usad **pnpm**, no npm ni yarn (así solo existe `pnpm-lock.yaml`).
- No subáis `node_modules/` ni `dist/` (ya están en `.gitignore`).
- Una rama por tarea: `git checkout -b feature/nombre`.
- **Textos de la web**: nunca escritos a mano en los `.vue`. Añadid la clave en `src/i18n/es.js` **y** en `src/i18n/en.js`, y usad `{{ t('seccion.clave') }}`.
- **Comentarios del código**: en castellano y en inglés, con el formato:
  ```js
  // ES: Explicación en castellano
  // EN: Explanation in English
  ```
