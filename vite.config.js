import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // Ajuste se o site estiver em um subdiretório
  server: {
    host: '0.0.0.0', // Permite conexões externas
    port: 8080,      // Porta do servidor
  },
  build: {
    sourcemap: false, // Adicione esta linha para não gerar source maps em produção
    outDir: 'dist', // Certifique-se de que o diretório de saída é "dist"
  },
})
