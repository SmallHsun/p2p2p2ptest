<template>
  <div class="resource-viewer">
    <div class="resource-header">
      <h3>{{ resource.name || '未命名資源' }}</h3>
      <div class="resource-info">
        <span class="resource-type">{{ resourceType }}</span>
        <span v-if="resource.size" class="resource-size">{{ formatSize(resource.size) }}</span>
        <span v-if="resource.lastModified" class="resource-date">
          {{ formatDate(resource.lastModified) }}
        </span>
      </div>
    </div>

    <div class="resource-actions">
      <button @click="loadResource" :disabled="loading">
        {{ loading ? '加載中...' : '通過P2P加載' }}
      </button>
      <button @click="$emit('remove', resource.url)" class="remove-btn">
        刪除
      </button>
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>正在通過P2P網路加載資源...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="content" class="resource-content">
      <img v-if="isImage" :src="objectUrl" alt="圖片資源" />
      <audio v-else-if="isAudio" controls :src="objectUrl"></audio>
      <video v-else-if="isVideo" controls :src="objectUrl"></video>
      <pre v-else-if="isText">{{ content }}</pre>
      <div v-else class="binary-preview">
        <p>二進制資源 ({{ resourceType }})</p>
        <a v-if="objectUrl" :href="objectUrl" download :download="resource.name || 'download'">
          下載文件
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useP2PStore } from '../stores/p2pStore';

const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['remove']);
const p2pStore = useP2PStore();

const content = ref(null);
const objectUrl = ref(null);
const loading = ref(false);
const error = ref(null);

const resourceType = computed(() => {
  const url = props.resource.url;
  const extension = url.split('.').pop().toLowerCase();

  const contentTypes = {
    'js': 'JavaScript',
    'css': 'CSS',
    'html': 'HTML',
    'json': 'JSON',
    'png': 'PNG圖片',
    'jpg': 'JPEG圖片',
    'jpeg': 'JPEG圖片',
    'gif': 'GIF圖片',
    'svg': 'SVG圖片',
    'mp4': 'MP4影片',
    'mp3': 'MP3音樂',
    'pdf': 'PDF文件',
    'txt': '文本文件'
  };

  return contentTypes[extension] || '未知類型';
});

// 判断资源类型
const isImage = computed(() =>
  ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(props.resource.url.split('.').pop().toLowerCase())
);
const isAudio = computed(() =>
  ['mp3', 'wav', 'ogg'].includes(props.resource.url.split('.').pop().toLowerCase())
);
const isVideo = computed(() =>
  ['mp4', 'webm'].includes(props.resource.url.split('.').pop().toLowerCase())
);
const isText = computed(() =>
  ['js', 'css', 'html', 'json', 'txt'].includes(props.resource.url.split('.').pop().toLowerCase())
);

// 格式化大小
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

// 格式化日期
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

// 加载资源
const loadResource = async () => {
  if (!p2pStore.isP2PAvailable) {
    error.value = 'P2P網路未就緒，請先初始化P2P客戶端';
    return;
  }

  loading.value = true;
  error.value = null;
  content.value = null;

  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }

  try {
    const data = await p2pStore.getResource(props.resource.url);

    if (data instanceof Blob) {
      // 二进制数据
      if (isText.value) {
        // 如果是文本类型，读取内容
        const text = await data.text();
        content.value = text;
      }

      // 为所有类型创建对象URL
      objectUrl.value = URL.createObjectURL(data);
    } else {
      // 非二进制数据（字符串）
      content.value = data;
    }
  } catch (err) {
    error.value = `加載資源失敗: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// 组件卸载时释放对象URL
onUnmounted(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
  }
});
</script>

<style scoped>
.resource-viewer {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.resource-header h3 {
  margin: 0;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-info {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.resource-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.resource-actions button {
  padding: 6px 12px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.resource-actions button:hover {
  background-color: #339af0;
}

.resource-actions button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.remove-btn {
  background-color: #ff6b6b !important;
}

.remove-btn:hover {
  background-color: #fa5252 !important;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
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
  padding: 10px;
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  margin: 10px 0;
  color: #d32f2f;
}

.resource-content {
  margin-top: 15px;
}

.resource-content img {
  max-width: 100%;
  max-height: 400px;
}

.resource-content pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-family: monospace;
}

.binary-preview {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}

.binary-preview a {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #4dabf7;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.binary-preview a:hover {
  background-color: #339af0;
}
</style>