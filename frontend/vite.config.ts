import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Позволяет доступ извне контейнера (через Docker)
    port: 5173, // Совпадает с портом, указанным в docker-compose
    watch: {
      usePolling: true, // Обеспечивает корректное отслеживание изменений внутри Docker
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Прокси для запросов на API
        changeOrigin: true, // Изменяет заголовок Host
        secure: false, // Отключает проверку SSL для локальной разработки
      },
    },
  },
});
