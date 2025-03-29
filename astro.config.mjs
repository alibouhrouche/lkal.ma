// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";

const ReactCompilerConfig = {
  /* ... */
};

// https://astro.build/config
export default defineConfig({
  output: process.env.NODE_ENV === "production" ? "static" : "server",
  integrations: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    AstroPWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg", "fonts/*.woff2", "translations/*.json"],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: "Lkal.ma",
        short_name: "lkal.ma",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#2d9145",
        background_color: "#2d9145",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
