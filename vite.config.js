import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  // base: "Nareka1/test",
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
