import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/demo-direct-pay-script/',
  plugins: [react()],
  server: {
    port: 5000,
  },
});
