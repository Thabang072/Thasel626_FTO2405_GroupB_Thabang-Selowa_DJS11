import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    external: [
      './src/main.jsx' // Add the import that needs to be externalized
    ],
    outDir: 'dist',
  },
  base: './',  // Add this to resolve relative paths correctly
});
