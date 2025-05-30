let momoWaDomain = "momowa.momoshop.com.tw";
if (!/(www|m)\.momoshop\.com\.tw/.test(location.hostname)) {
  momoWaDomain = "test-momowa.momoshop.com.tw";
}
//只觀察一次後就取消監聽的被觀察元素清單
let observerOnceElements = [];
/**
 * 當scroll 事件觸發且rootEle和targetEles交互作用 時 執行傳入包裝debounce後的callback
 * @param {被觀察的目標元素 傳入元素陣列 [elements1, ...]} targetEles 
 * @param {當觸發viewport和 targetEles交互作用時 要執行的回呼函式} callback
 * @param {當所有callback 執行完後最後要呼叫的callback} latestCallback
 * @param {可以自訂root元素,不傳預設viewport} rootEle 
 */

const newIntersectionObserver = (targetEles = [], callback, latestCallback, rootEle) => {
  if (targetEles.length === 0) return;
  let observerElements = [];
  let observerElementsRatio = [];
  // Callback function to be executed when the target element enters the viewport
  const intersectionCallback = (entries) => {
    entries.forEach(entry => {
      //update the most recent entry for the observerElement
      const observerElement = observerElements.find(elementObj => elementObj.element === entry.target);
      if (observerElement) {
        observerElement.lastestEntry = entry;
      }
    });
  }
  // Create an Intersection Observer instance
  const createObserver = () => {
    const observer = new IntersectionObserver(intersectionCallback, {
      root: rootEle || null, // Use the viewport as the root
      rootMargin: '0px', // No margin
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Trigger intersectionCallback when at least [0, 0.1 - 1]*100% of the element is visible
    });

    // Start observing the targetEles
    targetEles.forEach(element => {
      observer.observe(element);
      observerElements.push({element, observer, lastestEntry: null});
    });
  };

  createObserver();
  //use debounce limit scroll event trigger times
  const handleScroll = () => {
    observerElements.forEach(({observer, lastestEntry}) => {
      if (lastestEntry && lastestEntry.isIntersecting) {
        //搜尋結果頁
        if (latestCallback) {
          const elements = {}
          const currentRatio = lastestEntry.intersectionRatio;
          const currentProdId = lastestEntry.target.getAttribute('gcode');
          //set data attributes
          lastestEntry.target.dataset.visibilityRate = currentRatio;
          elements.ratio = currentRatio;
          elements.id = currentProdId;
          //當前元素和先前元素比對, 判斷先前元素可視率是否大於當前元素,可視率是否已經為1 (100%)
          const isGetMaxRatio = observerElementsRatio.find((ele) => {
            return ele && ele.id === currentProdId && (ele.ratio >= currentRatio || ele.ratio === 1);
          });
          //當前元素和 observerOnceElements 元素比對,判斷observerOnceElements可視率是否大於當前元素,可視率是否已經為1 (100%)
          const isGetMaxRatioOnce = observerOnceElements.find((ele) => {
            return ele && ele.id === currentProdId && (ele.ratio >= currentRatio || ele.ratio === 1);
          });
          
          observerElementsRatio.push(elements);
          if (!isGetMaxRatio && !isGetMaxRatioOnce){
            callback(lastestEntry);
          }else {
            callback(lastestEntry, true);
          }
        } else {//商品頁
          callback(lastestEntry);
        }
      }
    })
    const result = observerElements.some(({lastestEntry}) => {
      return lastestEntry.isIntersecting;
    })
    if (latestCallback && result) {
      latestCallback();
    }
  }
  window.addEventListener('scroll', debounce(handleScroll, 200));
};

/**
 * 觸發一次intersectionCallback後立刻移除targetEles元素監聽
 * @param {被觀察的目標元素 傳入元素陣列 [elements1, ...]} targetEles 
 * @param {當觸發viewport和 targetEles交互作用時 要執行的回呼函式} callback 
 * @param {當所有callback 執行完後最後要呼叫的callback} latestCallback
 * @param {可以自訂root元素,不傳預設viewport} rootEle 
 */

const newIntersectionObserverOnce = (targetEles = [], callback, latestCallback, rootEle) => {
  if (targetEles.length === 0) return;
  let observerElements = [];
  // Create an Intersection Observer instance
  const createObserver = () => {
    // Callback function to be executed when the target element enters the viewport
    const intersectionCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          //set data attributes
          entry.target.dataset.visibilityRate = entry.intersectionRatio;
          const elements = {}
          const currentRatio = entry.intersectionRatio;
          const currentProdId = entry.target.getAttribute('gcode');
          elements.id = currentProdId;
          elements.ratio = currentRatio;
          //當前元素和先前元素比對, 判斷先前元素是否已經存在
          const isGetExistElement = observerElements.find((ele) => {
            return ele && ele.id === currentProdId;
          });
          observerOnceElements.push(elements);
          observerElements.push(elements);
          //有相同的商品元素id, 則從要發送的商品清單移除此商品
          if (isGetExistElement) {
            callback(entry, true);
          } else {
            callback(entry);
          }
        }
      });
      observerOnce.disconnect();
      if(latestCallback && entries.length > 0) {
        latestCallback();
      }
    }
    const observerOnce = new IntersectionObserver(intersectionCallback, {
      root: rootEle || null, // Use the viewport as the root
      rootMargin: '0px', // No margin
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Trigger intersectionCallback when at least [0, 0.1 - 1]*100% of the element is visible
    });
    // Start observing the targetEles
    targetEles.forEach(element => {
      if(isInViewPort(element)){
        observerOnce.observe(element);
      }
    });
  };

  createObserver();
};

const isInViewPort = element => {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect()

  return (left >=0 && right <= viewWidth && (bottom <=viewHeight || top <= viewHeight));
}

/**
 * 用途:讓使用者在連續觸發相同事件的(scroll, click, change...)的情境下,停止觸發綁定事件的效果,直到使用者
 * 停止觸發相同事件後 延遲 delay才會執行 func
 * @param {傳入要執行的callback function} func 
 * @param {延遲觸發的毫秒數} delay 
 */

const debounce = (func, delay) => {
  let timer = null;
  return function(...args){
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      //呼叫傳入的func, func 呼叫時,重新指派context為新的 this
      //args func 呼叫時傳入的參數
      func.apply(context, args);
    }, delay);
  }
}

//推送momowa事件流量
function sendMomowaTrackActionEvent(momowaEventCategory, momowaEventLabel, eventName, blockImpId){
  try{
    const isIncludeMomowa = window.momowaCmds? true:false;
    const momowaCmds = window.momowaCmds || [];
    momowaCmds.push(['setSiteId','shop']);
    momowaCmds.push(['setTrackerUrl',`/* https://${momoWaDomain}/momowa/rc/RC.MMW`] */);
    
    if (eventName && momowaEventCategory && momowaEventLabel) {
      let pushList = ['trackAction', encodeURIComponent(momowaEventCategory), eventName, momowaEventLabel, ''];
      //版位曝光唯一識別碼 for 商品頁
      if(blockImpId) {
        pushList.push(blockImpId);
      }
      momowaCmds.push(pushList);
      if(!isIncludeMomowa){
        (function() {
          var _mwa = document.createElement('script');
          _mwa.type = 'text/javascript';
          _mwa.async = true;
          _mwa.src = `/* https://${momoWaDomain}/momowa/rc/js/momowa.js?_=20231208001`; */
          var _mwa_s = document.getElementsByTagName('script')[0]; 
          _mwa_s.parentNode.insertBefore(_mwa, _mwa_s);
          }());
      }
    }
  } catch(e){
    console.error(e);
  }
}

/* 推送recomd_id */
function sendRecommendId(recomd_id){
  if(typeof recomd_id !== "string") return;
  var momowaCmds = window.momowaCmds || [];
  if(typeof recomd_id == "string" && momowaCmds){
    var momowaSiteId = "shop";  
    var ua = navigator.userAgent.toLowerCase();
    if(isMobile(ua)){ //手機裝置
      momowaSiteId = ua.indexOf("momoshop") >= 0 ? '':'shopmobile';
    }
    
    if(momowaSiteId){
      momowaCmds.push(['setSiteId', momowaSiteId]);
      momowaCmds.push(['setTrackerUrl', `/* https://${momoWaDomain}/momowa/rc/RC.MMW`] */);
      momowaCmds.push(['setRecommendId', recomd_id]);
      momowaCmds.push(['trackPageView']);
      
      (function() {
        var _mwa = document.createElement('script');
        _mwa.type = 'text/javascript';
        _mwa.async = true;
        _mwa.src = `/* https://${momoWaDomain}/momowa/rc/js/momowa.js?_=20231208001`; */
        var _mwa_s = document.getElementsByTagName('script')[0];
        _mwa_s.parentNode.insertBefore(_mwa, _mwa_s);
      }());
    }
  }
}

//推送momowa版位素材事件資料
function sendMomowaTrackBlockItemEvent(data, eventName, blockImpId) {
  try {
    if (!data) return;
    const trackData = JSON.stringify(data);
    const isIncludeMomowa = window.momowaCmds? true:false;
    const momowaCmds = window.momowaCmds || [];
    momowaCmds.push(['setSiteId',"shop"]);
    momowaCmds.push(['setTrackerUrl',`/* https://${momoWaDomain}/momowa/rc/RC_BLOCK_ITEM_IMPRESSION.MMW`] */);
    momowaCmds.push(['trackBlockItemAction', eventName, blockImpId, trackData]);
    if(!isIncludeMomowa){
      (function() {
        var _mwa = document.createElement('script');
        _mwa.type = 'text/javascript';
        _mwa.async = true;
        _mwa.src = `/* https://${momoWaDomain}/momowa/rc/js/momowa.js?_=20231208001`; */
        var _mwa_s = document.getElementsByTagName('script')[0]; 
        _mwa_s.parentNode.insertBefore(_mwa, _mwa_s);
        }());
    }
  } catch (e) {
    console.error(e);
  }
}

//推送momowa事件共用API
const sendMomowaTrackEvent = (data) => {
  if (!data || !data.eventInfo || !data.eventAttrs || data.eventAttrs.goodsList.length === 0) return;
  const isIncludeMomowa = window.momowaCmds? true:false;
  const momowaCmds =  window.momowaCmds || [];
  data.eventInfo.screenName = encodeURIComponent(data.eventInfo.screenName);
  data.eventInfo.actCategory = encodeURIComponent(data.eventInfo.actCategory);
  momowaCmds.push(['trackEvent', data.eventInfo, data.eventAttrs ]);
  if(!isIncludeMomowa){
    (function() {
      var _mwa = document.createElement('script');
      _mwa.type = 'text/javascript';
      _mwa.async = true;
      _mwa.src = `/* https://${momoWaDomain}/momowa/rc/js/momowa.js?_=20231208001`; */
      var _mwa_s = document.getElementsByTagName('script')[0]; 
      _mwa_s.parentNode.insertBefore(_mwa, _mwa_s);
      }());
  }
}

//無條件進位, num 要處理的數字, decimal 小數點第幾位
const roundUp = (num, decimal) => {
  if(num === 1) return num;
  const result = Math.ceil((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
  return result;
}


//將傳入的參數 num 無條件進位到小數點第 decimal 位, 轉成百分比格式 0.78 => 78
const toPercentage = (num, decimal) => {
  const result = parseFloat((roundUp(num, decimal) * 100).toPrecision(decimal));
  return result;
}

function loadScript(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = () => {
    callback();
  }
  script.onerror = () => {
    console.error(`Failed to load script ${url}`);
  }
  document.head.appendChild(script);
}