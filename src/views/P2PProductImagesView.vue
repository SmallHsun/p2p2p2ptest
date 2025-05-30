<template>
  <div class="product-gallery">
    <h1>電商產品展示</h1>

    <!-- <div class="product-grid">
      <div v-for="(product, index) in products" :key="index" class="product-card">
        <div class="product-image-container">
          <img :src="product.imageUrl" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-price">NT$ {{ product.price }}</p>
          <button class="add-to-cart-btn">加入購物車</button>
        </div>
      </div>
    </div> -->

    <div v-if="products.length === 0" class="no-products">
      <p>暫無產品</p>
    </div>

    <div class="local-image-section">
      <h3>本地資源圖片</h3>
      <div class="image-examples">
  
        <div class="example-image">
          <img :src="getImageUrl(6)" alt="本地圖片1" />
        </div>
        <div class="example-image">
          <img :src="getImageUrl2(132)" alt="本地圖片1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useP2PStore } from '../stores/p2pStore';

// 引入p2pStore共享p2p_client實例
const p2pStore = useP2PStore();

// 產品資料
const products = ref([
  {
    id: 1,
    name: '智能手機',
    description: '高性能智能手機，1200萬像素相機，支持5G網絡',
    price: 15990,
    imageUrl: 'https://picsum.photos/id/160/800/600'
  },
  {
    id: 2,
    name: '無線耳機',
    description: '主動降噪無線耳機，續航20小時，防水IPX4',
    price: 4590,
    imageUrl: 'https://picsum.photos/id/836/800/600'
  },
  {
    id: 3,
    name: '智能手錶',
    description: '全天候健康監測，多種運動模式，支持通話功能',
    price: 8990,
    imageUrl: 'https://picsum.photos/id/175/800/600'
  },
  {
    id: 4,
    name: '筆記本電腦',
    description: '輕薄設計，高性能處理器，長達12小時電池續航',
    price: 32900,
    imageUrl: 'https://picsum.photos/id/119/800/600'
  },
  {
    id: 5,
    name: '藍牙音箱',
    description: '360度環繞音效，防水設計，支持語音助手',
    price: 3200,
    imageUrl: 'https://picsum.photos/id/3/800/600'
  }
]);
const getImageUrl = (fileIndex) => {
  return new URL(
    `../assets/${fileIndex}.png`,
    import.meta.url
  ).href;
};

const getImageUrl1 = (fileIndex) => {
  return new URL(
    `../assets/${fileIndex}.jpg`,
    import.meta.url
  ).href;
};

const getImageUrl2 = (fileIndex) => {
  return new URL(
    `../assets/${fileIndex}.webp`,
    import.meta.url
  ).href;
};

// 在組件載入時初始化P2P客戶端
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
});
</script>

<style scoped>
.product-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  height: 220px;
  overflow: hidden;
}

.product-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image-container img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.product-description {
  color: #666;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-weight: bold;
  font-size: 18px;
  color: #e53935;
  margin-bottom: 15px;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px 0;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: #1976d2;
}

.no-products {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }

  .product-image-container {
    height: 180px;
  }
}
</style>