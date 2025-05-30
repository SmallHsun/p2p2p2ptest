/*
/* http://www.json.org */ json2.js
*/
var JSON;JSON||(JSON={});
(function(){function k(a){return a<10?"0"+a:a}function n(a){o.lastIndex=0;return o.test(a)?'"'+a.replace(o,function(c){var d=q[c];return typeof d==="string"?d:"\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,c){var d,f,j=g,e,b=c[a];if(b&&typeof b==="object"&&typeof b.toJSON==="function")b=b.toJSON(a);if(typeof h==="function")b=h.call(c,a,b);switch(typeof b){case "string":return n(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null";
g+=m;e=[];if(Object.prototype.toString.apply(b)==="[object Array]"){f=b.length;for(a=0;a<f;a+=1)e[a]=l(a,b)||"null";c=e.length===0?"[]":g?"[\n"+g+e.join(",\n"+g)+"\n"+j+"]":"["+e.join(",")+"]";g=j;return c}if(h&&typeof h==="object"){f=h.length;for(a=0;a<f;a+=1)if(typeof h[a]==="string"){d=h[a];if(c=l(d,b))e.push(n(d)+(g?": ":":")+c)}}else for(d in b)if(Object.prototype.hasOwnProperty.call(b,d))if(c=l(d,b))e.push(n(d)+(g?": ":":")+c);c=e.length===0?"{}":g?"{\n"+g+e.join(",\n"+g)+"\n"+j+"}":"{"+e.join(",")+
"}";g=j;return c}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var p=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,g,m,q={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},h;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,c,d){var f;m=g="";if(typeof d==="number")for(f=0;f<d;f+=1)m+=" ";else if(typeof d==="string")m=d;if((h=c)&&typeof c!=="function"&&(typeof c!=="object"||typeof c.length!=="number"))throw new Error("JSON.stringify");return l("",
{"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,c){function d(f,j){var e,b,i=f[j];if(i&&typeof i==="object")for(e in i)if(Object.prototype.hasOwnProperty.call(i,e)){b=d(i,e);if(b!==undefined)i[e]=b;else delete i[e]}return c.call(f,j,i)}a=String(a);p.lastIndex=0;if(p.test(a))a=a.replace(p,function(f){return"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){a=eval("("+a+")");return typeof c==="function"?d({"":a},""):a}throw new SyntaxError("JSON.parse");}})();


/*
 * jQote2 - client-side Javascript templating engine
 * Copyright (C) 2010, aefxx
 * /* http://aefxx.com/ */
 *
 * Dual licensed under the WTFPL v2 or MIT (X11) licenses
 * WTFPL v2 Copyright (C) 2004, Sam Hocevar
 *
 * Date: Sat, Jun 29th, 2010
 * Version: 0.9.5
 */
(function($){var _=false,E1="UndefinedTemplateError",E2="TemplateCompilationError",E3="TemplateExecutionError",A="[object Array]",S="[object String]",F="[object Function]",n=1,c="%",q=/^[^<]*(<[\w\W]+>)[^>]*$/,ts=Object.prototype.toString;function r(e,x){throw $.extend(e,x),e;}function dns(f){var a=[];if(ts.call(f)!==A)return _;for(var i=0,l=f.length;i<l;i++)a[i]=f[i].id;return a.length?a.sort().join(".").replace(/(\b\d+\b)\.(?:\1(\.|$))+/g,"$1$2"):_}function l(s,t){var f,g=[],t=t||c,x=ts.call(s);
if(x===F)return s.jqote_id?[s]:_;if(x!==A)return[$.jqotec(s,t)];return g.length?g:_}$.fn.extend({jqote:function(x,y){var x=ts.call(x)===A?x:[x],d="";this.each(function(i){var f=$.jqotec(this,y);for(var j=0;j<x.length;j++)d+=f.call(x[j],i,j,x,f)});return d}});$.each({app:"append",pre:"prepend",sub:"html"},function(x,y){$.fn["jqote"+x]=function(e,d,t){var p,r,s=$.jqote(e,d,t),$$=!q.test(s)?function(s){return $(document.createTextNode(s))}:$;if(!!(p=dns(l(e))))r=new RegExp("(^|\\.)"+p.split(".").join("\\.(.*)?")+
"(\\.|$)");return this.each(function(){var z=$$(s);$(this)[y](z);(z[0].nodeType===3?$(this):z).trigger("jqote."+x,[z,r])})}});$.extend({jqote:function(e,d,t){var s="",t=t||c,f=l(e);if(f===_)r(new Error("Empty or undefined template passed to $.jqote"),{type:E1});d=ts.call(d)!==A?[d]:d;for(var i=0,m=f.length;i<m;i++)for(var j=0;j<d.length;j++)s+=f[i].call(d[j],i,j,d,f[i]);return s},jqotec:function(x,t){var h,e,y,t=t||c,z=ts.call(x);if(z===S&&q.test(x)){e=y=x;if(h=$.jqotecache[x])return h}else{e=z===
S||x.nodeType?$(x):x instanceof jQuery?x:null;if(!e[0]||!(y=e[0].innerHTML))r(new Error("Empty or undefined template passed to $.jqotec"),{type:E1});if(h=$.jqotecache[$.data(e[0],"jqote_id")])return h}var s="",i,a=y.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]/g,"").split("<"+t).join(t+">\u001b").split(t+">");for(var m=0,k=a.length;m<k;m++)s+=a[m].charAt(0)!=="\u001b"?"out+='"+a[m].replace(/([^\\])?(["'])/g,"$1\\$2")+"'":a[m].charAt(1)==="="?";out+=("+a[m].substr(2)+");":";"+a[m].substr(1);s="try{"+
('var out="";'+s+";return out;").split("out+='';").join("").split('var out="";out+=').join("var out=")+'}catch(e){e.type="'+E3+'";e.args=arguments;e.template=arguments.callee.toString();throw e;}';try{var f=new Function("i, j, data, fn",s)}catch(e){r(e,{type:E2})}i=e instanceof jQuery?$.data(e[0],"jqote_id",n):e;return $.jqotecache[i]=(f.jqote_id=n++,f)},jqotefn:function(e){var t=ts.call(e),i=t===S&&q.test(e)?e:$.data($(e)[0],"jqote_id");return $.jqotecache[i]||_},jqotetag:function(s){c=s},jqotecache:{}});
$.event.special.jqote={add:function(o){var n,h=o.handler,d=!o.data?[]:ts.call(o.data)!==A?[o.data]:o.data;if(!d.length||!(n=dns(l(d))))return}}})(jQuery);
/*
 * jQuery UI for MomoShop
 *
 * Author: Rex Ho.
 * Date: 2010/03/18
 * Depends:
 *  jquery-1.4.2.js
 * edit by juchou 2019.12.09 
 * Depends:
 *  jquery-1.12.4.js
 */
var momoj=jQuery.noConflict();
var ImgS=4;
var ImgN=0;
//首頁左側選單會使用的參數
var _settings = {        
        scrWidth:1320,
       lbt:'#bt_0_layout_b957',
       subMnId:'bt_0_997_',  
       liHeight:24,
       liWidth:131
};

var isThisMomoshop = true;

if(typeof console=='undefined'){
  console={};
  console.log=function(){return;}
}

if(!Object.keys){
  Object.keys = function(o){
    var a=[];
    if(typeof o=='object'){
      for(var k in o){
        a.push(k);
      }
    }
    return a;
  }
}

if(!Array.prototype.indexOf){
  Array.prototype.indexOf = function(item){
    for(var i=0,len=this.length;i<len;i++){
      if(item==this[i]){
        return i;
      }
    }
    return -1;
  }
}

(function($) {

/*
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
*/
$.fn.cookie = function(name, value, settings) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        settings = settings || {};
        if (value === null) {
            value = '';
            settings.expires = -1;
        }
        var expires = '';
        if (settings.expires && (typeof settings.expires == 'number' || settings.expires.toUTCString)) {
            var date;
            if (typeof settings.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (settings.expires * 24 * 60 * 60 * 1000));
            } else {
                date = settings.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize settings.path and settings.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = settings.path ? '; path=' + (settings.path) : '';
        var domain = settings.domain ? '; domain=' + (settings.domain) : '';
        var secure = settings.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// timer, return a timer object, so you can stop, reset again and again
$.fn.timer = function (interval, callback){
  var interval = interval || 100;
  if (!callback)
    return false;
  
  var _timer = function (interval, callback) {
    this.stop = function () {
      clearInterval(self.id);
    };
    
    this.internalCallback = function () {
      callback(self);
    };
    
    this.reset = function (val) {
      if (self.id)
        clearInterval(self.id);
      
      var val = val || 100;
      this.id = setInterval(this.internalCallback, this.interval);
    };
    
    this.interval = interval;
    this.id = setInterval(this.internalCallback, this.interval);

    var self = this;
  };
  return new _timer(interval, callback);
};

$.fn.HashTables = function(){

  var _HashTables = function(){
    this.items=new Array();
    this.keyArray=new Array();
    this.itemsCount=0;
    this.add = function(key,value){
      if(!this.containsKey(key)){
        this.items[key]=value;
        this.itemsCount++;
        this.keyArray.push(key);
      }else{
        //throw "key '"+key+"' allready exists."
        this.items[key]=value;
      }
    }
    this.get=function(key){
      if(this.containsKey(key))
        return this.items[key];
      else
        return typeof(this.items[key]);
    }
    this.remove = function(key){
      if(this.containsKey(key)){
        delete this.keyArray[key];
        delete this.items[key];
        this.itemsCount--;
      }else{
        throw "key '"+key+"' does not exists."
      }
    }
    this.containsKey= function(key){
      return typeof(this.items[key])!="undefined";
    }
    this.containsValue = function containsValue(value){
      for (var item in this.items){
        if(this.items[item]==value)
          return true;
      }
      return false;
    }
    this.contains = function(keyOrValue){
      return this.containsKey(keyOrValue) || this.containsValue(keyOrValue);
    }
    this.clear = function(){
      this.items=new Array();
      this.keyArray=new Array();
      this.itemsCount=0;
    }
    this.size = function(){
      return this.itemsCount;
    }
    this.isEmpty = function(){
      return this.length==0;
    } 
    this.getItems = function(key){
      return this.items[key];
    }
  }
  return new _HashTables();
}

// tab change
$.fn.TabDelay = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).TabDelay(settings);
    });
    return false;
  }
  var Timer=null;
  var _TabIndex=0;  
  var _defaultSettings = {        
    StartTab:0        // deafult show tab 1
    ,RollerSpeed :0   // roller speed seconds
    ,SetTab:0         // for set some tab
    ,Start:0          // start roller tab
    ,Stop:0           // stop roller tab
    ,RelTab:''        // relation tab bt
    ,threshold:0      // lazy img threshold
    ,container:window
    ,ArrowsSet:false
    ,ArrowsLeft:'#leftArrowBtn'
    ,ArrowsRight:'#rightArrowBtn'
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  
  if(container.data('StartTab')>0){
    _settings.StartTab=container.data('StartTab');
  }else{
    _settings.StartTab=0;
  }
  _settings.RollerSpeed=0;
  
  var _TabDelay=function(){
    
    if (_settings.SetTab>0){
      _settings.SetTab--;
      _changeTab(container.attr('id'),_settings.SetTab);
      container.data('StartTab',_settings.SetTab++);
      //alert('Tab id:'+container.attr('id')+';'+container.data('StartTab'));
    } 
    if (_settings.Start>0) {
      container.data('Roller',1);
      _StartRoller();
    } 
    if (_settings.Stop>0) {
      container.data('Roller',0);
      _StopRoller();
    }
    
    if ( !container.data('TabDelayInit')) {
      var $TabMenuList=$('div.TabMenu ul li',this);
      // bind every menu events
      $TabMenuList.each(function(i){
        // give tabid, tabindex to show tab when mouse over
        $(this)
          .bind('mouseover',{tabid:container.attr('id'),index:i},_setTab)
          .bind('mouseout',{tabid:container.attr('id'),index:i},_outTab)
        ;
      });
      
      var $TabContentList=$('div.TabContentD',container);
      $TabContentList.each(function(i){
        // in ECM, mayBe has DEL class name, 
        // so must remove
        if ($(this).hasClass('DEL'))
          $(this).removeClass('TabContentD');
          
        // give tabid, tabindex to show tab when mouse over
        $(this)
          .bind('mouseover',{tabid:container.attr('id'),index:i},_setTab)
          .bind('mouseout',{tabid:container.attr('id'),index:i},_outTab)
        ;
      });
      $TabContentList=$('div.TabContentD',container);
      // show tab --
      // if _settings.StartTab = 0, that mean random show start tab
      
      if ( _settings.StartTab == 0) {
        _settings.StartTab = Math.floor(Math.random()*$TabContentList.length)+1;
        //alert(container.attr('id')+':'+$TabContentList.length);
      }
      _settings.StartTab--;
      
      // show default tab when onload 
      _changeTab(container.attr('id'),_settings.StartTab);

      // roller tab if ( _settings.RollerSpeed > 0 )
      if ( _settings.RollerSpeed > 0 ){
        _RollerTab();
      }
      /*
      $('img',container).each(function(){
        var _img=$(this);
        var _src=_img.attr('src')+'?r='+Math.random();
        _img.attr('src',_src);
      });
      */
      container.data('TabDelayInit',1);
      
      if(_settings.ArrowsSet){
        _arrowsSet();
      }
      
      
    }
  }
  
  var _arrowsSet = function(){
    var _btId = container.attr('id');
    var _tablength = $('#'+_btId).find('.TabContentD').length-1;    
    $('#'+_btId).delegate(_settings.ArrowsLeft,"click", function(e){      
      var _RanShow = _TabIndex;
     _RanShow--;     
     if(_RanShow<0) _RanShow=_tablength;
     _changeTab(container.attr('id'),_RanShow);       
    });
    $('#'+_btId).delegate(_settings.ArrowsRight,"click", function(e){
      var _RanShow = _TabIndex;
      _RanShow++;      
      if(_RanShow > _tablength) _RanShow=0;
      _changeTab(container.attr('id'),_RanShow); 
    });
  }
  var _setTab = function(e){
    _changeTab(e.data.tabid,e.data.index);
    //if (Timer) Timer.stop();
    _StopRoller();
  }

  var _outTab = function(e){
    //if (Timer) Timer.reset();
    _StartRoller();
  }
  
  var _StartRoller = function(){
    if (container.data('Roller')==0) return;
    var _Timer=jQuery('body').data('MomoTabTimer_'+container.attr('id'));
    if (_Timer) _Timer.reset();
  }

  var _StopRoller = function(){
    var _Timer=jQuery('body').data('MomoTabTimer_'+container.attr('id'));
    if (_Timer) _Timer.stop();
  }
  
  var _changeTab = function(tabid,tabindex){
    var MainTab=$('#'+tabid);//get MiainTab
    // get TabContentD list to change class
    var $MenuList=$('div.TabMenu ul li',MainTab);
    $MenuList.each(function(i){
      var oa=$('a',this);
      $(this).removeClass('First-Element');
      if (oa) $(oa).addClass('First-Element');  
      
      if ( i===tabindex) { 
        $(this).addClass('selected');
        if (oa) $(oa).addClass('selected');
      }
      else {
        $(this).removeClass('selected');
        if (oa) $(oa).removeClass('selected');        
      }
    });
    // get TabContentD list to change class
    var $ContentList=$('div.TabContentD',MainTab);
    $ContentList.each(function(i){
      var _tab=$(this);
      _tab.removeClass('First-Element');
      if ( i===tabindex) {
        _tab.addClass('selected');
        $("img",_tab).each(function(){
          var _img=$(this);
          if(_img.attr("src")=="/ecm/img/cmm/blank.png"){
            if (!$.belowthefold(this, _settings) && !$.rightoffold(this, _settings) ){
              _img.attr("src",$.getImgSrc({org:_img.attr("org")}));
            }else{
              _img.attr("lazy","2");
            }
          };
        })
      } else {
        _tab.removeClass('selected');
      }
    });

    // record tabindex where roller staring use
    _TabIndex=tabindex;
    if (_settings.RelTab !=''){
      if(momoj('#'+_settings.RelTab).data('StartTab') ==null ) {
          momoj('#'+_settings.RelTab).data('StartTab',_TabIndex+1);
      }
      momoj('#'+_settings.RelTab).TabDelay({SetTab:_TabIndex+1});//data('StartTab',_TabIndex+1);
    }
  }

  // roller tab
  var _RollerTab = function(){
    var _TabLen=$('div.TabContentD',container).length;
    var _RLS=_settings.RollerSpeed*1000;
    
    // if the container has timer, stop it, and destory it;
    var _oldTimerObj=jQuery('body').data('MomoTabTimer_'+container.attr('id'));
    if (_oldTimerObj) {
      _oldTimerObj.stop();
    }
    
    Timer=container.timer(_RLS,function() {
      _TabIndex++;
      if (_TabIndex >= _TabLen) _TabIndex=0;
      _changeTab(container.attr('id'),_TabIndex);
    });

    jQuery('body').data('MomoTabTimer_'+container.attr('id'),Timer);
    
  }  
  
  return this.each(_TabDelay);
};

// roller v h
$.fn.Roller = function(settings){  
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).Roller(settings);
    });
    return false;
  }
  var Timer=null;
  var _defaultSettings = {       
    Pos : 12,         // how px move per time
    Delay : 0,        // pause sec per roller
    Speed : 200,      // roller speed
    PausePx: 0,      // move this px, and delay $Delay secs
    Direction: 'V',   // V:vertical or H:horizontal
    RotateWay: 'P',   // Positive: up or left, Negative:down or right
    MinWidth : 0    // The minima width ex:50,100
  };    
  var _settings = $.extend(_defaultSettings, settings);
  _settings.Delay *= 1000;

  if (_settings.Speed==0){
    return;
  }
  
  container.data('Roller',1);
  var _Content1=null;
  if ( _settings.Direction == 'V' ){
    _Content1=container.children('.TabContent');
  }else{
    _Content1=$('.TabContent > .TabContentD',container);
    //var _ddw=$('dl>dd',_Content1).length*$('dl>dd',_Content1).innerWidth();
    var _ddw=0;
    $('dl>dd',_Content1).each(function(){
      _ddw+=$(this).outerWidth(true);      
    });
    _Content1.css({
      position: 'relative',
      width: _ddw+'px',
      float: 'left'
    });
    $('.TabContent',container).css({width:_ddw*2+100});
  }
  
  //var _defaultHeight=parseInt(_Content1.css('height'));
  //alert(_ddw);
  if(_settings.MinWidth>0&&_settings.MinWidth>_ddw){
    return;
  }
  
  var _Content2=_Content1.clone().appendTo(_Content1.parent());
  setTimeout(function(){
    $('img',_Content2).each(function(){
      var img=$(this);
      if (img.attr('src').indexOf('/ecm/img/cmm/blank.png')>-1){
        img.attr('src',momoj.getImgSrc({org:img.attr('org')}));
      }
    });
  },500);  
  var _moveAttr='top';
  var _moveWay=-1;
  var _changeWay=-1;
  var _boxHW=0;
  if ( _settings.Direction == 'H' ){
    _moveAttr='left';
    _boxHW=parseInt(_Content1.width());
  } else {
    _boxHW=parseInt(_Content1.height());
  }  
  if ( _settings.RotateWay == 'N' ){
    _moveWay=1;
    _changeWay=1;
  }
  
  var _Content2DP=0;
  // set _content2 default position by _settings.Direction, and _settings.RotateWay
  if (_settings.RotateWay == 'N') {
    _Content2DP=-2*_boxHW;
  }
  _Content1.css(_moveAttr,'0px');
  _Content2.css(_moveAttr,_Content2DP+'px');

  // if there is change direction
  var dirP=$('.ScrollP',container.parent().parent());  
  var dirN=$('.ScrollN',container.parent().parent());
  
  var _Roller = function() {
    container
      .bind('mouseover',_mover)
      .bind('mouseout',_mout);
    ;
    
    if ( $(dirP).hasClass('ScrollP'))
      dirP.bind('click',{dir:'P'},_dclick)
          .bind('mouseover',{dir:'P'},_dmover)
          .bind('mouseout',{dir:'P'},_dmout);

    if ( $(dirN).hasClass('ScrollN'))
      dirN.bind('click',{dir:'N'},_dclick)
          .bind('mouseover',{dir:'N'},_dmover)
          .bind('mouseout',{dir:'N'},_dmout);
      
    var _C1Pos=0;
    var _C2Pos=0;
    var _mvpx=0;

    var _oldTimerObj=jQuery('body').data('MomoRollTimer_'+container.attr('id'));
    if (_oldTimerObj) {
      _oldTimerObj.stop();
    }
    
    Timer=container.timer(_settings.Speed,function(){
      if(container.data('Roller')==0) return;
      // if has pause and delay > 0, when change way, 
      // _changeWay, _moveWay will not be the same
      if ( _changeWay != _moveWay ){
        if (_mvpx >0) _mvpx = _settings.PausePx - _mvpx;
        _moveWay=_changeWay;
        if ( (_C1Pos*_moveWay) ===_boxHW) {
          _C1Pos=-1*_boxHW*_moveWay;
          _Content1.css(_moveAttr,_C1Pos+'px');
        }
        if (_C1Pos===0){
          _Content2.css(_moveAttr,_Content2DP+'px');
        }        
      }

      // move block
      _C1Pos=parseInt(_Content1.css(_moveAttr));
      _C1Pos += _settings.Pos*_moveWay;
      _C2Pos=parseInt(_Content2.css(_moveAttr));
      _C2Pos += _settings.Pos*_moveWay;
      _Content1.css(_moveAttr,_C1Pos+'px');
      _Content2.css(_moveAttr,_C2Pos+'px');
      _mvpx += _settings.Pos;
      
      if ( (_C1Pos*_moveWay) ===_boxHW) {
        _C1Pos=-1*_boxHW*_moveWay;
        _Content1.css(_moveAttr,_C1Pos+'px');
      }
      if (_C1Pos===0){
        _Content2.css(_moveAttr,_Content2DP+'px');
      }
      // when roller need pause, _settings.Delay > 0
      if ( _settings.Delay >0 &&  _mvpx === _settings.PausePx ) {
        Timer.stop();
        _moveWay=_changeWay;
        _mvpx=0;
        if(container.data('Roller')==0) return;
        var tid=setTimeout(
          function(){
            if(container.data('Roller')==0) return;
            Timer.reset();
          }
          ,_settings.Delay);
        container.data('tid',tid);
      }
    });
  
    jQuery('body').data('MomoRollTimer_'+container.attr('id'),Timer);
    //alert(container.attr('id'));
  }
  
  var _mover = function(){
    clearTimeout(container.data('tid'));
    var _Timer=jQuery('body').data('MomoRollTimer_'+container.attr('id'));
    if(_Timer){
      container.data('Roller',0);
      _Timer.stop();
    }
  }
  
  var _mout = function(){    
    clearTimeout(container.data('tid'));
    var _Timer=jQuery('body').data('MomoRollTimer_'+container.attr('id'));
    if(_Timer){
      container.data('Roller',1);
      _Timer.reset();
    }
  }

  var _dmover = function(e){
    if ( e.data.dir == 'P' ){
      $('>:first-child',dirP).addClass('O');
      $('>:last-child',dirP).removeClass('O');
    } else {
      $('>:first-child',dirN).addClass('O');
      $('>:last-child',dirN).removeClass('O');
    }    
  }

  var _dmout = function(e){
    if ( e.data.dir == 'P' ){
      $('>:first-child',dirP).removeClass('O');
      $('>:last-child',dirP).addClass('O');
    } else {
      $('>:first-child',dirN).removeClass('O');
      $('>:last-child',dirN).addClass('O');
    }    
  }  

  // change roller way  
  // no pause delay, change way right now.
  var _dclick = function(e){
    if ( e.data.dir == 'P' ){
      if (_settings.Delay>0) _changeWay=-1;
      else _changeWay=_moveWay=-1;
      _Content2DP=0;
    } else {
      if (_settings.Delay>0) _changeWay=1;
      else _changeWay=_moveWay=1;
      _Content2DP=-2*_boxHW;
    }
  }  
  
  return this.each(_Roller);
};

// adj BT css 
// usage: $().btCSS({newline:'mm-new-line-5,5',lastline:'mm-last-line,5',adjbt:1})
// newline: mm-new-line-5(class name for lastest elements of every row ),5(elements for per line)
// lastline: mm-last-line(calss name for lastest line ),5(elements for per line)
$.fn.btCSS=function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).btCSS(settings);
    });
    return false;
  }  
  var _defaultSettings = {        
    newline: 'undefined',
    lastline: 'undefined',
    lastitem: 'undefined'
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var _btcss = function(){
    // init something
    if (!container.data('BTCSSInit')){
      container.data('newline',_settings.newline);
      container.data('lastline',_settings.lastline);
      container.data('lastitem',_settings.lastitem);
      container.data('BTCSSInit',1);
    }
    if (_settings.newline!='undefined'){
      container.data('newline',_settings.newline);
    }    
    if (_settings.lastline!='undefined'){
      container.data('lastline',_settings.lastline);
    }
    if (_settings.lastitem!='undefined'){
      container.data('lastitem',_settings.lastitem);
    }  
    // do adjbt
    if (_settings.adjbt){
      //new line
      if (container.data('newline') != 'undefined'){
        var _Anewline=container.data('newline').split(',');
        
        var i=0;
        container.children().each(function(){
          i++;
          if (i%_Anewline[1] ==0)
            $(this).addClass(_Anewline[0]);
          else
            $(this).removeClass(_Anewline[0]);
          
        })
      }
      
      //last line
      if (container.data('lastline') != 'undefined'){
        var _lastline=0;
        var _line=0
        _line=parseInt(container.children().length % container.data('lastline').split(',')[1]);
        _lastline=parseInt(container.children().length/container.data('lastline').split(',')[1]);
        if (_line>0)
          _lastline++;
        _line=1;
        var _Alastline=container.data('lastline').split(',');
        var i=0;
        container.children().each(function(){
          i++;
          if (_line==_lastline)
            $(this).addClass(_Alastline[0]);
          else
            $(this).removeClass(_Alastline[0]);
          if (i%_Alastline[1] ==0)
            _line++;
        })        
      }
      
      // last item
      if(container.data('lastitem') != 'undefined'){
        var i=0;
        var _len=container.children().length;
        container.children().each(function(){
          i++;
          if(i==_len){
            $(this).addClass(container.data('lastitem'));
          }else{
            $(this).removeClass(container.data('lastitem'));
          }
        });
      }
    }
  }
  return this.each(_btcss);
}

// random show items 
$.fn.BTShowR = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).BTShowR(settings);
    });
    return false;
  }
  var _defaultSettings = {        
    SRCNT:0,
    LastEl:''
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  

  var _BTShowR=function(){
    if(_settings.SRCNT<=0){
      return;
    }
    var _ChildList=$('.BTSRC',container).children();
    var _DelCNT=0;
    var _d=0;
    var _DelA=new Array();
    _ChildList.each(function(){
      _d++;
      if($(this).hasClass('DEL'))
        _DelA[_DelA.length]=_d-1;

    });

    _DelCNT=_DelA.length;
    if (_settings.SRCNT>=_ChildList.length-_DelCNT){
      return;
    }
    //Math.floor(Math.random()*$TabMenuList.length)
    //Random show items
    var _HideA=new Array();
    // random get hide index
    for(var i=0;i<_ChildList.length-_settings.SRCNT-_DelCNT;i++){
      while(1){
        var _HideIndex=Math.floor(Math.random()*_ChildList.length);
        for(var j=0;j<_HideA.length;j++){
          if (_HideA[j]==_HideIndex){
            _HideIndex=-1;
          }
        }
        for(var j=0;j<_DelA.length;j++){
          if (_DelA[j]==_HideIndex){
            _HideIndex=-1;
          }
        }        
        if (_HideIndex>-1){
          _HideA[_HideA.length]=_HideIndex;
          break;
        }
      }
    }
    // hide the items
    var _show=0;
    for(var i=0;i<_ChildList.length;i++){
      var _hide=0;
      for(var j=0;j<_HideA.length;j++){
        if (i==_HideA[j]){
          _hide=1;
          break;
        }
      }
      if(_hide){
        $(_ChildList[i]).hide();
      }else{
        _show++;
        if (_show==_settings.SRCNT && _settings.LastEl !='')
          $(_ChildList[i]).addClass(_settings.LastEl);
      }
        //$(_ChildList[i]).remove();
      //else
      //  $(_ChildList[i]).show();
    }
  }
  
  return this.each(_BTShowR);
}

$.fn.LazyImg = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).LazyImg(settings);
    });
    return false;
  }
  var _defaultSettings = {        
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  var imgs=0;
  $('img',container).each(function(){
    var img=momoj(this);
    if (img.attr('src')){
      if (img.attr('src').indexOf('/ecm/img/cmm/blank.png')>-1){
        imgs++;
        if(img.attr('org')){
          img.attr('src',momoj.getImgSrc({org:img.attr('org')}));
        }
      }  
    }
  });
}

$.fn.KeywordSearch = function(settings){
  var countItem = 0;
  try {
    var inputOriginalCateCode='';
    if(checkIsConstrion()){
      inputOriginalCateCode = momoj("#originalCateCode").val()||'';
    }
    var _this = $(this);
    var _def = {
      url: "/servlet/KeywordAutoCompleteServlet"
    };
    _this.autocomplete({
      delay: 300,
      source: function(request, response) {
        $.ajax({
          cache: false,
          data: {kw: momoj.str2Unicode(request.term) , originalCateCode: checkIsConstrion() ? momoj("#originalCateCode").val() : '' },
          dataType: 'json',
          url: _def.url,
          success: function(kws){
            countItem = 0
            response(kws);
          },
          error: function(){
            countItem = 0
            response([]);
          }
        });
      },
      focus: function(event, ui){
        if(ui.item.action.actionType==41){
          var isconstriction = momoj('#keyword').attr("isconstriction");//限縮館架 true/false
          if((typeof isconstriction =='undefined' || !isconstriction) && typeof ui.item.action.extraValue =='undefined'){//非限縮館架且不是命中關鍵字
              _this.val(ui.item.text);
          }
        }
      },
      select: function(event, ui){
        event.preventDefault();
        event.stopPropagation();
        var item = ui.item;
        if(item.action.actionType==41){
          //location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(item.text);
          //couponSearch
          var couponSeq = momoj('#couponSeqTxt').val();
          var couponName = momoj('#couponNameTxt').val();
          if(typeof couponSeq !='undefined' && couponSeq != null && couponSeq != '') {
            if(typeof item.action.extraValue !='undefined' && item.action.extraValue.categoryCode!=""){//命中分類
              var categoryCode = item.action.extraValue.categoryCode;
              var cateLevel = item.action.extraValue.cateLevel;
              location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(item.text) + "&couponSeq=" +  encodeURIComponent(couponSeq) + '&couponName=' + encodeURIComponent(couponName)+"&cateLevel="+cateLevel+"&cateCode="+categoryCode;
            }else{
              location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(item.text) + "&couponSeq=" +  encodeURIComponent(couponSeq) + '&couponName=' + encodeURIComponent(couponName);
            }
          } else {
            if(typeof item.action.extraValue !='undefined' && typeof item.action.extraValue.categoryCode !='undefined' &&  item.action.extraValue.categoryCode!=""){//命中分類
              var categoryCode = item.action.extraValue.categoryCode;
              var cateLevel = item.action.extraValue.cateLevel;
              location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(item.text)+"&cateLevel="+cateLevel+"&cateCode="+categoryCode;
            }else if(checkIsConstrion()){//是否為符合限縮館架且有切換成限搜XXX館內商品
              var inputKeyword = item.action.actionValue||'';
              //在限搜館架中搜尋XXX
              if( typeof item.action.extraValue !='undefined' && typeof item.action.extraValue.originalCateCode !='undefined' &&  item.action.extraValue.originalCateCode!=""){
                var originalCateCode = item.action.extraValue.originalCateCode||'';
                var isBrandCategory = 'N';
                var cateType = momoj(".searchbar #cateType , .searchBk #cateType ").val()||'';
                if('21' == originalCateCode.substring(0,2)){
                  isBrandCategory = 'Y';
                }
                location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(inputKeyword)+"&originalCateCode="+originalCateCode+"&isBrandCategory="+isBrandCategory+"&cateType="+cateType;
              }else{//在全站中搜尋XXX
                location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(inputKeyword)
              }  
            }else {
              location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(item.text);
            }
          }
          //couponSearch  
        }else if(item.action.actionType==10){
          var cateCode = item.action.actionValue.split('#')[0];
          location.href =  '/category/LgrpCategory.jsp?l_code=' + cateCode;
        }
        return false;
      }, 
      open: function(event, ui){
        $('.ui-menu').width(momoj("#keyword").outerWidth() + momoj("button.inputbtn").outerWidth()+ momoj(".topArea .searchArea button").outerWidth()).css({'border': '1px solid #D7D7D7'});
      }
    }).autocomplete("instance")._renderItem = function(ul, item){
      var li = $("<li></li>");
      var a = $("<a></a>");
      var isConstriction = momoj("#keyword").attr("isconstriction");
      if(checkIsConstrion() && (countItem ==0 || countItem ==1)){
        li.addClass('goCate');
        li.addClass('goLibrary');
        var constrictBlock = genConstrictBlock(item, countItem);//限縮館架搜尋和全站搜尋區塊
        countItem++;
        //doing append新的區塊
        return li.append(constrictBlock).appendTo(ul);
      }
      if(item.action.actionType==41){//go search
        var term = _this.autocomplete("instance").term;
        if(typeof item.action.extraValue !='undefined' &&  typeof item.action.extraValue.categoryCode !='undefined' && item.action.extraValue.categoryCode!=""){//命中分類
          var text = (item.text).replace(new RegExp('(^|)(' + term + ')(|$)', 'ig'), '$1<strong>$2</strong>$3');
          var ecCategoryName =item.ecCategoryName;
          var ecCategoryColor =item.ecCategoryColor;
          li.addClass('goSearch');
          var cateName ='<span class="categoryText" style="color: '+ecCategoryColor+'; width: 10px;">'+ecCategoryName+'</span>';
          var label = $("<span></span>").html(text+cateName).addClass('kwTxt').addClass('threeDotStyle');
          a.append(label);
          //var cateName = $("<span></span>").html(" "+ecCategoryName).addClass('categoryText').css('color',ecCategoryColor);
        }else{
          var text = (item.text).replace(new RegExp('(^|)(' + term + ')(|$)', 'ig'), '$1<strong>$2</strong>$3');
          li.addClass('goSearch');
          var label = $("<span></span>").html(text).addClass('kwTxt');
          a.append(label);
        }
        if (!!item.cnt) {
          var count = $("<span></span>").text('約' + item.cnt + '件商品').addClass('kwCnt');
          a.append(count);
        }
      }else if(item.action.actionType==10){// go category
        li.addClass('goCate');
        var cateIcon = $("<img alt=\"" + item.cateName + item.wording + "\" height=\"40\" width=\"auto\">").attr('src', item.icon);
        var label = $("<span></span>").addClass('cateName').text(item.cateName);//;
        if(item.wording !=""){
          var wording = $("<span></span>").addClass('cateWording').text(' ' + item.wording + ' ＞');
          a.append(cateIcon, label, wording);
        }else{
          a.append(cateIcon, label);
        }
      }
      return li.append(a).appendTo(ul);
    };
  } catch (e) {
    console.log(e);
  };
    
    _this.keyup(function(e){
      if(e.keyCode === 13){
        e.preventDefault();
        e.stopPropagation();
        _this.autocomplete('close');
        var kw = _this.val();
        kw = kw.replaceAll('<', '').replaceAll('>', '').replaceAll('\'', '').replaceAll('\"', '');
        //是否為館內限搜
        var switchconstriction = momoj('#keyword').attr("switchconstriction");
        var originalCateCode = momoj('#originalCateCode').val();
        var cateType = momoj('#cateType').val();
        var isBrandCategory = momoj('#isBrandCategory').val();
        setTimeout(function(){
          if(!!kw){
            var couponSeq_tmp = momoj('#couponSeqTxt').val();
            var couponName_tmp = momoj('#couponNameTxt').val();
            if(typeof switchconstriction == "undefined" || switchconstriction=="false" ){
              if(typeof couponSeq_tmp!='undefined' && couponSeq_tmp!= null && couponSeq_tmp!= '') {
                location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(kw) + "&couponSeq=" +  encodeURIComponent(couponSeq_tmp) + "&couponName=" + encodeURIComponent(couponName_tmp);
              } else {
                location.href = '/search/searchShop.jsp?keyword=' + encodeURIComponent(kw);
              }
            } else {
              var url = "/search/searchShop.jsp?keyword=" + encodeURIComponent(kw)  + "&originalCateCode=" +  encodeURIComponent(originalCateCode)+ "&cateType=" +  encodeURIComponent(cateType)+ "&isBrandCategory=" +  encodeURIComponent(isBrandCategory);
              location.href = url;
            }
          }
        }, 200);
        return false;
      }
    });
}
function checkIsConstrion() {
  var $switchconstriction = momoj('#keyword').attr("switchconstriction");//是否有切換成限搜XXX館內商品
  var $isconstriction = momoj('#keyword').attr("isconstriction");//是否符合限搜館架
  if((typeof $switchconstriction !='undefined' && $switchconstriction=='true' ) && (typeof $isconstriction !='undefined' && $isconstriction=='true')){
    return true;
  }else{
    return false;
  }
}
//自動補全下拉選單新增限縮和限縮搜尋區塊
function genConstrictBlock(item, idx) {
  var constrictBlockStr = $("<a></a>");
  var originalCateNameStr = item.originalCateName||'';
  if(idx == 0 || idx == 1){//限縮館架 /全站
    if(originalCateNameStr !=""){
      var label = $("<span></span>").addClass('ac_text').html('在<strong>'+originalCateNameStr+'</strong>中搜尋')
      var wording = $("<span></span>").addClass('ac_keyWord').text(' '+item.action.actionValue+ ' ');
      constrictBlockStr.append(label, wording);
    }
  }
  return constrictBlockStr;
}

$.fn.MoMoChkLogin = function(settings){
  /*
  cookie information for login:
  loginUser top_CardMem.gif
  cardUser  top_WebMem.gif
  */
  //品牌旗艦館天的狀態更新
  if(momoj('#brandLogin').length>0){
    momoj().brandLogin();
    return false;
  }
  var _defaultSettings = {
    LoginObj:"#bt_0_150_01"
  };
  var _settings = $.extend(_defaultSettings, settings);  
  
  var _loginUser=$().cookie('loginUser');
  var _cardUser=$().cookie('cardUser');
  var _loginObj=$(_settings.LoginObj);
  var _imga1=$('.CL1 a',_loginObj);
  var _img1=$('.CL1 img',_loginObj);
  var _imga2=$('.CL4 a',_loginObj);
  var _img2=$('.CL4 img',_loginObj);
  var _txt=$('.loginTxt',_loginObj);

  if (_cardUser==null || _cardUser=='null') _cardUser='';
  if (_loginUser==null || _loginUser=='null') _loginUser='';

  if (_cardUser !='' || _loginUser !=''){
    _imga1.attr('title', $.unicode2Str('&#23458;&#25142;&#30331;&#20986;'));
    _imga1.attr('href',_imga1.attr('outsrc'));
    //_img1.attr('src',_img1.attr('outimg'));
    _imga2.attr('href','javascript:void(0);');
    _txt.show();
    momoj('.loginTxt').addClass('loginselected');
    var _a=$("#LOGINSTATUS");
    _a.html("&#30331;&#20986;");
    if (_cardUser!=''){  
    
      //_imga2.attr('title', '&#23500;&#37030;&#21345;&#21451;');
      //_img2.attr('src',_img2.attr('cardimg'));
      _cardUser=_cardUser.replace(/\*/g,";");    
    _cardUser=_cardUser.replace("&#32;&#24744;&#22909;&#65292;&#24744;&#30446;&#21069;&#25345;&#26377;&#30340;","");
    var _cardUserName = '<span id="cardUser" class="cardUser">'+_cardUser.substring(0,_cardUser.indexOf("&#32005;")-1);
    var _cardUserStatus = ' (&#40670;&#25976;&#9660;)';
    var _cardUserPoint = _cardUser.substring(_cardUser.indexOf("&#20849;")+8);
       _txt.html( momoj.unicode2Str(_cardUserName+_cardUserStatus) );
      _txt.css('color','#FFFFFF');  
      momoj('.CL4').parents("li").hide();
    
    //&#21345;&#21451;&#40670;&#25976;
    var cardPoint = [
     '<div class="cardPointList">',
       '<table border="0" cellpadding="0" cellspacing="0">',
         '<tr>',
        '<td valign="middle">&#24744;&#30446;&#21069;&#32047;&#31309;&#23500;&#37030;&#37504;&#34892;&#20449;&#29992;&#21345;&#40670;&#25976;&#20849;<span style="color:red">'
        +_cardUserPoint.replace("&#40670;","")+'</span>&#40670;</td>',          
         '</tr>',  
       '</table>', 
     '</div>'
     ].join('');
    $('#BodyBase').append(cardPoint);    
     momoj(".cardPointList").hide(); 
    }else if(_loginUser !=''){
      var _couponNumber=$().cookie('couponNumber');
      if (_couponNumber==null || _couponNumber=='null') _couponNumber='';
      if(_couponNumber!=""){
        var _a=$("#CPM");
        _a.html("<p></p>&#25240;&#20729;&#21048;<span>( "+_couponNumber+" )</span>");
      }
      //&#39318;&#38913;&#36861;&#36452;&#28165;&#21934;&#25976;&#37327;
      var _WishListNumber=momoj().cookie('WishListNumber');
      if (_WishListNumber==null || _WishListNumber=='null') _WishListNumber='0';
      if(_WishListNumber!=""){
        momoj(".wishList").show();
        var _a=momoj(".wishList a");
        _a.html("&#24050;&#36861;&#36452;<span>("+_WishListNumber+")</span>");
        var _b=momoj("#wishList a");
        _b.html("&#36861;&#36452;&#28165;&#21934;<span>("+_WishListNumber+")</span>");
      }
      
      var _notReadNumber = momoj().cookie('notReadNumber');
      if (_notReadNumber == null || _notReadNumber == 'null') _notReadNumber = '';
      if(_notReadNumber!="") {
        if(!isNaN(_notReadNumber) ) {
          if(parseInt(_notReadNumber) > 0) {
            var _a=$("#CMS");
            _a.html("<p></p>&#23458;&#26381;&#22238;&#35206;<span>( "+_notReadNumber+" )</span>");
            momoj('#CMSCE').show();
          } else if(parseInt(_notReadNumber) == 0) {
            var _a=momoj("#CMS");
            _a.html("<p></p>&#23458;&#26381;&#22238;&#35206;<span></span>");
            momoj('#CMSCE').hide();
          }
        }
      }
      
      if (momoj('#giftTxt').length > 0) {
        var giftNum = momoj().cookie('giftItem');
        if (giftNum != null) {
          giftNum = !isNaN(giftNum) ? parseInt(giftNum, 10) : 0;
          if (giftNum > 0) {
            momoj("#giftTxt").text("禮物紀錄(" + giftNum + ")");
          }
        }
      }
      
      //_imga2.attr('title', '&#19968;&#33324;&#23458;&#25142;');
      //_img2.attr('src',_img2.attr('webimg'));
      _txt.html(_loginUser);
      _txt.css('color','#EC0A8F');
      momoj('.CL4').parents("li").hide();
      //tenmax登入埋點
      if(typeof sendTenMaxLogin == "function"){
        sendTenMaxLogin();
      }
    } 
  }else{
    _imga1.attr('title', $.unicode2Str('&#23458;&#25142;&#30331;&#20837;'));
    _imga1.attr('href',_imga1.attr('insrc'));
    //_img1.attr('src',_img1.attr('inimg'));
    _imga2.attr('title', $.unicode2Str('&#35387;&#20874;&#28858;&#23458;&#25142;'));
    _imga2.attr('href',_imga2.attr('joinsrc'));
    _img2.attr('src',_img2.attr('joinimg'));
    _txt.text('');
    var _a=$("#LOGINSTATUS");
    _a.html("&#30331;&#20837;");
  }

}

$.fn.MoMoTRVChkLogin = function(){
  var _loginUser=$().cookie('loginUser');
  var _pst13=$('#bt_0_051_01 .PST1,.PST3');
  var _pst24=$('#bt_0_051_01 .PST2,.PST4');
  var _span=$('#bt_0_051_01 .PST2 p span');
  
  if (_loginUser==null || _loginUser=='null') _loginUser='';
  // momo travel
  if (_loginUser != '') {
    //_loginUser = _loginUser.replace(/\*/g, '');
    _pst13.hide();
    _pst24.show();
    _span.html(_loginUser);
  }
}

$.fn.MoMoTRVCtgSrh = function(){
  var _selM = $('#bt_0_052_01 #p_mgrpCode');
  $.ajax({
    type:"POST",
    url:"/search/TravelSearch.jsp?srhctg=2500000000",
    dataType:"text",
    success:function(cateStr){
      if(cateStr.indexOf('<html>') >= 0) return;
      _selM.find('option').remove();
      _selM.append('<option value="0">(&#35531;&#36984;&#25799;)</option>');
      var _cateA = $.trim(cateStr).split(',');
      for(var i = 0; i < _cateA.length; i++) {
        var _ctgA = _cateA[i].split('=');
        _selM.append('<option value="'+$.trim(_ctgA[0])+'">'+$.trim(_ctgA[1])+'</option>');
      }
    }
  });
  
  _selM.change(function(){
    var _val = momoj(this).val();
    if (typeof(_val)=='undefined' || _val=="" || _val=="0") return;
    var _sel = momoj('#bt_0_052_01 #p_sgrpCode');
    _sel.find('option').remove();
    _sel.append('<option value="0">(&#35531;&#36984;&#25799;)</option>');
    $.ajax({
      type:"POST",
      url:"/search/TravelSearch.jsp?srhctg="+_val,
      dataType:"text",
      success:function(cateStr){
        var _cateA = $.trim(cateStr).split(',');
        for(var i = 0; i < _cateA.length; i++) {
          var _ctgA = _cateA[i].split('=');
          _sel.append('<option value="'+$.trim(_ctgA[0])+'">'+$.trim(_ctgA[1])+'</option>');
        }
      }
    });
  });
}

// for Brwose Produce History by HHWU
$.fn.history = function(settings) {
  var _defaultSettings = {
        showItem : 4,
        arrowUpImage : '/ecm/img/cmm/browseHistory/watermark_arrowup.gif',
        arrowDnImage : '/ecm/img/cmm/browseHistory/watermark_arrowdown.gif',
        baseUrl: '',
        offsetTop: 10,
        offsetLeft: 0.1,
        arrowDnId: 'arrowDown',
        arrowUpId: 'arrowUp',
        imageHeight : 60,
        elementWidth: 64
  };
  $.extend(_defaultSettings, settings || {});
  var _BrowHist=$().cookie("GoodsBrowsingHistory");
    var aryCodeList = new Array();
    if ( !(_BrowHist =='null' || _BrowHist ==null ) ){
        aryCodeList = $().cookie("GoodsBrowsingHistory").split("/");
    } else {
        return this;
    }

  var clickIdx = 0;
  var upId = _defaultSettings.arrowUpId;
  var dnId = _defaultSettings.arrowDnId;
    var thisObj = this;
    var baseObj = $('img' , thisObj);
    thisObj.css({'width': _defaultSettings.elementWidth});

  var htmlList= [
  '<span id="list">',
    '<div id="'+ upId +'">',
      '<img src="' + _defaultSettings.baseUrl +_defaultSettings.arrowUpImage+'">',
    '</div>',
    '<span id="listItem"></span>',
    '<div id="'+ dnId +'">',
      '<img src="'+ _defaultSettings.baseUrl +_defaultSettings.arrowDnImage+'">',
    '</div>',
  '</span>'
  ].join('');

  baseObj.after(htmlList);

  var listObj = $("#list");
  var items;
  
  var numberOfItems = (aryCodeList.length < _defaultSettings.showItem) ? aryCodeList.length : _defaultSettings.showItem ;
    var displayZoneHeight = _defaultSettings.imageHeight * numberOfItems;

//    if (false) { //不處理IE6
//        var temp = thisObj.position();
//        listObj.css({'position': 'absolute', 'width': _defaultSettings.elementWidth, 'top': temp.top + baseObj.height() + 'px', 'left': temp.left + 'px'} ).hide();
//    } else {
        listObj.css({'position': 'absolute', 'width': _defaultSettings.elementWidth, 'display':'block','float':'left'} ).hide();
//    }

  var listItemObj = $("#listItem").css({'position':'absolute','overflow-y': 'hidden', 'height' : displayZoneHeight + 'px'});
    var objDn = $('#'+dnId);

  thisObj.mouseenter(function() {
    clickIdx=0;
    listItemObj.empty();
    $.each(aryCodeList, function(idx, i_code_op) {
      var icode = i_code_op.split('_')[0];
      var op = i_code_op.split('_')[1];
      var suffix = i_code;
      for(var i=0;i<10-i_code.length;i++){
        suffix='0'+suffix;
      }
      suffix=suffix.substring(0,4)+'/'+suffix.substring(4,7)+'/'+suffix.substring(7,10);
      var img_src = _defaultSettings.baseUrl +'/goodsimg/'+ suffix+'/'+ i_code+'_X.jpg?t=' + op;
      var html = ['<div class="item">',
      '<span>',
      '<a href="'+ _defaultSettings.baseUrl +'/goods/GoodsDetail.jsp?i_code=' + i_code + '" target="_blank">',
      '<img height="60" style="border-left-width:2px; border-right-width:2px;border-color:transparent;" src="'+momoj.getImgSrc({org:img_src})+'">',
      '</a>',
      '</span>',
      '</div>'].join('');
      listItemObj.append($(html).css({'overflow': 'hidden','height': '60px','width': _defaultSettings.elementWidth}));
        });
        listObj.show();
    items = $("#listItem .item");

        objDn.css({
            'position': 'relative',
            'top': numberOfItems * _defaultSettings.imageHeight +'px'
        });
  }).mouseleave(function() {
    listObj.hide();
  });

  $('#'+ upId).click( function() {
    if (clickIdx >= aryCodeList.length - numberOfItems ) return;
    items.each(function() {
            var obj = $(this);
            var tmp_css = obj.css('top');
            var tmp = (tmp_css == 'auto') ? 0 : parseInt(tmp_css);
            obj.css({'position': 'relative', 'top': tmp - _defaultSettings.imageHeight + "px"});
    });
        clickIdx++;
  });
  
    objDn.click( function() {
    if (clickIdx <= ((numberOfItems == _defaultSettings.showItem)? 0 : numberOfItems) ) return;
    items.each(function(idx) {
            $(this).css({'position': 'relative',"top": parseInt($(this).css("top")) + _defaultSettings.imageHeight + "px"});
    });
        clickIdx--;
  })          

  return this;
};

// for SiteMap Produce History by HHWU
$.fn.iframeShow = function(settings) {

    //FIXME, cache and effect
    var _defaultSettings = {
        //event: 'click',
        zindex: 9000,
        url: null,
        width: 650,
        height: 700
    };
    var rightTop = { x : 0, y : 0 }
    $.extend(_defaultSettings , settings || {} );

    this.bind('click' , function() {
        if($('#showFrame').length>0){
          $('#showFrame').show();
          return this;
        }

        var displayLayer = [
        '<div id="showFrame" style="position: absolute">',
            '<iframe id="mapFrame" allowtransparency="true" frameborder="0" style="background-color:transparent"></iframe>',
        '</div>',
        ].join('');   
    
        $(displayLayer)
            .css({
                'z-index': _defaultSettings.zindex,
                'height': _defaultSettings.height,
                'width' : _defaultSettings.width
            }).hide().appendTo($('body'));
    
        $('#mapFrame').css({
            'position': 'absolute',
            'border': "0px none",
            'height': _defaultSettings.height,
            'width' : _defaultSettings.width
        });
        var thisObj = $(this);
        var offsetObj = thisObj.position();
        var displayObj = $("#showFrame");
    
        _defaultSettings.url = "/activity/090202105137/main.html";
    
        rightTop.y = $(document).scrollTop();
        rightTop.x = $('body').position().left;
    
        $('iframe#mapFrame').attr('src', _defaultSettings.url).load(function(){
            // Specialized for momoshop
            $(this).contents().find('img[onclick]').parent().parent().click(function(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
                displayObj.slideToggle();
            });
        }).css({'background-color': 'transparent'});
        displayObj.css({
            'background-color': 'transparent',
            'top':  rightTop.y + 'px',
            'left': rightTop.x + 'px'
        });

    //this.bind('click' , function() {
        displayObj.slideToggle();
    });
    
    return this;

};

// ajax for goods price by goods code
$.fn.getGoodsPrice = function(settings){
  var gds=$(this);
  var _defaultSettings = {
    URL:"/ajax/getGoodsPri.jsp",
    GoodsCode:""
  };
  var _goodsPrice='';
  var _settings = $.extend(_defaultSettings, settings);
  if(_settings.GoodsCode=='') return '';
  $.ajax({
    url:_settings.URL,
    type:'POST',
    data:{goodsCode:_settings.GoodsCode},
    dataType:'html',
    async:false,
    success:function(content){
      _goodsPrice=content;
    }
    
  });
  //alert('goods price:'+_goodsPrice);
  return _goodsPrice;
}

// ajax for goods price by goods code
$.fn.getGoodsProInfo = function(settings){
  var gds=$(this);
  var _defaultSettings = {
    URL:"/ajax/getGoodsProInfo.jsp",
    GoodsCode:""
  };
  var _goodsInfo='';
  var _settings = $.extend(_defaultSettings, settings);
  if(_settings.GoodsCode=='') return '';
  $.ajax({
    url:_settings.URL,
    type:'POST',
    data:{goodsCode:_settings.GoodsCode},
    dataType:'html',
    async:false,
    success:function(content){
      _goodsInfo=content;
    }
    
  });
  //alert('goods price:'+_goodsInfo);
  return _goodsInfo;
}

// for DgrpCategory bt_9_002 goods price
$.fn.fixGoodsPrice = function(settings){  
  var container=$(this);
  var _defaultSettings = {
    elsLimit:0,                     //if elsLimit eq 0, do not check
    mainDiv:'',
    failHide:true,
    succShow:true,
    proImg:true,                    //&#26159;&#21542;&#35722;&#26356; promote type image
    proImgTag:'.content div:first'  //&#35722;&#26356; promote img &#30340;&#20301;&#32622;
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  // if elments len ne elsLimit
  //alert(container.length);
  if(_settings.elsLimit>0 && container.length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }
  var _goodsCode='';
  container.each(function(){
    var _class=$(this).attr('class');
    var _classA=_class.split(' ');
    var _gc='0__';
    for(var i=0;i<_classA.length;i++){
      if(_classA[i].match(/^GDS-/) ){
        _gc=_classA[i].replace(/^GDS-/,'')+'__';
        //_goodsCode+=_gc+'__';
        break;
      }
    }
    _goodsCode+=_gc;
  });  
  _goodsCode=_goodsCode.replace(/__$/,'');  
  if(_settings.elsLimit >0 && _goodsCode.split('__').length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;  
  }
  var _goodsPrice=$().getGoodsProInfo({GoodsCode:_goodsCode});
  _goodsPrice=_goodsPrice.replace(/\n/g,'');
  _goodsPrice=$.trim(_goodsPrice);
  var _goodsPriceA=_goodsPrice.split('__');
  if(_settings.elsLimit>0 && _goodsPriceA.length < _settings.elsLimit){
    if (_settings.failHide) $('#'+_settings.mainDiv).hide();
    return;
  }
  var _els=0;
  var _elOKs=0;
  container.each(function(){
    var _el=$(this);
    var _elTop='';
    var _classELA=_el.attr('class').split(' ');
    for(var _elClassi=0;_elClassi<_classELA.length;_elClassi++){
      if(_classELA[_elClassi].match(/^bt_/)){
        _elTop=$('#'+_classELA[_elClassi]);
        break;
      }
    }    
    if(_goodsPriceA[_els].split('-')[0]==0){
      _el.html('&nbsp;');
      //if (_settings.failHide) $('#'+_settings.mainDiv).hide();
      _elTop.hide();
    }else{
      _elOKs++;
      _el.text(_goodsPriceA[_els].split('-')[0]);
      if(_settings.proImg){
        var _imgstatus=_goodsPriceA[_els].split('-')[1];
        if(typeof _imgstatus=='undefined') _imgstatus='0000';
        if(_imgstatus.length != 4) _imgstatus='0000';
        var _imgHtml='';
        // &#24555;&#36895;&#21040;&#36008;,TV, &#25240;&#20729;&#21048;, &#20419;&#37559;
        if (_imgstatus.substr(0,1)=='1') _imgHtml+='<img src="//image.momoshop.com.tw/ecm/img/cmm/goodsdetail/todayhome.gif"/>';
        if (_imgstatus.substr(1,1)=='1') _imgHtml+='<img src="//image.momoshop.com.tw/ecm/img/de/9/bt_9_002/tvb.gif"/>';
        if (_imgstatus.substr(2,1)=='1') _imgHtml+='<img src="//image.momoshop.com.tw/ecm/img/de/9/bt_9_002/couponb.gif"/>';
        if (_imgstatus.substr(3,1)=='1') _imgHtml+='<img src="//image.momoshop.com.tw/ecm/img/de/9/bt_9_002/saleb.gif"/>';
        var _imgTag=$(_settings.proImgTag,_elTop);
        _imgTag.empty().append(_imgHtml);
      }
    }
    _els++;
  });
  if (_settings.failHide && _elOKs < _settings.elsLimit){
    $('#'+_settings.mainDiv).hide();
    return;
  }
  $('#'+_settings.mainDiv).show();
}

// for cancel browser refresh
$.fn.cancelF5 = function(){
  window.focus();
  $(window.document).keydown(function(event) {
    _event = /msie/.test(navigator.userAgent.toLowerCase()) ? window.event : event;
    if (_event.keyCode == '116') { // &#31105; F5
      _event.keyCode = 0;
      return false;
    }
    if (_event.ctrlKey && _event.keyCode == '82') { //&#31105; Ctrl+R
      return false;
    }
    if (_event.shiftKey && _event.keyCode == '121') { //&#31105; shift+F10
      return false;
    }
  });
}

// for ghost shopping car
$.fn.shoppingCart = function(settings){
  return {
    open: function(){
      return this;
    },
    close: function(){
      return this;
    }
  }  
  /*
  var _ssl_domain_url='';
  if(typeof _SSL_DOMAIN_URL=='string')
    _ssl_domain_url=_SSL_DOMAIN_URL;
    
  var _defaultSettings = {
    shopCartUrl:_ssl_domain_url+"/order/Cart.jsp?"
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var cartURL= new Array(
    "cart_name=shopcart",
    "cart_name=first",
    "cart_name=superstore",
    "cart_name=matsusei1"
  );

  var container=$('#ShoppingCar');
  if(container.length==0){// if not exists, create first
    $('body').append('<div id="ShoppingCar" style="width:183px;position:absolute;z-index:10000;"></div>');  
    container=$('#ShoppingCar');
    var shopCar = [
    '<div class="title" style="width:181px;">',
      '<img class="shopCart" src="/ecm/img/cmm/shopcar/carcar_03.gif" style="width:127px;border:0px;"/>',
      '<img class="opcl" src="/ecm/img/cmm/shopcar/carcar_04.gif" style="width:54px;cursor:pointer;border:0px;"/>',
    '</div>',
    '<div class="content" style="width:181px;overflow:hidden;background:transparent url(//image.momoshop.com.tw/ecm/img/cmm/shopcar/carcar_06.gif) repeat-y">',
    '</div>',
    '<div class="bottom" style="width:181px;">',
      '<img src="/ecm/img/cmm/shopcar/carcar_08.gif" style="width:181px;height:6px;border:0px;"/>',    
    '</div>'
    ].join('');
    container.html(shopCar);
  }

  if(!container.data('cartOpen'))
    container.data('cartOpen',1);
  
  if(!container.data('initCart')) {
    container.data('initCart',1);
    if (typeof shopCart=="object"){
      var _carts=0;
      for(var i=0;i<shopCart.length;i++){
        if (shopCart[i][1] > 0){
          _carts++;
        }
      }
      if (_carts){
        // bind window onscroll
        $(window).scroll(function(){_cartMove()});
        $(window).resize(function(){_cartMove()});
      }
    }
    //$('.title .shopCart',container)
    //  .click(function(){document.location.href=_settings.shopCartUrl});
    $('.title .opcl',container)
      .click(function(){
        if(container.data('cartOpen')){
          _cartClose();
        } else {
          _cartOpen();
        }
      });
  }
  
  // set cart information
  var _cartSet = function(){
    var _carts=0;
    if (typeof shopCart=="object"){
      //gshopcart[0]=new Array(cartName,products,money)
      for(var i=0;i<shopCart.length;i++){
        if (shopCart[i][1] > 0){
          _carts++;
          if(_carts==1)
            $('.content',container).empty().append('<ul style="width:181px;"></ul>')
          
          var _table=$('.content ul',container);
          //var _carturl=_settings.shopCartUrl+cartURL[i];
          var _carturl='javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_settings.shopCartUrl+cartURL[i]+'\'}});';
          var _tr=[
            '<li style="height:24px;">',
              '<p style="text-align:left;width:50px;line-height:24px;color:#003399;font-size:12px;margin-left:4px;float:left;">'+shopCart[i][0]+'</p>',
              '<p style="width:22px;float:left;line-height:20px;"><a href="'+_carturl+'" style="color:#FF0000;font-size:12px;text-decoration:underline;">('+shopCart[i][1]+')</a></p>',
              '<p style="width:65px;text-align:right;float:left;color:#FF0000;font-family:Arial;font-size:15px;font-weight:bold;line-height:24px;">'+shopCart[i][2]+'&#20803;</p>',
              '<p style="width:37px;float:left;"><a href="'+_carturl+'"><img src="/ecm/img/cmm/shopcar/cound2.gif" /></a></p>',
            '</li>'
          ].join('');
          _table.append(_tr);
        }
      }
    }
    
    if(_carts==0){
      container.hide();
      $(window).unbind('scroll','_cartMove');
      $(window).unbind('resize','_cartMove');
    }else{
      container.show();
    }
  }
  
  var _cartMove = function(){
    var _ctleft=$(window).width()+$(window).scrollLeft()-container.width();
    var _cttop=$(window).height()+$(window).scrollTop()-container.height();
    container.css({'left':_ctleft,'top':_cttop});
  }
  var _cartOpen = function(){
    $('.title .shopCart',container).attr('src','/ecm/img/cmm/shopcar/carcar_03.gif');
    $('.title .opcl',container).attr('src','/ecm/img/cmm/shopcar/carcar_04.gif');
    $('.content',container).show();
    $('.bottom',container).show();  
    _cartMove();
    container.data('cartOpen',1)
  }
  
  var _cartClose = function(){
    $('.title .shopCart',container).attr('src','/ecm/img/cmm/shopcar/carcarclose_03.gif');
    $('.title .opcl',container).attr('src','/ecm/img/cmm/shopcar/carcarclose_04.gif');
    $('.content',container).hide();
    $('.bottom',container).hide();
    _cartMove();
    container.data('cartOpen',0)
  }
  
  return {
    open: function(){
      return container;
      _cartSet();
      _cartOpen();
      
    },
    close: function(){
      return container;
      _cartClose();
      
    }
  }
  */
}

$.fn.shoppingCartForTop = function(settings){
  var container=$(this);
  var _defaultSettings = {
    shopCartUrl:"/order/Cart.jsp?",
    URL:"/order/GhostCart.jsp"
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var cartURL= new Array(
    "cart_name=shopcart",
    "cart_name=first",
    "cart_name=superstore",
    "cart_name=matsusei1",
    "cart_name=first5h"
  );
  var _shopCart='';
  container.on("mouseenter",function(){
    _show();
  }).on("mouseleave",function(){
    _hide();
  });
  var _createCart=function(){
    _shopCart=$('#ShoppingCarTop');
    if(_shopCart.length==0){// if not exists, create first
      var _shopCartLayout=[
        '<div style="width:188px;height:29px;line-height:29px;color:#666666;font-family:Arial,Helvetica,sans-serif;overflow:hidden;margin:1px;text-align:center;background:transparent url(//image.momoshop.com.tw/ecm/img/cmm/shopcar/cart_tit_bg.gif) no-repeat;">',
        '&#24744;&#26377;&#65306; <span class="prdAmt" style="color:#FF0000;">0</span> &#20491;&#21830;&#21697;',
        '</div>'
        ].join('');      
        $('body').append('<div id="ShoppingCarTop" style="display:none;border:4px solid rgb(255,204,204);position:absolute;width:190px;background-color:rgb(255,240,240);z-index:10000;"></div>');  
      _shopCart=$('#ShoppingCarTop');
      _shopCart.html(_shopCartLayout);

      if (typeof shopCart!="object"){
        // use ajax get cart list
        $.ajax({
          url:_settings.URL,
          type:'GET',
          data:{cid:"memfu",oid:"cart",ctype:"B",mdiv:"1000100000-bt_0_003_01"},
          dataType:'html',
          async:false,
          cache: false,
          success:function(content){
            momoj('body').append(content);
          }
        });
      }
      var _prds=0;
      //var _bold='font-weight:bold;';
      //var _font_weight=_bold;
      for(var i=0;i<shopCart.length;i++){
        if (shopCart[i][1] > 0){
          var _cartPrds=shopCart[i][1]-0;
          _prds+=_cartPrds;
          var _line_height=(shopCart[i][0].length>4)?"":"line-height:29px;";
          //_font_weight=(_font_weight=="")?_bold:"";
          var _carturl='javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_settings.shopCartUrl+cartURL[i]+'\'}});';
          var _tr=[
            '<div style="width:188px;height:29px;color:#666666;margin:1px;" class="fw">',
              '<p style="width:54px;'+_line_height+';height:29px;float:left;color:#666666;font-size:12px;padding-left:4px;text-align:left;"><a href="'+_carturl+'" style="color:#666666;font-size:12px;">'+shopCart[i][0]+'</a></p>',
              '<p style="width:16px;line-height:29px;float:left;"><a href="'+_carturl+'" style="color:#0099CC;font-size:12px;">('+shopCart[i][1]+')</a></p>',
              '<p style="width:65px;line-height:29px;float:left;text-align:right;color:#666666;font-family:Arial;font-size:12px;"><a href="'+_carturl+'" style="color:#666666;font-size:12px;">'+shopCart[i][2]+'&#20803;</a></p>',
              '<p style="width:40px;margin:4px 0pt 0pt 4px;float:left;"><a href="'+_carturl+'"><img src="//image.momoshop.com.tw/ecm/img/cmm/shopcar/cart_btn_2.gif" /></a></p>',
            '</div>'
          ].join('');
          _shopCart.append(_tr);
        }
      }
      if(_prds>0){
        $('.prdAmt',_shopCart).text(_prds);
      }
      $('.fw',_shopCart).on("mouseenter",function(){
        $(this).css({'font-weight':'bold'});
      }).on("mouseleave",function(){
        $(this).css({'font-weight':'normal'});
      });
      
      _shopCart.on("mouseenter",function(){
        _show();
      }).on("mouseleave",function(){
        _hide();
      });
    }
  }
  
  var _show=function(){
    _createCart();
    var _bodyBaseLeft=momoj('#BodyBase').position().left; // &#30070;&#34722;&#24149;&#36229;&#36942;&#36889;&#20491; 1024 &#23532;&#24230;&#26178;&#65292;&#35201;&#29992;&#36889;&#20491;&#20462;&#27491; left
    var _pos=container.position();
    var _height=container.height();
    var _x=_pos.left+_bodyBaseLeft;
    var _y=_pos.top+_height;
    _shopCart.css({left:_x,top:_y});
    _shopCart.show();
  }

  var _hide=function(){
    _shopCart.hide();
  }

  return container;
}

// &#36974;&#32617;&#22294;&#23652;
$.fn.LayerMask = function(settings){
  var container=$('#MoMoLM');
  if(container.length==0)// if not exists, create first
    $('body').append('<div id="MoMoLM"></div><div id="MoMoLMContent"></div>');
  container=$('#MoMoLM');
  var _content=$('#MoMoLMContent');
  var _defaultSettings = {
    bgColor:'#777777',  
    opacity:'0.5',
    contentWidth:'600px',
    contentHeight:'500px',
    contentBGColor:'#FFFFFF'
  };    
  var _settings = $.extend(_defaultSettings, settings);
  var _MaxZindex=1;
  $('div').each(function(){
    //alert('zindex:'+$(this).css('z-index')+';'+typeof $(this).css('z-index') );
    var _zindex=$(this).css('z-index');
    if(typeof _zindex=='number' && _zindex>_MaxZindex){
      _MaxZindex=_zindex;
    }else if(typeof _zindex=='string'){
      if(_zindex=='auto' || _zindex=='undefined') _zindex=1;
      _zindex=_zindex-1+1;
      if(_zindex>_MaxZindex) _MaxZindex=_zindex;
    }
  });
  _MaxZindex+=1;
  var _LMHeight=$(document).height();
  var _LMWidth=$(document).width();

  container.css({
    height:_LMHeight,
    width:_LMWidth,
    'z-index':_MaxZindex,
    display:'none',
    position:'absolute',
    'background-color':_settings.bgColor,
    top:'0px',
    left:'0px',
    opacity:_settings.opacity
  });
  // set default width and height
  _content.css({
    width:_settings.contentWidth,
    height:_settings.contentHeight,
    'z-index':_MaxZindex+1,
    display:'none',
    'background-color':_settings.contentBGColor
  });
    
  var _showContent = function(){
    container.show();
    _content.show();
    // get content width, height and set to screen center
    var _ctWidth=_content.width();
    var _ctHeight=_content.height();
    var _ctTop=($(window).height()-_ctHeight)/2+$(document).scrollTop();
    _ctTop=(_ctTop<0)?1:_ctTop;
    var _ctLeft=($(window).width()-_ctWidth)/2+$(document).scrollLeft();
    _ctLeft=(_ctLeft<0)?1:_ctLeft;
    _content.css({
      top:_ctTop,
      left:_ctLeft
    });
  }
  var _close = function(){
    container.hide();
    _content.hide();
  }
  
  return {
    open: function(){
      _showContent();
      return container;
    },
    close: function(){
      _close();
      return container;
    }
  }
}

// for momo login
$.fn.MomoLogin = function(settings){
  var _defaultSettings = {
    GoCart: false,
    LoginSuccess: '',
    LoginCancel: '',
    preUrl: ''
  };    
  
  var _settings = $.extend(_defaultSettings, settings); 

  var _loginUser=$().cookie('loginUser');//loginUser
  if (!(_loginUser==null || _loginUser=='null' || _loginUser=="")){
    if ($.isFunction(_settings.LoginSuccess)) {
      _settings.LoginSuccess.call(this);
    }    
    return;
  }

  /**
   * 若為APP登入，且裝置為Android，則呼叫ajax，取得登入資料，確認是否已登入
   * 若已登入，則呼叫_settings.LoginSuccess
   */
  if (navigator.userAgent.toLowerCase().indexOf('momoshop') > -1 && !(location.href.indexOf('npn=1vEMgHFmaeHq') > -1) && !navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    let rtn = momoj.ajaxTool({data:{flag:6013}});
    if(rtn && rtn.rtnData && rtn.rtnData.result && rtn.rtnData.result === 'Y'){
      if ($.isFunction(_settings.LoginSuccess)) {
        _settings.LoginSuccess.call(this);
      }    
      return;
    }
  }
  
  /*若使用APP登入將網址導為APP網址 zrtseng 2016.12.09*/
  /*撇除雲端登入edm頁面 ecchao 2018.10.26*/
  if(navigator.userAgent.toLowerCase().indexOf('momoshop') > -1 && !(location.href.indexOf('npn=1vEMgHFmaeHq') > -1)) {
    var preUrl = location.href;
    var url = "";
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { // ios
      url = "//https://m.momoshop.com.tw/mymomo/login.momo";
    } else { 
      //android # 處理 待app強更後拿掉 start
      if( preUrl.indexOf('cmmedm.jsp')>-1 && preUrl.indexOf('#')>-1 ){
        var hash = preUrl.substring(preUrl.indexOf('#')+1);
        preUrl = preUrl.substring(0,preUrl.indexOf('#'));              
        preUrl += ('&hash=' + hash);
      }
      //android # 處理 待app強更後拿掉 end
      url = "//https://www.momoshop.com.tw/api/moecapp/Login";
    }    
    if(!(preUrl == null || preUrl == "")) {
      url += "?preUrl=" + preUrl;
    }
    location.href = url;
    return;
  }
  showLogin(_settings);
}

$.fn.TrvMenu = function(settings){
  var container=$(this);
  if ( container.length >1 ) {
    container.each(function(){
      $(this).TrvMenu(settings);
    });
    return false;
  }
  var _defaultSettings = {
  };
  var _settings = $.extend(_defaultSettings, settings);
  var _url=location.href.match(/(.*)\/\/(.*)\/(.*)\/(.*)/)[4];
  //_url=_url.replace('&mdiv=1000400000-bt_0_060_01&ctype=B','');

  var _liLen=$('ul li',container).length;
  var _liNow=0;
  var _cateName='';
      
  $('ul li',container).on("mouseenter", function(){
    $(this).addClass('BGO');
  }).on("mouseleave",function(){
    $(this).removeClass('BGO');
  }).each(function(){
    var _li = $(this);
    _liNow++;
    var _a=$('a',_li);
    var _liLink=_a.attr('href');
    var _link='';
    if (_liLink.indexOf('LgrpCategory.jsp')>-1){
      var _lcode=get_form(_liLink,'l_code');
      var _urlLcode=get_form(_url,'l_code');   
      if(_urlLcode =='' && _url.indexOf('DgrpCategory.jsp')>-1){    
        _urlLcode=$().cookie('l_code');;
      }else if(_urlLcode ==''&&document.location.href.indexOf('/goods/')>-1){ //for goodsDetail     
    var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');
      if (_d_code_li.length > 0){      
          var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');      
          if (_d_code.length>5){
          _urlLcode=_d_code.substr(0,5)+'00000';
         }
       }
    }   
      if (_lcode==_urlLcode){
        _li.addClass('Selected');
        _cateName=$('a span',_li).text();
      }else{
        _li.removeClass('Selected');
      }
    }else{
      if ( _liLink.indexOf('//')>-1){
        _link=_liLink.match(/(.*)\/\/(.*)\/(.*)\/(.*)/)[4];
      } else if(_liLink.match(/\/(.*)\/(.*)/)){
        _link=_liLink.match(/\/(.*)\/(.*)/)[2];
      }
      if (_link == _url ){
        _li.addClass('Selected');
      }else{
        _li.removeClass('Selected');
      }
    
    }
  })
  ;
  
  if($('#NavCategoryName').length>0){
    $('#NavCategoryName').html(' &gt; '+_cateName);
  }

  momoj('.bt_2_layout,#BodyBigTableBase').addClass('ft25');
  return container;
}

$.fn.MoMu1109=function(settings){
  var container=$(this);
  if ( container.length >1 ) {
    container.each(function(){
      $(this).MoMu1109(settings);
    });
    return false;
  } 
  var _defaultSettings = {        
    rowLenLeft:8,
    rowLenRight:1,
    rowLenRightBom:5,
    rowLenRightBomD:5,
    rowLenRightBomN:8,
    scrWidth:980,
    lbt:'#bt_0_layout_b205',
    subMnId:'bt_0_143_',    
    liHeight:24,
    liWidth:130,
    ulWidth:140,
    liWidthRight:150,
    ulWidthRight:170,
    liWidthRightBom:150,
    ulWidthRightBom:170,
    divHeightRight:50,
    divHeightRightBomD:155,
    divHeightRightBomN:214
  };
  var _settings = $.extend(_defaultSettings, settings);
  var _lbt=$(_settings.lbt);

  var _calCols=function(len,lim){
    var _cols=Math.floor(len/lim);
    var _mod=len%lim;
    if(_mod>0){
      _cols++;
    }else{
      _mod=lim;
    }
    var _rtn={
      cols:_cols,
      mod:_mod
    };
    
    return _rtn;
  }
  //get d_code from NVA
  var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');  
  // get ToothCode
  var _FTOOTH=$().cookie('FTOOTH');
  if (_FTOOTH==null || _FTOOTH=='null'){;
    _FTOOTH=get_form(document.location.href,'FTOOTH');
    if (_FTOOTH != "") {
      _FTOOTH=_FTOOTH.replace('FT','');
    } else {
      if (_d_code_li.length > 0){
        var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
        if (_d_code.length>2){
          _FTOOTH=_d_code.substr(0,2);
        }
      }
    }
  }

  // deal special url 
  $('.subMenu1109 ul li a',_lbt).each(function(){
    var _aElm=$(this);
    if(_aElm.length==1 && _aElm.attr('href').indexOf('FI=Y')>-1) {
      // EC Stock
      _aElm.append('<span class="Fast">&#12304;&#49;&#50;&#72;&#36895;&#36948;&#12305;</span> ');
    }else if(_aElm.length==1 && _aElm.attr('href').indexOf('TV=Y')>-1) {
      // TV Product
      _aElm.append('<span class="Fast">&#12304;&#38651;&#35222;&#36092;&#29289;&#12305;</span> ');
    }  
  });

  // get l_code
  var _l_code=$().cookie('l_code');
  if (document.location.href.indexOf('/goods/')>-1 || _l_code==null || _l_code=='null') {
    _l_code="";
    if (_d_code_li.length > 0){
      var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
      if (_d_code.length>5){
        _l_code=_d_code.substr(0,5)+'00000';
      }
    }
  }
  
  // for relation Category use, keep now, because deal subMenu will re-sort li tag
  //alert(_settings.html());
  var _realLia=$('#'+_settings.subMnId+_FTOOTH+' .btleft ul li');  
  //deal bt_2_026_01 lgrpcategory contentArea 2011/10/20
  var _realLib=$('#'+_settings.subMnId+_FTOOTH+' .btright ul li');
  var _realLic=$('#'+_settings.subMnId+_FTOOTH+' .btrightbottom ul li');  
  // left Category
  var _leftCateBGO=function(_d_code){
    var _d_code_link='d_code='+_d_code;
    var _cateM='';
    $('#bt_cate_top li').each(function(){
      var _li=$(this);
      if(_li.hasClass('cateM')){
        _cateM=_li;
      }else if( $('a',_li).attr('href').indexOf(_d_code_link)>-1){
        _li.addClass('BGO');
        if(_li.hasClass('MoreHide')){
          _li.removeClass('MoreHide');
          _cateM.after(_li);
          return false;
        }
      }
    });
  }
  //deal real category
  var _realHtmlF=function(){
    // deal Relation Category Area
    var _realHtml=$([
    '<div class="lbtclass" style="width:200px">',
      '<div id="relatedArea" class="btclass">',
        '<div class="curvy">',
          '<em class="ctl"><b>&bull;</b></em>',
          '<em class="ctr"><b>&bull;</b></em>',
          '<em class="cbr"><b>&bull;</b></em>',
          '<em class="cbl"><b>&bull;</b></em>',
          '<div id="tips">',
            '<div class="curvy">',
              '<em class="ctl"><b>&bull;</b></em>',
              '<em class="ctr"><b>&bull;</b></em>',
              '<em class="cbr"><b>&bull;</b></em>',
              '<em class="cbl"><b>&bull;</b></em>',
              '<div class="contentArea">',
                '<ul>',
                  '<li class="cateM">&#30456;&#38364;&#20998;&#39006;</li>',
                '</ul>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
    ].join(''));  
    //&#21697;&#38917;&#20998;&#39006;
    var _realLis=_realLia.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){        
        var _li=$(_realLia[i]).clone();
        if(_li.text().indexOf('12H&#36895;&#36948;')>-1 || _li.text().indexOf('&#38651;&#35222;&#36092;&#29289;')>-1) continue;
        _li.addClass('cateS').attr('style','').css({width:'194px'});
        $('a',_li).attr('style','').css({width:'164px'});
        $('.contentArea ul',_realHtml).append(_li);        
      };      
    }
    //&#21697;&#29260;&#20998;&#39006;
    realLis = _realLib.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){
        var _li=$(_realLib[i]).clone();
        _li.addClass('cateS').attr('style','').css({width:'194px'});
        $('a',_li).attr('style','').css({width:'164px'});
        $('.contentArea ul',_realHtml).append(_li);        
      };                 
    }    
    //&#38651;&#35222;&#36092;&#29289;&#12289;12H&#36895;&#36948;
    _realLis=_realLia.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){        
        var _li=$(_realLia[i]).clone();
        if(_li.text().indexOf('12H&#36895;&#36948;')==-1 && _li.text().indexOf('&#38651;&#35222;&#36092;&#29289;')==-1) continue;
        _li.addClass('cateS').attr('style','').css({width:'194px'});
        $('a',_li).attr('style','').css({width:'164px'});
        $('.contentArea ul',_realHtml).append(_li);        
      };      
    }
    $('.contentArea ul li',_realHtml).eq(_realLia.length+_realLib.length).css({'border-bottom':'0px'});
    $('#bt_0_142_01').after(_realHtml);          
  }
  //deal subNav
  var _subNav=function(){
    var _realLis=_realLia.length;
    for(var i=0;i<_realLis;i++){
      var _liSubNav=$(_realLia[i]).clone();
      _liSubNav.attr('class','').css('width','auto');
      $('a',_liSubNav).attr('style','').css('width','auto');
      var _liSubNavLCode=get_form($('a',_liSubNav).attr('href'),'l_code');
      if (_l_code !='' && _l_code==_liSubNavLCode ){
        $('a',_liSubNav).addClass('selected');
      }
      $('#subnav ul').append(_liSubNav);
    };  
    _realLis=_realLib.length;
    for(var i=0;i<_realLis;i++){
      var _liSubNav=$(_realLib[i]).clone();
      _liSubNav.attr('class','').css('width','auto');
      $('a',_liSubNav).attr('style','').css('width','auto');
      var _liSubNavLCode=get_form($('a',_liSubNav).attr('href'),'l_code');
      if (_l_code !='' && _l_code==_liSubNavLCode ){
        $('a',_liSubNav).addClass('selected');
      }
      $('#subnav ul').append(_liSubNav);
    };

  }
  //category Main 99900000  
  var _bt_2_026=function(){
    //deal bt_2_026_01 lgrpcategory contentArea 2011/10/20
    var bt_2_026_01_html = $([                            
      '<div id="bt_0_142_01" class="">',
        '<div id="bt_category_title" class="title ie6png">',
        '  <h2 class="ie6png">',
        '    <a id="bt_category_e1" href=""></a>',
        '  </h2>',
        '</div>',       
        '<div class="curvy">',
          '<em class="ctl"><b>&bull;</b></em>',
          '<em class="ctr"><b>&bull;</b></em>',
          '<em class="cbr"><b>&bull;</b></em>',
          '<em class="cbl"><b>&bull;</b></em>',
          '<div id="tips">',
            '<div class="curvy">',
              '<em class="ctl"><b>&bull;</b></em>',
              '<em class="ctr"><b>&bull;</b></em>',
              '<em class="cbr"><b>&bull;</b></em>',
              '<em class="cbl"><b>&bull;</b></em>',
              '<div id="bt_category_Content">',
               '<ul>',                                             
               '</ul>',
               '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join(''));
    
    var _liPush = '<li id="liPush" class="cateM BTDME">&#39208;&#38263;&#25512;&#34214;</li>';      
    var _liTop30 = '<li id="top30" class="cateS BTDME">'+
                   '<a id="top30" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&TOP30=Y" style="">&#26412;&#39208;&#29105;&#37559;TOP30</a>' +
                   '</li>';
    var _liNew = '<li id="newOfWeek" class="cateS BTDME">'+
                   '<a id="newOfWeek" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&NEW=Y&flag=L" style="">&#26412;&#36913;&#26032;&#21697;</a>' +
                   '</li>';
    var _liSale = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&SALE=Y&flag=L" style="">&#26412;&#36913;&#26032;&#38477;&#20729;</a>' +
                   '</li>';
    var _liCPHot = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&CPHOT=Y&flag=L" style="">&#25240;&#20729;&#21048;&#29105;&#37559;</a>' +
                   '</li>';

    $('#bt_category_Content ul',bt_2_026_01_html).append(_liPush).append(_liTop30).append(_liNew).append(_liSale).append(_liCPHot);

    var _realLis = _realLia.length;       
    if(_realLis>0){
      var _lia = '<li id="lia" class="cateM BTDME">&#21697;&#38917;&#20998;&#39006;</li>';
      $('#bt_category_Content ul',bt_2_026_01_html).append(_lia);
      for(var i=0;i<_realLis;i++){     
        var _li=$(_realLia[i]).clone();          
        _li.addClass('cateS').attr('style','');
        $('a',_li).attr('style','').text($('span',_li).text());
        $('#bt_category_Content ul',bt_2_026_01_html).append(_li);
      }
    }
    
    _realLis = _realLib.length;
    if(_realLis>0){
      var _lib = '<li id="lib" class="cateM BTDME">&#21697;&#29260;&#20998;&#39006;</li>';
      $('#bt_category_Content ul',bt_2_026_01_html).append(_lib);
      for(var i=0;i<_realLis;i++){     
        var _li=$(_realLib[i]).clone();      
        _li.addClass('cateS').attr('style','');
        //$($('span',_li).text()).replaceAll('span',_li);
        $('a',_li).attr('style','').text($('span',_li).text());      
        $('#bt_category_Content ul',bt_2_026_01_html).append(_li);    
      }
    }
    
    _realLis = _realLic.length;
    if(_realLis>0){    
      var _lic = '<li id="lic" class="cateM BTDME">&#25512;&#34214;&#21697;&#29260;</li>';
      $('#bt_category_Content ul',bt_2_026_01_html).append(_lic);
      for(var i=0;i<_realLis;i++){     
        var _li=$(_realLic[i]).clone();
        _li.addClass('cateS').attr('style',''); 
        $('a',_li).attr('style','').text($('span',_li).text());     
        $('#bt_category_Content ul',bt_2_026_01_html).append(_li);
      }    
    }    
    //title
    $('#bt_category_e1',bt_2_026_01_html).attr('href','/category/LgrpCategory.jsp?l_code='+_l_code);
    $('#bt_category_e1',bt_2_026_01_html).text($('#C'+_FTOOTH+' a').text());
    $('.titleImg','#bt_2_026_01').hide();     
    $('.contentArea','#bt_2_026_01').hide();
    $('#bt_2_layout_b2').attr('class','');
    $('#bt_2_layout_b2').append(bt_2_026_01_html);    
  }
  
  var _bt_0_103 = function(){
    var _select = $('#p_lgrpCode');    
    var _cur_sel_l_code = _l_code;          
    var l_selected = _cur_sel_l_code.substring(2,5)=='999' ? " selected" : "";
    _select.empty();
    _select.append('<option value="">&#20840;&#21830;&#21697;&#20998;&#39006;</option>');
    _select.append('<option value="'+_l_code.substring(0,2)+'00000000" ' + l_selected + '>'+$('#C'+_FTOOTH+' a').text()+'&#32317;&#35261;</option>');
    _realLis = _realLia.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){
        var _select_text = $(_realLia[i]).clone().text();
        var _select_lcode = get_form($('a',_realLia[i]).attr('href'),'l_code');
        var _selected= _select_lcode == _cur_sel_l_code ? " selected" : "";        
        _select.append('<option value="'+_select_lcode+'"'+_selected+'>'+_select_text+'</option>');
      }
    }
    _realLis = _realLib.length;
    if(_realLis>0){
      for(var i=0;i<_realLis;i++){
        var _select_text = $(_realLib[i]).clone().text();
        var _select_lcode = get_form($('a',_realLib[i]).attr('href'),'l_code');
        var _selected= _select_lcode == _cur_sel_l_code ? " selected" : "";
        _select.append('<option value="'+_select_lcode+'"'+_selected+'>'+_select_text+'</option>');
      }
    }                    
  }  
  
  // deal tooth
  var _toothName=' &gt; '+$('#C'+_FTOOTH).html();
  $('.TabMenu ul li',container).removeClass('selected');
  if(_FTOOTH!='' && (document.location.href.indexOf('/goods/')>-1||document.location.href.indexOf('/category/')>-1)){
    var _tooth_code='ft'+_FTOOTH;
    // &#39208;&#39318;(&#20219;&#36984;), &#23567;&#20998;&#39006;&#38913;, &#32005;&#32160;&#37197;, &#21830;&#21697;&#38913;
    momoj('.bt_2_layout,.bt_4_layout,#Dgrp_BodyBigTableBase,#BodyBigTableBase,#container').addClass(_tooth_code);
    _lbt.addClass(_tooth_code);
    $('#C'+_FTOOTH).addClass('selected');
    
    // deal subnav menu
    container.append('<div id="subnav"><ul></ul></div>');
    _subNav();
    // deal subnav menu end    
    _realHtmlF();
    
    //var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');
    var _d_code="";
    if(_d_code_li.length >0){
      _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
    }else if( document.location.href.indexOf("DgrpCategory.jsp")>-1 ){
      _d_code=get_form(document.location.href,'d_code')
    }
    if(_d_code!=""){
      _leftCateBGO(_d_code);
    }
    
    _bt_0_103();
        
  }  
    
  // deal directory
  if (document.location.href.indexOf('/LgrpCategory.jsp')>-1){
    var _cur_l_code=get_form(document.location.href,'l_code');
    if (_cur_l_code.indexOf('99900000') > -1) {
      var _cateName=$('#C'+_FTOOTH+' a').html();
      $('#NavCategoryName').html(' &gt; '+_cateName);
      _bt_2_026();         
    }else{
      // deal TOOTH Name
      var _subMenuBtId=_settings.subMnId+_FTOOTH;
      var _cateName='';
      $('#'+_subMenuBtId+' a').each(function(){
        var _a=$(this);
        var _l_code=get_form(_a.attr('href'),'l_code');
        if(_cur_l_code == _l_code){
          _cateName=$('span', _a).text();
          $('#NavCategoryName').html(_toothName+ ' &gt; '+_cateName);
          return false;
        }
      });      
    }
  } 
  
  // deal hide cateogyr
  var _ulCate=$('#bt_cate_top');
  $('li[hide_yn=1]',_ulCate).remove();
  var _lis=$('li',_ulCate);
  for(var i=0;i<_lis.length;i++){
    var _li=$(_lis[i]);
    if(_li.hasClass('More') && i+1<_lis.length && $(_lis[i+1]).hasClass('cateM') ){
      _li.remove();
    } 
  }  
  // deal tooth END
  
  // deal subMenu
  $('.subMenu1109',_lbt)
    .hide()
    .data('Show',0)
    .css({top:'0px',left:'0px'})
    .each(function(){
      var _subMenu=$(this);
      var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
      var _subMenuWidth=1;
      // cal subMenu width
      var _lisLeft=$('.btleft > ul > li',_subMenu);
      var _liColsLeft=_calCols(_lisLeft.length,_settings.rowLenLeft);
      var _ulWidth=_settings.liWidth*_liColsLeft.cols-(_liColsLeft.cols-1)*2;
      var _ulHeight=_settings.rowLenLeft*_settings.liHeight;
      var _btleftWidth=_settings.ulWidth+(_settings.liWidth*(_liColsLeft.cols-1));
      $('.btleft',_subMenu).css({width:_btleftWidth+'px'});
      _subMenuWidth+=_btleftWidth;
      var _ulLeft=$('.btleft > ul',_subMenu);
      _ulLeft
        .css({width:_ulWidth+'px',height:_ulHeight})
        .empty()
      ;
      var _liCols=_liColsLeft.cols;
      for(var i=0;i<_settings.rowLenLeft;i++){
        var _liElm=$(_lisLeft[i]);
        _liElm.css({width:_settings.liWidth});
        var _aElm=$('a',_liElm);
        _aElm.css({width:_settings.liWidth-10});
        _ulLeft.append(_lisLeft[i]);
        for(var j=1;j<_liCols;j++){
          //$(_lisLeft[i+j*_settings.rowLenLeft]).css({width:_settings.liWidth-2});
          var _liElm=$(_lisLeft[i+j*_settings.rowLenLeft]);
          _liElm.css({width:_settings.liWidth-2});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidth-10});
          _ulLeft.append(_lisLeft[i+j*_settings.rowLenLeft]);
        }
        if(i+1==_liColsLeft.mod){
          _liCols--;
        }
      }

      // right area
      var _lisRight=$('.btright > ul > li',_subMenu);
      var _liColsRight=_calCols(_lisRight.length,_settings.rowLenRight);
      var _btRightWidth=_settings.ulWidthRight+(_settings.liWidthRight*(_liColsRight.cols-1));
      if(_lisRight.length==0){
        _settings.rowLenRightBom=_settings.rowLenRightBomN
        $('.btright',_subMenu).hide();
        $('.btrightbottom',_subMenu).css({height:_settings.divHeightRightBomN+'px'});
      } else {
        _settings.rowLenRightBom=_settings.rowLenRightBomD
        $('.btright',_subMenu).show().css({height:_settings.divHeightRight+'px'});
        $('.btrightbottom',_subMenu).css({height:_settings.divHeightRightBomD+'px'});
      }
      var _lisRightBom=$('.btrightbottom > ul > li',_subMenu);
      var _liColsRightBom=_calCols(_lisRightBom.length,_settings.rowLenRightBom);
      var _btRightWidthBom=_settings.ulWidthRightBom+(_settings.liWidthRightBom*(_liColsRightBom.cols-1));
      if(_btRightWidth>_btRightWidthBom){
        _btRightWidthBom=_btRightWidth;
      }else{
        _btRightWidth=_btRightWidthBom;
      } 
     
      _ulWidthRight=_settings.liWidthRight*_liColsRight.cols-(_liColsRight.cols-1)*2;
      _ulHeight=_settings.rowLenRight*_settings.liHeight;
      $('.btright',_subMenu).css({width:_btRightWidth+'px'});
      var _ulRight=$('.btright > ul',_subMenu);
      _ulRight
        .css({width:_ulWidthRight+'px',height:_ulHeight})
        .empty()
      ;
      _liCols=_liColsRight.cols;
      for(var i=0;i<_settings.rowLenRight;i++){
        var _liElm=$(_lisRight[i]);
        _liElm.css({width:_settings.liWidthRight});
        var _aElm=$('a',_liElm);
        _aElm.css({width:_settings.liWidthRight-14});
        _ulRight.append(_lisRight[i]);
        for(var j=1;j<_liCols;j++){
          var _liElm=$(_lisRight[i+j*_settings.rowLenRight]);
          _liElm.css({width:_settings.liWidthRight-2});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidthRight-16});
          _ulRight.append(_lisRight[i+j*_settings.rowLenRight]);
        }
        if(i+1==_liColsRight.mod){
          _liCols--;
        }
      }

      _ulWidthRight=_settings.liWidthRightBom*_liColsRightBom.cols-(_liColsRightBom.cols-1)*2;
      _ulHeight=_settings.rowLenRightBom*_settings.liHeight;
      $('.btrightbottom',_subMenu).css({width:_btRightWidthBom+'px'});
      var _ulRightBom=$('.btrightbottom > ul',_subMenu);
      _ulRightBom
        .css({width:_ulWidthRight+'px',height:_ulHeight})
        .empty()
      ;
      _liCols=_liColsRightBom.cols;
      for(var i=0;i<_settings.rowLenRightBom;i++){
        var _liElm=$(_lisRightBom[i]);
        _liElm.css({width:_settings.liWidthRightBom});
        var _aElm=$('a',_liElm);
        _aElm.css({width:_settings.liWidthRightBom-14});
        _ulRightBom.append(_lisRightBom[i]);
        for(var j=1;j<_liCols;j++){
          var _liElm=$(_lisRightBom[i+j*_settings.rowLenRightBom]);
          _liElm.css({width:_settings.liWidthRightBom-2});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidthRightBom-16});
          _ulRightBom.append(_lisRightBom[i+j*_settings.rowLenRightBom]);
        }
        if(i+1==_liColsRightBom.mod){
          _liCols--;
        }
      }
      _subMenuWidth+=_btRightWidth;
      _subMenu.css({width:_subMenuWidth+'px'});
    })
  ;
  $('#bt_0_059_01',_lbt).hide().data('Show',0);
  _lbt.on("mouseenter",function(){
    var _subMenu=$(this);
    var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
    if(_subMenu.attr('id')=='bt_0_059_01'){
      _menuID='21';
    }
    _subMenu.data('Show',1);
    _subMenu.show();
    $('#C'+_menuID).addClass('BGO');
    $('#C'+_menuID+' a').addClass('BGO');
  }).on("mouseleave",function(){
    var _subMenu=$(this);
    var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
    if(_subMenu.attr('id')=='bt_0_059_01'){
      _menuID='21';
    }
    _subMenu.data('Show',0);
    _subMenu.hide();
    $('#C'+_menuID).removeClass('BGO');
    $('#C'+_menuID+' a').removeClass('BGO');
  });
  container.on("mouseenter",'.TabMenu > ul > li',function(){
    $('.subMenu1109,#bt_0_059_01',_lbt).hide();
    var _li=momoj(this);
    _li.addClass('BGO');
    $('a',_li).addClass('BGO');
    // cale subMenu position
    var _x=0;
    var _y=0;
    var _POS=_li.position();
    _x=_POS.left;
    _y=_POS.top+_li.height()-2;
    var _subBtId=_settings.subMnId+_li.attr('id').replace('C','');
    if(_li.attr('id')=='C21'){
      _subBtId='bt_0_059_01';
    }
    var _subMenu=$('#'+_subBtId);
    //var _subContentWidth=$('.btleft',_subMenu).outerWidth()+$('.btright',_subMenu).outerWidth();
    //_subMenu.css({width:_subContentWidth+'px'});
    var _menuWidth=_subMenu.outerWidth();
    if(_menuWidth+_x > _settings.scrWidth){
      _x=_settings.scrWidth-_menuWidth;
    }      
    _subMenu
    .css({left:_x,top:_y})
    .show()
    //.data('Show',1)
    ;
  }).on("mouseleave",'.TabMenu > ul > li',function(){
    var _li=momoj(this);
    _li.removeClass('BGO');
    $('a',_li).removeClass('BGO');
    var _subBtId=_settings.subMnId+_li.attr('id').replace('C','');
    if(_li.attr('id')=='C21'){
      _subBtId='bt_0_059_01';
    }        
    var _subMenu=$('#'+_subBtId);
    _lbt.data('showMenu',_subBtId);
    
    setTimeout(function(_subMenu){
      var _subMenu=$('#'+_lbt.data('showMenu'));
      if (_subMenu.data('Show')==0){
        $('#'+_lbt.data('showMenu')).hide();
      }
    },200);
  }).on('mousemove','.TabMenu > ul > li',function(e){
      var _li=momoj(this);
      _li.addClass('BGO');
      var _subBtId=_settings.subMnId+_li.attr('id').replace('C','');
      var _subMenu=$('#'+_subBtId);
      if(_subMenu.css('left')=='0px'){
        var _x=0;
        var _y=0;
        var _POS=_li.position();
        _x=_POS.left;
        _y=_POS.top+_li.height()-2;
        var _menuWidth=_subMenu.outerWidth();
        if(_menuWidth+_x > _settings.scrWidth){
          _x=_settings.scrWidth-_menuWidth;
        }
        _subMenu.css({left:_x,top:_y});
      }
      _subMenu.show();
    })
  ;
  
  // deal subMenu END

  // deal bt_0_110_01 show bt_0_143 menu
  if(document.location.href.indexOf('/main/Main.jsp')>-1){
    $('#bt_0_110_01 .ContentD ul').each(function(){

      var _ul=$(this);
      $('.titlebox',_ul).attr('menuid',_ul.attr('menuid'))
      _ul.append('<li class="cateMore" menuid="'+_ul.attr('menuid')+'"><span style="color:#FD3598">...&#26356;&#22810;</span></li>');
    });
    $('#bt_0_110_01').on("mouseenter",'.ContentD .titlebox a,.cateMore span',function(){
      $('.subMenu1109',_lbt).hide();
      var _el=momoj(this);
      _el.addClass('BGO');
      // cale subMenu position
      var _x=0;
      var _y=0;
      var _POS=_el.position();
      //_x=_POS.left+$('span',_el).width()+2;
      _x=_POS.left+_el.width()+2;
      _y=_POS.top;
      var _subBtId=_settings.subMnId+_el.parent().attr('menuid').replace('C','');
      var _subMenu=$('#'+_subBtId);
      var _menuWidth=_subMenu.outerWidth();
      if(_menuWidth+_x > _settings.scrWidth){
        _x=_settings.scrWidth-_menuWidth;
      }
      _subMenu
        .css({left:_x,top:_y})
        .show()
        //.data('Show',1)
      ;
    }).on("mouseleave",'.ContentD .titlebox a,.cateMore span',function(){
      var _el=momoj(this);
      _el.removeClass('BGO');
      var _subBtId=_settings.subMnId+_el.parent().attr('MenuId').replace('C','');
      var _subMenu=$('#'+_subBtId);
      _lbt.data('showMenu',_subBtId);
      setTimeout(function(_subMenu){
        var _subMenu=$('#'+_lbt.data('showMenu'));
        if (_subMenu.data('Show')==0){
          $('#'+_lbt.data('showMenu')).hide();
        }
      },200);
    });
  }
  return container;
}

$.fn.ShopHistCart1108=function(settings){
  
  var _ssl_domain_url='';
  if(typeof _SSL_DOMAIN_URL=='string'){
    _ssl_domain_url=_SSL_DOMAIN_URL;
  } else {
    var _host=window.location.href.split('/')[2];
    _ssl_domain_url='//https://'+_host;
  }

  var _defaultSettings = {
    ghostCartUrl:"/ajax/ajaxTool.jsp",
    shopCartUrl:_ssl_domain_url+"/servlet/NewCampaignServlet?",
    prdUrl:'/goods/GoodsDetail.jsp?mdiv=ghostShopCart&i_code=',
    prdImgSrc:'',
    histMax:3
  };
  var _settings = $.extend(_defaultSettings, settings);
  
  var container=$('#ShoppingCar');
  if(document.location.href.indexOf("cmmedm.jsp")<0){//edm如果有帶天和地,則不顯示瀏覽紀錄
  if(container.length==0){// if not exists, create first
    var shopCar = [
    '<div id="ShoppingCar" class="bnav">',
      '<a class="crazyAdreplay" style="display:none;"><span><i>&diams;</i></span>&#37325;&#25773;</a>',
      '<div class="historyArea">',
        '<dl>',
          '<dd class="tips"><b>&#28687;&#35261;&#35352;&#37636;</b></dd>',
          '<dd class="tips"><a target="_blank"><img></a></dd>',
          '<dd><a target="_blank"><img></a></dd>',
          '<dd><a target="_blank"><img></a></dd>',
          //'<dt><a href="javascript:void(0);" onclick="momoj(document).scrollTop(1)">TOP</a></dt>',
        '</dl>',
      '</div>',
      '<div class="wishList" style="display:none;">',
      '<a href="//https://www.momoshop.com.tw/mypage/MemberCenter.jsp?func=02&cid=ghostcart&oid=wishlist"></a>',
      '</div>',
      '<div class="shoppingcart">',
        '<p>&#36092;&#29289;&#36554;</p>',
        '<ul>',          
        '</ul>',
        '<input class="cartChkOut" name="&#32080;&#24115;" type="button" value="&#32080;&#24115;">',
      '</div>',
      '<a class="gotopBtn" href="javascript:void(0);" onclick="momoj(document).scrollTop(0)">TOP</a>',
    '</div>',    
    '<div class="shoppingCartList">',
      '<table border="0" cellpadding="0" cellspacing="0">',                        
      '</table>',
    '</div>'
    ].join('');
    $('#BodyBase').append(shopCar);
    $('.LgrpCategory .contentArea .innerArea').append(shopCar);
    $('.LgrpCategory #Dgrp_BodyBigTableBase').append(shopCar);
    $('.LgrpCategory #BodyBigTableBase').append(shopCar);
    if($('.LgrpCategory .bt_2_layout').find('#ShoppingCar').length == 0){
      $('.LgrpCategory .bt_2_layout').append(shopCar);
    }
    momoj.get('/ajax/GetPage.jsp?url=/10/006/00/000/bt_A_020_01_shw.html',function(htmlData){
      if(momoj(htmlData).find('#bt_A_020_01_e8').html() == 'Y') {  
        momoj('#ShoppingCar .shoppingcart').after(htmlData);//load黏人精
      }
    });
    container=$('#ShoppingCar');
  }  
  }  
  $(".shoppingCartList").hide();
//&#36861;&#36452;&#28165;&#21934;START
  var _loginUser=momoj().cookie('loginUser');
  if (_loginUser==null || _loginUser=='null') _loginUser='';
  if(_loginUser !=''){
    var _WishListNumber=momoj().cookie('WishListNumber');
    if (_WishListNumber==null || _WishListNumber=='null') _WishListNumber='';
    if(_WishListNumber!=""){
      momoj(".wishList").show();
      var _a=momoj(".wishList a");
      _a.html("&#24050;&#36861;&#36452;<span>("+_WishListNumber+")</span>");
      
      var _b=momoj("#wishList a");
      _b.html("&#36861;&#36452;&#28165;&#21934;<span>("+_WishListNumber+")</span>");
    }
  }
  
  var switchToNewShopCart = '0'; //是否轉跳新購物車
  try {
    var switchRtn = true; //詢問是否轉跳新購物車
    if(switchRtn){
      switchToNewShopCart = '1';
    }
  } catch (error) {
    // 避免異常導致無法操作
  }
  
  //&#36861;&#36452;&#28165;&#21934;END
  // shoppingcart
  //var shopCart = $.ajaxTool({data:{flag:3032}});
  var eachCountRtn = $.getEachCartPICount();//取得新車各購物車內商品總數
  // shoppingcart
  if (eachCountRtn.apiSuccess){  
      if($('#TopCart').length >0){
        var _dftCartUrl='cart_name=none';
          if(switchToNewShopCart== '1'){
            $('#TopCart').data('CartUrl',shoppingCartApiDomain+"/view/cart/WEB/newNormal");
          } else {
            $('#TopCart').data('CartUrl',_settings.shopCartUrl+_dftCartUrl);
          }
      }
    
    if(eachCountRtn.rtn.resultCode == '1'){
      if(switchToNewShopCart == '1') { // 使用新購物車
        //新購物車幽靈購物袋 jeffchuang 20210925
        if($('#TopCart span').length > 0) {
          $('#TopCart span').remove();
        }
        if($('.shoppingcart ul li').length > 0) {
          $('.shoppingcart ul').empty();
        }

        try {
          //var eachCountRtn = $.getEachCartPICount(); //取得各購物車內商品總數
          if(eachCountRtn.rtn.resultCode == '1'){
            //var ghostCartIndex = 0;
            for(i=0;i<eachCountRtn.rtn.rtnData.rtnData.length;i++) {
              var cartName = eachCountRtn.rtn.rtnData.rtnData[i].cartName;
              var cnCartName = eachCountRtn.rtn.rtnData.rtnData[i].shoppingCartZhTwCartName; //中文車名
              var totalCount = eachCountRtn.rtn.rtnData.rtnData[i].totalCount;
              
              //right block
              var carUrl = 'javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+shoppingCartApiDomain+'/view/cart/WEB/'+cartName+'\'}})';
              var _li = '<li><a href="'+carUrl+'" class="cartChkOut_cartName">'+cnCartName+'('+totalCount+')<span></span></a></li>';     
              $('.shoppingcart ul',container).append(_li);
              //$('.shoppingcart ul li a',container).eq(ghostCareIndex).attr('href',carUrl);
              //ghostCareIndex++;
              
              //top block
              var trEle = [
              '<tr>',
                '<td class="cartname" valign="middle"><a href="'+carUrl+'">'+cnCartName+'</a></td>',
                '<td class="qrantitytxt">(<b>'+totalCount+'</b>)&nbsp;&#20214;</td>',
                '<td class="pricetxt"><b>'+''+'</b>&#20803;</td>',
              '</tr>'
              ].join('');
              
              $('.shoppingCartList table').append(trEle);
            }
            var totalCountRtn = $.getTotalPICount(); //顯示新購物車商品數量
            $("#TopCart").attr('title','');
            $("#TopCart").append('<span></span>');
            $('#TopCart span').text('( '+totalCountRtn.rtn.rtnData+' )'); 
            $('#TopCart').data('CartUrl',shoppingCartApiDomain+"/view/cart/WEB/newNormal");
          }
        } catch (error) {
          // 避免異常導致無法操作
        }
      }else{ //舊購物車幽靈購物袋
        return; // 直接走新車後應該不會進來，等下一版一併移除 jfchuang 20211227
        var _ghostCartLt = null;
        var _dftCartUrl='';
        var _allCnt = 0;
        if(_ghostCartLt.length>0){
          if($('#TopCart span').length > 0) {
            $('#TopCart span').remove();
          }
          if($('.shoppingcart ul li').length > 0) {
            $('.shoppingcart ul').empty();
          }
          var ghostCareIndex = 0;
          var result = $.ajaxTool({data:{flag:4012}});
          var shortCartName = result.rtnData.sNameMap;
          var longCartName = result.rtnData.nameMap;
          for(i=0;i<_ghostCartLt.length;i++) {
            var sCartChiName = shortCartName[_ghostCartLt[i].cartName];
            var lCartChiName = longCartName[_ghostCartLt[i].cartName];
            //專賣車名稱另外處理
            if(_ghostCartLt[i].cartName.indexOf("limitpay")>-1 ){
              var cartChiName = _ghostCartLt[i].cartChiName
              if (typeof cartChiName != 'undefined') {
                sCartChiName = cartChiName;
              }
            }
            if (typeof sCartChiName == 'undefined') {
              for(key in shortCartName){
                if(_ghostCartLt[i].cartName.indexOf(key)>-1){
                  sCartChiName = shortCartName[key];
                  break;
                }
              }
            }
            if (typeof lCartChiName == 'undefined') {
              for(key in longCartName){
                if(_ghostCartLt[i].cartName.indexOf(key)>-1){
                  lCartChiName = longCartName[key];
                  break;
                }
              }
            }
            if(!sCartChiName) {
              continue;
            }
            //right block
            var carUrl;
            carUrl = 'javascript:momoj().MomoLogin({GoCart:true,LoginSuccess:function(){location.href=\''+_settings.shopCartUrl+'cart_name='+_ghostCartLt[i].cartName+'\'}})';
            
            var prodTolCount = _ghostCartLt[i].prodTolCount;
            _allCnt += parseInt(prodTolCount);
            var prodTolPrice = _ghostCartLt[i].prodTolPrice;
            var _li = '<li><a href="" class="cartChkOut_cartName">'+sCartChiName+'('+prodTolCount+')<span></span></a></li>';     
            $('.shoppingcart ul',container).append(_li);
            $('.shoppingcart ul li a',container).eq(ghostCareIndex).attr('href',carUrl);
            ghostCareIndex++;
            
            //top block
            var trEle = [
            '<tr>',
              '<td class="cartname" valign="middle"><a href="'+carUrl+'">'+lCartChiName+'</a></td>',
              '<td class="qrantitytxt">(<b>'+prodTolCount+'</b>)&nbsp;&#20214;</td>',
              '<td class="pricetxt"><b>'+prodTolPrice+'</b>&#20803;</td>',
            '</tr>'
            ].join('');
            
            $('.shoppingCartList table').append(trEle);
            if(i==0){
             _dftCartUrl = 'cart_name='+_ghostCartLt[i].cartName;
            }
          }
          $("#TopCart").attr('title','');
          $("#TopCart").append('<span></span>');
          $('#TopCart span').text('( '+_allCnt+' )'); 
          $('.shoppingcart',container).show();
          if($('#TopCart').length >0){
            $('#TopCart').data('CartUrl',_settings.shopCartUrl+_dftCartUrl);
          }
        }
      }

    }



//      var trEleBot = [
//        '<tr>',
//        '<td class="btnArea" colspan="3" valign="middle"><input class="cartChkOutTop" value="&#32080;&#24115;" type="button"></td>',
//      '</tr>',
//      ].join('');
//      $('.shoppingCartList table').append(trEleBot);
      $('.cartChkOut, .cartChkOut_cartName',container).click(function(){
        momoj().MomoLogin({
          GoCart:true,
          LoginSuccess:function(){
            var switchRtn = true; //登入時詢問轉跳新購物車
            if(switchRtn){
              location.href=shoppingCartApiDomain+"/view/cart/WEB/newNormal";
            } else {
              location.href=_settings.shopCartUrl+_dftCartUrl;
            }
          }
        });
        fbEnvent('InitiateCheckout');
      });
      $('.cartChkOutTop').click(function(){
        momoj().MomoLogin({
        GoCart:true,
        LoginSuccess:function(){
          try {
            var switchRtn = true; //登入時詢問轉跳新購物車
            if(switchRtn){
              location.href=shoppingCartApiDomain+"/view/cart/WEB/newNormal";
            } else {
              location.href=_settings.shopCartUrl+_dftCartUrl;
            }
          } catch (error) {
            location.href=_settings.shopCartUrl+_dftCartUrl;
          }
         }
        });
        fbEnvent('InitiateCheckout');
      });
      $('#TopCart').click(function(){
        fbEnvent('InitiateCheckout');
      });
      
      $('a.cartChkOutTop').removeAttr('href');
      $('.shoppingcart ul li',container).show();
      $('.shoppingcart',container).show();
      momoj('#bt_0_150_01').on("mouseenter","#CartDD",function(){
        momoj(".cpmList").hide();
        momoj("#CPM").removeClass("selected");
        momoj("#TopCart").addClass("selected");
//        var sclTop = momoj("#TopCart").position().top+momoj("#TopCart").outerHeight()+momoj(document).scrollTop();
//        var sclLft = momoj("#TopCart").position().left-momoj(".shoppingCartList").outerWidth()+momoj("#TopCart").outerWidth()+500;
//        momoj(".shoppingCartList").css({top:sclTop,left:sclLft}).show();
      }).on("mouseleave","#CartDD",function(){
//        momoj(".shoppingCartList").hide();
        momoj("#TopCart").removeClass("selected");
        return;
      });
//      momoj('#BodyBase').on("mouseenter",".shoppingCartList",function(){
//        momoj(".shoppingCartList").show();
//        momoj("#TopCart").addClass("selected");
//        return;  
//      }).on("mouseleave",".shoppingCartList",function(){
//        momoj(".shoppingCartList").hide();
//        momoj("#TopCart").removeClass("selected");
//        return;
//      }).on("click",".shoppingCartList .btnArea button",function(){
//        momoj(".shoppingCartList").hide();
//        momoj("#TopCart").removeClass("selected");
//        return;
//      });
    }
  //historyArea
  if(document.location.href.indexOf("cmmedm.jsp")<0){//edm如果有帶天和地,則不顯示瀏覽紀錄
    let cookie_prdLstS = [];
    let _BrowHist=$().cookie("MobileGoodsHistory");
    try {
      cookie_prdLst = _BrowHist ? momoj.parseJSON(_BrowHist) : [];
    } catch (e) { console.log(e) }

    if (cookie_prdLst.length > 0) {
      let _hist = $('.historyArea dl dd', container);
      $(_hist[0]).show();
      let _histMax=(cookie_prdLst.length>_settings.histMax)? _settings.histMax: cookie_prdLst.length;
      //使用非同步呼叫api取得商品資訊
      fetchHistoryGoodsData(cookie_prdLst).then(rawResponse => {
        if (rawResponse.rtnCode == 200) {
          genHistoryGoodsData(rawResponse.rtnData, _hist, _histMax, _settings);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }
  //&#25240;&#20729;&#21048;
  var cpdiv = [
  '<div class="cpmList">',
  '<table border="0" cellpadding="0" cellspacing="0">',
  '</table>',
  '</div>'
  ].join('');
  momoj('#BodyBase').append(cpdiv);
  var cplink ="javascript:momoj().MomoLogin({LoginSuccess:function(){window.location.href='//https://www.momoshop.com.tw/mypage/MemberCenter.jsp?func=14&cid=memfu&oid=ticket&mdiv=1000100000-bt_0_100_01&ctype=B';}});";
  momoj('#BodyBase').on('mouseenter','.cpmList',function(e){
    momoj(".cpmList").show();
    momoj("#CPM").addClass("selected");
  })
  .on('mouseleave','.cpmList',function(e){
    momoj(".cpmList").hide();
    momoj("#CPM").removeClass("selected");
  })
  .on('click','.cpmList .btnArea button',function(){
    momoj(".cpmList").hide();
    momoj("#CPM").removeClass("selected");
    location.href=cplink;
  });

  momoj('#bt_0_150_01').on('mouseenter','#cardUser',function(e){
    momoj("#cardUser").addClass("selected");
    var sclTop = momoj("#cardUser").position().top+momoj("#cardUser").outerHeight()+document.documentElement.scrollTop;
    var sclLft = momoj("#cardUser").position().left-momoj(".cardPointList").outerWidth()+momoj("#cardUser").outerWidth()+450;
    momoj(".cardPointList").css({top:sclTop,left:sclLft}).show();
  })
  .on('mouseleave','.cpmList',function(e){
    momoj(".cardPointList").hide();
    momoj("#cardUser").removeClass("selected");
  })
  //&#38750;&#26371;&#21729;&#38651;&#23376;&#22577;
  var newsletter = [
     '<div class="epaperList">',
       '<table border="0" cellpadding="0" cellspacing="0">',
         '<tr>',
        '<td valign="middle"><input id="epaper_mail" name="epaper_mail" type="text" class="epaper_mail" value="&#35531;&#36664;&#20837;E-mail" size="30" maxlength="40"></td>',          
        '<td><label><input name="gender" type="radio" value="1">&nbsp;&#20808;&#29983;</label></td>', 
        '<td><label><input name="gender" type="radio" value="0">&nbsp;&#23567;&#22992;</label></td>', 
         '</tr>', 
         '<tr>', 
             '<td colspan="3" valign="middle" class="btnArea"><button>&#30906;&#35469;&#36865;&#20986;</button></td>', 
         '</tr>', 
       '</table>', 
     '</div>'
     ].join('');
  $('#BodyBase').append(newsletter);
  
  momoj('#bt_0_150_01').on("mouseenter",'#E_PAPERDD',function(){
    momoj(".shoppingCartList").hide();
    momoj(".cpmList").hide();
    momoj("#CPM").removeClass("selected");
    momoj("#TopCart").removeClass("selected");
    momoj("#E_PAPER").addClass("selected");
    var sclTop = momoj("#E_PAPER").position().top+momoj("#E_PAPER").outerHeight()+document.documentElement.scrollTop;
    var sclLft = momoj("#E_PAPER").position().left-momoj(".epaperList").outerWidth()+momoj("#E_PAPER").outerWidth()+100;
    //momoj(".epaperList").css({top:sclTop,left:sclLft}).slideDown("slow");
    momoj(".epaperList").css({top:sclTop,left:sclLft}).show();
  }).on("mouseleave",'#E_PAPERDD',function(){
    momoj(".epaperList").hide();
    momoj("#E_PAPER").removeClass("selected");
  });
    
  momoj(".epaperList .epaper_mail").click(function(){
    if (momoj(".epaperList .epaper_mail").val() == "&#35531;&#36664;&#20837;E-mail") {
      momoj(".epaperList .epaper_mail").val("").addClass("txtinput");
    } 
    return;
  });
  momoj('#BodyBase').on("mouseenter",'.epaperList',function(){
    momoj(".epaperList").show();
    momoj("#E_PAPER").addClass("selected");
  }).on("mouseleave",'.epaperList',function(){
    momoj(".epaperList").hide();
    momoj("#E_PAPER").removeClass("selected");
  }).on('click','.epaperList .btnArea button',function(){
    momoj(".epaperList").hide();
    momoj("#E_PAPER").removeClass("selected");
    var email = momoj("#epaper_mail").val();
    var gender = momoj('input[name=gender]:checked').val();
    if($.trim(gender) == '' || $.trim(gender) == ''){
      alert(momoj.unicode2Str('&#35531;&#36664;&#20837; MAIL &#33287;&#24615;&#21029;&#12290;'));
      return;
    }
    
    momoj.ajax({
      url : "/servlet/NonMemberENewsLetter",
      type : "POST",
      data: {'flag':'sub_epaper','email':email,'gender':gender },
      success : function(objData){
        if(objData == '001'){
          alert('email'+momoj.unicode2Str('&#26684;&#24335;&#37679;&#35492;'));
        }else if(objData == '002'){
          alert(momoj.unicode2Str('&#35330;&#38321;&#35469;&#35657;&#20449;&#24050;&#23492;&#20986;&#65292;&#35531;&#33267;&#24744; Email &#25910;&#20449;&#21283;&#30906;&#35469;&#65292;&#25165;&#31639;&#35330;&#38321;&#25104;&#21151;~'));
        }else if(objData == '003'){
          alert(momoj.unicode2Str('&#24744;&#24050;&#26159;&#26371;&#21729;&#65292;&#35531;&#33267;&#23458;&#26381;&#20013;&#24515;&#30906;&#35469;&#25910;&#38651;&#23376;&#22577;&#30340;e-mail&#21363;&#21487;&#12290;'));
          var eplink ="javascript:momoj().MomoLogin({LoginSuccess:function(){window.location.href='//https://www.momoshop.com.tw/mypage/MemberCenter.jsp?func=12&cid=memfu&oid=ticket&mdiv=1000100000-bt_0_100_01&ctype=B';}});";
          location.href=eplink;
        }else if(objData == '004'){
          alert(momoj.unicode2Str('&#35330;&#38321;&#35469;&#35657;&#20449;&#23492;&#36865;&#22833;&#25943;&#65292;&#35531;&#20877;&#35430;&#19968;&#27425;&#12290;'));
        }else if(objData == '005'){
          alert(momoj.unicode2Str('&#35330;&#36092;&#22833;&#25943;&#65292;&#35531;&#20877;&#35430;&#19968;&#27425;&#12290;'));
        }else if(objData == '006'){
          alert(momoj.unicode2Str('&#24050;&#35330;&#38321;&#36942;&#25695;&#65292;&#35531;&#21247;&#37325;&#35079;&#35330;&#38321;&#12290;'));
        }else{
          alert(momoj.unicode2Str('&#35330;&#36092;&#22833;&#25943;&#65292;&#35531;&#20877;&#35430;&#19968;&#27425;&#12290;'));
        }
      }
    });
  });
}//end $.fn.ShopHistCart1108

// for lazy load img modify from /* http://www.appelsiini.net/projects/lazyload */
$.fn.lazyload = function(options) {
  var settings = {
    threshold    : 600,
    failurelimit : 0,
    event        : "scroll",
    effect       : "show",
    container    : window
  };
          
  if(options) {
    $.extend(settings, options);
  }
  var elements = this;
  if ("scroll" == settings.event) {
    $(settings.container).bind("scroll", function(event) {
      var counter = 0;
      elements.each(function() {
        if (!this.loaded && !$.belowthefold(this, settings) &&
          !$.rightoffold(this, settings) && !$(this).is(":hidden") ) {
            $(this).trigger("appear");
        }
      });
      var temp = $.grep(elements, function(element) {
        return !element.loaded;
      });
      elements = $(temp);
    });
  }
  this.each(function() {
    var self = this;
    $(self).one("appear", function() {
      if (!this.loaded) {
        $(this).attr("src", $.getImgSrc({org:$(self).attr("org")}));
        self.loaded = true;
      };
      $(this).removeAttr("lazy");
    });
    if($(self).is(":hidden")){
      $(self).one("mousemove",function(){
        $(this).trigger("appear");
      });
    }
    if ("scroll" != settings.event) {
      $(self).bind(settings.event, function(event) {
        if (!self.loaded) {
          $(self).trigger("appear");
        }
      });
    }
  });
  $(settings.container).trigger(settings.event);
  return this;
};

$.belowthefold = function(element, settings) {
  if (settings.container === undefined || settings.container === window) {
    var fold = $(window).height() + $(window).scrollTop();
  } else {
    var fold = $(settings.container).offset().top + $(settings.container).height();
  }
  return fold <= $(element).offset().top - settings.threshold;
};
$.rightoffold = function(element, settings) {
  if (settings.container === undefined || settings.container === window) {
    var fold = $(document).width() + $(window).scrollLeft();
  } else {
    var fold = $(settings.container).offset().left + $(settings.container).width();
  }
  return fold <= $(element).offset().left - settings.threshold;
};
// lazy load img END

$.extend({
  ajaxTool:function(settings){ // for /ajax/ajaxTool.jsp
    
    var _defaultSettings = {
      URL:"/ajax/ajaxTool.jsp",
      data:"",
      async:false,
      timeout:0,
      dataType:'json',
      ajaxSuccess:'',
      ajaxCancel:'',
      ajaxTimeout:'',//timeout only work in async:true
      rData:{rtnCode:600,rtnMsg:"server error",rtnData:{}}
    };
    
    var _settings = momoj.extend(_defaultSettings, settings);
    if(typeof _settings.data!="object") return _settings.rData;
    
    var _flag = _settings.data.flag;
    delete _settings.data.flag;
    var _dataObj={
      flag:_flag,
      data:_settings.data
    };
    var _url = _settings.URL;
    if(_url=='/ajax/ajaxTool.jsp'){
      _url = _url + '?n=' + _flag + '&t=' + new Date().getTime();
    }
    var _data=JSON.stringify(_dataObj);
    momoj.ajax({
      url:_url,
      type:'POST',
      data:{data:_data},
      dataType:_settings.dataType,
      async:_settings.async,
      timeout:_settings.timeout,
      success:function(content){
        momoj.extend(_settings.rData, content || {});
        if(_settings.rData.rtnData==null || _settings.rtnData=='null') _settings.rData.rtnData={};
        if (momoj.isFunction(_settings.ajaxSuccess)) {
        _settings.ajaxSuccess(_settings.rData);
        }
      },
      error:function(err, errorType){
        _settings.rData.rtnCode=601;
        if (momoj.isFunction(_settings.ajaxCancel)) {
          _settings.ajaxCancel(_settings.rData);
        }
        if(errorType == 'timeout'){
          if (momoj.isFunction(_settings.ajaxTimeout)) {
            _settings.ajaxTimeout(_settings.rData);
          }
        }
      }
    });
    return _settings.rData;
  },
  runMethod:function(settings){
    var _defaultSettings = {
      run:"",
      js:"",
      pa:{}
    };
    var _settings = $.extend(_defaultSettings, settings);
    if (_settings.run=="") return;
    if (_settings.js=="") return;
    var _function="$."+_settings.run;
    var _pa=JSON.stringify(_settings.pa);
    if (eval ("typeof "+_function+"==\"function\"") ){
      return eval(_function+".call(this,"+_pa+")");
    } else {
      $.ajax({
        url:_settings.js,
        dataType:'script',
        async:false,
        success:function(){
          return eval(_function+".call(this,"+_pa+")");
        }
      });
      /*
      $.getScript(_settings.js,function(){
        return eval(_function+".call(this,"+_pa+")");
      });
      */
    }
  },
  str2Unicode:function(str){
    if(typeof str!='string') return '';
    
    var rtnStr="";
    for(var i=0;i<str.length;i++){
      var _charCode=str.charCodeAt(i);
      if (_charCode<126){
        _charCode=str.substr(i,1);
      }else{
        _charCode='&#'+_charCode+';';
      }
      rtnStr+=_charCode;
    }
    return rtnStr;
  },
  unicode2Str:function(_unicode){
    var _rtnstr='';
    try{
      var _aUni=_unicode.split(';');
      for(var i=0;i<_aUni.length;i++){
        var _str=_aUni[i];
        var _pos=_str.indexOf('&#');
        if(_pos==0){
          _str=_str.replace('&#','');
          _str=String.fromCharCode(_str);
        }else if(_pos>0){
          _str=_str.substring(0,_pos)+String.fromCharCode(_str.substr(_pos+2));
        }
        _rtnstr+=_str;
      }
    }catch(err){
      _rtnstr= _unicode;
    }
    return _rtnstr;
  },
  bt_0_127:function(){
    var _bt=momoj('#bt_0_127_01')
    var _time=momoj('#bt_0_127_01_e4',_bt).text()
    if(_time.match(/^\d{4}$/)){
      var _d=new Date();
      var _h=_d.getHours();
      var _m=_d.getMinutes();
      var _expH=parseInt(_time.substring(0,2));
      var _expM=parseInt(_time.substring(2,4));
      var _now=_h*60+_m;
      var _exp=_expH*60+_expM;
      if(_exp > _now){
        var _lastTime=_exp-_now;
        var _lastH=parseInt(_lastTime/60);
        var _lastM=_lastTime % 60;
        if (_lastH < 10){
          _lastH='0'+_lastH;
        }else{
          _lastH=_lastH.toString();
        }
        if (_lastM < 10){
           _lastM='0'+_lastM;
        }else{
          _lastM=_lastM.toString();
        }
        momoj('.t1',_bt).text(_lastH.substring(0,1));
        momoj('.t2',_bt).text(_lastH.substring(1,2));
        momoj('.t3',_bt).text(_lastM.substring(0,1));
        momoj('.t4',_bt).text(_lastM.substring(1,2));
      }
    }  
  
  },
  bt_0_116:function(){
    var _d=new Date();
    var _m=_d.getMonth()+1;
    if ( _m<10) _m='0'+_m;
    var _d=_d.getDate();
    if ( _d<10) _d='0'+_d;
    var _today=_m+'/'+_d;
    momoj('#bt_0_116_01_Today').text(_today);
  },
  bt_0_180:function(){
    var _bt=momoj('#bt_0_180_01');
    var _time=momoj('#bt_0_180_01_e3',_bt).text();
    if(_time.match(/^\d{4}$/)){
      momoj('.t1',_bt).text(_time.substring(0,1));
      momoj('.t2',_bt).text(_time.substring(1,2));
      momoj('.t3',_bt).text(_time.substring(2,3));
      momoj('.t4',_bt).text(_time.substring(3,4));
    }  
  },
  bt_0_165:function(){
    var _Randd=Math.round(Math.random()*momoj('#bt_0_165_01 dt').length);
    momoj('#bt_0_165_01 dt').eq(_Randd-1).addClass('selected'); 
    momoj('#bt_0_165_01 dd').eq(_Randd-1).show(); 
    momoj('#bt_0_165_01').delegate('dt','mouseover',function(){ 
    momoj('#bt_0_165_01 dt').removeClass('selected'); 
    momoj('#bt_0_165_01 dd').hide(); 
    momoj(this).addClass('selected').next('dd').show(); 
    });
  },
  bt_0_167:function(){
    var _Randd=Math.round(Math.random()*momoj('#bt_0_167_01 dt').length);
    momoj('#bt_0_167_01 dt').eq(_Randd-1).addClass('selected'); 
    momoj('#bt_0_167_01 dd').eq(_Randd-1).show(); 
    momoj('#bt_0_167_01').delegate('dt','mouseover',function(){ 
    momoj('#bt_0_167_01 dt').removeClass('selected'); 
    momoj('#bt_0_167_01 dd').hide(); 
    momoj(this).addClass('selected').next('dd').show(); 
    });
  },
  addToMyFavorite:function(settings){
    var _defaultSettings = {
      url:location.href,
      title:document.title
    };
    var _settings = $.extend(_defaultSettings, settings);  
    if(window.sidebar){
      window.sidebar.addPanel(_settings.title,_settings.url,'');
    }else if(window.external){
      window.external.AddFavorite(_settings.url,_settings.title);
    }else{
      alert(momoj.unicode2Str('&#35531;&#20351;&#29992;&#26360;&#31844;&#21151;&#33021;&#21152;&#21040;&#25105;&#30340;&#26368;&#24859;&#65281;'));
    }
  },
  getImgSrc:function(settings){
    var _defaultSettings={
      org:""
    } 
    var _settings=$.extend(_defaultSettings,settings);
    var _rtnImgS="";    
    if(_settings.org=="") return _rtnImgS;    
    if(_settings.org.indexOf("momoshop.com.tw")>-1){
      return _settings.org;
    }
    if(_settings.org.match(/^\//)){
      ImgN++;
      _imgN=ImgN % ImgS;
      _imgN++;
      if(_imgN > 4){
        _imgN = 1;
      }
      if(document.location.href.match(/www.momoshop.com.tw/i)){
        _rtnImgS="//imgN.momoshop.com.tw";
      }else if(document.location.href.match(/momotest.momoshop.com.tw/i)||document.location.href.match(/ecmdev.momoshop.com.tw/i)
          || /momouat[1]?[0-9]{1}\./.test(document.location.href) || document.location.href.indexOf("ecmuati.momoshop.com.tw") > -1
          || /ecmuat[1]?[0-9]{1}\./.test(document.location.href) || /ecmqc[1]?[0-9]{1}\./.test(document.location.href)
      ){if (document.location.href.match(/https/i)){
          if(_settings.org.indexOf("/ecm/img")>-1){
            _rtnImgS="";
          }else{    
            _rtnImgS="//imgN.momoshop.com.tw";
          }
        }else{         
          if(_settings.org.indexOf("/ecm/img")>-1){ 
            _rtnImgS="";        
          }else{  
            _rtnImgS="//imgN.momoshop.com.tw";
          }
        }
      }else{    
        if(document.location.href.match(/10\./i)){ 
           _rtnImgS="";
        }else{               
          _rtnImgS="//imgN.momoshop.com.tw"; //momotravel
        }
      }
      _rtnImgS=_rtnImgS.replace("N",_imgN)+ _settings.org;
    }
    return _rtnImgS;
  },
  getImgSrcForCart:function(settings){
    var _defaultSettings={
      org:""
    } 
    var _settings=$.extend(_defaultSettings,settings);
    var _rtnImgS="";    
    if(_settings.org=="") return _rtnImgS;    
    if(_settings.org.match(/^\//)){
      ImgN++;
      _imgN=(ImgN % ImgS) + 1;
      if(_imgN > 4){
        _imgN = 1;
      }
      _rtnImgS="//imgN.momoshop.com.tw";
      _rtnImgS=_rtnImgS.replace("N",_imgN)+ _settings.org;
    }
    return _rtnImgS;
  },
  injectScript:function(url,callback){
    if( document.querySelector('script[src="'+url+'"]')){
      if ( typeof(callback)=='function'){
        callback();
      }  
    }else{
      var script = document.createElement("script");
      script.src = url;
      
      // Handle Script loading
      {
        var done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function(e){
          if ( !done && (!this.readyState || /loaded|complete/.test(this.readyState)) ) {
            done = true;
            if ( typeof(callback)=='function'){
              callback();
            }

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
          }
        };
      }

      document.getElementsByTagName("head")[0].appendChild(script);
    }
    // We handle everything using the script element injection
    return undefined;
  },
  getRandom:function(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  },
  getJsCssPath:function(settings){
    var _defaultSettings={org:""};
    var _settings=$.extend(_defaultSettings,settings);
    var _rtnImgS="";    
    if(_settings.org=="") return _rtnImgS;
    if(_settings.org.indexOf("momoshop.com.tw")>-1){
      return _settings.org;
    }
    if(_settings.org.match(/^\//)){
      var isOnline = /(www|m|ecm|cart)\.momoshop\.com\.tw/.test(window.location.host);
      if(!isOnline){
        _rtnImgS=_settings.org;
      }else{
        _rtnImgS="//img"+momoj.getRandom(1,4)+".momoshop.com.tw"+ _settings.org;
      }
    }
    return _rtnImgS;
  },
  initAstar:function(){
    var isASJ=momoj().cookie('isASJ');
    if(isASJ && isASJ=="1"){
      momoj('<link id="astarCss">').attr({
        rel :"stylesheet",
        type:"text/css",
        href:momoj.getJsCssPath({org:'/ecm/css/AstarIME.css?t=20201119001'})
      }).appendTo("head");
      momoj.ajax({
        url: momoj.getJsCssPath({org:'/ecm/js/AstarAPI.js?t=20201119001'}),
        dataType: "script",
        cache:true,
        success: function(){}
      });
      momoj.ajax({
        url: momoj.getJsCssPath({org:'/ecm/js/AstarWebUI.js?t=20210621001'}),
        dataType: "script",
        cache:true,
        success: function(){
          if(typeof EmbedAstar == "function"){
            EmbedAstar("",false);
          }
        }
      });
    }
  },
  triggerAstar:function(){
    if(typeof EmbedAstar == "function"){
      EmbedAstar("",false);
    }
  },
  cachedScript : function( url, options ) {
    options = momoj.extend( options || {}, {
      dataType: "script",
      cache: true,
      url: url
    });
    return momoj.ajax( options );
  },
  callAwsApi:function(settings) {
    var _settings = momoj.extend({
      async : false,
      url : '',
      json : {},
      rtn : {},
      apiSuccess : false,
      apiError : false,
      headers : {},
      withCookies : true
    }, settings);
    var _rtn = {};
    momoj.ajax({
      url : _settings.url,
      type : 'POST',
      data : _settings.json,
      dataType : 'json',
      contentType : 'application/json;charset=utf-8',  // POST時必須:若送出為jsonObject要加這個
      async : _settings.async,
      cache : false,
      headers : _settings.headers,
      xhrFields : {withCredentials:_settings.withCookies},  // ajax會自動帶上同源的cookie，不會帶上不同源的cooike，可以透過設定讓ajax帶上不同源的cookie
      crossDomain : true,
      success : function(rtn) {
        _rtn = momoj.extend({}, rtn);
        _settings.rtn = _rtn;
        if (typeof _rtn.resultCode != 'undefined' && _rtn.resultCode == '200') {
          _settings.apiSuccess = true;
        }
      },
      error : function() {
        _settings.apiError = true;
      }
    });
    delete _settings.json;
    return _settings;
  }
});
$.fn.whoBuyLoad = function(options) {
  var settings = {
      threshold    : 0,
      failurelimit : 0,
      event        : "scroll",
      effect       : "show",
      container    : window
    };
            
    if(options) {
      $.extend(settings, options);
    }
    var elements = this;
    if ("scroll" == settings.event) {
      $(settings.container).bind("scroll", function(event) {
        var counter = 0;
        elements.each(function() {
          if (!this.loaded && !$.belowthefold(this, settings) &&
            !$.rightoffold(this, settings) && !$(this).is(":hidden") ) {          
            $(this).trigger("appear");
          }
        });
        var temp = $.grep(elements, function(element) {
          return !element.loaded;
        });
        elements = $(temp);
      });
    }        
    this.each(function() {
      var self = this;
      $(self).one("appear", function() {
        if (!this.loaded) {
          momoj.getScript("//img1.momoshop.com.tw/ecm/js/whoBuy.js?t=1490161571203");
          self.loaded = true;
        };        
      });
      if($(self).is(":hidden")){
        $(self).one("mousemove",function(){
          $(this).trigger("appear");
        });
      }
      if ("scroll" != settings.event) {
        $(self).bind(settings.event, function(event) {
          if (!self.loaded) {
            $(self).trigger("appear");
          }
        });
      }
    });
}

$.fn.ReListMenu = function(settings){
  var container=$(this);
  // if container is array, scan it
  if ( container.length >1 ) {
    container.each(function(){
      $(this).ReListMenu(settings);
    });
    return false;
  }
  var _defaultSettings = {        
    rowLen:10,
    ulWidth:140,
    liWidth:130,
    liHeight:15
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  var _calCols=function(len,lim){
    var _cols=Math.floor(len/lim);
    var _mod=len%lim;
    if(_mod>0){
      _cols++;
    }else{
      _mod=lim;
    }
    var _rtn={
      cols:_cols,
      mod:_mod
    };
    
    return _rtn;
  }  
  var _chgMenu=function(opt){
    var _idx=opt.idx || 0;
    if(container.data('ReListMenuContent').length>_idx){
      var _CD=container.data('ReListMenuContent').eq(_idx);
      var _CDwidth=_CD.width();
      _CD.parent().css({width:_CDwidth+'px'});
      if ( !_CD.data('ReListMenuInit')) {
        _CD.data('ReListMenuInit',true);
        var _lis=_CD.find('ul li');
        var _liLen=_lis.length;
        var _cols=_calCols(_liLen,_settings.rowLen);
        var _ulWidth=_settings.liWidth*_cols.cols-(_cols.cols-1)*2;
        var _ulHeight=_settings.rowLen*_settings.liHeight;
        var _ul=_CD.find('ul');
        _ul
          .css({width:_ulWidth+'px',height:_ulHeight})
          .empty()
        ;
        _CD.css({width:_ulWidth+'px'});
        _CD.parent().css({width:_ulWidth+'px'});
        var _liCols=_cols.cols;
        for(var i=0;i<_settings.rowLen;i++){
          var _liElm=$(_lis[i]);
          _liElm.css({width:_settings.liWidth});
          var _aElm=$('a',_liElm);
          _aElm.css({width:_settings.liWidth-10});
          _ul.append(_lis[i]);
          for(var j=1;j<_liCols;j++){
            var _liElm=$(_lis[i+j*_settings.rowLen]);
            _liElm.css({width:_settings.liWidth-2});
            var _aElm=$('a',_liElm);
            _aElm.css({width:_settings.liWidth-10});
            _ul.append(_lis[i+j*_settings.rowLen]);
          }
          if(i+1==_cols.mod){
            _liCols--;
          }
        }
      }
    }
    
  }
  

  var _reListMenu=function(){
    if ( !container.data('ReListMenuInit')) {
      container.data('ReListMenuInit',true);
      container.data('ReListMenuContent',container.find('.TabContent .TabContentD'));
      container
        .delegate('.TabMenu ul li','mouseover',function(e){
          if($(this).attr('idx')){
            _chgMenu({idx:$(this).attr('idx')});
          }
        })
       ;
    }
  }
  
  return this.each(_reListMenu);
}

$.fn.pageReload = function(settings){
  var _container=$(this);
  var _href = document.location.href;
  var _defaultSettings = {        
    url:""
  }; 
  var _settings = $.extend(_defaultSettings, settings);
  var _timeStamp = (new Date()).valueOf();
  if((_href.indexOf("d_code") > 0 || _href.indexOf("i_code") > 0) && _settings.url.length > 1){
    _container.load("/ajax/GetPage.jsp?url=" + _settings.url + "&t=" + _timeStamp);
  }
}
$.fn.getDomainType = function(){
  var hostname = location.hostname;//例如: m.momoshop.com.tw, muatXX.momoshop.com.tw ....  
  var hostMobileNameRe = /(m|muat\d{1,2}|muati|mstg|mdev)\.momoshop\.com\.tw/;
  var hostWebNameRe = /(www|momo|momouat\d{1,2}|momouati|momostage|momodev)\.momoshop\.com\.tw/;
  if(hostname.search(hostMobileNameRe) > -1) {//小網    
    return "mWeb";
  } else if(hostname.search(hostWebNameRe) > -1) {//大網
    return "bWeb";
  } else {
    return "";
  }
}

$.fn.showXiaoi = function(domainType){
  var pathname = location.pathname;
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf("momoshop") >= 0){
        return false;
    }   
  if(domainType == "mWeb") {//小網
    if(pathname.indexOf("/main.momo") > -1 || pathname.indexOf("/mymomo/") > -1 
        || location.href.indexOf("/cateGoods.momo?cn=12") > -1 || location.href.indexOf("/category.momo?cn=12") > -1
        || pathname.indexOf("/menu.momo") > -1
        ) {     
      return true;      
    }
  } else if(domainType == "bWeb") {
    if(pathname.indexOf("/main/Main.jsp") > -1 || pathname.indexOf("/mypage/MemberCenter.jsp") > -1 || location.href.indexOf("/LgrpCategory.jsp?l_code=12") > -1 || location.href.indexOf("/DgrpCategory.jsp?d_code=12") > -1 || location.href.indexOf("/MgrpCategory.jsp?m_code=12") > -1) {
      return true;
    }
  }
  return false;
}

$.fn.importXiaoiJs = function(){
  var _xiaoiJS = document.createElement('script'); _xiaoiJS.type = 'text/javascript'; _xiaoiJS.async = true;
  _xiaoiJS.src = '//img1.momoshop.com.tw/ecm/js/xiaoi.js?t=201705090001';
  var _xiaoiJS_s = document.getElementsByTagName('script')[0]; _xiaoiJS_s.parentNode.insertBefore(_xiaoiJS, _xiaoiJS_s);
}

$.fn.importXiaoiWebChatJs = function(domainType, token){
  var jsDomain = "//img1.momoshop.com.tw";
  if(!/(www|m)\.momoshop\.com\.tw/.test(location.hostname)) {
    jsDomain = "";
  }
    
  if(domainType == "mWeb") {//小網
    var _webChatJS = document.createElement('script'); _webChatJS.type = 'text/javascript'; _webChatJS.async = true;
    _webChatJS.src = jsDomain + "/ecm/js/WebChatEntryRWD_Mobile.js?tempToken=" + token + "&t=20230629001";
    var _webChatJS_s = document.getElementsByTagName('script')[0]; _webChatJS_s.parentNode.insertBefore(_webChatJS, _webChatJS_s);
    
  } else if(domainType == "bWeb") {//大網
    var _webChatJS = document.createElement('script'); _webChatJS.type = 'text/javascript'; _webChatJS.async = true;
    _webChatJS.src = jsDomain + "/ecm/js/WebChatEntryRWD.js?tempToken=" + token + "&t=20230629001";
    var _webChatJS_s = document.getElementsByTagName('script')[0]; _webChatJS_s.parentNode.insertBefore(_webChatJS, _webChatJS_s);
  }  
}

$.fn.removeXiaoiWebChatJs = function(domainType){
  momoj().removejscssfile("xiaoi.js", "js");
  
  if(domainType == "mWeb") {//小網    
    momoj().removejscssfile("WebChatEntryRWD_Mobile.js", "js");
    
  } else if(domainType == "bWeb") {//大網
    momoj().removejscssfile("WebChatEntryRWD.js", "js");
  }  
}

$.fn.removejscssfile = function(filename, filetype){
  var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none";
  var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
  var allsuspects=document.getElementsByTagName(targetelement);
  for (var i=allsuspects.length; i>=0; i--){
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1) {
          allsuspects[i].parentNode.removeChild(allsuspects[i]);
    }
  }
}
$.fn.bgImg = function(settings){
  var _container=momoj(this);
  var _isHeaderShow=_container.find('#'+_container.attr('id')+'_e1').text();
  var _isMainShow=_container.find('#'+_container.attr('id')+'_e4').text();
  if(_isHeaderShow == "1"){
    var _headerBgImg=_container.find('#'+_container.attr('id')+'_e2').text();
    var _headerArea=momoj('.headerArea').eq(0); 
    if(_headerBgImg.indexOf("/ecm/img")>-1){
      _headerArea.css('min-width','1220px');
      _headerArea.css('background','url('+ _headerBgImg +') no-repeat center 40px');
    }
  }
  if(_isMainShow == "1" && location.pathname.indexOf("/main/Main.jsp") > -1){
    var _maintopArea=momoj('.maintopArea').eq(0);  
    var _isMiddleBk=_container.find('#'+_container.attr('id')+'_e5').text();
    if(_isMiddleBk == "1"){ //大看板背景
      var _maintopAreaImg=_container.find('#'+_container.attr('id')+'_e6').text();
      if(_maintopAreaImg.indexOf("/ecm/img")>-1){
        _maintopArea.css('background','rgba(0, 0, 0, 0) url('+ _maintopAreaImg +') no-repeat center top');
      } 
      var _mainAreaBottomImg=_container.find('#'+_container.attr('id')+'_e7').text();
      if(_mainAreaBottomImg.indexOf("/ecm/img")>-1){
        _maintopArea.css('margin','0');
        _maintopArea.css('padding','0');
        momoj('.content').eq(0).css('background',' rgba(0, 0, 0, 0) url('+ _mainAreaBottomImg +') no-repeat center top');
      }
    }else{
      var _mainBodyBgImg=_container.find('#'+_container.attr('id')+'_e3').text();
      if(_mainBodyBgImg.indexOf("/ecm/img")>-1){
        _maintopArea.css('background','rgba(0, 0, 0, 0)');    
        momoj('#BodyBase').eq(0).css('background','url('+ _mainBodyBgImg +') no-repeat center bottom fixed');
      } 
    }
  }
}

// for Google Recaptcha V3
// 2023.05.05 移除gtoken檢驗機制 
$.fn.setGtoken = function(action){
  var recaptchaKey = "6Lct_uYUAAAAAEkzB_KMWpQNdnTX5wn2DYsmRagk";
  var container = $(this);
  container.data("gtokenDelayTime",10000);    //onload後重取時間
  container.data("gtokenWaitTime",2000);      //產gtoken後等待時間
  container.data("gtokenRefreshTime",100000); //產gtoken後refresh時間
  var token = "03AL8dmw9SJIa3NZIuKXQtmavALa9PvYZZn08J3JcHSjCLBJ-UHe1cNm9kxvMuSUTS5cbD-NKpktRdaQvicTBCGacSnTxoN";
  container.val(token);
  momoj(".grecaptcha-badge").hide();
}

//html decode
$.fn.decodeHTML = function(input){
  return momoj('<htmldecode>').html(input).text();
}

// 將數值加上千分位符號
$.fn.thousandNum = function(n) {
  n += '';
  var arr = n.split('.');
  var re = /(\d{1,3})(?=(\d{3})+$)/g;
  return arr[0].replace(re, '$1,') + (arr.length == 2 ? '.' + arr[1] : '');
}

})(jQuery);

function ShowMore(l_code){ 
  var _s=0;
  momoj('#bt_cate_top li').each(function(){
    //alert(momoj(this).attr('id')+';class:'+momoj(this).attr('class')+';S:'+_s);
    if(momoj(this).attr('id')==l_code){
      _s=1;
      return true;
    }
    if(_s==1 && momoj(this).hasClass('More')){
      momoj(this).hide();
    }
    if(_s==1 && momoj(this).hasClass('cateS')){
      momoj(this).removeClass('MoreHide');
    }
    if(_s==1 && momoj(this).hasClass('cateM')){
      _s=0;
      return false;
    }
  });
}

function get_form(url,varname){
  var _search=new Array();
  var vara=new Array();
  _search=url.split('?');
  
  if (typeof _search[1] =='undefined'){
    return '';
  }
  
  var _paa=_search[1].split('#');
  var _pa=_paa[0].split('&');
  
  var i=0;
  for (i=0;i<_pa.length;i++){
    vara=_pa[i].split('=');
    if (vara[0]==varname){
      return vara[1];
    }
  }
  return '';
}

function toUnicode() {
  var val = momoj.str2Unicode(momoj('#keyword').val());
  momoj('#p_keyword').val(val);
  momoj('[name=topSchFrm]').attr('action', momoj('[name=topSchFrm]').attr('action') + '&keyword=' + momoj('#keyword').val());
}

function safetymark() {
  var bodywidth = momoj("body")[0].clientWidth;
  var bodyheight = momoj("body")[0].clientHeight; 
  var viewingAreaheight = document.documentElement.clientHeight;
  momoj(".MoMoLM").css({"width":+ bodywidth+"px","height":+bodyheight+"px"}).fadeTo("slow",0.5);
  var safetymarkwidth = momoj(".safetymarkBox").width();
  var safetymarkheight = momoj(".safetymarkBox").height();
  momoj(".safetymarkBox").show().css({"bottom":+((viewingAreaheight/2)-(safetymarkheight/2))+"px","left":+((bodywidth/2)-(safetymarkwidth/2))+"px"});
  var safetymarkH2 = momoj('.safetymarkBox h2');
  if(safetymarkH2.length != 0){
    momoj(".safetymarkBox h2").delegate("a","click",function(){
        momoj(".MoMoLM, .safetymarkBox").hide();
    });
  }else{
    momoj(".safetymarkBox p").delegate("a","click",function(){
        momoj(".MoMoLM, .safetymarkBox").hide();
    });
  }
}

function envirmark() {
  var bodywidth = momoj("body")[0].clientWidth;
  var bodyheight = momoj("body")[0].clientHeight; 
  var viewingAreaheight = document.documentElement.clientHeight;
  momoj(".MoMoLM").css({"width":+ bodywidth+"px","height":+bodyheight+"px"}).fadeTo("slow",0.5);
  var envirmarkwidth = momoj(".envirmarkBox").width();
  var envirmarkheight = momoj(".envirmarkBox").height();
  momoj(".envirmarkBox").show().css({"bottom":+((viewingAreaheight/2)-(envirmarkheight/2))+"px","left":+((bodywidth/2)-(envirmarkwidth/2))+"px"});
  var envirmarkBoxH2 = momoj('.envirmarkBox h2');
  if(envirmarkBoxH2.length != 0){
    momoj(".envirmarkBox h2").delegate("a","click",function(){
      momoj(".MoMoLM, .envirmarkBox").hide();
    });
  }else{
    momoj(".envirmarkBox p").delegate("a","click",function(){
      momoj(".MoMoLM, .envirmarkBox").hide();
    });
  }
}

function momoco2mark() {
  var bodywidth = momoj("body")[0].clientWidth;
  var bodyheight = momoj("body")[0].clientHeight; 
  var viewingAreaheight = document.documentElement.clientHeight;
  momoj(".MoMoLM").css({"width":+ bodywidth+"px","height":+bodyheight+"px"}).fadeTo("slow",0.5);
  var co2markwidth = momoj(".co2markBox").width();
  var co2markheight = momoj(".co2markBox").height();
  momoj(".co2markBox").show().css({"bottom":+((viewingAreaheight/2)-(co2markheight/2))+"px","left":+((bodywidth/2)-(co2markwidth/2))+"px"});
  var co2markBoxH2 = momoj('.co2markBox h2');
  if(co2markBoxH2.length != 0){
    momoj(".co2markBox h2").delegate("a","click",function(){
      momoj(".MoMoLM, .co2markBox").hide();
    });
  }else{
    momoj(".co2markBox p").delegate("a","click",function(){
      momoj(".MoMoLM, .co2markBox").hide();
    });
  }
}

function getTimeStampMinutesRange(timeRange){
  var t = gettaipeiTime();
  var range = Math.floor(t.getMinutes()/timeRange);
  var minute = (range*timeRange)<10?"0" + (range*timeRange):(range*timeRange);
  var hour = t.getHours()<10?"0" + t.getHours():t.getHours();
  var day = t.getDate()<10?"0" + t.getDate():t.getDate();
  var month = (t.getMonth() + 1) <10?"0" + (t.getMonth() + 1):(t.getMonth() + 1);
  var year = t.getFullYear();
  var t2 = new Date(year + "/" + month + "/" +day + " " + hour + ":"+(minute) + ":" + "00");
  return t2.valueOf();
}

function DateTimezone(offset){
var d = new Date();
var utc = d.getTime() + (d.getTimezoneOffset()*60000);
return new Date(utc + (3600000*offset));
}
function gettaipeiTime(){
  return DateTimezone(8);
}

/** 寬版浮層 **/
function floatingLayerBox(params) {
  /*
   若有調整，同步調整floatingLayerBoxByID(params)
  */
  var _params=momoj.extend({
    type: '1',              //1:傳入tpl開啟浮層  2:傳入url開啟浮層
    title: '',              //浮層標題
    boxwidth: 1000,         //寬度
    innerHtml: '',          //以tpl做為浮層內容
    innerUrl: '',           //以url頁面做為浮層內容
    z_index: '3',            //1001:最上層
    onlyCloseBtn: false,    //是否只能使用[X]按鈕才能關閉浮層
    hideCloseBtn: false,    //是否隱藏[X]按鈕
    id: 'floatingLayerBox',  //浮層id
    callBack:function(){} ,
    leftText: '',           //左邊按鈕文字
    leftClick:function(){momoj("#MoMoLM, .floatingLayerBox").remove();},
    rightText: '',           //右邊按鈕文字
    rightClick:function(){momoj("#MoMoLM, .floatingLayerBox").remove();},
    customBtnHtml: '',       //客製化按鈕
    customClick:function(){momoj("#MoMoLM, .floatingLayerBox").remove();}
  }, params);
  
  //判斷以tpl或url做為浮層的內容
  if(_params.innerUrl) {
    //待uylin實作
    return;
  }else {
    var MoMoLM_z_index = _params.z_index - 1;
    viewHeiht = momoj(window).height();
    var buttonArea = _params.customBtnHtml ? _params.customBtnHtml : "<div class='buttonArea' style='background-color:#FFFFFF; padding:20px 20px; width:100%; box-sizing:border-box; display:inline-block; position:initial; margin:0;'></div>";
    momoj("body").append("<div id='"+_params.id+"' class='floatingLayerBox' style='width:" + _params.boxwidth + "px; z-index:" + _params.z_index + "'><style>.floatingLayerBox .title .closeBtn::before, .floatingLayerBox .title .closeBtn::after {background-color:#818181; width:24px; height:2px; content:''; margin:-1px 0px 0px -12px; position:absolute; top:50%; left:50%; transform:rotate(45deg);}.floatingLayerBox .title .closeBtn::after {transform:rotate(-45deg)}.floatingLayerBox{box-shadow:2px 2px 2px rgba(0,0,0,0.3); overflow:hidden; position:fixed; top:0px; left:0px; bottom:0px; right:0px; margin:auto;}.floatingLayerBox .title{background-color:#E7E7E7; height:50px; font:bold 17px/50px Microsoft JhengHei, sans-serif; color:#000000; padding:0px 10px;}.floatingLayerBox .title span{padding-left:10px; font:bold 17px/50px Microsoft JhengHei, sans-serif;}.floatingLayerBox .title .closeBtn{width:18px; height:18px; position:absolute; top:16px; right:15px; cursor:pointer;}.floatingLayerBox .innerArea{background-color:#FFFFFF; padding:20px 20px; width:100%; box-sizing:border-box; display:inline-block; position:initial; margin:0;}.floatingLayerBox .innerArea .confirmArea{font-size:0; text-align: center; margin:20px 0 0 0;}.floatingLayerBox .innerArea .confirmArea a,.floatingLayerBox .innerArea .confirmArea button{display:inline-block; padding:0px 40px; font: bold 17px/40px Microsoft JhengHei, sans-serif; border:0; outline:none; cursor:pointer;}.floatingLayerBox .innerArea .confirmArea a:not(:first-child),.floatingLayerBox .innerArea .confirmArea button:not(:first-child){margin: 0 0 0 15px;}.floatingLayerBox .innerArea .confirmArea .grayBtn{color: #000000; background-color: #E7E7E7;}.floatingLayerBox .innerArea .confirmArea .pinkBtn{color: #ffffff; background-color: #d62872;}</style>" + "<div class='title'><span></span><a class='closeBtn'></a></div><div class='innerArea'></div>" + "</div>");
    momoj("#" + _params.id + " .innerArea").html(_params.innerHtml + buttonArea);
    momoj(".floatingLayerBox .title span").html(_params.title);
    var buttonHtml = '';
    if(_params.leftText) {
    buttonHtml = '<a class="leftButton">' + _params.leftText + '</a>';
    }
    
    if(_params.rightText) {
    buttonHtml +='<a class="rightButton">' + _params.rightText + '</a>';
    }

    if(buttonHtml && !_params.customBtnHtml) {
      momoj(".floatingLayerBox .buttonArea").html(buttonHtml);
    } else {
      momoj(".floatingLayerBox .buttonArea").hide();
    }
    momoj(".floatingLayerBox .buttonArea").html(buttonHtml);
    momoj(".floatingLayerBox .buttonArea .leftButton").click(_params.leftClick);
    momoj(".floatingLayerBox .buttonArea .rightButton").click(_params.rightClick);
    momoj(".floatingLayerBox #customButton").click(_params.customClick);
    var container=momoj('#MoMoLM');
    if(container.length==0){// if not exists, create first
      momoj("body").append("<div id='MoMoLM' style='background-color:rgba(0,0,0,0.3); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:" + MoMoLM_z_index + "'></div>");
    }else{
      momoj('#MoMoLM').css({'background-color':'rgba(0,0,0,0.3)', 'opacity':'1', 'width':'100%', 'height':'100%', 'position':'fixed', 'top':'0px', 'left':'0px', 'z-index':MoMoLM_z_index}).show();
    }
  }
  
  _params.callBack();
  
  /** 當浮層改變高度時，為了讓浮層固定在正中央，所以當浮層有被點擊時，就去改變浮層style裡的高度 **/
  momoj("body").undelegate(".floatingLayerBox", "click").delegate(".floatingLayerBox", "click",function(){
    if(_params.id !== 'floatingLayerBox'){
      if(_params.id == 'cancelClaim'){ //退貨浮層
        var heigthResult = momoj("#singlereturn").innerHeight() + momoj("#cancelClaim" +" .title").height() + 150;
        if(momoj("#accountAreaHeader").is(':visible') ){
          heigthResult += momoj("#accountAreaHeader").innerHeight();
        }
        if(momoj("#accountAreaMain").is(':visible') ){
          heigthResult += momoj("#accountAreaMain").innerHeight();
        }
        heigthResult = heigthResult > 700 ? '80%' : heigthResult;
        var is80up = heigthResult == '80%'
        
        momoj('#cancelClaim').css("height",heigthResult);
        momoj("#cancelClaim .innerArea").css({"height": is80up ? "95%" : heigthResult, "overflow-y":is80up ? "auto" : "hidden"});
      }else{
        momoj("#" + _params.id).css({"height":(momoj("#" + _params.id +" .innerArea").innerHeight() + momoj("#" + _params.id +" .title").height())});
      }
    }else{
      momoj(".floatingLayerBox").css({"height":(momoj(".floatingLayerBox .innerArea").innerHeight() + momoj(".floatingLayerBox .title").height())});
    }
  });
  
  /** 關閉浮層事件 **/
  var _tmp = '#MoMoLM, .floatingLayerBox .closeBtn, .floatingLayerBox .cancel';
  if(_params.onlyCloseBtn) {  //只能點擊浮層的[X]
    _tmp = '.floatingLayerBox .closeBtn';
  }
  momoj("body").undelegate(_tmp, "click").delegate(_tmp, "click", function() {
    momoj("#MoMoLM, .floatingLayerBox").remove();
  });
  
  // 隱藏[X]按鈕
  if(_params.hideCloseBtn) {
    momoj('.floatingLayerBox .title .closeBtn').hide();
  }
}

/** 寬版浮層置中對齊 **/
function floatingLayerBoxAlignCenter() {
  if(typeof viewHeiht == 'undefined') return; 
  /** 此行很重要，讓浮層固定在視窗的正中央(而且一定要在最後執行) **/
  momoj(".floatingLayerBox").css({"height":(momoj(".floatingLayerBox .innerArea").innerHeight() + momoj(".floatingLayerBox .title").height()), "top":"0px"});
  if (viewHeiht < momoj(".floatingLayerBox").height()) {
    momoj(".floatingLayerBox").css({"height":viewHeiht, "width":(momoj(".floatingLayerBox").width()+17)});
    momoj(".floatingLayerBox .innerArea").css({"height":(viewHeiht - momoj(".floatingLayerBox .title").height() - 20), "overflow-y":"auto"});
  }
}

/** 寬版浮層置中對齊 **/
function floatingLayerBoxAlignCenterByID(targetID) {
  if(typeof viewHeiht == 'undefined') return; 
  /** 此行很重要，讓浮層固定在視窗的正中央(而且一定要在最後執行) **/
  momoj("#" +targetID).css({"height":(momoj("#" + targetID +" .innerArea").innerHeight() + momoj("#" + targetID +" .title").height()), "top":"0px"});
  if (viewHeiht < momoj("#" +targetID).height()) {
    momoj("#" +targetID).css({"height":viewHeiht, "width":(momoj(".floatingLayerBox").width()+17)});
    momoj("#" + targetID +" .innerArea").css({"height":(viewHeiht - momoj("#" + targetID +" .title").height() - 20), "overflow-y":"auto"});
  }
}

var brandCategory=jQuery().HashTables();

momoj(window).on("load",function(){
  momoj("img[lazy=0]").each(function(){
  var src = momoj(this).attr("src");
    momoj(this).attr("src",momoj.getImgSrc({org:momoj(this).attr("src")}));
  });
});

  momoj(window).scroll(function(){
    var topval = momoj("body").scrollTop();
      /** 判斷捲軸是否超過主選單，如超過主選單，將主選單固定至天的位置，方便點擊時呈現 **/
    if (document.documentElement.scrollTop > 0 || topval > 0) {
      /** 當捲軸離開頂時,將搜尋歸位,然後把商城跟下載App的按鈕隱藏 **/
      momoj(".searchbox").addClass("selectedtop");
      momoj("#bt_0_layout_b345").addClass("selectedhead");
      return;
    } else {
      momoj(".searchbox").removeClass("selectedtop");
      momoj("#bt_0_layout_b345").removeClass("selectedhead");
      return;
    }
    
   
  });

/**左側選單中分類加連結**/
momoj(document).ready(function () {
  var keyword = momoj("#keyword").val();  
  //取得預帶設定的關鍵字
  if(keyword ==''){
      var cateCode = get_form(document.location.href,'FTOOTH');
      if(cateCode != undefined && cateCode !=''){
        cateCode += '00000000';
      }else {
        cateCode = '1000000000';
      }
    var result = getKeywordForCategory(cateCode);//搜尋框關鍵字
    if(result.rtnCode =='200'){
      var randomKeyword = result.keyword;
      if(randomKeyword != undefined && randomKeyword != ''){
        momoj('#keyword').attr('placeholder',randomKeyword);//搜尋框關鍵字
      }else {
        momoj('#keyword').attr('placeholder', '請輸入關鍵字或品號');
      }
    }
    //取得限縮館架資訊,並塞入到畫面上和改變search bar的文案
    var csResult = getConstrictionInfo(typeof poolName!='undefined'?poolName:'');
    if(csResult){
      setConstrictionInfo(csResult);
    }
    
  }
    
  //取得預帶設定的關鍵字
  function getKeywordForCategory(cate_code){
      var _data = {
            flag: 2024,
            data:{
              custNo:'',
              categoryCode:cate_code
            }
       };
    var result = momoj.ajaxTool({data: _data});
    
    if(result.rtnCode=="200"){
      return result.rtnData.searchResult;
    }else {
      return '';
    }
  }
  //取得系統館 0:top30、1:本週新品、2:本週新降價、3:折價券熱銷、4:虛擬館、5:即將上市
  function getCateType(){
    var cateType ='';
    if(get_form(document.location.href,'TOP30').toUpperCase() == 'Y') {
      cateType = '0';
    }else if(get_form(document.location.href,'NEW').toUpperCase() == 'Y'){
      cateType = '1';
    }else if(get_form(document.location.href,'SALE').toUpperCase() == 'Y'){
      cateType = '2';
    }else if(get_form(document.location.href,'CPHOT').toUpperCase() == 'Y'){
      cateType = '3';
    }else if(get_form(document.location.href,'COMINGSOON').toUpperCase() == 'Y'){
      cateType = '5';
    }
    return cateType;
  }
  //取得限縮館架資訊
  function getConstrictionInfo(poolName){
    var strCode ='';
    var catelv= '0';
    var cateType = '';
    if(document.location.href.indexOf('/LgrpCategory.jsp')>-1) {
      cateType = getCateType();
      var lcode=get_form(document.location.href,'l_code');
      if(lcode.substring(0,2)=='21' && lcode.substring(2,5)=='999'){
        strCode ='';
      }else if(lcode.substring(0,2)!='21' && lcode.substring(2,5)=='999'){
        strCode = lcode.substring(0,2)+'00000000';
        catelv='1';
      }else{
        strCode = lcode;
        catelv='2';
      }
    } else if(document.location.href.indexOf('/MgrpCategory.jsp')>-1) {
      strCode=get_form(document.location.href,'m_code');
      catelv='3';
    } else if(document.location.href.indexOf('/DgrpCategory.jsp')>-1) {
      if(typeof promoTypes =='undefined' || promoTypes==''){//任選走全站不限縮
        cateType = getCateType();
        strCode=get_form(document.location.href,'d_code');
        catelv='4';
      }
    }
    if(strCode !=''){
      var _data = {
            flag: 2051,
            data:{
              cateType: cateType,
              catelv: catelv,
              categoryCode: strCode,
              poolName: poolName
              
            }
       };
      var result = momoj.ajaxTool({data: _data});
      
      if(result.rtnCode=="200"){
        return result.rtnData.constrictionResult;
      }else {
        return '';
      }
    }else{
      return '';
    }
  }    
  
  //新增search bar需要限縮館架的資訊
  function setConstrictionInfo(resultData){
    var isConstriction = resultData.isConstriction;
    if(isConstriction){
      var originalCateCode = resultData.originalCateCode;
      var originalCateName = resultData.originalCateName;//預設文案
      var cateType = resultData.cateType;
      var isBrandCategory = resultData.isBrandCategory;
      momoj("#keyword").attr("isconstriction" , isConstriction);
      momoj("#keyword").attr("switchconstriction" , false);
      //if(momoj("#keyword").attr("placeholder")== '請輸入關鍵字或品號' || momoj("#topSchFrm #keyword").attr("placeholder")==''){
       // momoj("#keyword").attr("placeholder" , originalCateName);//館架不顯示【搜尋框關鍵字】僅顯示預設文案,其他全站搜尋才會顯示
      //}
      //momoj("#keyword").attr("placeholder" , "請輸入關鍵字或品號");
      momoj("#switchConstrictionBlock #switchConstriction").text(originalCateName+"內商品");
      momoj("#switchConstrictionBlock #switchConstriction").data("text", originalCateName+"內商品");
      momoj("#switchConstrictionBlock #switchConstriction").attr("data-text", originalCateName+"內商品");
      momoj(".dropdown").removeClass("hide");

      var searchbar = momoj(".searchbar, .searchBk");
      searchbar.append(genConstrinctionInfo("originalCateCode", originalCateCode));
      searchbar.append(genConstrinctionInfo("originalCateName", originalCateName));
      searchbar.append(genConstrinctionInfo("cateType", cateType));
      searchbar.append(genConstrinctionInfo("isBrandCategory", isBrandCategory));
    }
  }
  //新增input tag html 內容
  function genConstrinctionInfo(setName, setVal){
    var infoStr ='';
    infoStr +='<input type="hidden" id="'+setName+'" name="'+setName+'" value="'+setVal+'">';
    return infoStr;
  }
  
  momoj('#bt_category_Content .cateM').each(function(){
    var mCateCode = momoj(this).attr('id');
    if(mCateCode){
      mCateCode = momoj(this).attr('id').replace('C','');
      var _href = momoj(this).find('a').attr('href');
      if(mCateCode.length == 10){
        if(!_href ){
          var mText = momoj(this).text();
          var mLink = '<a href="/category/MgrpCategory.jsp?m_code='+ mCateCode + '" >' + mText + '</a>';
          momoj(this).html(mLink);
          momoj(this).addClass('cateMLink');
        }
      }
    }
  });
  
  //判斷首頁廣告區塊有displayBlock就隱藏
  momoj('.displayBlock').each(function(){
    var dispaly = momoj(this).text();
    if(typeof dispaly !='undefined'){
      if(dispaly == 'off'){
        momoj(this).parent().hide();
      }
    }
  });

});

/*
 * 取得靜態檔的html content
 */
function getHtmlContent(htmlCode){
  momoj.ajaxTool({
    async: true,
    data:{flag: 2028 ,htmlCode: htmlCode},
    ajaxSuccess:function(_rtnObj) { 
      var htmlContent = _rtnObj.rtnData.result;
      if(htmlCode =='bt_7_307_01'){
        var Obj=momoj('#bt_0_257_01 ul');
        Obj.append(htmlContent);
      }else if(htmlCode =='bt_7_207_01'){
        var Obj=momoj('#bt_0_261_01 ul');
        Obj.append(htmlContent);
      }
    }
  });
}    

//觸發FB結帳事件
function fbEnvent(event, param){
  try {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','/* https://connect.facebook.net/en_US/fbevents.js */');
        
    fbq('init', '1181510125200182'); // pixel ID
    
    if(param!=null) {
      fbq('track', event, param);
    } else {
      fbq('track', event);
    }
    
        
  } catch(e) {
  }
  
}

//顯示momoco轉圈圈
function momocoLoadingAppend(){
  momoj("body").append('<div class="momocoLoadingBox" style="z-index: 99999; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.3)"></div>'+
      '<span class="momocoLoadingBox" style="z-index: 100000;position: fixed;top: calc(50% - 50px);left: calc(50% - 50px);display: inline-block;margin: 0px;padding: 0px;">'+
      '<img src="//image.momoshop.com.tw/ecm/img/cmm/gif_momo_loading.gif" style="width:100px;height:100px;vertical-align: top;"></span>');
}

//移除momoco轉圈圈
function momocoLoadingRemove(){
  momoj('.momocoLoadingBox').remove();
}

function imgTagHtml(goodsPicTagUrl) {
  if(!goodsPicTagUrl) {
    return "";
  } else {
    var imgTagHtml  = '<span class="imgTag">';
    imgTagHtml += '<img src="' + goodsPicTagUrl + '" />';
    imgTagHtml += '</span>';

    return imgTagHtml;
  }
}

function imgTagHtmlAll(goodsPicTagUrl,options) {
  if(!goodsPicTagUrl) {
    return "";
  } else {
    var _defaultSettings = {        
      clz : ""   
    }; 
    var _settings = momoj.extend(_defaultSettings, options);
    var clz = _settings.clz || "";
    var imgTagHtml  = '<div class="'+clz+'">';
    imgTagHtml += '<img src="' + goodsPicTagUrl + '" />';
    imgTagHtml += '</div>';

    return imgTagHtml;
  }
}

function prdImgWrap(wrapContains , options) {
  var _defaultSettings = {        
    clz : ""   
  }; 
  var _settings = momoj.extend(_defaultSettings, options);
  var clz = _settings.clz || "";
  clz = clz +" prdImgWrap";
  if(typeof wrapContains[0] === "string") {
    return  '<div class="'+ clz +'">' + wrapContains.join("") + '</div>';
  } else {
    var wrap = momoj('<div class="prdImgWrap"></div>');
    wrap.addClass(clz);
    for(var i = 0 ; i < wrapContains.length ; i++) {
      wrap.append(wrapContains[i]);
    }

    return wrap;    
  }
}

function prdImgUnwrap(prdImg) {
  if(typeof prdImg === "string") {
    return prdImg;
  }

  if(prdImg.parent().hasClass("prdImgWrap")) {
    prdImg.siblings().remove();
    prdImg.unwrap();

    return prdImg;
  } else {
    return prdImg;
  }
}

function openWindowWithPost(url, name, keys, values) {
  var newWindow = window.open(url, name);
  if (!newWindow) {
    return false;
  }
  var html = '';
  html += '<html><head></head><body><form id="formId" method="post" action="'+ url +'">';
  if (keys && values && (keys.length == values.length)) {
    for (var i = 0; i < keys.length; i++) {
      html += '<input type="hidden" name="'+ keys[i] +'" value="'+ values[i] +'"/>';
    }
  }
  html += '</form>';
  html += '<script type="text\/javascript">document.getElementById("formId").submit()<\/script>';
  html += '</body></html>';

  newWindow.document.write(html);
  return newWindow;
}

/** 寬版浮層(無下方button) **/
function floatingLayerBoxByID(params) {
  /*
   若有調整，同步調整floatingLayerBox(params)
  */
  var _params=momoj.extend({
    type: '1',              //1:傳入tpl開啟浮層  2:傳入url開啟浮層
    title: '',              //浮層標題
    boxwidth: 1000,         //寬度
    innerHtml: '',          //以tpl做為浮層內容
    innerUrl: '',           //以url頁面做為浮層內容
    z_index: '3',            //1001:最上層
    hideCloseBtn: false,    //是否隱藏[X]按鈕
    id: 'floatingLayerBox',  //浮層id
    callBack:function(){}
  
  }, params);
  
  //判斷以tpl或url做為浮層的內容
  if(_params.innerUrl) {
    //待uylin實作
    return;
  }else {
    var MoMoLM_z_index = _params.z_index - 1;
    viewHeiht = momoj(window).height();
    momoj("body").append("<div id='"+_params.id+"' class='floatingLayerBox' style='width:" + _params.boxwidth + "px; z-index:" + _params.z_index + "'><style>.floatingLayerBox .title .closeBtn::before, .floatingLayerBox .title .closeBtn::after {background-color:#818181; width:24px; height:2px; content:''; margin:-1px 0px 0px -12px; position:absolute; top:50%; left:50%; transform:rotate(45deg);}.floatingLayerBox .title .closeBtn::after {transform:rotate(-45deg)}.floatingLayerBox{box-shadow:2px 2px 2px rgba(0,0,0,0.3); overflow:hidden; position:fixed; top:0px; left:0px; bottom:0px; right:0px; margin:auto;}.floatingLayerBox .title{background-color:#E7E7E7; height:50px; font:bold 17px/50px Microsoft JhengHei, sans-serif; color:#000000; padding:0px 10px;}.floatingLayerBox .title span{padding-left:10px; font:bold 17px/50px Microsoft JhengHei, sans-serif;}.floatingLayerBox .title .closeBtn{width:18px; height:18px; position:absolute; top:16px; right:15px; cursor:pointer;}.floatingLayerBox .innerArea{background-color:#FFFFFF; padding:20px 20px; width:100%; box-sizing:border-box; display:inline-block; position:initial; margin:0;}.floatingLayerBox .innerArea .confirmArea{font-size:0; text-align: center; margin:20px 0 0 0;}.floatingLayerBox .innerArea .confirmArea a,.floatingLayerBox .innerArea .confirmArea button{display:inline-block; padding:0px 40px; font: bold 17px/40px Microsoft JhengHei, sans-serif; border:0; outline:none; cursor:pointer;}.floatingLayerBox .innerArea .confirmArea a:not(:first-child),.floatingLayerBox .innerArea .confirmArea button:not(:first-child){margin: 0 0 0 15px;}.floatingLayerBox .innerArea .confirmArea .grayBtn{color: #000000; background-color: #E7E7E7;}.floatingLayerBox .innerArea .confirmArea .pinkBtn{color: #ffffff; background-color: #d62872;}</style>" + "<div class='title'><span></span><a class='closeBtn'></a></div><div class='innerArea'></div>" + "</div>");
    momoj("#" + _params.id +" .innerArea").html(_params.innerHtml);
    momoj('#'+_params.id +" .title span").html(_params.title);
    
    var container=momoj('#MoMoLM');
    if(container.length==0){// if not exists, create first
      momoj("body").append("<div id='MoMoLM' style='background-color:rgba(0,0,0,0.3); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:" + MoMoLM_z_index + "'></div>");
    }else{
      momoj('#MoMoLM').css({'background-color':'rgba(0,0,0,0.3)', 'opacity':'1', 'width':'100%', 'height':'100%', 'position':'fixed', 'top':'0px', 'left':'0px', 'z-index':MoMoLM_z_index}).show();
    }
  }
  
  _params.callBack();
  
  /** 當浮層改變高度時，為了讓浮層固定在正中央，所以當浮層有被點擊時，就去改變浮層style裡的高度 **/
  momoj("body").undelegate('#'+_params.id, "click").delegate('#'+_params.id, "click",function(){
    if(_params.id !== 'floatingLayerBox'){
      momoj("#" + _params.id).css({"height":(momoj("#" + _params.id +" .innerArea").innerHeight() + momoj("#" + _params.id +" .title").height())});
    }else{
      momoj(".floatingLayerBox").css({"height":(momoj(".floatingLayerBox .innerArea").innerHeight() + momoj(".floatingLayerBox .title").height())});
    }
  });
  
  // 隱藏[X]按鈕
  if(_params.hideCloseBtn) {
    momoj('.floatingLayerBox .title .closeBtn').hide();
  }
}
function isEmptyList(list) {
  return !list || list.length == 0;
}

function isEmptyObj(o) {
  return !o || Object.keys(o).length == 0;
}

function traceLog(printLog, msg) {
  if(printLog) {
    console.log(msg);
  }
}

//顯示登入1.0
function showLoginV1(_settings){
   momoj.ajax({
    dataType: 'html',
    cache: false,
    type: "GET",
    data:{cid:"memfu",oid:"login",ctype:"B",mdiv:"1000100000-bt_0_003_01"},
    url: '/ajax/LoginAjax.jsp?preUrl=' + _settings.preUrl,
    success: function(msg){
      if(typeof msg == 'string'){
        if (msg.indexOf('status:1')>-1){
          if (momoj.isFunction(_settings.LoginSuccess)) {
            _settings.LoginSuccess.call(this);
          }
          return;
        }
      }
      
      momoj().LayerMask({contentWidth:'604px'}).open();
      momoj('#MoMoLMContent').empty();
      momoj('#MoMoLMContent').html(msg);
      momoj('#MoMoLMContent').css('height','auto');
      if(_settings.GoCart) {
        momoj('#ajaxLogin .Bottom').show();
      }
      momoj('#ajaxLogin').data('LoginSuccess',_settings.LoginSuccess);
      momoj('#ajaxLogin').data('LoginCancel',_settings.LoginCancel);
    },
    error: function(xhr){
      alert("網站主機忙錄中，請稍後再試！謝謝！");
    }
  });
}
//載入新版登入相關檔案
function loadNewLogin(settings){
  var _defaultSettings = {
    GoCart: false,
    LoginSuccess: '',
    LoginCancel: '',
    preUrl: '',
    callback : '',
    loginPath :　''
  };
  
  let _settings = momoj.extend(_defaultSettings, settings);
  let head = document.getElementsByTagName('head')[0];
  if(!!!document.querySelector("link[class='accountCssFile']")){
    let cssPath = momoj.getJsCssPath({org:'/ecm/css/account/account.css?t=20241127001'});
    let css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssPath;
    css.className = 'accountCssFile';
    head.appendChild(css);
  }
  if(typeof account !== "undefined"){
    if(typeof _settings.callback=="function"){
      _settings.callback.call(this,_settings);
    }
  }else{
    if(!!!document.querySelector("script[class='accountJsFile']")){
      let jsPath = momoj.getJsCssPath({org:'/ecm/js/account/account.js?t=20250521001'});
      let sc = document.createElement('script');
      sc.src = jsPath;
      sc.className='accountJsFile';
      head.appendChild(sc);
      sc.onload = function() {
        if(typeof _settings.callback=="function"){
            _settings.callback.call(this,_settings);
        }
      }
      sc.onerror = function(){
        alert("網站主機忙錄中，請稍後再試！謝謝！");
      }
    }
  }
}
//載入新版登入相關檔案
function loadNewLoginCSS(){
  let head = document.getElementsByTagName('head')[0];
  if(!!!document.querySelector("link[class='accountCssFile']")){
    let head = document.getElementsByTagName('head')[0];
    let cssPath = momoj.getJsCssPath({org:'/ecm/css/account/account.css?t=20241127001'});
    let css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssPath;
    css.className = 'accountCssFile';
    head.appendChild(css);
  }
}
function loadNewLoginJS(settings){
  let head = document.getElementsByTagName('head')[0];
  var _defaultSettings = {callback : ''};
  let _settings = momoj.extend(_defaultSettings, settings);
  if(typeof account !== "undefined"){
    if(typeof _settings.callback=="function"){
      _settings.callback.call(this);
    }
  }else{
    let jsPath = momoj.getJsCssPath({org:'/ecm/js/account/account.js?t=20250521001'});
    let sc = document.createElement('script');
    sc.src = jsPath;
    sc.className='accountJsFile';
    head.appendChild(sc);
    sc.onload = function() {
      if(typeof _settings.callback=="function"){
          _settings.callback.call(this,_settings);
      }
    }
    sc.onerror = function(){
      alert("網站主機忙錄中，請稍後再試！謝謝！");
    }
  }
}
//取得登入版本
function getLoginVersion(){
  let rtn = momoj.ajaxTool({data:{flag:6011}});
  if(rtn && rtn.rtnData && rtn.rtnData.version){
    actswitch = +rtn.rtnData.version;
  }else{
    actswitch = 2;
  }
  return actswitch;
}
//顯示登入浮層
function showLogin(settings){
  let actswitch = getLoginVersion();
  if(actswitch==2){
    showLoginV2(settings);
  }else{
    showLoginV1(settings);
  }
}
//顯示登入2.0
function showLoginV2(_settings){
  loadNewLoginCSS();
  loadNewLoginJS({"callback": function(){
    if(typeof account !== "undefined"){
      account.showLoginIframe(_settings,chkSyncInfo);
    }
  }});
}
//檢查同步狀態
function chkSyncInfo(_settings){
  let info = localStorage.getItem('STORAGEINFO');
  let version = localStorage.getItem('VERSION');
  if(info !== null && info !== "" && version !== null && version !== "") {
    let parmas = {
      data:{flag:6012,info:info,version:version},
      ajaxSuccess:function(rtnData){
        if(rtnData && rtnData.rtnData && !!rtnData.rtnData.success){
          if(typeof _settings.LoginSuccess=="function"){
            _settings.LoginSuccess.call(this);
          }
          checkMomoLoginStatus();
        }else{
          if(typeof account !== "undefined"){
            account.removeStorage();
          }
          alert("網站主機忙錄中，請稍後再試！謝謝！");
        }
      },
      ajaxCancel:function(){
        if(typeof account !== "undefined"){
            account.removeStorage();
        }
        alert("網站主機忙錄中，請稍後再試！謝謝！");
      }
    }
    momoj.ajaxTool(parmas);
  }
}
function checkMomoLoginStatus(){
  momoj().MoMoChkLogin();
  if(momoj('#ShoppingCar').length > 0) {
    momoj.fn.ShopHistCart1108();
  }
  var domainType = momoj().getDomainType();
  var showXiaoi = momoj().showXiaoi(domainType);
  if(showXiaoi) {
    momoj("#dvSmartAgent").remove();
    momoj().removeXiaoiWebChatJs(domainType);
    momoj().importXiaoiJs();
  }
  if(typeof(momoAsk) != "undefined"){
     updateAskMomoCount();
  }
  momoj.initAstar();
}

//透過非同打api取得瀏覽紀錄裡的詳細商品資訊
async function fetchHistoryGoodsData(cookie_prdLst) {
  return new Promise((resolve, reject) => {
    momoj.ajaxTool({
      timeout: 30 * 1000,
      async: true,
      data: {
        flag: 2058,
        goodsCode:cookie_prdLst
      },
      ajaxSuccess(data) {
        resolve(data);
      },
      ajaxCancel(data) {
        reject(data);
      },
    })
  })
}
//產生出黏人精中的瀏覽紀錄商品
function genHistoryGoodsData(rtn, _hist, _histMax, _settings) {
  try {
    let rtnData = (rtn.resultCode == '200' && rtn.data.length > 0) ? rtn.data : [];
    
    let histIndex = 0;
    for (let i = rtnData.length - 1; i >= 0 && histIndex < _histMax; i--) {
        let item = rtnData[i]; 
        let _prd = momoj(_hist[histIndex + 1]);
        let goodsCode = item.goodsCode||'';
        let entpCode = item.entpCode||'';
        let imgUrl = item.imgUrl||'';
        let imgSrc = getGoodsImgPathWebp(imgUrl, navigator.userAgent); // webp process from imgWebp.js
        
        let href = goodsCode.startsWith('TP') 
                ? `/TP/${entpCode}/goodsDetail/${goodsCode}` 
                : _settings.prdUrl + goodsCode;

        momoj('a', _prd).attr('href', href);

        momoj('img:not(.imgTag, .imgTagRectangle, .imgTagBottom > img)', _prd).attr('src', momoj.getImgSrcCloud({ org: imgSrc }));
        let p = momoj('img:not(.imgTag > img)', _prd).parent();
        p.append(prdImgWrap([momoj('img:not(.imgTag > img)', _prd)]));

        _prd.show();
        histIndex++;
    };
  } catch (error) {
      console.log(error);
  }
}
/**
 * cookie 取得 客編
 * @returns {String} 客編
 */
function getCustNo() {
  return (momoj().cookie('ccmedia') || '').split('_/')[0].replace('"', '');
}

/**
 * 處理熱銷排行榜 #bt_0_255_01
 * @author jphsu
 */
momoj(document).ready(function () {
  /**
   * 更新 熱銷排行榜 ( bt_0_255_01 ) 市價、折後價、"起"字
   */
  async function update_bt_0_255_01() {
    /**
     * 取得 熱銷綁 goodsCode 對應 li Element 的 Map ( e.g. { '123456': 對應 HTML 元素 } )
     * @returns {Map<String,HTMLLIElement>}
     */
    const createGoodsCodeElementsMap = () => {
      const rankGoodsElements = Array.from(document.querySelectorAll('#bt_0_255_01 .TabContentD ul li'));
      return rankGoodsElements.reduce((goodCodeElementMap, rankGoodsElement) => {
        const goodsCodeElement = rankGoodsElement.querySelector('[class*="GDS-"]');
        const goodsCode = (goodsCodeElement?.className||'').match(/GDS-\S+/)?.[0]?.replace('GDS-', '')
        goodCodeElementMap.set(goodsCode, rankGoodsElement);
        return goodCodeElementMap;
      }, new Map())
    }

    /** 
     * 取得 商品 折後價、ICON 資料
     * @param {String} custNo 客編
     * @param {Array<String>} goodsCodesList 品號
     * @returns {Promise}
     */
    const fetchHotSaleGoodsInfo = async({ custNo='', goodsCodesList=[] }) => {
      return new Promise((resolve, reject) => {
        momoj.ajaxTool({
          async: true,
          timeout: 15 * 1000,
          data: {
            flag: 2054,
            data: {
              custNo,
              goodsList: goodsCodesList,
            }
          },
          ajaxSuccess(data) {
            resolve(data);
          },
          ajaxCancel(data) {
            reject(data);
          }
        })
      })
    }

    /** 用於處理 flag:2054 Api Response  
    * GetHotSaleGoodsInfoAjaxToolResponse AjaxTool Response
    * @typedef {Object} GetHotSaleGoodsInfoAjaxToolResponse
    * @property {String} rtnCode
    * @property {HotSearchGroupListData} rtnData
    * @property {String} rtnMsg
    */
    class GetHotSaleGoodsInfoAjaxToolResponse {
      constructor(response) {
        this.response = response;
        this.successRtnCode = '200';
      }
      get rtnData() {
        return this.response?.rtnData || {};
      }
      get isSuccess() {
        return (this.response.rtnCode == this.successRtnCode)
                &&
               (this.hotSaleGoodsInfo.length > 0);
      }
      get hotSaleGoodsInfo() {
        return this.rtnData.hotSaleGoodsInfo || [];
      }
    }

    /**
     * 更新渲染區塊內容
     * @param {Map} goodsCodeElementsMap 熱銷綁 goodsCode 對應 li Element 的 Map
     * @param {GetHotSaleGoodsInfoAjaxToolResponse} response flag:2053 Api Response
     */
    const render = (goodsCodeElementsMap, response) => {
      response.hotSaleGoodsInfo.forEach(goodsInfo => {
        const { goodsCode='', goodsPriceModel={}, marketPriceModel={} } = goodsInfo;
        const element = goodsCodeElementsMap.get(goodsCode);
        if (element) {
          const hrefElement = element.querySelector('& > a');
          const { sign:originSign='', price:originPrice='', strPrice:originStartingPrice='', } = marketPriceModel.basePrice || {};
          const { sign:promoSign='',  price:promoPrice='',  strPrice:promoStartingPrice='', } = goodsPriceModel.basePrice || {};
          const isEmptyPrice = price => price == 0 || price === '' || typeof price === 'undefined';
          const hightLightSign = isEmptyPrice(promoPrice) ? originSign : promoSign;
          const hightLightPrice = isEmptyPrice(promoPrice) ? originPrice : promoPrice;
          const hightLightStartingPrice = isEmptyPrice(promoPrice) ? originStartingPrice : promoStartingPrice;

          // 如果從資料拿到 要顯示的價錢為空，則不更新、保留原始 html
          if (isEmptyPrice(hightLightPrice)) return;

          // 移除舊價錢
          hrefElement.querySelector('.prdprice').remove();
          // 塞新價錢
          hrefElement.innerHTML += (
            '<p class="prices-group">' +
              ( // 市價為 0、售價為空 不顯示市價 html
                isEmptyPrice(originPrice) || isEmptyPrice(promoPrice)
                  ? '<span class="origin-prices-group"></span>'
                  : (
                      `<span class="origin-prices-group">` +
                        `<span class="origin-price">${ originSign }<b>${ originPrice }</b>` +
                          ( // 有'起' 顯示 html， 沒'起' 不顯示 html
                            !!originStartingPrice ? `<span class="price-from">${ originStartingPrice }</span>` : ''
                          ) +
                        `</span>` +
                      `</span>`
                    )
              ) +
              (
                `<span class="current-prices-group">` +
                  `<span class="current-price">${ hightLightSign }<b>${ hightLightPrice }</b>` +
                    ( // 有'起' 顯示 html， 沒'起' 不顯示 html
                      !!hightLightStartingPrice ? `<span class="price-from">${ hightLightStartingPrice }</span>` : ''
                    ) +
                  `</span>` +
                `</span>`
              ) +
            '</p>'
          );
        }
      })
    }

    const goodsCodeElementsMap = createGoodsCodeElementsMap();
    try {
      const response = new GetHotSaleGoodsInfoAjaxToolResponse(
        await fetchHotSaleGoodsInfo({
          custNo: getCustNo(),
          goodsCodesList: Array.from(goodsCodeElementsMap.keys()).map(goodsCode => ({ goodsCode })),
        })
      )
      if (response.isSuccess) {
        render(goodsCodeElementsMap, response)
      } else {
        console.log('error')
      }
    } catch(error) {
      console.log('error')
    }
  }

  if (document.querySelector('#bt_0_255_01')) {
    update_bt_0_255_01();
  }
})
/**
 * 回傳靜態檔的路徑，如果是QC or UAT 則回傳相應路徑，其他則回傳正式環境路徑
 * @param {String} path 
 * @returns 
 */
function getStaticFileDomain(){
  let urlHost = window.location.host;
  let mobileUatHostRegExp = /^muat[0-9]{1,2}.momoshop.com.tw$/;
  let mobileQcHostRegExp = /^mqc[0-9]{1,2}.momoshop.com.tw$/;
  let momoshopUatHostRegExp = /^momouat[0-9]{1,2}.momoshop.com.tw$/;
  let momoshopQcHostRegExp = /^momoqc[0-9]{1,2}.momoshop.com.tw$/;

  if(  urlHost.match(mobileUatHostRegExp) || urlHost.match(mobileQcHostRegExp) || urlHost.match(momoshopUatHostRegExp) || urlHost.match(momoshopQcHostRegExp) ){
    return urlHost;
  } else {
    return 'image.momoshop.com.tw';
  }
}

//動態加載CSS
function momoLoadCSS(urlArray){
  momoj.each(urlArray,function(index,value){
    if(momoj(`link[href="${value}"]`).length <= 0){
      momoj(`<link>`).attr({
        rel :"stylesheet",
        type:"text/css",
        href:value
      }).appendTo("head");
    }
  });
}

function get3PSearchDomainName(){
  let momoshopDomain = "www.momoshop.com.tw";
  let host = location.hostname;
  if (!/(www|m)\.momoshop\.com\.tw/.test(host)) {
    if(/momoqc\d+\.momoshop\.com\.tw/.test(host)){
      let envNum = host.replace(/\D/g, '')
      momoshopDomain = `momoqc${envNum}.momoshop.com.tw`;
    } else if(/momouat\d+\.momoshop\.com\.tw/.test(host)) {
      momoshopDomain = "uatviewpage1.momoshop.com.tw";
    }
  }
  return momoshopDomain;
}

function get3PTpDomainName(){
  let momoshopDomain = "www.momoshop.com.tw";
  let host = location.hostname;
  if (!/(www|m)\.momoshop\.com\.tw/.test(host)) {
    if(/momoqc\d+\.momoshop\.com\.tw/.test(host)){
      let envNum = host.replace(/\D/g, '')
      momoshopDomain = `momoqc${envNum}.momoshop.com.tw`;
    } else if(/momouat\d+\.momoshop\.com\.tw/.test(host)) {
      let envNum = host.replace(/\D/g, '')
      momoshopDomain = `momouat${envNum}.momoshop.com.tw`;
    }
  }
  return momoshopDomain;
}