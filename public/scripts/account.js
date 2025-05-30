// =====================================
// Utils
// =====================================

function _accountSetStorage(token) {
  localStorage.setItem('STORAGEINFO', token)
  localStorage.setItem('STORAGEINFO_TIME', Date.now())
}

function _accountSetVersion(version) {
  localStorage.setItem('VERSION', version)
}

function _accountParseCookies() {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const cookieObject = {};

  cookies.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookieObject[name] = value;
  });

  return cookieObject;
}

function _accountGetPreUrl(loginSettings) {
  if (!loginSettings.preUrl || loginSettings.preUrl.length === 0) {
    return window.location.href;
  }
  return loginSettings.preUrl;
}

function _accountGetDefaultUrl() {
  const currentHostname = window.location.hostname;
  const envNumMatch = currentHostname.match(/\d+/);
  const envNum = envNumMatch ? envNumMatch[0] : '';
  const urlMap = {
    uat: '//https://accountuat.momoshop.com.tw/web',
    qc: `/* https://accountqc${envNum */ ? envNum : '1'}.momoshop.com.tw/web`,
    local: '//https://accountuat.momoshop.com.tw/web'
  };

  for (const [key, value] of Object.entries(urlMap)) {
    if (currentHostname.includes(key)) return value;
  }

  return '//https://account.momoshop.com.tw/web';
}

function _accountIsMobile(userAgent){
  var result = false;
  if(userAgent == null || userAgent.length == 0){
    userAgent = "";
  }
  if (userAgent.length >= 4) {
      if (userAgent
          .match(".*(android.+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)"
              + "|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket"
              + "|psp|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino).*")
          || userAgent.substring(0, 4).match(
              "1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)"
                  + "|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )"
                  + "|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell"
                  + "|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)"
                  + "|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\"
                  + "-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht"
                  + "(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|"
                  + "im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|"
                  + "le(no|xi)|lg( g|\\/(k|l|u)|50|54|e\\-|e\\/|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|"
                  + "xo)|mc(01|21|ca)|m\\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt"
                  + "(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf"
                  + "|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|"
                  + "pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|"
                  + "qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se"
                  + "(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|"
                  + "sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|"
                  + "t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|"
                  + "5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |"
                  + "nc|nw)|wmlb|wonu|x700|xda(\\-|2|g)|yas\\-|your|zeto|zte\\-")) {
        result = true;
      }
  }
  return result;
};

const redirectMobileBasedOnDomain = (loginSettings) => {
  const currentHost = window.location.host; // 取得當前域名，如 "www.momoshop.com.tw"
  
  let redirectUrl = "";

  if (currentHost.startsWith("www.momoshop.com.tw")) {
    // 如果是 www 開頭
    redirectUrl = `/* https://${currentHost.replace */("www.", "m.")}/mymomo/login.momo`;
  } else if (currentHost.startsWith("momouat") && currentHost.includes(".momoshop.com.tw")) {
    // 如果是 momouat 開頭，處理數字變化
    redirectUrl = `/* https://${currentHost.replace */("momouat", "muat")}/mymomo/login.momo`;
  } else if (currentHost.startsWith("muat") && currentHost.includes(".momoshop.com.tw")) {
    redirectUrl = `/* https://${currentHost.replace */("muat", "muat")}/mymomo/login.momo`;
  } else if (currentHost.startsWith("momoqc") && currentHost.includes(".momoshop.com.tw")) {
    redirectUrl = `/* https://${currentHost.replace */("momoqc", "mqc")}/mymomo/login.momo`;
  } else if (currentHost.startsWith("mqc") && currentHost.includes(".momoshop.com.tw")) {
    redirectUrl = `/* https://${currentHost.replace */("mqc", "mqc")}/mymomo/login.momo`;
  } else {
    console.warn("不符合轉導條件，無法進行轉導");
    return;
  }

  let preUrl = _accountGetPreUrl(loginSettings)
  if (preUrl.length > 0) {
    redirectUrl += '?preUrl=' + preUrl
  } else {
    // 如果preUrl為空，則預設為當前url
    redirectUrl += '?preUrl=' + window.location.href
  }

  // 執行轉導
  window.location.href = redirectUrl;
};

function loadCheckMobileJS() {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.src = '/ecm/js/mobile/checkMobile.js';
  head.appendChild(script);
}

// =====================================
// Component
// =====================================
class AccountIframeComponent {
  constructor() {
    this.callbacks = {}
    this.customCallback = null
    this.customCallbackParam = null
    this.queue = []

    this.template = this._createTemplate()
    this.container = this.template.querySelector('.loginIframeContainer')
    this.iframe = this.template.querySelector('.loginIframe')
    this.iframeOverlay = this.template.querySelector('.loginIframeOverlay')

    this.messageHandler = this._messageHandler.bind(this)
    this.isDisplay = false
  }

  _createTemplate() {
    const htmlString = `
            <div class="loginIframeContainer">
                <iframe class="loginIframe"></iframe>
            </div>
            <div class="loginIframeOverlay"></div>
          `
    const div = document.createElement('div')
    div.className = 'loginTemplate'
    div.innerHTML = htmlString.trim()
    return div
  }

  _addEventListeners() {
    this.iframe.onload = () => {}
    window.addEventListener('message', this.messageHandler)
  }

  _removeEventListeners() {
    this.iframe.onload = () => {}
    window.removeEventListener('message', this.messageHandler)
  }

  _messageHandler(event) {
    // 檢查是否為指定來源丟回來
    if (event.origin !== new URL(this.src).origin) {
      return
    }

    // 根據action調用對應的處理流程
    const data = event.data
    const action = data.action

    // 先判斷是否執行customCallback；只會在登入成功後由前端發起loginSuccess事件來執行
    if (action === 'loginSuccess' && this.customCallback && this.customCallbackParam) {
      _accountSetStorage(data.userInfo.token)
      _accountSetVersion(data.userInfo.version)
      this.customCallback(this.customCallbackParam)
    }


    // 執行固有callback流程
    this[`_${action}Handler`](data)
  }

  // 當需要開啟iframe的動作連續發生時，將動作放入佇列中，依序執行
  _processQueue() {
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift()
      nextTask()
    }
  }

  _loginSuccessHandler(data) {
    try {
      this.hide()
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  _resizeIframeHandler(data) {
    try {
      const { isMobile, width, height } = data.resizeInfo;
      
      // 設置容器尺寸
      if (!isMobile) {
        this.container.style.width =  `${width}px`;
        this.container.style.height = `${height}px`;
      }
      
      // 更新 CSS class
      this.template.classList.toggle("loginTemplate", !isMobile);
      this.template.classList.toggle("loginTemplateMobile", isMobile);
      this.container.classList.toggle("loginIframeContainer", !isMobile);
      this.container.classList.toggle("loginIframeContainerMobile", isMobile);
      this.iframeOverlay.classList.toggle("loginIframeOverlay", !isMobile);

      this.container.style.opacity = 1
      this.iframeOverlay.style.opacity = 1
      
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error);
      }
    }
  }

  _closeIframeHandler(data) {
    try {
      this.container.style.width = 0 + 'px'
      this.container.style.height = 0 + 'px'
      this.hide()
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  _redirectHandler(data) {
    try {
      window.location.href = data.userInfo.redirectUrl
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  _infoPageReadyHandler(data) {
    try {
      if (typeof this.callbacks.infoPageReady === 'function') {
        this.callbacks.infoPageReady()
      }
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  _removeLocalStorageDoneHandler(data) {
    try {
      if (typeof this.callbacks.removeLocalStorage === 'function') {
        this.callbacks.removeLocalStorage()
      }
      this.hide()
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  _syncLocalStorageHandler(data) {
    try {
      _accountSetStorage(data.userInfo.token)
      _accountSetVersion(data.userInfo.version)
      if (typeof this.callbacks.syncLocalStorage === 'function') {
        this.callbacks.syncLocalStorage(true)
      }
      this.hide()
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  _getStaticSettingErrorHandler(data) {
    try {
      if (data.isInitSuccess) {
        if (this.isDisplay) {
          this.container.style.display = 'block'
          this.iframeOverlay.style.display = 'block'
        }
      } else {
        alert("網站主機忙碌中，請稍後再試！謝謝！")
        this.hide()
      }
    } catch (error) {
      if (typeof this.callbacks.error === 'function') {
        this.callbacks.error(error)
      }
    }
  }

  setSrc(src) {
    this.src = src
  }

  sendPostMessage(messageData) {
    this.iframe.contentWindow.postMessage(messageData, new URL(this.src).origin)
  }

  show(isDisplay) {
    let tempCallback = this.callbacks
    const showTask = () => {
      this.isDisplay = isDisplay
      this.callbacks = tempCallback
      this._addEventListeners()
      this.iframe.src = this.src

      if (document.querySelector("body > div.loginNewContainer")) {
        // 小網登入頁
        document.querySelector("body > div.loginNewContainer").appendChild(this.template)
      } else if (document.body) {
        // 大網登入頁
      	document.body.appendChild(this.template)
      	document.body.style.overflow = isDisplay ? 'hidden' : ''
      }
    }

    const loginTemplate = document.querySelector('.loginTemplate')
    const loginTemplateMobile = document.querySelector('.loginTemplateMobile')

    if (loginTemplate || loginTemplateMobile) {
      // 當目前有iframe正在顯示時，將新的showTask放入佇列中，等待前一個iframe關閉後再執行
      if (this.iframe.src !== this.src && this.queue.length === 0) {
        this.queue.push(showTask)
      }
      return
    }
    showTask()
  }

  hide() {
    this._removeEventListeners()
    this.isDisplay = false
    this.iframe.src = ''
    this.callbacks = {}
    this.container.style.display = 'none'
    this.iframeOverlay.style.display = 'none'
    if (document.body) {
    	document.body.style.overflow = ''
    }

    const loginTemplate = document.querySelector('.loginTemplate')
    const loginTemplateMobile = document.querySelector('.loginTemplateMobile')
    const loginTemplateExist = loginTemplate ? loginTemplate : loginTemplateMobile

    if (loginTemplateExist && document.querySelector("body > div.loginNewContainer")) {
      // 移除小網登入頁
      document.querySelector("body > div.loginNewContainer").removeChild(loginTemplateExist)
    } else if (loginTemplateExist && document.body) {
      // 移除大網登入頁
      document.body.removeChild(loginTemplateExist)
    }

    // 執行下一個佇列中的動作
    this._processQueue()
  }

  addCallback(action, callback) {
    this.callbacks[action] = callback
  }

  addCustomCallback(callback) {
    this.customCallback = callback
  }

  addCustomCallbackParam(param) {
    this.customCallbackParam = param
  }
}

class Account {
  constructor() {
    this.iframeContainer = new AccountIframeComponent()
    this.defaultUrl = _accountGetDefaultUrl()
    this.loginPageUrl = ''
  }

  /**
   * 呼叫showLoginIframe前須先初始化url，分別為：
   * @param loginUrl: 新登入頁url
   */
  initLoginUrl(loginUrl) {
    this.defaultUrl = loginUrl
  }

  _handleLogin(loginSettings, customCallback) {
    const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const heightOffset = scrollHeight - window.innerHeight - scrollTop
    this.loginPageUrl += '?preUrl=' + _accountGetPreUrl(loginSettings) + '&heightOffset=' + heightOffset
    this.iframeContainer.setSrc(this.loginPageUrl)
    this.iframeContainer.addCustomCallback(customCallback)
    this.iframeContainer.addCustomCallbackParam(loginSettings)
    this.iframeContainer.show(true)
  }

  showLoginIframe(loginSettings, customCallback) {
    if (this.checkLoginPageUrl(loginSettings)) {
      return;
    }
    this._handleLogin(loginSettings, customCallback);
  }

  checkLoginPageUrl(loginSettings) {
    if (!window.location.href.includes('mymomo/login.momo') && _accountIsMobile(navigator.userAgent.toLowerCase())) {
      // 轉導至m.momoshop.com.tw
      redirectMobileBasedOnDomain(loginSettings)
      return true;
    } else if (window.location.href.includes('mymomo/login.momo')) {
      if (_accountIsMobile(navigator.userAgent.toLowerCase())) {
        this.loginPageUrl = this.defaultUrl.replace(/\/[^/]+$/, '/mobile')
      } else {
        this.loginPageUrl = this.defaultUrl.replace(/\/[^/]+$/, '/web')
      }
    } else {
      this.loginPageUrl = this.defaultUrl.replace(/\/[^/]+$/, '/web')
    }
    return false;
  }

  syncLocalStorage(syncLocalStorageCallback) {
    this.initLoginUrlByDeviceSize()
    const cookies = _accountParseCookies()
    if (cookies['loginRsult'] && cookies['loginRsult'] === '1') {
      this.iframeContainer.addCallback('syncLocalStorage', syncLocalStorageCallback)
      this.iframeContainer.addCallback('infoPageReady', () => {
        const messageData = {
          action: 'syncLocalStorage'
        }
        this.iframeContainer.sendPostMessage(messageData)
      })
      this.iframeContainer.setSrc(this.loginPageUrl.replace(/\/[^/]+$/, '/info') + '?preUrl=' + _accountGetPreUrl({ preUrl: '' }))
      this.iframeContainer.show(false)
    } else {
      if (typeof syncLocalStorageCallback === 'function') {
        syncLocalStorageCallback(false)
      }
    }
  }

  isStorageTimeout() {
    let removeStorageFlag = false;
    const cookies = _accountParseCookies()
    if (!cookies['loginRsult'] || cookies['loginRsult'] !== '1') {
      removeStorageFlag = true
    }

    const storageTime = localStorage.getItem('STORAGEINFO_TIME')
    if (!storageTime) {
      return false
    }

    const timeElapsed = Date.now() - storageTime
    const timeLimit = 20 * 60 * 1000

    if (timeElapsed > timeLimit) {
      removeStorageFlag = true
    }

    if (removeStorageFlag) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.removeStorage()
        });
      } else {
        this.removeStorage()
      }
      return true
    }
    
    localStorage.setItem('STORAGEINFO_TIME', Date.now())
    return false
  }

  removeStorage() {
    this.initLoginUrlByDeviceSize()
    localStorage.removeItem('STORAGEINFO')
    localStorage.removeItem('STORAGEINFO_TIME')
    localStorage.removeItem('VERSION')
    localStorage.removeItem('VERSION_HASH')
    this.iframeContainer.addCallback('infoPageReady', () => {
      const messageData = {
        action: 'removeLocalStorage'
      }
      this.iframeContainer.sendPostMessage(messageData)
    })
    this.iframeContainer.setSrc(this.loginPageUrl.replace(/\/[^/]+$/, '/info') + '?preUrl=' + _accountGetPreUrl({ preUrl: '' }))
    this.iframeContainer.show(false)
  }

  initLoginUrlByDeviceSize() {
    this.loginPageUrl = this.defaultUrl.replace(/\/[^/]+$/, '/web')
  }
}

const account = new Account()
window.account = account

account.isStorageTimeout()