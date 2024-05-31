import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig ({
  build: {
    lib: {
      entry: [resolve(__dirname, "src/test3.js")],
      formats: ["es"],
      name: "[name]",
      fileName: "[name]",
    },
    outDir: "static/js/test",
    emptyOutDir: false,
  }
})
