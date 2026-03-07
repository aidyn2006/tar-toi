import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:9191';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 7171,
    strictPort: true,
    allowedHosts: ['toi.com.kz'],
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});

