import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
        }
      }
    }
  },
  // Development server config
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    // Add proper CORS headers
    cors: true
  },
  // Preview server config
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },
  // Base URL configuration
  base: '/'
});