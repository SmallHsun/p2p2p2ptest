const DB_NAME = 'p2pcdn_storage';
const DB_VERSION = 1;
const STORE_NAME = 'resources';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('打開 IndexedDB 失敗:', event.target.error);
            reject(new Error('打開 IndexedDB 失敗: ' + event.target.error));
        };

        request.onsuccess = (event) => {
            console.log('IndexedDB 打開成功');
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'urlHash' });
                console.log('IndexedDB 資料表創建成功:', STORE_NAME);
            } else {
                console.log('IndexedDB 資料表已存在:', STORE_NAME);
            }
        };
    });
}

/**
 * 在 IndexedDB 中存儲資源
 * @param {string} urlHash - URL 哈希值
 * @param {Blob|string} data - 資源數據
 * @param {string} contentType - 內容類型
 * @param {string} url - 資源URL
 * @returns {Promise<boolean>} 成功返回true
 */
async function storeResource(urlHash, data, contentType, url) {
    try {
        // 將字符串或 Data URI 轉換為 Blob（如果需要）
        let blobData;
        if (typeof data === 'string') {
            // 如果是 Data URI
            if (data.startsWith('data:')) {
                const response = await fetch(data);
                blobData = await response.blob();
            } else {
                // 普通字符串（例如 JavaScript、CSS、HTML）
                blobData = new Blob([data], { type: contentType || 'text/plain' });
            }
        } else if (data instanceof Blob) {
            blobData = data;
        } else {
            throw new Error('不支持的數據類型，無法存儲到 IndexedDB');
        }

        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // 使用 URL 哈希作為鍵存儲資源
            const request = store.put({
                urlHash: urlHash,
                url: url,
                data: blobData,
                contentType: contentType || blobData.type || 'application/octet-stream',
                timestamp: Date.now()
            });

            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(new Error('存儲資源失敗: ' + event.target.error));

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('在 IndexedDB 中存儲資源時出錯:', error);
        throw error;
    }
}

/**
 * 從 IndexedDB 獲取資源
 * @param {string} urlHash - URL 哈希值
 * @returns {Promise<Object|null>} 資源對象或null
 */
async function getResource(urlHash) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(urlHash);

            request.onsuccess = (event) => {
                const resource = event.target.result;
                if (resource) {
                    resolve(resource);
                } else {
                    resolve(null); // 資源未找到
                }
            };

            request.onerror = (event) => reject(new Error('獲取資源失敗: ' + event.target.error));

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('從 IndexedDB 獲取資源時出錯:', error);
        throw error;
    }
}

/**
 * 從 IndexedDB 刪除資源
 * @param {string} urlHash - URL 哈希值
 * @returns {Promise<boolean>} 成功返回true
 */
async function deleteResource(urlHash) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.delete(urlHash);

            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(new Error('刪除資源失敗: ' + event.target.error));

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('從 IndexedDB 刪除資源時出錯:', error);
        throw error;
    }
}

/**
 * 計算字符串的 SHA-256 哈希
 * @param {string} str - 要計算哈希的字符串
 * @returns {Promise<string>} 計算出的哈希
 */
async function calculateHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


// 安裝事件 - 設置初始緩存
self.addEventListener('install', (event) => {
    console.log('Service Worker 正在安裝...');
    self.skipWaiting();
});

// 激活事件 - 接管控制
self.addEventListener('activate', (event) => {
    console.log('Service Worker 已激活');
    return self.clients.claim();
});


// 攔截所有的請求
self.addEventListener('fetch', (event) => {
    // 只處理 GET 請求
    if (event.request.method !== 'GET') return;

    // 忽略 WebSocket 連接和 API 請求
    const url = new URL(event.request.url);
    if (url.protocol === 'ws:' || url.protocol === 'wss:' || url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        (async () => {
            try {
                // 儲存原始URL，以便在回調中使用
                const originalRequestUrl = event.request.url;

                // 計算請求 URL 的哈希
                const urlHash = await calculateHash(originalRequestUrl);
                const pathname = url.pathname;
                const isHtmlPage = pathname.endsWith('.html') ||
                    pathname === '/' ||
                    pathname.endsWith('/') ||
                    pathname.includes('/index');

                // 如果是HTML頁面，我們直接從網絡獲取最新版本
                if (isHtmlPage) {
                    console.log('Service Worker: HTML頁面請求，從網絡獲取:', event.request.url);
                    return fetch(event.request);
                }
                // 嘗試從 IndexedDB 獲取資源
                const resource = await getResource(urlHash);

                if (resource) {
                    console.log('Service Worker: 從 IndexedDB 返回資源:', originalRequestUrl);
                    return new Response(resource.data, {
                        headers: { 'Content-Type': resource.contentType }
                    });
                }

                console.log('Service Worker: 委託 p2p_client 獲取資源:', originalRequestUrl);

                // 獲取活動的客戶端窗口
                const client = await self.clients.get(event.clientId);

                if (client) {
                    // 向客戶端發送消息，請求通過 p2p 網絡獲取資源
                    const messageChannel = new MessageChannel();

                    // 設置接收響應的處理函數
                    const responsePromise = new Promise((resolve) => {
                        messageChannel.port1.onmessage = (msgEvent) => {
                            if (msgEvent.data.error) {
                                console.error('Service Worker: p2p_client 獲取資源失敗:', msgEvent.data.error);
                                // 使用原始請求URL從網絡獲取
                                resolve(networkFetchAndCache(originalRequestUrl));
                            } else {
                                console.log('Service Worker: 從 p2p_client 獲取資源成功');
                                // 創建適當的響應對象 
                                const responseData = msgEvent.data.data;
                                const contentType = msgEvent.data.contentType;
                                if (!contentType) {
                                    const ext = originalRequestUrl.split('.').pop();
                                    switch (ext) {
                                        case 'js':
                                        case 'vue':
                                            contentType = 'application/javascript';
                                            break;
                                        case 'css':
                                            contentType = 'text/css';
                                            break;
                                        case 'html':
                                            contentType = 'text/html';
                                            break;
                                        case 'json':
                                            contentType = 'application/json';
                                            break;
                                        default:
                                            contentType = 'application/octet-stream';
                                    }
                                }
                                resolve(new Response(responseData, {
                                    headers: { 'Content-Type': contentType }
                                }));
                            }
                        };
                        messageChannel.port1.start();
                    });

                    // 發送請求消息給 p2p_client
                    client.postMessage({
                        type: 'P2P_GET_RESOURCE',
                        url: originalRequestUrl
                    }, [messageChannel.port2]);

                    // 等待並返回響應
                    return await responsePromise;
                } else {
                    console.warn('Service Worker: 無法獲取活動客戶端窗口，直接從網絡獲取');
                    return networkFetchAndCache(originalRequestUrl);
                }
            } catch (error) {
                console.error('Service Worker: 處理請求過程中出錯:', error);
                // 最後回退到網絡請求
                return fetch(event.request);
            }
        })()
    );
});


// 處理來自客戶端的消息
self.addEventListener('message', async (event) => {
    const { type, url, data, contentType } = event.data;

    if (type === 'CACHE_RESOURCE') {
        try {
            // 計算 URL 哈希值
            const urlHash = await calculateHash(url);

            // 根據數據類型處理
            let blobData;

            if (typeof data === 'string') {
                if (data.startsWith('data:')) {
                    // 如果是 Data URI
                    const response = await fetch(data);
                    blobData = await response.blob();
                } else {
                    // 字符串數據 (JavaScript, CSS, HTML等)
                    blobData = new Blob([data], { type: contentType || 'text/plain' });
                }
            } else if (data instanceof Blob) {
                blobData = data;
            } else {
                console.error('不支持的數據類型，無法存儲到 IndexedDB');
                return;
            }

            // 存儲到 IndexedDB
            await storeResource(urlHash, blobData, contentType, url);
            console.log('Service Worker: 已存入 IndexedDB 資源:', url);
        } catch (error) {
            console.error('Service Worker: 存入 IndexedDB 失敗:', error);
        }
    } else if (type === 'CLEAR_CACHE') {
        try {
            const urlHash = await calculateHash(url);
            await deleteResource(urlHash);
            console.log('Service Worker: 已從 IndexedDB 刪除資源:', url);
        } catch (error) {
            console.error('Service Worker: 從 IndexedDB 刪除資源失敗:', error);
        }
    }
});

async function networkFetchAndCache(url) {
    console.log('Service Worker: 從網絡獲取資源:', url);

    try {
        console.log('Service Worker: 從網絡獲取資源:', url);

        // 建立Request對象
        const request = new Request(url);

        // 發起網路請求
        const networkResponse = await fetch(request);

        // 檢查回應是否有效
        if (networkResponse && networkResponse.ok) {
            console.log('Service Worker: 從網路獲取成功:', url);

            // 獲取內容類型
            const contentType = networkResponse.headers.get('Content-Type');

            // 複製回應：一個用於 IndexedDB，一個用於返回給瀏覽器
            const responseToCache = networkResponse.clone();

            try {
                // 計算 URL 哈希
                const urlHash = await calculateHash(url);

                // 將回應轉換為 Blob
                const blob = await responseToCache.blob();

                // 存儲到 IndexedDB
                await storeResource(urlHash, blob, contentType, url);
                console.log('Service Worker: 已存入 IndexedDB 資源:', url);

                // 通知客戶端緩存就緒
                _notifyClientCacheReady(url, urlHash);
            } catch (cacheError) {
                console.error('Service Worker: 將網路回應存入 IndexedDB 失敗:', url, cacheError);
            }
        } else {
            console.warn('Service Worker: 網路回應無效，未存入 IndexedDB:', url, networkResponse.status);
        }

        // 返回原始的網路回應給瀏覽器
        return networkResponse;
    } catch (fetchError) {
        console.error('Service Worker: 網路請求 fetch 失敗:', url, fetchError);
        throw fetchError;
    }
}

// 通知客戶端緩存就緒
async function _notifyClientCacheReady(url, urlHash) {
    const clientsList = await self.clients.matchAll({ includeUncontrolled: true });

    for (const client of clientsList) {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = (event) => {
            if (event.data?.status === 'ack') {
                console.log(`Service Worker: p2p_client 收到我有資源的通知 ACK，url: ${url}`);
            } else {
                console.warn(`Service Worker: 未收到 p2p_client ACK，url: ${url}`);
            }
        };

        // 通知 client 我有資源了，可以註冊到協調器
        client.postMessage({
            type: 'P2P_ANNOUNCE_RESOURCE',
            requestToCache: url,
            urlHash: urlHash
        }, [messageChannel.port2]);
    }
}