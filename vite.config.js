import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Rutas relativas: el build funciona en cualquier carpeta (GitHub Pages, Netlify...)
  base: './',
})
