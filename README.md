# Marmitako Group

Web de ciberseguridad para jóvenes, hecha con **Vue 3 + Vite + Vue Router**.

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

## Estructura

```
src/
  main.js              arranque de la app
  App.vue              cabecera, pie y <RouterView>
  router/index.js      rutas: / (Inicio) y /cursos
  views/Inicio.vue     página principal
  views/Cursos.vue     catálogo con filtros y buscador
  components/          CursoCard, MailPhishing
  data/cursos.js       datos de los cursos
  assets/style.css     estilos globales
```

## Normas del equipo

- Usad **pnpm**, no npm ni yarn (así solo existe `pnpm-lock.yaml`).
- No subáis `node_modules/` ni `dist/` (ya están en `.gitignore`).
- Una rama por tarea: `git checkout -b feature/nombre`.
