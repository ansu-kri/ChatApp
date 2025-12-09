import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return{
    plugins: [react(), tailwindcss()],
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    }
  }
})