<template>
  <div class="resource-page">
    <h1>P2P資源管理</h1>

    <div class="resource-stats">
      <div class="stat-card">
        <h3>快取資源</h3>
        <p class="stat-value">{{ cachedResourcesCount }}</p>
      </div>

      <div class="stat-card">
        <h3>客戶端ID</h3>
        <p class="stat-value client-id">{{ p2pStore.clientId || '未初始化' }}</p>
      </div>

      <div class="stat-card">
        <h3>P2P狀態</h3>
        <p class="stat-value">
          <span class="status-indicator" :class="{ active: p2pStore.isReady }"></span>
          {{ p2pStore.isReady ? '已連線' : '未連線' }}
        </p>
      </div>
    </div>

    <div class="resource-actions">
      <button @click="fetchResourcesFromDB" :disabled="loading">刷新資源列表</button>
      <button @click="clearAllResources" :disabled="loading || resources.length === 0" class="clear-btn">
        清除所有快取
      </button>
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>載入快取資源中...</p>
    </div>

    <div v-if="resources.length === 0 && !loading" class="empty-state">
      <p>暫無快取資源</p>
      <p>請前往 <router-link to="/p2p-test">P2P測試</router-link> 頁面載入資源以將其快取</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="resources.length > 0" class="resource-list">
      <h2>快取資源列表</h2>

      <div class="filter-controls">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜尋資源..." @input="filterResources" />
        </div>

        <div class="resource-type-filter">
          <select v-model="selectedType" @change="filterResources">
            <option value="">所有類型</option>
            <option value="image">圖片</option>
            <option value="text">文本</option>
            <option value="audio">音訊</option>
            <option value="video">影片</option>
            <option value="other">其他</option>
          </select>
        </div>
      </div>

      <div class="resources-grid">
        <ResourceViewer v-for="resource in filteredResources" :key="resource.url" :resource="resource"
          @remove="removeResource" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useP2PStore } from '../stores/p2pStore';
import ResourceViewer from '../components/ResourceViewer.vue';

const p2pStore = useP2PStore();

// 狀態
const resources = ref([]);
const filteredResources = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const selectedType = ref('');

// 計算屬性
const cachedResourcesCount = computed(() => resources.value.length);

// 從IndexedDB獲取快取的資源列表
const fetchResourcesFromDB = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 這裡需要實現從IndexedDB獲取所有資源的邏輯
    // 由於現有代碼中沒有直接的介面，我們模擬一下
    // 實際應用中應該擴展IndexedDB相關功能

    // 模擬從IndexedDB獲取數據
    setTimeout(() => {
      // 使用p2pStore中的快取記錄
      const cachedResources = Array.from(p2pStore.cachedResources).map(([url, info]) => {
        return {
          url,
          name: url.split('/').pop(),
          timestamp: info.timestamp || Date.now(),
          type: getResourceType(url)
        };
      });

      resources.value = cachedResources;
      filterResources();
      loading.value = false;
    }, 1000);
  } catch (err) {
    console.error("獲取資源列表失敗:", err);
    error.value = `獲取資源列表失敗: ${err.message}`;
    loading.value = false;
  }
};

// 根據搜尋和篩選條件過濾資源
const filterResources = () => {
  let filtered = [...resources.value];

  // 搜尋篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(resource =>
      resource.url.toLowerCase().includes(query) ||
      resource.name.toLowerCase().includes(query)
    );
  }

  // 類型篩選
  if (selectedType.value) {
    filtered = filtered.filter(resource => {
      const ext = resource.url.split('.').pop().toLowerCase();

      switch (selectedType.value) {
        case 'image':
          return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext);
        case 'text':
          return ['txt', 'html', 'css', 'js', 'json', 'xml'].includes(ext);
        case 'audio':
          return ['mp3', 'wav', 'ogg', 'flac'].includes(ext);
        case 'video':
          return ['mp4', 'webm', 'avi', 'mov'].includes(ext);
        case 'other':
          return !['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp',
            'txt', 'html', 'css', 'js', 'json', 'xml',
            'mp3', 'wav', 'ogg', 'flac',
            'mp4', 'webm', 'avi', 'mov'].includes(ext);
        default:
          return true;
      }
    });
  }

  filteredResources.value = filtered;
};

// 從資源URL獲取資源類型
const getResourceType = (url) => {
  const extension = url.split('.').pop().toLowerCase();

  // 簡化的MIME類型映射
  const mimeTypes = {
    // 圖片
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',

    // 文本
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',

    // 音訊
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',

    // 影片
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',

    // 其他常見類型
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  return mimeTypes[extension] || 'application/octet-stream';
};

// 移除單個資源
const removeResource = async (url) => {
  try {
    // 從狀態中移除
    resources.value = resources.value.filter(resource => resource.url !== url);
    filterResources();

    // 從快取中移除
    p2pStore.cachedResources.delete(url);

    // 實際應用中應該調用Service Worker API刪除快取
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE',
        url: url
      });
    }
  } catch (err) {
    console.error(`移除資源 ${url} 失敗:`, err);
    error.value = `移除資源失敗: ${err.message}`;
  }
};

// 清除所有資源
const clearAllResources = async () => {
  if (!confirm('確定要清除所有快取資源嗎？')) return;

  try {
    // 清空狀態
    resources.value = [];
    filteredResources.value = [];

    // 清空快取
    p2pStore.cachedResources.clear();

    // 實際應用中應該調用Service Worker API清除所有快取
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // 這裡需要擴展Service Worker功能以支持清除所有快取
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_ALL_CACHE'
      });
    }
  } catch (err) {
    console.error('清除所有資源失敗:', err);
    error.value = `清除所有資源失敗: ${err.message}`;
  }
};

// 組件掛載時載入資源列表
onMounted(() => {
  fetchResourcesFromDB();
});
</script>

<style scoped>
.resource-page {
  padding: 20px;
}

h1,
h2 {
  color: #2c3e50;
}

.resource-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  color: #495057;
  font-size: 16px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 0;
  color: #343a40;
}

.client-id {
  font-size: 14px;
  word-break: break-all;
}

.status-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff6b6b;
  margin-right: 5px;
}

.status-indicator.active {
  background-color: #51cf66;
}

.resource-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.resource-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #4dabf7;
  color: white;
}

.resource-actions button:hover {
  background-color: #339af0;
}

.resource-actions button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.resource-actions .clear-btn {
  background-color: #ff6b6b;
}

.resource-actions .clear-btn:hover {
  background-color: #fa5252;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 30px 0;
}

.empty-state p {
  margin: 10px 0;
  color: #6c757d;
}

.empty-state a {
  color: #4dabf7;
  font-weight: bold;
  text-decoration: none;
}

.error-message {
  padding: 15px;
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  margin: 20px 0;
  color: #d32f2f;
}

.resource-list {
  margin-top: 30px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.resource-type-filter select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  min-width: 150px;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }

  .filter-controls {
    flex-direction: column;
  }
}
</style>