import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (wackyworks.co.uk) served from repo root.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
