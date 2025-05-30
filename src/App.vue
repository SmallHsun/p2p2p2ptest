<template>
  <div class="app-container">
    <header>
      <nav>
        <router-link to="/">首頁</router-link> |
        <router-link to="/p2p-test">P2P測試</router-link> |
        <router-link to="/product-images">產品圖片測試</router-link> |
        <router-link to="/resources">資源管理</router-link>
        <router-link to="/multi-js-test">多JS檔案測試</router-link>
      </nav>
      <P2PStatusBar />
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>Vue 3 + P2P CDN 演示應用</p>
    </footer>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue';
import { useP2PStore } from './stores/p2pStore';
import P2PStatusBar from './components/P2PStatusBar.vue';

const p2pStore = useP2PStore();

// 在組件卸載時關閉P2P客戶端
onUnmounted(() => {
  p2pStore.closeP2P();
});
</script>

<style>
.app-container {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

nav {
  margin-bottom: 10px;
}

nav a {
  margin-right: 10px;
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}

main {
  min-height: 70vh;
}

footer {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}
</style>