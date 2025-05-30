/**
 * tv直播影音撥放處理
 * @author lckao 2020.07.15
 * @param momoj
 */

var isThisMomoshopBol = function () {
  try {
    return isThisMomoshop && isThisMomoshop == true;//isThisMomoshop is declare in momo.js
  } catch (e) {
    return false;
  }
}

var getM3u8VideoWidth = function () {
  var windowWidth = 0;

  if (isThisMomoshopBol()) {
    windowWidth = Math.min(850, momoj(window).width());
  } else {
    windowWidth = momoj(window).width();
  }

  return windowWidth;
}

var getM3u8VideoHeight = function () {
  var windowHeight = 0;

  if (isThisMomoshopBol()) {
    windowHeight = Math.min(440, momoj(window).height());
  } else {
    windowHeight = momoj(window).height() - 40;
  }

  return windowHeight;
}

var _tvLiveOpenFlag = '0';
var _videoTvLivePlayer = null;//全域化。因為resize 事件看起來只能永遠一個，所以讓小網video.js的resize function可以使用。
(function (momoj) {
  var uagt = navigator.userAgent;
  var _tvLiveArea = null;
  var _tvLiveDiv = null;
  var _momoTvLiveVideo = null;
  var _m3u8Btn = null;

  var _tvSettings = {
    tvLiveArea: "tvLiveArea",      //播放區域的黑背景(ID)
    tvLiveDiv: "tvLiveDiv",        //播放區域(ID)
    momoTvLiveVideo: "momoTvLiveVideo",  //內嵌iframe撥放(ID)
  };

  momoj.fn.extend({
    /** 電視購物。使用點在主頁的ready處 in 小網**/
    MShowTvLive: function (callback) {
      var container = momoj(this);
	  if (container.length) {
      momoj.getScript("//image.momoshop.com.tw/ecm/js/tvLiveOnData.js?t=" + parseInt(new Date().getTime() / 60000), function () {
        var _defaultSettings = {
          prdUrl: '/goods.momo?i_code='
        };
        var containerUl = container.find("ul").eq(0);
        containerUl.html("");
        for (var i = 0; i < 3; i++) {

          var _data = _tvLiveOnData[i];

          if (!/^[0-9]+$/.test(_data.operator)) {
            _data.operator = new Date().getTime();
          }

          var _tvLink = _defaultSettings.prdUrl + changeUnixCode(_data.goodsCode) + _data.statistics;
          var _tvImg = '//https://img1.momoshop.com.tw/' + changeUnixCode(_data.operator) + '/goodsimg/' + _data.goodsimg;
          var _areaStr = changeUnixCode(_data.area) + '台';
          var _priceClass = 'price';
          if (_data.area == '03') {
            _tvLink = _data.youtubeUrl;
            _tvImg = _data.goodsimg;
            _areaStr = '網路';
            _priceClass = 'liveSubTitle';
          }
          var _imgTagUrl = _data.imgTagUrl;
          var _imgTagSpan = '';
          if (_imgTagUrl != '' && typeof _imgTagUrl != 'undefined') {
            _imgTagSpan = '<span class="goodsImgTag"><img src="//image.momoshop.com.tw/ecm/img/cmm/blank.png" org="' + _imgTagUrl + '" lazy="2" ></span>';
          }
          var _liDiv = '<li>';
          if (_data.area != '03') {
            _liDiv += '<a href="' + _tvLink + '"  title="' + changeUnixCode(_data.prdNme) + '" >';
            _liDiv += '<div class="prdGoodsImgWrap">' + _imgTagSpan;
            _liDiv += '<img src="//image.momoshop.com.tw/ecm/img/cmm/blank.png" org="' + _tvImg + '" alt="' + changeUnixCode(_data.prdNme) + '" title="' + changeUnixCode(_data.prdNme) + '" lazy="2" />';
            _liDiv += '</div>';
            _liDiv += '<p class="prdName">' + changeUnixCode(_data.prdNme) + '</p>';
            _liDiv += '<p class="priceArea"><span class="' + _priceClass + '">' + changeUnixCode(_data.salePrice) + '</span></p>';
            _liDiv += '<p class="tvchannel" style="background-color:#d60000">' + _areaStr + 'LIVE</p>'; //2019050600067799移除網路LIVE押標
            _liDiv += '</a>';
          } else {
            _liDiv += '<a href="' + _tvLink + '"  title="' + changeUnixCode(_data.prdNme) + '" >';
            _liDiv += '<div class="prdGoodsImgWrap">' + _imgTagSpan;
            _liDiv += '<img src="//image.momoshop.com.tw/ecm/img/cmm/blank.png" org="' + _tvImg + '" alt="' + changeUnixCode(_data.prdNme) + '" title="' + changeUnixCode(_data.prdNme) + '" lazy="2" />';
            _liDiv += '</div>';
            _liDiv += '</a>';
            _liDiv += '<a href="' + _data.characterUrl + '"  title="' + changeUnixCode(_data.prdNme) + '" >';
            _liDiv += '<p class="prdName">' + changeUnixCode(_data.prdNme) + '</p>';
            _liDiv += '<p class="priceArea"><span class="' + _priceClass + '">' + changeUnixCode(_data.salePrice) + '</span></p>';
            _liDiv += '</a>';
          }

          if (_data.area == '01' || _data.area == '02') {
            var youtubeUrl = _data.youtubeUrl;
            var vlinkUrl = youtubeUrl && youtubeUrl.indexOf('.m3u8') > -1 ? youtubeUrl : '';
            if (vlinkUrl == '') {
              if (_data.area == '01') {
                vlinkUrl = '//https://tvlive-cdn.momoshop.com.tw/live-http/_definst_/vod169_Live/live/playlist.m3u8';
              } else {
                vlinkUrl = '//https://tvlive-cdn.momoshop.com.tw/live-http/_definst_/vod169_Live/live2/playlist.m3u8';
              }
            }

            _liDiv += '<a class="playArea videoLiveBtn" vlink="' + vlinkUrl + '" title="觀看影音">';
            _liDiv += '  <img src="//image.momoshop.com.tw/ecm/img/cmm/blank.png" org="https://img1.momoshop.com.tw/ecm/img/cmm/mobile/videBtnBk.png?t=20180117001" lazy="2" />';
            _liDiv += '</a>';
          }

          _liDiv += '</li>';
          containerUl.append(_liDiv);
        }
        container.find(".playArea").show();

        container.find("ul > li > .videoLiveBtn").bindClickTvM3u8();
      });
	  }
    },
    /** 綁定直播 in 大網 **/
    tvLiveOnLoad: function (options) {
      var settings = {
        threshold: 0,
        failurelimit: 0,
        event: "scroll",
        effect: "show",
        container: window
      };

      if (options) {
        momoj.extend(settings, options);
      }
      var elements = this;
      if ("scroll" == settings.event) {
        momoj(settings.container).bind("scroll", function (event) {
          var counter = 0;
          elements.each(function () {
            if (!this.loaded && !momoj.belowthefold(this, settings) &&
              !momoj.rightoffold(this, settings) && !momoj(this).is(":hidden")) {
              momoj(this).trigger("appear");
            }
          });
          var temp = momoj.grep(elements, function (element) {
            return !element.loaded;
          });
          elements = momoj(temp);
        });
      }
      this.each(function () {
        var self = this;
        momoj(self).one("appear", function () {
          if (!this.loaded) {
            momoj.ajax({
              url: "/ecm/js/tvLiveOn.js?t=20201119001",
              dataType: "script",
              cache: true,
              success: function () { }
            });
            self.loaded = true;
          };
        });
        if (momoj(self).is(":hidden")) {
          momoj(self).one("mousemove", function () {
            momoj(this).trigger("appear");
          });
        }
        if ("scroll" != settings.event) {
          momoj(self).bind(settings.event, function (event) {
            if (!self.loaded) {
              momoj(self).trigger("appear");
            }
          });
        }
      });
    },
    /*** 初始化tv live播放區域
     *   css在videoM3u8.css
     * * @param tvLiveArea     播放區域的黑背景(ID)
     * * @param tvLiveDiv      播放區域(ID)
     * * @param momoTvLiveVideo   內嵌iframe撥放(ID)
     */
    initTvM3u8: function () {

      var windowWidth = getM3u8VideoWidth();
      var windowHeight = getM3u8VideoHeight();
      var titleClass;

      if (isThisMomoshopBol()) {
        titleClass = 'videoTitle1';
      } else {
        titleClass = 'videoTitle2';
      }

      //寫入撥放區域語法
      var m3u8Html = '<div id="' + _tvSettings.tvLiveArea + '" class="m3u8blackBk">';
      m3u8Html += '  <div class="videoTitle ' + titleClass + '"><a id="m3u8closeBtn">&#38364;&#38281;&#24433;&#29255;</a></div>';
      m3u8Html += '  <div id = "' + _tvSettings.tvLiveDiv + '" class="wrapM3u8">';
      m3u8Html += '    <video id="' + _tvSettings.momoTvLiveVideo + '" width="' + windowWidth + 'px" height="' + windowHeight + 'px" class="video-js vjs-default-skin"                                           ';
      m3u8Html += '           playsinline webkit-playsinline                             ';
      m3u8Html += '           autoplay                                                   ';
      m3u8Html += '           controls preload="auto"                                    ';
      m3u8Html += '           x-webkit-airplay="true"                                    ';
      m3u8Html += '           x5-video-player-fullscreen="true"                          ';
      m3u8Html += '           x5-video-player-typ="h5"                                   ';
      m3u8Html += '    >                                                                 ';
      m3u8Html += '      <source src="//https://tvlive-cdn.momoshop.com.tw/live-http/_definst_/vod169_Live/live2/playlist.m3u8" type="application/x-mpegURL"> ';
      m3u8Html += '    </video>';
      m3u8Html += '  </div>';
      m3u8Html += '</div>';
      momoj("body").append(m3u8Html);//寫入撥放區域語法

      _tvLiveArea = momoj('#' + _tvSettings.tvLiveArea);
      _tvLiveDiv = momoj('#' + _tvSettings.tvLiveDiv);
      _momoTvLiveVideo = momoj('#' + _tvSettings.momoTvLiveVideo);

      _tvLiveArea.hide();

      //關閉浮層事件
      momoj('#m3u8closeBtn').click(function () {
        if (isThisMomoshopBol()) {
          momoj('.fancybox-overlay').hide();
        }

        momoj('.footerArea').show();
        momoj('.content').show();

        momoj("body").removeClass("scrollHide");
        _tvLiveArea.hide();

        if (_videoTvLivePlayer == null) {
          _videoTvLivePlayer = videojs(_tvSettings.momoTvLiveVideo);//lazy Load
        }
        _videoTvLivePlayer.pause();
        _tvLiveOpenFlag = '0';
      });
    },
    //綁定影音開啟事件
    bindClickTvM3u8: function () {
      var container = momoj(this);
      if (container) {
        container.off("click").on("click", function () {
          var comtainer = momoj(this);
          var vlink = comtainer.attr("vlink");
          playM3u8(vlink);
          return false;
        });
      }
    },
    //播放m3u8
    playM3u8: function (vlink) {
      playM3u8(vlink);
    }
  });

  /**因為抓取的js資料檔裡面的編碼是unix code 所以用innerHTML轉馬**/
  var changeUnixCode = function (unix) {
    return momoj("<transfer>").html(unix).text();
  }

  var playM3u8 = function (vlink) {
    momoj('.footerArea').hide(); //隱藏小網內容，以減少其他干擾
    momoj('.content').hide(); //隱藏小網內容，以減少其他干擾

    if (_videoTvLivePlayer == null) {
      _videoTvLivePlayer = videojs(_tvSettings.momoTvLiveVideo);//lazy Load
    }
    _videoTvLivePlayer.src([{ type: "application/x-mpegURL", src: vlink }]); //每次點選重新reload來源
    _momoTvLiveVideo.find('source').attr("src", vlink);           //每次點選重新reload來源
    momoj("body").addClass("scrollHide");                    //加入瀏覽定點

    var windowWidth = getM3u8VideoWidth();
    var windowHeight = getM3u8VideoHeight();

    _videoTvLivePlayer.width(windowWidth);
    _videoTvLivePlayer.height(windowHeight);

    if (isThisMomoshopBol()) {
      var areaWidth = windowWidth;
      var areaHeight = windowHeight + 40;
      var areaLeft = (momoj(window).width() - areaWidth) / 2;
      var areaTop = (momoj(window).height() - areaHeight) / 2;

      _tvLiveArea.css({
        'width': areaWidth,
        'height': areaHeight,
        'top': areaTop,
        'left': areaLeft
      });

      typeof bkArea == 'function' && bkArea();
    }

    _tvLiveArea.show();                                      //開啟影音瀏覽
    _tvLiveOpenFlag = '1';

    _videoTvLivePlayer.play();
  }
})(momoj);

momoj(document).ready(function () {
  momoj().initTvM3u8();
});