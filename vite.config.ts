import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the repo under /JAYDEEP-EXPORTS-/; local dev and Vercel
  // stay at the root. set GH_PAGES=true at build time to switch the base.
  base: process.env.GH_PAGES === 'true' ? '/JAYDEEP-EXPORTS-/' : '/',
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
