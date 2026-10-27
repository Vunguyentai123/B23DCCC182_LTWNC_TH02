import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/features/**', 'src/utils/**'],
      exclude: ['**/*.test.{ts,tsx}'],
      thresholds: {
        lines: 70,
      },
    },
  },
})
