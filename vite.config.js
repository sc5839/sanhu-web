import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 项目站点部署在 /<repo>/，本地开发仍使用根路径。
  base: process.env.GITHUB_ACTIONS ? '/sanhu-web/' : '/',
  plugins: [react()],
})

