import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // На Windows "localhost" иногда резолвится только в IPv6,
    // из-за чего 127.0.0.1 отказывает в соединении — биндимся явно на все интерфейсы
    host: true,
  },
});
