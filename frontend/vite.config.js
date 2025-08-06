// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // ✅ lower case 'react'

export default defineConfig({
  plugins: [react()],  // ✅ NOT React()
});
