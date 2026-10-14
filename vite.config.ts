import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages развертывается в подпапке репозитория (например /codegraph/)
  // или в корне при использовании кастомного домена.
  base: process.env.BASE_PATH || './',
});