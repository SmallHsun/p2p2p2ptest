export class P2PManager {

    constructor(signalingUrl, clientId) {
        this.signalingUrl = signalingUrl;
        this.clientId = clientId;
        this.peerConnections = new Map(); // 儲存所有P2P連接
        this.stompClient = null;
        this.isConnected = false;
        this.messageHandlers = new Map();
        this.iceServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
        ];

        // 活動資源請求追蹤
        this.activeResourceRequests = new Map(); // 請求ID -> 資源狀態

        // URL 到請求ID的映射，避免相同資源重複請求
        this.urlToRequestIdMap = new Map(); // URL -> 請求ID

        // 請求鎖，避免同時處理同一個請求
        this.requestLocks = new Map(); // 請求ID -> 鎖狀態

        // 全局傳輸狀態追蹤
        this.globalTransferState = {
            currentTransfers: new Set(), // 當前正在傳輸的請求ID集合
            maxConcurrentTransfers: 2    // 最大並發傳輸數
        };

        // 全局資源查找映射
        this.resourceUrlToRequestId = new Map(); // URL -> 請求ID，用於更可靠地找到請求

        // 資源元數據緩存，用於驗證
        this.resourceMetadata = new Map(); // URL -> 元數據（大小、類型等）

        // 事件監聽器
        this.eventListeners = new Map();

        // 新增: 追蹤下一個預期收到的Blob應該屬於哪個請求
        this.nextExpectedBlobRequestId = null;

        // 新增: Blob接收隊列，用於處理多個連續的Blob
        this.pendingBlobRequests = [];

        // 初始化消息處理器系統
        this._initializeMessageHandlers();
    }

    // 初始化消息處理器系統
    _initializeMessageHandlers() {
        // 初始化基礎消息類型的處理器陣列
        const basicMessageTypes = [
            'metadata-ack', 'blob-received', 'resource-received',
            'resource-metadata', 'blob-data-marker', 'blob-transfer-complete',
            'resource-request'
        ];

        for (const type of basicMessageTypes) {
            this.messageHandlers.set(type, []);
        }

        console.log(`[P2P消息] 已初始化消息處理器系統`);
    }

    // 生成更安全、包含更多信息的請求ID
    _generateRequestId(url, peerId) {
        // 提取URL的關鍵部分作為標識
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1] || 'file';
        const fileExtension = fileName.split('.').pop() || 'unknown';

        // 使用時間戳和隨機數增加唯一性
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);

        // 為不同類型的文件添加前綴，幫助調試和跟蹤
        const typePrefix = this._getFileTypePrefix(fileExtension);

        // 組合唯一的請求ID
        return `${typePrefix}-${fileName.substring(0, 10)}-${timestamp}-${randomStr}-${peerId.substring(0, 5)}`;
    }

    // 從URL獲取文件類型前綴
    _getFileTypePrefix(extension) {
        const extensionMap = {
            'js': 'script',
            'mjs': 'script',
            'jsx': 'script',
            'ts': 'script',
            'tsx': 'script',
            'css': 'style',
            'scss': 'style',
            'less': 'style',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'svg': 'image',
            'webp': 'image',
            'mp4': 'video',
            'webm': 'video',
            'ogg': 'audio',
            'mp3': 'audio',
            'wav': 'audio',
            'pdf': 'document',
            'docx': 'document',
            'xlsx': 'document',
            'json': 'data',
            'xml': 'data'
        };

        return extensionMap[extension.toLowerCase()] || 'resource';
    }

    // 從URL獲取內容類型
    _getContentTypeFromUrl(url) {
        // 提取URL的擴展名
        const extension = url.split('.').pop().toLowerCase();

        const contentTypes = {
            'vue': 'application/javascript',
            'js': 'application/javascript',
            'mjs': 'application/javascript',
            'jsx': 'application/javascript',
            'ts': 'application/javascript',
            'tsx': 'application/javascript',
            'css': 'text/css',
            'scss': 'text/css',
            'less': 'text/css',
            'html': 'text/html',
            'htm': 'text/html',
            'json': 'application/json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain',
            'xml': 'application/xml'
        };

        return contentTypes[extension] || 'application/octet-stream';
    }

    // 驗證內容類型是否匹配URL
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

    connect() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                resolve();
                return;
            }
            const socket = new WebSocket(this.signalingUrl);
            this.stompClient = webstomp.over(socket);
            this.stompClient.reconnect_delay = 5000; // 重連延遲

            // 連接到STOMP服務器
            this.stompClient.connect({},
                (frame) => {
                    console.log('已連接到STOMP服務器:', frame);
                    this.isConnected = true;
                    this.stompClient.send("/app/register", JSON.stringify({
                        clientId: this.clientId,
                        type: "REGISTER"
                    }));
                    // 訂閱客戶端專屬隊列
                    this.stompClient.subscribe(`/topic/signal.${this.clientId}`, message => {
                        const data = JSON.parse(message.body);
                        console.log('收到信令消息:', data);
                        this._handleSignalingMessage(data);
                    });

                    // 註冊全局通用消息處理器
                    this.registerMessageHandler('metadata-ack', (fromPeerId, ackData) => {
                        console.log(`[P2P消息] 收到元數據確認：`, ackData);
                    });

                    this.registerMessageHandler('blob-received', (fromPeerId, receiveData) => {
                        console.log(`[P2P消息] 收到Blob確認：`, receiveData);
                    });

                    this.registerMessageHandler('resource-received', (fromPeerId, receivedData) => {
                        console.log(`[P2P消息] 收到資源接收確認：`, receivedData);
                    });

                    resolve();
                },
                (error) => {
                    console.error('STOMP連接錯誤:', error);
                    reject(error);
                }
            );
        });
    }

    /**
     * 註冊消息處理器
     * @param {string} type - 消息類型
     * @param {Function} handler - 處理函數
     */
    registerMessageHandler(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }

        this.messageHandlers.get(type).push(handler);
        console.log(`[P2P消息] 已註冊消息處理器: ${type}, 當前處理器數量: ${this.messageHandlers.get(type).length}`);
    }

    // 請求資源方法，使用直接Blob傳輸
    requestResource(peerId, url) {
        return new Promise(async (resolve, reject) => {
            try {
                // 檢查是否已經有相同URL和對等方的請求在進行中
                const urlPeerKey = `${url}-${peerId}`;
                const existingRequestId = this.resourceUrlToRequestId.get(urlPeerKey);

                if (existingRequestId && this.activeResourceRequests.has(existingRequestId)) {
                    console.log(`[P2P請求] 已有相同資源的請求正在進行: ${url}, 請求ID: ${existingRequestId}`);
                    // 返回現有請求的Promise
                    const existingRequest = this.activeResourceRequests.get(existingRequestId);

                    return new Promise((res, rej) => {
                        existingRequest.additionalCallbacks = existingRequest.additionalCallbacks || [];
                        existingRequest.additionalCallbacks.push({ resolve: res, reject: rej });
                    });
                }

                // 創建唯一請求ID
                const requestId = this._generateRequestId(url, peerId);
                console.log(`[P2P請求] 步驟1: 開始請求資源 ${url} 從 ${peerId} (請求ID: ${requestId})`);

                // 保存URL到請求ID的映射，用於更容易找到請求
                this.resourceUrlToRequestId.set(urlPeerKey, requestId);

                // 創建請求鎖，防止同一個請求被同時處理
                this.requestLocks.set(requestId, true);

                // 確保連接已建立
                await this.ensureConnected(peerId);

                const peerInfo = this.peerConnections.get(peerId);
                if (!peerInfo || !peerInfo.dataChannel || peerInfo.dataChannel.readyState !== 'open') {
                    throw new Error(`數據通道未打開或狀態異常: ${peerInfo?.dataChannel?.readyState || '無數據通道'}`);
                }

                console.log(`[P2P請求] 步驟2: 數據通道狀態檢查通過，狀態為: ${peerInfo.dataChannel.readyState}`);

                // 設置請求超時 (60秒)
                const timeout = setTimeout(() => {
                    console.error(`[P2P請求] 錯誤: 向 ${peerId} 請求資源 ${url} 超時`);
                    this._cleanupRequest(requestId, new Error('請求資源超時(60秒)'));
                }, 60000);

                // 獲取並存儲資源的預期內容類型
                const expectedContentType = this._getContentTypeFromUrl(url);

                // 資源接收狀態初始化，添加預期內容類型
                const resourceState = {
                    id: requestId,
                    url: url,
                    peerId: peerId,
                    contentType: null,
                    expectedContentType: expectedContentType, // 預期內容類型
                    receivedMetadata: false,
                    lastActivityTime: Date.now(),
                    resolve: (data) => {
                        // 主回調
                        resolve(data);

                        // 處理其他回調
                        if (resourceState.additionalCallbacks && resourceState.additionalCallbacks.length > 0) {
                            for (const callback of resourceState.additionalCallbacks) {
                                callback.resolve(data);
                            }
                        }
                    },
                    reject: (error) => {
                        // 主回調
                        reject(error);

                        // 處理其他回調
                        if (resourceState.additionalCallbacks && resourceState.additionalCallbacks.length > 0) {
                            for (const callback of resourceState.additionalCallbacks) {
                                callback.reject(error);
                            }
                        }
                    },
                    timeout: timeout,
                    additionalCallbacks: [],
                    contentChecked: false, // 標記內容類型是否已檢查
                    blobReceived: false,   // 標記是否接收到Blob數據
                    blobData: null,        // 用於存儲接收到的Blob數據
                    readyToResolve: false, // 標記是否準備好解析Promise
                    waitingForBlob: false  // 新增: 標記是否正在等待接收Blob
                };

                // 儲存到活動請求映射
                this.activeResourceRequests.set(requestId, resourceState);
                console.log(`[P2P請求] 步驟3: 創建資源請求狀態 (請求ID: ${requestId})`);

                // 設置特殊處理函數用於接收Blob數據
                this._setupBlobReceiveHandler(peerId, requestId);

                // 將該請求添加到全局傳輸狀態
                this.globalTransferState.currentTransfers.add(requestId);

                // 發送請求
                try {
                    await this.sendMessage(peerId, 'resource-request', {
                        url: url,
                        requestId: requestId,
                        expectedContentType: expectedContentType // 發送預期的內容類型
                    });
                    console.log(`[P2P請求] 步驟4: 請求消息已發送 (請求ID: ${requestId})`);
                } catch (error) {
                    console.error(`[P2P請求] 錯誤: 發送請求失敗:`, error);
                    this._cleanupRequest(requestId, error);
                    throw error;
                }

                // 設置請求活動監控
                this._startRequestMonitoring(requestId);

            } catch (error) {
                console.error(`[P2P請求] 錯誤: 請求資源過程中出錯:`, error);
                reject(error);
            }
        });
    }

    // 為接收Blob數據設置特殊處理函數
    _setupBlobReceiveHandler(peerId, requestId) {
        const request = this.activeResourceRequests.get(requestId);
        if (!request) return;

        console.log(`[P2P調試] 為請求 ${requestId} 設置Blob接收處理器`);

        // 添加處理器處理資源元數據
        this.registerMessageHandler('resource-metadata', (fromPeerId, metaData) => {
            // 檢查請求ID是否匹配
            if (metaData.requestId !== requestId) {
                console.log(`[P2P調試] 收到的元數據請求ID ${metaData.requestId} 與當前處理器的請求ID ${requestId} 不匹配`);
                return false;
            }

            // 檢查發送者是否匹配
            if (request.peerId !== fromPeerId) {
                console.warn(`[P2P請求] 警告: 收到來自非請求目標的元數據 ${fromPeerId}, 預期 ${request.peerId}`);
                return false;
            }

            console.log(`[P2P請求] 收到資源元數據 (請求ID: ${requestId}): 類型=${metaData.contentType}, 大小=${metaData.size}`);

            // 驗證內容類型，確保與URL預期類型匹配
            if (metaData.contentType && request.expectedContentType) {
                const contentTypeValid = this._validateContentType(request.url, metaData.contentType);
                if (!contentTypeValid) {
                    console.warn(`[P2P請求] 警告: 內容類型不匹配 (請求ID: ${requestId}): 預期=${request.expectedContentType}, 收到=${metaData.contentType}`);
                    // 不立即失敗，但標記為需要額外驗證
                    request.contentMismatch = true;
                }
                request.contentChecked = true;
            }

            // 更新請求狀態
            request.contentType = metaData.contentType;
            request.expectedSize = metaData.size;
            request.receivedMetadata = true;
            request.lastActivityTime = Date.now();

            // 標記此請求正在等待Blob數據
            request.waitingForBlob = true;

            // 將此請求添加到等待Blob的請求隊列
            this.pendingBlobRequests.push(requestId);

            // 發送確認接收元數據
            try {
                console.log(`[P2P調試] 準備向 ${fromPeerId} 發送請求ID為 ${requestId} 的元數據確認`);

                this.sendMessage(fromPeerId, 'metadata-ack', {
                    requestId: requestId,
                    status: 'received',
                    readyForBlob: true
                }).then(() => {
                    console.log(`[P2P請求] 已發送元數據確認並請求Blob數據 (請求ID: ${requestId})`);
                    console.log(`[P2P調試] 已向 ${fromPeerId} 發送請求ID為 ${requestId} 的元數據確認`);
                }).catch(err => {
                    console.error(`[P2P請求] 發送元數據確認失敗:`, err);
                });
            } catch (error) {
                console.error(`[P2P請求] 發送元數據確認錯誤:`, error);
            }

            // 返回 false 表示這不是一次性處理器，應該保留
            return false;
        });

        // 處理Blob資料標記消息 - 新增
        this.registerMessageHandler('blob-data-marker', (fromPeerId, markerData) => {
            if (markerData.requestId !== requestId) return false;

            console.log(`[P2P請求] 收到Blob資料標記 (請求ID: ${requestId}): 大小=${markerData.size}`);

            // 更新請求狀態
            const req = this.activeResourceRequests.get(requestId);
            if (req) {
                req.waitingForBlob = true;
                req.lastActivityTime = Date.now();

                // 設置預期大小 - 關鍵!
                req.expectedSize = markerData.size;
                console.log(`[P2P請求] 設置請求 ${requestId} 的預期Blob大小: ${markerData.size}字節`);

                // 將此請求ID設為下一個預期接收Blob的請求
                this.nextExpectedBlobRequestId = requestId;
            }

            return false;
        });

        // 處理Blob傳輸完成通知
        this.registerMessageHandler('blob-transfer-complete', (fromPeerId, completeData) => {
            // 檢查請求ID是否匹配
            if (completeData.requestId !== requestId) return false;

            console.log(`[P2P請求] 收到Blob傳輸完成消息 (請求ID: ${requestId})`);

            // 檢查是否已接收到Blob數據
            if (request.blobReceived && request.blobData) {
                // 解析Promise並完成請求
                this._resolveResourceRequest(requestId);
            } else {
                console.warn(`[P2P請求] 收到傳輸完成消息但尚未接收到Blob數據 (請求ID: ${requestId})`);
                // 標記為準備好解析，等待Blob數據接收後立即解析
                request.readyToResolve = true;

                // 如果在傳輸完成消息後10秒內還沒收到Blob，判斷為失敗
                setTimeout(() => {
                    const req = this.activeResourceRequests.get(requestId);
                    if (req && !req.blobReceived && req.readyToResolve) {
                        console.error(`[P2P請求] 等待Blob數據超時 (請求ID: ${requestId})`);
                        this._cleanupRequest(requestId, new Error('接收Blob數據超時'));
                    }
                }, 10000);
            }

            // 返回 true 表示這是一次性處理器，處理完就可以移除了
            return true;
        });
    }

    // 處理接收到的Blob數據 - 新方法
    _processBlobReceived(requestId, blob) {
        const request = this.activeResourceRequests.get(requestId);
        if (!request) {
            console.warn(`[P2P請求] 警告: 找不到對應的請求 ${requestId} 來處理收到的Blob`);
            return;
        }

        console.log(`[P2P請求] 處理接收到的Blob數據 (請求ID: ${requestId}): 大小=${blob.size}字節`);

        // 更新請求狀態
        request.blobReceived = true;
        request.blobData = blob;
        request.lastActivityTime = Date.now();

        // 發送Blob接收確認
        this.sendMessage(request.peerId, 'blob-received', {
            requestId: requestId,
            size: blob.size,
            status: 'success'
        }).catch(err => console.error(`[P2P請求] 發送Blob接收確認失敗:`, err));

        // 如果已經收到了傳輸完成消息，可以立即解析
        if (request.readyToResolve) {
            this._resolveResourceRequest(requestId);
        }
    }

    // 解析資源請求
    _resolveResourceRequest(requestId) {
        const request = this.activeResourceRequests.get(requestId);
        if (!request) return;

        try {
            console.log(`[P2P請求] 解析資源請求 (請求ID: ${requestId}), Blob大小: ${request.blobData.size}`);

            // 驗證資源
            if (request.expectedSize && request.blobData.size !== request.expectedSize) {
                console.warn(`[P2P請求] 警告: Blob大小不匹配: 預期=${request.expectedSize}, 實際=${request.blobData.size}`);
            }

            // 確定內容類型
            let contentType = request.contentType || this._getContentTypeFromUrl(request.url);

            // 解析Promise
            request.resolve({
                data: request.blobData,
                Cacheurl: request.url
            });

            // 發送確認到發送方
            this.sendMessage(request.peerId, 'resource-received', {
                requestId: requestId,
                url: request.url,
                status: 'success',
                contentSize: request.blobData.size,
                contentType: contentType
            }).catch(err => console.warn(`[P2P請求] 發送資源接收確認失敗:`, err));

            // 清理請求
            this._cleanupRequest(requestId);

            console.log(`[P2P請求] 資源請求已成功解析 (請求ID: ${requestId})`);
        } catch (error) {
            console.error(`[P2P請求] 解析資源請求失敗:`, error);
            if (request.reject) {
                request.reject(error);
            }
            this._cleanupRequest(requestId);
        }
    }

    // 請求監控，檢測長時間無活動的請求
    _startRequestMonitoring(requestId) {
        const checkInterval = setInterval(() => {
            const request = this.activeResourceRequests.get(requestId);
            if (!request) {
                clearInterval(checkInterval);
                return;
            }

            // 檢查自上次活動以來的時間
            const now = Date.now();
            const inactiveDuration = now - request.lastActivityTime;

            // 如果超過30秒無活動，視為請求失敗
            if (inactiveDuration > 30000) {
                console.error(`[P2P請求] 錯誤: 請求 ${requestId} 已有 ${Math.round(inactiveDuration / 1000)}秒 無活動，中止請求`);
                this._cleanupRequest(requestId, new Error('傳輸長時間無活動'));
                clearInterval(checkInterval);
            }
        }, 5000); // 每5秒檢查一次

        // 將監控間隔保存到請求中，以便在清理時取消
        const request = this.activeResourceRequests.get(requestId);
        if (request) {
            request.monitorInterval = checkInterval;
        }
    }

    // 清理請求方法
    _cleanupRequest(requestId, error) {
        const request = this.activeResourceRequests.get(requestId);
        if (!request) return;

        console.log(`[P2P請求] 清理請求資源 (請求ID: ${requestId})`);

        // 取消超時計時器
        if (request.timeout) {
            clearTimeout(request.timeout);
        }

        // 取消監控間隔
        if (request.monitorInterval) {
            clearInterval(request.monitorInterval);
        }

        // 從全局傳輸狀態中移除
        this.globalTransferState.currentTransfers.delete(requestId);

        // 釋放請求鎖
        this.requestLocks.delete(requestId);

        // 清理URL到請求ID的映射
        const urlPeerKey = `${request.url}-${request.peerId}`;
        this.resourceUrlToRequestId.delete(urlPeerKey);

        // 從等待Blob的請求隊列中移除
        const index = this.pendingBlobRequests.indexOf(requestId);
        if (index !== -1) {
            this.pendingBlobRequests.splice(index, 1);
        }

        // 如果這是下一個預期接收Blob的請求，清除它
        if (this.nextExpectedBlobRequestId === requestId) {
            this.nextExpectedBlobRequestId = null;
        }

        // 如果提供了錯誤且請求尚未解決，則拒絕請求
        if (error && request.reject) {
            request.reject(error);
        }

        // 從活動請求中移除
        this.activeResourceRequests.delete(requestId);
    }

    /**
     * 向對等方發送消息
     */
    async sendMessage(peerId, type, data) {
        try {
            // 確保連接已建立
            await this.ensureConnected(peerId);

            const peerInfo = this.peerConnections.get(peerId);
            if (!peerInfo || !peerInfo.dataChannel || peerInfo.dataChannel.readyState !== 'open') {
                return Promise.reject(new Error(`數據通道未打開，當前狀態: ${peerInfo?.dataChannel?.readyState || '無數據通道'}`));
            }

            return new Promise((resolve, reject) => {
                try {
                    // 檢查是否是資源響應，並且數據是Blob類型
                    if ((type === 'resource-response' || type.startsWith('resource-response:')) && data.data instanceof Blob) {
                        const requestId = data.requestId || 'unknown';
                        console.log(`[P2P傳輸] 發送資源Blob數據到 ${peerId} (請求ID: ${requestId})`);

                        // 獲取實際URL（從type中提取，或使用data.url）
                        let resourceUrl = data.url;
                        if (type.startsWith('resource-response:')) {
                            resourceUrl = type.substring('resource-response:'.length);
                        }

                        // 使用直接Blob傳輸方法
                        this._sendBlobDirectly(peerId, resourceUrl, data.data, data.requestId)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        // 普通 JSON 消息
                        const message = {
                            type,
                            data
                        };

                        // 檢測緩衝區是否過大
                        if (peerInfo.dataChannel.bufferedAmount > 1024 * 1024) { // 1MB
                            console.warn(`[P2P傳輸] 警告: 數據通道緩衝區過大 (${peerInfo.dataChannel.bufferedAmount} 字節)，等待清空...`);
                            setTimeout(() => {
                                peerInfo.dataChannel.send(JSON.stringify(message));
                                resolve();
                            }, 500);
                        } else {
                            peerInfo.dataChannel.send(JSON.stringify(message));
                            resolve();
                        }
                    }
                } catch (error) {
                    console.error('[P2P傳輸] 發送消息失敗:', error);
                    reject(error);
                }
            });
        } catch (error) {
            console.error('[P2P傳輸] 發送消息前建立連接失敗:', error);
            return Promise.reject(error);
        }
    }

    /**
     * 直接發送Blob數據，不進行分片 - 改進版
     */
    async _sendBlobDirectly(peerId, url, blob, requestId) {
        // 使用鎖機制，防止同時處理同一個請求
        const lockKey = `send-${peerId}-${requestId || url}`;
        if (this.requestLocks.has(lockKey)) {
            console.warn(`[P2P傳輸] 警告: 已有相同資源發送請求進行中: ${url}`);
            return Promise.reject(new Error('資源正在發送中，請稍後再試'));
        }

        // 設置鎖
        this.requestLocks.set(lockKey, true);

        try {
            console.log(`[P2P傳輸] 開始直接發送Blob資源: ${url} 到 ${peerId} (請求ID: ${requestId || '未知'}), 大小: ${blob.size}字節, 類型: ${blob.type}`);

            // 確保連接已建立
            await this.ensureConnected(peerId);

            const peerInfo = this.peerConnections.get(peerId);
            if (!peerInfo || !peerInfo.dataChannel || peerInfo.dataChannel.readyState !== 'open') {
                throw new Error(`數據通道未打開或狀態異常: ${peerInfo?.dataChannel?.readyState || '無數據通道'}`);
            }

            // 1. 首先發送元數據
            const contentType = blob.type || this._getContentTypeFromUrl(url);

            // 發送元數據
            const metadata = {
                requestId: requestId,
                resourceUrl: url,
                contentType: contentType,
                size: blob.size
            };

            peerInfo.dataChannel.send(JSON.stringify({
                type: 'resource-metadata',
                data: metadata
            }));

            console.log(`[P2P傳輸] 元數據已發送，等待確認`);

            // 2. 等待元數據確認 - 改進版
            const metadataAckPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('等待元數據確認超時'));
                }, 10000);

                // 創建一次性處理器
                const oneTimeHandler = (fromPeerId, ackData) => {
                    if (fromPeerId === peerId && ackData.requestId === requestId) {
                        clearTimeout(timeout);
                        console.log(`[P2P傳輸] 收到元數據確認: `, ackData);
                        resolve(ackData);
                        return true; // 表示這是一次性處理器，可以移除
                    }
                    return false; // 不匹配，保留
                };

                // 添加到處理器列表
                this.registerMessageHandler('metadata-ack', oneTimeHandler);

                // 設置自動清理，防止內存洩漏
                setTimeout(() => {
                    const handlers = this.messageHandlers.get('metadata-ack');
                    if (handlers) {
                        const index = handlers.indexOf(oneTimeHandler);
                        if (index !== -1) {
                            handlers.splice(index, 1);
                        }
                    }
                }, 15000); // 15秒後自動清理
            });

            try {
                const ackResult = await metadataAckPromise;

                // 確認對方已準備好接收Blob
                if (!ackResult.readyForBlob) {
                    throw new Error('對方未準備好接收Blob數據');
                }
            } catch (ackError) {
                console.error(`[P2P傳輸] 元數據確認失敗:`, ackError);
                throw ackError;
            }

            // 3. 發送Blob標記消息 - 改進：先發送標記訊息
            console.log(`[P2P傳輸] 發送Blob標記消息 (請求ID: ${requestId})`);
            peerInfo.dataChannel.send(JSON.stringify({
                type: 'blob-data-marker',
                data: {
                    requestId: requestId,
                    url: url,
                    size: blob.size,
                    contentType: contentType
                }
            }));

            // 等待一小段時間確保對方準備好接收
            await new Promise(r => setTimeout(r, 500));

            // 4. 發送Blob數據
            console.log(`[P2P傳輸] 開始發送Blob數據，大小: ${blob.size}字節 (請求ID: ${requestId})`);

            // 發送前檢查數據通道緩衝區
            if (peerInfo.dataChannel.bufferedAmount > 1024 * 1024) { // 1MB
                console.log(`[P2P傳輸] 等待緩衝區清空，當前: ${peerInfo.dataChannel.bufferedAmount} 字節`);
                await new Promise(resolve => {
                    const checkBuffer = () => {
                        if (peerInfo.dataChannel.bufferedAmount < 500 * 1024) { // 500KB
                            resolve();
                        } else {
                            setTimeout(checkBuffer, 100);
                        }
                    };
                    checkBuffer();
                });
            }

            // 直接發送整個Blob
            peerInfo.dataChannel.send(blob);
            console.log(`[P2P傳輸] Blob數據已發送 (請求ID: ${requestId})`);

            // 5. 等待Blob接收確認 - 添加重試機制
            let blobReceived = false;
            let retryCount = 0;

            while (!blobReceived && retryCount < 3) {
                try {
                    const blobReceivePromise = new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error('等待Blob接收確認超時'));
                        }, 10000); // 10秒超時

                        // 創建一次性處理器
                        const oneTimeHandler = (fromPeerId, receiveData) => {
                            if (fromPeerId === peerId && receiveData.requestId === requestId) {
                                clearTimeout(timeout);
                                console.log(`[P2P傳輸] 收到Blob接收確認: `, receiveData);
                                resolve(receiveData);
                                return true; // 表示這是一次性處理器，可以移除
                            }
                            return false; // 不匹配，保留
                        };

                        // 添加到處理器列表
                        this.registerMessageHandler('blob-received', oneTimeHandler);
                    });

                    const receiveResult = await blobReceivePromise;
                    blobReceived = true;
                } catch (receiveError) {
                    retryCount++;
                    console.warn(`[P2P傳輸] 等待Blob接收確認失敗 (重試 ${retryCount}/3): ${receiveError.message}`);

                    if (retryCount < 3) {
                        // 短暫延遲後重試
                        await new Promise(r => setTimeout(r, 1000));

                        // 直接繼續下一步，不再重試Blob接收確認
                        // 我們會在稍後發送傳輸完成消息
                    }
                }
            }

            // 即使沒有收到Blob接收確認，也發送傳輸完成消息
            // 因為可能是確認消息丟失，而不是Blob數據丟失

            // 6. 發送傳輸完成消息
            console.log(`[P2P傳輸] 發送傳輸完成消息 (請求ID: ${requestId})`);
            peerInfo.dataChannel.send(JSON.stringify({
                type: 'blob-transfer-complete',
                data: {
                    requestId: requestId,
                    url: url,
                    status: blobReceived ? 'confirmed' : 'unconfirmed'
                }
            }));

            console.log(`[P2P傳輸] 資源 ${url} 傳輸完成 (請求ID: ${requestId})`);

            // 釋放鎖
            this.requestLocks.delete(lockKey);

            return true;
        } catch (error) {
            console.error(`[P2P傳輸] 錯誤: 資源直接發送失敗:`, error);
            // 釋放鎖
            this.requestLocks.delete(lockKey);
            throw error;
        }
    }

    /**
     * 處理來自對等方的消息 - 改進版
     */
    _handlePeerMessage(peerId, message) {
        try {
            const { type, data } = message;

            // 獲取處理器陣列
            const handlers = this.messageHandlers.get(type);

            if (handlers && handlers.length > 0) {
                console.log(`[P2P消息] 調用 ${type} 類型的 ${handlers.length} 個處理器`);

                // 複製陣列以防止迭代過程中的修改
                const handlersToExecute = [...handlers];

                for (let i = 0; i < handlersToExecute.length; i++) {
                    try {
                        // 調用處理器
                        const handler = handlersToExecute[i];
                        const result = handler(peerId, data);

                        // 如果處理器返回 true，表示這是一次性處理器，需要移除
                        if (result === true) {
                            const index = handlers.indexOf(handler);
                            if (index !== -1) {
                                handlers.splice(index, 1);
                                console.log(`[P2P消息] 移除一次性處理器: ${type}`);
                            }
                        }
                    } catch (handlerError) {
                        console.error(`[P2P消息] 處理器執行錯誤:`, handlerError);
                    }
                }
            } else {
                console.log(`[P2P消息] 未找到類型為 ${type} 的消息處理器`);
            }

            // 特殊處理資源響應消息
            if (type.startsWith('resource-response:')) {
                // 提取URL和對應的請求ID
                const url = type.substring('resource-response:'.length);
                const requestKey = `${url}-${peerId}`;
                const requestId = this.resourceUrlToRequestId.get(requestKey);

                if (requestId && this.activeResourceRequests.has(requestId)) {
                    console.log(`[P2P消息] 處理資源響應: ${url} (請求ID: ${requestId})`);

                    const request = this.activeResourceRequests.get(requestId);

                    // 處理錯誤響應
                    if (data.error) {
                        console.error(`[P2P消息] 收到錯誤響應: ${data.error}`);
                        this._cleanupRequest(requestId, new Error(data.error));
                        return;
                    }

                    // 處理資源數據
                    if (data.data) {
                        console.log(`[P2P消息] 收到資源數據响應: 類型=${typeof data.data}, 是否Blob=${data.data instanceof Blob}`);

                        // 驗證內容類型
                        if (data.data instanceof Blob && request.expectedContentType) {
                            const contentValid = this._validateContentType(request.url, data.data.type);
                            if (!contentValid) {
                                console.warn(`[P2P消息] 警告: 收到的資源內容類型與URL不匹配: ${data.data.type}`);
                                // 標記內容不匹配
                                request.contentMismatch = true;
                            }
                        }

                        // 確保數據有效
                        if (data.data) {
                            request.resolve({
                                data: data.data,
                                Cacheurl: data.url || url
                            });
                            this._cleanupRequest(requestId);
                            return;
                        }
                    }
                } else {
                    console.warn(`[P2P消息] 找不到對應的資源請求: ${url}`);
                }
            }

            // 觸發消息事件
            this._dispatchEvent('message', { peerId, type, data });
        } catch (error) {
            console.error(`[P2P消息] 處理來自 ${peerId} 的消息時出錯:`, error);
        }
    }

    /**
     * 處理接收到的Blob數據
     */
    _handleReceivedBlob(peerId, blob) {
        console.log(`[P2P數據通道] 收到Blob數據: ${blob.size} 字節, 類型: ${blob.type || '未指定'}`);

        // 1. 優先使用大小匹配尋找請求
        let matchedBySize = false;
        for (const [requestId, request] of this.activeResourceRequests.entries()) {
            if (request.waitingForBlob &&
                request.expectedSize === blob.size &&
                request.peerId === peerId) {

                console.log(`[P2P數據通道] 根據大小匹配(${blob.size}字節)找到請求: ${requestId}`);
                this._processBlobReceived(requestId, blob);
                matchedBySize = true;

                // 如果這是當前預期的Blob，清除預期
                if (this.nextExpectedBlobRequestId === requestId) {
                    this.nextExpectedBlobRequestId = null;
                }

                // 從等待隊列中移除
                const index = this.pendingBlobRequests.indexOf(requestId);
                if (index !== -1) {
                    this.pendingBlobRequests.splice(index, 1);
                }

                return;
            }
        }

        // 2. 如果無法通過大小匹配，嘗試使用預期的請求ID
        if (!matchedBySize && this.nextExpectedBlobRequestId) {
            const request = this.activeResourceRequests.get(this.nextExpectedBlobRequestId);

            if (request && request.waitingForBlob) {
                console.log(`[P2P數據通道] 使用預期請求ID關聯Blob: ${this.nextExpectedBlobRequestId}`);
                console.warn(`[P2P數據通道] 警告: Blob大小不匹配 - 預期=${request.expectedSize}, 實際=${blob.size}`);

                this._processBlobReceived(this.nextExpectedBlobRequestId, blob);
                this.nextExpectedBlobRequestId = null;
                return;
            }
        }

        // 3. 如果上述方法都失敗，使用等待隊列
        if (this.pendingBlobRequests.length > 0) {
            const requestId = this.pendingBlobRequests.shift();
            const request = this.activeResourceRequests.get(requestId);

            if (request && request.waitingForBlob) {
                console.log(`[P2P數據通道] 使用隊列中的第一個請求: ${requestId}`);
                console.warn(`[P2P數據通道] 警告: Blob大小不匹配 - 預期=${request.expectedSize}, 實際=${blob.size}`);

                this._processBlobReceived(requestId, blob);
                return;
            }
        }

        // 4. 最後嘗試任何等待Blob的請求
        for (const [reqId, req] of this.activeResourceRequests.entries()) {
            if (req.waitingForBlob && !req.blobReceived && req.peerId === peerId) {
                console.log(`[P2P數據通道] 使用任何等待中的請求: ${reqId}`);
                console.warn(`[P2P數據通道] 警告: Blob大小不匹配 - 預期=${req.expectedSize}, 實際=${blob.size}`);

                this._processBlobReceived(reqId, blob);
                return;
            }
        }

        console.warn(`[P2P數據通道] 收到Blob但找不到匹配的請求，無法處理: ${blob.size}字節`);
    }

    _handleSignalingMessage(data) {
        try {
            switch (data.type) {
                case 'offer':
                    this._handleOffer(data);
                    break;
                case 'answer':
                    this._handleAnswer(data);
                    break;
                case 'ice-candidate':
                    this._handleIceCandidate(data);
                    break;
                default:
                    console.warn('[P2P信令] 收到未知類型的信令消息:', data.type);
            }
        } catch (error) {
            console.error('[P2P信令] 處理信令消息時出錯:', error);
        }
    }

    async _handleOffer(data) {
        console.log(`[P2P信令] 收到來自 ${data.sender} 的offer`);

        try {
            // 檢查是否已存在連接
            let peerInfo = this.peerConnections.get(data.sender);
            let peerConnection;

            if (!peerInfo) {
                console.log(`[P2P信令] 為 ${data.sender} 創建新的連接`);
                peerConnection = this._createPeerConnection(data.sender);
                // _createPeerConnection 會自動將 peerConnection 存入 Map
                peerInfo = this.peerConnections.get(data.sender);
            } else {
                console.log(`[P2P信令] 使用現有連接 ${data.sender}`);
                peerConnection = peerInfo.connection;

                // 檢查信令狀態
                console.log(`[P2P信令] 現有連接狀態: ${peerConnection.signalingState}`);

                // 如果已經在處理交涉或處於非穩定狀態，先重置連接
                if (peerConnection.signalingState !== 'stable') {
                    console.log(`[P2P信令] 連接不在穩定狀態，嘗試重置連接`);
                    try {
                        // 嘗試回到穩定狀態
                        await peerConnection.setLocalDescription({ type: "rollback" });
                        console.log(`[P2P信令] 成功回滾到穩定狀態`);
                    } catch (rollbackError) {
                        console.warn(`[P2P信令] 回滾連接失敗:`, rollbackError);

                        // 如果回滾失敗，建立新連接
                        console.log(`[P2P信令] 創建新的連接替代現有連接`);
                        peerConnection = this._createPeerConnection(data.sender);
                        // _createPeerConnection 會自動將新連接存入 Map
                        peerInfo = this.peerConnections.get(data.sender);
                    }
                }
            }

            // 確保取得正確連接引用
            peerConnection = peerInfo.connection;

            // 記錄當前信令狀態
            console.log(`[P2P信令] 設置遠程描述前的信令狀態: ${peerConnection.signalingState}`);

            // 設置遠程描述
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.data));
            console.log(`[P2P信令] 已設置遠程描述，當前信令狀態: ${peerConnection.signalingState}`);

            // 創建 answer
            const answer = await peerConnection.createAnswer();
            console.log(`[P2P信令] 已創建 answer`);

            // 設置本地描述
            await peerConnection.setLocalDescription(answer);
            console.log(`[P2P信令] 已設置本地描述，當前信令狀態: ${peerConnection.signalingState}`);

            // 發送 answer
            this._sendSignal({
                type: 'answer',
                sender: this.clientId,
                receiver: data.sender,
                data: answer
            });
            console.log(`[P2P信令] 已發送 answer 到 ${data.sender}`);
        } catch (error) {
            console.error('[P2P信令] 處理offer時出錯:', error);
        }
    }

    async _handleAnswer(data) {
        console.log(`[P2P信令] 收到來自 ${data.sender} 的answer`);

        try {
            const peerInfo = this.peerConnections.get(data.sender);

            if (peerInfo && peerInfo.connection) {
                await peerInfo.connection.setRemoteDescription(new RTCSessionDescription(data.data));
                console.log(`[P2P信令] 已設置遠程描述 (answer)`);
            } else {
                console.warn(`[P2P信令] 找不到對應的連接: ${data.sender}`);
            }
        } catch (error) {
            console.error('[P2P信令] 處理answer時出錯:', error);
        }
    }

    async _handleIceCandidate(data) {
        try {
            // 獲取 peerInfo 對象
            const peerInfo = this.peerConnections.get(data.sender);

            if (peerInfo && peerInfo.connection) {
                // 使用 connection 屬性
                await peerInfo.connection.addIceCandidate(new RTCIceCandidate(data.data));
                console.log(`[P2P信令] 成功添加來自 ${data.sender} 的 ICE 候選`);
            } else {
                console.warn(`[P2P信令] 找不到對應的連接: ${data.sender}`);
            }
        } catch (error) {
            console.error('[P2P信令] 添加ICE候選者時出錯:', error);
        }
    }

    /**
     * 確保與對等方的連接已建立並就緒
     */
    async ensureConnected(peerId) {
        if (peerId === this.clientId) {
            return Promise.reject(new Error('不能連接到自己'));
        }

        // 檢查現有連接
        const existingPeerInfo = this.peerConnections.get(peerId);
        if (existingPeerInfo && existingPeerInfo.dataChannel && existingPeerInfo.dataChannel.readyState === 'open') {
            return Promise.resolve();
        }

        console.log(`[P2P連接] 開始建立到 ${peerId} 的連接`);

        try {
            // 確保連接到信令服務器
            if (!this.isConnected) {
                await this.connect();
            }

            // 有現有連接但數據通道未就緒
            if (existingPeerInfo && existingPeerInfo.dataChannel) {
                if (existingPeerInfo.dataChannel.readyState === 'connecting') {
                    // 等待現有連接完成
                    return new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error('等待數據通道打開超時'));
                        }, 10000);

                        const checkState = () => {
                            if (existingPeerInfo.dataChannel.readyState === 'open') {
                                clearTimeout(timeout);
                                resolve();
                            } else if (existingPeerInfo.dataChannel.readyState === 'closed' ||
                                existingPeerInfo.dataChannel.readyState === 'closing') {
                                clearTimeout(timeout);
                                // 如果數據通道已關閉，建立新連接
                                this.connectToPeer(peerId)
                                    .then(resolve)
                                    .catch(reject);
                            } else {
                                setTimeout(checkState, 500);
                            }
                        };

                        checkState();
                    });
                } else if (existingPeerInfo.dataChannel.readyState === 'closed' ||
                    existingPeerInfo.dataChannel.readyState === 'closing') {
                    // 清理已關閉的連接
                    this.peerConnections.delete(peerId);
                }
            }

            // 建立新連接
            return this.connectToPeer(peerId);
        } catch (error) {
            console.error(`[P2P連接] 確保連接到 ${peerId} 時出錯:`, error);
            return Promise.reject(error);
        }
    }

    /**
     * 連接到對等方
     */
    async connectToPeer(peerId) {
        if (peerId === this.clientId) {
            return Promise.reject(new Error('不能連接到自己'));
        }

        console.log(`[P2P連接] 開始與 ${peerId} 建立連接`);

        try {
            // 確保連接到信令服務器
            if (!this.isConnected) {
                await this.connect();
            }

            // 建立新連接
            const peerConnection = this._createPeerConnection(peerId);
            // 獲取最新的 peerInfo
            const peerInfo = this.peerConnections.get(peerId);

            return new Promise((resolve, reject) => {
                // 設置超時
                const timeout = setTimeout(() => {
                    console.error(`[P2P連接] 連接到 ${peerId} 超時`);
                    reject(new Error('連接超時'));
                }, 30000);

                // 創建並發送offer
                peerConnection.createOffer()
                    .then(offer => peerConnection.setLocalDescription(offer))
                    .then(() => {
                        this._sendSignal({
                            type: 'offer',
                            sender: this.clientId,
                            receiver: peerId,
                            data: peerConnection.localDescription
                        });

                        // 監控數據通道
                        const checkChannel = () => {
                            if (peerInfo.dataChannel) {
                                if (peerInfo.dataChannel.readyState === 'open') {
                                    clearTimeout(timeout);
                                    resolve();
                                } else if (peerInfo.dataChannel.readyState === 'connecting') {
                                    setTimeout(checkChannel, 500);
                                } else {
                                    clearTimeout(timeout);
                                    reject(new Error(`數據通道處於 ${peerInfo.dataChannel.readyState} 狀態`));
                                }
                            } else {
                                setTimeout(checkChannel, 500);
                            }
                        };

                        // 開始監控
                        checkChannel();
                    })
                    .catch(error => {
                        clearTimeout(timeout);
                        reject(error);
                    });
            });
        } catch (error) {
            console.error(`[P2P連接] 連接到 ${peerId} 失敗:`, error);
            return Promise.reject(error);
        }
    }

    /**
     * 創建新的對等連接
     */
    _createPeerConnection(peerId) {
        console.log(`[P2P連接] 創建到 ${peerId} 的新RTCPeerConnection`);

        const peerConnection = new RTCPeerConnection({
            iceServers: this.iceServers
        });

        // 創建並儲存連接信息
        const peerInfo = {
            connection: peerConnection,
            dataChannel: null
        };
        this.peerConnections.set(peerId, peerInfo);

        // 監聽ICE候選者
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this._sendSignal({
                    type: 'ice-candidate',
                    sender: this.clientId,
                    receiver: peerId,
                    data: event.candidate
                });
            }
        };

        // 監聽連接狀態
        peerConnection.onconnectionstatechange = () => {
            console.log(`[P2P連接] 連接狀態變更為: ${peerConnection.connectionState}`);

            if (peerConnection.connectionState === 'disconnected' ||
                peerConnection.connectionState === 'failed' ||
                peerConnection.connectionState === 'closed') {

                // 延遲清理，避免在使用中關閉
                setTimeout(() => {
                    if (this.peerConnections.has(peerId) &&
                        this.peerConnections.get(peerId).connection === peerConnection) {
                        console.log(`[P2P連接] 清理已斷開的連接: ${peerId}`);
                        this.peerConnections.delete(peerId);
                    }
                }, 1000);
            }
        };

        // 監聽ICE連接狀態
        peerConnection.oniceconnectionstatechange = () => {
            console.log(`[P2P連接] ICE連接狀態變更為: ${peerConnection.iceConnectionState}`);
        };

        // 監聽遠程數據通道
        peerConnection.ondatachannel = (event) => {
            console.log(`[P2P連接] 收到遠程數據通道`);

            // 設置數據通道事件
            this._setupDataChannelEvents(peerId, event.channel);

            // 保存到 peerInfo
            const currentPeerInfo = this.peerConnections.get(peerId);
            if (currentPeerInfo) {
                currentPeerInfo.dataChannel = event.channel;
            }
        };

        // 創建數據通道
        try {
            const dataChannel = peerConnection.createDataChannel('dataChannel', {
                ordered: false           // 保證順序
            });

            // 設置緩衝區閾值
            dataChannel.bufferedAmountLowThreshold = 256 * 1024; // 256KB

            // 設置數據通道事件
            this._setupDataChannelEvents(peerId, dataChannel);

            // 直接將數據通道保存到 peerInfo
            peerInfo.dataChannel = dataChannel;

            console.log(`[P2P連接] 成功創建數據通道並保存到 peerInfo`);
        } catch (error) {
            console.error(`[P2P連接] 創建數據通道失敗:`, error);
        }

        return peerConnection;
    }

    /**
     * 設置數據通道事件 - 新方法，僅處理事件
     */
    _setupDataChannelEvents(peerId, dataChannel) {
        console.log(`[P2P數據通道] 設置數據通道 [${dataChannel.label}]，當前狀態: ${dataChannel.readyState}`);

        dataChannel.binaryType = 'blob'; // 設置為 blob 以直接處理Blob數據

        dataChannel.onopen = () => {
            console.log(`[P2P數據通道] 與 ${peerId} 的數據通道已打開`);
            // 觸發連接事件
            this._dispatchEvent('peerConnected', { peerId });
        };

        dataChannel.onclose = () => {
            console.log(`[P2P數據通道] 與 ${peerId} 的數據通道已關閉`);
            // 觸發斷開連接事件
            this._dispatchEvent('peerDisconnected', { peerId });
        };

        dataChannel.onerror = (error) => {
            console.error(`[P2P數據通道] 數據通道錯誤:`, error);
        };

        // 處理收到的消息
        dataChannel.onmessage = (event) => {
            const data = event.data;

            // 處理接收到的Blob數據
            if (data instanceof Blob) {
                console.log(`[P2P數據通道] 收到Blob數據: ${data.size} 字節, 類型: ${data.type || '未指定'}`);
                this._handleReceivedBlob(peerId, data);
            }
            // 處理JSON消息
            else if (typeof data === 'string') {
                try {
                    const message = JSON.parse(data);
                    this._handlePeerMessage(peerId, message);
                } catch (parseError) {
                    console.error(`[P2P數據通道] JSON解析錯誤:`, parseError);
                }
            } else {
                console.warn(`[P2P數據通道] 收到未知類型的數據: ${typeof data}`);
            }
        };
    }

    /**
     * 保持向下兼容性的舊方法 - 防止其他地方調用出錯
     */
    _setupDataChannel(peerId, dataChannel) {
        console.log(`[P2P數據通道] 舊方法被調用，轉發到新方法`);

        // 設置事件
        this._setupDataChannelEvents(peerId, dataChannel);

        // 保存數據通道
        let peerInfo = this.peerConnections.get(peerId);
        if (!peerInfo) {
            console.log(`[P2P數據通道] 創建新的 peerInfo 對象用於保存數據通道`);
            peerInfo = { connection: null, dataChannel: null };
            this.peerConnections.set(peerId, peerInfo);
        }

        peerInfo.dataChannel = dataChannel;
    }

    /**
     * 觸發事件
     */
    _dispatchEvent(eventName, data) {
        if (this.eventListeners.has(eventName)) {
            const listeners = this.eventListeners.get(eventName);
            for (const listener of listeners) {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`[P2P事件] 處理事件 ${eventName} 時出錯:`, error);
                }
            }
        }
    }

    /**
     * 添加事件監聽器
     */
    addEventListener(eventName, callback) {
        if (!this.eventListeners.has(eventName)) {
            this.eventListeners.set(eventName, new Set());
        }
        this.eventListeners.get(eventName).add(callback);
    }

    /**
     * 移除事件監聽器
     */
    removeEventListener(eventName, callback) {
        if (this.eventListeners.has(eventName)) {
            this.eventListeners.get(eventName).delete(callback);
        }
    }

    /**
     * 發送信號
     */
    _sendSignal(data) {
        if (!this.isConnected || !this.stompClient) {
            console.warn('[P2P信令] 嘗試發送信號，但未連接到信令服務器');
            return;
        }

        try {
            this.stompClient.send('/app/signal', JSON.stringify(data));
        } catch (error) {
            console.error('[P2P信令] 發送信令消息失敗:', error);
        }
    }

    /**
     * 斷開與所有對等方的連接
     */
    disconnectAll() {
        console.log('[P2P連接] 斷開所有連接');

        this.peerConnections.forEach((peerInfo, peerId) => {
            try {
                if (peerInfo.dataChannel) {
                    peerInfo.dataChannel.close();
                }
                if (peerInfo.connection) {
                    peerInfo.connection.close();
                }
            } catch (error) {
                console.warn(`[P2P連接] 關閉與 ${peerId} 的連接時出錯:`, error);
            }
        });

        this.peerConnections.clear();
    }

    /**
     * 關閉P2P管理器
     */
    close() {
        console.log('[P2P連接] 關閉P2P管理器');

        this.disconnectAll();

        if (this.stompClient && this.stompClient.connected) {
            try {
                this.stompClient.disconnect();
            } catch (error) {
                console.warn('[P2P連接] 斷開STOMP連接時出錯:', error);
            }
        }

        this.stompClient = null;
        this.isConnected = false;

        // 清理所有活動請求
        this.activeResourceRequests.forEach((request, requestId) => {
            if (request.reject) {
                request.reject(new Error('P2P管理器已關閉'));
            }
            if (request.timeout) {
                clearTimeout(request.timeout);
            }
            if (request.monitorInterval) {
                clearInterval(request.monitorInterval);
            }
        });

        this.activeResourceRequests.clear();
        this.resourceUrlToRequestId.clear();
        this.globalTransferState.currentTransfers.clear();
        this.requestLocks.clear();
        this.pendingBlobRequests = [];
        this.nextExpectedBlobRequestId = null;
    }
}