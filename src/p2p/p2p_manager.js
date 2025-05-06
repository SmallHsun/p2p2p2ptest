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

        // 追蹤下一個預期收到的Blob應該屬於哪個請求
        this.nextExpectedBlobRequestId = null;

        // Blob接收隊列，用於處理多個連續的Blob
        this.pendingBlobRequests = [];

        // 分片接收緩存
        this.chunkReceiveCache = new Map(); // requestId -> {chunks: [], totalChunks, receivedChunks, contentType}

        // 調整緩衝區管理設定
        this.bufferConfig = {
            checkThreshold: 256 * 1024,  // 檢查緩衝區的閾值降至256KB
            lowThreshold: 64 * 1024,     // 等待緩衝區降至64KB才繼續
            chunkSize: 64 * 1024,        // 分片大小設為64KB
            largeFileThreshold: 250 * 1024 // 大於100KB的文件使用分片
        };

        // 初始化消息處理器系統
        this._initializeMessageHandlers();
    }


    // 在p2p_manager.js中添加，放在constructor後面
    calculateNodeLoad() {
        // 針對小檔案傳輸優化的權重設置
        const weights = {
            connection: 1.0,     // 連接基礎開銷
            activeTransfer: 2.0, // 傳輸的主要影響
            dataBuffer: 0.3      // 小檔案情境下緩衝區權重降低
        };

        // 計算連接負載 - 當前活躍連接數
        let connectionCount = 0;
        this.peerConnections.forEach((peerInfo) => {
            if (peerInfo.dataChannel && peerInfo.dataChannel.readyState === 'open') {
                connectionCount++;
            }
        });

        // 計算活躍傳輸數 - 當前正在傳輸的請求數
        const activeTransfers = this.globalTransferState.currentTransfers.size;

        // 計算數據緩衝區總量 - 所有連接的緩衝區大小總和
        let totalBuffered = 0;
        this.peerConnections.forEach((peerInfo) => {
            if (peerInfo.dataChannel) {
                totalBuffered += peerInfo.dataChannel.bufferedAmount;
            }
        });

        // 小檔案系統適用的標準化方式
        const maxBufferSize = 15 * 1024 * 1024; // 提高閾值至15MB
        const normalizedBuffer = Math.min(totalBuffered / maxBufferSize, 1.0);

        // 計算加權總負載
        const totalLoad = (connectionCount * weights.connection) +
            (activeTransfers * weights.activeTransfer) +
            (normalizedBuffer * weights.dataBuffer);

        // 對於小檔案系統的合適閾值 (由於已降低緩衝區權重)
        const loadThreshold = 9.0;

        return {
            raw: {
                connections: connectionCount,
                activeTransfers: activeTransfers,
                bufferedAmount: totalBuffered
            },
            score: totalLoad,
            isOverloaded: totalLoad > loadThreshold ||
                connectionCount >= 12 || // 適當提高連接閾值
                activeTransfers >= 5,
            loadThreshold: loadThreshold,
            weights: weights
        };
    }

    // 根據資源類型和目前負載狀況判斷是否接受請求
    canAcceptResourceRequest(resourceUrl, peerId) {
        // 計算當前負載
        const load = this.calculateNodeLoad();
        // 如果負載未超過閾值，直接接受
        if (!load.isOverloaded) {
            return {
                accept: true,
                loadScore: load.score,
                reason: "負載正常"
            };
        }

        // 判斷資源類型優先級
        const resourceType = this._getResourceTypeFromUrl(resourceUrl);

        // 資源優先級（可以自定義不同類型資源的優先級）
        const resourcePriorities = {
            js: 10,    // JavaScript最高優先級
            css: 8,    // CSS次高優先級
            html: 6,   // HTML中等優先級
            image: 4,  // 圖片較低優先級
            other: 2   // 其他資源最低優先級
        };

        const priority = resourcePriorities[resourceType] || resourcePriorities.other;

        // 高優先級資源（如JS/CSS）即使在高負載下也可能接受
        if (priority >= 8 && load.score < load.loadThreshold * 1.2) {
            return {
                accept: true,
                loadScore: load.score,
                reason: `高優先級資源(${priority})，即使在較高負載下也接受`
            };
        }

        // 如果請求來自已經建立連接的對等方，可能降低拒絕門檻
        const existingPeer = this.peerConnections.has(peerId);
        if (existingPeer && load.score < load.loadThreshold * 1.1) {
            return {
                accept: true,
                loadScore: load.score,
                reason: "來自已連接對等方的請求，在輕微超載情況下也接受"
            };
        }

        // 拒絕請求
        return {
            accept: false,
            loadScore: load.score,
            reason: `節點負載過高(${load.score.toFixed(2)}/${load.loadThreshold})，拒絕處理優先級為${priority}的資源請求`,
            loadInfo: load.raw
        };
    }

    // 獲取當前活躍連接數
    getActiveConnectionsCount() {
        let activeCount = 0;

        this.peerConnections.forEach((peerInfo) => {
            if (peerInfo.dataChannel && peerInfo.dataChannel.readyState === 'open') {
                activeCount++;
            }
        });

        return activeCount;
    }
    //==========================
    // 基本初始化與連接管理
    //==========================

    // 初始化消息處理器系統
    _initializeMessageHandlers() {
        // 初始化基礎消息類型的處理器陣列
        const basicMessageTypes = [
            'metadata-ack', 'blob-received', 'resource-received',
            'resource-metadata', 'blob-data-marker', 'blob-transfer-complete',
            'resource-request', 'blob-chunks-info', 'blob-chunks-ack'  // 新增分片相關消息類型
        ];

        for (const type of basicMessageTypes) {
            this.messageHandlers.set(type, []);
        }

        // 註冊分片信息處理器
        this.registerMessageHandler('blob-chunks-info', this._handleChunksInfoMessage.bind(this));
    }

    // 註冊消息處理器
    registerMessageHandler(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }

        this.messageHandlers.get(type).push(handler);
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
                    this.isConnected = true;
                    this.stompClient.send("/app/register", JSON.stringify({
                        clientId: this.clientId,
                        type: "REGISTER"
                    }));
                    // 訂閱客戶端專屬隊列
                    this.stompClient.subscribe(`/topic/signal.${this.clientId}`, message => {
                        const data = JSON.parse(message.body);
                        this._handleSignalingMessage(data);
                    });

                    // 註冊基本消息處理器
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
                    reject(error);
                }
            );
        });
    }

    //==========================
    // 資源傳輸請求相關函數
    //==========================

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

                // 設置請求超時 (3秒)
                const timeout = setTimeout(() => {
                    console.error(`[P2P請求] 錯誤: 向 ${peerId} 請求資源 ${url} 超時`);
                    this._cleanupRequest(requestId, new Error('請求資源超時(3秒)'));
                }, 3000);

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
                    waitingForBlob: false  // 標記是否正在等待接收Blob
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

    //==========================
    // Blob 接收與處理
    //==========================

    // 為接收Blob數據設置特殊處理函數
    _setupBlobReceiveHandler(peerId, requestId) {
        const request = this.activeResourceRequests.get(requestId);
        if (!request) return;

        console.log(`[P2P調試] 為請求 ${requestId} 設置Blob接收處理器`);

        // 添加處理器處理資源元數據
        this.registerMessageHandler('resource-metadata', (fromPeerId, metaData) => {
            // 檢查請求ID是否匹配
            if (metaData.requestId !== requestId) {
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
                this.sendMessage(fromPeerId, 'metadata-ack', {
                    requestId: requestId,
                    status: 'received',
                    readyForBlob: true
                }).then(() => {
                    console.log(`[P2P請求] 已發送元數據確認並請求Blob數據 (請求ID: ${requestId})`);
                }).catch(err => {
                    console.error(`[P2P請求] 發送元數據確認失敗:`, err);
                });
            } catch (error) {
                console.error(`[P2P請求] 發送元數據確認錯誤:`, error);
            }

            // 返回 false 表示這不是一次性處理器，應該保留
            return false;
        });

        // 處理Blob資料標記消息
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
                }, 3000);
            }

            // 返回 true 表示這是一次性處理器，處理完就可以移除了
            return true;
        });
    }

    // 處理接收到的Blob數據
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

    // 處理分片信息消息
    _handleChunksInfoMessage(peerId, data) {
        const { requestId, totalChunks, totalSize, contentType, url } = data;
        console.log(`[P2P改進] 收到分片信息: 請求ID=${requestId}, 總計${totalChunks}片, 大小=${totalSize}字節`);

        // 檢查請求是否存在並有效
        const request = this.activeResourceRequests.get(requestId);
        if (!request) {
            console.error(`[P2P改進] 找不到對應的請求: ${requestId}`);
            return false;
        }

        // 更新請求狀態
        request.lastActivityTime = Date.now();
        request.expectedSize = totalSize;
        request.chunkMode = true; // 標記為分片模式

        // 創建或重置分片接收緩存，使用明確的標識符
        const cacheKey = `${requestId}-${peerId}`;
        this.chunkReceiveCache.set(cacheKey, {
            chunks: new Array(totalChunks),
            totalChunks: totalChunks,
            receivedChunks: 0,
            totalSize: totalSize,
            contentType: contentType,
            url: url,
            peerId: peerId,
            requestId: requestId
        });

        console.log(`[P2P改進] 成功創建分片緩存: ${cacheKey}, 含 ${totalChunks} 片`);

        // 回應分片信息確認
        this.sendMessage(peerId, 'blob-chunks-ack', {
            requestId: requestId,
            status: 'ready'
        }).catch(err => console.error(`[P2P改進] 發送分片確認失敗:`, err));

        return true; // 一次性處理器
    }


    // 處理分片Blob
    async _handleChunkedBlob(peerId, headerObj, chunkBlob) {
        const { requestId, chunkIndex, totalChunks } = headerObj;

        // 使用相同的緩存查找邏輯
        const cacheKey = `${requestId}-${peerId}`;

        // 檢查是否存在分片緩存
        if (!this.chunkReceiveCache.has(cacheKey)) {
            console.error(`[P2P改進] 收到分片但找不到緩存: ${cacheKey} (請求ID: ${requestId})`);

            // 重新創建緩存作為應急措施
            if (this.activeResourceRequests.has(requestId)) {
                const request = this.activeResourceRequests.get(requestId);
                console.log(`[P2P改進] 嘗試為 ${requestId} 創建緊急分片緩存`);

                this.chunkReceiveCache.set(cacheKey, {
                    chunks: new Array(totalChunks),
                    totalChunks: totalChunks,
                    receivedChunks: 0,
                    totalSize: request.expectedSize || 0,
                    contentType: request.contentType || 'application/octet-stream',
                    url: request.url,
                    peerId: peerId,
                    requestId: requestId,
                    emergency: true // 標記為緊急創建
                });
            } else {
                return false;
            }
        }

        const chunkCache = this.chunkReceiveCache.get(cacheKey);

        // 存儲分片
        chunkCache.chunks[chunkIndex] = chunkBlob;
        chunkCache.receivedChunks++;

        console.log(`[P2P改進] 接收分片 ${chunkIndex + 1}/${chunkCache.totalChunks}, 進度: ${Math.round(chunkCache.receivedChunks / chunkCache.totalChunks * 100)}% (請求ID: ${requestId})`);

        // 更新請求活動時間
        const request = this.activeResourceRequests.get(requestId);
        if (request) {
            request.lastActivityTime = Date.now();
        }

        // 檢查是否所有分片都已接收
        if (chunkCache.receivedChunks === chunkCache.totalChunks) {
            console.log(`[P2P改進] 所有分片已接收完成，開始合併 (請求ID: ${requestId})`);

            // 合併所有分片
            const fullBlob = new Blob(chunkCache.chunks, { type: chunkCache.contentType });

            // 檢查大小
            if (fullBlob.size !== chunkCache.totalSize && chunkCache.totalSize > 0) {
                console.warn(`[P2P改進] 合併後大小不匹配: 實際=${fullBlob.size}, 預期=${chunkCache.totalSize}`);
            }

            // 處理完整的Blob
            if (request) {
                this._processBlobReceived(requestId, fullBlob);
            } else {
                console.error(`[P2P改進] 找不到對應的請求: ${requestId}`);
            }

            // 清理緩存
            this.chunkReceiveCache.delete(cacheKey);

            console.log(`[P2P改進] 分片處理完成: ${requestId}`);
            return true;
        }

        return false;
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

        // 清理任何相關的分片緩存
        if (this.chunkReceiveCache.has(requestId)) {
            this.chunkReceiveCache.delete(requestId);
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

    //==========================
    // 消息發送與處理 - 改進版
    //==========================

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
                        if (peerInfo.dataChannel.bufferedAmount > this.bufferConfig.checkThreshold) {
                            console.warn(`[P2P傳輸] 警告: 數據通道緩衝區過大 (${peerInfo.dataChannel.bufferedAmount} 字節)，等待清空...`);
                            this._waitForBufferLow(peerInfo.dataChannel).then(() => {
                                peerInfo.dataChannel.send(JSON.stringify(message));
                                resolve();
                            });
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

    // 輔助方法: 等待緩衝區減小
    async _waitForBufferLow(dataChannel) {
        console.log(`[P2P改進] 等待數據通道緩衝區減小，當前: ${dataChannel.bufferedAmount}字節`);

        return new Promise(resolve => {
            // 設置緩衝區閾值
            dataChannel.bufferedAmountLowThreshold = this.bufferConfig.lowThreshold;

            // 監聽緩衝區低事件
            const handleBufferLow = () => {
                console.log(`[P2P改進] 緩衝區已減小到閾值以下: ${dataChannel.bufferedAmount}字節`);
                dataChannel.removeEventListener('bufferedamountlow', handleBufferLow);
                resolve();
            };

            // 立即檢查緩衝區狀態
            if (dataChannel.bufferedAmount <= this.bufferConfig.lowThreshold) {
                console.log(`[P2P改進] 緩衝區已在閾值以下: ${dataChannel.bufferedAmount}字節`);
                resolve();
                return;
            }

            // 添加緩衝區低事件監聽
            dataChannel.addEventListener('bufferedamountlow', handleBufferLow);

            // 同時設置超時，以防事件未觸發
            setTimeout(() => {
                dataChannel.removeEventListener('bufferedamountlow', handleBufferLow);
                console.warn(`[P2P改進] 等待緩衝區減小超時，當前: ${dataChannel.bufferedAmount}字節`);
                resolve(); // 即使超時也繼續，但可能會導致傳輸問題
            }, 2000);
        });
    }

    //==========================
    // 改進版: Blob數據封包和分片處理
    //==========================

    /**
     * 發送帶有封包頭的Blob數據，支持分片傳輸
     */
    async _sendBlobWithHeader(peerId, url, blob, requestId) {
        try {
            console.log(`[P2P改進] 開始發送帶有封包頭的Blob: ${requestId}, 大小: ${blob.size}字節`);

            // 獲取數據通道
            const peerInfo = this.peerConnections.get(peerId);
            if (!peerInfo || !peerInfo.dataChannel) {
                throw new Error(`數據通道未準備好: ${peerId}`);
            }

            const dataChannel = peerInfo.dataChannel;

            // 檢查是否需要分片 (超過設定閾值就分片)
            const needChunking = blob.size > this.bufferConfig.largeFileThreshold;

            if (!needChunking) {
                // 小文件使用原來的方式，一次性發送
                // 1. 創建包含請求ID的封包頭
                const headerObj = {
                    requestId: requestId,
                    timestamp: Date.now(),
                    blobSize: blob.size,
                    url: url,
                    chunked: false
                };

                const headerString = JSON.stringify(headerObj);
                const headerEncoder = new TextEncoder();
                const headerBuffer = headerEncoder.encode(headerString);

                // 2. 創建一個4字節的頭部長度標記
                const headerLengthBuffer = new ArrayBuffer(4);
                const headerLengthView = new DataView(headerLengthBuffer);
                headerLengthView.setUint32(0, headerBuffer.byteLength, false);

                console.log(`[P2P改進] 封包頭創建完成: 長度=${headerBuffer.byteLength}字節`);

                // 3. 合併為一個完整的數據包
                const combinedBlob = new Blob([
                    new Uint8Array(headerLengthBuffer),
                    headerBuffer,
                    blob
                ], { type: blob.type });

                // 4. 檢查數據通道緩衝區
                if (dataChannel.bufferedAmount > this.bufferConfig.checkThreshold) {
                    await this._waitForBufferLow(dataChannel);
                }

                // 5. 發送數據
                dataChannel.send(combinedBlob);
                console.log(`[P2P改進] 已發送完整Blob: ${requestId}, 大小: ${combinedBlob.size}字節`);

                return true;
            } else {
                // 大文件分片發送
                console.log(`[P2P改進] Blob大小超過${this.bufferConfig.largeFileThreshold / 1024}KB，將使用分片發送: ${blob.size}字節`);

                // 1. 發送分片信息消息
                const chunkSize = this.bufferConfig.chunkSize; // 預設每片大小
                const totalChunks = Math.ceil(blob.size / chunkSize);

                const chunkInfoMsg = {
                    type: 'blob-chunks-info',
                    data: {
                        requestId: requestId,
                        url: url,
                        totalSize: blob.size,
                        contentType: blob.type || this._getContentTypeFromUrl(url),
                        chunkSize: chunkSize,
                        totalChunks: totalChunks
                    }
                };

                // 發送分片信息
                dataChannel.send(JSON.stringify(chunkInfoMsg));
                console.log(`[P2P改進] 已發送分片信息: 總共${totalChunks}片，每片${chunkSize}字節`);

                // 2. 等待確認接收分片信息
                await new Promise(r => setTimeout(r, 200)); // 給接收方一些處理時間

                // 3. 分片發送
                for (let i = 0; i < totalChunks; i++) {
                    // 計算當前分片的範圍
                    const start = i * chunkSize;
                    const end = Math.min(start + chunkSize, blob.size);
                    const chunkBlob = blob.slice(start, end);

                    // 創建分片封包頭
                    const chunkHeaderObj = {
                        requestId: requestId,
                        timestamp: Date.now(),
                        chunkIndex: i,
                        totalChunks: totalChunks,
                        chunkSize: end - start,
                        url: url,
                        chunked: true
                    };

                    const chunkHeaderString = JSON.stringify(chunkHeaderObj);
                    const chunkHeaderEncoder = new TextEncoder();
                    const chunkHeaderBuffer = chunkHeaderEncoder.encode(chunkHeaderString);

                    // 創建頭部長度標記
                    const chunkHeaderLengthBuffer = new ArrayBuffer(4);
                    const chunkHeaderLengthView = new DataView(chunkHeaderLengthBuffer);
                    chunkHeaderLengthView.setUint32(0, chunkHeaderBuffer.byteLength, false);

                    // 合併為一個分片數據包
                    const chunkPacket = new Blob([
                        new Uint8Array(chunkHeaderLengthBuffer),
                        chunkHeaderBuffer,
                        chunkBlob
                    ], { type: blob.type });

                    // 檢查緩衝區並等待
                    if (dataChannel.bufferedAmount > this.bufferConfig.checkThreshold) {
                        await this._waitForBufferLow(dataChannel);
                    }

                    // 發送分片
                    dataChannel.send(chunkPacket);
                    console.log(`[P2P改進] 已發送分片 ${i + 1}/${totalChunks}: ${chunkBlob.size}字節`);

                    // 給網絡一些時間處理
                    if (i < totalChunks - 1) {
                        await new Promise(r => setTimeout(r, 50));
                    }
                }

                console.log(`[P2P改進] 所有分片已發送完成：${totalChunks}片，總計${blob.size}字節`);
                return true;
            }
        } catch (error) {
            console.error(`[P2P改進] 發送帶封包頭的Blob失敗:`, error);
            throw error;
        }
    }

    /**
     * 處理接收到的帶封包頭的Blob數據
     */
    async _handleReceivedPacket(peerId, combinedBlob) {
        try {
            console.log(`[P2P改進] 接收到帶封包頭的數據包: ${combinedBlob.size}字節`);

            // 1. 先讀取前4字節獲取頭部長度
            const headerLengthBuffer = await combinedBlob.slice(0, 4).arrayBuffer();
            const headerLengthView = new DataView(headerLengthBuffer);
            const headerLength = headerLengthView.getUint32(0, false); // 使用大端序

            console.log(`[P2P改進] 讀取到封包頭長度: ${headerLength}字節`);

            if (headerLength <= 0 || headerLength > 10000) { // 合理的頭部大小檢查
                console.error(`[P2P改進] 無效的封包頭長度: ${headerLength}`);
                return false;
            }

            // 2. 讀取頭部數據
            const headerBuffer = await combinedBlob.slice(4, 4 + headerLength).arrayBuffer();
            const headerDecoder = new TextDecoder();
            const headerString = headerDecoder.decode(headerBuffer);

            try {
                const headerObj = JSON.parse(headerString);
                console.log(`[P2P改進] 成功解析封包頭: requestId=${headerObj.requestId}, url=${headerObj.url}`);

                // 檢查是否是分片數據
                if (headerObj.chunked === true) {
                    // 提取分片數據
                    const chunkBlob = combinedBlob.slice(4 + headerLength);
                    await this._handleChunkedBlob(peerId, headerObj, chunkBlob);
                    return true;
                }

                // 3. 提取原始Blob數據
                const actualBlob = combinedBlob.slice(4 + headerLength);
                console.log(`[P2P改進] 提取的實際Blob大小: ${actualBlob.size}字節, 預期大小: ${headerObj.blobSize}字節`);

                // 4. 驗證Blob大小
                if (actualBlob.size !== headerObj.blobSize) {
                    console.warn(`[P2P改進] Blob大小不匹配: 實際=${actualBlob.size}, 預期=${headerObj.blobSize}`);
                }

                // 5. 直接基於requestId處理Blob
                const requestId = headerObj.requestId;
                const request = this.activeResourceRequests.get(requestId);

                if (!request) {
                    console.error(`[P2P改進] 找不到對應的請求: ${requestId}`);
                    // 可能需要發送錯誤回覆給發送者
                    return false;
                }

                console.log(`[P2P改進] 成功匹配到請求: ${requestId}, 來自: ${peerId}`);

                // 6. 處理提取的Blob
                this._processBlobReceived(requestId, actualBlob);
                return true;

            } catch (parseError) {
                console.error(`[P2P改進] 封包頭JSON解析失敗:`, parseError, `原始字串: ${headerString}`);
                return false;
            }
        } catch (error) {
            console.error(`[P2P改進] 處理封包數據失敗:`, error);
            return false;
        }
    }

    /**
     * 直接發送Blob數據，使用封包頭和分片改進版
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

            // 2. 等待元數據確認
            const ackResult = await this._waitForMetadataAck(peerId, requestId);
            if (!ackResult.readyForBlob) {
                throw new Error('對方未準備好接收Blob數據');
            }

            // 3. 發送帶有封包頭的Blob數據 (使用新方法)
            console.log(`[P2P傳輸] 開始發送帶封包頭的Blob數據，大小: ${blob.size}字節 (請求ID: ${requestId})`);

            // 發送前檢查數據通道緩衝區
            if (peerInfo.dataChannel.bufferedAmount > this.bufferConfig.checkThreshold) {
                await this._waitForBufferLow(peerInfo.dataChannel);
            }

            // 使用新的方法發送帶封包頭的Blob
            await this._sendBlobWithHeader(peerId, url, blob, requestId);

            // 4. 發送傳輸完成消息
            console.log(`[P2P傳輸] 發送傳輸完成消息 (請求ID: ${requestId})`);
            peerInfo.dataChannel.send(JSON.stringify({
                type: 'blob-transfer-complete',
                data: {
                    requestId: requestId,
                    url: url,
                    status: 'sent'
                }
            }));

            // 5. 等待Blob接收確認
            const receiveConfirmed = await this._waitForBlobReceivedAck(peerId, requestId);
            console.log(`[P2P傳輸] 資源 ${url} 傳輸${receiveConfirmed ? '已確認' : '未確認'} (請求ID: ${requestId})`);

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

    // 輔助方法: 等待元數據確認
    async _waitForMetadataAck(peerId, requestId) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error(`[P2P傳輸] 等待元數據確認超時: ${requestId}`);
                reject(new Error('等待元數據確認超時'));
            }, 3000);

            const handler = (fromPeerId, ackData) => {
                if (fromPeerId === peerId && ackData.requestId === requestId) {
                    clearTimeout(timeout);
                    console.log(`[P2P傳輸] 收到元數據確認: ${JSON.stringify(ackData)}`);
                    resolve(ackData);
                    return true; // 一次性處理器
                }
                return false;
            };

            this.registerMessageHandler('metadata-ack', handler);
        });
    }

    // 輔助方法: 等待Blob接收確認
    async _waitForBlobReceivedAck(peerId, requestId) {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.warn(`[P2P傳輸] 等待Blob接收確認超時: ${requestId}`);
                resolve(false); // 超時但不拒絕Promise
            }, 3000);

            const handler = (fromPeerId, receiveData) => {
                if (fromPeerId === peerId && receiveData.requestId === requestId) {
                    clearTimeout(timeout);
                    console.log(`[P2P傳輸] 收到Blob接收確認: ${JSON.stringify(receiveData)}`);
                    resolve(true);
                    return true; // 一次性處理器
                }
                return false;
            };

            this.registerMessageHandler('blob-received', handler);
        });
    }

    //==========================
    // 消息接收與處理
    //==========================

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

                        // 檢查是否是因為負載過高而拒絕的請求
                        if (data.status === 'overloaded' && data.shouldTryNextPeer) {
                            request.resolve({
                                status: 'overloaded',
                                loadScore: data.loadScore || 0,
                                reason: data.reason || '節點負載過高',
                                shouldTryNextPeer: true
                            });
                        } else {
                            this._cleanupRequest(requestId, new Error(data.error));
                        }
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
                }
            }

            // 觸發消息事件
            this._dispatchEvent('message', { peerId, type, data });
        } catch (error) {
            console.error(`[P2P消息] 處理來自 ${peerId} 的消息時出錯:`, error);
        }
    }

    /**
     * 處理接收到的Blob數據 - 改進版，先嘗試解析封包
     */
    _handleReceivedBlob(peerId, blob) {
        console.log(`[P2P數據通道] 收到Blob數據: ${blob.size} 字節, 類型: ${blob.type || '未指定'}`);

        // 嘗試舊方法處理，如果改進方法失敗

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

    //==========================
    // 信令與連接管理
    //==========================

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
                    peerConnection = this._createPeerConnection(data.sender);
                    peerInfo = this.peerConnections.get(data.sender);
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
                        }, 3000);

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
                }, 3000);

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
                ordered: true,            // 保證順序
                maxRetransmits: 1         // 最大重試次數
            });

            // 設置緩衝區閾值
            dataChannel.bufferedAmountLowThreshold = this.bufferConfig.lowThreshold;

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
     * 設置數據通道事件 - 改進版，支援解析封包格式
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

        // 處理收到的消息 - 改進版，先判斷是否為封包格式
        dataChannel.onmessage = async (event) => {
            const data = event.data;

            // 處理接收到的Blob數據
            if (data instanceof Blob) {
                try {
                    console.log(`[P2P數據通道] 收到Blob數據: ${data.size} 字節, 類型: ${data.type || '未指定'}`);

                    // 檢查是否可能是帶有封包頭的Blob (至少需要10字節: 4字節長度 + 至少6字節的JSON)
                    if (data.size >= 10) {
                        try {
                            // 嘗試處理為封包格式
                            const success = await this._handleReceivedPacket(peerId, data);
                            if (success) {
                                console.log(`[P2P數據通道] 成功處理帶封包頭的Blob數據`);
                                return; // 已成功處理
                            }
                        } catch (parseError) {
                            console.error(`[P2P數據通道] 解析封包頭失敗:`, parseError);
                        }
                    }

                    // 如果不是封包格式或處理失敗，嘗試用舊方法處理
                    console.log(`[P2P數據通道] 使用舊方法處理Blob數據`);
                    this._handleReceivedBlob(peerId, data);
                } catch (error) {
                    console.error(`[P2P數據通道] 處理Blob數據時出錯:`, error.stack || error);

                    // 如果處理出錯，嘗試舊方法處理
                    this._handleReceivedBlob(peerId, data);
                }
            }
            // 處理JSON消息
            else if (typeof data === 'string') {
                try {
                    const message = JSON.parse(data);
                    this._handlePeerMessage(peerId, message);
                } catch (parseError) {
                    console.error(`[P2P數據通道] JSON解析錯誤:`, parseError, `原始數據: ${data.substring(0, 100)}...`);
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
        // 設置事件
        this._setupDataChannelEvents(peerId, dataChannel);

        // 保存數據通道
        let peerInfo = this.peerConnections.get(peerId);
        if (!peerInfo) {
            peerInfo = { connection: null, dataChannel: null };
            this.peerConnections.set(peerId, peerInfo);
        }

        peerInfo.dataChannel = dataChannel;
    }

    //==========================
    // 事件處理與輔助方法
    //==========================

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

    //==========================
    // 關閉與清理
    //==========================

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
        this.chunkReceiveCache.clear();
    }
}