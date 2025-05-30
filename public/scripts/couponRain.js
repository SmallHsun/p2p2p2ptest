/*
 * 全站搶紅包 
 * ecchao 2017.10.24 雙十一紅包雨
 * ecchao 2017.12.06 雙十二元寶雨
 * hhyang 2018.01.22 全站搶福袋
 * yzhsieh 2018.04.10-13 全站下頭
 * ecchao 2018.05.03 全站下禮物
 * ecchao 2018.06.08 年中大促足球
 * hhyang 2018.07.11 全球購物節
 * ychsiung 2018.08.03 放閃購物節
 * ychsiung 2018.08.31 99購物節
 * hhyang 2018.10.02 終極加碼日
 * ychsiung 2018.10.19 雙十一紅包雨
 * ecchao 2018.11.08 雙十一紅包雨(call 雲端版)
 * hhyang 2018.12.05 雙十二紅包雨(call 雲端版)
 * zihsu 2019.01.02 年貨節紅包雨(call 雲端版)
 * zihsu 2019.02.22 驚奇購物節紅包雨(call 雲端版)
 * ecchao 2019.04.30 寵愛女神節紅包雨(call 雲端版)
 * sjchiang 2019.10.28 雙十一紅包雨(call 雲端版)
 * sjchiang 2019.11.28 雙十二紅包雨(call 雲端版)
 * sjchiang 2020.10.03 雙十一紅包雨(call 雲端版)
 * fhchen 2021.10.26 雙十一紅包雨(call 雲端版)
 * yzhsieh 2022.11.02 雙十一紅包雨(call 雲端版)
 */

var cloudLotteryRainPromo = {
  mPromoNo  : 'U20221111001',
  dtPromoNo : 'D20221111001',
  url    : '//https://event.momoshop.com.tw/promoMechReg.PROMO',
  imgUrl : '//https://image.momoshop.com.tw/ecm/img/online/couponRain/images/',
  img: {
    'A'        : 'game_end_done.jpg',
    'END'      : 'game_end_off.jpg',
    'FULL'     : 'game_end_off.jpg',
  //獎項
    'gift1'    : 'game_end_coupon_4.jpg',//哈根達斯
    'gift2'    : 'game_end_coupon_5.jpg',//麗寶樂園
    'gift3'    : 'game_end_coupon_1.jpg',//Uber
    'gift4'    : 'game_end_coupon_3.jpg',//聯想耳機
    'mo_1'     : 'game_end_m1.jpg',
    'mo_2'     : 'game_end_m2.jpg',
    'mo_5'     : 'game_end_m5.jpg',
    'mo_11'    : 'game_end_m11.jpg',
    'mo_21'    : 'game_end_m21.jpg',
    'mo_111'   : 'game_end_m111.jpg',
    'mo_999'   : 'game_end_m999.jpg'
  },
  prize : {
    'gift1'    : '哈根達斯',
    'gift2'    : '麗寶樂園',
    'gift3'    : 'Uber',
    'gift4'    : '聯想耳機',
    'mo_1'     : 'momo幣$1',
    'mo_2'     : 'momo幣$2',
    'mo_5'     : 'momo幣$5',
    'mo_11'    : 'momo幣$11',
    'mo_21'    : 'momo幣$21',
    'mo_111'   : 'momo幣$111',
    'mo_999'   : 'momo幣$999'
  }
};

let time = (typeof(raining_second) != 'undefined') ? raining_second : 10; //紅包雨計時
let cloudLotteryRainPromoImg = (typeof(raining_giftMap) != 'undefined') ? raining_giftMap : cloudLotteryRainPromo.img;
cloudLotteryRainPromo.timestamp = '?rn=' + ((typeof(raining_timestamp) != 'undefined') ? raining_timestamp : Math.random());

//紅包的html
let cloudLotteryRainPromoTemplate=[
'<!doctype html>',
'<html>',
  '<head>',
    '<meta charset="utf-8">',
  '<!--',
    '<meta name="viewport" content="width=1220">',
  '-->',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, maximum-scale=1.0, viewport-fit=cover">',
    '<meta name="format-detection" content="telephone=no">',
    '<meta name="format-detection" content="address=no">',
    '<title>momo購物網</title>',
    '<style type="text/css">',
      'body{',
        'margin: 0 ;',
        'padding: 0;',
        'background: url(' + cloudLotteryRainPromo.imgUrl + 'bg.png) no-repeat center top;',
      '}',
      '@media screen and (max-width:767px){',
        'body{',
          'background: url(' + cloudLotteryRainPromo.imgUrl + 'm_bg.png) no-repeat center top;',
          'background-size: 100%;',
        '}',
      '}',
    '</style>',
  '</head>',
  '<body>',
  '<!--紅包雨CSS-->',
    '<style type="text/css">',
    '/*紅包區塊*/',
      '#snowArea{}',
      '#snowArea .snowbox_{',
        'z-index: 99;',
        'position: fixed;',
        'bottom: -200px;',
        'aspect-ratio: auto 1/1;',
      '}',
      '#snowArea .snowbox_ img{',
        'width: 100%;',
        'height: auto;',
      '}',
      '#snowArea .snowbox_{',
        'background-size: 100%;',
        'background-repeat: no-repeat;',
      '}',
      '#snowArea .snowbox_icon_a{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a1.gif);',
      '}',
      '#snowArea .snowbox_icon_a.snowbox_icon_1{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a1.gif);',
      '}',
      '#snowArea .snowbox_icon_a.snowbox_icon_2{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a2.gif);',
      '}',
      '#snowArea .snowbox_icon_a.snowbox_icon_3{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a3.gif);',
      '}',
    '/*',
      '#snowArea .snowbox_icon_b{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'b1.gif);',
        'background-size: 80%;',
      '}',
    '*/',
    '/*',
      '#snowArea .snowbox_icon_b.snowbox_icon_1{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a1.gif);',
      '}',
      '#snowArea .snowbox_icon_b.snowbox_icon_2{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a2.gif);',
      '}',
      '#snowArea .snowbox_icon_b.snowbox_icon_3{',
        'background-image: url(' + cloudLotteryRainPromo.imgUrl + 'a3.gif);',
      '}',
    '*/',
      '@media screen and (max-width:767px){',
        '#snowArea .snowbox_{',
          'z-index: 5;',
        '}',
      '}',
      '#snowArea .snowbox_{',
        '-webkit-animation: snow-play 3s ease-in-out infinite alternate;',
        'animation: snow-play 3s ease-in-out infinite alternate;',
      '}',
      '@-webkit-keyframes snow-play{',
        '0%{',
          '-webkit-transform: translateX(0px) rotate(0deg);',
          'transform: translateX(0px) rotate(0deg);',
        '}',
        '50%{',
          '-webkit-transform: translateX(100px) rotate(20deg);',
          'transform: translateX(50px) rotate(20deg);',
        '}',
        '100%{',
          '-webkit-transform: translateX(0px) rotate(0deg);',
          'transform: translateX(0px) rotate(0deg);',
        '}',
      '}',
      '@keyframes snow-play{',
        '0%{',
          '-webkit-transform: translateX(0px) rotate(0deg);',
          'transform: translateX(0px) rotate(0deg);',
        '}',
        '50%{',
          '-webkit-transform: translateX(100px) rotate(20deg);',
          'transform: translateX(50px) rotate(20deg);',
        '}',
        '100%{',
          '-webkit-transform: translateX(0px) rotate(0deg);',
          'transform: translateX(0px) rotate(0deg);',
        '}',
      '}',
    '/*可點的紅包*/',
      '.snowbox_play{',
        'cursor: pointer;',
      '}',
    '/*結果*/',
      '#snowEND_Area{',
        'display: none;',
        'position: absolute;',
        'top: 50%;',
        'left: 50%;',
        '-webkit-transform-origin: 0% 0%;',
        '-moz-transform-origin: 0% 0%;',
        '-ms-transform-origin: 0% 0%;',
        '-o-transform-origin: 0% 0%;',
        'transform-origin: 0% 0%;',
        '-webkit-transform: scale(1) translate(-50%,-50%);',
        '-moz-transform: scale(1) translate(-50%,-50%);',
        '-ms-transform: scale(1) translate(-50%,-50%);',
        '-o-transform: scale(1) translate(-50%,-50%);',
        'transform: scale(1) translate(-50%,-50%);',
        '-webkit-animation: HEARTBEAT-play 2.5s infinite;',
        '-moz-animation: HEARTBEAT-play 2.5s infinite;',
        '-ms-animation: HEARTBEAT-play 2.5s infinite;',
        '-o-animation: HEARTBEAT-play 2.5s infinite;',
        'animation: HEARTBEAT-play 2.5s infinite;',
      '}',
      '#snowEND_Area .snowEND{',
        'position: relative;',
        '-webkit-animation: snowEND-play 1s 1 ease-in-out;',
        '-moz-animation: snowEND-play 1s 1 ease-in-out;',
        '-ms-animation: snowEND-play 1s 1 ease-in-out;',
        '-o-animation: snowEND-play 1s 1 ease-in-out;',
        'animation: snowEND-play 1s 1 ease-in-out;',
      '}',
      '#snowEND_Area .snowEND img{',
        'width: 100%;',
        'height: auto;',
      '}',
      '#snowEND_Area .closeBN a{',
        'z-index: 11;',
        'position: absolute;',
        'top: -10px;',
        'right: -10px;',
        'display: block;',
        'width: 40px;',
        'height: 40px;',
        'border-radius: 50%;',
        'border: solid 2px #999999;',
        'font: bold 40px/1em "Century Gothic";',
        'color: #FFF;',
        'text-align: center;',
        'background-color: rgba(0%,0%,0%,0.5);',
        'text-decoration: none;',
        'cursor: pointer;',
      '}',
      '#snowEND_Area .closeBN a:hover{',
        'background-color: #666;',
        'text-decoration: none;',
      '}',
      '@media screen and (max-width:767px){',
        '#snowEND_Area{',
          'width: 100%;',
        '}',
        '#snowEND_Area .snowEND_Area{',
          'width: 100%;',
        '}',
        '#snowEND_Area .snowEND{',
          'margin: 0 auto;',
          'width: 90%;',
          'height: auto;',
        '}',
        '#snowEND_Area .closeBN a{',
          'top: -10px;',
          'right: -10px;',
        '}',
      '}',
      '@-webkit-keyframes snowEND-play{',
        'from{',
          '-webkit-transform: scale(0) rotate(-1080deg);',
          'transform: scale(0) rotate(-1080deg);',
          'top: -600px;',
        '}',
        'to{',
          '-webkit-transform: scale(1) rotate(0deg);',
          'transform: scale(1) rotate(0deg);',
          'top: 0;',
        '}',
      '}',
      '@keyframes snowEND-play{',
        'from{',
          '-webkit-transform: scale(0) rotate(-1080deg);',
          'transform: scale(0) rotate(-1080deg);',
          'top:-600px;',
        '}',
        'to{',
          '-webkit-transform: scale(1) rotate(0deg);',
          'transform: scale(1) rotate(0deg);',
          'top: 0;',
        '}',
      '}',
    '</style>',
  '<!--紅包雨HTML-->',
    '<div id="snowArea">',
    '<!--倒數-->',
    '<!--',
      '<div id="snow_time"><small>倒數 </small><b>00</b><small> 秒</small></div>',
    '-->',
    '<!--背景-->',
    '<!--',
      '<div id="snow_bg"></div>',
    '-->',
    '<!--開始-->',
      '<div id="snow_go"></div>',
    '<!--結果-->',
      '<div id="snowEND_Area" style="display: none;"><div class="snowEND"><img src="' + cloudLotteryRainPromo.imgUrl + cloudLotteryRainPromoImg['END'] + cloudLotteryRainPromo.timestamp + '"><div class="closeBN"><a>×</a></div></div></div>',
    '<!--彈跳視窗套件(折價券＆登記共用)-->',
      '<script charset="utf-8" data-title="SweetAlert2彈跳視窗套件" language="javascript" type="text/javascript" src="//https://image.momoshop.com.tw/ecm/js/edm/sweetalert2.all.min.js?t=202011170001"></script>',
    '</div>',
  '</body>',
'</html>'
].join('');


//★雲端紅包雨抽獎活動ajax★
var cloudLotteryRainPromoAjaxKey = false;
function cloudLotteryRainPromoAjax(data) {
  if(cloudLotteryRainPromoAjaxKey == false) {
    cloudLotteryRainPromoAjaxKey = true;
    var result = '-1';
    momoj.ajax({
      url : cloudLotteryRainPromo.url,
      async : false,
      cache : false,
      type : 'POST',
      dataType : 'json',
      contentType : 'application/json;charset=utf-8',
      xhrFields:{withCredentials: true},
      data        :JSON.stringify(data),
      timeout : 30000,
      success : function(rtnData) {
        var status = rtnData.returnMsg;
        if(typeof status == 'undefined' || status == '' || status == 'ERR') {
          Swal.fire({
            icon: 'error',
            title: '很抱歉，目前系統繁忙，請稍後再試',
            confirmButtonText: '確認'
          });
        }else if(status === 'D') {
          time = -3;
          Swal.fire({
            icon: 'warning',
            title: '請於活動時間內登入參加',
            confirmButtonText: '確認'
          });
        }else if(status === 'L') {
          time = -3;
          Swal.fire({
            icon: 'warning',
            title: '請重新登入會員',
            confirmButtonText: '確認'
          });
        }else {
          result = rtnData;
        }
        cloudLotteryRainPromoAjaxKey = false;
      },
      error : function(err, msg1, msg2) {
        Swal.fire({
          icon: 'error',
          title: 'ERROR 很抱歉，目前系統繁忙，請稍後再試',
          confirmButtonText: '確認'
        });
        cloudLotteryRainPromoAjaxKey = false;
      }
    });
    return result;
  }
}

/*紅包雨計時*/
function clockSimpleBonusRainPC(){
  time = --time;
  if ( time < 0){
    momoj('#snowArea').fadeOut(1000);
  } 
  if ( time < -3){
    momoj('#snowArea').remove();
    top.momoj('#MoMoLMContent').empty();
    top.momoj().LayerMask({contentWidth:"100%", contentHeight:"680px"}).close();
    return;
  }
  setTimeout("clockSimpleBonusRainPC()",1000)
};

//開下雨的區域浮層
function rainArea(){
  top.momoj().LayerMask({contentWidth:"100%", contentHeight:"680px"}).open();
  top.momoj('#MoMoLMContent').empty();
  top.momoj('#MoMoLMContent').append(cloudLotteryRainPromoTemplate).css({position:"absolute", background:"transparent"});
  top.momoj('#MoMoLM').css({'background-color':'transparent', 'opacity':'1'});
}

//★參加雲端紅包雨抽獎活動★
var joinCloudLotteryRainPromoKey = false;
function joinCloudLotteryRainPromo(){
  if(!joinCloudLotteryRainPromoKey){
    joinCloudLotteryRainPromoKey = true;
    time = 1000;//登入限1000s，沒登就跳出

    momoj().MomoLogin({flag:false, LoginSuccess:function() {//判斷是否登入
      var data = {
        'm_promo_no'  : cloudLotteryRainPromo.mPromoNo,
        'dt_promo_no' : cloudLotteryRainPromo.dtPromoNo
      };

      var rtnData = cloudLotteryRainPromoAjax(data);
      if(rtnData != '-1') {
        let status = rtnData.returnMsg;
        if(status === 'FULL') {
          momoj('#snowEND_Area img').attr('src', cloudLotteryRainPromo.imgUrl + cloudLotteryRainPromoImg[status] + cloudLotteryRainPromo.timestamp);
        }else if(status === 'A') {
          momoj('#snowEND_Area img').attr('src', cloudLotteryRainPromo.imgUrl + cloudLotteryRainPromoImg[status] + cloudLotteryRainPromo.timestamp);
        }else if(status === 'INS') {
          let prize = rtnData.prize;
          momoj('#snowEND_Area img').attr('src', cloudLotteryRainPromo.imgUrl + cloudLotteryRainPromoImg[prize] + cloudLotteryRainPromo.timestamp);
        }
        momoj('#snowEND_Area').show();
        joinCloudLotteryRainPromoKey = false;
        time = 5;
      }
    }});
  }
}


// 關閉浮層
function closeDiv() {
  top.momoj().LayerMask().close();
}

//下雨動作
function raining(){
  rainArea();
  snowboxFu();
  clockSimpleBonusRainPC();
}

//撒紅包
function snowboxFu(options){
  var con     = '#snow_go';
  //snowbox_play觸發結果
  var flake1 = momoj('<div class="snowbox_ snowbox_icon_a snowbox_play"/>').html('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>'),
      flake2 = momoj('<div class="snowbox_ snowbox_icon_a snowbox_play"/>').html('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>'),
      flake3 = momoj('<div class="snowbox_ snowbox_icon_a snowbox_play"/>').html('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>'),
      flake4 = momoj('<div class="snowbox_ snowbox_icon_a snowbox_play"/>').html('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>'),
      flake5 = momoj('<div class="snowbox_ snowbox_icon_a snowbox_play"/>').html('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>'),
      documentHeight = momoj(window).height(),
      documentWidth  = momoj(window).width(),
      defaults,
      pc_defaults = {
        minSize    : 30,  //雪花的最小尺寸
        maxSize    : 100, //雪花的最大尺寸
        newOn      : 400, //雪花出现的频率 这个数值越小雪花越多
        newOnDelay : 200, //延遲频率
        more       : documentHeight * 7 + Math.random() * 200, //速度
        flakeColor : "#FFFFFF",
        minOpacity : 0.5,
        ePL_Math   : 1,   //針對endPositionLeft移動倍率
      },
      m_defaults = {
        minSize    : 30,  //雪花的最小尺寸
        maxSize    : 60,  //雪花的最大尺寸
        newOn      : 400, //雪花出现的频率 这个数值越小雪花越多
        newOnDelay : 200, //延遲频率
        more       : documentHeight * 10 + Math.random() * 80, //速度
        flakeColor : "#FFFFFF",
        minOpacity : 0.2,
        ePL_Math   : 2,   //針對endPositionLeft移動倍率
      };  
  if( document.body.clientWidth > 767 ){
    defaults = pc_defaults;
  } else {
    defaults = m_defaults;
  }
  var options  = momoj.extend({}, defaults, options);
  var init = function init( _flake, _random, _icon_name, _icon_num){

    var startPositionLeft = Math.random() * documentWidth,
        startPositionTop  = -50,
        startOpacity      = 0.5 + Math.random(),
        sizeFlake         = options.minSize + Math.random() * options.maxSize,
        endPositionTop    = documentHeight + 100,
        endPositionLeft   = startPositionLeft + ( Math.random() > 0.5 ? -1 : 1 ) * startPositionLeft * options.ePL_Math * _random * Math.random(),
        durationFall      = options.more,
        starttransform    = Math.random() * 500,
        i                 = 0;
    _flake.clone().appendTo(con).css({
      'top'    : startPositionTop,
      'left'   : startPositionLeft,
      'width'  : sizeFlake +"px",
    }).animate({
      'top'    : [endPositionTop,'linear'],
      'left'   : [endPositionLeft,'linear'],
      },durationFall,function(){
        momoj(this).remove()
      }
    ).addClass('snowbox_icon_'+ Math.round(Math.random()*2+1) )
    .find('img')
    // .css({
    //   '-webkit-transform': 'rotate('+ starttransform +'deg) scaleX('+ Math.random() > 0.5 ? -1 : 1  +')',
    //   'transform': 'rotate('+ starttransform +'deg) scaleX('+ Math.random() > 0.5 ? -1 : 1  +')',
    // })
    .on('click', function(e) {
      momoj(this).parent('.snowbox_play').css('background-image','none');
      momoj(this).attr('src',cloudLotteryRainPromo.imgUrl + '/pc_element_end1.gif' + cloudLotteryRainPromo.timestamp).delay(700).fadeOut();
      momoj('#snow_go , #snow_bg').fadeOut(500);
      joinCloudLotteryRainPromo();
      //momoj('#snowEND_Area').show();
      //time = 5;
      //e.preventDefault();
      momoj(this).off('click');
    });
  }
  var interval1 = setInterval( function(){ init(flake1,1.0) }, options.newOn);
  var interval2 = setInterval( function(){ init(flake2,1.7) }, options.newOn + options.newOnDelay*2 );
  var interval3 = setInterval( function(){ init(flake3,1.1) }, options.newOn + options.newOnDelay*4 );
  // var interval4 = setInterval( function(){ init(flake1,1.3) }, options.newOn + options.newOnDelay*3 );
  // var interval5 = setInterval( function(){ init(flake3,1.1) }, options.newOn + options.newOnDelay*4 );
  window.addEventListener('resize', resize, false);
  function resize() {
    documentHeight = momoj(window).height(),
    documentWidth  = momoj(window).width();
  };resize();
};


momoj(document).ready(function(){
  //下雨時間設定
  var cuttentTime = new Date();
  var year = cuttentTime.getFullYear();
  var month = (cuttentTime.getMonth()+1).toString();
  month = (month.length<2) ? '0' + month : month;
  var day = (cuttentTime.getDate()).toString();
  day = (day.length<2) ? '0' + day : day;
  var today = year + month + day;
  var todayDate = year + '/' + month + '/' + day;
  var baseDateArray  = '';
  
  if(today == '20221111'){
    baseDateArray = new Array(
        todayDate + " 00:11:00",
        todayDate + " 01:11:00",
        todayDate + " 08:11:00",
        todayDate + " 09:11:00",
        todayDate + " 10:11:00",
        todayDate + " 11:11:00",
        todayDate + " 12:11:00",
        todayDate + " 13:11:00",
        todayDate + " 14:11:00",
        todayDate + " 15:11:00",
        todayDate + " 16:11:00",
        todayDate + " 17:11:00",
        todayDate + " 18:11:00",
        todayDate + " 19:11:00",
        todayDate + " 20:11:00",
        todayDate + " 21:11:00",
        todayDate + " 22:11:00",
        todayDate + " 23:11:00"
    );
  }else {
    return;
  }
  var baseDate = '';
  var basePreviousDate = '';
  for(var i=0 ; i<baseDateArray.length ; i++){
    if(cuttentTime < new Date(baseDateArray[i])){
      baseDate = baseDateArray[i];
      if(i > 0){
        basePreviousDate = baseDateArray[i-1];
      }else {
        basePreviousDate = baseDateArray[i];
      }
      break;
    }
  }
  
  //判斷該時間是否下雨
  var rainPreviousTime = new Date(basePreviousDate);
  var rainPreviousPlusTenTime = new Date(basePreviousDate + 10);
  var rainStartTime = new Date(baseDate);
  var rainingTime = false;
  var locationUrl = window.location.href;
  var isRainPage = (!locationUrl.includes('login.momo') && !locationUrl.includes('shoppingCart.momo') && !locationUrl.includes('search.momo'));

  if(cuttentTime < rainStartTime){
    var timeoutMs = rainStartTime - cuttentTime;
    if(isRainPage){
      setTimeout(function(){
        raining(); 
      },timeoutMs);
    }
  }
  if(cuttentTime >= rainPreviousTime && cuttentTime < rainPreviousPlusTenTime){
    rainingTime = true;
  }

  //時間符合&&是可下雨的頁面 就啟動下雨動畫
  if(rainingTime && isRainPage){
     raining();
  }
});