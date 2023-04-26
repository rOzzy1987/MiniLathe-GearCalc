import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: "",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        combinations: resolve(__dirname, 'src/workers/combinations.ts')
      },
      output: {
        entryFileNames(chunkInfo) {
          const pp = (chunkInfo.facadeModuleId ?? "app").split("/");
          const fp = pp[pp.length-1].split(".");
          const id = (fp.length > 1 ? fp.slice(0, fp.length - 1) : fp).join(".");
          return id + ".js";
        },
      },
    },
  }
})
