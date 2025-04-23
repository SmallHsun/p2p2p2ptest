// src/stores/p2pStore.js
import { defineStore } from 'pinia';
import { p2p_client } from '../p2p/p2p_client';
import { ref, computed } from 'vue';

export const useP2PStore = defineStore('p2p', () => {
    // 状态
    const client = ref(null);
    const isInitialized = ref(false);
    const isReady = ref(false);
    const connectedPeers = ref(0);
    const cachedResources = ref(new Map());
    const clientId = ref('');
    const initializationError = ref(null);

    // Getters
    const isP2PAvailable = computed(() => isInitialized.value && isReady.value);

    // Actions
    async function initializeP2P(config = {}) {
        if (isInitialized.value) return;

        try {
            // 配置默认值
            const defaultConfig = {
                coordinatorUrl: import.meta.env.VITE_COORDINATOR_URL || 'http://localhost:8081/api/coordinator',
                signalingUrl: import.meta.env.VITE_SIGNALING_URL || 'ws://localhost:8081/ws'
            };

            // 创建P2P客户端实例
            client.value = new p2p_client({
                ...defaultConfig,
                ...config
            });

            // 保存客户端ID
            clientId.value = client.value.clientId;

            // 监听事件
            client.value.addEventListener('ready', () => {
                isReady.value = true;
                console.log('P2P客戶端已準備就緒');
            });

            // 初始化P2P客户端
            await client.value.init();
            isInitialized.value = true;
            console.log('P2P客戶端已初始化');
        } catch (error) {
            console.error('初始化P2P客戶端失败:', error);
            initializationError.value = error.message;
        }
    }

    // 通过P2P网络获取资源
    async function getResource(url) {
        if (!isP2PAvailable.value) {
            throw new Error('P2P客戶端未準備就緒');
        }

        try {
            const data = await client.value.getResourceP2POnly(url);

            // 更新缓存资源列表
            if (data) {
                cachedResources.value.set(url, {
                    url,
                    timestamp: Date.now()
                });
            }

            return data;
        } catch (error) {
            console.error(`通過p2p網路獲取 ${url} 失敗:`, error);
            throw error;
        }
    }

    // 清理和关闭P2P客户端
    function closeP2P() {
        if (client.value) {
            client.value.close();
            client.value = null;
        }
        isInitialized.value = false;
        isReady.value = false;
        connectedPeers.value = 0;
        cachedResources.value.clear();
    }

    return {
        client,
        isInitialized,
        isReady,
        connectedPeers,
        cachedResources,
        clientId,
        initializationError,
        isP2PAvailable,
        initializeP2P,
        getResource,
        closeP2P
    };
});