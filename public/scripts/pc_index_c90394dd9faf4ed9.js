
(async function () {
  // widget 初始化環境變數
  function widgetInit() {
    return new Promise(resolve => {
      var host = document.currentScript.src.split('/widget')[0];
      let style = document.createElement('script');
      style.setAttribute('src', `${host}/widget/js/momo-widget-util.js`);
      style.addEventListener("load", resolve, {once: true});
      document.head.appendChild(style);
    });
  }

  var scriptElement = document.currentScript; // before await
  await widgetInit();
  const debug = window.momoWidgetUtil.print('PC首頁版位(Banner+O圖)_限時搶購與爆殺24上方');
  const env = window.momoWidgetUtil.getEnvParams(scriptElement);
  const widgetId = env.widgetId;
  const resourceHost = env.resourceHost;
  const pmaxHost = env.pmaxHost;

  // 實作 widget 內容 ...
  // 插入版位及 adcode 到 widget script tag 的位置
  const insElement = window.momoWidgetUtil.createInsElement(env, 'c90394dd9faf4ed9')
  const adCodeElement = window.momoWidgetUtil.createAdCodeElement(env);
  var widgetScriptElement = document.querySelector('#' + widgetId);
  widgetScriptElement.insertAdjacentElement('beforebegin', insElement);
  widgetScriptElement.insertAdjacentElement('beforebegin', adCodeElement);

// adcode hook function
  var rmaxads = (window.rmaxads || (window.rmaxads = {}));
    (rmaxads.cmd || (rmaxads.cmd = [])).push(function (rmaxads) {
      rmaxads.on('space', function (space) {
        space.on('display', function (ad) {
          if (ad && space.spaceId === 'c90394dd9faf4ed9') {
            if (ad) {
              var channel = ad.channel;
              var cid = channel.cid;
              var crid = parseInt(channel.crid, 10) - 10000000;
              var advertiserId = channel.context.advertiserId;

              debug(`廣告主 :  ${advertiserId}, 廣告活動編號 : ${cid}, 素材`, `${pmaxHost}/creatives/${crid}/edit`)
            }

            var iframe = space.element.querySelector('iframe');
            iframe.style['margin-top'] = '20px'; // 2024-04-16 : 上 20 px
            var iframeDocument, sponsorImg;

             // 等待 版位的原生樣式載入到畫面後做後續處理
             window.momoWidgetUtil.until(() => {
               iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
               sponsorImg = iframeDocument.querySelector('img[sponsor]');
               return sponsorImg != null;
             }, () => {
               // 插入 [贊助] 圖片
               sponsorImg.src = `${resourceHost}/widget/images/ad_tag.svg`;
               sponsorImg.style.display = 'block';
             })
          }
        });
      });
    });


})();



