# Marmitako Group

🇪🇸 [Leer en castellano](README.md)

Cybersecurity website for young people, built with **Vue 3 + Vite + Vue Router**. Available in **Spanish and English** (button in the header).

## Requirements

- [Node.js](https://nodejs.org) 20 or newer (`node -v`)
- [pnpm](https://pnpm.io): `npm install -g pnpm` (or `corepack enable`)

## Getting started

```bash
git clone <repo-url>
cd MarmitakoGroup
pnpm install
pnpm dev
```

Open http://localhost:5173

After every `git pull`, if someone has added dependencies, run `pnpm install` again.

## Scripts

| Command        | What it does                                   |
| -------------- | ---------------------------------------------- |
| `pnpm dev`     | Development server with live reload            |
| `pnpm build`   | Builds the final version into `dist/`          |
| `pnpm preview` | Serves `dist/` to test the build               |
| `pnpm api`     | Starts the API server (port 3001)              |
| `pnpm start`   | Builds and serves website + API together (production) |

## Link checker and Google Safe Browsing

The **Phishing Test** page works out of the box: it analyses the URL in the browser.
It can also check Google's database of dangerous websites. To enable it:

1. Go to [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Safe Browsing API**.
2. Under *Credentials*, create an **API key** (it's free).
3. Copy `.env.example` to `.env` and paste the key into `SAFE_BROWSING_KEY=`.
4. Run it in **two terminals**:
   ```bash
   pnpm api   # terminal 1: server holding the key
   pnpm dev   # terminal 2: the website
   ```

> ⚠️ **Never commit the `.env` file** (it's already in `.gitignore`). The key only lives on the server and never reaches the browser.

## Structure

```
src/
  main.js                 app entry point
  App.vue                 header, footer, language button and <RouterView>
  i18n/                   translations: index.js (t function), es.js, en.js
  router/index.js         routes: / (Home), /cursos and /phishing-test
  views/Inicio.vue        home page
  views/Cursos.vue        course catalogue with filters and search
  views/PhishingTest.vue  link checker + quiz
  components/             MailPhishing, UrlColoreada, QuizPhishing
  data/cursos.js          course data (in both languages)
  utils/analizarUrl.js    phishing detection rules
  assets/style.css        global styles
server/index.js           API (Google Safe Browsing) and production server
docs/Phishing-Test.pdf    how the Phishing Test works (in Spanish)
```

> File and variable names are in Spanish (e.g. `cursos` = courses, `analizarUrl` = analyseUrl), since the team works in Spanish.

## Team rules

- Use **pnpm**, not npm or yarn (so there's only a `pnpm-lock.yaml`).
- Don't commit `node_modules/` or `dist/` (already in `.gitignore`).
- One branch per task: `git checkout -b feature/name`.
- **Website text**: never hard-coded in `.vue` files. Add the key to `src/i18n/es.js` **and** `src/i18n/en.js`, then use `{{ t('section.key') }}`.
- **Code comments**: in Spanish and English, using this format:
  ```js
  // ES: Explicación en castellano
  // EN: Explanation in English
  ```
