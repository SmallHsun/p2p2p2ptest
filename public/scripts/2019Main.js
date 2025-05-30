/*2019 大網首頁改版*/
(function(momoj){
  var silders = [];
  momoj.fn.extend({
    /* 滑到頁籤顯示n個li*/
    showBtByMenuHover : function(_settings){
      var container=momoj(this);
      var displayBlock = momoj('.displayBlock',container).text();
      if((/ecm/i.test(location.href) && container.parents('#preview').length > 0) || displayBlock == 'off'){
        return;
      }
      var _defaultSettings = {
          menu:2,  //n個頁籤
          showBtNum:3 //show幾個li
      }; 
      var settings = momoj.extend(_defaultSettings, _settings);
      var initStart = Math.floor(Math.random()*settings.menu);
      
      /*container.delegate('.TabMenu ul li', 'hover', function(e){
        _show(momoj(this).index());
      });*/
      container.on('mouseenter mouseleave','.TabMenu ul li',function(e){
        _show(momoj(this).index());
      });
      var _show=function(index){
        momoj('.TabMenu ul li',container).hide();
        momoj('.TabMenu ul li',container).removeClass('selected');
        momoj('.TabContent ul li',container).hide();
        var startIndex = index * settings.showBtNum;
        var endIndex = startIndex + settings.showBtNum;
        momoj('.TabMenu ul li',container).eq(index).addClass('selected');
        showLazyImg(momoj('.TabMenu ul li',container), startIndex, endIndex);
        momoj('.TabContent ul li',container).slice(startIndex,endIndex).show();
        momoj('.TabMenu ul li',container).show();
      }
      _show(initStart);
    },
    /*首頁背景 天、身體、置底*/
    mainBgImg : function(){
      var _container=momoj(this);
      if(_container.find('.btHeader').text() == "1"){
        var _headerBgImg=_container.find('.btHeaderImg').attr('src');
        var _headerArea=momoj('.headcontentinner02').eq(0); 
        if(typeof _headerBgImg != 'undefined' && _headerBgImg.indexOf("/ecm/img")>-1){
          _headerArea.css('background-image','url('+ _headerBgImg +')');
        }
      }
      if(_container.find('.btMainTop').text() == "1"){
        var _mainTopBgImg=_container.find('.btMainTopImg').attr('src');
        if(typeof _mainTopBgImg != 'undefined' && _mainTopBgImg.indexOf("/ecm/img")>-1){
          momoj('#backgroundContent').eq(0).css('background-image','url('+ _mainTopBgImg +')').addClass('backgroundselected');
          momoj('.bkBefCss').remove();
          _container.append('<div class="bkBefCss" style="display:none;"><style>#backgroundContent:before {background-color: transparent;}</style></div>');
        }
      }
      if(_container.find('.btMainBottom').text() == "1"){
        var _mainBottomBgImg=_container.find('.btMainBottomImg').attr('src');
        if(typeof _mainBottomBgImg != 'undefined' && _mainBottomBgImg.indexOf("/ecm/img")>-1){
          momoj('#backgroundContent').append('<div class="fixbackground"><img src="'+_mainBottomBgImg+'"></div>');
        }
      }
    },
    /* 設定倒數時間位置 */
    setCountDownPosition : function(){
      var container=momoj(this);
      var displayBlock = momoj('.displayBlock',container).text();
      if(displayBlock == 'off'){
        return;
      }
      if(container.find(".countdownLeftPosition").length < 1){
        return;
      }
      var positionPX = container.find(".countdownLeftPosition").text();
      if(positionPX != ''){
        container.find('.timeBox').css("margin-left",positionPX+'px');
      }
    },
    /*滑過去顯示圖檔*/
    hoverImg : function(){
      var _container=momoj(this);
      var displayBlock = momoj('.displayBlock',_container).text();
      if(displayBlock == 'off'){
        return;
      }
      if(momoj.trim(_container.find('.hoverImg').text()) != ""){
        var _hoverImg=_container.find('.hoverImg').text();
        var _containerId = _container.attr('id');
        if(typeof _hoverImg != 'undefined' && _hoverImg.indexOf("/ecm/img")>-1){
          _container.append('<style>#' + _containerId + ' .hoverEle:hover {background-image:url('+ _hoverImg +');}</style>');
        }
      }
    },
    sildeBlock : function(settings) {
      var containers = momoj(this);
      var displayBlock = momoj('.displayBlock',containers).text();
      if((/ecm/i.test(location.href) && containers.parents('#preview').length > 0) || displayBlock == 'off'){
        return;
      }
      for(var i = 0; i <  containers.length; i++) {
        var slide = new Silder();
        momoj('.displayDiv', containers).each(function(){
          var isDisplayDiv = momoj(this).text();
          if(isDisplayDiv == 'off'){
            momoj(this).parent().remove();
          }
        });
        
        var _html = momoj(containers[i]).html();
        momoj(containers[i]).html(_html);
        if(containers.parents('.btclass').find('.randomDisplay').html() == 'on'){
          settings = momoj.extend({random:true}, settings);
        }
        slide.init(containers[i], settings);
        silders.push(slide);
      }
    },
    /* 左右箭頭按鈕顯示區塊*/
    showBtByArrow : function(_settings){
      var container = momoj(this);
      var displayBlock = momoj('.displayBlock',container).text();
      if((/ecm/i.test(location.href) && container.parents('#preview').length > 0) || displayBlock == 'off'){
        return;
      }
      var _defaultSettings = {
          showBtNum:4 //show幾個li
      }; 
      momoj('div.boxcontent >ul >li',container).hide();
      var settings = momoj.extend(_defaultSettings, _settings);
      var displayGoodsNum = momoj('.displayGoodsNum',container).text();
      var isRandomDisplay = momoj('.randomDisplay',container).text();
      if(displayGoodsNum != ''){
        momoj('div.boxcontent >ul >li',container).slice(displayGoodsNum).remove();
      }
      var _btLiLength = momoj('div.boxcontent >ul >li',container).length;
      var showBtNum = settings.showBtNum;
      if(_btLiLength < showBtNum){
        return;
      }
      var _Show = '0';
      if(isRandomDisplay == 'on'){
        momoj('div.boxcontent >ul',container).sortEles('li', true);
      }
      var _btLi = momoj(this).find('div.boxcontent >ul>li');
      if(_btLi.length <= settings.showBtNum){
        momoj('.leftarrow, .rightarrow',container).hide();
      }else{
        momoj('.leftarrow, .rightarrow',container).show();
      }
      var _start = (showBtNum*_Show);
      var _end = _start+showBtNum;
      for(var i=_start;i<_end;i++){
        showLazyImg(_btLi, _start, _end);
        _btLi.eq(i).show();
      }
      
      container.delegate('.leftarrow, .rightarrow', 'click', function(e){
        var _this = momoj(this);
        var len = _btLi.length;
        if (_this.is('.leftarrow')) {
          var visible_first = 0;
          if (_btLiLength > showBtNum) {
            _btLi.each(function(i, li){
              if (momoj(li).is(':visible')) {
                visible_first = i;
                return false;
              }
            });
            if ((visible_first-showBtNum) < 0) {
              visible_first = len-len%showBtNum;
              if (visible_first == len) {
                visible_first = len-showBtNum;
              }
              showLazyImg(_btLi, visible_first, len);
              _btLi.hide().slice(visible_first,len).show();
            } else {
              visible_first -= showBtNum;
              showLazyImg(_btLi, visible_first, visible_first+showBtNum);
              _btLi.hide().slice(visible_first,visible_first+showBtNum).show();
            }
          }
        } else if (_this.is('.rightarrow')) {
          visible_last = 0;
          if (_btLiLength > showBtNum) {
            _btLi.each(function(i, li){
              if (momoj(li).is(':visible')){
                visible_last = i;
                return true;
              }
            });
            var _start = visible_last+1;
            if(_start == len){
              _start = 0;
            }
            var _end = _start+showBtNum;
            if((len-_start)<showBtNum){
              _end = len;
            }
            showLazyImg(_btLi, _start, _end);
            _btLi.hide().slice(_start, _end).show();
          }  
        }
      });
    },
    removeEle : function(_settings) {
      var container = momoj(this);
      if(/ecm/i.test(location.href) && container.parents('#preview').length > 0){
        return;
      }
      var _defaultSettings = {
        isSort:false,  //是否排序
        isSortRandom:false //是否隨機排序
      }; 
      var settings = momoj.extend(_defaultSettings, _settings);
      momoj('.displayLi, displayDiv', container).each(function(){
        var isDisplayEle = momoj(this).text();
        if(isDisplayEle == 'off'){
          momoj(this).parent().remove();
        }
      });
      if(settings.isSort){
        momoj(this).find('.TabContentD').each(function(){
          momoj(this).find('ul').sortEles('li', settings.isSortRandom);
        });
      }
    },
    sortEles : function(selector, isRandom){
      var $eles = selector ? momoj(this).find(selector) : momoj(this).children();
      var $parents = $eles.parent();
      
      $parents.each(function(){
        if(isRandom){
          momoj(this).children(selector).sort(function(){ 
            return Math.round(Math.random())-0.5;
          }).detach().appendTo(this);
        }else{
          momoj(this).html(momoj(this).children(selector).sort(function(a,b){ 
            var aVal = momoj(a).find('.displayPriority').text(); 
            aVal = aVal == '' ? '50' : aVal;
            var bVal = momoj(b).find('.displayPriority').text(); 
            bVal = bVal == '' ? '50' : bVal;
            return bVal == aVal ? 0 : (bVal < aVal ? 1 : -1);
         }));
        }
      });
    },
    newProcessBlock999 : function(_settings){
      var containers = momoj(this);
      containers.each(function(){
        var btId = momoj(this).attr('id');
        var blockVal = btId.substring(0,8);
        var heightVal = parseInt(momoj('#'+btId + '_e3').text());
        if('number' != typeof(heightVal)){
          heightVal = 0;
        }
        var hiddenVal = momoj('#'+btId + '_e2').text();
        if(hiddenVal != 1){
          heightVal = 0;
          momoj('#'+btId).find('.' + blockVal + '_layout').empty();
        }
        momoj('#'+btId).find('.' + blockVal + '_layout').css('height',heightVal);
      });
    }
    

  });
  
  function showLazyImg(_btLi, _start, _end){
    for(var i=_start ; i<_end ; i++){
      _btLi.eq(i).find('[lazy=1],[lazy=2]').each(function(){
        if(!!momoj.getImgSrc({org:momoj(this).attr("org")})) {
          momoj(this).attr("src", momoj.getImgSrc({org:momoj(this).attr("org")}));
        }
        momoj(this).removeAttr("lazy");
      });
    }
  }
  
  function resizeWindow() {
    for(var i = 0; i <  silders.length; i++) {
      if(typeof silders[i].resizeWindow === 'function') {
        silders[i].resizeWindow();
      }
    }
  }
  var _uagt = navigator.userAgent; //取的使用者裝置系統
  
  var plccBindingStatus=momoj().cookie('plccBindingStatus');
  if (plccBindingStatus!=null && plccBindingStatus !='null' && (plccBindingStatus == '1' || plccBindingStatus == '2')) {
    var bindMsg = "";
    if(plccBindingStatus == '1'){
      bindMsg = "momo卡帳戶綁定完成，現已可至站內消費享mo幣回饋";
    } else if(plccBindingStatus == '2') {
      bindMsg = "momo卡已加入信用卡管理清單，回饋之mo幣，統一歸戶於正卡人帳戶中，如正卡人尚未進行帳戶綁定，mo幣將暫時無法回饋";
    }
    momoj().cookie('plccBindingStatus', '0', {path:'/', domain:'momoshop.com.tw',expires: (365*2)});

    alert(bindMsg);
  }
  
})(momoj);


//撈取首頁今天秒殺版位bt_0_248根據頁籤內容數量顯示頁籤
function checkTodayTagCount() {
  var showTagLi = "2";   //預設顯示頁籤2筆
  var contentLi = "3";   //預設顯示3筆
  var todayTagLi = momoj("#bt_0_248_01 .boxtitle .TabMenu ul li "); 
  var todayContentLi = momoj("#bt_0_248_01 .boxcontent .TabContent ul li ");
  
  //根據實際li數量調整顯示頁籤
  if (todayContentLi) {
    showTagLi = Math.ceil(todayContentLi.length / contentLi);
  }
  
  //頁籤大於顯示li就移除
  if (todayTagLi.length > showTagLi) {
    momoj(todayTagLi).each(function(k,v) {
      if (k+1 > showTagLi) { 
        momoj(v).remove();
      }
    });
  }
  
  //每個頁籤的第一筆不顯示border-top和把before內容調整
  momoj(todayContentLi).each(function(k,v) {
    var tagLi = k+1;
    if (tagLi%contentLi == 1){
      momoj(v).addClass("tagFirst tagFirstBefore");
    }
  });
  
  momoj('#bt_0_248_01').showBtByMenuHover({menu:showTagLi,showBtNum:3});
}

//圖片壓圓標
function imgTagChangeHtml(){
  var imgTag = momoj("#bt_0_247_01 .imgTag");
  if ((imgTag != null) && (typeof imgTag != 'undefined')) {
    momoj("div[id^='bt_0_247_01_P1_'] ").each(function(k,v){
      var showOn = momoj(v).find(".displayImgTag").html() == "on" || false; //判斷每張圖圓標等於on就加入圓標圖樣式
      if (showOn) { 
        var imgTagClone = momoj(imgTag).clone().show().css({"width":"20%","height":"auto","position": "absolute","top": "0","left": "0","z-index":"1","display":"inline"});
        imgTagClone.find("img").show().css({"width":"170px","height":"100px"});
        momoj(v).find("img").before(imgTagClone);
        momoj(v).addClass("prdImgWrap");  
      }
    });
  }
}

//刪除nbsp (因ecm沒有市價會多加入nbsp說建議js調整)
function removeNbsp(){
  momoj(".oPrice b, .oPrdprice b").each(function(k,v) {
    if (momoj(v).html() == "&nbsp;") {
      momoj(this).html(momoj(v).html().replace("&nbsp;",""));
    }
  });
}

//加入市價$字號
function addMoneySymbol(){
  //熱門追蹤區塊
  addMoneySymbolHtml('#bt_0_270_01 .oPrdprice', '.oPriceArea');
  //首頁樓層區塊
  addMoneySymbolHtml('.priceBox .oPrice', 'b');
}

//ecm特定版位不會加入$,改由前台加入$
function addMoneySymbolHtml(tagName,oPriceName){
  var _tagName    = tagName || '';
  var _oPriceName = oPriceName || '';
  if(_tagName == '' || _oPriceName == ''){
    return ;
  }
  momoj(_tagName).each(function(k,v) {
    var hadMoneySymbol = momoj(v).html().indexOf("$"); //判斷是否已經有$字號
    if (hadMoneySymbol < 0){ 
      var oPriceArea = momoj(v).find(_oPriceName);
      oPriceAreaContent = oPriceArea.text() || '';
      if (oPriceAreaContent != "") {
        oPriceArea.before('$');
      }
    }
  });
}
