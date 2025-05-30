(async function () {
  // widget 初始化環境變數
  function widgetInit() {
    return new Promise(resolve => {
      var host = document.currentScript.src.split('/widget')[0];
      let style = document.createElement('script');
      style.setAttribute('src', `${host}/widget/js/momo-widget-util.js`);
      style.addEventListener("load", resolve, {
        once: true
      });
      document.head.appendChild(style);
    });
  }

  var scriptElement = document.currentScript; // before await
  await widgetInit();
  const debug = window.momoWidgetUtil.print('首頁 熱銷排行榜下方');
  const env = window.momoWidgetUtil.getEnvParams(scriptElement);
  const widgetId = env.widgetId;
  const resourceHost = env.resourceHost;
  const pmaxHost = env.pmaxHost;

  // 實作 widget 內容 ... 
  const sspWidgetAdMinimumCnt = 4; // 原生商品廣告最低數量. 若不滿足不展開 widget, 不貼出廣告, 不發出 event
  const itemsCount = 8; // 商品廣告版位數量
  var finalItemCount;
  var momoWidget = (window.momoWidget || (window.momoWidget = {}))
  momoWidget[widgetId] = {
    sspProductNativeAdGroupType: 0, // 0 : 允許不同廣告主, 1 : 必須相同廣告主
    sspWidgetAdMinimumCnt: sspWidgetAdMinimumCnt,
    sspWidgetAdSizeFn: function (adSize) { // adcode 回傳廣告數量是否低於 ssp_widget_ad_minimum_cnt, widget 自己判斷如何處理
      finalItemCount = adSize; // 更新 itemsCount
      if (finalItemCount < sspWidgetAdMinimumCnt) {
        debug(`[${widgetId}] 廣告數量 ${finalItemCount} 個, 不足 ${sspWidgetAdMinimumCnt} 個`)
        document.querySelector('#' + widgetId).style.display = 'none';
      } else {
        debug(`[${widgetId}] 廣告數量 ${finalItemCount} 個`)
        document.querySelector('#' + widgetId).style.display = 'block';
      }
    }
  }

  var countSpace = 0;
  var rmaxads = (window.rmaxads || (window.rmaxads = {}));
  (rmaxads.cmd || (rmaxads.cmd = [])).push(function (rmaxads) {
    rmaxads.on('space', function (space) {
      space.on('display', function (ad) {
        if (space.spaceId !== '5c92b35c15f04527') {
          return;
        }
        countSpace++
        if (ad) {
          space.element.closest(".tenmax_style_item").setAttribute('data-index', '');
          var channel = ad.channel;
          var cid = channel.cid;
          var crid = parseInt(channel.crid, 10) - 10000000;
          var advertiserId = channel.context.advertiserId;

          debug(`廣告主 : ${advertiserId}, 廣告活動編號 : ${cid}, 素材`, `${pmaxHost}/creatives/${crid}/edit`)
        }

        if (countSpace == finalItemCount) {
          var cards = document.querySelectorAll(`#${widgetId} .tenmax_style_item[data-index]`);
          for (i = 0; i < cards.length; ++i) {
            var card = cards[i];
            card.setAttribute('data-index', i);
          }
          showItems(0);
        }
      });
    });
  });

  const styles = `
      #${widgetId}.tenmax_style_container {
        margin-top: 20px;
        background-color: #F2F2F2;
        box-sizing: border-box;
        position: relative;
        width: 1220px;
        display: none;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 10px;

        .tenmax_style_sponsored {
          box-sizing: border-box;
          position: absolute;
          bottom:8px;
          right: 8px;
        }
        .tenmax_style_sponsored img {
          width: 40px;
          height:20px;
        }
  
        .tenmax_style_product_container {
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #a6a6a6;
        }
  
        .tenmax_style_left_mask {
          left: 0px;
        }
  
        .tenmax_style_right_mask {
          right: 0px;
        }
  
        .tenmax_style_mask {
          display: block;
          z-index: 2;
          width: 0px;
          height: 130px;
          background: #FFFFFF;
          position: absolute;
          top: 0px;
          height: 100%;
        }
  
        .tenmax_style_leftBtn {
          display: inline-block;
          margin: 0px;
          padding: 0px;
          height: 60px;
          width: 35px;
          position: absolute;
          left: 0px;
          top: calc(50% - 30px);
          background: url(${resourceHost}/widget/images/icon_prev.png)no-repeat center;
          cursor: pointer;
          z-index: 1;
        }
  
        .tenmax_style_rightBtn {
          display: inline-block;
          margin: 0px;
          padding: 0px;
          height: 60px;
          width: 35px;
          position: absolute;
          right: 0px;
          top: calc(50% - 30px);
          background: url(${resourceHost}/widget/images/icon_next.png)no-repeat center;
          cursor: pointer;
          z-index: 1;
        }
  
        .tenmax_style_leftBtn:hover {
          background:rgba(0,0,0, 0.25) url(${resourceHost}/widget/images/icon_prev_white.png)no-repeat center;
          cursor: pointer;
        }
        .tenmax_style_rightBtn:hover {
          background: rgba(0,0,0, 0.25) url(${resourceHost}/widget/images/icon_next_white.png)no-repeat center;
          cursor: pointer
        }
  
        .tenmax_style_item {
          box-sizing: border-box;
          background-color: #fff;
          display: none;
          justify-content: center;
          align-items: center;
          border-radius: 6px;
        }
  
        .tenmax_style_ins {
          padding: 0;
          margin: 0;
          line-height: 0px
        }
      }
    `;

  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  const tenmaxContainer = document.createElement('div');
  tenmaxContainer.id = widgetId;
  tenmaxContainer.className = 'tenmax_style_container';
  document.body.appendChild(tenmaxContainer);

  const sponsoredWrapper = document.createElement('div');
  const sponsored = document.createElement('div');
  sponsored.className = 'tenmax_style_sponsored';
  const img = document.createElement('img');
  img.src = `${resourceHost}/widget/images/ad_tag.svg`;
  sponsored.appendChild(img);
  sponsoredWrapper.appendChild(sponsored);
  tenmaxContainer.appendChild(sponsoredWrapper);

  const itemWrapper = document.createElement('div');
  itemWrapper.style = "display: flex;justify-content: center;grid-gap: 12px;";

  for (let i = 1; i <= itemsCount; i++) {
    const item = document.createElement('div');
    item.className = 'tenmax_style_item';
    // item.textContent = i;

    // 插入 <ins> 元素
    const insElement = window.momoWidgetUtil.createInsElement(env, '5c92b35c15f04527')
    item.appendChild(insElement);

    // 插入 <script> 元素
    const adCodeElement = window.momoWidgetUtil.createAdCodeElement(env);
    item.appendChild(adCodeElement);

    itemWrapper.appendChild(item);
  }
  tenmaxContainer.appendChild(itemWrapper);

  const leftMask = document.createElement('span');
  leftMask.className = 'tenmax_style_mask tenmax_style_left_mask';
  tenmaxContainer.appendChild(leftMask);

  const leftBtn = document.createElement('a');
  leftBtn.className = 'tenmax_style_leftBtn';
  leftMask.appendChild(leftBtn);

  const rightMask = document.createElement('span');
  rightMask.className = 'tenmax_style_mask tenmax_style_right_mask';
  tenmaxContainer.appendChild(rightMask);

  const rightBtn = document.createElement('a');
  rightBtn.className = 'tenmax_style_rightBtn';
  rightMask.appendChild(rightBtn);

  const itemsPerView = 4;

  function showItems(startIndex) {
    var cards = document.querySelectorAll(`#${widgetId} .tenmax_style_item[data-index]`);
    for (var i = 0; i < cards.length; i++) {
      const displayIndex = (startIndex + i) % cards.length;
      const itemElement = document.querySelector(`#${widgetId} .tenmax_style_item[data-index="${displayIndex}"]`);
      itemElement.style.display = i < itemsPerView ? 'flex' : 'none';
      itemElement.style.order = i < itemsPerView ? i : -1;
    }
  }

  let currentStartIndex = 0;
  var moveCount = 1;
  rightBtn.addEventListener('click', () => {
    currentStartIndex = (currentStartIndex + moveCount) % finalItemCount;
    showItems(currentStartIndex);
  });

  leftBtn.addEventListener('click', () => {
    currentStartIndex = (currentStartIndex - moveCount + finalItemCount) % finalItemCount;
    showItems(currentStartIndex);
  });

  var tenmaxAdTarget = document.querySelector('#' + widgetId);
  tenmaxAdTarget.insertAdjacentElement('beforebegin', tenmaxContainer);
})();