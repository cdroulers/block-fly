import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,gif,eot,json,ttf}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
};
