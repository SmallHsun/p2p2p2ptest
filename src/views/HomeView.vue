<template>
  <div class="home">
    <h1>P2P CDN示例應用</h1>

    <div class="introduction">
      <p>這個演示應用展示了如何在Vue 3應用中集成P2P CDN功能。透過分散式網路，使用者可以直接從其他存取者那裡獲取靜態資源，減輕伺服器負擔並提高載入速度。</p>
    </div>

    <div class="feature-cards">
      <div class="feature-card">
        <h3>P2P資源共享</h3>
        <p>應用使用WebRTC技術在瀏覽器之間建立點對點連線，實現資源共享，無需經過中心伺服器。</p>
      </div>

      <div class="feature-card">
        <h3>本地快取</h3>
        <p>資源會自動快取在IndexedDB中，即使沒有網路連線也能存取之前載入過的內容。</p>
      </div>

      <div class="feature-card">
        <h3>Service Worker集成</h3>
        <p>應用使用Service Worker攔截網路請求，優先從P2P網路或本地快取獲取資源。</p>
      </div>
    </div>

    <div class="get-started">
      <h2>開始使用</h2>
      <ol>
        <li>
          <strong>檢查P2P連線狀態</strong>
          <p>請確保頁面頂部的P2P狀態指示為"已連線"，如果不是，請點擊"初始化P2P"按鈕。</p>
        </li>
        <li>
          <strong>存取測試頁面</strong>
          <p>轉到<router-link to="/p2p-test">P2P測試</router-link>頁面，測試資源載入功能。</p>
        </li>
        <li>
          <strong>管理資源</strong>
          <p>在<router-link to="/resources">資源管理</router-link>頁面查看和管理已快取的資源。</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.introduction {
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #343a40;
  margin-top: 0;
  margin-bottom: 10px;
}

.get-started {
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 8px;
}

.get-started h2 {
  margin-top: 0;
  color: #343a40;
}

.get-started ol {
  padding-left: 20px;
}

.get-started li {
  margin-bottom: 15px;
}

.get-started strong {
  display: block;
  margin-bottom: 5px;
  color: #495057;
}

.get-started p {
  margin: 5px 0;
}

.get-started a {
  color: #4dabf7;
  text-decoration: none;
  font-weight: bold;
}

.get-started a:hover {
  text-decoration: underline;
}
</style>