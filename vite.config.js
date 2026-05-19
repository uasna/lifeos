import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      "@tokens": path.resolve(__dirname, "./src/design-tokens"),

      "@engines": path.resolve(__dirname, "./src/engines"),

      "@adaptive-ui": path.resolve(__dirname, "./src/adaptive-ui"),

      "@hooks": path.resolve(__dirname, "./src/hooks"),

      "@persistence": path.resolve(__dirname, "./src/persistence"),

      "@state": path.resolve(__dirname, "./src/state"),

      "@shared": path.resolve(__dirname, "./src/shared"),

      "@layout": path.resolve(__dirname, "./src/layout"),

      "@runtime": path.resolve(__dirname, "./src/runtime"),

      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
});