// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bongo-lab-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
      manifest: false,
      // Désactive le service worker en développement pour éviter les erreurs
      devOptions: {
        enabled: false,
      },
    }),
  ],
  // 👇 AJOUT CRUCIAL : Forcer l'optimisation de React
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    force: true, // Force la ré-optimisation
  },
  // 👇 Configuration du serveur pour éviter les erreurs WebSocket
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173,
    },
    watch: {
      usePolling: true, // Utile pour WSL/Docker
    },
  },
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // 👇 S'assurer que React est dans un seul chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          canvas: ['konva', 'react-konva'],
          physics: ['matter-js'],
        },
      },
    },
    // 👇 Important pour éviter les doublons
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // 👆 FIN DES AJOUTS
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});