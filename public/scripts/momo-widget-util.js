window.momoWidgetUtil = window.momoWidgetUtil || {
  createAdCodeElement: function (env) {
    const element = document.createElement('script');
    element.async = true;
    element.src = env.adCodePath;

    return element;
  },
  createInsElement: function (env, spaceId) {
    const element = document.createElement('ins');
    element.className = 'rmax';
    element.setAttribute('data-rmax-space-id', spaceId);
    element.setAttribute('data-rmax-space-type', 'UNIVERSAL');
    element.setAttribute('data-ssp-host', env.sspHost);
    element.setAttribute('data-rmax-group-id', env.widgetId);

    if (env.departmentCode) {
      element.setAttribute('data-department-code', env.departmentCode);
    }

    return element;
  },

  print: function (title) {
    // eslint-disable-next-line no-console
    return console['debug'].bind(
      console,
      `%cmomo%cSSP%c ${title}`,
      'padding: 0.2em 0 0.2em 0.5em; font-weight:700; background: #111; color: #66ffcc',
      'padding: 0.2em 0.5em 0.2em 0; font-weight:700; background: #111; color: #9999ff',
      'background: inherit; color: inherit');
  },

  getUrlParams: function (url) {
    if (url.indexOf('?') == -1) {
      return {};
    }
    var arr = url.split('?');
    return decodeURI(url.split('?')[1]).substring(0).split('&').reduce(function (acc, str) {
      if (str) {
        var i = str.indexOf('=');
        acc[i < 0 ? str : str.substring(0, i)] = i < 0 ? true : str.substring(i + 1);
      }
      return acc;
    }, {});
  },

  until: function (a, b) {
    const _self = this;
    if (a()) {
      b();
    } else {
      setTimeout(function () {
        _self.until(a, b)
      }, 10)
    }
  },

  sspHostByHost: function (host) {
    if (host.indexOf('//momo-jp-static-beta.s3.') != -1)  {
      return 'stage'
    }

    if (host.indexOf('//uat-static-cdn.momoshop.com.tw') != -1 || host.indexOf('//momo-jp-static-uat.s3') != -1)  {
      return 'uat'
    }
  },

  buildStyle: function (env) {
    return new Promise(resolve => {
      let style = document.createElement('link');
      style.setAttribute('type', 'text/css');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', `${env.resourceHost}/widget/css/mobile_productCrads.css`);
      style.addEventListener("load", resolve, {
        once: true
      });
      document.head.appendChild(style);
    });
  },

  getEnvParams: function (scriptElement) {
    var host = scriptElement.src.split('/widget/')[0];
    var widgetId = scriptElement.src.split('/widget/')[1].split('.js')[0];
    scriptElement.setAttribute("id", widgetId);

    var departmentCode = scriptElement.getAttribute('data-department-code');
    const urlParams = this.getUrlParams(location.href);
    const scriptParams = this.getUrlParams(scriptElement.src);
    const mergedParams = Object.assign({}, scriptParams, urlParams); // url 覆蓋 script.src
    const isScriptFromUat = scriptElement.src.indexOf('uat-static-cdn.momoshop.com.tw') != -1;
    const sspHost = mergedParams['sspHost'] || this.sspHostByHost(host) || 'prod'; // 從 js or url request param 控制 ssp host
    const resourceHost = host;

    if (isScriptFromUat) {
        mergedParams.adCodeHost = 'uat'; // 因為 momo uat 環境只能連 uat, 連不到 prod
    }

    let adCodeHost = host;
    // [開發用] 如果 script 是 local, adcode 就用 prod 的 adcode

    var adCodePath = '';
    if (mergedParams.adCodeHost == 'prod' || !mergedParams.adCodeHost) {
       adCodePath = '//https://static-cdn.momoshop.com.tw/adcode/momo-adsbytenmax.js';
    } else if (mergedParams.adCodeHost == 'uat') {
       adCodePath = '//https://uat-static-cdn.momoshop.com.tw/adcode/momo-adsbytenmax.js';
    } else if (mergedParams.adCodeHost == 'stage') {
       adCodePath = '/* https://momo-jp-static-beta.s3.ap-northeast-1.amazonaws.com/adcode/momo-adsbytenmax.js */';
    } else if (mergedParams.adCodeHost == 'local') {
       adCodePath = '/* http://0.0.0.0:8080/dist/adsbytenmax.js */';
    }

    let pmaxHost;
    if (sspHost == 'prod') {
      pmaxHost = `/* https://dsp.momoshop.com.tw`; */
    } else if (sspHost == 'uat') {
      pmaxHost = `/* https://uat-dsp.momoshop.com.tw`; */
    } else if (sspHost == 'stage') {
      pmaxHost = `/* https://beta-dsp.momo.tenmax.tw`; */
    }

    window.momoWidget = window.momoWidget || {};
    window.momoWidget[widgetId] = {}

    const env = {
      widgetId: widgetId,
      departmentCode: departmentCode,

      sspHost: sspHost,
      resourceHost: resourceHost,
      pmaxHost: pmaxHost,
      adCodePath: adCodePath
    }
    console.debug(widgetId, 'env', env)

    return env;
  }
}