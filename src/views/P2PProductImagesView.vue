<template>
  <div class="product-images-test">
    <h1>電商產品圖片 P2P 測試</h1>

    <div class="test-description">
      <p>本頁面模擬電商網站從伺服器請求產品圖片的場景，測試 P2P 圖片載入性能。</p>
      <p>點擊產品圖片進行測試，首次載入的圖片會從伺服器獲取並被緩存，再次載入時會嘗試從 P2P 網路獲取。</p>
    </div>

    <div class="test-options">
      <div class="option-item">
        <label for="loadMode">載入模式:</label>
        <select id="loadMode" v-model="loadMode">
          <option value="p2p">優先 P2P 載入</option>
          <option value="server">直接從伺服器載入</option>
          <option value="compare">對比測試</option>
        </select>
      </div>
    </div>

    <div class="load-stats" v-if="stats.lastLoadTime">
      <h3>上次載入統計</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">圖片:</span>
          <span class="stat-value">{{ stats.lastImageName }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">載入時間:</span>
          <span class="stat-value">{{ stats.lastLoadTime }}ms</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">來源:</span>
          <span class="stat-value">{{ stats.lastLoadSource }}</span>
        </div>
        <div class="stat-item" v-if="stats.lastImageSize">
          <span class="stat-label">大小:</span>
          <span class="stat-value">{{ formatSize(stats.lastImageSize) }}</span>
        </div>
      </div>
    </div>

    <div v-if="loadMode === 'compare' && compareResults.length > 0" class="compare-results">
      <h3>對比測試結果</h3>
      <div class="compare-table">
        <table>
          <thead>
            <tr>
              <th>圖片</th>
              <th>伺服器加載</th>
              <th>P2P加載</th>
              <th>速度提升</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in compareResults" :key="index">
              <td>{{ result.name }}</td>
              <td>{{ result.serverTime }}ms</td>
              <td>{{ result.p2pTime }}ms</td>
              <td :class="{ 'improvement': result.improvement > 0, 'no-improvement': result.improvement <= 0 }">
                {{ result.improvement > 0 ? '+' : '' }}{{ Math.round(result.improvement) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="image-gallery">
      <h2>產品圖片庫</h2>
      <p v-if="loading" class="loading-message">
        <span class="spinner"></span> 正在加載產品圖片...
      </p>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="gallery-grid">
        <div v-for="(product, index) in products" :key="index" class="product-card">
          <div class="product-image-container">
            <div v-if="product.loading" class="image-loading">
              <span class="spinner"></span>
              <span>加載中...</span>
            </div>
            <img v-else :src="product.imageUrl || '#'" :alt="product.name" @click="loadImage(product)"
              :class="{ 'image-placeholder': !product.imageUrl }" />
            <div class="image-overlay" @click="loadImage(product)">
              <button>{{ product.loaded ? '重新載入' : '載入圖片' }}</button>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <p class="product-load-info" v-if="product.loadTime">
              加載時間: {{ product.loadTime }}ms |
              來源: {{ product.loadSource }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loadMode === 'compare'" class="test-actions">
      <button @click="runCompareTest" :disabled="!p2pStore.isP2PAvailable || compareRunning">
        {{ compareRunning ? '測試進行中...' : '運行完整對比測試' }}
      </button>
      <p class="note">此測試會依次從伺服器和P2P網路加載所有產品圖片，並對比性能</p>
    </div>

    <div class="server-urls">
      <h3>圖片伺服器設定</h3>
      <div class="url-form">
        <div class="form-group">
          <label for="customImageUrl">自定義圖片URL:</label>
          <input id="customImageUrl" v-model="customImageUrl" type="text"
            placeholder="輸入圖片URL (例如: https://example.com/product.jpg)" />
          <button @click="addCustomImage" :disabled="!isValidImageUrl(customImageUrl)">新增圖片</button>
        </div>
      </div>
      <div class="predefined-urls">
        <h4>預設示例圖片</h4>
        <p>點擊新增以下示例圖片:</p>
        <div class="url-grid">
          <div v-for="(url, index) in sampleImageUrls" :key="index" class="url-item">
            <button @click="addSampleImage(url, index)" :disabled="isImageAlreadyAdded(url)">
              新增示例 {{ index + 1 }}
            </button>
            <span class="url-preview">{{ url.substring(0, 30) }}...</span>
          </div>
        </div>
      </div>
    </div>

    <div class="clear-cache-section">
      <h3>快取管理</h3>
      <button @click="clearAllImageCache" class="clear-cache-btn">清除所有圖片快取</button>
      <p class="note">這將移除所有已快取的圖片，下次載入時會重新從伺服器請求</p>
    </div>
  </div>


  <div class="local-image-section">
    <h3>本地資源圖片</h3>
    <div class="image-examples">
      <div class="example-image">
        <img :src="getImageUrl(2)" alt="本地圖片1" />
        <p>本地圖片 1</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useP2PStore } from '../stores/p2pStore';
import { calculateHash } from '../p2p/indexdb-storage';

const p2pStore = useP2PStore();

// 狀態
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const loadMode = ref('p2p');
const customImageUrl = ref('');
const compareResults = ref([]);
const compareRunning = ref(false);

const stats = reactive({
  lastLoadTime: 0,
  lastLoadSource: '',
  lastImageName: '',
  lastImageSize: 0
});

// 示例圖片URL
const sampleImageUrls = [
  'https://picsum.photos/id/100/800/600',
  'https://picsum.photos/id/237/800/600',
  'https://picsum.photos/id/1005/800/600',
  'https://picsum.photos/id/1011/800/600',
  'https://picsum.photos/id/1015/800/600',
  'https://picsum.photos/id/1018/800/600',
  'https://picsum.photos/id/1025/800/600',
];

// 初始產品數據
const initialProducts = [
  {
    id: 1,
    name: '智能手機',
    description: '高性能智能手機，1200萬像素相機，支持5G網絡',
    imageUrl: 'https://picsum.photos/id/160/800/600',
    loaded: false,
    loading: false,
    loadTime: null,
    loadSource: null
  },
  {
    id: 2,
    name: '無線耳機',
    description: '主動降噪無線耳機，續航20小時，防水IPX4',
    imageUrl: 'https://picsum.photos/id/836/800/600',
    loaded: false,
    loading: false,
    loadTime: null,
    loadSource: null
  },
  {
    id: 3,
    name: '智能手錶',
    description: '全天候健康監測，多種運動模式，支持通話功能',
    imageUrl: 'https://picsum.photos/id/175/800/600',
    loaded: false,
    loading: false,
    loadTime: null,
    loadSource: null
  },
  {
    id: 4,
    name: '筆記本電腦',
    description: '輕薄設計，高性能處理器，長達12小時電池續航',
    imageUrl: 'https://picsum.photos/id/119/800/600',
    loaded: false,
    loading: false,
    loadTime: null,
    loadSource: null
  }
];

// 在組件載入時初始化產品列表
onMounted(() => {
  // 使用深拷貝避免引用問題
  products.value = JSON.parse(JSON.stringify(initialProducts));
});

// 格式化大小
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

// 檢查URL是否為有效的圖片URL
const isValidImageUrl = (url) => {
  if (!url) return false;

  const pattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i;
  // 對於某些特殊的圖片服務(例如picsum.photos)，可能沒有明確的副檔名
  const specialServices = [
    'picsum.photos',
    'source.unsplash.com',
    'placekitten.com',
    'placeimg.com',
    'lorempixel.com'
  ];

  return pattern.test(url) || specialServices.some(service => url.includes(service));
};

// 檢查圖片是否已在產品列表中
const isImageAlreadyAdded = (url) => {
  return products.value.some(product => product.imageUrl === url);
};

// 新增自定義圖片
const addCustomImage = () => {
  if (!isValidImageUrl(customImageUrl.value)) return;

  const newProduct = {
    id: Date.now(),
    name: `自定義產品 ${products.value.length + 1}`,
    description: '自定義產品描述',
    imageUrl: customImageUrl.value,
    loaded: false,
    loading: false,
    loadTime: null,
    loadSource: null
  };

  products.value.push(newProduct);
  customImageUrl.value = '';
};

const getImageUrl = (fileIndex) => {
  return new URL(
    `../assets/${fileIndex}.jpg`,
    import.meta.url
  ).href;
};

// 新增示例圖片
const addSampleImage = (url, index) => {
  if (isImageAlreadyAdded(url)) return;

  const newProduct = {
    id: Date.now(),
    name: `示例產品 ${index + 1}`,
    description: '這是一個示例產品，用於測試P2P圖片載入功能',
    imageUrl: url,
    loaded: false,
    loading: false,
    loadTime: null,
    loadSource: null
  };

  products.value.push(newProduct);
};

// 生成圖片的唯一P2P緩存URL
const generateP2PCacheUrl = (imageUrl) => {
  // 使用原始URL作為資源標識，但加上p2p前綴以便跟蹤
  return `p2p://images/${imageUrl}`;
};

// 從伺服器載入圖片
const loadImageFromServer = async (product) => {
  const startTime = performance.now();

  try {
    // 創建新的圖片對象
    const img = new Image();
    const imagePromise = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('圖片載入失敗'));
      img.src = product.imageUrl;
    });

    // 等待圖片載入完成
    const loadedImg = await imagePromise;

    const endTime = performance.now();
    const loadTime = Math.round(endTime - startTime);

    // 估算圖片大小（實際上無法直接獲取，除非使用XHR請求）
    const estimatedSize = Math.round(Math.random() * 500) + 100; // 隨機估算，實際應用中可以使用XHR獲取實際大小

    return {
      loadTime,
      source: '伺服器',
      size: estimatedSize,
      imageElement: loadedImg
    };
  } catch (err) {
    console.error('從伺服器載入圖片失敗:', err);
    throw err;
  }
};

// 透過P2P載入圖片
const loadImageViaP2P = async (product) => {
  const startTime = performance.now();

  try {
    if (!p2pStore.isP2PAvailable) {
      throw new Error('P2P網路未就緒');
    }

    // 生成P2P緩存URL
    const p2pCacheUrl = generateP2PCacheUrl(product.imageUrl);

    // 首先嘗試從P2P網路獲取圖片
    const data = await p2pStore.getResource(p2pCacheUrl).catch(() => null);

    if (data) {
      // 成功從P2P網路獲取
      const objectUrl = URL.createObjectURL(data);

      // 創建新的圖片對象
      const img = new Image();
      const imagePromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('P2P圖片載入失敗'));
        img.src = objectUrl;
      });

      // 等待圖片載入完成
      const loadedImg = await imagePromise;

      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);

      return {
        loadTime,
        source: 'P2P網路',
        size: data.size,
        imageElement: loadedImg,
        objectUrl // 需要在後續釋放
      };
    } else {
      // P2P網路未找到，從伺服器獲取並緩存
      const serverResult = await loadImageFromServer(product);

      // 從伺服器獲取後，將圖片緩存到P2P網路
      await cacheImageForP2P(product.imageUrl, p2pCacheUrl);

      // 加上伺服器獲取的時間
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);

      return {
        loadTime,
        source: '伺服器（已緩存到P2P）',
        size: serverResult.size,
        imageElement: serverResult.imageElement
      };
    }
  } catch (err) {
    console.error('P2P載入圖片失敗:', err);
    // 如果P2P載入失敗，回退到伺服器載入
    return loadImageFromServer(product);
  }
};

// 緩存圖片到P2P網路
const cacheImageForP2P = async (imageUrl, p2pCacheUrl) => {
  try {
    // 獲取圖片的Blob數據
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // 緩存到Service Worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // 發送消息給Service Worker
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_RESOURCE',
        url: p2pCacheUrl,
        data: blob,
        contentType: blob.type
      });

      // 更新p2pStore的緩存記錄
      p2pStore.cachedResources.set(p2pCacheUrl, {
        url: p2pCacheUrl,
        timestamp: Date.now()
      });

      console.log('圖片已緩存到P2P網路:', p2pCacheUrl);
      return true;
    } else {
      throw new Error('Service Worker未就緒，無法快取資源');
    }
  } catch (err) {
    console.error('緩存圖片到P2P網路失敗:', err);
    return false;
  }
};

// 載入圖片主方法
const loadImage = async (product) => {
  if (product.loading) return;

  // 標記為正在載入
  product.loading = true;

  try {
    let result;

    // 根據當前模式決定載入方式
    if (loadMode.value === 'server') {
      // 從伺服器直接載入
      result = await loadImageFromServer(product);
    } else {
      // 使用P2P網路載入
      result = await loadImageViaP2P(product);
    }

    // 更新產品數據
    product.loaded = true;
    product.loading = false;
    product.loadTime = result.loadTime;
    product.loadSource = result.source;

    // 更新最近的載入統計
    stats.lastLoadTime = result.loadTime;
    stats.lastLoadSource = result.source;
    stats.lastImageName = product.name;
    stats.lastImageSize = result.size;

    // 如果有objectUrl，需要在組件卸載時釋放
    if (result.objectUrl) {
      // 這裡可以存儲objectUrl以便後續釋放
      // 在實際應用中，應該在組件卸載時釋放所有的objectUrl
    }

  } catch (err) {
    console.error('載入圖片失敗:', err);
    product.loading = false;
    error.value = `載入圖片失敗: ${err.message}`;

    // 3秒後清除錯誤消息
    setTimeout(() => {
      if (error.value === `載入圖片失敗: ${err.message}`) {
        error.value = null;
      }
    }, 3000);
  }
};

// 運行完整對比測試
const runCompareTest = async () => {
  if (compareRunning.value || !p2pStore.isP2PAvailable) return;

  compareRunning.value = true;
  compareResults.value = [];

  try {
    // 首先清除所有P2P緩存以確保公平測試
    await clearAllImageCache();

    // 對每個產品進行測試
    for (const product of products.value) {
      // 清除之前的載入結果
      product.loaded = false;
      product.loadTime = null;
      product.loadSource = null;

      // 首先從伺服器載入
      product.loading = true;
      const serverResult = await loadImageFromServer(product);
      product.loading = false;

      // 緩存到P2P網路
      const p2pCacheUrl = generateP2PCacheUrl(product.imageUrl);
      await cacheImageForP2P(product.imageUrl, p2pCacheUrl);

      // 然後從P2P網路載入
      product.loading = true;
      const p2pResult = await loadImageViaP2P(product);
      product.loading = false;

      // 計算性能提升百分比
      const improvement = serverResult.loadTime > 0
        ? ((serverResult.loadTime - p2pResult.loadTime) / serverResult.loadTime) * 100
        : 0;

      // 添加到對比結果
      compareResults.value.push({
        name: product.name,
        serverTime: serverResult.loadTime,
        p2pTime: p2pResult.loadTime,
        improvement
      });

      // 更新產品數據為最後的結果
      product.loaded = true;
      product.loadTime = p2pResult.loadTime;
      product.loadSource = p2pResult.source;
    }
  } catch (err) {
    console.error('運行對比測試失敗:', err);
    error.value = `對比測試失敗: ${err.message}`;
  } finally {
    compareRunning.value = false;
  }
};

// 清除所有圖片快取
const clearAllImageCache = async () => {
  try {
    // 清除p2pStore中的緩存記錄
    for (const product of products.value) {
      const p2pCacheUrl = generateP2PCacheUrl(product.imageUrl);
      p2pStore.cachedResources.delete(p2pCacheUrl);

      // 通知Service Worker刪除快取
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE',
          url: p2pCacheUrl
        });
      }

      // 重置產品載入狀態
      product.loaded = false;
      product.loadTime = null;
      product.loadSource = null;
    }

    // 成功消息
    error.value = '已清除所有圖片快取';
    setTimeout(() => {
      if (error.value === '已清除所有圖片快取') {
        error.value = null;
      }
    }, 3000);

    return true;
  } catch (err) {
    console.error('清除圖片快取失敗:', err);
    error.value = `清除圖片快取失敗: ${err.message}`;
    return false;
  }
};
</script>

<style scoped>
.product-images-test {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1,
h2,
h3,
h4 {
  color: #2c3e50;
}

.test-description {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #4dabf7;
}

.test-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-item label {
  font-weight: bold;
}

.option-item select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.load-stats {
  background-color: #e9f7fe;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #4dabf7;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.stat-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}

.stat-label {
  font-weight: bold;
  margin-right: 5px;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4dabf7;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #dc3545;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-container {
  position: relative;
  height: 200px;
  background-color: #f8f9fa;
  overflow: hidden;
}

.product-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-placeholder {
  background-color: #e9ecef;
}

.product-image-container:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-image-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay button {
  padding: 8px 16px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.image-overlay button:hover {
  background-color: #339af0;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.image-loading .spinner {
  width: 30px;
  height: 30px;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.product-description {
  color: #6c757d;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-load-info {
  font-size: 13px;
  color: #4dabf7;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e9ecef;
}

.compare-results {
  margin: 20px 0;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.compare-table {
  overflow-x: auto;
}

.compare-table table {
  width: 100%;
  border-collapse: collapse;
}

.compare-table th,
.compare-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.compare-table th {
  background-color: #e9ecef;
}

.improvement {
  color: #40c057;
  font-weight: bold;
}

.no-improvement {
  color: #fa5252;
  font-weight: bold;
}

.test-actions {
  margin: 20px 0;
  text-align: center;
}

.test-actions button {
  padding: 10px 20px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.test-actions button:hover:not(:disabled) {
  background-color: #339af0;
}

.test-actions button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.note {
  color: #6c757d;
  font-size: 14px;
  margin-top: 10px;
}

.server-urls {
  margin: 30px 0;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.url-form {
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.form-group label {
  flex: 0 0 150px;
  display: flex;
  align-items: center;
}

.form-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-group button {
  padding: 8px 16px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-group button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.predefined-urls h4 {
  margin-top: 0;
}

.url-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}

.url-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.url-item button {
  padding: 6px 12px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.url-item button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

.url-preview {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-cache-section {
  margin: 30px 0;
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.clear-cache-btn {
  padding: 10px 20px;
  background-color: #fa5252;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.clear-cache-btn:hover {
  background-color: #e03131;
}

@media (max-width: 768px) {
  .test-options {
    flex-direction: column;
  }

  .form-group {
    flex-direction: column;
  }

  .form-group label {
    flex: none;
  }
}
</style>