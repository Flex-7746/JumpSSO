import path, { resolve } from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: path.join(__dirname, '../backend/web'),
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  plugins: [react()],
})
