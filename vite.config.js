import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
    base: '/testlagi/',  // Ganti dengan nama repository kamu
  build: {
    outDir: 'dist'
  }
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS options
      },
    },
  },

  plugins: [
    legacy({
      targets: ["default", "not IE 11"],
    }),
  ],
});
