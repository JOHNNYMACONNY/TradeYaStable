import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '@hooks', replacement: resolve(__dirname, './src/hooks') },
      { find: '@components', replacement: resolve(__dirname, './src/components') },
      { find: '@utils', replacement: resolve(__dirname, './src/utils') }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    devSourcemap: true,
  },
  optimizeDeps: {
    include: ['@hooks/useFirestore'],
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    target: 'es2020',
    minify: 'esbuild',
    modulePreload: {
      polyfill: true
    },
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
        },
        chunkFileNames: 'assets/[name]-[hash].js'
      },
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      }
    }
  },
  // Development server config
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    // Add proper CORS headers
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    },
    // Add proxy configuration for API calls
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production'
      }
    },
    watch: {
      usePolling: true
    }
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
