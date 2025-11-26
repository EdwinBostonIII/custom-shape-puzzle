import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - separate large dependencies
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react'
            }
            // Framer Motion (large animation library)
            if (id.includes('framer-motion')) {
              return 'vendor-framer'
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix'
            }
            // Phosphor icons (large icon set)
            if (id.includes('@phosphor-icons')) {
              return 'vendor-icons'
            }
            // Other vendor code
            return 'vendor'
          }
        }
      }
    },
    // Increase warning threshold slightly
    chunkSizeWarningLimit: 550
  }
});
