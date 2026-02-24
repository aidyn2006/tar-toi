import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 7171,
    strictPort: true,
    watch: {
      usePolling: true
    },
    proxy: {
      "/api": {
        target: "http://backend:9191",
        changeOrigin: true
      }
    }
  }
});
