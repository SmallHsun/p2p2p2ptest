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
        // 請求隊列和處理標記已移除

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

    // async getResourceP2POnly(url) {
    //     if (!this.isReady) {
    //         await this.init();
    //     }
    //     try {
    //         // 計算URL哈希作為內容哈希
    //         const urlHash = await calculateHash(url);
    //         console.log(`計算URL哈希: ${urlHash} 用於 ${url}`);
    //         // 直接嘗試從P2P網絡獲取
    //         try {
    //             const peers = await this._findPeersWithContent(urlHash);
    //             if (!peers || peers.length === 0) {
    //                 throw new Error('沒有可用的peer來提供此資源');
    //             }
    //             console.log(`[P2P客戶端] 找到 ${peers.length} 個具有資源 ${url} 的對等方`);
    //             // 按距離排序嘗試從對等方獲取資源
    //             for (const peer of peers) {
    //                 try {
    //                     await this.p2pManager.ensureConnected(peer.clientId);
    //                     console.log(`已與對等方 ${peer.clientId} 建立連接，開始請求資源 ${url}`);

    //                     const responseData = await this.p2pManager.requestResource(peer.clientId, url);
    //                     console.log(`從對等方 ${peer.clientId} 獲取資源成功: ${url}`, responseData);

    //                     const { data, Cacheurl } = responseData;

    //                     // 檢查數據類型
    //                     if (!(data instanceof Blob)) {
    //                         console.warn(`接收到的數據不是Blob: ${typeof data}`);

    //                         // 嘗試將非Blob數據轉換為Blob
    //                         let contentType = this._getContentTypeFromUrl(url);
    //                         let blobData;

    //                         if (typeof data === 'string') {
    //                             // 字符串轉為Blob
    //                             blobData = new Blob([data], { type: contentType });
    //                             console.log(`[P2P客戶端] 從字符串轉換為Blob: 大小=${blobData.size}字節`);
    //                         } else if (data && typeof data === 'object') {
    //                             // 嘗試將對象轉換為字符串，再轉為Blob
    //                             try {
    //                                 const jsonString = JSON.stringify(data);
    //                                 blobData = new Blob([jsonString], { type: contentType });
    //                                 console.log(`[P2P客戶端] 從對象轉換為Blob: 大小=${blobData.size}字節`);
    //                             } catch (e) {
    //                                 console.error('無法將對象轉換為JSON字符串:', e);
    //                                 throw new Error('數據格式錯誤');
    //                             }
    //                         } else {
    //                             throw new Error('不支持的數據類型');
    //                         }

    //                         // 緩存資源到IndexedDB
    //                         await this._cacheResource(Cacheurl || url, blobData);
    //                         console.log(`[P2P客戶端] 已緩存轉換後的Blob到IndexedDB: ${Cacheurl || url}`);

    //                         return blobData;
    //                     }

    //                     // 驗證URL哈希
    //                     const receivedHash = await calculateHash(Cacheurl || url);
    //                     if (receivedHash === urlHash) {
    //                         console.log(`[P2P客戶端] 收到的資源哈希 ${receivedHash} 與請求哈希 ${urlHash} 匹配`);
    //                         // 緩存資源到IndexedDB
    //                         await this._cacheResource(Cacheurl || url, data);
    //                         console.log(`[P2P客戶端] 已緩存Blob到IndexedDB: ${Cacheurl || url}`);

    //                         return data;
    //                     } else {
    //                         console.warn(`從對等方 ${peer.clientId} 獲取的資源哈希不匹配: 預期=${urlHash}, 實際=${receivedHash}`);
    //                     }
    //                 } catch (peerError) {
    //                     console.warn(`從對等方 ${peer.clientId} 獲取資源 ${url} 失敗:`, peerError);
    //                     // 繼續嘗試下一個對等方
    //                 }
    //             }

    //             throw new Error('嘗試所有對等方後仍無法獲取資源');
    //         } catch (p2pError) {
    //             console.warn('尋找擁有內容的對等方失敗:', p2pError);
    //             throw new Error('無可用的P2P資源');
    //         }
    //     } catch (error) {
    //         console.error(`獲取資源 ${url} 失敗:`, error);
    //         throw error;
    //     }
    // }
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

                // 選擇合適的節點
                let selectedPeer;

                if (resourceType === 'js' || resourceType === 'css') {
                    // JS/CSS 使用第一順位節點
                    selectedPeer = sortedPeers[0];
                    console.log(`[P2P客戶端] JS/CSS資源使用第一順位節點: ${selectedPeer.clientId}`);
                }
                else if (resourceType === 'image') {
                    // 圖片資源 - 使用圖片URL的哈希來選擇節點，實現分散效果
                    const imageHash = await calculateHash(url);
                    const hashNumber = parseInt(imageHash.substring(0, 8), 16);
                    const peerIndex = hashNumber % sortedPeers.length;
                    selectedPeer = sortedPeers[peerIndex];

                    console.log(`[P2P客戶端] 圖片資源使用分散式節點: ${selectedPeer.clientId} (索引: ${peerIndex}/${sortedPeers.length - 1})`);
                }
                else {
                    // 其他資源類型使用第一順位節點
                    selectedPeer = sortedPeers[0];
                    console.log(`[P2P客戶端] 其他資源類型使用第一順位節點: ${selectedPeer.clientId}`);
                }

                // 從選定的節點獲取資源
                try {
                    // 確保連接建立
                    await this.p2pManager.ensureConnected(selectedPeer.clientId);
                    console.log(`已與節點 ${selectedPeer.clientId} 建立連接，開始請求資源 ${url}`);

                    // 請求資源
                    const responseData = await this.p2pManager.requestResource(selectedPeer.clientId, url);
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
                        console.warn(`從節點 ${selectedPeer.clientId} 獲取的資源哈希不匹配: 預期=${urlHash}, 實際=${receivedHash}`);
                        throw new Error('資源哈希不匹配');
                    }
                } catch (selectedPeerError) {
                    console.warn(`從選定節點 ${selectedPeer.clientId} 獲取資源失敗:`, selectedPeerError);

                    // 嘗試其他節點作為備用
                    for (const peer of sortedPeers) {
                        // 跳過已嘗試的選定節點
                        if (peer.clientId === selectedPeer.clientId) continue;

                        try {
                            await this.p2pManager.ensureConnected(peer.clientId);
                            console.log(`嘗試從備用節點 ${peer.clientId} 獲取資源 ${url}`);

                            const responseData = await this.p2pManager.requestResource(peer.clientId, url);
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


    /**
     * 處理資源請求 - 直接傳送Blob
     */
    async _handleResourceRequest(peerId, requestData) {
        const url = requestData.url;
        // 使用接收到的請求ID
        const requestId = requestData.requestId || `legacy-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        // 獲取預期的內容類型（如果提供）
        const expectedContentType = requestData.expectedContentType;

        // 使用鎖機制，防止並發處理同一個請求
        const lockKey = `handle-${peerId}-${requestId}`;
        if (this.requestLocks.has(lockKey)) {
            console.warn(`[P2P處理請求] 警告: 已有相同資源請求正在處理中: ${url}`);
            await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                requestId: requestId,
                error: 'Resource request is already being processed'
            });
            return;
        }

        // 設置鎖
        this.requestLocks.set(lockKey, true);

        try {
            console.log(`[P2P處理請求] 步驟1: 處理來自 ${peerId} 的資源請求: ${url} (請求ID: ${requestId})`);

            // 計算URL哈希
            const urlHash = await this._calculateHash(url);
            console.log(`[P2P處理請求] 步驟2: 計算URL哈希: ${urlHash}`);

            // 從IndexedDB獲取資源
            console.log(`[P2P處理請求] 步驟3: 從IndexedDB獲取資源`);
            const cachedResource = await this._getFromIndexedDB(urlHash);

            if (!cachedResource || !cachedResource.data) {
                console.error(`[P2P處理請求] 錯誤: IndexedDB中找不到資源: ${url}, 哈希: ${urlHash}`);
                await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                    requestId: requestId,
                    error: 'Resource not available in IndexedDB'
                });
                // 釋放鎖
                this.requestLocks.delete(lockKey);
                return;
            }

            console.log(`[P2P處理請求] 步驟4: 從IndexedDB獲取到資源，準備發送給對等方 ${peerId}`);
            console.log(`[P2P處理請求] 資源信息: URL=${cachedResource.url}, 類型=${cachedResource.contentType}, 數據類型=${typeof cachedResource.data}, 是否為Blob=${cachedResource.data instanceof Blob}`);

            // 檢查內容類型是否與預期匹配
            if (expectedContentType && cachedResource.contentType) {
                const contentTypeValid = this._validateContentType(url, cachedResource.contentType);
                if (!contentTypeValid) {
                    console.warn(`[P2P處理請求] 警告: 內容類型不匹配: 預期=${expectedContentType}, 實際=${cachedResource.contentType}`);
                    // 記錄警告，但繼續發送（因為接收方會進行驗證）
                }
            }

            // 確保資源是Blob類型
            let blobData;
            if (cachedResource.data instanceof Blob) {
                blobData = cachedResource.data;
                console.log(`[P2P處理請求] 資源已是Blob類型, 大小=${blobData.size}字節`);
            } else {
                // 尝试转换为Blob
                try {
                    const contentType = cachedResource.contentType || this._getContentTypeFromUrl(url);
                    if (typeof cachedResource.data === 'string') {
                        blobData = new Blob([cachedResource.data], { type: contentType });
                    } else if (typeof cachedResource.data === 'object') {
                        const jsonStr = JSON.stringify(cachedResource.data);
                        blobData = new Blob([jsonStr], { type: contentType });
                    } else {
                        throw new Error(`無法轉換為Blob: 不支持的數據類型 ${typeof cachedResource.data}`);
                    }
                    console.log(`[P2P處理請求] 資源已轉換為Blob類型, 大小=${blobData.size}字節`);
                } catch (error) {
                    console.error(`[P2P處理請求] 轉換資源為Blob失敗:`, error);
                    throw error;
                }
            }

            // 直接發送Blob數據
            try {
                await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                    requestId: requestId,
                    data: blobData,
                    url: cachedResource.url,
                });
                console.log(`[P2P處理請求] 步驟5: 成功發送資源 ${url} 到對等方 ${peerId} (請求ID: ${requestId})`);
            } catch (sendError) {
                console.error(`[P2P處理請求] 錯誤: 發送資源到對等方 ${peerId} 失敗: ${sendError.message}`);
                throw sendError;
            }

        } catch (error) {
            console.error(`[P2P處理請求] 錯誤: 處理來自 ${peerId} 的資源請求失敗:`, error);

            try {
                // 發送錯誤響應
                await this.p2pManager.sendMessage(peerId, `resource-response:${url}`, {
                    requestId: requestId,
                    error: error.message || 'Unknown error'
                });
            } catch (sendError) {
                console.error('[P2P處理請求] 發送錯誤響應失敗:', sendError);
            }
        } finally {
            // 釋放鎖
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