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
            // console.log('IndexedDB 打開成功');
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
 */
async function storeResource(urlHash, data, contentType, url) {
    try {
        let blobData;
        if (typeof data === 'string') {
            if (data.startsWith('data:')) {
                const response = await fetch(data);
                blobData = await response.blob();
            } else {
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
                    resolve(null);
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
 */
async function calculateHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function _isBootstrapResource(url) {
    const bootstrapPatterns = [
        'p2p_client.js',
        'p2p_manager.js',
        'indexdb-storage.js',
        'webstomp',
        'HomeView',
        'vue-vendor',
        'p2p-vendor'
    ];

    return bootstrapPatterns.some(pattern => url.includes(pattern));
}

// 安裝事件
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
    return self.clients.claim();
});

// 攔截所有的請求
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.protocol === 'ws:' || url.protocol === 'wss:' || url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        (async () => {
            try {
                const originalRequestUrl = event.request.url;
                const urlHash = await calculateHash(originalRequestUrl);
                const pathname = url.pathname;
                const isHtmlPage = pathname.endsWith('.html') ||
                    pathname === '/' ||
                    pathname.endsWith('/') ||
                    pathname.includes('/index');

                // 關鍵資源直接從網絡獲取
                if (isHtmlPage || _isBootstrapResource(originalRequestUrl)) {
                    console.log('Service Worker: 關鍵資源，從網絡獲取:', originalRequestUrl);
                    const criticalResponse = await fetch(event.request);
                    return new Response(criticalResponse.body, {
                        status: criticalResponse.status,
                        statusText: criticalResponse.statusText,
                        headers: {
                            ...Object.fromEntries(criticalResponse.headers.entries()),
                            'X-Resource-Source': 'NETWORK'
                        }
                    });
                }

                // 嘗試從 IndexedDB 獲取資源
                const resource = await getResource(urlHash);

                if (resource) {
                    console.log('Service Worker: 從 IndexedDB 返回資源:', originalRequestUrl);
                    return new Response(resource.data, {
                        headers: {
                            'Content-Type': resource.contentType,
                            'X-Resource-Source': 'CACHE'
                        }
                    });
                }

                console.log('Service Worker: 委託 p2p_client 獲取資源:', originalRequestUrl);

                // 獲取活動的客戶端窗口
                const client = await self.clients.get(event.clientId);

                if (client) {
                    const messageChannel = new MessageChannel();

                    const responsePromise = new Promise((resolve) => {
                        messageChannel.port1.onmessage = (msgEvent) => {
                            if (msgEvent.data.error) {
                                console.error('Service Worker: p2p_client 獲取資源失敗:', msgEvent.data.error);
                                resolve(networkFetchAndCache(originalRequestUrl));
                            } else {
                                console.log('Service Worker: 從 p2p_client 獲取資源成功');
                                const responseData = msgEvent.data.data;
                                let contentType = msgEvent.data.contentType;

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
                                    headers: {
                                        'Content-Type': contentType,
                                        'X-Resource-Source': 'P2P'
                                    }
                                }));
                            }
                        };
                        messageChannel.port1.start();
                    });

                    client.postMessage({
                        type: 'P2P_GET_RESOURCE',
                        url: originalRequestUrl
                    }, [messageChannel.port2]);

                    return await responsePromise;
                } else {
                    console.warn('Service Worker: 無法獲取活動客戶端窗口，直接從網絡獲取');
                    return networkFetchAndCache(originalRequestUrl);
                }
            } catch (error) {
                console.error('Service Worker: 處理請求過程中出錯:', error);
                const fallbackResponse = await fetch(event.request);
                return new Response(fallbackResponse.body, {
                    status: fallbackResponse.status,
                    statusText: fallbackResponse.statusText,
                    headers: {
                        ...Object.fromEntries(fallbackResponse.headers.entries()),
                        'X-Resource-Source': 'NETWORK'
                    }
                });
            }
        })()
    );
});

// 處理來自客戶端的消息
self.addEventListener('message', async (event) => {
    const { type, url, data, contentType } = event.data;

    if (type === 'CACHE_RESOURCE') {
        try {
            const urlHash = await calculateHash(url);
            let blobData;

            if (typeof data === 'string') {
                if (data.startsWith('data:')) {
                    const response = await fetch(data);
                    blobData = await response.blob();
                } else {
                    blobData = new Blob([data], { type: contentType || 'text/plain' });
                }
            } else if (data instanceof Blob) {
                blobData = data;
            } else {
                console.error('不支持的數據類型，無法存儲到 IndexedDB');
                return;
            }

            await storeResource(urlHash, blobData, contentType, url);
            // console.log('Service Worker: 已存入 IndexedDB 資源:', url);
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
        const request = new Request(url);
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.ok) {
            console.log('Service Worker: 從網路獲取成功:', url);

            const contentType = networkResponse.headers.get('Content-Type');
            const responseToCache = networkResponse.clone();

            try {
                const urlHash = await calculateHash(url);
                const blob = await responseToCache.blob();
                await storeResource(urlHash, blob, contentType, url);
                console.log('Service Worker: 已存入 IndexedDB 資源:', url);
                _notifyClientCacheReady(url, urlHash);
            } catch (cacheError) {
                console.error('Service Worker: 將網路回應存入 IndexedDB 失敗:', url, cacheError);
            }
        } else {
            console.warn('Service Worker: 網路回應無效，未存入 IndexedDB:', url, networkResponse.status);
        }

        // 創建帶有來源標頭的回應
        const responseWithHeaders = new Response(networkResponse.body, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers: {
                ...Object.fromEntries(networkResponse.headers.entries()),
                'X-Resource-Source': 'NETWORK'
            }
        });

        return responseWithHeaders;
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
                // console.log(`Service Worker: p2p_client 收到我有資源的通知 ACK，url: ${url}`);
            } else {
                console.warn(`Service Worker: 未收到 p2p_client ACK，url: ${url}`);
            }
        };

        client.postMessage({
            type: 'P2P_ANNOUNCE_RESOURCE',
            requestToCache: url,
            urlHash: urlHash
        }, [messageChannel.port2]);
    }
}