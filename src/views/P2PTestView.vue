<template>
  <div class="p2p-test">
    <h1>P2P資源載入測試</h1>

    <div class="test-panel">
      <div class="test-controls">
        <h2>資源載入測試</h2>
        <div class="input-group">
          <label for="resource-url">資源URL</label>
          <input id="resource-url" v-model="resourceUrl" type="text"
            placeholder="輸入資源URL (例如: https://example.com/image.jpg)" />
        </div>

        <div class="actions">
          <button @click="loadResource" :disabled="loading || !resourceUrl || !p2pStore.isP2PAvailable">
            {{ loading ? '載入中...' : '透過P2P載入' }}
          </button>

          <button @click="resetTest" :disabled="loading">
            重置
          </button>
        </div>

        <div v-if="!p2pStore.isP2PAvailable" class="warning">
          P2P網路未就緒，請先初始化P2P客戶端
        </div>
      </div>

      <div class="sample-resources">
        <h3>示例資源</h3>
        <ul>
          <li v-for="(resource, index) in sampleResources" :key="index">
            <button @click="selectResource(resource)">載入</button>
            <span>{{ resource.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>正在透過P2P網路載入資源...</p>
    </div>

    <div v-if="error" class="error-message">
      <h3>載入失敗</h3>
      <p>{{ error }}</p>
    </div>

    <div v-if="loadedResource" class="result-panel">
      <h2>載入結果</h2>

      <div class="result-info">
        <div class="result-item">
          <strong>URL:</strong>
          <span>{{ resourceUrl }}</span>
        </div>

        <div class="result-item">
          <strong>載入時間:</strong>
          <span>{{ loadTime }}ms</span>
        </div>

        <div class="result-item" v-if="loadedResource instanceof Blob">
          <strong>大小:</strong>
          <span>{{ formatSize(loadedResource.size) }}</span>
        </div>

        <div class="result-item" v-if="loadedResource instanceof Blob">
          <strong>類型:</strong>
          <span>{{ loadedResource.type || '未知' }}</span>
        </div>
      </div>

      <div class="resource-preview">
        <h3>資源預覽</h3>

        <div v-if="isImage" class="preview-container">
          <img :src="objectUrl" alt="載入的圖片" />
        </div>

        <div v-else-if="isAudio" class="preview-container">
          <audio controls :src="objectUrl"></audio>
        </div>

        <div v-else-if="isVideo" class="preview-container">
          <video controls :src="objectUrl"></video>
        </div>

        <div v-else-if="isText" class="preview-container">
          <pre>{{ textContent }}</pre>
        </div>

        <div v-else class="preview-container">
          <p>無法預覽此類型的資源</p>
          <a v-if="objectUrl" :href="objectUrl" download>下載檔案</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useP2PStore } from '../stores/p2pStore';

const p2pStore = useP2PStore();

// 狀態
const resourceUrl = ref('');
const loading = ref(false);
const error = ref(null);
const loadedResource = ref(null);
const objectUrl = ref(null);
const textContent = ref(null);
const loadTime = ref(0);

// 示例資源
const sampleResources = [
  {
    name: '示例圖片',
    url: 'https://picsum.photos/600/400'
  },
  {
    name: '示例CSS',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
  },
  {
    name: '示例JavaScript',
    url: 'https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.min.js'
  },
  {
    name: '示例JSON數據',
    url: 'https://jsonplaceholder.typicode.com/todos/1'
  }
];

// 計算屬性
const isImage = computed(() => {
  if (!loadedResource.value) return false;
  return loadedResource.value.type?.startsWith('image/') || false;
});

const isAudio = computed(() => {
  if (!loadedResource.value) return false;
  return loadedResource.value.type?.startsWith('audio/') || false;
});

const isVideo = computed(() => {
  if (!loadedResource.value) return false;
  return loadedResource.value.type?.startsWith('video/') || false;
});

const isText = computed(() => {
  if (!loadedResource.value) return false;
  if (typeof loadedResource.value === 'string') return true;

  const textTypes = [
    'text/plain', 'text/html', 'text/css', 'text/javascript',
    'application/json', 'application/xml', 'application/javascript'
  ];

  return textTypes.some(type => loadedResource.value.type?.includes(type));
});

// 方法
const loadResource = async () => {
  if (!resourceUrl.value) return;

  // 重置狀態
  error.value = null;
  loadedResource.value = null;
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
  textContent.value = null;

  loading.value = true;
  const startTime = performance.now();

  try {
    const data = await p2pStore.getResource(resourceUrl.value);
    loadedResource.value = data;

    const endTime = performance.now();
    loadTime.value = Math.round(endTime - startTime);

    // 處理載入的資源
    if (data instanceof Blob) {
      objectUrl.value = URL.createObjectURL(data);

      // 如果是文本類型，讀取內容
      if (isText.value) {
        const text = await data.text();
        textContent.value = text;
      }
    } else if (typeof data === 'string') {
      textContent.value = data;
    }
  } catch (err) {
    error.value = `載入資源失敗: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const resetTest = () => {
  resourceUrl.value = '';
  error.value = null;
  loadedResource.value = null;
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
  textContent.value = null;
  loadTime.value = 0;
};

const selectResource = (resource) => {
  resourceUrl.value = resource.url;
  loadResource();
};

// 格式化大小
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

// 組件卸載時釋放對象URL
onUnmounted(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
  }
});
</script>

<style scoped>
.p2p-test {
  padding: 20px;
}

h1,
h2,
h3 {
  color: #2c3e50;
}

.test-panel {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .test-panel {
    grid-template-columns: 1fr;
  }
}

.test-controls {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.actions button:first-child {
  background-color: #4dabf7;
  color: white;
}

.actions button:first-child:hover {
  background-color: #339af0;
}

.actions button:last-child {
  background-color: #e9ecef;
  color: #343a40;
}

.actions button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.warning {
  padding: 10px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  color: #856404;
  margin-top: 15px;
}

.sample-resources {
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 8px;
}

.sample-resources ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sample-resources li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.sample-resources button {
  padding: 4px 8px;
  margin-right: 10px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sample-resources button:hover {
  background-color: #339af0;
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

.error-message {
  padding: 15px;
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  margin: 20px 0;
  color: #d32f2f;
}

.result-panel {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.result-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.result-item {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
}

.result-item strong {
  display: block;
  margin-bottom: 5px;
  color: #495057;
}

.resource-preview {
  margin-top: 20px;
}

.preview-container {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  overflow: auto;
}

.preview-container img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.preview-container pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 400px;
  overflow: auto;
}

.preview-container video,
.preview-container audio {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.preview-container a {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4dabf7;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.preview-container a:hover {
  background-color: #339af0;
}
</style>