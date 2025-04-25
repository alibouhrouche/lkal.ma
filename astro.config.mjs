// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";

import starlight from "@astrojs/starlight";
import starlightThemeBlack from 'starlight-theme-black';

const ReactCompilerConfig = {
  /* ... */
};

// https://astro.build/config
export default defineConfig({
  site: "https://lkal.ma",
  output: process.env.NODE_ENV === "production" ? "static" : "server",
  prefetch: true,
  integrations: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    starlight({
      title: "Lkal.ma",
      disable404Route: true,
      logo: {
        src: "@/assets/logo.svg",
        alt: "Lkal.ma Logo",
        replacesTitle: true,
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Introduction",
              link: "/docs",
            },
          ],
        },
        {
          label: "Components",
          items: [
            {
              label: "Text",
              link: "/docs/components/text",
            },{
              label: "Button",
              link: "/docs/components/button",
            },{
              label: "Image",
              link: "/docs/components/image",
            },{
              label: "Instructions",
              link: "/docs/components/instructions",
            },{
              label: "Data",
              link: "/docs/components/data",
            },
          ]
        }
      ],
      plugins: [
        starlightThemeBlack({
          navLinks: [{
            link: "/",
            label: "Home",
          }, {
            link: "/boards",
            label: "Boards",
          }],
          footerText: `&copy; ${new Date().getFullYear()} [Ali Bouhrouche](https://ali.js.org). All rights reserved.`,
        }),
      ],
    }),
    AstroPWA({
      registerType: "prompt",
      strategies: "injectManifest",
      injectManifest: {
        maximumFileSizeToCacheInBytes: 5000000,
        globPatterns: [
          '**/*.{js,css,html}',
          '_astro/**',
        ]
      },
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: [
        "**/*.svg",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.webp",
        "fonts/*.woff2",
        "translations/*.json",
      ],
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "Lkal.ma",
        short_name: "lkal.ma",
        description: "lkal.ma - AI-Powered Collaborative Whiteboard",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            purpose: "maskable",
            sizes: "1024x1024",
            src: "maskable_icon.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "48x48",
            src: "maskable_icon_x48.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "72x72",
            src: "maskable_icon_x72.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "96x96",
            src: "maskable_icon_x96.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "128x128",
            src: "maskable_icon_x128.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "192x192",
            src: "maskable_icon_x192.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "384x384",
            src: "maskable_icon_x384.png",
            type: "image/png",
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "maskable_icon_x512.png",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/desktop.webp",
            sizes: "1280x720",
            type: "image/webp",
            form_factor: "wide",
          },
          {
            src: "/screenshots/mobile.webp",
            sizes: "720x1280",
            type: "image/webp",
            form_factor: "narrow",
          },
        ],
        start_url: "/boards",
        theme_color: "#2d9145",
        background_color: "#2d9145",
        display: "standalone",
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 5000, // 5MB
    },
  },
});
