import { resolve } from 'node:path'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true
    }),
    react({
      // https://react.dev/learn/react-compiler
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]]
      }
    }),
    tsconfigPaths({ projects: ['./tsconfig.json'] })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  }
})
