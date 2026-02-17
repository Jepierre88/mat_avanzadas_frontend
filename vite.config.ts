import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // These warnings are common when bundling 3D/worker-heavy libraries (like dice-box).
    // We still keep code-splitting, but avoid failing builds due to warning noise.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the heavy 3D dice runtime isolated from the rest of the app.
          if (id.includes("@3d-dice") || id.includes("dice-box")) return "dice"
        },
      },
    },
  },
})
