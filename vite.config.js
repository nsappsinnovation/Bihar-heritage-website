import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { compression, defineAlgorithm } from "vite-plugin-compression2";

// Preload the hero's LCP resources (hashed names are only known after bundling).
const preloadHero = () => ({
  name: "preload-hero",
  apply: "build",
  transformIndexHtml(html, { bundle }) {
    const find = (re) => Object.keys(bundle || {}).find((f) => re.test(f));
    const font = find(/cinzel-latin-400-normal-[\w-]+\.woff2$/);
    const cover = find(/CoverImage-[\w-]+\.webp$/);
    const tags = [];
    if (font) tags.push({ tag: "link", attrs: { rel: "preload", href: `/${font}`, as: "font", type: "font/woff2", crossorigin: "" }, injectTo: "head-prepend" });
    if (cover) tags.push({ tag: "link", attrs: { rel: "preload", href: `/${cover}`, as: "image", fetchpriority: "high" }, injectTo: "head-prepend" });
    return tags;
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    preloadHero(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
          dest: "pdf-worker",
          rename: "pdf.worker.min.js",
        },
      ],
    }),
    // Pre-compressed .br/.gz next to each asset; the server serves them as-is.
    compression({
      algorithms: [defineAlgorithm("brotliCompress"), defineAlgorithm("gzip")],
      include: /\.(js|mjs|css|html|json|svg|txt)$/,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks stay cached across releases.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return "vendor-react";
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return "vendor-motion";
        },
      },
    },
  },
});
