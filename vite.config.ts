import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
// import { viteVConsole } from "vite-plugin-vconsole";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/h5/",
  mode: "development",
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [VantResolver()],
    }),
    legacy({
      targets: ["chrome 52"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    // viteVConsole({
    //   entry: path.resolve("src/main.ts"), // entry file
    //   localEnabled: true, // dev environment
    //   enabled: false, // build production
    // }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/local": {
        // target: "http://172.16.8.103:8011", // 婷婷
        // target: "http://172.16.8.85:13001", // 嘉诚
        target: "http://test.welldriver.cn:1888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/local/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src/views", import.meta.url)),
    },
  },
});
