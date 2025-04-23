// src/p2p/indexdb-storage.js

const DB_NAME = 'p2pcdn_storage';
const DB_VERSION = 1;
const STORE_NAME = 'resources';

/**
 * 打開IndexedDB資料庫
 * @returns {Promise<IDBDatabase>} 資料庫實例
 */
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
 * 計算字串的 SHA-256 雜湊
 * @param {string} str - 要計算雜湊的字串
 * @returns {Promise<string>} 計算出的雜湊
 */
export async function calculateHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * 在 IndexedDB 中儲存資源
 * @param {string} urlHash - URL 雜湊值
 * @param {Blob|string} data - 資源數據
 * @param {string} contentType - 內容類型
 * @param {string} url - 資源URL
 * @returns {Promise<boolean>} 成功返回true
 */
export async function storeResource(urlHash, data, contentType, url) {
    try {
        // 將字串或 Data URI 轉換為 Blob（如果需要）
        let blobData;
        if (typeof data === 'string') {
            // 如果是 Data URI
            if (data.startsWith('data:')) {
                const response = await fetch(data);
                blobData = await response.blob();
            } else {
                // 普通字串（例如 JavaScript、CSS、HTML）
                blobData = new Blob([data], { type: contentType || 'text/plain' });
            }
        } else if (data instanceof Blob) {
            blobData = data;
        } else {
            throw new Error('不支持的數據類型，無法儲存到 IndexedDB');
        }

        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            // 使用 URL 雜湊作為鍵儲存資源
            const request = store.put({
                urlHash: urlHash,
                url: url,
                data: blobData,
                contentType: contentType || blobData.type || 'application/octet-stream',
                timestamp: Date.now()
            });

            request.onsuccess = () => {
                console.log('資源已存入IndexedDB:', url);
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('儲存資源失敗:', event.target.error);
                reject(new Error('儲存資源失敗: ' + event.target.error));
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('在 IndexedDB 中儲存資源時出錯:', error);
        throw error;
    }
}

/**
 * 從 IndexedDB 獲取資源
 * @param {string} urlHash - URL 雜湊值
 * @returns {Promise<Object|null>} 資源物件或null
 */
export async function getResource(urlHash) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.get(urlHash);

            request.onsuccess = (event) => {
                const resource = event.target.result;
                if (resource) {
                    console.log('從IndexedDB獲取資源成功:', urlHash);
                    resolve(resource);
                } else {
                    console.log('IndexedDB中找不到資源:', urlHash);
                    resolve(null); // 資源未找到
                }
            };

            request.onerror = (event) => {
                console.error('獲取資源失敗:', event.target.error);
                reject(new Error('獲取資源失敗: ' + event.target.error));
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('從 IndexedDB 獲取資源時出錯:', error);
        throw error;
    }
}

/**
 * 從 IndexedDB 刪除資源
 * @param {string} urlHash - URL 雜湊值
 * @returns {Promise<boolean>} 成功返回true
 */
export async function deleteResource(urlHash) {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const request = store.delete(urlHash);

            request.onsuccess = () => {
                console.log('從IndexedDB刪除資源成功:', urlHash);
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('刪除資源失敗:', event.target.error);
                reject(new Error('刪除資源失敗: ' + event.target.error));
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('從 IndexedDB 刪除資源時出錯:', error);
        throw error;
    }
}

/**
 * 獲取所有快取的資源
 * @returns {Promise<Array>} 資源列表
 */
export async function getAllResources() {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = (event) => {
                const resources = event.target.result;
                console.log(`從IndexedDB獲取了${resources.length}個資源`);
                resolve(resources);
            };

            request.onerror = (event) => {
                console.error('獲取所有資源失敗:', event.target.error);
                reject(new Error('獲取所有資源失敗: ' + event.target.error));
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('從 IndexedDB 獲取所有資源時出錯:', error);
        throw error;
    }
}

/**
 * 清除所有資源
 * @returns {Promise<boolean>} 成功返回true
 */
export async function clearAllResources() {
    try {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('清除所有資源成功');
                resolve(true);
            };

            request.onerror = (event) => {
                console.error('清除所有資源失敗:', event.target.error);
                reject(new Error('清除所有資源失敗: ' + event.target.error));
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.error('清除所有資源時出錯:', error);
        throw error;
    }
}