// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useP2PStore } from './stores/p2pStore';

// 創建Vue應用
const app = createApp(App);

// 註冊Pinia
const pinia = createPinia();
app.use(pinia);

// 註冊路由
app.use(router);

// 掛載應用
app.mount('#app');

延遲初始化P2P客戶端，確保DOM已載入
window.addEventListener('load', async () => {
    // 初始化P2P客戶端
    const p2pStore = useP2PStore();
    await p2pStore.initializeP2P();

    // 註冊Service Worker
    // if ('serviceWorker' in navigator) {
    //     try {
    //         const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    //         console.log('Service Worker 註冊成功，範圍:', registration.scope);
    //     } catch (error) {
    //         console.error('Service Worker 註冊失敗:', error);
    //     }
    // } else {
    //     console.warn('瀏覽器不支持 Service Worker');
    // }
});