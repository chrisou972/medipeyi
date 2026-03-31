import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/tabular": {
        target: "https://tabular-api.data.gouv.fr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tabular/, "/api"),
      },
      "/api/address": {
        target: "https://api-adresse.data.gouv.fr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/address/, ""),
      },
    },
  },
});
