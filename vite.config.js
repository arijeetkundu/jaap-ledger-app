import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/jaap-ledger-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['deity.png', 'favicon.ico'],
      manifest: {
        name: 'Sumiran',
        short_name: 'Sumiran',
        description: 'सुमिरन — Daily chanting practice tracker',
        theme_color: '#0B1628',
        background_color: '#0B1628',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/jaap-ledger-app/',
        start_url: '/jaap-ledger-app/',
        icons: [
  {
    src: 'icons/icon-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: 'icons/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any'
  },
  {
    src: 'icons/icon-maskable-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable'
  }
],
      },
      workbox: {
        skipWaiting: true,      // new SW activates immediately on deploy
        clientsClaim: true,     // new SW takes control of all tabs immediately
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'], // removed png
        globIgnores: ['**/bg-*.png'], // explicitly exclude background images
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/unit/setup.js',
    include: ['src/tests/unit/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})