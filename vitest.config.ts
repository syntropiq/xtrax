import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    globals: true,
    watch: false,
    coverage: {
      provider: 'istanbul', // Use Istanbul instead of V8 for Cloudflare Workers
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['**/*.ts'],
      exclude: ['**/*.d.ts', '**/__tests__/**', '**/node_modules/**'],
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          // Enable Node.js compatibility for testing file system operations
          compatibilityFlags: ['nodejs_compat'],
        },
      },
    },
  },
})
