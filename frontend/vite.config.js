import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  /**
   * PROXY — Spring Boot бекенді үшін CORS мәселесін шешеді.
   * Браузерден /api/* деп шыққан барлық сұраныс
   * автоматты түрде http://localhost:8080/api/* адресіне жіберіледі.
   *
   * Spring Boot порты өзгерсе — осы жерден ғана өзгертіңіз.
   */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // path сақталады
      },
    },
  },
})
