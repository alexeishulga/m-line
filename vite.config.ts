import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js lives in the lazily loaded 3D background chunk
    chunkSizeWarningLimit: 1400,
  },
})
