import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    VitePWA({
      registerType: "prompt",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,gif,eot,json,ttf}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
