import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// If your Netlify site is deployed at the root (e.g., https://mytasks.netlify.app), use '/'.
// If it's in a subdirectory, use that path (e.g., '/mytasks/')
const basePath = '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['leaf.png', 'productive.jpg'], // Add any other assets you use
      manifest: {
        name: 'My Tasks',
        short_name: 'Tasks',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#56ab2f',
        icons: [
          {
            src: '/leaf.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/leaf.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});