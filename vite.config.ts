import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        'defaults',
        'not IE 11',
        'Chrome >= 49',
        'Safari >= 10',
        'iOS >= 10',
        'Android >= 4.4',
        'Samsung >= 4'
      ],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    })
  ],
  // 通用部署配置 - 根目录
  base: '/',
  server: {
    host: true,
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: ['es2015', 'chrome49', 'safari10', 'firefox52', 'edge79'],
    cssTarget: ['chrome49', 'safari10', 'firefox52'],
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
            if (id.includes('react-router-dom')) {
              return 'router'
            }
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
              return 'markdown'
            }
            if (id.includes('zustand') || id.includes('lucide-react')) {
              return 'utils'
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'highlight.js']
  },
  define: {
    // 微信浏览器兼容性
    'process.env': {}
  }
})
