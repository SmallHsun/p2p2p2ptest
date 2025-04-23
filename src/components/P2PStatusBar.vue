<template>
  <div class="p2p-status-bar">
    <div class="status-indicator" :class="{ active: p2pStore.isReady }"></div>
    <div class="status-info">
      <p>P2P狀態: {{ p2pStore.isReady ? '已連接' : '未連接' }}</p>
      <p v-if="p2pStore.isReady">客户端ID: {{ p2pStore.clientId }}</p>
      <p v-if="p2pStore.initializationError">
        錯誤: {{ p2pStore.initializationError }}
      </p>
    </div>
    <div class="actions">
      <button v-if="!p2pStore.isInitialized" @click="initP2P">
        初始化P2P
      </button>
      <button v-else-if="!p2pStore.isReady" @click="retryConnection">
        重試連接
      </button>
      <button v-else @click="p2pStore.closeP2P">
        斷開連接
      </button>
    </div>
  </div>
</template>

<script setup>
import { useP2PStore } from '../stores/p2pStore';

const p2pStore = useP2PStore();

const initP2P = async () => {
  try {
    await p2pStore.initializeP2P();
  } catch (error) {
    console.error('初始化P2P失敗:', error);
  }
};

const retryConnection = async () => {
  p2pStore.closeP2P();
  await initP2P();
};
</script>

<style scoped>
.p2p-status-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff6b6b;
  margin-right: 10px;
}

.status-indicator.active {
  background-color: #51cf66;
}

.status-info {
  flex-grow: 1;
}

.status-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.actions button {
  padding: 6px 12px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #339af0;
}
</style>