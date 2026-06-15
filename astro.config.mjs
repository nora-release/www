import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const isDevServer = process.argv.includes("dev");

export default defineConfig({
  site: "https://nora.elonehoo.me",
  output: "server",
  devToolbar: {
    enabled: false
  },
  server: {
    host: true
  },
  integrations: [sitemap(), react()],

  vite: {
    ...(isDevServer ? { optimizeDeps: { force: true } } : {}),
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 2048
    }
  },

  adapter: node({
    mode: "standalone"
  })
});
