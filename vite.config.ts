import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/mercadopago': {
        target: 'https://api.mercadopago.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mercadopago/, ''),
        secure: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Wedding-App/1.0)'
        }
      }
    }
  }
});