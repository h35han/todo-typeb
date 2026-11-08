import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), reactRouter()],
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  preview: {
    host: true,
  },
  optimizeDeps: {
    include: [
      "@base-ui/react/alert-dialog",
      "@base-ui/react/checkbox",
      "@base-ui/react/toggle",
    ],
  },
})
