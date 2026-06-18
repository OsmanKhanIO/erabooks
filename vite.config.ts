import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Seamlessly updates the app in the background
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'noise.svg'],
      manifest: {
        name: 'ERABOOKS',
        short_name: 'ERABOOKS',
        description: 'Intelligent curation for your personal library.',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone', // This hides the browser UI (URL bar, tabs)
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});