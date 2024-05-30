import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig ({
  build: {
    lib: {
      entry: [resolve(__dirname, "src/testgojs.js")],
      formats: ["es"],
      name: "[name]",
      fileName: "[name]",
    },
    outDir: "static/js",
    emptyOutDir: false,
  }
})