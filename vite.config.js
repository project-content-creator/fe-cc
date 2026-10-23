import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { dirname } from "node:path"
import path from "path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"

const __filename = fileURLToPath (import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "")

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      // Meneruskan /api/* ke backend saat development agar tidak terkena CORS.
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  }
})
