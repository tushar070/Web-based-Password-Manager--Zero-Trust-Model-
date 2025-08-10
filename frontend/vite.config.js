import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'esnext',
  },
});
//this handles the Vite configuration for a React application, enabling modern JavaScript features and React support.
// It uses the `@vitejs/plugin-react` plugin to handle React files and sets the target for ESBuild to 'esnext' for modern JavaScript compatibility. 
