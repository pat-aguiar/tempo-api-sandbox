import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false, // Vitest to replace all CSS imports with empty proxies
    pool: 'threads', // Force Vitest to use worker threads, bypassing the ESM forks crash
  },
})