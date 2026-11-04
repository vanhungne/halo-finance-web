import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import typography from '@tailwindcss/typography'

// https://vite.dev/config/
export default defineConfig({
  build: { manifest: true },
  plugins: [
    react(),
    tailwindcss({
      plugins: [typography()],
    }),
  ],
})
