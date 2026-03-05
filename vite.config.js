import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'NYSO - Tu Aplicación de vinos',
        short_name: 'NYSO',
        description: 'Descubrí, guardá y compartí vinos de una forma simple.',
        theme_color: '#f6f6eb', // Tu color de fondo
        background_color: '#f6f6eb',
        display: 'standalone', // Hace que se vea como una app, sin barra de navegador
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})

