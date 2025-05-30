function Silder() {
  var self = this;
  self.container = null;           //綁定動作的區域
  self._carousel = false;          //圖片是否輪播
  self._random   = false;          //隨機顯示
  self._showPosition  = 0;         //固定顯示第幾個
  self._interval = 3000;           //圖片輪播時間間距(毫秒)
  self._animateSpeed = "fast";     //animaten速度  600,400,200,"slow","normal","fast"
  self._moveDirect = "left";       //animate移動方向(left:向左、right:向右)
  self._moveDiv = 0;               //正中間的圖
  self._moveDivShow = 1;           //移動後要顯示的圖
  self._containerDivs = 0;         //div區域下有多少圖片
  self._timerid = 0;               //settimeout回傳的
  self._clientWidth = 0;           //圖片顯示區域的寬度大小
  self._bannerWidthMax = 0;        //使用者傳入的圖片最大寬度限制
  self._bannerPa = 0;              //圖片的比例
  self._moveWidth=0;               //移動的寬度
  
  self._isDown = false;             //是否按下左鍵
  self._downX = 0;                  //按下左鍵時的 x 座標
  self._downY = 0;                  //按下左鍵時的 y 座標
  self._moveX = 0;                  //移動座標距離
  self._moveLock = false;           //圖片是否移動
  self._moveTag = '';               //要做移動的tag ex: div, ul, etc
  self._fixedHeight = false;          //如果有在CSS固定高代入True
  
  self.init = function (_container, settings) {
    self.container = jQuery(_container);
    var _defaultSettings = {
        carousel:false,           //圖片是否輪播
        random: false,            //隨機顯示
        showPosition :0,          //固定顯示第幾個
        interval:3000,            //圖片輪播時間間距(毫秒)
        animateSpeed:"fast",      //animate速度
        bannerWidthMax:640,       //圖片最大寬度
        bannerWidth:640,          //上傳的圖片寬度
        bannerHeight:320,          //上傳的圖片高度
        moveTag: 'div',             //要做移動的tag ex: div, ul, etc
        fixedHeight: false,         //如果有在CSS固定高代入True
        moveWidth:0                 //移動的寬度
      };
      var _settings = momoj.extend(_defaultSettings, settings);
      self._carousel = _settings.carousel;                        //圖片是否輪播
      self._random   = _settings.random;                          //隨機顯示
      self._showPosition  = _settings.showPosition;               //固定顯示第幾個
      self._interval = _settings.interval;                        //圖片輪播時間間距(毫秒)
      this._animateSpeed = _settings.animateSpeed;                //animate速度
      self._moveTag = _defaultSettings.moveTag;
      self._containerDivs = self.container.find(self._moveTag).length;  //圖片數量
      self._bannerWidthMax = _settings.bannerWidthMax;            //圖片最大寬度
      self._bannerPa = _settings.bannerHeight / _settings.bannerWidth;
      self._fixedHeight = _settings.fixedHeight;
      self._moveWidth = _settings.moveWidth;
      if(self._random){
        self._moveDiv = Math.floor(Math.random()*self._containerDivs);  //顯示區塊隨機
      }else{
        self._moveDiv = self._showPosition;
      }
      
      addDots();       //加入小圓點
      self.resizeWindow(); //初始化顯示區域
      slideSetTimeOut();                                //設定下一次動作
      if(self._containerDivs < 2){
        return;
      }
      bindTouch();                                      //綁定觸控動作
      bindRLButton();                                   //綁定左右箭頭動作
  }
  
  //設定顯示區域大小
  self.resizeWindow = function(){
    self._clientWidth = momoj(window).width() > self._bannerWidthMax ? self._bannerWidthMax : momoj(window).width();
    var _bannerHeight= self._bannerPa * self._clientWidth;
    /**設定顯示區域和圖片大小**/
    if(self._moveWidth == 0){
      self._moveWidth = self._clientWidth;
    }
    
    self.container.find(self._moveTag).css("left",self._moveWidth + "px");
    if(self._moveTag === 'div') {  
      self.container.css("height",_bannerHeight);
      self.container.find("div img").css("width",self._clientWidth + "px");
      self.container.find("div img").css("height",_bannerHeight + "px");
    } else {
      if(!self._fixedHeight) {
        self.container.css("height",_bannerHeight);
        self.container.find(self._moveTag).css("height",_bannerHeight + "px");
        self.container.find(self._moveTag).css("height",_bannerHeight + "px");  
      }
       self.container.find(self._moveTag).css("width",self._clientWidth + "px"); //固定目前要移動的tag寬
    }

    /**設定顯示區域箭頭位置**/
    if(self._containerDivs > 1) {
      if(self.container.parent().find('.arrow .leftBtn').length > 0) {
        var arrow_height = self.container.parent().find('.arrow .leftBtn').css('height').replace('px','');
        var arrow_top = (_bannerHeight / 2) - (arrow_height / 2);
        self.container.parent().find('.arrow .leftBtn').css('top',arrow_top+'px');
        self.container.parent().find('.arrow .rightBtn').css('top',arrow_top+'px');
      }
    }
    /**設定顯示區域圖片位置**/
    self.container.find(self._moveTag).css("left",-self._moveWidth + "px");
    self.container.find(self._moveTag).eq(self._moveDiv).css("left","0px");
    var _backgroundColor = self.container.find(self._moveTag).eq(self._moveDiv).find('.backgroundColor').text();
    if(_backgroundColor != ''){
      if(self.container.find('.slideBefCss').length>0){
        self.container.find('.slideBefCss').remove();
      }
      self.container.append('<div class="slideBefCss" style="display:none;"><style>.backgroundContent:before {background-color: ' + _backgroundColor + ';}</style></div>');
    }
    
  };
  //設定下一次動作啟動時間間距
  var slideSetTimeOut = function(){
    if(self._carousel == false || self._containerDivs == 1){
      return;
    }
    self._timerid = setTimeout(move,self._interval);
  };

  //增加下面的小黑點
  var addDots = function(){
    var dotsNum = self._containerDivs;
    if(dotsNum < 2){
      return;
    }
    var _html = "<ul>";
    for(var i = 0;i < dotsNum;i++){
      if(self._moveDiv == i){
        _html += "<li class = \"selected\"><a></a></li>";
      }else{
        _html += "<li><a></a></li>";
      }
    }
    _html += "</ul>";
    self.container.parent().find(".dotsArea").html(_html);
  };
  //移動 、當settimeout自動喚起move動作不會傳入moveStyle、所以moveStyle = undefined
  var move = function(moveStyle){
    self._moveLock = true;
    if(self._moveDirect == "left"){
      self._moveDivShow = self._moveDiv + 1 >= self._containerDivs ? self._moveDiv + 1 - self._containerDivs : self._moveDiv + 1;
    }else if(self._moveDirect == "right"){
      self._moveDivShow = self._moveDiv - 1 < 0 ? self._moveDiv - 1 + self._containerDivs : self._moveDiv - 1;
    }
    moveFun(moveStyle);
  };
  //移動的動作、當settimeout自動喚起move動作不會傳入moveStyle、所以moveStyle = undefined、此時要重新set一起移動的div的位置
  var moveFun = function(moveStyle){
    var _moveDivLocation = 0;
    if(self._moveDirect == "left"){
      if(moveStyle == undefined){
        self.container.find(self._moveTag).eq(self._moveDivShow).css({left: self._moveWidth + "px"}); 
      }
      _moveDivLocation =  "-" + self._moveWidth;
    }else if(self._moveDirect == "right"){
      var moveCss = {};
      if(moveStyle == undefined){
        self.container.find(self._moveTag).eq(self._moveDivShow).css({left: "-" + self._moveWidth + "px"}); 
      }
      _moveDivLocation = self._moveWidth;
    }
    self.container.parent().find(".dotsArea").find("li").eq(self._moveDiv).removeClass("selected");
    self.container.parent().find(".dotsArea").find("li").eq(self._moveDivShow).addClass("selected");
    self.container.find(self._moveTag).eq(self._moveDivShow).animate({left: 0}, self._animateSpeed);
    self.container.find(self._moveTag).eq(self._moveDiv).animate({left: _moveDivLocation}, self._animateSpeed,function(){
      self._moveLock = false;
      self._isDown = false;
      self._moveDiv = self._moveDivShow;
      clearTimeout(self._timerid);
      self._moveDirect = "left";
      var _backgroundColor = self.container.find(self._moveTag).eq(self._moveDiv).find('.backgroundColor').text();
      if(self.container.find('.slideBefCss').length>0){
        self.container.find('.slideBefCss').remove();
      }
      if(_backgroundColor != ''){
        self.container.append('<div class="slideBefCss" style="display:none;"><style>.backgroundContent:before {background-color: ' + _backgroundColor + ';}</style></div>');
      }
      slideSetTimeOut();
    });
  };
  //綁定touch
  var bindTouch = function(){
    // 滑鼠按下
    self.container.bind("mousedown touchstart vmousedown", function(e) { 
      if (self._moveLock || self._isDown)
        return;
      //e.preventDefault();
      self._isDown = true;
      self._downX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
      self._downY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
      _touchdirect = 0;
      clearTimeout(self._timerid);
    });
    // 滑鼠放開
    self.container.bind("mouseup mouseout touchend touchcancel vmouseup vmouseout", function(e) {
      //左右滑動多少距離，則切換圖片
      var widthShift = 20; //寬度除20後的參數
      if (self._moveLock)
        return;
      //e.preventDefault();
      if (!self._isDown) // 有按下才處理
        return;
      if(self._moveX > 0){
        if(self._moveX > self._clientWidth / widthShift){
          self._moveDirect = "right";
        }else{
          self._moveDirect = "left";
          self._moveDiv = self._moveDivShow;
        }
        move("1");
      }else if(self._moveX < 0){
        if((0-self._moveX) > self._clientWidth / widthShift){
          self._moveDirect = "left";
        }else{
          self._moveDirect = "right";
          self._moveDiv = self._moveDivShow;
        }
        move("1");
      }else{
        slideSetTimeOut();
        //window.location.href = self.container.find("div").eq(_moveDiv).find("a").attr("href");
      }
      self._moveX = 0;
      _touchdirect = 0;
    });
    // 滑鼠移動
    self.container.bind("mousemove touchmove vmousemove", function(e) { 
      if (self._moveLock)
        return;
      if (!self._isDown) // 有按下才處理
        return;
      var x = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
      var y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
      var _moveDivShowOther = "";
      self._moveX = x - self._downX;
      //上下左右滑動靈敏度，目前設定5
      var _moveY = Math.abs(y - self._downY) > 5 ? Math.abs(y - self._downY) : 0;
      if(_moveY > Math.abs(self._moveX)){
        //self._moveX=0;
        //self.container.find("div").eq(_moveDiv).css("left", self._moveX );
        //return;
      }else{
        e.preventDefault();
      }
      if(self._moveX > 0){
        self._moveDivShow = self._moveDiv - 1 < 0? self._moveDiv - 1 + self._containerDivs : self._moveDiv - 1;
        self.container.find(self._moveTag).eq(self._moveDivShow).css("left", self._moveX - self._moveWidth);

        if(self._containerDivs > 2){
          _moveDivShowOther = self._moveDiv + 1 >= self._containerDivs? self._moveDiv + 1 - self._containerDivs : self._moveDiv + 1;
          self.container.find(self._moveTag).eq(_moveDivShowOther).css("left", self._moveWidth);
        }
      }else if(self._moveX < 0){
        self._moveDivShow = self._moveDiv + 1 >= self._containerDivs? self._moveDiv + 1 - self._containerDivs : self._moveDiv + 1;
        self.container.find(self._moveTag).eq(self._moveDivShow).css("left", self._moveWidth + self._moveX);

        if(self._containerDivs > 2){
          _moveDivShowOther = self._moveDiv - 1 < 0? self._moveDiv - 1 + self._containerDivs : self._moveDiv - 1;
          self.container.find(self._moveTag).eq(_moveDivShowOther).css("left", 0 - self._moveWidth);
        }
      }else{
        self._moveDivShow = self._moveDiv - 1 < 0 ? self._moveDiv - 1 + self._containerDivs : self._moveDiv - 1;
        self.container.find(self._moveTag).eq(self._moveDivShow).css("left", 0 - self._moveWidth);
        self._moveDivShow = self._moveDiv + 1 >= self._containerDivs? self._moveDiv + 1 - self._containerDivs : self._moveDiv + 1;
        self.container.find(self._moveTag).eq(self._moveDivShow).css("left", self._moveWidth);
      }
      //只有第一張突出現圓標圖,其他不顯示
      if(self._moveDivShow == '0'){
        self.container.find(".new").show();
      }else{
        self.container.find(".new").hide();
      }
      self.container.find(self._moveTag).eq(self._moveDiv).css("left", self._moveX );
    });
    
  };
  //綁定左右移動
  var bindRLButton = function(){
    self.container.parent().find(".arrow .leftBtn").click(function(){
      if (self._moveLock)
        return;
      self._moveDirect = "right";
      move();
    });
    self.container.parent().find(".arrow .rightBtn").click(function(){
      if (self._moveLock)
        return;
      self._moveDirect = "left";
      move();
    });
  };
}



