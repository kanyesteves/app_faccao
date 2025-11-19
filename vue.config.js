const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/configurations': {
        target: 'http://localhost:',
        changeOrigin: true,
      },
    },
  },
  pwa: {
    name: 'Noro App',
    short_name: 'Noro',
    description: 'Aplicativo de gestão de produção para faccionistas de costura',
    themeColor: '#2f1c6a',
    msTileColor: '#2f1c6a',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',

    // Configuração do manifest
    manifestOptions: {
      name: 'Noro App',
      short_name: 'Noro',
      description: 'Aplicativo de gestão de produção para faccionistas de costura',
      theme_color: '#2f1c6a',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      orientation: 'portrait',
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: './img/icons/android-chrome-maskable-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: './img/icons/android-chrome-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },

    // Configuração do Workbox (Service Worker)
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 // 24 horas
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  }
})
