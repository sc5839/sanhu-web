import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本地预览时由 Vite 转发给本机 Worker；生产环境则使用 VITE_MARKET_API。
const marketProxy = {
  name: 'local-market-worker-proxy',
  configureServer(server) {
    server.middlewares.use('/api/market', async (req, res) => {
      try {
        const response = await fetch(`http://127.0.0.1:8787/api/market${req.url}`, { headers: { accept: 'application/json' } })
        res.statusCode = response.status
        res.setHeader('content-type', response.headers.get('content-type') || 'application/json; charset=utf-8')
        res.end(await response.text())
      } catch {
        res.statusCode = 503
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: '本地行情代理尚未启动。' }))
      }
    })
  },
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/sanhu-web/' : '/',
  plugins: [react(), marketProxy],
})
