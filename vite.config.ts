import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // three + r3f are the heavy part and are lazy-imported; keep them out of the entry chunk
        manualChunks: {
          three: ['three', '@react-three/fiber'],
        },
      },
    },
  },
})
