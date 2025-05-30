// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    // 配置CORS以允许Service Worker正常工作
    cors: true
  },
  build: {
    // 在生产模式下，将Service Worker复制到dist目录
    rollupOptions: {
      output: {
        manualChunks: {
          'p2p-vendor': ['./src/p2p/p2p_client.js', './src/p2p/p2p_manager.js', './src/p2p/indexdb-storage.js'],
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  // 保持Service Worker不被处理
  optimizeDeps: {
    exclude: ['sw.js']
  }
});