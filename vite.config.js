import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // ES: Rutas relativas: el build funciona en cualquier carpeta (GitHub Pages, Netlify...)
  // EN: Relative paths: the build works from any folder (GitHub Pages, Netlify...)
  base: './',
  server: {
    // ES: En desarrollo, las llamadas a /api van al servidor de server/index.js
    // EN: In development, /api calls go to the server in server/index.js
    proxy: { '/api': 'http://localhost:3001' },
  },
})
