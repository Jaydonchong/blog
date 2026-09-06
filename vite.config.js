import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

/**
 * Port resolution, highest priority first:
 *   1. PORT in the shell           →  PORT=4000 npm run dev
 *   2. PORT in .env                →  the committed default
 *   3. 3002                        →  fallback
 */
export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '')
  const port = Number(process.env.PORT || fileEnv.PORT) || 3002

  return {
    base: mode === 'production' ? '/blog/' : '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    },
    server: { port, host: true, strictPort: false },
    preview: { port, host: true, strictPort: false },
    build: { outDir: 'dist' },
  }
})
