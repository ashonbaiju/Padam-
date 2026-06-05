import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // When building for XAMPP, set base to the subfolder name
  base: '/Padam-/',
  server: {
    host: '0.0.0.0',
    proxy: {
      // Proxy /streamflix/api/* requests to XAMPP Apache during dev
      '/streamflix/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Clean output on each build
    emptyOutDir: true,
  },
})
