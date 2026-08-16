import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // VS 2022 bloquea su carpeta .vs/ y rompe el watcher (EBUSY)
      ignored: ['**/.vs/**', '**/.atl/**'],
    },
  },
})
