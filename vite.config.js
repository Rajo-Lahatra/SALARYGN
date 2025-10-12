import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Ajouter ici les modules que vous voulez externaliser explicitement
      ],
    },
  },
  resolve: {
    alias: {
      // Assurer que les imports sont résolus correctement
    },
  },
})