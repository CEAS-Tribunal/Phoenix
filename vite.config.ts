import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8000'

  return {
    resolve: {
      alias: [
        { find: /^@app\//, replacement: `${path.resolve(__dirname, "./src/app")}/` },
        { find: /^@shared\//, replacement: `${path.resolve(__dirname, "./src/shared")}/` },
        { find: /^@assets\//, replacement: `${path.resolve(__dirname, "./src/assets")}/` },
        { find: /^@auth$/, replacement: path.resolve(__dirname, "./src/features/auth/index.ts") },
        { find: /^@committees$/, replacement: path.resolve(__dirname, "./src/features/committees/index.ts") },
        { find: /^@resume-review$/, replacement: path.resolve(__dirname, "./src/features/resume-review/index.ts") },
        { find: /^@career-fair$/, replacement: path.resolve(__dirname, "./src/features/career-fair/index.ts") },
        { find: /^@reimbursement$/, replacement: path.resolve(__dirname, "./src/features/reimbursement/index.ts") },
        { find: /^@org-funding$/, replacement: path.resolve(__dirname, "./src/features/org-funding/index.ts") },
        { find: /^@dashboard$/, replacement: path.resolve(__dirname, "./src/features/dashboard/index.ts") },
        { find: /^@home$/, replacement: path.resolve(__dirname, "./src/features/home/index.ts") },
      ],
    },
    plugins: [
      tailwindcss(),
      react()
    ],
    assetsInclude: ["**/DYMO.Label.Framework.3.0.js"],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/dashboard': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
