/*
依照user-agent決定置換成 jpg 或 webp
*/
function getGoodsImgPathWebp(imgPath, userAgent, isMobile) {
  var isWebp = typeof (IS_WEBP_JS) == 'boolean' && IS_WEBP_JS;//from jsp
  if (!imgPath || imgPath == '') {
    return imgPath;
  }

  isMobile = !!isMobile;

  var outputPath;
  var isJpgOnly = !userAgent || userAgent == ''
    || userAgent.indexOf('MSIE') > -1
    || userAgent.indexOf('Trident') > -1
    || (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 0);
  if (!isWebp || isJpgOnly) {
    outputPath = imgPath.replace('.webp', '.jpg');
  } else {
    outputPath = imgPath.replace('.jpg', '.webp');
  }
  if (!isMobile) {
    outputPath = outputPath.replace('_m', '');
  }
  return outputPath;
}

var byPassNum = 0;
var ImgServerTotal = 4;
$.extend({//因為放在momo.js前面，注意momoj宣告時機。
  getImgSrcCloud: function (settings) {//雲端壓圖
    var _defaultSettings = {
      org: ''
    }
    var _settings = momoj.extend(_defaultSettings, settings);
    if (_settings.org == '') return '';

    var _rtnImgS = '';
    if (_settings.org.match(/^\//)) {
      if (document.location.href.match(/ecmdev.momoshop.com.tw/i)
        || document.location.href.indexOf('ecmuati.momoshop.com.tw') > -1
        || /ecmuat[1]?[0-9]{1}\./.test(document.location.href)
        || /ecmqc[1]?[0-9]{1}\./.test(document.location.href)
      ) {
        _rtnImgS = _settings.org;
      } else {
        var isBalanceImgDomain = typeof (BALANCE_IMG_DOMAIN_JS) != 'undefined' && BALANCE_IMG_DOMAIN_JS != '';//from jsp
        var imgDomain = isBalanceImgDomain ? BALANCE_IMG_DOMAIN_JS : '//img<BYPASS>.momoshop.com.tw';

        byPassNum = (byPassNum % ImgServerTotal) + 1;
        _rtnImgS = imgDomain.replace('<BYPASS>', byPassNum) + _settings.org;
      }
    } else {
      _rtnImgS = _settings.org;
    }
    return _rtnImgS;
  }
});