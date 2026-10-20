import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  publicDir: 'public',
  server: {
    port: 8013,
    open: false
  },
  build: {
    outDir: 'dist'
  }
});
