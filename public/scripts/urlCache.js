var oUrlCache = new UrlCache();

function UrlCache() {
  var urlCacheKey = 'momoUrlCache';
  var nowUrlKey = 'now';
  var prevUrlKey = 'prev';
  var nextUrlKey = 'next';

  var nowUrlTypeKey = 'nowType';
  var prevUrlTypeKey = 'prevType';
  var nextUrlTypeKey = 'nextType';

  var oStorageTool = new StorageTool(urlCacheKey);

  this.TYPE_MAIN = '1';
  this.TYPE_GOODS = '2';
  this.TYPE_SEARCH = '3';
  this.TYPE_CATEGORY = '4';
  this.TYPE_PROMO_LIST = '5';

  //紀錄
  this.save = function () {
    oStorageTool.process(funcMain);

    function funcMain(json) {
      if (momoj.isEmptyObject(json) || !json[nowUrlKey]) {
        json[nowUrlKey] = '';
        json[nowUrlTypeKey] = '';
      }

      json[prevUrlKey] = json[nowUrlKey];
      json[prevUrlTypeKey] = json[nowUrlTypeKey];

      json[nowUrlKey] = location.href;
      json[nowUrlTypeKey] = getUrlType(location.pathname);
    }
  }

  //取得現在
  this.getNowUrl = function () {
    return oStorageTool.get()[nowUrlKey] || '';
  }

  //取得上一個
  this.getPrevUrl = function () {
    return oStorageTool.get()[prevUrlKey] || '';
  }

  //取得下一個
  this.getNextUrl = function () {
    return oStorageTool.get()[nextUrlKey] || '';
  }

  //取得現在
  this.getNowUrlType = function () {
    return oStorageTool.get()[nowUrlTypeKey] || '';
  }

  //取得上一個
  this.getPrevUrlType = function () {
    return oStorageTool.get()[prevUrlTypeKey] || '';
  }

  //取得下一個
  this.getNextUrlType = function () {
    return oStorageTool.get()[nextUrlTypeKey] || '';
  }

  //紀錄下個目標
  this.setNextData = function (url, pathName) {
    oStorageTool.process(funcMain);

    function funcMain(json) {
      json[nextUrlKey] = url;
      json[nextUrlTypeKey] = getUrlType(pathName);
    }
  }

  //加上sourcePageType
  this.appendSourcePageType = function (sourcePageType) {
    momoj('a').each(function () {
      var container = momoj(this);
      var origHref = container.attr('href') || '';
      if (origHref.indexOf('/') > -1 && origHref.indexOf('(') == -1 && origHref.indexOf(')') == -1) {
        var href2 = origHref.indexOf('?') > -1 ? '&' : '?';
        container.attr('href', origHref + href2 + 'sourcePageType={0}'.format(sourcePageType || ''));
      }
    });
  }

  //類型
  function getUrlType(pathName) {
    var type = '';
    if (pathName.indexOf('/Main.jsp') > -1 || pathName.indexOf('/main.momo') > -1) {
      type = this.TYPE_MAIN;
    }

    if (type == '' & typeof strUrlType == 'string' && strUrlType != '') {
      type = strUrlType;
    }
    return type;
  }
}