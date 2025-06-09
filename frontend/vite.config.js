// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // /api로 시작하는 요청을 프록시
        target: 'http://localhost:5000', // 백엔드 서버 주소
        changeOrigin: true,
        // rewrite 규칙을 제거합니다.
        // rewrite: (path) => path.replace(/^\/api/, ''), // 이 줄을 제거하거나 주석 처리하세요.
      },
    },
  },
});