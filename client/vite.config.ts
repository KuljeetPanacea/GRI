import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
const API_BASE_URL = "http://13.126.133.4/api";
// const API_BASE_URL = "https://8614-13-126-133-4.ngrok-free.app/api";
export default defineConfig({
  plugins: [
    react(),
       VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.png"],
      manifest: {
        name: "Pi-audit",
        short_name: "Pi-audit",
        description: "PCI DSS audit tool",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/desktop.png",
            sizes: "1288x728",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/mobile.png",
            sizes: "728x1288",
            type: "image/png",
          },
        ],
        theme_color: "#171717",
        background_color: "#f0e7db",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
      workbox: {
        runtimeCaching: [
          {
            // urlPattern: /^http:\/\/localhost:8000\/api\/.*$/,
            urlPattern: new RegExp(`^${API_BASE_URL}/.*$`), 
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, 
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
    }),
  ],
});
