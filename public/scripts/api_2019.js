var _host = 'WEB';

var template={
  pageTotal:[
    '<dt><span>頁數<b class="curPage"><%=this.curPage%></b>/<%=this.totalPage%></span></dt>',
    '<dd><a go="up">上一頁</a></dd>',
    '<dd><a go="down">下一頁</a></dd>'
  ].join(''),
  pageList:[
  '<%if(this.fstPage && j==0){ %>',
    '<li><a go="fst">最前頁</a></li>',
    '<li><a go="up10">上<%=this.linePage%>頁</a></li>',
  '<%}%>',
  '<li <% if(this.curPage==this.pageNo){ %>class="selected"<% } %> pageNo="<%=this.pageNo%>" nowPage="<%=this.curPage%>"><a class="<% if(this.curPage==this.pageNo){ %>selected<% } %>" go="fix" pageNo="<%=this.pageNo%>"><%=this.pageNo%></a></li>',
  '<%if(this.lastPage && j==(this.linePage-1)){%>',
    '<li><a go="down10">下<%=this.linePage%>頁</a></li>',
    '<li><a go="lst">最後頁</a></li>',
  '<%}%>'
  ].join('')
};
  
(function(momoj){
  momoj.extend({
    _callShoppingCartApi:function(settings) {
      var _settings=momoj.extend({
        async:false,
        successCase:'0',
        url:'',
        json:{},
        rtn:{},
        apiSuccess:false,
        apiFail:false,
        apiError:false
      },settings);
      var _rtn = {};
      momoj.ajax({
        url: _settings.url,
        type: 'POST',
        data: _settings.json,
        dataType: 'json',
        contentType:'application/json;charset=utf-8',// POST時必須:若送出為jsonObject要加這個
        async: _settings.async,
        cache: false,
        xhrFields:{withCredentials:true},//ajax會自動帶上同源的cookie，不會帶上不同源的cooike，可以透過設定讓ajax帶上不同源的cookie
        crossDomain: true,
        success: function(rtn) {
          _rtn=momoj.extend({},rtn);
          _settings.rtn =_rtn;
          if(typeof _rtn.resultCode != 'undefined' && _rtn.resultCode == '1'){
            _settings.apiSuccess=true;
            if(_settings.async){
              switch (_settings.successCase) {//針對非同步的特別處理
                case '_renewMyWishListCount':
                  var myWishListCount=(isNaN(parseInt(rtn.count,10)))?0:rtn.count;
                  momoj._renewMyWishListCount({'count':myWishListCount});  //★★更新[追蹤清單]數量★★
                  break;
                case '_renewMyRecentlyRecordCount':
                  var myRecentlyRecordCount=(isNaN(parseInt(rtn.count,10)))?0:rtn.count;
                  momoj._renewMyRecentlyRecordCount({'count':myRecentlyRecordCount}); //★★更新[我最近購買]數量★★
                  break;
              }
            }
          }else{
            _settings.apiFail=true;
          }
        },
        error: function() {
          _settings.apiError=true;
        }
      });
      delete _settings.json;
      delete _settings.url;
      return _settings;
    },
    _getAndRenewMyWishListCount:function(){//★★取得並更新[追蹤清單]數量★★
      momoj._getMyWishListCount();  //★★(非同步)取得[追蹤清單]數量★★
    },
    _getMyWishListCount:function(){ //★★(非同步)取得[追蹤清單]數量★★
      var url=momoj.cartApiDomain + '/api/shoppingcart/trackandhistory/getWishItemCount'; // [API-214:取得追蹤清單商品數量]
      var json = JSON.stringify({
        "host":_host
      });
      momoj._callShoppingCartApi({'url':url,'json':json,'async':true,'successCase':'_renewMyWishListCount'});//(非同步)
    },
    _renewMyWishListCount:function(settings){ //★★更新[追蹤清單]數量★★
      var _settings=momoj.extend({
        count:0
      },settings);
      momoj('#wishListCount').text(_settings.count);
    },
    _getAndRenewMyRecentlyRecordCount:function(){//★★取得並更新[我最近購買]數量★★
      momoj._getMyRecentlyPurchasedCount(); //★★(非同步)取得[我最近購買]數量★★
    },
    _getMyRecentlyPurchasedCount:function(){ //★★(非同步)取得[我最近購買]數量★★
      var url=momoj.cartApiDomain + '/api/shoppingcart/trackandhistory/getRecentlyPurchasedCount'; // [API-216:取得我最近購買商品數量]
      var json = JSON.stringify({
        "host":_host
      });
      momoj._callShoppingCartApi({'url':url,'json':json,'async':true,'successCase':'_renewMyRecentlyRecordCount'});//(非同步)
    },
    _renewMyRecentlyRecordCount:function(settings){ //★★更新[我最近購買]數量★★
      var _settings=momoj.extend({
        count:0
      },settings);
      momoj('#recentlyRecordCount').text(_settings.count);
    },
    _getAndShowMyWishList:function(settings){//★★取得並顯示[追蹤清單]商品★★
      var _settings=momoj.extend({nowPage:1,pageSize:5,newPage:0},settings);
      if(_settings.newPage != 0){
        if(_settings.newPage == _settings.nowPage){
          return; 
        }
        _settings.nowPage = _settings.newPage;
      }
      var rtn = momoj._getMyWishListGoods({nowPage:_settings.nowPage,pageSize:_settings.pageSize,searchFlag:0}); //★★取得[追蹤清單]商品★★
      if(rtn.apiSuccess){
        var _count=(isNaN(parseInt(rtn.rtn.data.count,10)))?0:rtn.rtn.data.count;
        var _goods=(typeof rtn.rtn.data.goods=='object')?rtn.rtn.data.goods:new Array();
        if(_count == 0 && _goods.length==0){
          alert('追蹤清單內無任何商品');
        }else if(_goods.length==0){
          alert('追蹤清單取得失敗，請稍候再試！');
        }else{
          momoj._showWishListGoods({goods:_goods,totalPage:rtn.rtn.data.totalPage,nowPage:_settings.nowPage,count:_count}); //★★顯示[追蹤清單]商品★★
        }
      }else{
        momoj._err({msg:'追蹤清單取得失敗，可能是因為網頁逾時！'});
      }
    },
    _getMyWishListGoods:function(settings){ //★★取得[追蹤清單]商品★★
      var _settings=momoj.extend({
        nowPage:'',
        pageSize:'',
        searchFlag:''//排序方式 0:商品加入追蹤日期新到舊 1:商品上架日期新到舊 2:商品價格高到低 3:商品價格低到高 (沒傳值時預設0)
      },settings);
      var url = momoj.cartApiDomain + '/api/shoppingcart/trackandhistory/getWishList'; //[API-215:取得追蹤清單商品]
      var json = JSON.stringify({
        "host":_host,
        "nowPage":_settings.nowPage,
        "pageSize":_settings.pageSize,
        "searchFlag":_settings.searchFlag
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    _showWishListGoods:function(settings){ //★★顯示[追蹤清單]商品★★
      var _settings=momoj.extend({goods:[],totalPage:1,nowPage:1,count:0},settings);
      momoj._notice({notice:'708'}); // notice708 → 購物車頁：「追蹤清單」的浮層
      momoj('#notice708 table tbody').jqotesub(tpl['notice708Row'],settings.goods);

      momoj._showPageArea({totalRows:_settings.count,curPage:_settings.nowPage,pageAct:'Func',funcName:'momoj._getAndShowMyWishList({nowPage:'+_settings.nowPage+', pageSize:5})',rowsPerPage:5});
      momoj._renewMyWishListCount({'count':_settings.count}); //★★更新[追蹤清單]數量★★
      momoj('#popWishListCount').text(momoj('#wishListCount').text());
      momoj('#popRecentlyRecordCount').text(momoj('#recentlyRecordCount').text());

      momoj('.left').addClass('selected'); //「追蹤清單M件」底色變更為粉色
      momoj('.middle').removeClass('selected'); // 「我最近購買N件」移除粉色
      momoj(".floatingLayerBox .prdListArea .recentTrackPrdList").show();
      momoj('.floatingLayerBox').trigger('click');//浮層塞了內容後高度變了，所以trigger click重新計算浮層高度
    },
    _getAndShowMyRecentlyPurchasedGoods:function(settings){//★★取得並顯示[我最近購買]商品★★
      var _settings=momoj.extend({nowPage:1,pageSize:5,newPage:0},settings);
      if(_settings.newPage != 0){
        if(_settings.newPage == _settings.nowPage){
          return; 
        }
        _settings.nowPage = _settings.newPage;
      }
      var rtn = momoj._getMyRecentlyPurchasedGoods({nowPage:_settings.nowPage,pageSize:_settings.pageSize}); //★★取得[我最近購買]商品★★
      if(rtn.apiSuccess){
        var _count=(isNaN(parseInt(rtn.rtn.data.count,10)))?0:rtn.rtn.data.count;
        var _goods=(typeof rtn.rtn.data.goods=='object')?rtn.rtn.data.goods:new Array();
        if(_count == 0 && _goods.length==0){
          alert('您最近三個月內無任何消費');
        }else if(_goods.length==0){
          alert('最近購買N件取得失敗，請稍候再試！');
        }else{
          momoj._showMyRecentlyPurchasedGoods({goods:_goods,totalPage:rtn.rtn.data.totalPage,nowPage:_settings.nowPage,count:_count}); //★★顯示[最近購買]商品★★
        }
      }else{
        momoj._err({msg:'最近購買N件取得失敗，可能是因為網頁逾時！'});
      }
    },
    _getMyRecentlyPurchasedGoods:function(settings){ //★★取得[我最近購買]商品★★
      var _settings=momoj.extend({
        nowPage:'',
        pageSize:''
      },settings);
      var url = momoj.cartApiDomain + '/api/shoppingcart/trackandhistory/getRecentlyPurchasedList'; //[API-217:取得我最近購買商品]
      var json = JSON.stringify({
        "host":_host,
        "nowPage": _settings.nowPage,
        "pageSize": _settings.pageSize
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    _showMyRecentlyPurchasedGoods:function(settings){ //★★顯示[最近購買]商品★★
      var _settings=momoj.extend({goods:[],totalPage:1,nowPage:1,count:0},settings);
      momoj._notice({notice:'709'}); // notice709 → 購物車頁：「我最近購買」的浮層
      momoj('#notice709 table tbody').jqotesub(tpl['notice709Row'],settings.goods);
     
      momoj._showPageArea({totalRows:_settings.count,curPage:_settings.nowPage,pageAct:'Func',funcName:'momoj._getAndShowMyRecentlyPurchasedGoods({nowPage:'+_settings.nowPage+', pageSize:5})',rowsPerPage:5});
      momoj._renewMyRecentlyRecordCount({'count':_settings.count}); //★★更新[我最近購買]數量★★
      momoj('#popWishListCount').text(momoj('#wishListCount').text());
      momoj('#popRecentlyRecordCount').text(momoj('#recentlyRecordCount').text());

      momoj('.middle').addClass('selected');
      momoj('.left').removeClass('selected');
      momoj(".floatingLayerBox .prdListArea .recentBuyPrdList").show();
      momoj('.floatingLayerBox').trigger('click');//浮層塞了內容後高度變了，所以trigger click重新計算浮層高度
    },
    _addGoodsToWishListOrRemoveGoodsFromWishList:function(settings){ //★★將商品加入追蹤清單或將商品從追蹤清單移除★★
      var _settings=momoj.extend({
        actionType:'', // 0:加入 1:移除
        goodsCode:'',
        wishNo:''
      },settings);
      var url=momoj.cartApiDomain + '/api/shoppingcart/trackandhistory/addOrDelWishItem'; // [API-213:將商品加入或移除追蹤]
      var json = JSON.stringify({
        "host":_host,
        "data":{
            "actionType": _settings.actionType,
            "goodsCode": _settings.goodsCode,
            "wishNo": _settings.wishNo
        }
      });
      return momoj._callShoppingCartApi({'url':url,'json':json});
    },
    _getMyCarrier:function(settings){ //★★取得手機/自然人憑證常用載具★★
      var _settings=momoj.extend({
        carrierType:''
      },settings);
      var url = momoj.cartApiDomain + '/api/shoppingcart/payinfo/getReceiptCarriers'; //[API-310:取得手機/自然人憑證常用載具]
      var json = JSON.stringify({
        "data":{
           "carrierType":_settings.carrierType //載具類型 3J0002(手機條碼載具) CQ0001(自然人憑證載具)
        },
        "host":_host
      });
      var rtn = momoj._callShoppingCartApi({'url':url,'json':json});
      var _isOK=false;//針對回傳參數又有resultCode又有rtnChar的特別處理!!!!!
      if(rtn.apiSuccess){
        var _rtnChar =(typeof rtn.rtn.rtnData.rtnChar!='undefined')?rtn.rtn.rtnData.rtnChar:'-1';//處理結果 1:成功 0:失敗
        _isOK=(_rtnChar=='1')?true:false;
        rtn.apiSuccess = _isOK;
        rtn.apiFail = !_isOK;
      }
      return rtn;
    },
    _deleteCarrier:function(settings){ //★★刪除手機/自然人憑證常用載具★★
      var _settings=momoj.extend({
        carrierType:'',
        carrierSeq:''
      },settings);
      var url = momoj.cartApiDomain + '/api/shoppingcart/payinfo/delReceiptCarrier'; //[API-311:刪除手機/自然人憑證常用載具]
      var json = JSON.stringify({
        "data":{
           "carrierType":_settings.carrierType, //載具類型 3J0002(手機條碼載具) CQ0001(自然人憑證載具)
           "carrierSeq":_settings.carrierSeq
        },
        "host":_host
      });
      var rtn = momoj._callShoppingCartApi({'url':url,'json':json});
      var _isOK=false;//針對回傳參數又有resultCode又有rtnChar的特別處理!!!!!
      if(rtn.apiSuccess){
        var _rtnChar =(typeof rtn.rtn.rtnData.rtnChar!='undefined')?rtn.rtn.rtnData.rtnChar:'-1';//刪除結果 1:成功 0:失敗
        _isOK=(_rtnChar=='1')?true:false;
        rtn.apiSuccess = _isOK;
        rtn.apiFail = !_isOK;
      }
      return rtn;
    },
    _deleteReceiver:function(settings){ //★★刪除最近收件地址★★
      var _settings=momoj.extend({
        receiverSeq:''
      },settings);
      var url = momoj.cartApiDomain + '/api/shoppingcart/payinfo/delRecentReceiverInfo'; //[API-306:刪除最近收件地址]
      var json = JSON.stringify({
        "data":{
           "receiverSeq":_settings.receiverSeq 
        },
        "host":_host
      });
      var rtn = momoj._callShoppingCartApi({'url':url,'json':json});
      var _isOK=false;//針對回傳參數又有resultCode又有rtnChar的特別處理!!!!!
      if(rtn.apiSuccess){
        var _rtnChar =(typeof rtn.rtn.rtnData.rtnChar!='undefined')?rtn.rtn.rtnData.rtnChar:'-1';//處理結果 1:刪除成功 0:無此收件人地址序號或此序號已刪除
        _isOK=(_rtnChar=='1')?true:false;
        rtn.apiSuccess = _isOK;
        rtn.apiFail = !_isOK;
      }
      return rtn;
    },
    _getAllotBank:function(settings){ //★★取得各分期的銀行列表★★
      var _settings=momoj.extend({
        interest:'', // 是否為有息分期 0(否) 1(是)
        month:'',
        receiptFlag:''
      },settings);
      var url = momoj.cartApiDomain + '/api/shoppingcart/payinfo/getPeriodBanks'; //[API-301:取得各分期的銀行列表]
      var json = JSON.stringify({
        "data":{
           "interest":_settings.interest,
           "month":_settings.month,
           "receiptFlag":_settings.receiptFlag
        },
        "host":_host
      });
      var rtn = momoj._callShoppingCartApi({'url':url,'json':json});
      var _isOK=false;//針對回傳參數又有resultCode又有rtnChar的特別處理!!!!!
      if(rtn.apiSuccess){
        var _rtnChar =(typeof rtn.rtn.rtnData.rtnChar!='undefined')?rtn.rtn.rtnData.rtnChar:'-1';//處理結果 1:成功 0:失敗
        _isOK=(_rtnChar=='1')?true:false;
        rtn.apiSuccess = _isOK;
        rtn.apiFail = !_isOK;
      }
      return rtn;
    },
    _showAllotBank:function(settings){ //★★顯示可分期銀行浮層★★
      var _settings=momoj.extend({},settings);
      if(_settings.apiSuccess){
        var _banks =(typeof _settings.rtn.rtnData.banks=='object')?_settings.rtn.rtnData.banks:new Array();
        momoj._notice({notice:716,dynPos:true,tplData:{len:_banks.length}});
        var banks=new Array();
        momoj.each(_banks,function(idx,elm){
          var _comma='';
          if(idx>0){
            _comma='、';
          }
          banks.push({comma:_comma,bank:elm});
        });
        momoj('#showBankList').jqoteapp('<%=this.comma%><%=this.bank%>',banks);
        momoj('.floatingLayerBox').trigger('click');//浮層塞了內容後高度變了，所以trigger click重新計算浮層高度
      } else {
        alert('查詢分期清單失敗！');
      } 
    },
    _showPageArea:function(settings){
      var _settings=momoj.extend({
        pageObj:momoj('.pageArea'),   // 換頁 container
        totalRows:0,              // 資料總筆數
        rowsPerPage:0,            // 每頁筆數
        curPage:1,                // 目前頁碼
        totalPage:0,              // 總頁數
        linePage:10,              // 一列顯示頁數
        pageAct:'Func',           // 換頁方式
        funcName:'',              // 如果是 pageAct==Func 的話,需傳入 funcName 來執行
        pageURL:'',               // 換頁網址
        pagePara:'pg'             // URL頁數參數名稱
      }, settings);
      _settings.totalPage=parseInt(_settings.totalRows/_settings.rowsPerPage,10);
      if(_settings.totalRows > _settings.totalPage*_settings.rowsPerPage){
        _settings.totalPage+=1;
      }

      _settings.pageObj.find('dl').jqoteapp(template.pageTotal,{curPage:_settings.curPage,totalPage:_settings.totalPage});
      var _mmod=((_settings.curPage%_settings.linePage)==0)?1:0;
      var _amod=((_settings.curPage%_settings.linePage)==0)?0:1;
      var _startPageNo=(parseInt(_settings.curPage/_settings.linePage,10)-_mmod)*_settings.linePage+1;
      var _lastPageNo=(parseInt(_settings.curPage/_settings.linePage,10)+_amod)*_settings.linePage;
      var _lastPage=false;
      var _fstPage=false;
      if(_settings.curPage>_settings.linePage){
        _fstPage=true;
      }
      if(parseInt(_lastPageNo/_settings.linePage,10)<parseInt(_settings.totalPage/_settings.linePage,10)){
        _lastPage=true;
      }
      if (_lastPageNo>_settings.totalPage){
        _lastPageNo=_settings.totalPage;
      }
      
      var _pageAry=new Array();
      for(var i=_startPageNo; i<=_lastPageNo; i++){
        _pageAry.push({
          curPage:_settings.curPage,
          pageNo:i,
          linePage:_settings.linePage,
          lastPage:_lastPage,
          fstPage:_fstPage
        });
      }
      _settings.pageObj.find('ul').jqoteapp(template.pageList,_pageAry);

      if(!_settings.pageObj.data('bindClick')=='1'){
        _settings.pageObj.data('bindClick','1');
        _settings.pageObj.on('click','a',function(e){
          var _self=momoj(this);
          var _go=_self.attr('go');
          if(_settings.pageAct=='Func'){
            switch (_go) {
              case 'up':
                if(_settings.curPage>1) _settings.curPage--;
                break;
              case 'down':
                if(_settings.totalPage>_settings.curPage)_settings.curPage++;
                break;
              case 'fix':
                _settings.curPage=_self.attr('pageno');
                break;
              case 'fst':
                _settings.curPage=1;
                break;
              case 'lst':
                if((_settings.totalPage%_settings.linePage)==0){
                  _settings.curPage=(parseInt(_settings.totalPage/_settings.linePage,10)-1)*_settings.linePage+1;
                }else{
                  _settings.curPage=(parseInt(_settings.totalPage/_settings.linePage,10))*_settings.linePage+1;
                }
                break;
              case 'up10':
                if((_settings.curPage%_settings.linePage)==0){
                  _settings.curPage=(parseInt(_settings.curPage/_settings.linePage,10)-2)*_settings.linePage+1;
                }else{
                  _settings.curPage=(parseInt(_settings.curPage/_settings.linePage,10)-1)*_settings.linePage+1;
                }
                break;
              case 'down10':
                if((_settings.curPage%_settings.linePage)==0){
                  _settings.curPage=(parseInt(_settings.curPage/_settings.linePage,10))*_settings.linePage+1;
                }else{
                  _settings.curPage=(parseInt(_settings.curPage/_settings.linePage,10)+1)*_settings.linePage+1;
                }
                break;
            }
            var _pa=new Array();
            if(_settings.funcName.match(/(.*)\{(.*)\}(.*)/)){
              _pa=_settings.funcName.match(/(.*)\{(.*)\}(.*)/);
            }

            _pa[2]='{'+_pa[2]+', newPage:'+_settings.curPage+'}';
            eval(_pa[1]+_pa[2]+_pa[3]);//{nowPage:2, pageSize:5, newPage:2} 當目前頁數(nowPage)等於點擊頁籤要換去的頁數(newPage)時，直接return
          }
        });
      }
      momoj('.floatingLayerBox').trigger('click');//浮層塞了內容後高度變了，所以trigger click重新計算浮層高度
    },
    addEcmGiftToCart:function(settings){ //★★將ECM贈品N選n加入購物車★★
      var _settings=momoj.extend({
        cartName:isOneCartCheckOut(cart_name),
        promoNo:'',
        ecmGift:''
      },settings);
      if(_settings.promoNo=='' || _settings.ecmGift==''){
        return '';
      }
      var url = momoj.cartApiDomain + '/api/shoppingcart/modify/addEcmGiftToCart'; //210 將ECM贈品N選n加入購物車
      var json = JSON.stringify({
        "host":"WEB",
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    addOrderAddGoItem:function(settings){ //★★將ECM訂單加購品加入購物車★★
      var _settings=momoj.extend({
        cartName:isOneCartCheckOut(cart_name),
        goodsCode:'',
        goodsdtCode:'',
        promoNo:''
      },settings);
      if(_settings.goodsCode=='' || _settings.goodsDtCode=='' ){
         return;
      }
      var url = momoj.cartApiDomain + '/api/shoppingcart/modify/addOrderAddGoItem'; //209 將ECM訂單加購品加入購物車
      var json = JSON.stringify({
        "host":"WEB",
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    switchShopCart:function(settings){ //★★是否轉跳新購物車★★
      //var url = shoppingCartApiDomain + '/api/shoppingcart/query/switchShopCart?timestamp='+ new Date().getTime(); // 229 是否轉跳新購物車  加時戳避免cache
      //var json = JSON.stringify({
      //  "host": (typeof settings == "undefined" || typeof settings.host == "undefined" ? "WEB" : settings.host)
      //});
      //return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
      return {"resultCode":"1","resultMessage":"ok","rtnData":"1"};
    },
    _askNewCartSwitch : function(settings){ 
      return momoj.switchShopCart({
        "host" : settings.host,
      });
    },
    addGoods:function(settings){ //★★加入購物車★★
      var _settings=momoj.extend({
        goShopCartYn:'0',
        goods:[],
        webCategoryCode:'',
        srcType:''
      },settings);
      if(!_settings.goods || _settings.goods.length == 0){
         return;
      }
      var url = shoppingCartApiDomain + '/api/shoppingcart/modify/addGoods'; //100 加入購物車
      var json = JSON.stringify({
        "host":"WEB",
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    removeGoods:function(settings){ //★★移除商品★★
      var _settings=momoj.extend({
        "cartName":"",
        "productKey":""
      },settings);
      if(!_settings.productKey || _settings.productKey.length == 0){
         return;
      }
      var url = shoppingCartApiDomain + '/api/shoppingcart/modify/removeGoods'; //211 移除商品
      var json = JSON.stringify({
        "host":"WEB",
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    removeCart:function(settings){ //★★將購物車內所有商品移除★★
      var _settings=momoj.extend({
        "cartName":""
      },settings);
      if(!_settings.cartName || _settings.cartName.length == 0){
         return;
      }
      var url = shoppingCartApiDomain + '/api/shoppingcart/modify/removeCart'; //212 將購物車內所有商品移除
      var json = JSON.stringify({
        "host":_host,
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    changeGoodsDtCode:function(settings){ //★★更改規格★★
      var _settings=momoj.extend({
        "cartName":"",
        "goodsdtCode":"",
        "productKey":""
      },settings);
      if(!_settings.goodsdtCode || _settings.goodsdtCode.length == 0){
         return;
      }
      var url = momoj.cartApiDomain + '/api/shoppingcart/modify/changeGoodsDtCode'; //208 購物車內商品更改規格
      var json = JSON.stringify({
        "host":"WEB",
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    changeCart:function(settings){ //★★更改配送方式★★
      var _settings=momoj.extend({
        "cartName":"",
        "targetCartName":"",
        "productKey":""
      },settings);
      if(!_settings.targetCartName || _settings.targetCartName.length == 0){
         return;
      }
      var url = shoppingCartApiDomain + '/api/shoppingcart/modify/changeCart'; //204 更改配送方式
      var json = JSON.stringify({
        "host":"WEB",
        "data":_settings
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    getEachCartPICount:function(settings){ //★★取得各購物車內商品總數★★
      var url = CommonValue.cart.newCartCloudUrl + '/api/shoppingcart/query/getEachCartPICount'; //201 取得各購物車內商品總數
      var json = JSON.stringify({
        "host":_host
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    getTotalPICount:function(settings){ //★★取得所有購物車內的商品總數量★★
      if(typeof shoppingCartApiDomain == 'undefined' || shoppingCartApiDomain == '' ){
        let currentName = window.location.hostname;
        let changeDomain = currentName.replace(/m\.momoshop\.com\.tw/g, "cart.momoshop.com.tw")
                                .replace(/muat([1-9]|1[0-9]).momoshop.com.tw/g, "cartuat$1.momoshop.com.tw")
                                .replace(/mqc([1-9]|1[0-9]).momoshop.com.tw/g, "cartqc$1.momoshop.com.tw");
        shoppingCartApiDomain = "https://"+changeDomain;
      }
      var url = CommonValue.cart.newCartCloudUrl + '/api/shoppingcart/query/getTotalPICount'; //202 取得所有購物車內的商品總數量
      var json = JSON.stringify({
        "host":(typeof settings == "undefined" || typeof settings.host == "undefined" ? "WEB" : settings.host)
      });
      return rtn=momoj._callShoppingCartApi({'url':url,'json':json});
    },
    initAsiaYoVO:function(settings) { //初始化AsiaYo物件
      if(!settings){
         return;
      }
      var asiaYoVO = {};
      asiaYoVO.cart = {};
      asiaYoVO.order = {};
      asiaYoVO.cart.goodsName = settings.goodsName;
      asiaYoVO.order.photo_url = settings.photo_url;
      asiaYoVO.cart.checkInDate = settings.checkInDate;
      asiaYoVO.cart.checkOutDate = settings.checkOutDate;
      asiaYoVO.originOrderNo = settings.originOrderNo;
      asiaYoVO.originPrice = settings.originPrice;
      asiaYoVO.order.room_name = settings.room_name;
      asiaYoVO.order.nights = settings.nights;
      asiaYoVO.order.rooms = settings.rooms;
      asiaYoVO.cart.bufferTime = settings.bufferTime;
      asiaYoVO.cart.totalPrice = settings.totalPrice;
      asiaYoVO.cart.entp_comm_rate = settings.entp_comm_rate;
      return asiaYoVO;
    },
    initShopCartVo : function() {// //初始化購物車物件
      return JSON
          .parse('{"data": {"goShopCartYn": "","goods": []},"host": "MOBILE"}');
    },
    addItemIntoShoppingcart : function(json) {// 小網將商品主頁加入購物車
      var url = shoppingCartApiDomain + '/api/shoppingcart/modify/addGoods'; // 商品加入購物車
      return momoj._callShoppingCartApi({
        'url' : url,
        'json' : json
      });
    },
    initShopCartAYFeesgoodsVo:function() { //初始化AsiaYo手續費購物車物件
      return JSON
        .parse('{"addtionalGoods": [],"addtionalGoodsCount": "","apiFlag": "","applimitBuyYn": "","applimitBuyfsCode": "","cn": "", '
            + '"defDely": "","goodsCode": "9060403","goodsCount": "1","goodsdtCode": "001","limitBuy4MemberYn": "","limitBuyQty": "","negativeProfit": "","nsGift": [],"productId": "","productSeq": "", '
            + '"promoNo": "","recoverYn": "","savegetAmt": "","setGoods": [],"useTwnTraCardYn": "","wishGb": "","wishNo": "","work": "SHOPCART"}');
    }
  });   
})(momoj);
//暫時的，舊車對應到新車
var oneCartCheckout = ["normal10","ec10","entp03","entp04","ecfreeze","eticket10","ecseq10","normalfreeze","eclargemach"];
function isOneCartCheckOut(cartName){
var isOneCart = cartName;
momoj.each(oneCartCheckout, function(idx, val){
 if(cartName == oneCartCheckout[idx]){
   isOneCart = "newNormal";
 }
});
return isOneCart;
}
