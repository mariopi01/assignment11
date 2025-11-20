// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// import path from "path"
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },

//   server: {
//     // Ini hanya berlaku untuk Vite Dev Server, bukan build produksi
//     headers: {
//       // 'unsafe-eval' diperlukan untuk Hot Module Replacement (HMR)
//       'Content-Security-Policy': "script-src 'self' 'unsafe-eval';", 
//     },
//   },
   
// })

// mariopi01/assignment11/assignment11-61c8950826e3e45c78465f582f16b77670a2d7f4/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from "path"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
})


