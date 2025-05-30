import { P2PManager } from './p2p_manager.js';
import { storeResource, getResource, calculateHash } from './indexdb-storage.js';

export class p2p_client {

    constructor(config) {
        // 配置
        this.config = {
            coordinatorUrl: 'http://localhost:8081/api/coordinator',
            signalingUrl: 'ws://localhost:8081/ws',
            ...config
        };

        // 內部狀態
        this.clientId = this._getStoredClientId() || this._generateClientId();
        this.isReady = false;
        this.p2pManager = null;
        this.geolocation = { latitude: 0, longitude: 0 };
        this.contentCache = new Map(); // 本地內容緩存記錄
        this.requestLocks = new Map(); // 請求ID -> 鎖狀態
        this.activeTransfers = new Set();
        this.maxNormalConcurrent = 6; // 只限制非關鍵資源
        this.imageQueue = []; // 只對圖片排隊

        // 事件監聽器
        this.eventListeners = new Map();
    }

    _setupServiceWorkerListener() {
        if ('serviceWorker' in navigator) {
            // 監聽來自 Service Worker 的資源請求
            navigator.serviceWorker.addEventListener('message', async (event) => {
                // 檢查 event.data.type 而不是 event.type
                if (event.data && event.data.type === 'P2P_GET_RESOURCE') {
                    try {
                        const url = event.data.url;
                        console.log(`收到Service Worker的資源請求: ${url}`);

                        // 確保p2p_client已初始化
                        if (!this.isReady) {
                            await this.init();
                        }

                        // 使用P2P網絡獲取資源
                        const resourceData = await this.getResourceP2POnly(url);

                        // 根據URL確定內容類型
                        let contentType = this._getContentTypeFromUrl(url);

                        // 回應Service Worker
                        event.ports[0].postMessage({
                            data: resourceData,
                            contentType
                        });
                    } catch (error) {
                        console.error('處理Service Worker請求失敗:', error);
                        event.ports[0].postMessage({
                            error: error.message || '未知錯誤'
                        });
                    }
                }
                // 添加對資源擁有通知的處理 
                else if (event.data && event.data.type === 'P2P_ANNOUNCE_RESOURCE') {
                    try {
                        const url = event.data.requestToCache;
                        const urlHash = event.data.urlHash;
                        // console.log(`[p2p_client] 收到 SW 通知：擁有快取資源: ${url}, 哈希: ${urlHash}`);

                        // 確保客戶端已初始化
                        if (!this.isReady) {
                            await this.init();
                        }

                        // 從IndexedDB獲取資源
                        const resource = await getResource(urlHash);
                        console.log('從IndexedDB獲取的資源:', resource);

                        if (resource) {
                            // 更新本地緩存記錄
                            this.contentCache.set(url, {
                                url: resource.url,
                                data: resource.data,
                                contentType: resource.contentType
                            });

                            // 向協調器註冊內容
                            await this._registerContentWithCoordinator(urlHash);

                            // 發送確認回應
                            if (event.ports && event.ports[0]) {
                                event.ports[0].postMessage({ status: 'ack' });
                                // console.log(`[p2p_client] 已回覆 SW 資源通知確認: ${url}`);
                            }
                        } else {
                            console.warn(`[p2p_client] 在IndexedDB中找不到資源: ${url}`);
                            if (event.ports && event.ports[0]) {
                                event.ports[0].postMessage({
                                    status: 'error',
                                    error: 'Resource not found in IndexedDB'
                                });
                            }
                        }
                    } catch (error) {
                        console.error('[p2p_client] 處理 SW 資源通知失敗:', error);
                        if (event.ports && event.ports[0]) {
                            event.ports[0].postMessage({
                                status: 'error',
                                error: error.message || '未知錯誤'
                            });
                        }
                    }
                }
            });
        }
    }
    _getResourceTypeFromUrl(url) {
        const extension = url.split('.').pop().toLowerCase();

        const jsExtensions = ['js', 'mjs', 'jsx'];
        const cssExtensions = ['css', 'scss', 'less'];
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];

        if (jsExtensions.includes(extension)) return 'js';
        if (cssExtensions.includes(extension)) return 'css';
        if (imageExtensions.includes(extension)) return 'image';

        // 從路徑進一步判斷
        if (url.includes('/js/')) return 'js';
        if (url.includes('/css/')) return 'css';
        if (url.includes('/images/') || url.includes('/img/')) return 'image';

        return 'other';
    }
    /**
     * 根據URL確定內容類型
     * @param {string} url - 資源URL
     * @returns {string} 內容類型
     * @private
     */
    _getContentTypeFromUrl(url) {
        const extension = url.split('.').pop().toLowerCase();
        const contentTypes = {
            'vue': 'application/javascript',
            'js': 'application/javascript',
            'css': 'text/css',
            'html': 'text/html',
            'json': 'application/json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'mp4': 'video/mp4',
            'mp3': 'audio/mpeg',
            'pdf': 'application/pdf',
            'txt': 'text/plain'
        };

        return contentTypes[extension] || 'application/octet-stream';
    }
    /**
     * 初始化系統並連接到協調器
     * @returns {Promise} 初始化完成後的Promise
     */
    async init() {
        if (this.isReady) return Promise.resolve();

        try {
            // 獲取地理位置
            await this._getGeolocation();
            console.log('獲取地理位置成功:', this.geolocation);
            // 初始化P2P管理器
            this.p2pManager = new P2PManager(this.config.signalingUrl, this.clientId);

            // 註冊資源請求處理器
            this.p2pManager.registerMessageHandler('resource-request', this._handleResourceRequest.bind(this));

            // 向協調器註冊客戶端
            const isNewClientId = !localStorage.getItem('p2p_client_registered')
                || localStorage.getItem('p2p_client_id') !== this.clientId;

            if (isNewClientId) {
                // 新客戶端，執行完整註冊
                await this._registerWithCoordinator();
                localStorage.setItem('p2p_client_registered', 'true');
                console.log(`[P2P客戶端] 已向協調器註冊新客戶端: ${this.clientId}`);
            } else {
                // 現有客戶端，只更新狀態
                await this._updateClientStatus('ONLINE');
                console.log(`[P2P客戶端] 使用現有客戶端ID: ${this.clientId}，已更新狀態為在線`);
            }

            this.p2pManager.connect();

            // 標記為準備就緒
            this.isReady = true;
            await this._registerServiceWorker();

            // 觸發ready事件
            this._dispatchEvent('ready');
            // this._registerServiceWorker();
            this._setupServiceWorkerListener();

            return Promise.resolve();
        } catch (error) {
            console.error('初始化p2p失敗:', error);
            return Promise.reject(error);
        }
    }
    async getResourceP2POnly(url) {
        if (!this.isReady) {
            await this.init();
        }

        try {
            // 計算URL哈希作為內容哈希
            const urlHash = await calculateHash(url);
            console.log(`計算URL哈希: ${urlHash} 用於 ${url}`);

            try {
                // 查找擁有此資源的節點
                const peers = await this._findPeersWithContent(urlHash);
                if (!peers || peers.length === 0) {
                    throw new Error('沒有可用的peer來提供此資源');
                }

                console.log(`[P2P客戶端] 找到 ${peers.length} 個具有資源 ${url} 的對等方`);

                // 對節點進行排序 (按距離或其他指標)
                const sortedPeers = [...peers].sort((a, b) => {
                    return (a.distance || 0) - (b.distance || 0);
                });

                // 判斷資源類型
                const resourceType = this._getResourceTypeFromUrl(url);
                console.log(`[P2P客戶端] 資源 ${url} 類型為: ${resourceType}`);

                // 記錄已嘗試過的節點
                const triedPeers = new Set();

                // 選擇合適的節點
                let selectedPeer;

                if (resourceType === 'js' || resourceType === 'css') {
                    // 關鍵資源：在頂級節點中分散（而不是全部給第一個）
                    selectedPeer = await this._selectTopNodeWithDistribution(sortedPeers, url, resourceType);
                }
                else if (resourceType === 'image') {
                    // 圖片資源：在所有節點中分散（保持原策略）
                    selectedPeer = await this._selectNodeByHashDistribution(sortedPeers, url, resourceType);
                }
                else {
                    // 其他資源：使用第一順位節點
                    selectedPeer = sortedPeers[0];
                    console.log(`[P2P客戶端] 其他資源使用第一順位節點: ${selectedPeer.clientId}`);
                }

                // 從選定的節點獲取資源
                try {
                    // 標記已嘗試
                    triedPeers.add(selectedPeer.clientId);

                    // 確保連接建立
                    await this.p2pManager.ensureConnected(selectedPeer.clientId);
                    console.log(`已與節點 ${selectedPeer.clientId} 建立連接，開始請求資源 ${url}`);

                    // 請求資源
                    const responseData = await this.p2pManager.requestResource(selectedPeer.clientId, url);

                    // ===== 檢查是否因負載過高而被拒絕 =====
                    if (responseData.status === 'overloaded' && responseData.shouldTryNextPeer) {
                        console.log(`[P2P客戶端] 節點 ${selectedPeer.clientId} 負載過高 (${responseData.loadScore})，嘗試下一個節點`);
                        throw { overloaded: true, message: responseData.reason || '節點負載過高' };
                    }

                    console.log(`從節點 ${selectedPeer.clientId} 獲取資源成功: ${url}`);

                    const { data, Cacheurl } = responseData;

                    // 檢查數據類型
                    if (!(data instanceof Blob)) {
                        console.warn(`接收到的數據不是Blob: ${typeof data}`);

                        // 嘗試將非Blob數據轉換為Blob
                        let contentType = this._getContentTypeFromUrl(url);
                        let blobData;

                        if (typeof data === 'string') {
                            // 字符串轉為Blob
                            blobData = new Blob([data], { type: contentType });
                            console.log(`[P2P客戶端] 從字符串轉換為Blob: 大小=${blobData.size}字節`);
                        } else if (data && typeof data === 'object') {
                            // 嘗試將對象轉換為字符串，再轉為Blob
                            try {
                                const jsonString = JSON.stringify(data);
                                blobData = new Blob([jsonString], { type: contentType });
                                console.log(`[P2P客戶端] 從對象轉換為Blob: 大小=${blobData.size}字節`);
                            } catch (e) {
                                console.error('無法將對象轉換為JSON字符串:', e);
                                throw new Error('數據格式錯誤');
                            }
                        } else {
                            throw new Error('不支持的數據類型');
                        }

                        // 緩存資源到IndexedDB
                        await this._cacheResource(Cacheurl || url, blobData);
                        console.log(`[P2P客戶端] 已緩存轉換後的Blob到IndexedDB: ${Cacheurl || url}`);

                        return blobData;
                    }

                    // 驗證URL哈希
                    const receivedHash = await calculateHash(Cacheurl || url);
                    if (receivedHash === urlHash) {
                        console.log(`[P2P客戶端] 收到的資源哈希 ${receivedHash} 與請求哈希 ${urlHash} 匹配`);
                        // 緩存資源到IndexedDB
                        await this._cacheResource(Cacheurl || url, data);
                        console.log(`[P2P客戶端] 已緩存Blob到IndexedDB: ${Cacheurl || url}`);

                        return data;
                    } else {
                        console.warn(`從對等方 ${selectedPeer.clientId} 獲取的資源哈希不匹配: 預期=${urlHash}, 實際=${receivedHash}`);
                    }

                } catch (selectedPeerError) {
                    console.warn(`從選定節點 ${selectedPeer.clientId} 獲取資源失敗:`, selectedPeerError);

                    // 嘗試其他節點作為備用
                    for (const peer of sortedPeers) {
                        // 跳過已嘗試的節點
                        if (triedPeers.has(peer.clientId)) continue;

                        // 標記已嘗試
                        triedPeers.add(peer.clientId);

                        try {
                            await this.p2pManager.ensureConnected(peer.clientId);
                            console.log(`嘗試從備用節點 ${peer.clientId} 獲取資源 ${url}`);

                            const responseData = await this.p2pManager.requestResource(peer.clientId, url);

                            // 檢查是否因負載過高而被拒絕
                            if (responseData.status === 'overloaded' && responseData.shouldTryNextPeer) {
                                console.log(`[P2P客戶端] 備用節點 ${peer.clientId} 負載過高，繼續嘗試下一個節點`);
                                continue; // 嘗試下一個節點
                            }

                            console.log(`從備用節點 ${peer.clientId} 獲取資源成功: ${url}`);

                            const { data, Cacheurl } = responseData;

                            // 檢查數據類型 (與上面相同的處理邏輯)
                            if (!(data instanceof Blob)) {
                                // 與上面相同的非Blob處理邏輯...
                                let contentType = this._getContentTypeFromUrl(url);
                                let blobData;

                                if (typeof data === 'string') {
                                    blobData = new Blob([data], { type: contentType });
                                } else if (data && typeof data === 'object') {
                                    try {
                                        const jsonString = JSON.stringify(data);
                                        blobData = new Blob([jsonString], { type: contentType });
                                    } catch (e) {
                                        throw new Error('數據格式錯誤');
                                    }
                                } else {
                                    throw new Error('不支持的數據類型');
                                }

                                await this._cacheResource(Cacheurl || url, blobData);
                                return blobData;
                            }

                            // 驗證URL哈希
                            const receivedHash = await calculateHash(Cacheurl || url);
                            if (receivedHash === urlHash) {
                                await this._cacheResource(Cacheurl || url, data);
                                return data;
                            }
                        } catch (backupError) {
                            console.warn(`從備用節點 ${peer.clientId} 獲取資源失敗:`, backupError);
                            // 繼續嘗試下一個節點
                        }
                    }

                    // 所有節點都嘗試失敗
                    throw new Error('嘗試所有節點後仍無法獲取資源');
                }
            } catch (p2pError) {
                console.warn('P2P獲取資源失敗:', p2pError);
                throw new Error('無可用的P2P資源');
            }
        } catch (error) {
            console.error(`獲取資源 ${url} 失敗:`, error);
            throw error;
        }
    }
    async _selectTopNodeWithDistribution(sortedPeers, url, resourceType) {
        // 取前3個最佳節點（或所有節點，如果不足3個）
        const topNodeCount = Math.min(3, sortedPeers.length);
        const topNodes = sortedPeers.slice(0, topNodeCount);

        // 使用哈希分散到這些頂級節點
        const hash = await calculateHash(url);
        const hashNumber = parseInt(hash.substring(0, 8), 16);
        const nodeIndex = hashNumber % topNodes.length;
        const selectedPeer = topNodes[nodeIndex];

        console.log(`[P2P客戶端] ${resourceType}資源在前${topNodeCount}個頂級節點中分散: ${selectedPeer.clientId} (索引: ${nodeIndex}/${topNodes.length - 1})`);

        return selectedPeer;
    }

    /**
     * 通用的哈希分散選擇（用於圖片等非關鍵資源）
     */
    async _selectNodeByHashDistribution(sortedPeers, url, resourceType) {
        const hash = await calculateHash(url);
        const hashNumber = parseInt(hash.substring(0, 8), 16);
        const nodeIndex = hashNumber % sortedPeers.length;
        const selectedPeer = sortedPeers[nodeIndex];

        console.log(`[P2P客戶端] ${resourceType}資源使用分散式節點: ${selectedPeer.clientId} (索引: ${nodeIndex}/${sortedPeers.length - 1})`);

        return selectedPeer;
    }
    /**
     * 添加事件監聽器
     * @param {string} eventName - 事件名稱
     * @param {Function} callback - 回調函數
     */
    addEventListener(eventName, callback) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, new Set());
        }
        this.eventListeners.get(eventName).add(callback);
    }

    /**
     * 移除事件監聽器
     * @param {string} eventName - 事件名稱
     * @param {Function} callback - 回調函數
     */
    removeEventListener(eventName, callback) {
        if (this.eventListeners.has(eventName)) {
            this.eventListeners.get(eventName).delete(callback);
        }
    }

    /**
     * 觸發事件
     * @param {string} eventName - 事件名稱
     * @param {Object} data - 事件數據
     * @private
     */
    _dispatchEvent(eventName, data = {}) {
        if (this.eventListeners.has(eventName)) {
            for (const callback of this.eventListeners.get(eventName)) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`執行事件監聽器時出錯 (${eventName}):`, error);
                }
            }
        }
    }
    _getStoredClientId() {
        try {
            const storedId = localStorage.getItem('p2p_client_id');
            const expireTime = localStorage.getItem('p2p_client_id_expire');

            if (storedId && expireTime) {
                // 檢查是否過期
                const now = new Date().getTime();
                if (now < parseInt(expireTime)) {
                    console.log(`[P2P客戶端] 使用已存儲的客戶端ID: ${storedId}`);
                    return storedId;
                } else {
                    // 若已過期，清除存儲
                    localStorage.removeItem('p2p_client_registered')
                    localStorage.removeItem('p2p_client_id');
                    localStorage.removeItem('p2p_client_id_expire');
                    console.log(`[P2P客戶端] 存儲的客戶端ID已過期，已清除`);
                }
            }
        } catch (error) {
            console.warn(`[P2P客戶端] 獲取存儲的客戶端ID出錯:`, error);
        }
        return null;
    }

    _generateClientId() {
        const newId = 'client-' + crypto.randomUUID();

        // 設置過期時間，例如 7 天後過期
        const expireTime = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);

        try {
            localStorage.setItem('p2p_client_id', newId);
            localStorage.setItem('p2p_client_id_expire', expireTime.toString());
            console.log(`[P2P客戶端] 生成並保存新的客戶端ID: ${newId}, 過期時間: ${new Date(expireTime).toLocaleString()}`);
        } catch (error) {
            console.warn(`[P2P客戶端] 保存客戶端ID出錯:`, error);
        }

        return newId;
    }

    async _updateClientStatus(status) {
        try {
            // 計算新的過期時間 (例如7天後)
            const newExpireTime = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);

            // 更新本地存儲的過期時間
            localStorage.setItem('p2p_client_id_expire', newExpireTime.toString());

            // 向服務器發送更新狀態和過期時間的請求
            const response = await fetch(`${this.config.coordinatorUrl}/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: this.clientId,
                    status: status,
                    expireTime: newExpireTime
                })
            });

            if (!response.ok) {
                throw new Error(`更新客戶端狀態失敗: ${response.statusText}`);
            }

            console.log(`客戶端狀態更新為 ${status}，過期時間延長至 ${new Date(newExpireTime).toLocaleString()}`);
        } catch (error) {
            console.error('更新客戶端狀態失敗:', error);
            throw error;
        }
    }
    /**
     * 註冊Service Worker
     * @private
     */
    async _registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                console.log('Service Worker 註冊成功，範圍:', registration.scope);
            } catch (error) {
                console.error('Service Worker 註冊失敗:', error);
            }
        } else {
            console.warn('瀏覽器不支持 Service Worker');
        }
    }

    /**
     * 獲取地理位置
     * @private
     */
    _getGeolocation() {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.geolocation.latitude = position.coords.latitude;
                        this.geolocation.longitude = position.coords.longitude;
                        resolve();
                    },
                    (error) => {
                        console.warn('獲取地理位置失敗:', error);
                        // 默認位置
                        this.geolocation.latitude = 0;
                        this.geolocation.longitude = 0;
                        resolve();
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
                );
            } else {
                console.warn('瀏覽器不支持地理位置API');
                resolve();
            }
        });
    }

    async _registerWithCoordinator() {
        try {
            // 獲取過期時間
            const expireTime = parseInt(localStorage.getItem('p2p_client_id_expire') || '0');

            const response = await fetch(`${this.config.coordinatorUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: this.clientId,
                    latitude: this.geolocation.latitude,
                    longitude: this.geolocation.longitude,
                    contentHashes: [],
                    expireTime: expireTime,
                    status: "ONLINE"
                })
            });

            if (!response.ok) {
                throw new Error(`註冊客戶端失敗: ${response.statusText}`);
            }

            console.log('客戶端註冊成功');
        } catch (error) {
            console.error('註冊客戶端失敗:', error);
            throw error;
        }
    }

    /**
     * 計算內容哈希
     * @param {string} content - 要計算哈希的內容
     * @returns {Promise<string>} 計算出的哈希
     * @private
     */
    async _calculateHash(content) {
        return calculateHash(content);
    }
    /**
     * 從IndexedDB獲取資源
     * @param {string} urlHash - URL哈希值
     * @returns {Promise<Object>} 緩存的資源數據
     * @private
     */
    async _getFromIndexedDB(urlHash) {
        try {
            const resource = await getResource(urlHash);
            if (resource) {
                console.log('從IndexedDB獲取資源:', urlHash);
                return {
                    url: resource.url,
                    data: resource.data,
                    contentType: resource.contentType
                };
            } else {
                console.log('IndexedDB中找不到資源:', urlHash);
                return null;
            }
        } catch (error) {
            console.error('從IndexedDB獲取資源出錯:', error);
            return null;
        }
    }


    /**
     * 緩存資源到IndexedDB
     * @param {string} url - 資源URL
     * @param {*} data - 資源數據
     * @private
     */
    async _cacheResource(url, data) {
        try {
            // 計算URL哈希
            const urlHash = await this._calculateHash(url);

            // 更新本地緩存記錄
            this.contentCache.set(url, data);

            // 確定內容類型
            const contentType = this._getContentTypeFromUrl(url);

            // 確保資源是Blob格式
            let blobData;
            if (data instanceof Blob) {
                // 已經是Blob，直接使用
                blobData = data;
                console.log(`[P2P客戶端] 數據已經是Blob類型: ${blobData.size}字節, ${blobData.type || '未指定類型'}`);
            }
            else if (typeof data === 'string') {
                // 字符串數據 (JavaScript, CSS, HTML等)
                blobData = new Blob([data], { type: contentType });
                console.log(`[P2P客戶端] 從字符串創建Blob: ${blobData.size}字節`);
            }
            else if (data && typeof data === 'object') {
                // 對象轉換為JSON字符串再轉為Blob
                try {
                    const jsonString = JSON.stringify(data);
                    blobData = new Blob([jsonString], { type: contentType });
                    console.log(`[P2P客戶端] 從對象創建Blob: ${blobData.size}字節`);
                } catch (e) {
                    console.error(`[P2P客戶端] 無法將對象轉換為JSON:`, e);
                    throw new Error('無法序列化對象');
                }
            }
            else {
                console.error(`[P2P客戶端] 不支持的數據類型: ${typeof data}`, data);
                throw new Error('不支持的數據類型');
            }

            // 存儲到IndexedDB
            await storeResource(urlHash, blobData, contentType, url);
            console.log(`[P2P客戶端] 資源已存入IndexedDB: ${url}, 哈希: ${urlHash}, 大小: ${blobData.size}字節`);

            // 向協調器註冊內容
            await this._registerContentWithCoordinator(urlHash);

        } catch (error) {
            console.error('[P2P客戶端] 緩存資源失敗:', error);
            throw error;  // 重新拋出錯誤以便上層處理
        }
    }
    /**
     * 向協調器註冊內容
     * @param {string} contentHash - 內容哈希
     * @param {string} contentUrl - 內容URL
     * @private
     */
    async _registerContentWithCoordinator(contentHash) {
        try {
            const response = await fetch(`${this.config.coordinatorUrl}/register-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentHash,
                    clientInfo: [
                        {
                            clientId: this.clientId,
                            latitude: this.geolocation.latitude,
                            longitude: this.geolocation.longitude
                        }
                    ]

                })
            });

            if (!response.ok) {
                throw new Error(`註冊內容失敗: ${response.statusText}`);
            }

            console.log(`內容 ${contentHash} 註冊成功`);
        } catch (error) {
            console.error('註冊內容失敗:', error);
        }
    }

    /**
     * 找到擁有特定內容的對等方
     * @param {string} contentHash - 內容哈希
     * @returns {Promise<Array>} 對等方列表
     * @private
     */
    async _findPeersWithContent(contentHash) {
        try {
            const response = await fetch(`${this.config.coordinatorUrl}/find-peers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentHash,
                    latitude: this.geolocation.latitude,
                    longitude: this.geolocation.longitude
                })
            });

            if (!response.ok) {
                throw new Error(`找不到擁有內容的對等方: ${response.statusText}`);
            }

            const peers = await response.json();
            // 過濾掉自己
            const filteredPeers = peers.filter(peer => peer.clientId !== this.clientId);
            console.log(`[P2P客戶端] 找到 ${filteredPeers.length} 個擁有資源的對等方`);
            return filteredPeers;
        } catch (error) {
            console.error('查詢對等方失敗:', error);
            return [];
        }
    }

    async _handleResourceRequest(peerId, requestData) {
        const url = requestData.url;
        const requestId = requestData.requestId;

        // 關鍵判斷：是否為關鍵資源
        if (this._isCriticalResource(url)) {
            console.log(`[快速通道] 關鍵資源直接處理: ${url}`);
            return this._executeOriginalTransfer(peerId, requestData, requestId);
        }

        // 檢查緩衝區是否過載
        if (this._isBufferOverloaded(peerId)) {
            console.log(`[緩衝區控制] 等待緩衝區恢復: ${url}`);
            await this._quickBufferWait(peerId);
        }

        // 非關鍵資源檢查並發限制
        if (this.activeTransfers.size >= this.maxNormalConcurrent) {
            // 只對圖片等非關鍵資源排隊
            if (this._isImageResource(url)) {
                console.log(`[圖片隊列] 圖片加入等待隊列: ${url}`);
                return this._queueImageTransfer(peerId, requestData, requestId);
            }
        }
        // 執行傳輸（帶跟蹤）
        return this._executeTransferWithTracking(peerId, requestData, requestId);
    }

    _isCriticalResource(url) {
        const ext = url.split('.').pop().toLowerCase();
        return ['js', 'mjs', 'jsx', 'css', 'scss', 'less'].includes(ext);
    }

    _isImageResource(url) {
        const ext = url.split('.').pop().toLowerCase();
        return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext);
    }

    _isBufferOverloaded(peerId) {
        const peerInfo = this.p2pManager.peerConnections.get(peerId);
        if (!peerInfo?.dataChannel) return false;

        const buffered = peerInfo.dataChannel.bufferedAmount;
        return buffered > 400 * 1024; // 400KB閾值
    }

    async _quickBufferWait(peerId) {
        const peerInfo = this.p2pManager.peerConnections.get(peerId);
        if (!peerInfo?.dataChannel) return;

        const dataChannel = peerInfo.dataChannel;
        const target = 150 * 1024; // 降到150KB

        if (dataChannel.bufferedAmount <= target) return;

        return new Promise(resolve => {
            const check = () => {
                if (dataChannel.bufferedAmount <= target) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();

            // 最多等待2秒
            setTimeout(resolve, 2000);
        });
    }

    async _executeTransferWithTracking(peerId, requestData, requestId) {
        this.activeTransfers.add(requestId);

        try {
            await this._executeOriginalTransfer(peerId, requestData, requestId);
        } finally {
            this.activeTransfers.delete(requestId);
            this._processImageQueue(); // 處理圖片隊列
        }
    }

    _queueImageTransfer(peerId, requestData, requestId) {
        this.imageQueue.push({ peerId, requestData, requestId, queuedAt: Date.now() });
        console.log(`[圖片隊列] 隊列長度: ${this.imageQueue.length}`);
    }

    _processImageQueue() {
        while (this.imageQueue.length > 0 &&
            this.activeTransfers.size < this.maxNormalConcurrent) {

            const next = this.imageQueue.shift();

            // 檢查是否過期（超過20秒）
            if (Date.now() - next.queuedAt > 20000) {
                console.warn(`[圖片隊列] 丟棄過期請求: ${next.requestId}`);
                continue;
            }

            console.log(`[圖片隊列] 處理隊列中的圖片: ${next.requestData.url}`);
            this._executeTransferWithTracking(next.peerId, next.requestData, next.requestId)
                .catch(err => console.error(`隊列處理失敗:`, err));
        }
    }

    // 保持原有的傳輸邏輯不變
    async _executeOriginalTransfer(peerId, requestData, requestId) {
        const url = requestData.url;
        const lockKey = `handle-${peerId}-${requestId}`;

        if (this.requestLocks.has(lockKey)) {
            await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                requestId: requestId,
                error: 'Resource request is already being processed'
            });
            return;
        }

        this.requestLocks.set(lockKey, true);

        try {
            // ... 你原有的所有處理邏輯保持不變 ...
            const loadCheckResult = this.p2pManager.canAcceptResourceRequest(url, peerId);
            if (!loadCheckResult.accept) {
                await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                    requestId: requestId,
                    error: '節點負載過高，請嘗試其他節點',
                    status: 'overloaded',
                    loadScore: loadCheckResult.loadScore,
                    reason: loadCheckResult.reason,
                    shouldTryNextPeer: true
                });
                return;
            }

            const urlHash = await this._calculateHash(url);
            const cachedResource = await this._getFromIndexedDB(urlHash);

            if (!cachedResource || !cachedResource.data) {
                await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                    requestId: requestId,
                    error: 'Resource not available in IndexedDB'
                });
                return;
            }

            let blobData;
            if (cachedResource.data instanceof Blob) {
                blobData = cachedResource.data;
            } else {
                const contentType = cachedResource.contentType || this._getContentTypeFromUrl(url);
                if (typeof cachedResource.data === 'string') {
                    blobData = new Blob([cachedResource.data], { type: contentType });
                } else if (typeof cachedResource.data === 'object') {
                    const jsonStr = JSON.stringify(cachedResource.data);
                    blobData = new Blob([jsonStr], { type: contentType });
                } else {
                    throw new Error(`無法轉換為Blob: 不支持的數據類型 ${typeof cachedResource.data}`);
                }
            }

            await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                requestId: requestId,
                data: blobData,
                url: cachedResource.url,
            });

        } catch (error) {
            console.error(`[P2P處理請求] 處理請求失敗:`, error);
            try {
                await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                    requestId: requestId,
                    error: error.message || 'Unknown error'
                });
            } catch (sendError) {
                console.error('[P2P處理請求] 發送錯誤響應失敗:', sendError);
            }
        } finally {
            this.requestLocks.delete(lockKey);
        }
    }

    /**
     * 驗證內容類型是否匹配URL
     * @param {string} url - 資源URL
     * @param {string} contentType - 資源的內容類型
     * @returns {boolean} 是否匹配
     */
    _validateContentType(url, contentType) {
        if (!contentType) return true; // 沒有提供內容類型，跳過驗證

        const expectedType = this._getContentTypeFromUrl(url);

        // 主要檢查MIME類型的主類型是否匹配
        const expectedMainType = expectedType.split('/')[0];
        const actualMainType = contentType.split('/')[0];

        // 特殊處理JavaScript相關類型
        if (expectedMainType === 'application' && expectedType.includes('javascript')) {
            return contentType.includes('javascript') || contentType.includes('ecmascript');
        }

        return expectedMainType === actualMainType;
    }

    /**
     * 清理並關閉
     */
    close() {
        if (this.p2pManager) {
            this.p2pManager.close();
        }

        this.isReady = false;
        console.log('P2P客戶端已關閉');
    }
}