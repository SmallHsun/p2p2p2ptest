<template>
  <div class="multi-resource-test">
    <h1>電商資源批量載入測試</h1>
    
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'js' }" 
        @click="activeTab = 'js'">
        JavaScript檔案測試
      </button>
      <button 
        :class="{ active: activeTab === 'css' }" 
        @click="activeTab = 'css'">
        CSS檔案測試
      </button>
      <button 
        :class="{ active: activeTab === 'image' }" 
        @click="activeTab = 'image'">
        圖片檔案測試
      </button>
    </div>
    
    <!-- JS檔案測試面板 -->
    <div v-if="activeTab === 'js'" class="tab-panel">
      <div class="status-panel">
        <div class="loading-status">
          <template v-if="isLoadingJs">
            <div class="spinner"></div>
            <p>正在載入JS檔案... ({{ loadedJsCount }}/{{ jsFiles.length }})</p>
          </template>
          <template v-else>
            <div class="result-info">
              <h2>載入結果</h2>
              <p class="time-info">載入時間: <span>{{ jsLoadTime }}ms</span></p>
              <p>成功: <span class="success-count">{{ jsSuccessCount }}</span> | 
                 失敗: <span class="failed-count">{{ jsFailedCount }}</span></p>
              
              <!-- 新增：來源統計 -->
              <div class="source-stats">
                <div class="source-stat-item">
                  <h4>🔄 P2P 載入</h4>
                  <div class="source-stat-number p2p-count">{{ jsP2pCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>🌐 網路載入</h4>
                  <div class="source-stat-number network-count">{{ jsNetworkCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>💾 快取載入</h4>
                  <div class="source-stat-number cache-count">{{ jsCacheCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>📊 P2P 效率</h4>
                  <div class="source-stat-number efficiency-count">
                    {{ jsSuccessCount > 0 ? Math.round((jsP2pCount / jsSuccessCount) * 100) : 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <div class="file-list">
          <h3>檔案載入狀態</h3>
          <ul>
            <li v-for="(file, index) in jsFiles" :key="index" :class="[file.status, file.source?.toLowerCase()]">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-source" :class="file.source?.toLowerCase()">
                {{ getSourceText(file.source) }}
              </span>
              <span class="file-status">{{ getStatusText(file.status) }}</span>
              <span v-if="file.loadTime" class="file-time">{{ file.loadTime }}ms</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="reloadAllJsFiles" :disabled="isLoadingJs">重新載入全部JS檔案</button>
      </div>
    </div>
    
    <!-- CSS檔案測試面板 -->
    <div v-if="activeTab === 'css'" class="tab-panel">
      <div class="status-panel">
        <div class="loading-status">
          <template v-if="isLoadingCss">
            <div class="spinner"></div>
            <p>正在載入CSS檔案... ({{ loadedCssCount }}/{{ cssFiles.length }})</p>
          </template>
          <template v-else>
            <div class="result-info">
              <h2>載入結果</h2>
              <p class="time-info">載入時間: <span>{{ cssLoadTime }}ms</span></p>
              <p>成功: <span class="success-count">{{ cssSuccessCount }}</span> | 
                 失敗: <span class="failed-count">{{ cssFailedCount }}</span></p>
              
              <!-- CSS 來源統計 -->
              <div class="source-stats">
                <div class="source-stat-item">
                  <h4>🔄 P2P 載入</h4>
                  <div class="source-stat-number p2p-count">{{ cssP2pCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>🌐 網路載入</h4>
                  <div class="source-stat-number network-count">{{ cssNetworkCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>💾 快取載入</h4>
                  <div class="source-stat-number cache-count">{{ cssCacheCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>📊 P2P 效率</h4>
                  <div class="source-stat-number efficiency-count">
                    {{ cssSuccessCount > 0 ? Math.round((cssP2pCount / cssSuccessCount) * 100) : 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <div class="file-list">
          <h3>檔案載入狀態</h3>
          <ul>
            <li v-for="(file, index) in cssFiles" :key="index" :class="[file.status, file.source?.toLowerCase()]">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-source" :class="file.source?.toLowerCase()">
                {{ getSourceText(file.source) }}
              </span>
              <span class="file-status">{{ getStatusText(file.status) }}</span>
              <span v-if="file.loadTime" class="file-time">{{ file.loadTime }}ms</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="reloadAllCssFiles" :disabled="isLoadingCss">重新載入全部CSS檔案</button>
      </div>
    </div>
    
    <!-- 圖片檔案測試面板 -->
    <div v-if="activeTab === 'image'" class="tab-panel">
      <div class="status-panel">
        <div class="loading-status">
          <template v-if="isLoadingImages">
            <div class="spinner"></div>
            <p>正在載入圖片檔案... ({{ loadedImageCount }}/{{ imageFiles.length }})</p>
          </template>
          <template v-else>
            <div class="result-info">
              <h2>載入結果</h2>
              <p class="time-info">載入時間: <span>{{ imageLoadTime }}ms</span></p>
              <p>成功: <span class="success-count">{{ imageSuccessCount }}</span> | 
                 失敗: <span class="failed-count">{{ imageFailedCount }}</span></p>
              
              <!-- 圖片來源統計 -->
              <div class="source-stats">
                <div class="source-stat-item">
                  <h4>🔄 P2P 載入</h4>
                  <div class="source-stat-number p2p-count">{{ imageP2pCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>🌐 網路載入</h4>
                  <div class="source-stat-number network-count">{{ imageNetworkCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>💾 快取載入</h4>
                  <div class="source-stat-number cache-count">{{ imageCacheCount }}</div>
                </div>
                <div class="source-stat-item">
                  <h4>📊 P2P 效率</h4>
                  <div class="source-stat-number efficiency-count">
                    {{ imageSuccessCount > 0 ? Math.round((imageP2pCount / imageSuccessCount) * 100) : 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <div class="file-list">
          <h3>檔案載入狀態</h3>
          <ul>
            <li v-for="(file, index) in imageFiles" :key="index" :class="[file.status, file.source?.toLowerCase()]">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-source" :class="file.source?.toLowerCase()">
                {{ getSourceText(file.source) }}
              </span>
              <span class="file-status">{{ getStatusText(file.status) }}</span>
              <span v-if="file.loadTime" class="file-time">{{ file.loadTime }}ms</span>
              <span v-if="file.size" class="file-size">{{ formatFileSize(file.size) }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="reloadAllImageFiles" :disabled="isLoadingImages">重新載入全部圖片檔案</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useP2PStore } from '../stores/p2pStore';

const p2pStore = useP2PStore();

// 狀態變數
const activeTab = ref('js');
const isLoadingJs = ref(false);
const isLoadingCss = ref(false);
const isLoadingImages = ref(false);
const jsLoadTime = ref(0);
const cssLoadTime = ref(0);
const imageLoadTime = ref(0);
const jsStartTime = ref(0);
const cssStartTime = ref(0);
const imageStartTime = ref(0);
const loadedJsCount = ref(0);
const loadedCssCount = ref(0);
const loadedImageCount = ref(0);

// JS檔案列表 (從原始檔案複製)
const jsFiles = ref([
  {
    name: '5-NBvJPm2_R.js',
    path: '/scripts/5-NBvJPm2_R.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'AstarConvert.js',
    path: '/scripts/AstarConvert.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momoTenMax.js',
    path: '/scripts/momoTenMax.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'api_2019.js',
    path: '/scripts/api_2019.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: '2019Main.js',
    path: '/scripts/2019Main.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momo-adsbytenmax.js',
    path: '/scripts/momo-adsbytenmax.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'slide.js',
    path: '/scripts/slide.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'taboolaTrack.js',
    path: '/scripts/taboolaTrack.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'searchDropDown.js',
    path: '/scripts/searchDropDown.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'xiaoi.js',
    path: '/scripts/xiaoi.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'imgWebp.js',
    path: '/scripts/imgWebp.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'ed.js',
    path: '/scripts/ed.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'createjs-2015.11.26.min.js',
    path: '/scripts/createjs-2015.11.26.min.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'jquery-1.12.4.js',
    path: '/scripts/jquery-1.12.4.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'txtTool.js',
    path: '/scripts/txtTool.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'chkMobile.js',
    path: '/scripts/chkMobile.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'rtbHouse.js',
    path: '/scripts/rtbHouse.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'urlCache.js',
    path: '/scripts/urlCache.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'videojs-contrib-hls.js',
    path: '/scripts/videojs-contrib-hls.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momowa.js',
    path: '/scripts/momowa.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'sso.js',
    path: '/scripts/sso.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'f9c4a969-baa3-4025-8510-ee0e210fa11c.js',
    path: '/scripts/f9c4a969-baa3-4025-8510-ee0e210fa11c.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'WebChatEntryRWD.js',
    path: '/scripts/WebChatEntryRWD.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'video.js',
    path: '/scripts/video.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momo-widget-util.js',
    path: '/scripts/momo-widget-util.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'cad.js',
    path: '/scripts/cad.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'bgw.js',
    path: '/scripts/bgw.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'pc_index_c90394dd9faf4ed9.js',
    path: '/scripts/pc_index_c90394dd9faf4ed9.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'account.js',
    path: '/scripts/account.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'couponRain.js',
    path: '/scripts/couponRain.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'floatingLayerBox.js',
    path: '/scripts/floatingLayerBox.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'storageTool.js',
    path: '/scripts/storageTool.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'tooth2019.js',
    path: '/scripts/tooth2019.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'loader.js',
    path: '/scripts/loader.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momoWaUtil.js',
    path: '/scripts/momoWaUtil.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'videoM3u8.js',
    path: '/scripts/videoM3u8.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'block.js',
    path: '/scripts/block.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: '2019MenuList.js',
    path: '/scripts/2019MenuList.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'fingerprint2.js',
    path: '/scripts/fingerprint2.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'searchAdvice.js',
    path: '/scripts/searchAdvice.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momo.js',
    path: '/scripts/momo.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'itriweblog.js',
    path: '/scripts/itriweblog.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'jquery-ui.js',
    path: '/scripts/jquery-ui.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'gtm.js',
    path: '/scripts/gtm.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'momoco.js',
    path: '/scripts/momoco.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'pc_index_5c92b35c15f04527.js',
    path: '/scripts/pc_index_5c92b35c15f04527.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'tooth.js',
    path: '/scripts/tooth.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'tvLiveOnData.js',
    path: '/scripts/tvLiveOnData.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'cadData.js',
    path: '/scripts/cadData.js',
    status: 'pending',
    loadTime: null,
    element: null
  },
])

// CSS檔案列表
const cssFiles = ref([
  {
    name: '2015Base.css',
    path: '/styles/2015Base.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: '2019Main.css',
    path: '/styles/2019Main.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: '2019MenuList.css',
    path: '/styles/2019MenuList.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'ec-components.css',
    path: '/styles/ec-components.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'ec-icon.css',
    path: '/styles/ec-icon.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'ec-modeule.css',
    path: '/styles/ec-modeule.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'ec-reset.css',
    path: '/styles/ec-reset.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'ecm-ads-reco.css',
    path: '/styles/ecm-ads-reco.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'headerSearch.css',
    path: '/styles/headerSearch.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'insureBox.css',
    path: '/styles/insureBox.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'jquery-ui.css',
    path: '/styles/jquery-ui.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'theme-main.css',
    path: '/styles/theme-main.css',
    status: 'pending',
    loadTime: null,
    element: null
  },
  {
    name: 'video-js-cdn.min.css',
    path: '/styles/video-js-cdn.min.css',
    status: 'pending',
    loadTime: null,
    element: null
  }
]);

// 圖片檔案列表（
const imageFiles = ref([
  {
    name: 'img_1.webp',
    path: '/images/img_1.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_10.webp',
    path: '/images/img_10.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_100.jpg',
    path: '/images/img_100.jpg',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_101.webp',
    path: '/images/img_101.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_102.webp',
    path: '/images/img_102.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_103.jpg',
    path: '/images/img_103.jpg',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_104.webp',
    path: '/images/img_104.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_105.webp',
    path: '/images/img_105.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_106.webp',
    path: '/images/img_106.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  {
    name: 'img_107.webp',
    path: '/images/img_107.webp',
    status: 'pending',
    loadTime: null,
    element: null,
    size: null
  },
  // {
  //   name: 'img_108.webp',
  //   path: '/images/img_108.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_109.webp',
  //   path: '/images/img_109.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_11.webp',
  //   path: '/images/img_11.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_110.webp',
  //   path: '/images/img_110.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_111.webp',
  //   path: '/images/img_111.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_112.jpg',
  //   path: '/images/img_112.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_113.webp',
  //   path: '/images/img_113.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_114.webp',
  //   path: '/images/img_114.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_115.webp',
  //   path: '/images/img_115.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_116.jpg',
  //   path: '/images/img_116.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_117.webp',
  //   path: '/images/img_117.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_118.webp',
  //   path: '/images/img_118.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_119.jpg',
  //   path: '/images/img_119.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_12.webp',
  //   path: '/images/img_12.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_120.webp',
  //   path: '/images/img_120.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_121.webp',
  //   path: '/images/img_121.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_122.jpg',
  //   path: '/images/img_122.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_123.jpg',
  //   path: '/images/img_123.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_124.webp',
  //   path: '/images/img_124.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_125.webp',
  //   path: '/images/img_125.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_126.webp',
  //   path: '/images/img_126.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_127.webp',
  //   path: '/images/img_127.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_128.webp',
  //   path: '/images/img_128.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_129.png',
  //   path: '/images/img_129.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_13.webp',
  //   path: '/images/img_13.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_130.png',
  //   path: '/images/img_130.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_131.png',
  //   path: '/images/img_131.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_132.png',
  //   path: '/images/img_132.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_133.png',
  //   path: '/images/img_133.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_134.png',
  //   path: '/images/img_134.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_135.png',
  //   path: '/images/img_135.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_136.png',
  //   path: '/images/img_136.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_137.png',
  //   path: '/images/img_137.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_138.png',
  //   path: '/images/img_138.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_139.png',
  //   path: '/images/img_139.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_14.webp',
  //   path: '/images/img_14.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_140.png',
  //   path: '/images/img_140.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_141.png',
  //   path: '/images/img_141.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_142.png',
  //   path: '/images/img_142.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_143.png',
  //   path: '/images/img_143.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_144.png',
  //   path: '/images/img_144.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_145.png',
  //   path: '/images/img_145.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_146.png',
  //   path: '/images/img_146.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_147.jpg',
  //   path: '/images/img_147.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_148.png',
  //   path: '/images/img_148.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_149.png',
  //   path: '/images/img_149.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_15.webp',
  //   path: '/images/img_15.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_150.png',
  //   path: '/images/img_150.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_151.png',
  //   path: '/images/img_151.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_152.png',
  //   path: '/images/img_152.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_153.png',
  //   path: '/images/img_153.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_154.png',
  //   path: '/images/img_154.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_155.png',
  //   path: '/images/img_155.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_156.png',
  //   path: '/images/img_156.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_157.png',
  //   path: '/images/img_157.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_158.png',
  //   path: '/images/img_158.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_159.png',
  //   path: '/images/img_159.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_16.webp',
  //   path: '/images/img_16.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_160.png',
  //   path: '/images/img_160.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_161.png',
  //   path: '/images/img_161.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_162.png',
  //   path: '/images/img_162.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_163.png',
  //   path: '/images/img_163.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_164.png',
  //   path: '/images/img_164.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_165.png',
  //   path: '/images/img_165.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_166.png',
  //   path: '/images/img_166.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_167.png',
  //   path: '/images/img_167.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_168.png',
  //   path: '/images/img_168.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_169.png',
  //   path: '/images/img_169.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_17.webp',
  //   path: '/images/img_17.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_170.png',
  //   path: '/images/img_170.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_171.png',
  //   path: '/images/img_171.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_172.png',
  //   path: '/images/img_172.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_173.png',
  //   path: '/images/img_173.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_174.png',
  //   path: '/images/img_174.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_175.png',
  //   path: '/images/img_175.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_176.png',
  //   path: '/images/img_176.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_177.png',
  //   path: '/images/img_177.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_178.png',
  //   path: '/images/img_178.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_179.png',
  //   path: '/images/img_179.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_18.webp',
  //   path: '/images/img_18.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_180.png',
  //   path: '/images/img_180.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_181.png',
  //   path: '/images/img_181.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_182.png',
  //   path: '/images/img_182.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_183.png',
  //   path: '/images/img_183.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_184.png',
  //   path: '/images/img_184.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_185.png',
  //   path: '/images/img_185.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_186.png',
  //   path: '/images/img_186.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_187.png',
  //   path: '/images/img_187.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_188.png',
  //   path: '/images/img_188.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_189.png',
  //   path: '/images/img_189.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_19.webp',
  //   path: '/images/img_19.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_190.png',
  //   path: '/images/img_190.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_191.png',
  //   path: '/images/img_191.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_192.png',
  //   path: '/images/img_192.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_193.png',
  //   path: '/images/img_193.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_194.png',
  //   path: '/images/img_194.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_195.png',
  //   path: '/images/img_195.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_196.png',
  //   path: '/images/img_196.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_197.png',
  //   path: '/images/img_197.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_198.png',
  //   path: '/images/img_198.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_199.png',
  //   path: '/images/img_199.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_2.webp',
  //   path: '/images/img_2.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_20.webp',
  //   path: '/images/img_20.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_200.png',
  //   path: '/images/img_200.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_201.png',
  //   path: '/images/img_201.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_202.png',
  //   path: '/images/img_202.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_203.png',
  //   path: '/images/img_203.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_204.png',
  //   path: '/images/img_204.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_205.png',
  //   path: '/images/img_205.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_206.png',
  //   path: '/images/img_206.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_207.png',
  //   path: '/images/img_207.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_208.png',
  //   path: '/images/img_208.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_209.png',
  //   path: '/images/img_209.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_21.webp',
  //   path: '/images/img_21.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_210.png',
  //   path: '/images/img_210.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_211.png',
  //   path: '/images/img_211.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_212.png',
  //   path: '/images/img_212.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_213.png',
  //   path: '/images/img_213.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_214.png',
  //   path: '/images/img_214.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_215.png',
  //   path: '/images/img_215.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_216.png',
  //   path: '/images/img_216.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_217.png',
  //   path: '/images/img_217.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_218.png',
  //   path: '/images/img_218.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_219.png',
  //   path: '/images/img_219.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_22.webp',
  //   path: '/images/img_22.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_220.png',
  //   path: '/images/img_220.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_221.png',
  //   path: '/images/img_221.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_222.png',
  //   path: '/images/img_222.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_223.png',
  //   path: '/images/img_223.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_224.png',
  //   path: '/images/img_224.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_225.png',
  //   path: '/images/img_225.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_226.png',
  //   path: '/images/img_226.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_227.png',
  //   path: '/images/img_227.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_228.png',
  //   path: '/images/img_228.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_229.png',
  //   path: '/images/img_229.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_23.webp',
  //   path: '/images/img_23.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_230.png',
  //   path: '/images/img_230.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_231.png',
  //   path: '/images/img_231.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_232.png',
  //   path: '/images/img_232.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_233.png',
  //   path: '/images/img_233.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_234.webp',
  //   path: '/images/img_234.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_235.webp',
  //   path: '/images/img_235.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_236.webp',
  //   path: '/images/img_236.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_237.webp',
  //   path: '/images/img_237.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_238.webp',
  //   path: '/images/img_238.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_239.webp',
  //   path: '/images/img_239.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_24.webp',
  //   path: '/images/img_24.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_240.webp',
  //   path: '/images/img_240.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_241.webp',
  //   path: '/images/img_241.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_242.webp',
  //   path: '/images/img_242.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_243.webp',
  //   path: '/images/img_243.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_244.webp',
  //   path: '/images/img_244.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_245.webp',
  //   path: '/images/img_245.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_246.webp',
  //   path: '/images/img_246.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_247.webp',
  //   path: '/images/img_247.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_248.webp',
  //   path: '/images/img_248.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_249.webp',
  //   path: '/images/img_249.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_25.webp',
  //   path: '/images/img_25.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_250.webp',
  //   path: '/images/img_250.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_251.webp',
  //   path: '/images/img_251.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_252.webp',
  //   path: '/images/img_252.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_253.webp',
  //   path: '/images/img_253.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_254.jpg',
  //   path: '/images/img_254.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_255.webp',
  //   path: '/images/img_255.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_256.webp',
  //   path: '/images/img_256.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_257.webp',
  //   path: '/images/img_257.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_258.webp',
  //   path: '/images/img_258.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_259.webp',
  //   path: '/images/img_259.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_26.webp',
  //   path: '/images/img_26.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_260.webp',
  //   path: '/images/img_260.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_261.webp',
  //   path: '/images/img_261.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_262.webp',
  //   path: '/images/img_262.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_263.jpg',
  //   path: '/images/img_263.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_264.webp',
  //   path: '/images/img_264.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_265.webp',
  //   path: '/images/img_265.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_266.webp',
  //   path: '/images/img_266.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_267.webp',
  //   path: '/images/img_267.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_268.jpg',
  //   path: '/images/img_268.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_269.webp',
  //   path: '/images/img_269.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_27.webp',
  //   path: '/images/img_27.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_270.webp',
  //   path: '/images/img_270.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_271.webp',
  //   path: '/images/img_271.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_272.webp',
  //   path: '/images/img_272.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_273.webp',
  //   path: '/images/img_273.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_274.jpg',
  //   path: '/images/img_274.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_275.webp',
  //   path: '/images/img_275.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_276.webp',
  //   path: '/images/img_276.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_277.webp',
  //   path: '/images/img_277.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_278.webp',
  //   path: '/images/img_278.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_279.webp',
  //   path: '/images/img_279.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_28.webp',
  //   path: '/images/img_28.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_280.webp',
  //   path: '/images/img_280.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_281.webp',
  //   path: '/images/img_281.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_282.webp',
  //   path: '/images/img_282.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_283.webp',
  //   path: '/images/img_283.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_284.webp',
  //   path: '/images/img_284.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_285.webp',
  //   path: '/images/img_285.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_286.webp',
  //   path: '/images/img_286.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_287.webp',
  //   path: '/images/img_287.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_288.webp',
  //   path: '/images/img_288.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_289.webp',
  //   path: '/images/img_289.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_29.jpg',
  //   path: '/images/img_29.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_290.webp',
  //   path: '/images/img_290.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_291.webp',
  //   path: '/images/img_291.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_292.webp',
  //   path: '/images/img_292.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_293.webp',
  //   path: '/images/img_293.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_294.webp',
  //   path: '/images/img_294.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_295.webp',
  //   path: '/images/img_295.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_296.webp',
  //   path: '/images/img_296.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_297.webp',
  //   path: '/images/img_297.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_298.webp',
  //   path: '/images/img_298.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_299.webp',
  //   path: '/images/img_299.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_3.webp',
  //   path: '/images/img_3.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_30.webp',
  //   path: '/images/img_30.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_300.jpg',
  //   path: '/images/img_300.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_301.webp',
  //   path: '/images/img_301.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_302.webp',
  //   path: '/images/img_302.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_303.webp',
  //   path: '/images/img_303.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_304.jpg',
  //   path: '/images/img_304.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_305.webp',
  //   path: '/images/img_305.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_306.webp',
  //   path: '/images/img_306.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_307.png',
  //   path: '/images/img_307.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_308.png',
  //   path: '/images/img_308.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_309.webp',
  //   path: '/images/img_309.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_31.jpg',
  //   path: '/images/img_31.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_310.webp',
  //   path: '/images/img_310.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_311.png',
  //   path: '/images/img_311.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_312.png',
  //   path: '/images/img_312.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_313.png',
  //   path: '/images/img_313.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_314.jpg',
  //   path: '/images/img_314.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_315.jpg',
  //   path: '/images/img_315.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_316.jpg',
  //   path: '/images/img_316.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_317.jpg',
  //   path: '/images/img_317.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_318.jpg',
  //   path: '/images/img_318.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_319.jpg',
  //   path: '/images/img_319.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_32.webp',
  //   path: '/images/img_32.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_320.jpg',
  //   path: '/images/img_320.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_321.jpg',
  //   path: '/images/img_321.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_322.png',
  //   path: '/images/img_322.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_323.jpg',
  //   path: '/images/img_323.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_324.png',
  //   path: '/images/img_324.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_325.jpg',
  //   path: '/images/img_325.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_326.jpg',
  //   path: '/images/img_326.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_327.jpg',
  //   path: '/images/img_327.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_328.jpg',
  //   path: '/images/img_328.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_329.jpg',
  //   path: '/images/img_329.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_33.webp',
  //   path: '/images/img_33.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_330.jpg',
  //   path: '/images/img_330.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_331.jpg',
  //   path: '/images/img_331.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_332.jpg',
  //   path: '/images/img_332.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_333.jpg',
  //   path: '/images/img_333.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_334.jpg',
  //   path: '/images/img_334.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_335.jpg',
  //   path: '/images/img_335.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_336.jpg',
  //   path: '/images/img_336.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_337.png',
  //   path: '/images/img_337.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_338.png',
  //   path: '/images/img_338.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_339.png',
  //   path: '/images/img_339.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_34.webp',
  //   path: '/images/img_34.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_340.jpg',
  //   path: '/images/img_340.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_341.png',
  //   path: '/images/img_341.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_342.png',
  //   path: '/images/img_342.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_343.png',
  //   path: '/images/img_343.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_344.png',
  //   path: '/images/img_344.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_345.png',
  //   path: '/images/img_345.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_346.png',
  //   path: '/images/img_346.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_347.png',
  //   path: '/images/img_347.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_348.png',
  //   path: '/images/img_348.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_349.png',
  //   path: '/images/img_349.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_35.jpg',
  //   path: '/images/img_35.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_350.png',
  //   path: '/images/img_350.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_351.png',
  //   path: '/images/img_351.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_352.png',
  //   path: '/images/img_352.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_353.png',
  //   path: '/images/img_353.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_354.png',
  //   path: '/images/img_354.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_355.png',
  //   path: '/images/img_355.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_356.jpg',
  //   path: '/images/img_356.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_357.jpg',
  //   path: '/images/img_357.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_358.jpg',
  //   path: '/images/img_358.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_359.jpg',
  //   path: '/images/img_359.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_36.webp',
  //   path: '/images/img_36.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_360.jpg',
  //   path: '/images/img_360.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_361.jpg',
  //   path: '/images/img_361.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_362.jpg',
  //   path: '/images/img_362.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_363.png',
  //   path: '/images/img_363.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_364.png',
  //   path: '/images/img_364.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_365.png',
  //   path: '/images/img_365.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_366.png',
  //   path: '/images/img_366.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_367.png',
  //   path: '/images/img_367.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_368.png',
  //   path: '/images/img_368.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_369.png',
  //   path: '/images/img_369.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_37.webp',
  //   path: '/images/img_37.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_370.png',
  //   path: '/images/img_370.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_371.png',
  //   path: '/images/img_371.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_372.png',
  //   path: '/images/img_372.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_373.jpg',
  //   path: '/images/img_373.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_374.png',
  //   path: '/images/img_374.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_375.png',
  //   path: '/images/img_375.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_376.png',
  //   path: '/images/img_376.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_377.png',
  //   path: '/images/img_377.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_378.jpg',
  //   path: '/images/img_378.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_379.jpg',
  //   path: '/images/img_379.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_38.webp',
  //   path: '/images/img_38.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_380.jpg',
  //   path: '/images/img_380.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_381.jpg',
  //   path: '/images/img_381.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_382.jpg',
  //   path: '/images/img_382.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_383.jpg',
  //   path: '/images/img_383.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_384.jpg',
  //   path: '/images/img_384.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_385.jpg',
  //   path: '/images/img_385.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_386.jpg',
  //   path: '/images/img_386.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_387.jpg',
  //   path: '/images/img_387.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_388.png',
  //   path: '/images/img_388.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_389.png',
  //   path: '/images/img_389.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_39.webp',
  //   path: '/images/img_39.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_390.jpg',
  //   path: '/images/img_390.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_391.png',
  //   path: '/images/img_391.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_392.jpg',
  //   path: '/images/img_392.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_393.jpg',
  //   path: '/images/img_393.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_394.png',
  //   path: '/images/img_394.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_395.jpg',
  //   path: '/images/img_395.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_396.jpg',
  //   path: '/images/img_396.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_397.jpg',
  //   path: '/images/img_397.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_398.jpg',
  //   path: '/images/img_398.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_399.jpg',
  //   path: '/images/img_399.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_4.webp',
  //   path: '/images/img_4.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_40.webp',
  //   path: '/images/img_40.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_400.jpg',
  //   path: '/images/img_400.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_401.jpg',
  //   path: '/images/img_401.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_402.jpg',
  //   path: '/images/img_402.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_403.jpg',
  //   path: '/images/img_403.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_404.png',
  //   path: '/images/img_404.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_405.jpg',
  //   path: '/images/img_405.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_406.jpg',
  //   path: '/images/img_406.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_407.jpg',
  //   path: '/images/img_407.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_408.jpg',
  //   path: '/images/img_408.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_409.jpg',
  //   path: '/images/img_409.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_41.webp',
  //   path: '/images/img_41.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_410.png',
  //   path: '/images/img_410.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_411.png',
  //   path: '/images/img_411.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_412.png',
  //   path: '/images/img_412.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_413.jpg',
  //   path: '/images/img_413.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_414.jpg',
  //   path: '/images/img_414.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_415.jpg',
  //   path: '/images/img_415.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_416.jpg',
  //   path: '/images/img_416.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_417.jpg',
  //   path: '/images/img_417.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_418.jpg',
  //   path: '/images/img_418.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_419.jpg',
  //   path: '/images/img_419.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_42.webp',
  //   path: '/images/img_42.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_420.png',
  //   path: '/images/img_420.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_421.png',
  //   path: '/images/img_421.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_422.png',
  //   path: '/images/img_422.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_423.jpg',
  //   path: '/images/img_423.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_424.png',
  //   path: '/images/img_424.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_425.png',
  //   path: '/images/img_425.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_426.png',
  //   path: '/images/img_426.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_427.png',
  //   path: '/images/img_427.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_428.png',
  //   path: '/images/img_428.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_429.png',
  //   path: '/images/img_429.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_43.webp',
  //   path: '/images/img_43.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_430.jpg',
  //   path: '/images/img_430.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_431.jpg',
  //   path: '/images/img_431.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_432.png',
  //   path: '/images/img_432.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_433.png',
  //   path: '/images/img_433.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_434.png',
  //   path: '/images/img_434.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_435.png',
  //   path: '/images/img_435.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_436.png',
  //   path: '/images/img_436.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_437.png',
  //   path: '/images/img_437.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_438.png',
  //   path: '/images/img_438.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_439.png',
  //   path: '/images/img_439.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_44.webp',
  //   path: '/images/img_44.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_440.png',
  //   path: '/images/img_440.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_441.jpg',
  //   path: '/images/img_441.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_442.jpg',
  //   path: '/images/img_442.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_443.png',
  //   path: '/images/img_443.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_444.png',
  //   path: '/images/img_444.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_445.png',
  //   path: '/images/img_445.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_446.png',
  //   path: '/images/img_446.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_447.png',
  //   path: '/images/img_447.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_448.png',
  //   path: '/images/img_448.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_449.png',
  //   path: '/images/img_449.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_45.webp',
  //   path: '/images/img_45.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_450.png',
  //   path: '/images/img_450.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_451.png',
  //   path: '/images/img_451.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_452.png',
  //   path: '/images/img_452.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_453.png',
  //   path: '/images/img_453.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_454.png',
  //   path: '/images/img_454.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_455.png',
  //   path: '/images/img_455.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_456.jpg',
  //   path: '/images/img_456.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_457.png',
  //   path: '/images/img_457.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_458.png',
  //   path: '/images/img_458.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_459.png',
  //   path: '/images/img_459.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_46.webp',
  //   path: '/images/img_46.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_460.png',
  //   path: '/images/img_460.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_461.png',
  //   path: '/images/img_461.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_462.png',
  //   path: '/images/img_462.png',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_463.jpg',
  //   path: '/images/img_463.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_47.webp',
  //   path: '/images/img_47.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_48.webp',
  //   path: '/images/img_48.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_49.webp',
  //   path: '/images/img_49.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_5.webp',
  //   path: '/images/img_5.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_50.webp',
  //   path: '/images/img_50.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_51.webp',
  //   path: '/images/img_51.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_52.webp',
  //   path: '/images/img_52.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_53.webp',
  //   path: '/images/img_53.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_54.webp',
  //   path: '/images/img_54.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_55.webp',
  //   path: '/images/img_55.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_56.webp',
  //   path: '/images/img_56.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_57.webp',
  //   path: '/images/img_57.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_58.webp',
  //   path: '/images/img_58.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_59.jpg',
  //   path: '/images/img_59.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_6.webp',
  //   path: '/images/img_6.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_60.webp',
  //   path: '/images/img_60.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_61.webp',
  //   path: '/images/img_61.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_62.webp',
  //   path: '/images/img_62.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_63.webp',
  //   path: '/images/img_63.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_64.webp',
  //   path: '/images/img_64.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_65.webp',
  //   path: '/images/img_65.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_66.jpg',
  //   path: '/images/img_66.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_67.webp',
  //   path: '/images/img_67.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_68.webp',
  //   path: '/images/img_68.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_69.webp',
  //   path: '/images/img_69.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_7.webp',
  //   path: '/images/img_7.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_70.webp',
  //   path: '/images/img_70.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_71.webp',
  //   path: '/images/img_71.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_72.webp',
  //   path: '/images/img_72.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_73.webp',
  //   path: '/images/img_73.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_74.webp',
  //   path: '/images/img_74.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_75.webp',
  //   path: '/images/img_75.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_76.jpg',
  //   path: '/images/img_76.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_77.webp',
  //   path: '/images/img_77.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_78.webp',
  //   path: '/images/img_78.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_79.webp',
  //   path: '/images/img_79.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_8.webp',
  //   path: '/images/img_8.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_80.webp',
  //   path: '/images/img_80.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_81.webp',
  //   path: '/images/img_81.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_82.webp',
  //   path: '/images/img_82.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_83.webp',
  //   path: '/images/img_83.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_84.webp',
  //   path: '/images/img_84.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_85.webp',
  //   path: '/images/img_85.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_86.webp',
  //   path: '/images/img_86.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_87.webp',
  //   path: '/images/img_87.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_88.webp',
  //   path: '/images/img_88.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_89.webp',
  //   path: '/images/img_89.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_9.webp',
  //   path: '/images/img_9.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_90.webp',
  //   path: '/images/img_90.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_91.webp',
  //   path: '/images/img_91.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_92.webp',
  //   path: '/images/img_92.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_93.webp',
  //   path: '/images/img_93.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_94.webp',
  //   path: '/images/img_94.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_95.webp',
  //   path: '/images/img_95.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_96.webp',
  //   path: '/images/img_96.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_97.jpg',
  //   path: '/images/img_97.jpg',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_98.webp',
  //   path: '/images/img_98.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
  // {
  //   name: 'img_99.webp',
  //   path: '/images/img_99.webp',
  //   status: 'pending',
  //   loadTime: null,
  //   element: null,
  //   size: null
  // },
]);

// 計算屬性
const jsSuccessCount = computed(() => jsFiles.value.filter(file => file.status === 'success').length);
const jsFailedCount = computed(() => jsFiles.value.filter(file => file.status === 'error').length);
const cssSuccessCount = computed(() => cssFiles.value.filter(file => file.status === 'success').length);
const cssFailedCount = computed(() => cssFiles.value.filter(file => file.status === 'error').length);
const imageSuccessCount = computed(() => imageFiles.value.filter(file => file.status === 'success').length);
const imageFailedCount = computed(() => imageFiles.value.filter(file => file.status === 'error').length);

// 新增：來源統計的計算屬性
const jsP2pCount = computed(() => jsFiles.value.filter(file => file.source === 'P2P').length);
const jsNetworkCount = computed(() => jsFiles.value.filter(file => file.source === 'NETWORK').length);
const jsCacheCount = computed(() => jsFiles.value.filter(file => file.source === 'CACHE').length);

const cssP2pCount = computed(() => cssFiles.value.filter(file => file.source === 'P2P').length);
const cssNetworkCount = computed(() => cssFiles.value.filter(file => file.source === 'NETWORK').length);
const cssCacheCount = computed(() => cssFiles.value.filter(file => file.source === 'CACHE').length);

const imageP2pCount = computed(() => imageFiles.value.filter(file => file.source === 'P2P').length);
const imageNetworkCount = computed(() => imageFiles.value.filter(file => file.source === 'NETWORK').length);
const imageCacheCount = computed(() => imageFiles.value.filter(file => file.source === 'CACHE').length);

// 新增：來源顯示文字的輔助函數
const getSourceText = (source) => {
  switch (source) {
    case 'P2P': return '🔄 P2P';
    case 'NETWORK': return '🌐 網路';
    case 'CACHE': return '💾 快取';
    case 'ERROR': return '❌ 錯誤';
    default: return '❓ 未知';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'success': return '載入成功';
    case 'error': return '載入失敗';
    case 'loading': return '載入中...';
    case 'pending': return '待載入';
    default: return '未知狀態';
  }
};

// 格式化檔案大小
const formatFileSize = (bytes) => {
  if (bytes === 0 || bytes === null) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 修改後的 loadJsFile 函數
const loadJsFile = async (index) => {
  const file = jsFiles.value[index];
  const fileStartTime = performance.now();
  
  file.status = 'loading';
  
  try {
    // 使用標準fetch API請求資源，讓Service Worker攔截處理
    const response = await fetch(file.path);
    
    if (!response.ok) {
      throw new Error(`HTTP錯誤 ${response.status}: ${response.statusText}`);
    }
    
    // 檢查資源來源標頭
    const resourceSource = response.headers.get('X-Resource-Source');
    file.source = resourceSource || 'UNKNOWN'; // 添加來源信息到檔案對象
    
    // 在Console中顯示來源信息 - 使用不同的圖示和顏色
    const sourceIcon = resourceSource === 'P2P' ? '🔄' : 
                      resourceSource === 'NETWORK' ? '🌐' : 
                      resourceSource === 'CACHE' ? '💾' : '❓';
    const sourceText = resourceSource === 'P2P' ? 'P2P網路' : 
                      resourceSource === 'NETWORK' ? '網路伺服器' : 
                      resourceSource === 'CACHE' ? '本地快取' : '未知來源';
    
    console.log(`📁 ${file.name} - 來源: ${sourceIcon} ${sourceText}`);
    
    // 獲取腳本內容
    const scriptData = await response.text();
    
    // 建立並執行腳本
    const blob = new Blob([scriptData], { type: 'application/javascript' });
    const scriptObjectUrl = URL.createObjectURL(blob);
    
    // 建立腳本元素
    const scriptElement = document.createElement('script');
    scriptElement.src = scriptObjectUrl;
    
    // 設置載入成功和失敗的回調
    return new Promise((resolve, reject) => {
      scriptElement.onload = () => {
        const fileEndTime = performance.now();
        file.status = 'success';
        file.element = scriptElement;
        file.loadTime = Math.round(fileEndTime - fileStartTime);
        loadedJsCount.value++;
        
        // 額外的成功日誌
        console.log(`✅ ${file.name} 載入成功 (${file.loadTime}ms) - 來源: ${sourceIcon} ${sourceText}`);
        resolve();
      };
      
      scriptElement.onerror = (error) => {
        const fileEndTime = performance.now();
        file.status = 'error';
        file.loadTime = Math.round(fileEndTime - fileStartTime);
        URL.revokeObjectURL(scriptObjectUrl);
        loadedJsCount.value++;
        
        // 錯誤日誌
        console.error(`❌ ${file.name} 載入失敗 (${file.loadTime}ms) - 來源: ${sourceIcon} ${sourceText}`, error);
        reject(new Error(`腳本執行錯誤: ${error}`));
      };
      
      // 添加腳本到文檔中
      document.head.appendChild(scriptElement);
    });
  } catch (error) {
    console.error(`💥 載入 ${file.path} 失敗:`, error);
    file.status = 'error';
    file.error = error.message || '載入失敗';
    file.source = 'ERROR'; // 標記為錯誤狀態
    loadedJsCount.value++;
    throw error;
  }
};

// 修改後的 loadCssFile 函數
const loadCssFile = async (index) => {
  const file = cssFiles.value[index];
  const fileStartTime = performance.now();
  
  file.status = 'loading';
  
  try {
    // 使用標準fetch API請求資源，讓Service Worker攔截處理
    const response = await fetch(file.path);
    
    if (!response.ok) {
      throw new Error(`HTTP錯誤 ${response.status}: ${response.statusText}`);
    }
    
    // 檢查資源來源標頭
    const resourceSource = response.headers.get('X-Resource-Source');
    file.source = resourceSource || 'UNKNOWN';
    
    // 在Console中顯示來源信息
    const sourceIcon = resourceSource === 'P2P' ? '🔄' : 
                      resourceSource === 'NETWORK' ? '🌐' : 
                      resourceSource === 'CACHE' ? '💾' : '❓';
    const sourceText = resourceSource === 'P2P' ? 'P2P網路' : 
                      resourceSource === 'NETWORK' ? '網路伺服器' : 
                      resourceSource === 'CACHE' ? '本地快取' : '未知來源';
    
    console.log(`🎨 ${file.name} - 來源: ${sourceIcon} ${sourceText}`);
    
    // 獲取CSS內容
    const cssData = await response.text();
    
    // 建立Blob並創建URL
    const blob = new Blob([cssData], { type: 'text/css' });
    const cssObjectUrl = URL.createObjectURL(blob);
    
    // 建立樣式表元素
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = cssObjectUrl;
    
    // 設置載入成功和失敗的回調
    return new Promise((resolve, reject) => {
      linkElement.onload = () => {
        const fileEndTime = performance.now();
        file.status = 'success';
        file.element = linkElement;
        file.loadTime = Math.round(fileEndTime - fileStartTime);
        loadedCssCount.value++;
        
        console.log(`✅ ${file.name} 載入成功 (${file.loadTime}ms) - 來源: ${sourceIcon} ${sourceText}`);
        resolve();
      };
      
      linkElement.onerror = (error) => {
        const fileEndTime = performance.now();
        file.status = 'error';
        file.loadTime = Math.round(fileEndTime - fileStartTime);
        URL.revokeObjectURL(cssObjectUrl);
        loadedCssCount.value++;
        
        console.error(`❌ ${file.name} 載入失敗 (${file.loadTime}ms) - 來源: ${sourceIcon} ${sourceText}`, error);
        reject(new Error(`樣式表載入錯誤: ${error}`));
      };
      
      // 添加樣式表到文檔中
      document.head.appendChild(linkElement);
    });
  } catch (error) {
    console.error(`💥 載入 ${file.path} 失敗:`, error);
    file.status = 'error';
    file.error = error.message || '載入失敗';
    file.source = 'ERROR';
    loadedCssCount.value++;
    throw error;
  }
};

// 修改後的 loadImageFile 函數
const loadImageFile = async (index) => {
  const file = imageFiles.value[index];
  const fileStartTime = performance.now();
  
  file.status = 'loading';
  
  try {
    // 使用標準fetch API請求資源，讓Service Worker攔截處理
    const response = await fetch(file.path);
    
    if (!response.ok) {
      throw new Error(`HTTP錯誤 ${response.status}: ${response.statusText}`);
    }
    
    // 檢查資源來源標頭
    const resourceSource = response.headers.get('X-Resource-Source');
    file.source = resourceSource || 'UNKNOWN';
    
    // 在Console中顯示來源信息
    const sourceIcon = resourceSource === 'P2P' ? '🔄' : 
                      resourceSource === 'NETWORK' ? '🌐' : 
                      resourceSource === 'CACHE' ? '💾' : '❓';
    const sourceText = resourceSource === 'P2P' ? 'P2P網路' : 
                      resourceSource === 'NETWORK' ? '網路伺服器' : 
                      resourceSource === 'CACHE' ? '本地快取' : '未知來源';
    
    // 獲取圖片內容
    const blob = await response.blob();
    const imageObjectUrl = URL.createObjectURL(blob);
    
    // 記錄圖片大小
    file.size = blob.size;
    
    console.log(`🖼️ ${file.name} (${formatFileSize(file.size)}) - 來源: ${sourceIcon} ${sourceText}`);
    
    // 建立圖片元素並載入
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageObjectUrl;
      
      img.onload = () => {
        const fileEndTime = performance.now();
        file.status = 'success';
        file.element = img;
        file.loadTime = Math.round(fileEndTime - fileStartTime);
        loadedImageCount.value++;
        
        console.log(`✅ ${file.name} 載入成功 (${file.loadTime}ms, ${formatFileSize(file.size)}) - 來源: ${sourceIcon} ${sourceText}`);
        resolve();
      };
      
      img.onerror = (error) => {
        const fileEndTime = performance.now();
        file.status = 'error';
        file.loadTime = Math.round(fileEndTime - fileStartTime);
        URL.revokeObjectURL(imageObjectUrl);
        loadedImageCount.value++;
        
        console.error(`❌ ${file.name} 載入失敗 (${file.loadTime}ms) - 來源: ${sourceIcon} ${sourceText}`, error);
        reject(new Error(`圖片載入錯誤: ${error}`));
      };
      
      // 不需要將圖片加到DOM中，只需測試載入速度
      img.style.display = 'none';
    });
  } catch (error) {
    console.error(`💥 載入 ${file.path} 失敗:`, error);
    file.status = 'error';
    file.error = error.message || '載入失敗';
    file.source = 'ERROR';
    loadedImageCount.value++;
    throw error;
  }
};

// 載入所有JS檔案
const loadAllJsFiles = async () => {
  isLoadingJs.value = true;
  jsStartTime.value = performance.now();
  loadedJsCount.value = 0;
  
  // 重置所有檔案狀態
  jsFiles.value.forEach(file => {
    file.status = 'pending';
    file.loadTime = null;
    file.source = null;
    if (file.element) {
      try {
        URL.revokeObjectURL(file.element.src);
        document.head.removeChild(file.element);
      } catch (e) {
        console.error('清理腳本元素失敗:', e);
      }
      file.element = null;
    }
  });
  
  // 並行載入所有檔案
  const loadPromises = jsFiles.value.map((_, index) => loadJsFile(index));
  
  try {
    await Promise.allSettled(loadPromises);
    const endTime = performance.now();
    jsLoadTime.value = Math.round(endTime - jsStartTime.value);
  } catch (error) {
    console.error('載入JS檔案過程中發生錯誤:', error);
  } finally {
    isLoadingJs.value = false;
  }
};

// 載入所有CSS檔案
const loadAllCssFiles = async () => {
  isLoadingCss.value = true;
  cssStartTime.value = performance.now();
  loadedCssCount.value = 0;
  
  // 重置所有檔案狀態
  cssFiles.value.forEach(file => {
    file.status = 'pending';
    file.loadTime = null;
    file.source = null;
    if (file.element) {
      try {
        URL.revokeObjectURL(file.element.href);
        document.head.removeChild(file.element);
      } catch (e) {
        console.error('清理樣式表元素失敗:', e);
      }
      file.element = null;
    }
  });
  
  // 並行載入所有檔案
  const loadPromises = cssFiles.value.map((_, index) => loadCssFile(index));
  
  try {
    await Promise.allSettled(loadPromises);
    const endTime = performance.now();
    cssLoadTime.value = Math.round(endTime - cssStartTime.value);
  } catch (error) {
    console.error('載入CSS檔案過程中發生錯誤:', error);
  } finally {
    isLoadingCss.value = false;
  }
};

// 載入所有圖片檔案
const loadAllImageFiles = async () => {
  isLoadingImages.value = true;
  imageStartTime.value = performance.now();
  loadedImageCount.value = 0;
  
  // 重置所有檔案狀態
  imageFiles.value.forEach(file => {
    file.status = 'pending';
    file.loadTime = null;
    file.source = null;
    file.size = null;
    if (file.element) {
      try {
        URL.revokeObjectURL(file.element.src);
      } catch (e) {
        console.error('清理圖片元素失敗:', e);
      }
      file.element = null;
    }
  });
  
  // 並行載入所有檔案
  const loadPromises = imageFiles.value.map((_, index) => loadImageFile(index));
  
  try {
    await Promise.allSettled(loadPromises);
    const endTime = performance.now();
    imageLoadTime.value = Math.round(endTime - imageStartTime.value);
  } catch (error) {
    console.error('載入圖片檔案過程中發生錯誤:', error);
  } finally {
    isLoadingImages.value = false;
  }
};

// 重新載入所有JS檔案
const reloadAllJsFiles = () => {
  loadAllJsFiles();
};

// 重新載入所有CSS檔案
const reloadAllCssFiles = () => {
  loadAllCssFiles();
};

// 重新載入所有圖片檔案
const reloadAllImageFiles = () => {
  loadAllImageFiles();
};

// 頁面載入時自動初始化P2P客戶端並載入所有檔案
onMounted(async () => {
  // 如果p2pStore尚未初始化，則進行初始化
  if (!p2pStore.isInitialized) {
    try {
      await p2pStore.initializeP2P();
      console.log('P2P客戶端初始化成功');
    } catch (error) {
      console.error('P2P客戶端初始化失敗:', error);
    }
  }
  
  // 載入JS檔案
  loadAllJsFiles();
  
  // 載入CSS檔案
  loadAllCssFiles();
  
  // 載入圖片檔案
  loadAllImageFiles();
});
</script>

<style scoped>
.multi-resource-test {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #dee2e6;
}

.tabs button {
  padding: 12px 20px;
  background-color: #fff;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  transition: all 0.3s ease;
}

.tabs button.active {
  color: #4dabf7;
  border-bottom-color: #4dabf7;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.status-panel {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.loading-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  min-height: 100px;
  justify-content: center;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result-info {
  text-align: center;
}

.result-info h2 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.time-info {
  font-size: 18px;
  margin-bottom: 15px;
}

.time-info span {
  font-weight: bold;
  color: #3498db;
}

.success-count {
  color: #28a745;
  font-weight: bold;
}

.failed-count {
  color: #dc3545;
  font-weight: bold;
}

/* 新增：來源統計樣式 */
.source-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.source-stat-item {
  text-align: center;
}

.source-stat-item h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #6c757d;
}

.source-stat-number {
  font-size: 24px;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px;
  color: white;
}

.p2p-count {
  background-color: #17a2b8;
}

.network-count {
  background-color: #fd7e14;
}

.cache-count {
  background-color: #6f42c1;
}

.efficiency-count {
  background-color: #28a745;
}

.file-list {
  margin-top: 20px;
}

.file-list h3 {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #dee2e6;
}

.file-list ul {
  list-style-type: none;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}

.file-list li {
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-list li.success {
  background-color: #d4edda;
  border-left: 3px solid #28a745;
}

.file-list li.error {
  background-color: #f8d7da;
  border-left: 3px solid #dc3545;
}

.file-list li.loading {
  background-color: #cce5ff;
  border-left: 3px solid #007bff;
}

.file-list li.pending {
  background-color: #e9ecef;
  border-left: 3px solid #6c757d;
}

/* 新增：來源右邊框樣式 */
.file-list li.p2p {
  border-right: 4px solid #17a2b8;
}

.file-list li.network {
  border-right: 4px solid #fd7e14;
}

.file-list li.cache {
  border-right: 4px solid #6f42c1;
}

.file-list li.error {
  border-right: 4px solid #dc3545;
}

.file-name {
  font-weight: bold;
  flex: 1;
}

.file-source {
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
  margin: 0 10px;
  color: white;
}

.file-source.p2p {
  background-color: #17a2b8;
}

.file-source.network {
  background-color: #fd7e14;
}

.file-source.cache {
  background-color: #6f42c1;
}

.file-source.error {
  background-color: #dc3545;
}

.file-status {
  margin: 0 15px;
  font-size: 12px;
  color: #6c757d;
}

.file-time {
  font-family: monospace;
  margin-right: 15px;
  font-size: 12px;
  color: #495057;
}

.file-size {
  font-family: monospace;
  color: #6c757d;
  width: 80px;
  text-align: right;
  font-size: 11px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #339af0;
}

button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .source-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .file-list li {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .file-name {
    flex-basis: 100%;
  }
  
  .file-source {
    font-size: 10px;
    padding: 1px 6px;
  }
  
  .file-status,
  .file-time,
  .file-size {
    font-size: 10px;
  }
}
</style>