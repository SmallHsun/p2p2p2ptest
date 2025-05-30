var _bgwPoc = new Object;
var _bgwPocBlr = new Object;
var _bgwPocGlr = new Object;

_bgwPoc.pagePara=momoj().HashTables();
_bgwPoc.pagePara.add('/main/Main.jsp','fM("pid")');
_bgwPoc.pagePara.add('/category/LgrpCategory.jsp','fL("pid,ch")');
_bgwPoc.pagePara.add('/category/DgrpCategory.jsp','fD("pid,ch")');
_bgwPoc.pagePara.add('/goods/GoodsDetail.jsp','fG("iid,ch")');
_bgwPoc.pagePara.add('/servlet/NewCampaignServlet','fT("carts")');
_bgwPoc.pagePara.add('/order/OrderEnd.jsp','fO("carts,bitem,order")');
_bgwPoc.pagePara.add('/search/SearchEngine.jsp','fS("pid,kw,sitem")');
_bgwPoc.pagePara.add('/ajax/SmartService.jsp','xiaoi("pid")'); //小i

_bgwPoc.mode="1"; // 1:bgw, 2:self
_bgwPoc.func="";
_bgwPoc.topk = 50; //您可能會喜歡商品數+大家都在買
_bgwPoc.topk1 = 30; //您可能會喜歡商品數
_bgwPoc.topk2 = 30; //大家都在買(別人可能逛過)
_bgwPoc.topk3 = 40; //大家都在買(別人可能逛過)
_bgwPoc.tabNumYouLike = 2; //您可能會喜歡，tab數。
_bgwPoc.displayYouLikeTopk = _bgwPoc.tabNumYouLike * 12; //首頁您可能會喜歡顯示數
_bgwPoc.displayEveryBodyBuyTopk = 30; //首頁大家都在買顯示數
_bgwPoc.displayGoodsOfWhoBuy = 40; //商品頁(熱門推薦/熱銷排行)
_bgwPoc.displayGoodsOfYouMayNeed = 12; //您可能也需要
_bgwPoc.displayGoodsOfHistory = 12; //歷程推薦商品及您專屬推薦商品
_bgwPoc.displayGoodsOfXiaoI = 3; //數位客服
_bgwPoc.displayGoodsOfSearch = 9; //搜尋
_bgwPoc.ulPos={fM:["34","-531","-1095"],fD:["0","-765","-1530"],fG:["0","-765","-1530"]};
_bgwPoc.moveCnt=0;
_bgwPoc.backupGoods = new Array();
_bgwPoc.backupCnt = 0;
_bgwPoc.moreDataNum = 0;//多查點資料，若前台無對應資料可補充。

//18禁商品和超市快配商品和momo專案底下的新分類不顯示熱銷排行版位
_bgwPoc.canCallApi=function(){
  var canCallYn = false;
  if(bookInfo.isBookKind || bookInfo.isEBookKind){
    canCallYn = true;
  }else if(!window.isFiveHour && !isMomoProjectCategory){
    canCallYn = true;
  }
  return canCallYn;
};
_bgwPoc.fM=function(p){
  // 首頁 你可能會喜歡 區塊
  homePageYouMaybeLike();
  // 首頁 大家都在買 區塊
  homePageEveryBodyBuy();
  // 首頁 銀行好康
  const banDiv = momoj('#bt_0_257_01 ul');
  if (banDiv.length > 0) {
    getHtmlContent('bt_7_307_01');
  }
  // 首頁 好物開箱
  const goodth = momoj('#bt_0_261_01 ul');
  if (goodth.length > 0) {
    getHtmlContent('bt_7_207_01');
  }
};
_bgwPoc.xiaoi=function(p){
  _bgwPoc.postData.pid="xiaoi";
  _bgwPoc.go();
};
_bgwPoc.fL=function(p){
  var l_code=get_form(_bgwPoc.url,"l_code");
  if(l_code.match(/99900000$/)){
    _bgwPoc.postData.pid="cat1";
    l_code=l_code.replace('99900000','00000000');
  }else{
    _bgwPoc.postData.pid="cat2";
  }
  _bgwPoc.postData.ch=l_code;
  if(_bgwPoc.postData.ch!=''){
    if(_bgwPoc.postData.ch.match(/\#/)){
      _bgwPoc.postData.ch=_bgwPoc.postData.ch.split("#")[0];
    }
    _bgwPoc.go();
  }
};
_bgwPoc.fD=function(p){
  if(momoj('#promo_id').length>0){
    _bgwPoc.postData.pid="select";
    _bgwPoc.postData.ch=momoj('#d_code').val();
  }else{
    _bgwPoc.postData.pid="cat3";
    _bgwPoc.postData.ch=get_form(_bgwPoc.url,"d_code");
  }
  if(_bgwPoc.postData.ch!=''){
    if(_bgwPoc.postData.ch.match(/\#/)){
      _bgwPoc.postData.ch=_bgwPoc.postData.ch.split("#")[0];
    }
    _bgwPoc.go();
  }
};
_bgwPoc.fG=function(p){
  _bgwPoc.postData.iid=get_form(_bgwPoc.url,"i_code");
  var _d_code_li=momoj('#bt_2_layout_NAV ul li[cateCode^=DC]');
  if (_d_code_li.length > 0){
    _bgwPoc.postData.ch=momoj(_d_code_li[0]).attr('cateCode').replace('DC','');
  }
  if(_bgwPoc.postData.iid!=''){
    if(_bgwPoc.postData.iid.match(/\#/)){
      _bgwPoc.postData.iid=_bgwPoc.postData.iid.split("#")[0];
    }
    if(!_bgwPoc.postData.iid.match(/\D/)){
      _bgwPoc.go();
    }
  }
};
_bgwPoc.fT=function(p){
  var _prodDtList=momoj('body').data('cartPrdDtList');
  var _cartGlist= new Array();
  if(typeof _prodDtList !='undefined' && _prodDtList.length>0){
    for(var i=0;i<_prodDtList.length;i++){
      var _prd=_prodDtList[i];
      if(_prd.goodsKind=='M' || _prd.goodsKind=='R' || _prd.goodsKind=='GR' || _prd.goodsKind=='O'){
        //主商品，紅綠配商品，任選商品，才丟出去,goodsCode,goodsLastAmt,1
        var _promoNoSeq='';
        if(_prd.promoNo!='' && _prd.promoSeq!=''){
          _promoNoSeq=_prd.promoNo+_prd.promoSeq;
          var _grp=-1;
          for(var j=0;j<_cartGlist.length;j++){
            if(_cartGlist[j].grpId == _promoNoSeq){
              _grp=j;
              break;
            }
          }
          if(_grp==-1){
            _cartGlist.push({grpId:_promoNoSeq,gd:"",price:0});
            _grp=_cartGlist.length-1;
          }
          _cartGlist[_grp].gd=_cartGlist[j].gd+_prd.goodsCode+",1,";
          _cartGlist[_grp].price=_cartGlist[j].price/1+_prd.goodsPrice/1;

        }else{
          _cartGlist.push({grpId:_prd.goodsCode,gd:"",price:_prd.goodsPrice});
        }
      }
    }
    var _carts='';
    var _gd='';
    for(var j=0;j<_cartGlist.length;j++){
      _carts=_carts+_cartGlist[j].grpId+","+_cartGlist[j].price+",1,";
      if(_cartGlist[j].gd!=''){
        _cartGlist[j].gd=_cartGlist[j].gd.replace(/,$/,'');
        _gd=_gd+_cartGlist[j].grpId+","+_cartGlist[j].gd+"|";
      }
    }

    _bgwPoc.postData.carts=_carts.replace(/,$/,'');
    _bgwPoc.postData.gd=_gd.replace(/\|$/,'');
    _bgwPoc.go();
  }
};
_bgwPoc.fO=function(p){
  _bgwPoc.postData.pid="buy";
  _bgwPoc.postData.order=momoj('.OrderNo').html();
  _bgwPoc.postData.cc_session=getMwaSessionInfo('_mwa_uniSessionInfo');  //momoj().cookie('ccsession')
  _bgwPoc.postData.cc_guid=getMwaSessionInfo('_mwa_uniVisitorInfo');  //momoj().cookie('ccguid')

  var _cartGlist= new Array();
  var _prodDtList=dataU;
  if(typeof _prodDtList !='undefined' && _prodDtList.length>0){
    for(var i=0;i<_prodDtList.length;i++){
      var _prd=_prodDtList[i];
      if(_prd.goodsKind=='M' || _prd.goodsKind=='R' || _prd.goodsKind=='GR' || _prd.goodsKind=='O'){
        //主商品，紅綠配商品，任選商品，才丟出去,goodsCode,goodsLastAmt,1
        var _promoNoSeq='';
        if(_prd.promoId!='' && _prd.promoSeq!=''){
          _promoNoSeq=_prd.promoId+_prd.promoSeq;
          var _grp=-1;
          for(var j=0;j<_cartGlist.length;j++){
            if(_cartGlist[j].grpId == _promoNoSeq){
              _grp=j;
              break;
            }
          }
          if(_grp==-1){
            _cartGlist.push({grpId:_promoNoSeq,gd:"",price:0});
            _grp=_cartGlist.length-1;
          }
          _cartGlist[_grp].gd=_cartGlist[j].gd+_prd.goodsCode+",1,";
          _cartGlist[_grp].price=_cartGlist[j].price/1+_prd.goodsPrice/1;

        }else{
          _cartGlist.push({grpId:_prd.goodsCode,gd:"",price:_prd.goodsPrice});
        }
      }
    }
    var _carts='';
    var _gd='';
    for(var j=0;j<_cartGlist.length;j++){
      _carts=_carts+_cartGlist[j].grpId+","+_cartGlist[j].price+",1,";
      if(_cartGlist[j].gd!=''){
        _cartGlist[j].gd=_cartGlist[j].gd.replace(/,$/,'');
        _gd=_gd+_cartGlist[j].grpId+","+_cartGlist[j].gd+"|";
      }
    }
    _bgwPoc.postData.bitem=_carts.replace(/,$/,'');
    _bgwPoc.postData.gd=_gd.replace(/\|$/,'');
    if(_bgwPoc.postData.order!=''){
      if(_bgwPoc.postData.order.match(/tel/)){
        try{
          _bgwPoc.postData.order=_bgwPoc.postData.order.match(/(.*)(tel)(.*)>(.*)<(.*)/)[4];
        }catch(err){
        }
      }
      _bgwPoc.go();
    }
  }

};
_bgwPoc.fS=function(p){
  _bgwPoc.postData.pid="search";
  _bgwPoc.postData.kw=momoj('#research_keyword').text();
  var _prdList=momoj('body').data('kwResult');
  if(typeof _prdList !='undefined' && _prdList.length>0){
    var _sitem="";
    for(var i=0;i<_prdList.length;i++){
      var _prd=_prdList[i];
      _sitem=_sitem+_prd.GOODS_CODE+",";
    }
    _bgwPoc.postData.sitem=_sitem.replace(/,$/,"");
  }
  _bgwPoc.go();
};
_bgwPoc.doPost=function(){
  var _mode=3;
  _bgwPoc.mode=_mode;
  _bgwPoc.postData={"mid":57,"uid":"",mode:_bgwPoc.mode};

  var _user=momoj().cookie("ccmedia");

  if(!(_user =='null' || _user ==null)){
    _user=_user.split('_/')[0];
    _user=_user.replace('"','');
    _bgwPoc.postData.uid=_user;
  }
  //取出頁面的網址
  _bgwPoc.url=window.location.href;
  try{
    _bgwPoc.script=_bgwPoc.url.split('?')[0];
    _bgwPoc.script="/"+_bgwPoc.script.split('/')[3]+"/"+_bgwPoc.script.split('/')[4];
  }catch(err){

  }
  if(typeof _bgwPoc.script=='string'
     && _bgwPoc.pagePara.get(_bgwPoc.script) !='undefined'){
    try{
      _bgwPoc.func=_bgwPoc.pagePara.get(_bgwPoc.script).split('(')[0];
      eval('_bgwPoc.'+_bgwPoc.pagePara.get(_bgwPoc.script));
    }catch(err){

    }
  }

  if(_bgwPoc.mode==3){
    _bgwPoc.postData.layout="none";
    _bgwPoc.postData.success="";
  }else if(_bgwPoc.mode==1){
    if(_bgwPoc.func=='fM' || _bgwPoc.func=='fD' || _bgwPoc.func=='fG'){
      _bgwPoc.postData.layout="js";
      _bgwPoc.postData.success=_bgwPoc.showBgw;
    } else {
      _bgwPoc.postData.layout="none";
      _bgwPoc.postData.success="";
    }
  }else if(_bgwPoc.mode==2){
    _bgwPoc.postData.layout="none";
    _bgwPoc.postData.success="";
  }
};

_bgwPoc.go=function(){
  if(_bgwPoc.mode==3){
    if(_bgwPoc.func=='fT' || _bgwPoc.func=='fO'){
      var _web=momoj().cookie('JSESSIONID');
      if(!(_web =='null' || _web ==null)){
        _web=_web.substring(_web.length-2);
      }
      var _itriData={
        web:_web,
        cc_session:getMwaSessionInfo('_mwa_uniSessionInfo'),
        cc_guid:getMwaSessionInfo('_mwa_uniVisitorInfo'),
        gd:_bgwPoc.postData.gd,
        uid:_bgwPoc.postData.uid
      };
      var _url='';
      if(_bgwPoc.func=='fT'){
        _itriData.carts=_bgwPoc.postData.carts;
        _url='LogShoppingCar';
      }else if(_bgwPoc.func=='fO'){
        _itriData.bitem=_bgwPoc.postData.bitem;
        _itriData.order=_bgwPoc.postData.order;
        _url='LogOrder';
      }
      try{
        momoj.ajax({
          url:'/itri/api/log/'+_url,
          type:'GET',
          data:{object:JSON.stringify(_itriData)},
          dataType:'json'
        });
      }catch(err){
        //nothing
      }
    }
  }

  if(_bgwPoc.mode==2 || _bgwPoc.mode==3){
    _bgwPoc.showBgw();
  }
};

_bgwPoc.showBgw=function(){
  if(!(_bgwPoc.func == 'fM' || _bgwPoc.func == 'fD' 
        || _bgwPoc.func == 'fG' || _bgwPoc.func == 'xiaoi'
        || _bgwPoc.func == 'fL' || _bgwPoc.func == 'searchShop')) {
    return;
  }

  var _htmlCss = new Array();
  var _p1 = new Array();
  var _p2 = new Array();  //add by Jinni 2014.12.16
  var _p3 = new Array();
  var _block = 'bgw';
  var goodsNum1;
  var goodsNum2;
  var goodsNum3;

  if (_bgwPoc.func == 'fD' || _bgwPoc.func == 'fL') {
    //小分類頁css
    _htmlCss=['<style>',
            '#recGoods .TabMenu {height:28px; position:absolute; top:0px; right:0px}',
            '#recGoods .TabMenu .tabMenu_number {display:inline-block; margin:0px; padding:0px; height:28px; list-style:none}',
            '#recGoods .TabMenu .tabMenu_number li {margin:0px; padding:0px; float:left; width:35px; text-align:center;}',
            '#recGoods .TabMenu .tabMenu_number li a {display:inline-block; margin:0px; padding:0px; width:35px; font:15px/28px Helvetica; color:#585858;',
            'cursor:pointer; floatt:left}',
            '#recGoods .TabMenu .tabMenu_number li a b {display:inline-block; margin:9px 0px; padding:0px; width:1px; height:10px; background-color:#cccccc; float:left}',
            '#recGoods .TabMenu .tabMenu_number li:first-child a b {display:none}',
            '#recGoods .TabMenu .tabMenu_number li.selected a {height:28px; background:#3e7ff5; color:#ffffff}',
            '#recGoods .TabMenu .tabMenu_number li a:hover {height:28px; background:#3e7ff5; color:#ffffff}',
            '#recGoods .TabContent .TabContentD {display:none; width:1000px; height:310px}',
            '#recGoods .TabContent .selected {display:block;}',
            '#recGoods .TabContent .TabContentD ul {margin:0px; padding:0px; list-style:none; display:inline-block}',
            '#recGoods .TabContent .TabContentD ul li {float:left; padding:20px 15px; width:220px; height:270px; text-align:center; position: relative}',
            '#recGoods .TabContent .TabContentD ul li a {display:block; padding:0px 10px; width:200px; height:auto;}',
            '#recGoods .TabContent .TabContentD ul li a img.goodsImg {display:inline-block; border:0px; vertical-align:top; width:200px; height:200px;}',
            '#recGoods .TabContent .TabContentD ul li p {margin:5px 0px 0px 0px; padding:0px; width:200px}',
            '#recGoods .TabContent .TabContentD ul li p span {display:block; overflow:hidden; color:#696969}',
            '#recGoods .TabContent .TabContentD ul li p .prdName {height:32px; font:13px/16px Helvetica; margin:0px 0px 7px 0px}',
            '#recGoods .TabContent .TabContentD ul li p .prdPrice {font:bold 12px/26px Helvetica; height:26px; color:#d62672; text-align:center }',
            '#recGoods .TabContent .TabContentD ul li p .prdPrice b {display:inline-block; font:24px/26px Century Gothic; margin-left:2px; letter-spacing:-1px}',
            '#recGoods .TabContent .TabContentD ul li p .prdPrice img { display:inline-block; border:0px; margin-right:5px; width:auto; height:auto; position:relative; top:3px}',
            '#recGoods .TabContent .TabContentD ul li a:hover .prdName {color:#e40480}','</style>'];
  } else if(_bgwPoc.func === 'xiaoi') {
    _htmlCss = ['<style>',
            '#bt_xiaoi {float:left; width:320px; border:0px}',
            '#bt_xiaoi ul {margin:0px; padding:0px; list-style:none; display:block; z-index:1; }',
            '#bt_xiaoi ul li a {width:auto; height:auto; padding:0px}',
            '#bt_xiaoi ul li {margin:0px; padding:0px; list-style:none;border-left:0px}',
            '#bt_xiaoi ul li {float:left; width:100px; height: 122px; text-align:center; margin:10px 0px 10px 10px; padding:0px}',
            '#bt_xiaoi ul li a img {width:38px; vertical-align:top; position:inherit}',
            '#bt_xiaoi ul li a img:first-child {width:80px; vertical-align:middle}',
            '#bt_xiaoi ul li a span {display:block; width:100px;height:18px; font:13px/18px Helvetica; color:#696969; margin:0px; padding:0px; overflow:hidden}',
            '#bt_xiaoi ul li a b {font:16px/20px Century Gothic; color:#D62672; letter-spacing:-1px; display:inline-block;}',
            '#bt_xiaoi ul li:first-child {margin:10px 0px}',
            '</style>'
    ];
  }

  if(_bgwPoc.mode == 3) {
    _block = 'itri';

    try {
      var rec_pos1 = '';
      var rec_pos2 = '';
      var _gid = (typeof _bgwPoc.postData.iid =='undefined') ? '' : _bgwPoc.postData.iid;
      var _categ_code = (typeof _bgwPoc.postData.ch =='undefined') ? '' : _bgwPoc.postData.ch;

      var _itriData = {
          gid: _gid,
          uid: _bgwPoc.postData.uid,
          page_type: '',  //{1:portal, 2:category page, 3:goods page}
          rec_pos: '',
          device: 'pc',
          rec_type: '',//clickStream,AlsoView,Group
          b_categ_info: [{ "code":"bgoods_r18" }], //18禁黑名單
          token: 'NVHlz4elol',
          categ_code: _categ_code,
          topk: 0 //number of response goods code
      };

      //跟itri要求資料
      if(_bgwPoc.func == 'fM') {
        _bgwPoc.topk = _bgwPoc.topk1 + _bgwPoc.topk2;
        goodsNum1 = _bgwPoc.topk1;
        goodsNum2 = _bgwPoc.topk2;
        
        _itriData.rec_type= 'ClickStream';
        
        _itriData.topk = _bgwPoc.topk1;
        _itriData.rec_pos = 'p';
        rec_pos1 = _itriData.rec_pos;
        set_itriData_f_categ_info(_itriData);
        _p1 = getRankFromHermes(_itriData);//你可能會喜歡
        
        _itriData.topk = _bgwPoc.topk2;
        _itriData.rec_pos = 'p2';
        _itriData.momoSearchType = '2';
        rec_pos2 = _itriData.rec_pos;
        delete _itriData['f_categ_info'];
        _p2 = getRankFromHermes(_itriData);//大家都買過（別人也逛過）

      }else if(_bgwPoc.func == 'xiaoi') {
        _bgwPoc.topk = _bgwPoc.displayGoodsOfXiaoI;
        goodsNum1 = _bgwPoc.topk;
        
        _itriData.topk = _bgwPoc.topk + _bgwPoc.moreDataNum;
        _itriData.rec_pos = 'mocs';
        rec_pos1 = _itriData.rec_pos;
        _itriData.rec_type = 'ClickStream';
        _p1 = getRankFromHermes(_itriData);//數位客服 你可能會喜歡

      }else if(_bgwPoc.func == 'searchShop') {
        _bgwPoc.topk = _bgwPoc.displayGoodsOfSearch;
        goodsNum1 = _bgwPoc.topk;
        
        _itriData.topk = _bgwPoc.topk + _bgwPoc.moreDataNum;
        _itriData.rec_pos = 'sr';
        rec_pos1 = _itriData.rec_pos;
        _itriData.rec_type = 'ClickStream';
        _p1 = getRankFromHermes(_itriData);//搜尋 你可能會喜歡

      }
    } catch(err) {
    }

  }

  //對象
  var _bObj = null;
  if(_bgwPoc.func == 'fD') {//分類頁
    if (momoj('#prdlistArea').length == 1) {
      _bObj = momoj('#Dgrp_BodyBigTableBase .bt_2_layout_b1');
    }else if (momoj('#Dgrp_rightExtend').length > 0) {
      _bObj = momoj('#Dgrp_rightExtend');
    }else{
      _bObj = momoj('#Dgrp_LCatRightPBase');
    }

  } else if(_bgwPoc.func == 'fL') {//分類頁
    _bObj = momoj('#bt_2_layout_b1');

  } else if (_bgwPoc.func == 'fG') {//商品頁
    _bObj = momoj('#productForm .prdwarp');

  } else if(_bgwPoc.func == 'fM') {//首頁
    _bObj = momoj('#bt_0_272_01 .boxcontent ul');
    
  } else if(_bgwPoc.func == 'xiaoi') {//數位客服
    _bObj = momoj('#bt_xiaoi');

  } else if(_bgwPoc.func == 'searchShop') {//搜尋頁
    _bObj = momoj('#bt_0_layout_b268');

  }

  //備用資料
   if(_bgwPoc.func == 'fM') {
    if (_p1.length + _p2.length < goodsNum1 + goodsNum2) {
      _block = 'momo';
      _p1 = _bgwPoc.getBuyData();
      
      _p2 = new Array();
      momoj.each(_p1, function(index, element){
        _p2[index] = element;
      });
    }
    //你可能會喜歡
    var diliveryNump1 = Math.min(_p1.length - _p1.length%_bgwPoc.tabNumYouLike, _bgwPoc.displayYouLikeTopk);
    var tempArrayP1 = new Array();
    momoj.each(_p1, function(index, element){
      if(index < diliveryNump1){
        tempArrayP1[index] = element;
      }
    });
    _p1 = tempArrayP1;
    //大家都在買
    var diliveryNum2 = Math.min(_p2.length, _bgwPoc.displayEveryBodyBuyTopk);
    var tempArrayP2 = new Array();
    momoj.each(_p2, function(index, element){
      if(index < diliveryNum2){
        tempArrayP2[index] = element;
      }
    });
    _p2 = tempArrayP2;
    
    _bgwPoc.topk = _p1.length + _p2.length;
    goodsNum1 = _p1.length;
    goodsNum2 = _p2.length;

  } else if(_bgwPoc.func == 'xiaoi') {
    if (_p1.length < _bgwPoc.topk) {
      _block = 'momo';
      _p1 = _bgwPoc.getBuyData();
    }

  } else if(_bgwPoc.mode==1) {
    _p1 = window.scupioec.rec[window.scupioec.rec.length-1].data;

  } else if(_bgwPoc.mode==2) {
    _block = 'momo';
    _p1 = _bgwPoc.getBuyData();
    _bgwPoc.topk = _p1.length;
    goodsNum1 = _p1.length;

  }

   momoj.each(_p1, function(index, element){
    element.rec_pos = rec_pos1;
  });

   momoj.each(_p2, function(index, element){
    element.rec_pos = rec_pos2;
  });

  if(_bObj.length == 1){
    if(_bgwPoc.func == 'fM') {//首頁您可能會喜歡
      if(_p1.length + _p2.length >= goodsNum1 + goodsNum2) {
        //你可能會喜歡區塊
        insertGoodsToHtmlForMainPage(_bObj, _p1, _block, {type:1});
        
        //every Body Buy區塊
        var _ebObj = momoj('#bt_0_269_01 ul');
        insertGoodsToHtmlForMainPage(_ebObj, _p2, _block, {type:2});
        
        //你可能會喜歡的浮層
        var _bObjDiv = momoj('#bt_0_272_01 .boxcontent').after('<div id="bt_0_268_sub" style="display:none;"></div>');
        
        _bgwPoc.slideInit('bt_0_272_01 .boxcontent', 180, _bgwPoc.tabNumYouLike, Math.min(_p1.length, _bgwPoc.displayYouLikeTopk), 15, 'mlr');//_p1 的數量一定可以被 _bgwPoc.tabNumYouLike 整除
        momoj('#bt_0_269_01').showBtByArrow({showBtNum:5});
      }
      
    } else if(_bgwPoc.func == 'fG') {//fG 商品頁
      async function loadRecommandBlock(){
        await getGoodsHotRecommandBlock();//先顯示熱門推薦
        await getGoodsHotRankBlock();//再顯示熱門排行
      };
      loadRecommandBlock();
    } else if(_bgwPoc.func == 'fD' || _bgwPoc.func == 'fL') {//fD 小分類頁 or fL 大分類頁
        getCategoryRecommandBlock(_htmlCss);//傳入css字串
    } else if(_bgwPoc.func == 'xiaoi' || _bgwPoc.func == 'searchShop') {//數位客服 or 搜尋頁
      _p1.length >= goodsNum1 && _bgwPoc.process2(_bObj, _p1, _htmlCss, _block);
    }
  }

  var banDiv=momoj('#bt_0_257_01 ul');
  if(banDiv.length > 0){
    getHtmlContent('bt_7_307_01');//銀行好康
  }
  var goodth=momoj('#bt_0_261_01 ul');
  if(goodth.length > 0){
    getHtmlContent('bt_7_207_01');//好物開箱
  }
};

/*
 * 好物開箱,銀行好康
 * 取得靜態檔的html content
 */
function getHtmlContent(htmlCode){
  momoj.ajaxTool({
    async: true,
    data:{flag: 2033 ,htmlCode: htmlCode},
    ajaxSuccess:function(_rtnObj) {
      var htmlContent = _rtnObj.rtnData.result;
      if(htmlCode =='bt_7_307_01'){
        momoj('#bt_0_257_01 ul').wrap('<div class="boxcontentinner"></div>');
        var Obj=momoj('#bt_0_257_01 ul');
        Obj.append(htmlContent);
        _bgwPoc.slideInit('bt_0_257_01', 250, 4, 12, 6, 'blr');
      }else if(htmlCode =='bt_7_511_02'){
        momoj('#bt_0_261_01 ul').wrap('<div class="boxcontentinner"></div>');
        var Obj=momoj('#bt_0_261_01 ul');
        Obj.append(htmlContent);
        momoj('#bt_0_261_01 .playArea').addClass('openvideoBtn');
        momoj('#bt_0_261_01 .mobileDisplayVideo').addClass('videoUrl');
        momoj('#bt_0_261_01').ShowVideoFun();
        _bgwPoc.slideInit('bt_0_261_01', 240, 4, 8, 20,  'glr');

      }
    }
  });
}

//左右卷軸移動初始
_bgwPoc.slideInit=function(moveObj, liWidth, numberOfGoodsInSingleTab, topk, dist, slideNm){

  if(topk > numberOfGoodsInSingleTab) {
    _bObj=momoj('#'+moveObj+' ul');
    var num = momoj('#'+moveObj+' ul li').length;//總共有幾品
    var modnum = parseInt(num/numberOfGoodsInSingleTab);//一定要被numberOfGoodsInSingleTab整除，不然動畫會有點問題。
    //_bObj.parent().find("h3").css({"z-index":"2"});
    var _liWidth = liWidth+dist; //每一品li的寬度+間距
    _bObj.css({width:(_liWidth*num) + "px"});
    _bgwPoc.moveInit({
        moveObj: "#"+moveObj+" ul",
        movePx: (_liWidth*numberOfGoodsInSingleTab), //每一次移動的寬度 390
        minLeft: 0,
        minLeftPos:-(_liWidth*num) + "px", //-4875 --> -(195*25)
        maxLeft: -((_liWidth*num) - ((1 - ((num/numberOfGoodsInSingleTab) - modnum)) * (_liWidth*numberOfGoodsInSingleTab))),
        maxLeftPos:((1 - ((num/numberOfGoodsInSingleTab) - modnum))* (_liWidth*numberOfGoodsInSingleTab)) + "px",
        //(1-((25/2) - 12))*(195*2)) = 195
        name : slideNm
    });
    if(slideNm =='mlr'){
      setSliderMoveDirEvent(moveObj, slideNm, _bgwPoc.slider);
    }else if( slideNm =='blr'){
      setSliderMoveDirEventBlr(moveObj, slideNm, _bgwPoc.slider);
    }else if( slideNm =='glr'){
      setSliderMoveDirEventGlr(moveObj, slideNm, _bgwPoc.slider);
    }
  }else{
    momoj('#'+moveObj).undelegate('.'+slideNm, 'click');
  }
}

_bgwPoc.postRec=function(_block,_data){/* 2021.05 moapi API關閉，故刪除*/};
_bgwPoc.recLog=function(_self,e){/* 2021.05 moapi API關閉，故刪除*/};

_bgwPoc.getBuyData=function(){
  if (typeof _buyData == 'undefined') {
    momoj.ajax({
    url: '/ecm/js/whoBuyData.js?_=' + getTimeStampMinutesRange(2),
    type: 'GET',
    dataType: 'script',
    async: false,
    timeout: 3
    });
  }
  
  var _rtnData=new Array();
  try{
    if(_buyData && _buyData.length>5){
      var useLength = Math.min(_buyData.length,50);
      
      for(var i=0;i<useLength;i++){
        var _goodsCode=_bgwPoc.uni2stc(_buyData[i].goodsCode);
        var _goodsName=_bgwPoc.uni2stc(_buyData[i].prdNme);
        if(_goodsCode==''){
          continue;
        }
  
        _rtnData[i]={
          itemid:_goodsCode,
          goodsName:_goodsName,
          clickurl:'/goods/GoodsDetail.jsp?i_code='+_goodsCode,
          imgurl:getGoodsImgUrl(_goodsCode,'1','000'),
          title:_goodsName
        };
      }
    }
  }catch(e){
    //donothing
  }
  return _rtnData;
};

_bgwPoc.uni2stc=function(_unicode){
  if(typeof _unicode!='string') return '';
  var _str='';
  var _strA=_unicode.split(';');
  for(var i=0;i<_strA.length;i++){
    if(_strA[i].match(/^&#/)){
      var _uni=_strA[i].replace('&#','');
      try{
        _uni=String.fromCharCode(_uni);
      }catch(err){
        _uni='';
      }
      _str=_str+_uni;
    }
  }
  return _str;
};
_bgwPoc.commafy=function(num){
  num = num+"";
  try{
    var re=/(-?\d+)(\d{3})/;
    while(re.test(num)){
      num=num.replace(re,"$1,$2");
    }
  }catch(err){
  }
  return num;
};
//左右移動卷軸初始化
_bgwPoc.moveInit=function(settings){
  var _defaultSettings={
    moveObj:"",
    movePx:0,
    minLeft:0,
    minLeftPos:"0px",
    minLeftPos1: "0px",
    maxLeft:0,
    maxLeft1: 0,
    maxLeft2:0,
    maxLeftPost:"0px",
    name:""

  };

  if(settings.name == 'mlr'){
    _bgwPoc.moveSettings=momoj.extend(_defaultSettings, settings);
    var _obj=momoj(_bgwPoc.moveSettings.moveObj).clone();
    momoj(_bgwPoc.moveSettings.moveObj).before(_obj);
    momoj(_bgwPoc.moveSettings.moveObj).eq(0).css({left:_bgwPoc.moveSettings.minLeftPos});
    momoj(_bgwPoc.moveSettings.moveObj).eq(1).css({left:'0px'});
  }else if(settings.name == 'blr'){
    _bgwPocBlr.moveSettings=momoj.extend(_defaultSettings, settings);
     var _obj=momoj(_bgwPocBlr.moveSettings.moveObj).clone();
    momoj(_bgwPocBlr.moveSettings.moveObj).before(_obj);
    momoj(_bgwPocBlr.moveSettings.moveObj).eq(0).css({left:_bgwPocBlr.moveSettings.minLeftPos});
    momoj(_bgwPocBlr.moveSettings.moveObj).eq(1).css({left:'0px'});
  }else if(settings.name == 'glr'){
    _bgwPocGlr.moveSettings=momoj.extend(_defaultSettings, settings);
    var _obj=momoj(_bgwPocGlr.moveSettings.moveObj).clone();
    momoj(_bgwPocGlr.moveSettings.moveObj).before(_obj);
    momoj(_bgwPocGlr.moveSettings.moveObj).eq(0).css({left:_bgwPocGlr.moveSettings.minLeftPos});
    momoj(_bgwPocGlr.moveSettings.moveObj).eq(1).css({left:'0px'});
  }

};
//左右移動卷軸
_bgwPoc.slider=function(settings){
  if(_bgwPoc.moveCnt>0){
      return false;
  }
  _bgwPoc.moveCnt++;
  var _settings= null;
  if(settings.name == 'mlr'){
    var _defaultSettings={//你可能會喜歡
      moveWay:"L",// L or R
      movePx:_bgwPoc.moveSettings.movePx,
      moveObj:momoj(_bgwPoc.moveSettings.moveObj),
      minL:_bgwPoc.moveSettings.minLeft,
      minLP:_bgwPoc.moveSettings.minLeftPos,
      minLP1:_bgwPoc.moveSettings.minLeftPos1,
      minLP2:_bgwPoc.moveSettings.minLeftPos2,
      maxL:_bgwPoc.moveSettings.maxLeft,
      maxL1:_bgwPoc.moveSettings.maxLeft1,
      maxL2:_bgwPoc.moveSettings.maxLeft2,
      maxLP:_bgwPoc.moveSettings.maxLeftPos
    };
    _settings = momoj.extend(_defaultSettings, settings);
  }else if(settings.name == 'blr'){
    var _defaultSettingsBlr={//銀行好康
      moveWay:"L",// L or R
      movePx:_bgwPocBlr.moveSettings.movePx,
      moveObj:momoj(_bgwPocBlr.moveSettings.moveObj),
      minL:_bgwPocBlr.moveSettings.minLeft,
      minLP:_bgwPocBlr.moveSettings.minLeftPos,
      minLP1:_bgwPocBlr.moveSettings.minLeftPos1,
      minLP2:_bgwPocBlr.moveSettings.minLeftPos2,
      maxL:_bgwPocBlr.moveSettings.maxLeft,
      maxL1:_bgwPocBlr.moveSettings.maxLeft1,
      maxL2:_bgwPocBlr.moveSettings.maxLeft2,
      maxLP:_bgwPocBlr.moveSettings.maxLeftPos
    };
    _settings = momoj.extend(_defaultSettingsBlr, settings);
  }else if(settings.name == 'glr'){
    var _defaultSettingsGlr={//好物開箱
    moveWay:"L",// L or R
    movePx:_bgwPocGlr.moveSettings.movePx,
    moveObj:momoj(_bgwPocGlr.moveSettings.moveObj),
    minL:_bgwPocGlr.moveSettings.minLeft,
    minLP:_bgwPocGlr.moveSettings.minLeftPos,
    minLP1:_bgwPocGlr.moveSettings.minLeftPos1,
    minLP2:_bgwPocGlr.moveSettings.minLeftPos2,
    maxL:_bgwPocGlr.moveSettings.maxLeft,
    maxL1:_bgwPocGlr.moveSettings.maxLeft1,
    maxL2:_bgwPocGlr.moveSettings.maxLeft2,
    maxLP:_bgwPocGlr.moveSettings.maxLeftPos
    };
    _settings = momoj.extend(_defaultSettingsGlr, settings);
  }

  if(_settings.moveWay=='L'){
    _settings.changePx='-='+_settings.movePx;
  }else{
    _settings.changePx='+='+_settings.movePx;
  }
  var _moveObj=_settings.moveObj;
  _moveObj.animate({left:_settings.changePx},_settings.movePx,function(){
    _bgwPoc.moveCnt++;
    if(_bgwPoc.moveCnt==3){

      _bgwPoc.moveCnt=0;
      
      var moveObjLeft0 = Math.round(_moveObj.eq(0).position().left);
      var moveObjLeft1 = Math.round(_moveObj.eq(1).position().left);
      if (moveObjLeft0 == _settings.minL) {
        _moveObj.eq(1).css({left:_settings.minLP});
      } else if (moveObjLeft1 == _settings.minL) {
        _moveObj.eq(0).css({left:_settings.minLP});
      } else if (moveObjLeft0 == _settings.maxL) {//左移到快到最後時的上一個位置
        _moveObj.eq(1).css({left:_settings.maxLP});
      } else if (moveObjLeft1 == _settings.maxL) {//右移到快到最後時的上一個位置
        _moveObj.eq(0).css({left:_settings.maxLP});//區塊往回貼上的位置
      }
    }
  });
};

/**從工研院取得資料
 * itriDataObject 工研院api需要的資料物件
 * return itriData工研院給予的資料
 */
var getGoodsRankFromItri = function (itriDataObject) {
  var itriData = new Array();

  //品牌旗艦館沒有推薦板塊
  var isBrand = itriDataObject.categ_code.indexOf('21') == 0 ? true : false;

  if(!isBrand){
    momoj.ajax({
      url: '/itri/api/recomd/GetGoodsRanks?_=' + new Date().getTime(),
      type: 'GET',
      data: itriDataObject,
      async: false,
      timeout: 3,
      success: function(_data) {

        if(typeof _data.recomd_list=='undefined' || _data.recomd_list.length < 1) {
          return false;
        }

        _bgwPoc.recomd_id = _data.recomd_id;

        sendRecommendId(_bgwPoc.recomd_id);

        var recomdLength = _data.recomd_list.length;

        for(var i = 0 ; i < recomdLength; i++) {
          var _goodsCode = _data.recomd_list[i].id + '';
          var _goodsName = _data.recomd_list[i].name;
          var _why = '';

          if(typeof _data.recomd_list[i].why != 'undefined' ||
            _data.recomd_list[i].why != null || _data.recomd_list[i].why != 'null') {
            _why=_data.recomd_list[i].why;
          }

          if(_goodsCode == '') {
            continue;
          }

          var array = [];
          array.push(_data.recomd_list[i]);

          itriData.push({
            itemid: _goodsCode,
            goodsName: _goodsName,
            clickurl: '/goods/GoodsDetail.jsp?i_code=' + _goodsCode,
            imgurl: getGoodsImgUrl(_goodsCode,'1','000'),
            title: _goodsName,
            recomd_id: _bgwPoc.recomd_id,
            recomd_list: array,
            why: _why
          });
        }
      }
    });
  }

  return itriData;
};

/**從工研院取得資料
 * Hermes版 itriDataObject 工研院api需要的資料物件
 * return itriData工研院給予的資料
 * 2017.0314 timchen
 */
var getRankFromHermes = function (itriDataObject) {  
  var itriData = new Array();

  //品牌旗艦館沒有推薦板塊
  var isBrand = itriDataObject.categ_code.indexOf('21') == 0 ? true : false;

  if(!isBrand){

    itriDataObject["flag"] = 2037;

    momoj.ajaxTool({
      async:false,
      timeout:3000 ,
      data:itriDataObject ,
      ajaxSuccess:function(rData){
        var _data = JSON.parse(rData.rtnData.data);
        _data = _data ? _data : {};

        if(typeof _data.recomd_list=='undefined' || _data.recomd_list.length < 1) {
          return false;
        }

        _bgwPoc.recomd_id = _data.recomd_id;

        sendRecommendId(_bgwPoc.recomd_id);

        var recomdLength = _data.recomd_list.length;

        for(var i = 0 ; i < recomdLength; i++) {
          var _goodsCode = _data.recomd_list[i].id + '';
          var _goodsName = _data.recomd_list[i].name;
          var _why = '';

          if(typeof _data.recomd_list[i].why != 'undefined' ||
            _data.recomd_list[i].why != null || _data.recomd_list[i].why != 'null') {
            _why=_data.recomd_list[i].why;
          }

          if(_goodsCode == '') {
            continue;
          }

          var array = [];
          array.push(_data.recomd_list[i]);

          itriData.push({
            itemid: _goodsCode,
            goodsName: _goodsName,
            clickurl: '/goods/GoodsDetail.jsp?i_code=' + _goodsCode,
            imgurl: getGoodsImgUrl(_goodsCode,'1','000'),
            title: _goodsName,
            recomd_id: _bgwPoc.recomd_id,
            recomd_list: array,
            why: _why,
            rec_pos: itriDataObject.rec_pos
          });
        }// end if
      }//ajaxSuccess end
    });//ajaxTool end
  }
  return itriData;
};

//商品號碼反算img相對位置 copy from searchEngine.js lckao 2020.07.02
function getGoodsPath(goodsCode, imageGb, operator) {
  var temp = "";
  var goodsPath = "";

  for (var i=0; i<(10-goodsCode.length); i++) {
    temp += "0";
  }
  temp += goodsCode;
  
  if(!/^[0-9]+$/.test(operator)){
    operator = new Date().getTime();
  }
  
  goodsPath = "/"+operator
      +"/goodsimg/"+temp.substring(0, 4)
      +"/"+temp.substring(4, 7)
      +"/"+temp.substring(7, 10)
      +"/"+goodsCode;
  if (imageGb == "1") {
    goodsPath += "_L.jpg";
  } else {
    goodsPath += "_X.jpg";
  }

  return goodsPath;
}

//算出商品圖片路徑 lckao 2020.07.03
function getGoodsImgUrl(goodsCode, imageGb, operator) {
  var goodsImgUrl = getGoodsPath(goodsCode, imageGb, operator);
  goodsImgUrl = getGoodsImgPathWebp(goodsImgUrl,navigator.userAgent);//webp流程
  return momoj.getImgSrcCloud({org:goodsImgUrl});
}

/**將資料轉換成html的樣式，再放入html array，要50品顯示1-25品為你可能會喜歡,25-50為大家都在買、其他備用
 * 首頁你可能會喜歡用
 * itriData 工研院提供的資料
 * momoData momo的資料
 * block  itri 工研院資料
 * @mdli 2017.06.20
 */
var insertGoodsToHtmlForMainPage = function (mainObj, itriData, block, settings) {
  var defaultSettings = {
    target: '_top',
    type: 1
  };
  momoj.extend(defaultSettings, settings);
  
  var html = new Array();
  var type = defaultSettings.type;

  var needTagNum;
  var needShowNum;

  switch(type){
    case 1://你可能會喜歡
      needTagNum = _bgwPoc.tabNumYouLike;
      needShowNum = _bgwPoc.displayYouLikeTopk;
      break;
    case 2://大家都在買（別人也逛過）
      needTagNum = 5;
      needShowNum = _bgwPoc.displayEveryBodyBuyTopk;
      break;
  }

  var momoData = _bgwPoc.getPromoPriceData(itriData);
  var promoObj = new _bgwPoc.promoObj(momoData, needTagNum, needShowNum);
  var isNeedContinue = promoObj.isNeedContinue;
  var dataPromoPrice = promoObj.dataPromoPrice;
  needShowNum = promoObj.needShowNum;

  //將資料插入到html裡
  var showConut = 0;
  for (var i = 0; i < itriData.length; i++) {
    try {
      var nowData = itriData[i];

      if(isNeedContinue && !(nowData.itemid in dataPromoPrice)) continue;//沒有在變價內跳過，但是完全沒有還是要產生區塊。

      var recomd_id = nowData.recomd_id;
      var promoData = dataPromoPrice[nowData.itemid];
    
      var goods = composeOfItriGoodsAndMomoGoodsForMainPage(nowData);
      goods = _bgwPoc.parseItirGoodsUrl(goods, nowData, block);
      goods.img = getGoodsImgUrl(goods.goodsCode,'1',goods.timestamp);
        
      if(showConut >= needShowNum){//進備份
        if(type == '1'){
          var _tmpHtml = new Array();
          pushOneHermesLi(_tmpHtml, goods, defaultSettings, block, type, recomd_id, promoData);
          _bgwPoc.backupGoods.push(_tmpHtml.join(''));
        }
      }else{
        pushOneHermesLi(html, goods, defaultSettings, block, type, recomd_id, promoData);

        showConut++;
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  mainObj.html(html.join(''));
};

/**
* push one li to html array
* @param html html string array
* @author lckao 2020.07.10
*/
var pushOneHermesLi = function(html,goods,defaultSettings,block,type,recId,promoData){
  var classPrefix = '';
  var classA = '';
  var imgHeight = '';
  var favDelDiv = '';
  var imgTag = '';
  var imgLongTagUrl = '';
  var imgBottomTagUrl = '';
  var price1 = '';
  var price2 = '';
  
  var formatFavDelDiv = 
      '  <p class="hoverTip">' +
      '    <span class="addlikebtn" onclick="mayLike_follow('+ goods.goodsCode +',true,momoj(this),\''+ recId +'\');" title="喜歡"></span>' +
      '    <span class="removelikebtn" onclick="mayLike_follow('+ goods.goodsCode +',false,momoj(this),\''+ recId +'\');" title="移除"></span>' +
      '  </p>';
  
  switch(type){
    case 1://你可能會喜歡
      classPrefix = '';
      classA = 'youLikePic';
      imgHeight = '160';
      favDelDiv = formatFavDelDiv;
      break;
    case 2://大家都在買（別人也逛過）
      classPrefix = 'eb_';
      classA = 'ebdBuyPic';
      imgHeight = '110';
      favDelDiv = '';
      break;
  }

  if(typeof promoData != 'undefined'){
    if (typeof promoData.GOODS_NAME != 'undefined' && promoData.GOODS_NAME != "") {//處理品名
      goods.title = promoData.GOODS_NAME;
    }

    if(typeof promoData.OPERATOR != 'undefined') {//處理圖片
      goods.img = getGoodsImgUrl(goods.goodsCode,'1',promoData.OPERATOR);
    }

    if(typeof promoData.AFTER_PROMO_DATA != 'undefined'){//折後價處理 //商品有折後價，秀<促銷價、折後價>；商品無折後價，秀<市價、促銷價>
      if(promoData.AFTER_PROMO_DATA.showPromoPriceYn == '1' 
         && promoData.AFTER_PROMO_DATA.promoPrice != promoData.AFTER_PROMO_DATA.salePrice){
        price1 = "$<b>"+_bgwPoc.commafy(promoData.AFTER_PROMO_DATA.salePrice)+"</b>";
      }else if(promoData.AFTER_PROMO_DATA.promoPrice != promoData.AFTER_PROMO_DATA.custPrice){
        price1 = "$<b>"+_bgwPoc.commafy(promoData.AFTER_PROMO_DATA.custPrice)+"</b>";
      }
      price2 = "$<b>"+_bgwPoc.commafy(promoData.AFTER_PROMO_DATA.promoPrice)+"</b>";
    }else{
      price2 = "$<b>"+_bgwPoc.commafy(promoData.LAST_PRICE)+"</b>";//最終價格
    }
  }
  
  html.push('<li class="'+ classPrefix + goods.itemid +'">');
  html.push('  <a class="'+ classA +'" href="'+ goods.url +'" target="'+ defaultSettings.target +'"'
               +' title="'+ goods.title+'"block="'+ block +'"item="'+ goods.goodsCode +'">');
  html.push('    <div class="prdImgWrap">');
  html.push('      <img height="'+ imgHeight +'" width="auto" title="'+ goods.title+'"'
                     +' alt="'+ goods.title+'" src="'+ goods.img +'">');
  html.push('    </div>');
  html.push('    <p class="prdname">'+ goods.title +'</p>');
  html.push('    <p class="prdprice">');
  html.push('      <span class="prdprice_box01">'+ price1 +'</span>');
  html.push('      <span class="prdprice_box02">'+ price2 +'</span>');
  html.push('    </p>');
  html.push('  </a> ');
  html.push(favDelDiv);
  html.push('</li> ');
}

/** 將工研院和momo的資料進行合併
 * itriData 工研院提供的資料
 * return goods為合併後的資料
 */
var composeOfItriGoodsAndMomoGoodsForMainPage = function (itriData) {
    var goods = {
          url: itriData.clickurl,
          img: itriData.imgurl.replace('_M.jpg','_L.jpg'),
          title: itriData.title,
          promoF: '',
          price: '',
          timestamp: '',
          itemid: 'YOU_LIKE-' + itriData.itemid,
          goodsCode: itriData.itemid,
          style: ''};//只有fM會使用此參數
  return goods;
};
/** 將工研院和momo的資料進行合併
 * itriData 工研院提供的資料
 * momoData momo的資料
 * return goods為合併後的資料
 */
var composeOfItriGoodsAndMomoGoods = function (itriData, momoData) {
  var goods = {
        goodsCode: itriData.itemid,
        url: itriData.clickurl,
        img: itriData.imgurl.replace('_M.jpg','_L.jpg'),
        title: itriData.title,
        promoF: '',
        price: '熱銷一空',
        timestamp: '',
        goodsCode: itriData.itemid,
        imgTagUrl: '',//圓標圖
        style: '',
        target: ''};

        
  if(_bgwPoc.func == 'xiaoi'){
    goods.style = 'style="font:13px/16px Helvetica"';
    goods.target = '_blank';
  }else{
    goods.target = '_top';
  }

  var gc = 'GDS-' + itriData.itemid;
  momoj.each(momoData.rtnData, function(key, value) {
    if(key == gc) {
      //title
      if (value.GOODS_NAME != "") {
        goods.title = value.GOODS_NAME;
      }
      //og image
      var imageOYn = value.imageOYn || "false";
      if (imageOYn == "true") {
        goods.img = goods.img.replace('_L','_OL');
        goods.imageOYn = 'true';
      }else{
        goods.imageOYn = 'false';
      }
      //promo
      if (typeof goods.why != 'undefined' && goods.why == 'NewSale' && value.ENTP_COMM_YN != "1") {//抽%供應商 jrhsu 20200717
        goods.promoF = '<img style="margin:0px;" alt="本週新降價" title="本週新降價" src="//img1.momoshop.com.tw/ecm/img/cmm/main/toKill.png">';
      } else if(typeof goods.why != 'undefined' && goods.why == 'Promo') {
        if (value.DISCOUNT_YN) {
          goods.promoF = '<img src="//img1.momoshop.com.tw/ecm/img/cmm/category/discountIcon.png" alt="現金折扣" title="現金折扣">';
        }
      } else if(value.CP_YN == "1" && value.ENTP_COMM_YN != "1") {//有折價卷,且不是抽%供應商 jrhsu 20200717
        goods.promoF = '<img alt="可使用折價券" title="可使用折價券" src="//img1.momoshop.com.tw/ecm/img/cmm/category/couponsIcon.png">';
      }
      //price、style
      var finalPrice = value.LAST_PRICE;//先直接給最終價格
      if(value.AFTER_PROMO_DATA){//折後價處理
        if(value.AFTER_PROMO_DATA.showPromoPriceYn == '1' && value.AFTER_PROMO_DATA.promoPrice != value.AFTER_PROMO_DATA.salePrice){
          finalPrice = value.AFTER_PROMO_DATA.promoPrice;
        }
      }
      if (Number(finalPrice) > 0) {
        finalPrice = _bgwPoc.commafy(finalPrice);
        if(_bgwPoc.func == 'fM' || _bgwPoc.func == 'xiaoi' || _bgwPoc.func == 'searchShop') {
          goods.price = '$' + finalPrice;
        } else {
          goods.price = finalPrice;
        }
        goods.style = '';
      }
      //timestamp
      if(!!value.OPERATOR) {
        goods.timestamp = value.OPERATOR;
      }
      //圓標圖
      if (value.imgTagUrl) {
        goods.imgTagUrl = value.imgTagUrl;
      }
      
      //上標圖
      if (value.imgLongTagUrl) {
        goods.imgLongTagUrl = value.imgLongTagUrl;
      }
      
      //下標圖
      if (value.imgBottomTagUrl) {
        goods.imgBottomTagUrl = value.imgBottomTagUrl;
      }
    }
  });
  return goods;
};

//設定左右箭頭的click事件，使用捲動方式 (首頁的您可能會喜歡)
var setSliderMoveDirEvent = function (id, delegateClass, sliderFunc) {
  momoj('#' + id).undelegate('click').delegate('.'+delegateClass, 'click', function(e) {
    var _self = momoj(this);

    if(_self.attr('go') == 'right') {
      sliderFunc({moveWay:'L' , name:'mlr'});
    } else {
      sliderFunc({moveWay:'R' , name:'mlr'});
    }
  });
};
var setSliderMoveDirEventBlr = function (id, delegateClass, sliderFunc) {
  momoj('#' + id).undelegate('click').delegate('.'+delegateClass, 'click', function(e) {
    var _self = momoj(this);

    if(_self.attr('go') == 'right') {
      sliderFunc({moveWay:'L' , name:'blr'});
    } else {
      sliderFunc({moveWay:'R' , name:'blr'});
    }
  });
};
var setSliderMoveDirEventGlr = function (id, delegateClass, sliderFunc) {
  momoj('#' + id).undelegate('click').delegate('.'+delegateClass, 'click', function(e) {
    var _self = momoj(this);

    if(_self.attr('go') == 'right') {
      sliderFunc({moveWay:'L' , name:'glr'});
    } else {
      sliderFunc({moveWay:'R' , name:'glr'});
    }
  });
};

//取得momoWa的cookie值
function getMwaSessionInfo(key) {
  var _info = momoj().cookie(key);
  if(_info){
    return _info.slice(0, _info.indexOf("."));
  }else {
    return '';
  }
}

const handleArrowButtonClick = function(id, direction) {
  const length = momoj(`#${id} .TabMenu .tabMenu_number li`).length;
  let selectedIndex = momoj(`#${id} .TabMenu .tabMenu_number li.selected`).index();
  const trackData = [];
  let layout = '';

  if (direction === 'left') {
    if((selectedIndex - 1) < 0) {
      selectedIndex = length - 1;
    } else {
      selectedIndex--;
    };
  } else if (direction === 'right') {
    if ((selectedIndex + 1) >= length) {
      selectedIndex = 0;
    } else {
      selectedIndex++;
    }
  }

  if (id === 'recGoods5') {
    layout = 'csg';
  } else if (id === 'recGoods2') {
    layout = 'oav';
  } else if (id === 'recGoods3') {
    layout = 'hotSale';
  };
  //
  if(id === 'recGoods2' || id === 'recGoods3' || id === 'recGoods5') {
    let page = selectedIndex + 1;
    const itemLength = momoj(`#${id} .TabContentD:eq(${selectedIndex}) ul li`).length;
    for (let i = 0; i < itemLength; i++) {
      const currentLi = momoj(`#${id} .TabContentD:eq(${selectedIndex}) ul li:eq(${i})`);
      let position = i + 1;
      const index = i + (selectedIndex*itemLength);
      const url = `${currentLi.find('a').attr("href")}&mdiv=GoodsDetail-${layout}-${index}&page=${page}&position=${position}`;
      let price = currentLi.find("a .prdPrice b").html();
      price = Number(price.replace(',', '')) || 0;
      trackData.push({
        itemPageUrl: url,
        page: page,
        position: position,
        price: price,
        visibilityRate: 100
      });
    }
    sendMomowaTrackBlockItemEvent(trackData, "impression", _bgwPoc.recomd_id);
  }
  changeTabAndContent(id, selectedIndex);
}

//設定左右箭頭的click 事件
const setClickEvent = function (id) {
  momoj('#' + id).delegate('.leftBtn' , 'click', function(e) {
    handleArrowButtonClick(id, 'left');
  });

  momoj('#' + id).delegate('.rightBtn' , 'click', function(e) {
    handleArrowButtonClick(id, 'right');
  });
};

//切換頁籤及資料內容
var changeTabAndContent = function (id, currentSelectedIndex) {
  var tabMenu = momoj('#' + id + ' .TabMenu .tabMenu_number li');
  var tabContent = momoj('#' + id + ' .TabContentD');

  tabMenu.each(function (i) {

    if(i != currentSelectedIndex) {
      momoj(this).removeClass('selected');
      momoj('a', this).removeClass('selected');

    } else {
      momoj(this).addClass('selected');
      momoj('a', this).addClass('selected');

    }
  });

  tabContent.each(function (i) {
    if(i != currentSelectedIndex) {
      momoj(this).removeClass('selected');
    } else {
      momoj(this).addClass('selected');
    }
  });
};
//初始化268浮層
var set268ClickEvent = function () {
  momoj('#bt_0_272_01_e1').on('click','.hoverEle' , function(e) {
    open268Layer();
  });
}
//取268的浮層資料
var open268Layer = function (){
  var _container = momoj('#bt_0_268_sub');
  if(_container.length == 0){
   return;
  }
  //取268的浮層資料 第一次進來的時候 #bt_0_268_sub 裡面沒資料 透過getpage去要資料  有資料直接印出浮層
  if(_container.html().trim() == ''){
    _container.load('/ajax/GetPage.jsp?url=/10/000/00/000/bt_0_268_sub.html',function(){
      var _innerHtml = _container.html();
      openfloatingLayerBox3('您可以自訂想要推薦的商品分類：(最多可編輯20個分類)',760,_innerHtml,'bt_0_268_Layer');
      mayLike_getCategoryCookie();
      momoj('#bt_0_268_Layer #mayLike_Tooth').find('li').eq(0).click();
    });
  }else{
    var _innerHtml = _container.html();
    openfloatingLayerBox3('您可以自訂想要推薦的商品分類：(最多可編輯20個分類)',760,_innerHtml,'bt_0_268_Layer');
    mayLike_getCategoryCookie();
    momoj('#bt_0_268_Layer #mayLike_Tooth').find('li').eq(0).click();
  }
};

//268浮層區塊點牙齒開大分類功能
var mayLike_openLcategoryList = function (thisObj){
  thisObj.parent().find('li').removeClass('selected');
  thisObj.addClass('selected');
  var thisId = thisObj.attr('id');
  momoj('#bt_0_268_Layer #mayLike_Lcode').find('ul').removeClass('selected');
  momoj('#bt_0_268_Layer #mayLike_Lcode').find('.' + thisId).addClass('selected');
};
//268浮層區塊點全選或取消
var mayLike_selectAll = function (checked){
  momoj('#bt_0_268_Layer #mayLike_Lcode').find('ul.selected input').prop('checked',checked);
};
var mayLike_checkboxClick = function (clickObj){
  var selectCnt = momoj('#bt_0_268_Layer #mayLike_Lcode').find('input:checked').parents('li').length;
  if(selectCnt > 20){
    clickObj.prop('checked',false);
    alert('最多可編輯20個喜好分類');
  }
};
//268浮層選管區塊異動時使用
var mayLike_inputChange = function(){
  var selected_id = momoj('#bt_0_268_Layer #mayLike_Tooth .selected').eq(0).attr('id');
  mayLike_cntSelectNum(selected_id);
  mayLike_showCheckboxLiSelect();
};
//268浮層統計選了幾個館
var mayLike_cntSelectNum = function (toothId){
  var _selectCnt = momoj('#bt_0_268_Layer #mayLike_Lcode .' + toothId + ' input:checked').length;
  var _html = _selectCnt == 0 ? '':'('+_selectCnt+')';
  momoj('#bt_0_268_Layer #mayLike_Tooth #' + toothId).find('b').html(_html);
};
var mayLike_showCheckboxLiSelect = function(){
  momoj('#bt_0_268_Layer #mayLike_Lcode').find('input:checked').parents('li').addClass('selected');
  momoj('#bt_0_268_Layer #mayLike_Lcode').find('input:not(:checked)').parents('li').removeClass('selected');
};
//268浮層選完館架後確定事件
var mayLike_categoryConfirm = function (){
  var lCodeArr = new Array();
  momoj('#bt_0_268_Layer #mayLike_Lcode').find('input:checked').each(function(){
    var thisName = momoj(this).attr('name');
    if(typeof thisName !='undefined'){
      var lCode = thisName.split('_').length == 2 ? thisName.split('_')[1]:'';
      lCodeArr.push(lCode);
    }
  });
  momoj().cookie('mayLike_category',lCodeArr.toString(), {expires:365});
  momoj(".floatingLayerBox .closeBtn").click();
  reset272Div();
  _bgwPoc.doPost();
};
//當針對區塊頁面重新整理的時候先將舊資料清空
var reset268Div = function(){
  var _html = '<a class="rightBtn mlr" go="right"></a><a class="leftBtn mlr" go="left"></a>'
    +'<div class="slide"><ul></ul></div>';
  momoj('#bt_0_268_01 .view').html(_html);//
};
var reset272Div = function(){
  var _html = '<div class="leftarrow leftBtn mlr" go="left"></div><div class="rightarrow rightBtn mlr" go="right"></div>'
    +'<ul></ul>';
  momoj('#bt_0_272_01 .boxcontent').html(_html);//
};
//268浮層取的記錄的管代號cookie
var mayLike_getCategoryCookie = function (){
  var categoryCookie = momoj().cookie('mayLike_category');
  if(typeof categoryCookie =='undefined' || categoryCookie == null){
    return;
  }
  var categoryCode = categoryCookie.split(',');
  for(var i=0,j = categoryCode.length; i<j;i++){
    momoj('#bt_0_268_Layer #mayLike_Lcode').find('input[name=lCode_'+categoryCode[i]+']').prop('checked',true);
  }
  mayLike_cntAllToothSelectNum();
};
//268浮層計算所有牙齒下選擇大分類的數量
var mayLike_cntAllToothSelectNum = function (){
  momoj('#bt_0_268_Layer #mayLike_Tooth').find('li').each(function(){
    var selected_id = momoj(this).attr('id');
    mayLike_cntSelectNum(selected_id);
  });
  mayLike_showCheckboxLiSelect();
};
//268區塊你可能會喜歡-追蹤 . itrilog is from itriweblog.js
var mayLike_follow = function(goodsCode,follow,thisObj,recomd_id){
  itrilog.setGid(goodsCode);
  itrilog.setCustomerlization("from_rec",recomd_id);
  if(follow){
    var _bgImg ='/ecm/img/de/0/bt_0_268/star_on.png?t=20170815001';
    thisObj.css('background-image','url('+_bgImg+')');
    itrilog.setAction(itrilog.itri_conf.ACTION.FavAdd);
  }else{
    itrilog.setAction(itrilog.itri_conf.ACTION.UnFavAdd);
  }
  itrilog.senditri();
  if(!follow){
    appendBackupData(thisObj);
  }
};
//268區塊補備用資料
var appendBackupData = function(thisObj){
  if(_bgwPoc.backupCnt >= _bgwPoc.backupGoods.length){
    _bgwPoc.backupCnt=0;
    _bgwPoc.backupGoods = new Array();
    reset272Div();
    _bgwPoc.doPost();
  }
  var _index = thisObj.parents('li').index();
  momoj('#bt_0_272_01 .boxcontent ul').each(function(){
    momoj(this).find('li').eq(_index).remove();
    momoj(this).append(_bgwPoc.backupGoods[_bgwPoc.backupCnt]);
  });
  _bgwPoc.backupCnt++;
};

//抓喜好設定產生喜好名單(需要的商品類別)
var set_itriData_f_categ_info = function (_itriData){
  var categoryCookie = momoj().cookie('mayLike_category');
  if(typeof categoryCookie =='undefined' || categoryCookie == null || categoryCookie == ''){
    return;
  }
  var categoryArr = new Array();
  var categoryCode = categoryCookie.split(',');
  momoj.each(categoryCode, function(index, catCode){
    var categoryObj = {};
    categoryObj.code = catCode + '00000';
    categoryArr.push(categoryObj);
  });
  _itriData['f_categ_info']=categoryArr;
};

//推薦商品URL後面參數
_bgwPoc.parseItirGoodsUrl = function (goods, itriData, block) {
  var _urlPara = '&cid=rec' + block + '&oid=B' + _bgwPoc.func;
  _urlPara += '&ctype=B';
  if (typeof itriData.recomd_id != 'undefined' && itriData.recomd_id != '') {
    _urlPara += '&recomd_id=' + itriData.recomd_id;
  }

  if (_bgwPoc.mode == 1) {
    _urlPara = encodeURIComponent(_urlPara);
  }

  goods.url += _urlPara;

  return goods;
}

//mdiv url字串
_bgwPoc.getMdivUrl = function(itriData){
  if(typeof itriData == 'undefined' || typeof itriData.rec_pos == 'undefined'){
    return '';
  }

  var mdiv = '';
  var ctype = 'B';
  var rec_pos = itriData.rec_pos;
  switch(rec_pos){
    case 'p'://你可能會喜歡
      mdiv = '1099900000-bt_0_272_01-';
      break;
    case 'p2'://大家都在買
      mdiv = '1099900000-bt_0_269_01-';
      break;
    case 'gop_cs'://您可能也需要
      mdiv = 'goodsDetail_momoshop-cs-';
      break;
    case 'gop_av'://別人也逛過
      mdiv = 'goodsDetail_momoshop-av-';
      break;
    case 'mocs'://xioai
      mdiv = '1099900000-bt_xiaoi-';
      break;
    case 'cap_p0'://小分類
      mdiv = 'category_momoshop-cap_p0-';
      break;
    case 'cap_p2'://大分類
      mdiv = 'category_momoshop-cap_p2-';
      break;
    case 'cap_p3'://管架
      mdiv = 'category_momoshop-cap_p3-';
      break;
    case 'sr'://搜尋 你可能會喜歡
      mdiv = 'search_momoshop-bt_0_layout_b268-';
      break;
  }
  return '&mdiv=' + mdiv + '&ctype=' + ctype;
}

//fD 小分類頁 or fG 商品頁 or fL 大分類頁 流程
_bgwPoc.process1 = function (_bObj, _p1, _htmlCss, _block, pageType) {
  //開賣通知
  var onSaleNotice = momoj("#isSaleNotice").val();

  var divId = '';
  var ulId = '';
  var seoTagH3ToP = '';
  var maskBtnClass = '';
  var tagNum = 3;
  if(pageType == 2){
    divId = 'recGoods2';
    ulId = 'tabRecordAreaNew1';
    seoTagH3ToP = '<div class="recordTitle"><span class="forArrow"></span>別人也逛過</div>';
    maskBtnClass = 'mask';//商品頁還不會被18禁遮照影響
    tagNum = 10;

  }else if(pageType == 3){
    divId = 'recGoods';
    ulId = 'tabRecordAreaNew2';
    seoTagH3ToP = '<p class="titleName"><span class="forArrow"></span>您專屬推薦商品</p>';
    maskBtnClass = 'recommendBtn';//18禁遮照撞名

  }else if(pageType == 4){
    divId = 'recGoods3';
    ulId = 'tabRecordAreaNew3';
    seoTagH3ToP = '<p class="recordTitle"><span class="forArrow"></span>熱銷排行</p>';
    maskBtnClass = 'mask';//18禁遮照撞名
    tagNum = 10;
  }else{
    return;
  }

  var _goodsPrice = _bgwPoc.getPromoPriceData(_p1);

  if (_goodsPrice.rtnCode == '200') {
    var mainDiv = momoj('#' + divId);
    var numberOfGoods = _p1.length;
    var numberOfGoodsInSingleTab = 4;
    //熱銷排行榜若小於4品則不顯示,頁籤數要從推薦api回傳的品數來看是否為numberOfGoodsInSingleTab的倍數,再產生頁籤數
    if(pageType === 4){
      if(_p1.length < 4){
        return;
      }
    }
    if(pageType === 2 || pageType === 4){
      var needshowtag = Math.floor(_p1.length/numberOfGoodsInSingleTab);
      if(tagNum > needshowtag){
        tagNum = needshowtag;
      }
    }
    
    if(!!_htmlCss && _htmlCss.length > 0){
      _bObj.append(_htmlCss.join(''));
    }
    //刪除css
    var style = mainDiv.prev();
    if(style[0] != null && style[0].tagName == 'STYLE') {
      style.remove();
    }
    mainDiv.remove();

    var _html = new Array();

    //li html
    var listLi = new Array();
    for(var i=0;i<tagNum;i++) {
      var strSelected = i == 0 ? 'selected' : '';
      var strFormater = '<li class="{0}"><a class="First-Element">{1}<b></b></a></li>';
      var liHtml = strFormater.format(strSelected, i+1);
      listLi.push(liHtml);
    }

    //產生tab menu
    _html.push('<div id=\"' + divId + '\" class="recordAreaNew">',
      seoTagH3ToP,
      '<div class="TabMenu">',
      '  <ul class="tabMenu_number" id="'+ ulId +'">',
      listLi.join(''),
      '  </ul>',
      '</div>',
      '<div class="view TabContent">');
    if(pageType == 4){
      insertGoodsToHtmlNewForHotRank(_p1, _goodsPrice, _html, _block, numberOfGoodsInSingleTab, tagNum);
    }else{
      insertGoodsToHtmlNew(_p1, _goodsPrice, _html, _block, numberOfGoodsInSingleTab, tagNum);
    }
    _html.push('</div>');
    
    //商品頁的您可能也需要和別人也逛過改在瀏覽紀錄前面
    if(_bgwPoc.func == 'fG'){
      var browsingHistroy = momoj(".recordArea");
      if(browsingHistroy){
        browsingHistroy.before(_html.join(''));
      } else {
        browsingHistroy.append(_html.join(''));  
      }
    } else{
      _bObj.append(_html.join(''));  
    }

    //設定左右箭頭
    if (numberOfGoods > numberOfGoodsInSingleTab) {
      mainDiv = momoj('#' + divId);//remove後重抓
      mainDiv.find('.view.TabContent').append('<span class="'+ maskBtnClass +' leftmask"><a class="leftBtn"></a></span>')
                                      .append('<span class="'+ maskBtnClass +' rightmask"><a class="rightBtn"></a></span>');
      mainDiv.data("StartTab",1);
      mainDiv.TabDelay({RollerSpeed: 0});
      setClickEvent(divId);
    }else{
      momoj('#' + ulId).hide();
      changeTabAndContent(divId, 0);
    }
  }
}

//xiaoi or 搜尋結果頁
_bgwPoc.process2 = function (_bObj, _p1, _htmlCss, block) {
  var momoData = _bgwPoc.getPromoPriceData(_p1);
  if(momoData.rtnCode == '200') {
    _bObj.show();

    var needTagNum = _bgwPoc.topk;
    var needShowNum = _bgwPoc.topk;
    
    var promoObj = new _bgwPoc.promoObj(momoData, needTagNum, needShowNum);
    var isNeedContinue = promoObj.isNeedContinue;
    var dataPromoPrice = promoObj.dataPromoPrice;
    needShowNum = promoObj.needShowNum;

    var _html = new Array();
    var showConut = 0;
    momoj.each(_p1, function (i, itriData) {
      if(isNeedContinue && !(itriData.itemid in dataPromoPrice)) return true;//沒有在變價內跳過，但是完全沒有還是要產生區塊。

      if(showConut >= needShowNum) return false;//超過顯示數量

      _html.push(_bgwPoc.genItirGoodsLi(itriData, momoData, block));

      showConut++;
    });
    var showUl = _bObj.find('ul');
    showUl.html(_html);
    if(!!_htmlCss && _htmlCss.length > 0){
      showUl.parent().append(_htmlCss.join(''));
    }
  }
}

/**將資料轉換成html的樣式，再放入html array (新的板型)
 * itriData 工研院提供的資料
 * momoData momo的資料
 * html 目前要插入資料的html array
 * block  itri 工研院資料
 */
var insertGoodsToHtmlNew = function (itriData, momoData, html, block, numberOfGoodsInSingleTab, tabNum, recommd) {
  tabNum = !!tabNum ? tabNum : 3;
  var needTagNum = numberOfGoodsInSingleTab;
  var needShowNum = numberOfGoodsInSingleTab * tabNum;
    
  var promoObj = new _bgwPoc.promoObj(momoData, needTagNum, needShowNum);
  var isNeedContinue = promoObj.isNeedContinue;
  var dataPromoPrice = promoObj.dataPromoPrice;
  needShowNum = promoObj.needShowNum;

  //將資料插入到html裡
  var showConut = 0;
  for (var i = 0; i < itriData.length; i++) {
    try {
      if(isNeedContinue && !(itriData[i].itemid in dataPromoPrice)) continue;//沒有在變價內跳過，但是完全沒有還是要產生區塊。

      if(showConut >= needShowNum) break;//超過顯示數量

      if(showConut % numberOfGoodsInSingleTab == 0) {
        html.push('<div class="TabContentD">');
        html.push('<ul>');
      }
      var recomd_list = itriData[i].recomd_list || [];
      var recomd_html = [];
      
      if(typeof itriData[i].recomd_id != 'undefined') {
        recomd_html.push('推薦理由');
        if (recomd_list.length > 0 && typeof recommd != 'undefined'){
          for (var j = 0; j < recomd_list.length; j++) {

            if (recomd_list[j].msg_type == 'bsim') {
              recomd_html.push('看此商品的人也看了&#13');
              recomd_html.push(recomd_list[j].name+'&#13');
              recomd_html.push('關聯度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
            }
            else if (recomd_list[j].msg_type == 'csim') {
              recomd_html.push('相似商品&#13');
              recomd_html.push(recomd_list[j].name+'&#13');
              recomd_html.push('相似度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
            }
            else if (recomd_list[j].msg_type == 'ctp') {
              recomd_html.push('分類熱門&#13');
              //recomd_html.push(recomd_list[j].name);
              recomd_html.push('熱門度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
              if (parseInt(recomd_list[j].sales) >= 50) {
                recomd_html.push('近30日銷量：'+recomd_list[j].sales+'件&#13');
              }
            }
            else if (recomd_list[j].msg_type == 'gtp') {
              recomd_html.push('全站熱門&#13');
              //recomd_html.push(recomd_list[j].name);
              recomd_html.push('熱門度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
              if (parseInt(recomd_list[j].sales) >= 50) {
                recomd_html.push('近30日銷量：'+recomd_list[j].sales+'件&#13');
              }
            }
            else if (recomd_list[j].msg_type == 'cs') {
              recomd_html.push('您最近看過&#13');
              recomd_html.push(recomd_list[j].name+'&#13');
            }
            else if (recomd_list[j].msg_type == 'etc') {
              recomd_html.push('專屬您的推薦商品&#13');
              //recomd_html.push(recomd_list[j].name);
              recomd_html.push('推薦度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
            }
          } // for loop
        }// if
      }

      var goods = composeOfItriGoodsAndMomoGoods(itriData[i], momoData);
      goods = _bgwPoc.parseItirGoodsUrl(goods, itriData[i], block);
      var tag = 'li';

      html.push('<' + tag + '><a href="' + goods.url + '" target="_top" title="' + goods.title);
      html.push('" block="' + block + '" class="REC" item="' + itriData[i].itemid + '">');
      if (recomd_list.length > 0 && typeof recommd != 'undefined'){
        html.push('<img class="info" alt="'+recomd_html.join(' ')+'" title="'+recomd_html.join(' ')+'" ');
        html.push(' src="//image.momoshop.com.tw/ecm/img/cmm/category/info.png">');
      }
      
      //og image
      var imageOYn = goods.imageOYn || "false";
      var goodsImage = getGoodsImgUrl(goods.goodsCode,'1',goods.timestamp);
      if (imageOYn == "true") {
        goodsImage = goodsImage.replace('_L','_OL');
      }

      //插入圓標圖和上下標圖
      if (goods.imgTagUrl || goods.imgLongTagUrl || goods.imgBottomTagUrl ){
        html.push('<div class="prdImgWrap">');
        if (!!goods.officialTagImgUrl ){
          html.push('<div class="ec-tag ec-tag-sm ec-tag-official">官方</div>');
        }
        if (goods.imgTagUrl ){
          html.push('<div class="imgTag"><img src="' + momoj.getImgSrc({org:goods.imgTagUrl}) + '"></div>');
        }
        if (goods.imgLongTagUrl ){
          html.push('<div class="imgTagRectangle"><img src="' + momoj.getImgSrc({org:goods.imgLongTagUrl}) + '"></div>');
        }
        if (goods.imgBottomTagUrl ){
          html.push('<div class="imgTagBottom"><img src="' + momoj.getImgSrc({org:goods.imgBottomTagUrl}) + '"></div>');
        }
        html.push('<img width="200" height="200" src="' + goodsImage + '"></div>');
      }else{
        html.push('<img width="200" height="200" src="' + goodsImage+ '">');
      }
      html.push('<p><span class="prdName">' + goods.title + '</span>');
      html.push('   <span class="prdPrice">' +  goods.promoF + '$<b>' + goods.price + '</b></span>');
      html.push('</p></a></' + tag + '>');

    } catch (err) {
      console.log(err);
    }

    if((showConut + 1) % numberOfGoodsInSingleTab == 0) {
      html.push('</ul></div>');
    }

    showConut++;
  }
};


/**將資料轉換成html的樣式，再放入html array (新的板型)for熱銷排行榜
 * itriData 工研院提供的資料
 * momoData momo的資料
 * html 目前要插入資料的html array
 * block  itri 工研院資料
 */
var insertGoodsToHtmlNewForHotRank = function (itriData, momoData, html, block, numberOfGoodsInSingleTab, tabNum, recommd) {
  tabNum = !!tabNum ? tabNum : 3;
  var needTagNum = numberOfGoodsInSingleTab;
  var needShowNum = numberOfGoodsInSingleTab * tabNum;
    
  //var promoObj = new _bgwPoc.promoObj(momoData, needTagNum, needShowNum);
  //var isNeedContinue = promoObj.isNeedContinue;
  //var dataPromoPrice = promoObj.dataPromoPrice;
  //needShowNum = promoObj.needShowNum;

  //將資料插入到html裡
  var showConut = 0;
  for (var i = 0; i < itriData.length; i++) {

    //if(isNeedContinue && !(itriData[i].itemid in dataPromoPrice)) continue;//沒有在變價內跳過，但是完全沒有還是要產生區塊。

    if(showConut >= needShowNum) break;//超過顯示數量

    if(showConut % numberOfGoodsInSingleTab == 0) {
      html.push('<div class="TabContentD">');
      html.push('<ul>');
    }

    try {
      var recomd_list = itriData[i].recomd_list || [];
      var recomd_html = [];
      
      if(typeof itriData[i].recomd_id != 'undefined') {
        recomd_html.push('推薦理由');
        if (recomd_list.length > 0 && typeof recommd != 'undefined'){
          for (var j = 0; j < recomd_list.length; j++) {

            if (recomd_list[j].msg_type == 'bsim') {
              recomd_html.push('看此商品的人也看了&#13');
              recomd_html.push(recomd_list[j].name+'&#13');
              recomd_html.push('關聯度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
            }
            else if (recomd_list[j].msg_type == 'csim') {
              recomd_html.push('相似商品&#13');
              recomd_html.push(recomd_list[j].name+'&#13');
              recomd_html.push('相似度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
            }
            else if (recomd_list[j].msg_type == 'ctp') {
              recomd_html.push('分類熱門&#13');
              //recomd_html.push(recomd_list[j].name);
              recomd_html.push('熱門度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
              if (parseInt(recomd_list[j].sales) >= 50) {
                recomd_html.push('近30日銷量：'+recomd_list[j].sales+'件&#13');
              }
            }
            else if (recomd_list[j].msg_type == 'gtp') {
              recomd_html.push('全站熱門&#13');
              //recomd_html.push(recomd_list[j].name);
              recomd_html.push('熱門度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
              if (parseInt(recomd_list[j].sales) >= 50) {
                recomd_html.push('近30日銷量：'+recomd_list[j].sales+'件&#13');
              }
            }
            else if (recomd_list[j].msg_type == 'cs') {
              recomd_html.push('您最近看過&#13');
              recomd_html.push(recomd_list[j].name+'&#13');
            }
            else if (recomd_list[j].msg_type == 'etc') {
              recomd_html.push('專屬您的推薦商品&#13');
              //recomd_html.push(recomd_list[j].name);
              recomd_html.push('推薦度：'+Math.floor(recomd_list[j].msg_score)+'%&#13');
            }
          } // for loop
        }// if
      }

      var goods = composeOfItriGoodsAndMomoGoods(itriData[i], momoData);
      goods = _bgwPoc.parseItirGoodsUrl(goods, itriData[i], block);
      var tag = 'li';

      html.push('<' + tag + '><a href="' + goods.url + '" target="_top" title="' + goods.title);
      html.push('" block="' + block + '" class="REC" item="' + itriData[i].itemid + '">');
      if (recomd_list.length > 0 && typeof recommd != 'undefined'){
        html.push('<img class="info" alt="'+recomd_html.join(' ')+'" title="'+recomd_html.join(' ')+'" ');
        html.push(' src="//image.momoshop.com.tw/ecm/img/cmm/category/info.png">');
      }
       
      //og image
      var imageOYn = goods.imageOYn || "false";
      var goodsImage = getGoodsImgUrl(goods.goodsCode,'1',goods.timestamp);
      if (imageOYn == "true") {
        goodsImage = goodsImage.replace('_L','_OL');
      }
      
      //插入圓標圖和上下標圖
      if (goods.imgTagUrl || goods.imgLongTagUrl || goods.imgBottomTagUrl ){
        html.push('<div class="prdImgWrap">');
        if (goods.imgTagUrl ){
          html.push('<div class="imgTag"><img src="' + momoj.getImgSrc({org:goods.imgTagUrl}) + '"></div>');
        }
        if (goods.imgLongTagUrl ){
          html.push('<div class="imgTagRectangle"><img src="' + momoj.getImgSrc({org:goods.imgLongTagUrl}) + '"></div>');
        }
        if (goods.imgBottomTagUrl ){
          html.push('<div class="imgTagBottom"><img src="' + momoj.getImgSrc({org:goods.imgBottomTagUrl}) + '"></div>');
        }
        html.push('<img width="200" height="200" src="' + goodsImage + '"></div>');
      }else{
        html.push('<img width="200" height="200" src="' + goodsImage + '">');
      }
      html.push('<p><span class="prdName">' + goods.title + '</span>');
      html.push('   <span class="prdPrice">' +  goods.promoF + '$<b>' + goods.price + '</b></span>');
      html.push('</p></a></' + tag + '>');

    } catch (err) {
      console.log(err);
    }

    if((showConut + 1) % numberOfGoodsInSingleTab == 0) {
      html.push('</ul></div>');
    }

    showConut++;
  }
};


//你可能會喜歡 li
_bgwPoc.genItirGoodsLi = function (itriData, momoData, block) {
  try {
    var newG = composeOfItriGoodsAndMomoGoods(itriData, momoData);//與momoData合併過的goodsinfo
    newG = _bgwPoc.parseItirGoodsUrl(newG, itriData, block);
    var li = momoj('<li></li>');
    var a = momoj('<a></a>').attr({'class':'REC','target':newG.target,'href': newG.url, 'title': newG.title, 'block': block});
    //todo 補圓標，需要另外調整css。
    var img = momoj('<img></img>').attr({'width':'80','height':'80','src':getGoodsImgUrl(newG.goodsCode,'1',newG.timestamp)});
    var gNmae = momoj('<span></span>').html(newG.title);
    var promo = momoj(newG.promoF);
    var price = momoj('<b></b>').attr({'style':newG.style}).append(newG.price);
    a.append(img, gNmae, promo, price);
    li.append(a);
    return li;
  } catch (err) {
    console.log(err);
    return '';
  }
}

//折扣資料
_bgwPoc.getPromoPriceData = function(_p1){
  var gCodes = new Array();
  momoj.each(_p1, function (i, goods) {
    gCodes.push(goods.itemid);
  });
  
  var jsonObj = {
    data: {
      flag: 2002,
      promo_yn: 'Y',
      goodsCode: gCodes,
      O_image_yn: 'N'
    }
  };
  
  if (_bgwPoc.func == 'fG') {//商品頁 折後價多撈O圖
    jsonObj["data"]["O_image_yn"] = 'Y';
  }

  //取的商品頁和小分類頁和大分類頁的推薦版位func
  if (_bgwPoc.func == 'fG' || _bgwPoc.func == 'fD' || _bgwPoc.func == 'fL') {
    jsonObj.data.isNotCallGetGoodsPromoIcon = "Y";
  }
  
  var momoData = momoj.ajaxTool(jsonObj);

  return typeof momoData == 'undefined' ? {} : momoData;
}

//促銷資料物件
_bgwPoc.promoObj = function(momoData, needTagNum, needShowNum){
  var oThis = this;
  oThis.dataPromoPrice = {};
  oThis.needShowNum = needShowNum;
  oThis.isNeedContinue = false;
  try{
    momoj.each(momoData.rtnData, function(key, value){
      key = key.replace('GDS-','');
      oThis.dataPromoPrice[key] = value;
    });
  
    var dataPromoSize = Object.keys(oThis.dataPromoPrice).length;
    if(dataPromoSize >= (needShowNum * 0.9)){//差一點點
      oThis.needShowNum = dataPromoSize - (dataPromoSize % needTagNum);
      oThis.isNeedContinue = true;
    }
  }catch(e){
    //do nothing
  }
}

// for search
_bgwPoc.showYouMayLike = function () {
  _bgwPoc.mode = 3;
  _bgwPoc.func = 'searchShop';
  _bgwPoc.script = 'searchShop.jsp';
  _bgwPoc.postData = {
      mid: 57
    , uid: ''
    , pid: 'searchShop'
    , mode: _bgwPoc.mode
  };

  _bgwPoc.showBgw();
}

_bgwPoc.itriDataAdapter = function(apiData) {

  return apiData.map(function(data) {
    return {
      "itemid": data.goodsCode,
      "goodsName": data.goodsName,
      "clickurl": "/goods/GoodsDetail.jsp?i_code=" + data.goodsCode +"&recomd_id=hotSale",
      "imgurl": data.imgUrl,
      "title": data.goodsName,
      "recomd_id": "",
      "recomd_list": [],
      "why": "",
      "rec_pos": ""
    }
  });
}

var objXioai = momoj('#bt_xiaoi');
if(objXioai.length > 0){
  _bgwPoc.doPost();
}else{
  momoj(window).on('load',function () {
    _bgwPoc.doPost();

    //初始化268浮層
    // set268ClickEvent();
  });
}

function bindInterSectionObserver(id) {
  //觀察 targetEle 可視區域
  function handleIntersectionCallback(entry) {
    const ratio = entry.intersectionRatio;
    const visibilityRate = toPercentage(ratio, 2);
    const name = 'impression'; 
    let category = '大網_商品頁版位_';
    let label = 'GoodsDetail-';
    //版位曝光收數埋點
    if (id === 'recGoods2') {
      category += '別人也逛過';
      label += 'oav';
    } else if (id === 'recGoods3') {
      category += '熱銷排行';
      label += 'hotSale';
    }
  
    sendMomowaTrackActionEvent(category, label, name, _bgwPoc.recomd_id);
    const trackData = [];
    let layout = '';
  
    if (id === 'recGoods5') {
      layout = 'csg';
    } else if (id === 'recGoods2') {
      layout = 'oav';
    } else if (id === 'recGoods3') {
      layout = 'hotSale';
    };
    const itemLength = momoj(`#${id} .TabContentD.selected ul li`).length;
    for (let i = 0; i < itemLength; i++) {
      let currentIndex = momoj(`#${id} .TabMenu ul.tabMenu_number li.selected`).index();
      const page = currentIndex + 1;
      const position = i + 1;
      currentIndex = i + (currentIndex*itemLength);
      const currentLi = momoj(`#${id} .TabContentD.selected ul li:eq(${i})`);
      const url = `${currentLi.find('a').attr("href")}&mdiv=GoodsDetail-${layout}-${currentIndex}&page=${page}&position=${position}`;
      let price = currentLi.find("a .prdPrice b").html();
      price = Number(price.replace(',', '')) || 0;
      trackData.push({
        itemPageUrl: url,
        page: page,
        position: position,
        price: price,
        visibilityRate: 100 //visibilityRate
      });
    }
    sendMomowaTrackBlockItemEvent(trackData, name, _bgwPoc.recomd_id);
  }
  const targetEle = document.querySelector(`#${id}`);
  
  newIntersectionObserver([targetEle], handleIntersectionCallback);
}

//榜定momowa 推薦事件
function bindMomowaLiTag(id){
  momoj('#' + id).find(".TabContentD ul li a.lazyGoods").click(function(){
    var momowaid = momoj(this).attr("momowaid");
    sendRecommendId(momowaid);
  });
}
//取得工研院服飾推薦版位資料並產生版位
function getRecomdOutfit(){
  var rtnMsg = "200";
  var _bObj = momoj(".prdwarp");
  var data = {
      data:{
        URL:"/ajax/ajaxTool.jsp", 
        flag:8002,
        'goodsCode':momoj('[name=goods_code]').val()
      }
    }

  var rtnResult = momoj.ajaxTool(data);
  var rtnArr = rtnResult.rtnData.data.rtnData || '';
  if (rtnArr.length == 0 || rtnArr.length < 4) { //不足4筆就不顯示版位
    rtnMsg = "-1";
    return rtnMsg;
  }
  var liCountHtml = '';
  var outfitContent = '';
  var liCount =  1;
  var outfitHtml = '';
  var contentCount = 0;
  var outfitContentTemp = '';
  var imgTagUrl = '';
  var imgLongTagUrl = '';
  var imgBottomTagUrl = '';
  var outfitContentStart = '<div class="TabContentD selected">';
  var outfitContentEnd  = '</div>';
  var goodsUrl = "";
  momoj(rtnResult.rtnData.data.rtnData).each(function(k,v){
    imgTagUrl = v.imgTagUrl || '';
    imgLongTagUrl = v.imgLongTagUrl || '';
    imgBottomTagUrl = v.imgBottomTagUrl || '';
    contentCount = contentCount + 1;
        outfitContent += '<li>';
          //商品連結
          goodsUrl = "/goods/GoodsDetail.jsp?i_code=" + v.goodsCode
            + "&cid=recitri&oid=BfG";
          page_count = liCount+"_"+contentCount; //埋點momowa
          outfitContent += '<a href= "'+goodsUrl+'" class="lazyGoods" title="'+v.title+'"  isInstants="'+v.isInstantGoodsStatus+'"momowaID="' +page_count+ '"goodsCode = "'+v.goodsCode+'">';
          outfitContent += '  <div class="prdImgWrap">';
            if(imgTagUrl != ''){
              outfitContent += '  <div class="imgTag"><img src="'+v.imgTagUrl+'" alt="圓標" title=""></div>';
            }
            if(imgLongTagUrl != ''){
              outfitContent += '  <div class="imgTagRectangle"><img src="'+v.imgLongTagUrl+'" alt="上標" title=""></div>';
            }
            if(imgBottomTagUrl != ''){
              outfitContent += '  <div class="imgTagBottom"><img src="'+v.imgBottomTagUrl+'" alt="下標" title=""></div>';
            }
            outfitContent += '<img width="200" height="200" title="'+v.title+'" alt="'+v.title+'" src="'+v.contentImage+'">';
            outfitContent += '</div>';
            outfitContent += '<p>';
            outfitContent += '  <span class="prdName">'+v.title+'</span>';
            var price = v.goodsPrice.replace("$","") || '';
            if(price != ''){
              outfitContent += '  <span class="prdPrice">$<b>'+price+'</b></span>';
            } else {
              outfitContent += '  <span class="prdPrice"><b>'+price+'</b></span>';
            }
            //outfitContent += '  <span class="oPrice">'+v.marketPrice+'</span>';
            outfitContent += '</p>';
          outfitContent += '</a>';
        outfitContent += '</li>';
     
      if(contentCount == 4){
        contentCount = 0;
        outfitContentTemp += outfitContentStart+'<ul>'+  outfitContent +'</ul>'+outfitContentEnd;
        outfitContent = '';
        liCountHtml += '<li class=""><a class="First-Element selected">'+liCount+'<b></b></a></li>';
        liCount = liCount + 1;
      }
      
  });
  
  if (outfitContentTemp != "") {
    var outfitHtml = "";
    outfitHtml += '<div id="recGoods5" class="recordAreaNew " >';
    outfitHtml += '  <h3 class="recordTitle"><span class="forArrow"></span><b>推薦搭配</b></h3>';
    outfitHtml += '  <div class="TabMenu">';
    outfitHtml += '  <ul class="tabMenu_number">';
    outfitHtml += liCountHtml;
    outfitHtml += '  </ul>';
    outfitHtml += '</div>';
    //服飾推薦內容
    outfitHtml += '<div class="view TabContent">';
    outfitHtml += '  <span class="mask rightmask"><a class="rightBtn"></a></span>   ';
    outfitHtml += '  <span class="mask leftmask"><a class="leftBtn"></a></span>   ';
    outfitHtml += outfitContentTemp;
    outfitHtml += '</div> ';
    outfitHtml += '</div> ';
    
    //如果是商品頁有瀏覽紀錄就顯示在上面，沒有就加在後面
    if(_bgwPoc.func == 'fG'){
      var browsingHistroy = momoj(".recordArea");
      if(browsingHistroy.length){
        browsingHistroy.before(outfitHtml);
      } else {
        momoj(".prdwarp").append(outfitHtml);  
      }
      return rtnMsg;
    }
  } else {
    rtnMsg = "-2";
    return rtnMsg
  }  
}

//推薦區塊右上方tab mouseover 綁定
function outfitMouseover(id){
  var _id = '#' + id;
  var tabMenu = momoj(_id).find(".TabMenu ul.tabMenu_number li");
  var tabContent = momoj(_id).find(".TabContentD ");
  momoj(tabMenu).mouseover(function(){
      var mouseoverIndex = momoj(_id +' .TabMenu ul.tabMenu_number li').index(this); // 當下點擊頁籤

      if (id == "recGoods5") { //服飾推薦版位再lazyload更新市價
        getGoodsDetail(mouseoverIndex,tabContent);  
      }
      
      const page = mouseoverIndex + 1;
      const trackData = [];
      let layout = '';
    
      if (id === 'recGoods5') {
        layout = 'csg';
      } else if (id === 'recGoods2') {
        layout = 'oav';
      } else if (id === 'recGoods3') {
        layout = 'hotSale';
      };
      const item = momoj(`#${id} .TabContentD:eq(${mouseoverIndex}) ul li`);
      const itemLength = item.length;
      for (let i = 0; i < itemLength; i++) {
        const currentLi = momoj(`#${id} .TabContentD:eq(${mouseoverIndex}) ul li:eq(${i})`);
        const position = i + 1;
        const currentIndex = i + (mouseoverIndex*itemLength);
        const url = `${currentLi.find('a').attr("href")}&mdiv=GoodsDetail-${layout}-${currentIndex}&page=${page}&position=${position}`;
        let price = currentLi.find("a .prdPrice b").html();
        price = Number(price.replace(',', '')) || 0;
        trackData.push({
          itemPageUrl: url,
          page: page,
          position: position,
          price: price,
          visibilityRate: 100
        });
      }
    
      sendMomowaTrackBlockItemEvent(trackData, "impression", _bgwPoc.recomd_id);
  });
}

// recGoods2 別人也逛過, recGoods3 熱銷排行
function bindGoodsItemClick(id){
  momoj(`#${id} .TabContentD ul li a`).on('click', function(){
    const currentIndex = momoj(`#${id} .TabContentD ul li a`).index(this);
    const currentEle = momoj(`#${id} .TabMenu ul.tabMenu_number li.selected`);
    const page = momoj(`#${id} .TabMenu ul.tabMenu_number li`).index(currentEle) + 1;
    const position = (currentIndex % 4) + 1;
    const trackData = [];
    let layout = '';
    if (id === 'recGoods5') {
      layout = 'csg';
    } else if (id === 'recGoods2') {
      layout = 'oav';
    } else if (id === 'recGoods3') {
      layout = 'hotSale';
    };
    
    const url = `${momoj(this).attr("href")}&mdiv=GoodsDetail-${layout}-${currentIndex}&page=${page}&position=${position}`;
    let price = momoj(this).find(".prdPrice b").html();
    price = Number(price.replace(',', '')) || 0;
    trackData.push({
      itemPageUrl: url,
      page: page,
      position: position,
      price: price,
      visibilityRate: 100
    });
    sendMomowaTrackBlockItemEvent(trackData, "click", _bgwPoc.recomd_id);
  });  
}

//滑動或是點擊取得市價和圓標圖
function getGoodsDetail(index,tabContent) {
  var _index = index;
  var prePage = _index -1 ;  //開始頁
  var nextPage = _index +2 ; // 小於結束頁
  var mouseoverDiv   = momoj('#recGoods5 .TabContent div.TabContentD').slice(prePage,nextPage); // 當下點擊頁籤+上一頁和小於結束頁
  var instantsFalseGoods = mouseoverDiv.find("a.lazyGoods").filter("[isinstants=false]");
  
  //如果當頁前後一頁都已載入lazyload就不另外載入
  if(instantsFalseGoods.length == 0){
    return false;
  }
  
  var goodscodeList = [] ;
  momoj(instantsFalseGoods).each(function(k,v){
    var goodsCode = momoj(v).attr("goodsCode");
    momoj(this).attr('isinstants', 'true');
    goodscodeList.push(goodsCode);
  });
  var recomdGoodsObj = {
      "columnType" : "50" || '',
      "goodsCodes" : goodscodeList || [] 
  }
  var data = {
      data:{
        URL:"/ajax/ajaxTool.jsp", 
        flag:8003,
        recomdGoodsObj : recomdGoodsObj
      }
    }

  var rtnResult = momoj.ajaxTool(data);
  var rtnArr = rtnResult.rtnData.data || {};
  setAllGoods(rtnArr,tabContent);
}

//綁定推薦搭配左右箭頭點擊按鈕
function bindArrowBtn(id) {
  var tabContent = momoj('#' + id).find(".TabContentD ");
  momoj('#' + id).find(".leftBtn").on('click', function(){
    var mouseover = momoj('#recGoods5 .TabMenu ul.tabMenu_number li.selected');
    var mouseoverIndex = momoj('#recGoods5 .TabMenu ul.tabMenu_number li').index(mouseover); // 當下點擊頁籤
    getGoodsDetail(mouseoverIndex-1,tabContent);
  })
  momoj('#' + id).find(".rightBtn").on('click', function(){
    var mouseover = momoj('#recGoods5 .TabMenu ul.tabMenu_number li.selected');
    var mouseoverIndex = momoj('#recGoods5 .TabMenu ul.tabMenu_number li').index(mouseover); // 當下點擊頁籤
    getGoodsDetail(mouseoverIndex+1,tabContent);
  })
}
  
//lazyload更新商品的市價和圓標圖
function setAllGoods(data,container) {
  var rtnData = data.rtnData || {};
  for (var goodsCode in rtnData) {
    var thisData = rtnData[goodsCode] || {};
    var imgTagUrl = thisData.imgTagUrl || '';
    var adPriceString = thisData.adPriceString || [];
    var marketPrice = thisData.marketPrice || []
    adPriceString.push('', '', '');
    
    var price = adPriceString[1] || '';
    var priceText = adPriceString[2] || '';
    var imgTag = "<span class='imgTag'><img class='new' src='"+imgTagUrl+"'></span>";
    var loadGoods = momoj(container).find(`a.lazyGoods[goodscode="${goodsCode}"]`);
    loadGoods.attr('isinstants', 'true');
    if(imgTagUrl != ''){ 
      loadGoods.find('.prdImgWrap').append(imgTag);
    }
    
    if (price != '') {
      loadGoods.find('.prdPrice').html('$<b>'+ price +'</b>');
    }
 }
}


/** 推薦版位 資料 API 參數 ( /getRecommendGoods )
 * @typedef {Object} RecommendGoodsApiParam 
 * @property {String} custNo From Cookie value
 * @property {String} ccguid From Cookie value
 * @property {String} ccsession From Cookie value
 * @property {String} goodsCode  商品編號，當 `recommendType` 為 "7" 時帶入上一品商品編號
 * @property {String} recommendType 推薦種類
 * @property {String} categoryCode 分類代碼，當 `recommendType` 為 "7" 時帶入上一品分類代碼
 * @property {Number} viewGoodsTimestamp 查看商品時間戳，從 1970 開始到當下的毫秒(13 碼)，預設 0，若超過某時間，則 goodsInfoList 回傳空陣列，當 `recommendType` 為 "7" 時帶入上一品查看商品時間戳
 * @property {'1'|'2'} pageType 頁面種類  1: 商品頁 2: APP 首頁
 * @property {'jpg'|'webp'} imgType  圖片格式
 * @property {String} goodsSortedCode  商品分類代碼
 * @property {String} curPage  目前頁面 ( type：9 | 11 限定 )
 * @property {String} abTestingGroup  AB testing ("groupA": A群；"groupB": B群)
 * @property {Number} curGoodsInfoListSize  商品總數 ( type：9 | 11 限定 )
 * @property {String} mdiv  首頁 為你推薦/首頁瀑布流 使用 (當 `recommendType` 為 '7' '11首頁瀑布流(你可能會喜歡)' 且 pageType 為 2)
 */
/** 推薦版位 資料 API 參數 ( /getColumnGoodsContent )
 * @typedef {Object} ColumnGoodsContentApiParam 
 * @property {String} custNo From Cookie value
 * @property {'momohome'|'category'} fromPage 版位來源
 * @property {String} cateCode 分類代碼
 * @property {String} columnType  取得版位 APP 類型代碼
 * @property {String} mdiv ECM 版位編碼
 */
/**
 * getInstantGoodsStatus API 參數 ( /getInstantGoodsStatus )
 * @typedef {Object} InstantGoodsStatusApiParam
 * @property {String} columnType 因區塊有部分需要"(售價已折)"有些區塊不需要，故需傳送當前所需情境區塊Type編號，由API協助辨識。
 * @property {Boolean} priceDescrip
 * @property {String[]} implementTypes "imgTag"圓標圖和長標與底標一次回傳、"price"折後價、"imgUrl"商品圖、"shopTag"店家tag(打廣告 adShop API 有給 seller: 3P才需要帶)"、"goodsTag"預/店tag
 * @property {String[]} goodsCodes 品號
 */
/** 推薦版位 商品資料 ( /getRecommendGoods )
 * @typedef {Object} RecommendGoodsInfo
 * @property {String} imgUrl
 * @property {Array<String>} imgUrlArray
 * @property {Array<String>} imgTypeUrlArray
 * @property {Array<String>} imgTagUrl
 * @property {String} imgLongTagUrl
 * @property {String} imgBottomTagUrl
 * @property {String} goodsName
 * @property {String} goodsSubName
 * @property {String} marketPrice
 * @property {String} goodsPrice
 * @property {Object} marketPriceModel
 * @property {Object} goodsPriceModel
 * @property {String} goodsStock
 * @property {String} goodsCode
 * @property {String} vodUrl
 * @property {Object} action
 * @property {Array<Object>} goodsTag
 * @property {Array<Object>} goodsTag
 * @property {Object} blockItem
 * @property {Array<String>} externalImgUrlArray
 * @property {Array<Object>} icon
 * @property {String} goodsFeatureUrl
 */
/** fetchRecommendGoods() 最後回傳資料
 * @typedef {Object} fetchRecommendGoodsByQuantityData
 * @property {Boolean} isSuccess 本次執行 是否 有取到 指定的品數 ( 因為 API 可能會有異常時 )
 * @property {Number} apiErrorCounts 本次執行 API 錯誤 次數
 * @property {Number} apiEmptyGoodsListCounts 本次執行 API 回傳空商品列表 次數
 * @property {Number} requireQuantity 該區要指定幾品商品
 * @property {Number} totalQuantity 本次執行後，最後總共取得幾品
 * @property {Array<RecommendGoodsAjaxToolResponse>} responseList 本次執行後，所有 response
 * @property {Array<RecommendGoodsInfo>} goodsInfoList 本次執行後，所有 商品資料
 * @property {Number} curPage 本次執行後 最後打到第幾頁
 */

/**推薦版位 API 回傳資料處理 ( /getRecommendGoods ) */
class RecommendGoodsAjaxToolResponse {
  constructor(response={}) {
    this.response = response;
    this.successRtnCode = '200';
  }
  get rtnData() {
    return this.response?.rtnData || {};
  }
  get isSuccess() {
    return this.response.rtnCode == this.successRtnCode;
  }
  get goodsInfoList() {
    return this.rtnData.goodsInfoList || [];
  }
  get recomd_id() {
    return this.rtnData.recomd_id || '';
  }
  get mdiv() {
    return this.rtnData.mdiv || '';
  }
  get mdiv() {
    return this.rtnData.blockName || '';
  }
  get blockTypeId() {
    return this.rtnData.blockTypeId || '';
  }
  get blockTypeName() {
    return this.rtnData.blockTypeName || '';
  }
  get curPage() {
    return this.rtnData.curPage || 1;
  }
  get maxPage() {
    return this.rtnData.maxPage || 0;
  }
}

/**推薦版位 API 回傳資料處理 ( /getColumnGoodsContent ) */
class ColumnGoodsContentAjaxToolResponse {
  constructor(response={}) {
    this.response = response;
    this.successRtnCode = 200;
  }
  get rtnData() {
    return this.response?.rtnData || {};
  }
  get isSuccess() {
    return this.response.rtnCode === this.successRtnCode;
  }
  get contentInfo() {
    return this.rtnData.contentInfo || [];
  }
}

/**getInstantGoodsStatus 回傳資料處理 ( /getInstantGoodsStatus )*/
class InstantGoodsAjaxToolResponse {
  constructor(response={}) {
    this.response = response;
    this.successRtnCode = 200;
  }
  get rtnData() {
    return this.response?.rtnData?.data?.rtnData || {};
  }
  get isSuccess() {
    return this.response.rtnCode === this.successRtnCode;
  }
}

/** cookie 取得 客編
 * @returns {String} 客編
 * @author jphsu
 */
function getCustNo() {
  return (momoj().cookie('ccmedia') || '').split('_/')[0].replace('"', '');
}

/** 取得 推薦版位 資料 Api 參數
 * @typedef  {Object} getRecommendGoodsApiParamConfig
 * @property {'main'} type 推薦種類
 * @param {getRecommendGoodsApiParamConfig}
 * @returns {RecommendGoodsApiParam}
 * @author jphsu
 */
function getRecommendGoodsApiParam({ type='', goodsCodeParam = '' , goodsSortedCodeParam =''}) {
  /** 預設值 @type {RecommendGoodsApiParam}  */
  const defaultParameter = {
    ccguid: "",
    curPage: 1,
    goodsSortedCode: "",
    pageType: "",
    goodsCode: "",
    jsessionid: "",
    custNo: getCustNo(),
    imgType: "webp",
    recommendType: "",
    categoryCode: "",
    abTestingGroup: "",
    ccsession: "",
    curGoodsInfoListSize: 0,
  }
  if (type === 'main') { // 【首頁】你可能會喜歡、【EDM】你可能會喜歡
    return {
      ...defaultParameter,
      curPage: 1,
      pageType: '2',
      recommendType: '11',
    }
  }else if(type === 'goods'){//[商品頁]熱門推薦 熱銷排行
    return {
      ...defaultParameter,
      curPage: 1,
      pageType: '1',
      recommendType: '8',
      goodsCode: goodsCodeParam,
    }
  }else if(type=='hotSaleRank'){
    return {
      ...defaultParameter,
      curPage: 1,
      pageType: '1',
      recommendType: '6',
      goodsCode: goodsCodeParam,
      categoryCode:goodsSortedCodeParam,
      goodsSortedCode:goodsSortedCodeParam,
      
    }
  }
  return defaultParameter;
}

/** 產出 首頁 你可能會喜歡、大家都在買 < li > 字串
 * @typedef  {Object} getRecommendLiHTMLStringConfig
 * @property {String} goodsCode 品號
 * @property {String} goodsName 品名
 * @property {String} imgUrl    品圖
 * @property {String} originSign  '$'
 * @property {String} originPrice '1,999'
 * @property {String} originStartingPrice '起'
 * @property {String} promoSign   '$'
 * @property {String} promoPrice  '1,099'
 * @property {String} promoStartingPrice  '起'
 * @property {String} goodsHref  'https://www.momoshop.com.tw/goods/GoodsDetail.jsp?i_code=13579532'
 * @property {String} goodsImgHeight 商品圖高度 e.g.'160px'
 * @property {String} liPrefixClassName ClassName String
 * @property {String} hrefClassName ClassName String
 * @property {Array} goodsTags 商品品稱 前的 Tag 資料
 * @property {Boolean} showOriginPrice 是否顯示市價
 * @param {getRecommendLiHTMLStringConfig} getRecommendLiHTMLStringConfig
 * @returns {String} html 字串 e.g. '< li >AAA< /li >'
 * @author jphsu
 */
function getRecommendLiHTMLString({ goodsCode='', goodsName='', imgUrl='', originSign='', originPrice='', originStartingPrice='', promoSign='', promoPrice='', promoStartingPrice='', goodsHref='#', goodsTags=[], goodsImgHeight='160', liPrefixClassName='', hrefClassName='', showOriginPrice=true, isInstantGoodsStatus, }) {
  const isEmptyPrice = price => price == 0 || price === '' || typeof price === 'undefined';
  const hightLightSign = isEmptyPrice(promoPrice) ? originSign : promoSign;
  const hightLightPrice = isEmptyPrice(promoPrice) ? originPrice : promoPrice;
  const hightLightStartingPrice = isEmptyPrice(promoPrice) ? originStartingPrice : promoStartingPrice;
  const isStoreTag = tagContent => ['店⁺', '店+'].includes(momoj.unicode2Str(tagContent));
  const isPreorderTag = tagContent => ['預', '預購'].includes(momoj.unicode2Str(tagContent));

  const htmlString = (
    `<li class="${ liPrefixClassName }${ goodsCode }" gcode="${ goodsCode }" ${ isInstantGoodsStatus !== undefined ? `isInstantGoodsStatus=${ isInstantGoodsStatus }` : '' }>` +
      `<a class="${ hrefClassName }" href="${ goodsHref }" target="_top" title="${ goodsName }" block="itri" item="${ goodsCode }">` +
        `<div class="prdImgWrap"><img height="${goodsImgHeight}" width="auto" title="${ goodsName }" alt="${ goodsName }" src="${ imgUrl }"></div>` +
        `<p class="prdname">` +
          `<span class="icon-group">` +
            ( // Tag
              goodsTags.map(goodsTag => {
                if (isStoreTag(goodsTag.content))    return `<span class="icon-store" style="background-color: ${ goodsTag?.bgColor || '' }"><img src="${ goodsTag?.imgUrl || '' }" alt="店+"></span>`;
                if (isPreorderTag(goodsTag.content)) return `<span class="icon-preorder" style="background-color: ${ goodsTag?.bgColor || '' }"><img src="${ goodsTag?.imgUrl || '' }" alt="預"></span>`;
              }).join('')
            ) +
          `</span>` + 
          `<span class="prd-name">${goodsName}</span>` +
        `</p>` +
        `<p class="prdprice prices-group">` +
          ( // 市價為 0、售價為空 不顯示市價 html
            isEmptyPrice(originPrice) || isEmptyPrice(promoPrice) || (originPrice === promoPrice) || !showOriginPrice
              ? ''
              : (
                  `<span class="prdprice_box01 origin-prices-group">` +
                    `<span class="origin-price">${ originSign }<b>${ originPrice }</b>` +
                    ( // 有'起' 顯示 html， 沒'起' 不顯示 html
                      !!originStartingPrice ? `<span class="price-from">${ originStartingPrice }</span>` : ''
                    ) +
                    `</span>` +
                  `</span>`
                )
          ) + 
          (
            `<span class="prdprice_box02 current-prices-group">` +
              `<span class="current-price">${ hightLightSign }<b>${ hightLightPrice }</b>` +
                ( // 有'起' 顯示 html， 沒'起' 不顯示 html
                  !!hightLightStartingPrice ? `<span class="price-from">${ hightLightStartingPrice }</span>` : ''
                ) +
              `</span>` +
            `</span>`
          ) +
        `</p>` +
      `</a>` +
    `</li>`
  );
  return htmlString;
}


/**
 * 從URL中取得goodsCode
 * @returns {String} 
 * @author tclien
 */
function getGoodsCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('i_code') || '';
}

/** 取得 推薦版位 資料 ( /getRecommendGoods )
 * 一次 取得 指定品數 的 推薦版位資料 ( 也支援不指定品數 )，  
 * 因為目前 Api 不支援指定回傳品數，回傳品數最多是 20 品，不滿 20 品，品數不固定，  
 * 故 只能用 curPage 參數，分次取回 指定品數的 所有品數資料。
 * @param {Object} config
 * @param {RecommendGoodsApiParam} [config.apiParam] 推薦版位 資料 API 參數
 * @param {Number} [config.goodsQuantity] 該區要指定幾品商品 ( 若傳入 -1 則判定不指定品數，只呼叫一次 Api )，最大上限品數 定義在 validateGoodsQuantity()。
 * @returns {Promise<fetchRecommendGoodsByQuantityData>}
 * @author jphsu
 */
async function fetchRecommendGoods({ apiParam, goodsQuantity=-1 }) {
  /**
   * 檢查傳入的品數是否合規，若不合規，則回傳處理過的品數
   * @param {Number|String} goodsQuantity
   * @returns {Number} 合規的品數
   */
  const validateGoodsQuantity = goodsQuantity => {
    if (!window.location.hostname.includes('.momoshop.com.tw')) { return 0; } // 網域若不包含 .momoshop.com.tw，回傳 0 ( 防止 EDM 開發過程中一直打 )
    const MAX_GOODS_QUANTITY = 100; // 最大上限品數 ( 預防呼叫過多的品數，造成系統卡線 )
    const _goodsQuantity = parseInt(goodsQuantity);
    if (Number.isNaN(_goodsQuantity)) { return 0; } // 非數字回傳 0
    if (_goodsQuantity > MAX_GOODS_QUANTITY) { return MAX_GOODS_QUANTITY; } // 大於最大上限，回傳最大上限品數
    if (_goodsQuantity < -1) { return -1; } // 小於 -1，回傳 -1
    return _goodsQuantity;
  }

  // 計算呼叫 Api 次數
  const calcCallApiCounts = goodsQuantity => {
    const expectedApiRtnGoodsQuantity = 20;
    return Math.ceil(goodsQuantity / expectedApiRtnGoodsQuantity);
  }

  /** 
   * 取得 推薦版位資料
   * @param {RecommendGoodsApiParam} apiParam api 參數
   * @returns {Promise}
   */
  const fetchApi = async(apiParam={}) => {
    return new Promise((resolve, reject) => {
      momoj.ajaxTool({
        async: true,
        timeout: 10 * 1000,
        data: {
          flag: 2044,
          ...apiParam,
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

  /**
   * 批次 取得 推薦版位資料
   * @param {Number} callApiCounts 要呼叫的次數
   * @param {Number} initialPage 起始頁數
   * @returns {Promise<Array<rawResponse>>} 所有 Api response ( 依據呼叫時所帶的頁數 排序過的 )
   */
  const batchFetchApi = async (callApiCounts, initialPage) => {
    // console.log(`fetchRecommendGoodsByQuantity: Batch fetch api executing...\n=> ${ callApiCounts } fetch api process in the batch.`)
    const allPromise = 
      Array.from({ length: callApiCounts }).reduce((allPromise, _, index) => {
        const curPage = initialPage + index;
        allPromise.push(
          fetchApi({ ...apiParam, curPage, })
            .then( data => ({ data, curPage, }))
            .catch(data => ({ data, curPage, }))
        )
        return allPromise;
      }, []);

    const results = await Promise.all(allPromise);
    return (
      results
        .toSorted((result1, result2) => result1.curPage - result2.curPage) // 依據 curPage 排序
        .map(result => result.data) // 只將 Api 資料傳出
    );
  }

  // 定義 回傳值、定義 更新回傳值的相關方法
  const rtnData = {
    /**@type {fetchRecommendGoodsByQuantityData} 回傳值 */
    info: {
      isSuccess: false,
      apiErrorCounts: 0,
      apiEmptyGoodsListCounts: 0,
      requireQuantity: validateGoodsQuantity(goodsQuantity),
      totalQuantity: 0,
      responseList: [],
      goodsInfoList: [],
      curPage: (Number(apiParam.curPage) || 1) - 1,
    },
    /**
     * 用 RecommendGoodsAjaxToolResponse 更新 rtnData
     * @param {RecommendGoodsAjaxToolResponse} response 
     */
    updatedByResponse(response) {
      if (!response.isSuccess) { rtnData.info.apiErrorCounts++; }
      if ( response.isSuccess && response.goodsInfoList.length === 0) { rtnData.info.apiEmptyGoodsListCounts++; }
      rtnData.info.curPage++;
      rtnData.info.totalQuantity += response.goodsInfoList.length;
      rtnData.info.responseList.push(response);
      rtnData.info.goodsInfoList.push(...response.goodsInfoList);
      rtnData.info.isSuccess = rtnData.info.totalQuantity >= rtnData.info.requireQuantity;      
    }
  }

  if (rtnData.info.requireQuantity === -1) { // 沒有指定品數
    rtnData.updatedByResponse(
      new RecommendGoodsAjaxToolResponse(await fetchApi(apiParam))
    );
  } else {
    /** 本次執行 API 錯誤 最大上限次數，防止無限打 */
    const MAX_API_ERROR_COUNTS = 1;
    /** 本次執行 API 回傳空商品列表 最大上限次數，防止無限打 */
    const MAX_API_EMPTY_GOODSLIST_COUNTS = 10;

    while (
      rtnData.info.totalQuantity < rtnData.info.requireQuantity && // 目前品數 小於 要求品數
      rtnData.info.apiErrorCounts < MAX_API_ERROR_COUNTS && // API 錯誤總次數 小於 最大上限次數
      rtnData.info.apiEmptyGoodsListCounts < MAX_API_EMPTY_GOODSLIST_COUNTS // API 回傳空商品列表次數 小於 最大上限次數
    ) {
      const callApiCounts = calcCallApiCounts(rtnData.info.requireQuantity - rtnData.info.totalQuantity);
      const rawResponseList = await batchFetchApi(callApiCounts, rtnData.info.curPage + 1);
      rawResponseList.forEach(rawResponse => {
        rtnData.updatedByResponse(new RecommendGoodsAjaxToolResponse(rawResponse));
      })
    }
  }

  return rtnData.info;
}

/** 取得 推薦版位 資料 Api 參數 
 * @typedef  {Object} getColumnGoodsContentApiParamConfig
 * @property {'momohome_everyBodyBuy'} type 推薦種類
 * @param {getColumnGoodsContentApiParamConfig}
 * @returns {ColumnGoodsContentApiParam}
 * @author jphsu
 */
function getColumnGoodsContentApiParam({ type='' }) {
  /** 預設值 @type {RecommendGoodsApiParam}  */
  const defaultParameter = {
    custNo: getCustNo(),
    fromPage: "",
    cateCode: "",
    columnType: "",
    mdiv: ""
  }
  
  if (type === 'momohome_everyBodyBuy') { // 【首頁】大家都在買
    return {
      ...defaultParameter,
      fromPage: "momohome",
      cateCode: "",
      columnType: "55",
      mdiv: "8100700000-bt_7_606_01"
    }
  }

  if (type === 'category_RecommandGoods') { // 【館架頁】您專屬推薦商品
    return {
      ...defaultParameter,
      fromPage: "category",
      cateCode: "",
      columnType: "52",
      mdiv: "8100700000-bt_7_601_01"
    }
  }

  return defaultParameter;
}

/** 取得 推薦版位 資料 ( /getColumnGoodsContent ) 
 * @param {Object} fetchColumnGoodsContentConfig 
 * @param {ColumnGoodsContentApiParam} fetchColumnGoodsContentConfig.apiParam 
 * @author jphsu
 */
async function fetchColumnGoodsContent({ apiParam }) {
  return new Promise((resolve, reject) => {
    momoj.ajaxTool({
      async: true,
      timeout: 10 * 1000,
      data: {
        flag: 2055,
        ...apiParam,
      },
      ajaxSuccess(data) {
        resolve(data);
      }
    })
  })
}

/** 取得 1P/3P 商品資料 ( /getInstantGoodsStatus ) 
 * @param {Object} fetchInstantGoodsStatusConfig
 * @param {InstantGoodsStatusApiParam} fetchInstantGoodsStatusConfig.apiParam 
 * @author jphsu
 */
async function fetchInstantGoodsStatus({ apiParam }) {
  return new Promise((resolve, reject) => {
    momoj.ajaxTool({
      async: true,
      timeout: 10 * 1000,
      data: {
        flag: 8003,
        recomdGoodsObj: apiParam,
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

/**
 * 取得 3P domain
 * @param {*} locationOrigin https://mqc7.momoshop.com.tw
 * @returns https://momoqc7.momoshop.com.tw
 */
const getTPDomain = (locationOrigin='') => {
  const regex = /(m(?:uat|qc)?)(\d+)?\.momoshop/g;

  const domain = locationOrigin.replace(regex, (match, p1, p2) => {
    if (p1 === 'm') {
      return 'www.momoshop';
    } else {
      return `momo${ p1.replace('m', '') }${p2}.momoshop`;
    }
  });
  return domain;
}

/**
 * 用 Action Object 組出 1P / 3P 商品頁連結
 * @param {Object} action API 來的 Action Object
 * @param {Object} customParameter 客製化參數 EX: { 'recomdId': 1 }
 * @returns {String} 商品頁連結
 * @author jphsu
 */
function getGoodsPageUrlByAction(action={}, customParameter={}) {
  const { actionType='', actionValue='', extraValue={} } = action;
  const { lastPathName='', entpCode='', urlParameter='', } = extraValue;

  const _URLSearchParams = new URLSearchParams(urlParameter);
  for (const [key, value] of Object.entries(customParameter)) {
    _URLSearchParams.set(key, value);
  }

  if (actionType == '11') {
    return `${ window.location.origin }/goods/GoodsDetail.jsp?i_code=${ actionValue }&${ _URLSearchParams.toString() }`;
  } else if (actionType == '10002') {
    return `${ getTPDomain(window.location.origin) }/TP/${ entpCode }/goodsDetail/${ actionValue }?${ _URLSearchParams.toString() }`;
  } else {
    return window.location.origin;
  }
}

/**
 * 用 entpCode, goodsCode 組出 1P / 3P 商品頁連結
 * @param {String} goodsCode 品號
 * @param {Object} customParameter 連結參數
 * @returns {String} 商品頁連結
 * @author jphsu
 */
function getGoodsPageUrlByGoodsCode(goodsCode='', customParameter={}) {
  const _URLSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(customParameter)) {
    _URLSearchParams.set(key, value);
  }

  if (goodsCode.startsWith('TP')) {
    const entpCode = goodsCode.slice(0, 9);
    return `${ getTPDomain(window.location.origin) }/TP/${ entpCode }/goodsDetail/${ goodsCode }?${ _URLSearchParams.toString() }`;
  } else {
    return `${window.location.origin}/goods/GoodsDetail.jsp?i_code=${ goodsCode }&${ _URLSearchParams.toString() }`;
  }
}

/**
 * 首頁 你可能會喜歡 區塊
 * @author jphsu
 */
function homePageYouMaybeLike() {
  if (document.querySelector('#bt_0_272_01 .boxcontent ul')) {
    /**商品總數 */
    const homePage_YouMaybeLikeGoodsElementsQuantity = 24;

    fetchRecommendGoods({
      apiParam: getRecommendGoodsApiParam({ type: 'main' }),
      goodsQuantity: homePage_YouMaybeLikeGoodsElementsQuantity,
    }).then(responseInfo => {
      // 濾掉多餘的品數，因為以前寫的輪播 有限制品數規則
      const goodsInfoList = responseInfo.goodsInfoList.slice(0, responseInfo.requireQuantity);

      // 產 此區所有 <li> HTML String
      const goodsElementsString = goodsInfoList.reduce((goodsElementsString, recommendGoodsInfo)=>{
        const { goodsCode='', goodsName='', imgUrl='', marketPriceModel={}, goodsPriceModel={}, action={}, goodsTag:goodsTags=[], } = recommendGoodsInfo;
        const { sign:originSign='', price:originPrice='', strPrice:originStartingPrice='',} = marketPriceModel.basePrice || {};
        const { sign:promoSign='',  price:promoPrice='',  strPrice:promoStartingPrice='', } = goodsPriceModel.basePrice || {};
        const goodsHref = getGoodsPageUrlByAction(action, { cid: 'recitri', oid: 'BfM', ctype: 'B', recomd_id: responseInfo.responseList[0].recomd_id, });
        goodsElementsString += getRecommendLiHTMLString({ goodsCode, goodsName, imgUrl, originSign, originPrice, originStartingPrice, promoSign, promoPrice, promoStartingPrice, goodsHref, goodsTags, goodsImgHeight: '160', liPrefixClassName: 'YOU_LIKE-', hrefClassName: 'youLikePic', })
        return goodsElementsString;
      }, '')
  
      // 渲染
      momoj('#bt_0_272_01 .boxcontent ul').append(momoj(goodsElementsString));
      // 啟動輪播
      _bgwPoc.slideInit('bt_0_272_01 .boxcontent', 180, _bgwPoc.tabNumYouLike, homePage_YouMaybeLikeGoodsElementsQuantity, 15, 'mlr');
    })
  }
}

/**
 * 判斷 一個元素 在 一個元素中 當前是否為可見的
 * @param {Object} parameter
 * @param {string|Element} [parameter.targetElement] 要檢查的元素 ( ex: #bt_0_272_01_e4 .boxcontent ul > #aaaaa )
 * @param {string|Element} [parameter.rootElement=document.body] 要檢查的元素的根元素或根範圍 ( ex: #bt_0_272_01_e4 ) 預設會是 document.body
 * @param {Boolean} [parameter.strict=false] strict:true ( 元素必須完整露出 才算可見 ) ; strict:false ( 元素只要有露出 就算可見 )
 * @return {Boolean}
 * @author jphsu
 */
function isElementInRootElementVisible({ targetElement='', rootElement=document.body, strict=false, }) {
  const getElement = targetElement => {
    let element = null;
    try {
      if (targetElement === null || targetElement instanceof Element) {
        element = targetElement;
      } else {
        element = document.querySelector(targetElement);
      }
    } catch(error) {
      console.log(error);
    }
    return element;
  }
  const targetElementRect = getElement(targetElement)?.getBoundingClientRect?.();
  const rootElementRect = getElement(rootElement)?.getBoundingClientRect?.();

  if (!targetElementRect || !rootElementRect) return false;

  const { left:targetElementLeft, right:targetElementRight, top:targetElementTop, bottom:targetElementBottom,  } = targetElementRect;
  const { left:rootElementLeft, right:rootElementRight, top:rootElementTop, bottom:rootElementBottom,  } = rootElementRect;

  if (strict) {
    return (
      (targetElementLeft >= rootElementLeft && targetElementRight <= rootElementRight)
        &&
      (targetElementTop >= rootElementTop && targetElementBottom <= rootElementBottom)
    );
  } else {
    return (
      (targetElementRight > rootElementLeft && targetElementLeft < rootElementRight)
        &&
      (targetElementBottom > rootElementTop && targetElementTop < rootElementBottom)
    );
  }
}

/**
 * 取輪播 當前顯示頁、前一頁、後一頁 的 商品元素
 * @param {Object} parameter
 * @param {string} [parameter.goodsElementSelector=''] 輪播品的 selector ( ex: #bt_0_269_01 .boxcontent ul > [gcode] )
 * @returns {Array<HTMLElement>} [ ...前一頁, ...當前顯示, ...後一頁 ]
 * @author jphsu
 */
function getPreviousAndNextPageSliderGoodsElements({ containerElementSelector='', goodsElementSelector='', }) {
  const getCircularSiblingElements = ({ elementIndex, allElements, elementRange }) => {
    const getCircularIndex = (index, totalLength) => (index + totalLength) % totalLength;
    let elements = [];
    if (elementRange < 0) {
      elements = Array.from({ length: Math.abs(elementRange) }, (_, index) => 
        allElements[getCircularIndex(elementIndex - (index + 1), allElements.length)]);
    } else {
      elements = Array.from({ length: elementRange }, (_, index) => 
        allElements[getCircularIndex(elementIndex + (index + 1), allElements.length)]);
    }
    return elements;
  }
  const goodsElements = Array.from(document.querySelectorAll(goodsElementSelector));
  const currentVisibleGoodsElements = goodsElements.reduce((visibleElements, element) => {
    const isVisible = isElementInRootElementVisible({ targetElement: element, rootElement: containerElementSelector, });
    if (isVisible) {
      visibleElements.push(element);
    }
    return visibleElements;
  }, []);
  const perSlideGoodsElementsQuantity = currentVisibleGoodsElements.length;

  if (perSlideGoodsElementsQuantity === 0) {
    return [];
  } else {
    // 前一卡 商品元素
    const beforeNeedUpdateElements = getCircularSiblingElements({
      elementIndex: goodsElements.indexOf(currentVisibleGoodsElements[0]),
      allElements: goodsElements,
      elementRange: perSlideGoodsElementsQuantity * -1
    });
  
    // 後一卡 商品元素
    const afterNeedUpdateElements = getCircularSiblingElements({
      elementIndex: goodsElements.indexOf(currentVisibleGoodsElements[currentVisibleGoodsElements.length - 1]),
      allElements: goodsElements,
      elementRange: perSlideGoodsElementsQuantity,
    });
  
    return [
      ...beforeNeedUpdateElements,   // 前一卡商品元素
      ...currentVisibleGoodsElements,// 目前顯示的商品元素
      ...afterNeedUpdateElements,    // 後一卡商品元素
    ];
  }
}

/**
 * 首頁 大家都在買 區塊
 * @author jphsu
 */
function homePageEveryBodyBuy() {
  if (document.querySelector('#bt_0_269_01 .boxcontent ul')) {
    /**一卡顯示幾個商品 */
    const perSlideGoodsElementsQuantity = 5;

    fetchColumnGoodsContent({
      apiParam: getColumnGoodsContentApiParam({ type: 'momohome_everyBodyBuy' }),
    }).then(responseInfo => {
      const columnGoodsContentAjaxToolResponse = new ColumnGoodsContentAjaxToolResponse(responseInfo);
      const contentInfoLength = columnGoodsContentAjaxToolResponse.contentInfo.length;
  
      // 因為目前輪播寫法關係，"商品顯示總數" 需要被 "一頁顯示幾個商品" 整除，所以這邊取 "一頁顯示幾個商品" 的最大倍數
      const goodsInfoList = 
        columnGoodsContentAjaxToolResponse.contentInfo
          .slice(0, perSlideGoodsElementsQuantity * Math.floor(contentInfoLength / perSlideGoodsElementsQuantity));
  
      // 產 此區所有 <li> HTML String
      const goodsElementsString = goodsInfoList.reduce((goodsElementsString, columnGoodsInfo)=>{
        const { goodsCode='', title='', contentImage='', marketPriceModel={}, goodsPriceModel={}, action={}, goodsTag:goodsTags=[], isInstantGoodsStatus=false, } = columnGoodsInfo;
        const { sign:originSign='', price:originPrice='', strPrice:originStartingPrice='', } = marketPriceModel.basePrice || {};
        const { sign:promoSign='',  price:promoPrice='',  strPrice:promoStartingPrice='', } = goodsPriceModel.basePrice || {};
        const goodsHref = getGoodsPageUrlByAction(action, { cid: 'recitri', oid: 'BfM', ctype: 'B', });
        goodsElementsString += getRecommendLiHTMLString({ goodsCode, goodsName: title, imgUrl: contentImage, originSign, originPrice, originStartingPrice, promoSign, promoPrice, promoStartingPrice, goodsHref, goodsTags, goodsImgHeight: '110', liPrefixClassName: 'eb_YOU_LIKE-', hrefClassName: 'ebdBuyPic', isInstantGoodsStatus, })
        return goodsElementsString;
      }, '')
  
      // 渲染
      momoj('#bt_0_269_01 .boxcontent ul').append(momoj(goodsElementsString));
      // 啟動輪播
      momoj('#bt_0_269_01').showBtByArrow({ showBtNum: perSlideGoodsElementsQuantity });

    }).then(() => {
      // lazyload fetch InstantGoodsStatus api
      const updateGoodsInfo = () => {
        // 取 需要被更新 的 商品資料
        const needUpdatedGoodsCodes = Array.from(
          new Set(
            getPreviousAndNextPageSliderGoodsElements({ containerElementSelector: '#bt_0_269_01 .boxcontent ul', goodsElementSelector: '#bt_0_269_01 .boxcontent ul > [gcode]', })
              .map(element => {
                if (element.getAttribute('isInstantGoodsStatus') === 'false') {
                  return element.getAttribute('gcode');
                }
              })
          )
        ).filter(Boolean);
        // 打 InstantGoodsStatus 更新商品元素
        if (needUpdatedGoodsCodes.length !== 0) {
          fetchInstantGoodsStatus({
            apiParam: {
              columnType: '55',
              priceDescrip: true,
              implementTypes: ['price'],
              goodsCodes: needUpdatedGoodsCodes,
            }
          }).then(rawResponse => {
            const instantGoodsResponse = new InstantGoodsAjaxToolResponse(rawResponse);
            if (instantGoodsResponse.isSuccess) {
              for (const [goodsCode, instantGoodsInfo] of Object.entries(instantGoodsResponse.rtnData)) {
                const blockElement = document.querySelector('#bt_0_269_01 .boxcontent ul');
                const goodsElements = blockElement.querySelectorAll(`[gcode="${ goodsCode }"]`);
                const { goodsPriceModel={}, marketPriceModel={}, } = instantGoodsInfo;
                const { sign:originSign='', price:originPrice='', strPrice:originStartingPrice='', goodsStatus:originGoodsStatus='',} = marketPriceModel.basePrice || {};
                const { sign:promoSign='',  price:promoPrice='',  strPrice:promoStartingPrice='', goodsStatus:promoGoodsStatus='',  } = goodsPriceModel.basePrice || {};
                goodsElements.forEach(goodsElement => {
                  const currentPriceElement = goodsElement.querySelector('.current-price');
                  const originPriceElement = goodsElement.querySelector('.origin-price');
                  if (currentPriceElement) {
                    currentPriceElement.innerHTML = `${ promoSign }<b>${ promoPrice }</b><span class="price-from">${ promoStartingPrice }</span>`;
                  }
                  if (originPriceElement) {
                    originPriceElement.innerHTML = `${ originSign }<b>${ originPrice }</b><span class="price-from">${ originStartingPrice }</span>`;
                  }
                  goodsElement.setAttribute('isInstantGoodsStatus', 'true');
                })
              }
            }
          }).catch(() => {})
        }
      }
      // 執行
      updateGoodsInfo(); // 啟動時
      document.querySelector('#bt_0_269_01 .boxcontent .leftarrow').addEventListener('click', () => setTimeout(updateGoodsInfo)); // 左箭頭
      document.querySelector('#bt_0_269_01 .boxcontent .rightarrow').addEventListener('click',() => setTimeout(updateGoodsInfo)); // 右箭頭
    })
  }
}

/**
 * 分類頁 推薦版位(您專屬推薦商品--館主/館首/小分類) 開始==============================
 * @author tashuchiu
 */
function getCategoryRecommandBlock(_htmlCss) {//傳入css字串
  let amountOfGoods = _bgwPoc.displayGoodsOfHistory;//您專屬推薦商品商品數量 12
  let cateCode = momoj('#goodsAttrRoot').attr('cateCode');
  if (!cateCode) {
    return;
  }
  let showDivId = false;
  let apiParam = getColumnGoodsContentApiParam({ type: 'category_RecommandGoods' }); // 選擇 request body 模板
  apiParam.cateCode = cateCode;
  fetchColumnGoodsContent({ apiParam }).then(async responseInfo => { //打 API getColumnGoodsContent
    const columnGoodsContentAjaxToolResponse = new ColumnGoodsContentAjaxToolResponse(responseInfo);
    if (!columnGoodsContentAjaxToolResponse.isSuccess) { return }; // API 回傳失敗直接 return
    let originalContentLength = columnGoodsContentAjaxToolResponse.contentInfo.length;
      if (originalContentLength == 0) {return;}//API回傳品數為0直接return
      let goodsInfoList = columnGoodsContentAjaxToolResponse.contentInfo.slice(0, amountOfGoods);//確保畫面顯示商品數量>0,且最多為displayGoodsOfHistory之數量
      showDivId = true;
      const divId = 'recGoods';
      const goodsElementsString = genCategoryRecommandHtml(goodsInfoList, divId);//組成HTML字串
      let pageType = _bgwPoc.func;
      let HTML = getInsertHtmlType(pageType);

      if (pageType == 'fL' && showDivId) {
        HTML.append(momoj(goodsElementsString));
        // 綁定事件
        momoj(`#${divId}`).data("StartTab", 1);
        momoj(`#${divId}`).TabDelay({ RollerSpeed: 0 });
        if (momoj('#bt_2_layout_b1') && _htmlCss) {
          momoj('#bt_2_layout_b1').append(_htmlCss.join('')); //插入css
        };
        //左右按鈕
        setArrowClick(divId);
      }

      if (pageType == 'fD' && showDivId) {
        HTML.append(momoj(goodsElementsString));
        // 綁定事件
        momoj(`#${divId}`).data("StartTab", 1);
        momoj(`#${divId}`).TabDelay({ RollerSpeed: 0 });
        if (momoj('#Dgrp_rightExtend') && _htmlCss) {
          momoj('#Dgrp_rightExtend').append(_htmlCss.join(''));//插入css
        };
        //左右按鈕
        setArrowClick(divId);
      }
    //抓8003回來isInstantGoodsStatus=false的品號，因2057一次只會更新10個商品的價錢
    let goodsCodeToUpdate = goodsInfoList.filter(item => item.isInstantGoodsStatus === false).map(item => item.goodsCode);
    let apiParam = {
      columnType: '52',//您專屬推薦(館首/館主/小分類)
      priceDescrip: true,
      implementTypes: ['price','imgTag'],
      goodsCodes: goodsCodeToUpdate
    }
    const apiResponse = goodsCodeToUpdate.length != 0 ? await fetchInstantGoodsStatus({ apiParam }) : {};
    const instantGoodsResponse = new InstantGoodsAjaxToolResponse(apiResponse);
    instantGoodsResponse.isSuccess ? updatePriceForCategoryRecommand(instantGoodsResponse) : null;
  });
/**
 * 由於 2055 getColumnGoodsContent 價錢圓標的部分每次只會更新10筆資料的一品多價部分，導致需要多打 8003 getInstantGoodsStatus 來再次更新商品一品多價
 * @param {*} apiResponse api 回傳需要更新的品號資訊，並且更新畫面
 * @author tashuchiu
 */
  function updatePriceForCategoryRecommand(apiResponse) {
    let loopData = apiResponse?.rtnData;

    Object.keys(loopData).forEach(key => {
      const currentData = loopData[key];//key=需要被更新的品號(api回來的)
      let priceElement = momoj(`#recGoods li a[item="${key}"] .current-price b`);
      let strPriceElement = momoj(`#recGoods li a[item="${key}"] .current-price .price-from`);
      let signElement = momoj(`#recGoods li a[item="${key}"] .prdPrice current-price`);
      let imgTagElement = momoj(`#recGoods li a[item="${key}"] .imgTag`);
      let longTagElement = momoj(`#recGoods li a[item="${key}"] .imgTagRectangle`);
      let bottonTagElement = momoj(`#recGoods li a[item="${key}"] .imgTagBottom`);

      const { goodsPriceModel, imgTagUrl, imgLongTagUrl, imgBottomTagUrl } = currentData || {};
      const { basePrice } = goodsPriceModel || {};
      const { sign = '', price = '', strPrice = '' } = basePrice || {};

      priceElement.text(price);
      strPriceElement.text(strPrice);
      signElement.text(sign);
      imgTagElement.text(imgTagUrl);
      longTagElement.text(imgLongTagUrl);
      bottonTagElement.text(imgBottomTagUrl);
    });
  }
}
/**
 * 依照畫面種類決定插入HTML字串的板塊
 * @param {*} _bgwPoc_fun
 * @author tashuchiu
 * @returns {String} 回傳html要插入的目標板塊
 */
function getInsertHtmlType(_bgwPoc_fun){ //吃_bgwPoc.func變數
  var _bObj = null;
  if(_bgwPoc.func == 'fD') {//分類頁
    if (momoj('#prdlistArea').length == 1) {
      _bObj = momoj('#Dgrp_BodyBigTableBase .bt_2_layout_b1');
    }else if (momoj('#Dgrp_rightExtend').length > 0) {
      _bObj = momoj('#Dgrp_rightExtend');
    }else{
      _bObj = momoj('#Dgrp_LCatRightPBase');
    }

  } else if(_bgwPoc.func == 'fL') {//分類頁
    _bObj = momoj('#bt_2_layout_b1'); 
  }
  return _bObj;
}

// 分類頁 推薦版位 (您專屬推薦商品--館主/館首/小分類)結束 ==============================
/* ================================================================================= */


  // 商品頁 熱門推薦 開始===============
  /**
   * 商品頁之熱門推薦頁面
   * @param {fetchRecommendGoodsByQuantityData} responseInfo
   * @returns {Array<RecommendGoodsInfo>}
   * @author tclien
   */
async function getGoodsHotRecommandBlock(){
  const goodsCode = getGoodsCodeFromUrl();
  let amountOfGoods = _bgwPoc.displayGoodsOfWhoBuy //商品頁(熱門推薦/熱銷排行) 40 個商品
    const responseInfo = await fetchRecommendGoods({
      apiParam: getRecommendGoodsApiParam({
      type: 'goods',
      goodsCodeParam :goodsCode
      }),
      goodsQuantity: amountOfGoods,
    })
      const goodsInfoList = responseInfo.goodsInfoList.slice(0,amountOfGoods);
      const recomdId = responseInfo.responseList[0].recomd_id;
      let isSuccess = responseInfo.isSuccess;
      const divId = 'recGoods2'; // 產 此區所有 <li> HTML String
      const goodsElementsString = genRecordAreaHtml(goodsInfoList, divId,recomdId);
      // 渲染
      // 商品頁的熱門推薦和熱門排行改在瀏覽紀錄前面
      var browsingHistroy = momoj(".recordArea");
      if(browsingHistroy){
        browsingHistroy.before(goodsElementsString);
      } else {
        momoj('#productForm .prdwarp').append(momoj(goodsElementsString));
      }


      // 綁定事件
      momoj(`#${divId}`).data("StartTab",1);
      momoj(`#${divId}`).TabDelay({RollerSpeed: 0});
      if (!isSuccess) {
        momoj(`#${divId}`).hide(); // 整區隱藏
          return;
        }

      // 埋點
      sendRecommendId(recomdId);
      setOutfitMouseHover(divId, recomdId);
      setInterSectionObserver(divId, recomdId);
      setGoodsItemClick(divId, recomdId);
      setArrowClick(divId, recomdId);
}
  // 商品頁 熱門推薦 結束============================

  //商品頁  熱門排行  開始============================
async function getGoodsHotRankBlock(){
  const categoryCode = momoj('#categoryCode').val() || '';
  const goodsCode = getGoodsCodeFromUrl();
  let amountOfGoods = _bgwPoc.displayGoodsOfWhoBuy //商品頁(熱門推薦/熱銷排行) 40 個商品
  const responseInfo = await fetchRecommendGoods({
        apiParam: getRecommendGoodsApiParam({
          type: 'hotSaleRank',
          goodsCodeParam :goodsCode,
          goodsSortedCodeParam:categoryCode
        }),
       goodsQuantity: amountOfGoods,
    });
  const goodsInfoList = responseInfo.goodsInfoList.slice(0,amountOfGoods);
  const recomdId = responseInfo.responseList[0].recomd_id;
  let isSuccess = responseInfo.isSuccess;
  // 產 此區所有 <li> HTML String
  const divId = 'recGoods3';
  const goodsElementsString = genRecordAreaHtml(goodsInfoList,divId,recomdId);
  // 渲染
  var browsingHistroy = momoj(".recordArea");
  if(browsingHistroy){
    browsingHistroy.before(goodsElementsString);
  } else {
     momoj('#productForm .prdwarp').append(momoj(goodsElementsString));
  }

  // 綁定事件
  momoj(`#${divId}`).data("StartTab",1);
  momoj(`#${divId}`).TabDelay({RollerSpeed: 0});
  if (!isSuccess) {
    momoj(`#${divId}`).hide(); // 整區隱藏
    return;
  }

    // 埋點
  sendRecommendId(recomdId);
  setOutfitMouseHover(divId, recomdId);
  setInterSectionObserver(divId, recomdId);
  setGoodsItemClick(divId, recomdId);
  setArrowClick(divId, recomdId);
}
// 商品頁 熱門排行 結束============================

/**
 * @description 商品頁(熱門推薦/熱銷排行)，館主/大分類/小分頁(您專屬推薦商品)HTML標題區塊
 * @param {String} divId 
 * @param {String} ulId
 * @param {String} seoTagH3ToP
 * @param {String} maskBtnClass
 * @param {String} layout
 * @param {String} category
 * @author tclien
 */
function getPageConfig(divId) {
  const config = {
    'recGoods2': {
      ulId: 'tabRecordAreaNew1',
      seoTagH3ToP: '<div class="recordTitle"><span class="forArrow"></span>熱門推薦</div>',
      maskBtnClass: 'mask',
      layout :'oav',
      category : '熱門推薦',
    },

    'recGoods3': {
      ulId: 'tabRecordAreaNew3',
      seoTagH3ToP: '<p class="recordTitle"><span class="forArrow"></span>熱銷排行</p>',
      maskBtnClass: 'mask',
      layout : 'hotSale',
      category : '熱銷排行',
    },

    'recGoods': {
      ulId: 'tabRecordAreaNew2',
      seoTagH3ToP: '<p class="titleName"><span class="forArrow"></span>您專屬推薦商品</p>',
      maskBtnClass: 'recommendBtn'
    }

  };
  return config[divId] ||{};

}
/**
 * 傳入商品列表跟目標區塊，回傳組好的HTML字串，使用於商品頁(熱門推薦/熱門排行)，館主頁/大分類/小分類頁(您專屬推薦商品)
 * @param {*} goodsInfoList 
 * @param {*} divId 
 * @returns {String}
 * @author tclien
 */
function genRecordAreaHtml(goodsInfoList, divId,recomdId) {
  const countOfGoodsInTab = 4;
  const tabNum = Math.ceil(goodsInfoList.length / countOfGoodsInTab);
  const { ulId, seoTagH3ToP, maskBtnClass /*,tabNum = 0 */} = getPageConfig(divId);

  let goodsCodes1P = new Array();
  let goodsCodes3P = new Array();
  momoj.each(goodsInfoList, function (i, goods) {
    const goodsCode = goods.goodsCode;
    if (goodsCode.startsWith("TP")) {
      goodsCodes3P.push(goodsCode);
    }else{
      goodsCodes1P.push(goodsCode);
    }
  });
  // 取得1P折價卷
  const goodsPromoPriceDatas1P = get1PGoodsPromoPriceDatas(goodsCodes1P, true, true);
  const goodsPromoPriceDatas3P = get3PGoodsPromoPriceDatas(goodsCodes3P);


  // 產生tab menu
  let listLi = '';
  for (let i = 0; i < tabNum; i++) {
    listLi += `<li class="${i  === 0 ? 'selected' : ''}"><a class="First-Element">${i + 1}<b></b></a></li>`;
  }
  let tabContentDListHtml = '';
  for(let i=0; i < tabNum; i++) {
    const selectedTabClass=i===0 ? 'selected':'';
    tabContentDListHtml += `<div class="TabContentD ${selectedTabClass}"><ul>`;
    for(let j=0; j < countOfGoodsInTab; j++) {
      const num = (i*countOfGoodsInTab) + j;
      if (num < goodsInfoList.length) {
        const goodsInfo = goodsInfoList[num];
        const goodsCode = goodsInfo.goodsCode;
        const promoF = checkPromoF(goodsCode, goodsPromoPriceDatas1P,goodsPromoPriceDatas3P) ;
        const goods = {
          'imgUrl':goodsInfo.imgUrl,
          'goodsName':goodsInfo.goodsName,
          'goodsCode':goodsCode,
          'imgLongTagUrl':goodsInfo.imgLongTagUrl,
          'imgBottomTagUrl':goodsInfo.imgBottomTagUrl,
          'imgTagUrl':goodsInfo.imgTagUrl,
          'goodsTag':goodsInfo.goodsTag,
          'action':goodsInfo.action,
          'goodsPriceModel':goodsInfo.goodsPriceModel,
          'marketPriceModel':goodsInfo.marketPriceModel,
          'promoF':promoF,
        }
        tabContentDListHtml += genSingleGoodsHtml(goods,recomdId);
      }
    }
    tabContentDListHtml += `</ul></div>`;
  }
  return `<div id="${divId}" class="recordAreaNew">`+
    `${seoTagH3ToP}`+
      `<div class="TabMenu">`+
       ` <ul class="tabMenu_number" id="${ulId}">`+
          `${listLi}`+
        `</ul>`+
      `</div>`+
      `<div class="view TabContent">`+
             ` ${tabContentDListHtml} `+
        `<span class="${maskBtnClass} rightmask"><a class="rightBtn"></a></span>`+
        `<span class="${maskBtnClass} leftmask"><a class="leftBtn"></a></span>`+
      `</div>`+
    `</div>`;
}


/**
 * 分類頁<您專屬推薦商品>產生HTML專用(館主/大分類/小分類)=============================================
 * @param {Object} goodsInfoList 商品資訊
 * @param {String} divId 當前 loop 到的板塊
 * @author tashuchiu
 */
function genCategoryRecommandHtml(goodsInfoList, divId) {
  const countOfGoodsInTab = 4;//畫面顯示4個品項
  const tabNum = Math.ceil(goodsInfoList.length / countOfGoodsInTab);//計算總共需要多少上方橫欄
  const { ulId, seoTagH3ToP, maskBtnClass /*,tabNum = 0 */} = getPageConfig(divId);
  let goodsCodes = goodsInfoList.map(item => item.goodsCode);
  let goodsCodeInfo = { goodsCodes1P:[], goodsCodes3P:[]};
   goodsCodes.forEach(code => code.startsWith("TP")
      ?goodsCodeInfo.goodsCodes3P.push(code)
      :goodsCodeInfo.goodsCodes1P.push(code)
    );

  // 取得1P折價卷
  const goodsPromoPriceDatas1P_category = get1PGoodsPromoPriceDatas(goodsCodeInfo.goodsCodes1P, true, true);  
  const goodsPromoPriceDatas3P_category = get3PGoodsPromoPriceDatas(goodsCodeInfo.goodsCodes3P);

  // 產生tab menu
  let listLi = '';
  for (let i = 0; i < tabNum; i++) {
    listLi += `<li class="${i  === 0 ? 'selected' : ''}"><a class="First-Element">${i + 1}<b></b></a></li>`;
  }
  let tabContentDListHtml = '';
  for(let i=0; i < tabNum; i++) {
    const selectedTabClass=i===0 ? 'selected':'';
    tabContentDListHtml += `<div class="TabContentD ${selectedTabClass}"><ul>`;
    for(let j=0; j < countOfGoodsInTab; j++) {
      const num = (i*countOfGoodsInTab) + j;
      if (num < goodsInfoList.length) {
        const goodsInfo = goodsInfoList[num];
        const goodsCode = goodsInfo.goodsCode;

        const promoF = checkPromoF(goodsCode, goodsPromoPriceDatas1P_category,goodsPromoPriceDatas3P_category) ;        
        const goods = {
          'contentImage':goodsInfo?.contentImage,
          'goodsName':goodsInfo?.title,
          'goodsCode':goodsCode,
          'imgLongTagUrl':goodsInfo?.imgLongTagUrl,
          'imgBottomTagUrl':goodsInfo?.imgBottomTagUrl,
          'imgTagUrl':goodsInfo?.imgTagUrl,
          'goodsTag':goodsInfo?.goodsTag,
          'action':goodsInfo?.action,
          'goodsPriceModel':goodsInfo?.goodsPriceModel,
          'marketPriceModel':goodsInfo?.marketPriceModel,
          'promoF':promoF,
          'imgUrl':goodsInfo?.imgUrl,
        }
        tabContentDListHtml += genSingleGoodsHtml(goods);
      }
    }
    tabContentDListHtml += `</ul></div>`;
  }
  
  let template1 = '';
  let template2 = '';
  if(_bgwPoc.func == 'fD'){
     template1 = '<div class="Dgrp_rightExtend">';
     template2 = '<div>';
  }

    return innserHTMLTemplate =
  ` ${template1}`+
    `<div id="${divId}" class="recordAreaNew">`+
      `${seoTagH3ToP}`+
        `<div class="TabMenu">`+
          `<ul class="tabMenu_number" id="${ulId}">`+
            `${listLi}`+
          `</ul>`+
        `</div>`+
        `<div class="view TabContent">`+
                `${tabContentDListHtml}`+
          `<span class="${maskBtnClass} rightmask"><a class="rightBtn"></a></span>`+
          `<span class="${maskBtnClass} leftmask"><a class="leftBtn"></a></span>`+
        `</div>`+
      `</div>`+
    `${template2}`
}
//===============//分類頁<您專屬推薦商品>產生HTML專用(館主/大分類/小分類)結束====================================

   
 /**
  * 組推薦版位HTML
  * @param {*} goods 
  * @returns 
  * @author tclien
  */
function genSingleGoodsHtml(goods,recomdId=''){
  const { sign:promoSign='',  price:promoPrice='',  strPrice:promoStartingPrice='' } = goods?.goodsPriceModel?.basePrice || {};
  const price = promoPrice !== '' ? promoPrice :'熱銷一空';
  const sign  = promoSign != '' ? promoSign:'$';
  let  strPrice = promoStartingPrice;
  let  customParams = {recomd_id:recomdId};// 呼叫 getGoodsPageUrlByAction 使用的參數
  let  goodsHref = getGoodsPageUrlByAction(goods.action || {},customParams);
  const newUrl = new URL(goodsHref);
  newUrl.searchParams.delete('mdiv');
  newUrl.searchParams.delete('cc1');
  goodsHref = newUrl .toString();
  let html=`<li><a href="${goodsHref}" target="_top" title="${ goods.goodsName }" block="itri" class="REC" item="${goods.goodsCode}">`;
 
  //插入圓標圖和上下標圖
  if (goods.imgTagUrl || goods.imgLongTagUrl || goods.imgBottomTagUrl ){
    html+=`<div class="prdImgWrap">`;
    if (goods.imgTagUrl ){
      html+=`<div class="imgTag"><img src="${goods.imgTagUrl}"></div>`;
    }
    if (goods.imgLongTagUrl ){
      html+=`<div class="imgTagRectangle"><img src="${goods.imgLongTagUrl}"></div>`;
    }
    if (goods.imgBottomTagUrl ){
      html+=`<div class="imgTagBottom"><img src="${goods.imgBottomTagUrl}"></div>`;
    }
    html+=`<img width="200" height="200" src="${goods.contentImage||goods.imgUrl}"></div>`;
  } else {
    html+=`<img width="200" height="200" src="${goods.contentImage||goods.imgUrl}">`;
  }
      let tag = '<span class="icon-group">' ;
      if(Array.isArray(goods.goodsTag) && goods.goodsTag.length > 0){
        momoj.each(goods.goodsTag, function(i, gTag){
          
          if(gTag.content === '&#24215;&#8314;' && goods.goodsCode.startsWith("TP")){
            tag += `<span class="icon-store style="background:${gTag.bgColor}"><img src="${gTag.imgUrl}" alt="店+" /></span>`;
          }
          if (gTag.content === '預') {
            tag += `<span class="icon-preorder style="background:${gTag.bgColor}"><img src="${gTag.imgUrl}" alt="預" /></span>`;  
          }  
        })
      }
      tag +='</span>';
      html+=`<p><span class="prdName">${tag}${ goods.goodsName }</span>`;
      html+=`<span class="prdPrice current-price">${goods.promoF }${sign}<b>${price}</b><span class="price-from">${strPrice}</span></span></p></a></li>`;
        
      return html;

}



/**
 * 埋點
 * @param {*} divId 
 * @param {*} selectedIndex 
 * @param {*} eventType 
 * @param {*} recomdId 
 * @returns 
 * @author tclien
 */
function collectTrackData(divId, selectedIndex, eventType, recomdId) {
  const { layout } = getPageConfig(divId);
  if (!layout){// 若無資料則直接中斷後續執行
    return [];
  }   
 
  const page = selectedIndex + 1;
  const trackData = [];
  const countOfGoodsInSingleTab = momoj(`#${divId} .TabContentD:first-child ul li`).length; // 單一個頁籤的商品數
  momoj(`#${divId} .TabContentD:eq(${selectedIndex}) ul li`).each(function (i) {
    const currentIndex = i + (selectedIndex * countOfGoodsInSingleTab);
    trackData.push(packTrackData(momoj(this), layout, currentIndex, page, i + 1));
  });
  sendMomowaTrackBlockItemEvent(trackData, eventType, recomdId);
  return trackData;
 }
 /**
 * 
 * @param {*} currentIndex 商品總數的索引
 * @param {*} page 第幾個頁籤
 * @param {*} position 當下頁籤的第幾個商品
 * @author tclien
 */
 function packTrackData(currentLi, layout, currentIndex, page, position) {
  const link = currentLi.find('a').length > 0 ? currentLi.find('a') : currentLi.closest('a');
  const url = `${link.attr("href")}&mdiv=GoodsDetail-${layout}-${currentIndex}&page=${page}&position=${position}`;
  let priceElement = currentLi.find("a .prdPrice b");
  if (priceElement.length === 0) {
    priceElement = currentLi.closest('a').find(".prdPrice b");
  }
  let price = Number((priceElement.html() || '').replace(',', '')) || 0;
  return { itemPageUrl: url, page, position, price, visibilityRate: 100 };
  }
 
 /**
  * 
  * @param {*} divId 
  * @param {*} recomdId 
  * @author tclien
  */
 function setInterSectionObserver(divId, recomdId) {
  //觀察 targetEle 可視區域
  function processIntersectionCallback(entry) {
    const ratio = entry.intersectionRatio;
    const visibilityRate = toPercentage(ratio, 2);
    const name = 'impression'; 
    //版位曝光收數埋點
    let { layout, category } = getPageConfig(divId);
    let label = `GoodsDetail-${layout || ''}`;
    let eventCategory = `大網_商品頁版位_${category || ''}`;
  
    sendMomowaTrackActionEvent(eventCategory, label, name, recomdId);
 
    const selectedIndex = momoj(`#${divId} .TabMenu ul.tabMenu_number li.selected`).index();
    collectTrackData(divId, selectedIndex, name, recomdId);
  }
  const targetEle = document.querySelector(`#${divId}`);
  
  newIntersectionObserver([targetEle], processIntersectionCallback);
 }
 
 
 

 /**
  * 推薦區塊右上方tab mouseover 綁定
  * @param {*} divId 
  * @param {*} recomdId 
  * @author tclien
  */
 function setOutfitMouseHover(divId, recomdId){
  momoj(`#${divId} .TabMenu ul.tabMenu_number li`).mouseover(function(){
    const selectedIndex = momoj(`#${divId} .TabMenu ul.tabMenu_number li`).index(this); // 當下點擊頁籤
    collectTrackData(divId, selectedIndex, "impression", recomdId);
  });
 }
 
 
 
 /**
 * 綁定推薦商品點擊事件，並記錄埋點數據
 * @param {string} divId - 版位區塊的 ID
 * @param {string} recomdId - 推薦區塊的識別碼
 * @author tclien
 */
 function setGoodsItemClick(divId, recomdId){
  momoj(`#${divId} .TabContentD ul li a`).on('click', function(){
    const { layout } = getPageConfig(divId);
    if (!layout) {
        return;  // 若無資料則直接中斷後續執行
    }
    const currentIndex = momoj(`#${divId} .TabContentD ul li a`).index(this);
    const currentTabMenuLi = momoj(`#${divId} .TabMenu ul.tabMenu_number li.selected`);
    const page = momoj(`#${divId} .TabMenu ul.tabMenu_number li`).index(currentTabMenuLi) + 1;
    const countOfGoodsInSingleTab = momoj(`#${divId} .TabContentD:first-child ul li`).length; // 單一個頁籤的商品數
    const position = (currentIndex % countOfGoodsInSingleTab) + 1;
    const trackData = [];
    trackData.push(packTrackData(momoj(this), layout, currentIndex, page, position));
 
    sendMomowaTrackBlockItemEvent(trackData, "click", recomdId);
  });
 }
 
 
 /**
 * 處理左右箭頭點擊事件，切換 Tab 並記錄埋點數據。
 * @param {string} divId - 目標區塊的 ID。
 * @param {string} direction - 點擊方向 ('left' 或 'right')。
 * @param {string} recomdId - 推薦區塊的埋點 ID。
 * @author tclien
 */
 const handleArrowClick = function(divId, direction, recomdId) {
  const length = momoj(`#${divId} .TabMenu .tabMenu_number li`).length;
  let selectedIndex = momoj(`#${divId} .TabMenu .tabMenu_number li.selected`).index();
 
  if (direction === 'left') {
    selectedIndex = (selectedIndex - 1 < 0) ? length - 1 : selectedIndex - 1;
  } else if (direction === 'right') {
    selectedIndex = (selectedIndex + 1 >= length) ? 0 : selectedIndex + 1;
  }
 
  collectTrackData(divId, selectedIndex, "impression", recomdId);
  changeTabAndContent(divId, selectedIndex);
 }
 
 /**
  * 
  * @param {*} divId 
  * @param {*} recomdId 
  * @author tclien
  */
 const setArrowClick = function (divId, recomdId) {
  momoj('#' + divId).delegate('.leftBtn' , 'click', function(e) {
    handleArrowClick(divId, 'left', recomdId);
  });
 
  momoj('#' + divId).delegate('.rightBtn' , 'click', function(e) {
    handleArrowClick(divId, 'right', recomdId);
  });
 };


/**
 * 取得1P商品資訊
 * @param {*} goodsCodes1P 
 * @param {*} hasOImage 
 * @param {*} hasGoodsPromoIcon 
 * @returns
 * @author tclien
 */
 const get1PGoodsPromoPriceDatas = function(goodsCodes1P, hasOImage, hasGoodsPromoIcon){
  if (goodsCodes1P.length === 0) {
    return {};
  }
  var jsonObj = {
    data: {
      flag: 2002,
      promo_yn: 'Y',
      goodsCode: goodsCodes1P,
      O_image_yn: hasOImage ? 'Y' : 'N',
      isNotCallGetGoodsPromoIcon: hasGoodsPromoIcon ? 'Y' : undefined
    }
  };
  var goodsPromoPriceDatas1P = momoj.ajaxTool(jsonObj);

  return typeof goodsPromoPriceDatas1P == 'undefined' ? {} : goodsPromoPriceDatas1P;
}
/**
 * 取得3P商品資訊
 * @param {*} goodsCodes3P 
 * @returns
 * @author tclien
 * 
 */
const get3PGoodsPromoPriceDatas = function(goodsCodes3P){
  if (goodsCodes3P.length === 0) {
    return {};
  }
  var jsonObj = {
    data: {
      flag: 2057,
      goodsCode: goodsCodes3P,
    }
  };
  var goodsPromoPriceDatas3P = momoj.ajaxTool(jsonObj);

  return typeof goodsPromoPriceDatas3P == 'undefined' ? {} : goodsPromoPriceDatas3P;
}

/**
 * 折價卷標籤
 * @param {*} goodsCode 
 * @param {*} goodsPromoPriceDatas1P 
 * @param {*} goodsPromoPriceDatas3P 
 * @returns
 * @author tclien
 * 
 */
const checkPromoF = function(goodsCode, goodsPromoPriceDatas1P,goodsPromoPriceDatas3P) {
  const gc = `GDS-${goodsCode}`;
  let promoTag = ''; // 預設為空字串

  if(goodsCode.startsWith("TP")){
    // 處理 3P 折價券標籤
    if (goodsPromoPriceDatas3P) {
      momoj.each(goodsPromoPriceDatas3P.rtnGoodsData, function(key, value) {
        if (key === gc &&value.icon && value.icon.length > 0) {
          let iconData = value.icon[0];
          promoTag += `<i class="goods-tag" style="background-color: ${iconData.iconBgColor}; color: ${iconData.iconContentColor}">${iconData.iconContent}</i>`;
          return false;
        }
      });
    }
  }else{
    if(goodsPromoPriceDatas1P){
      momoj.each(goodsPromoPriceDatas1P.rtnData, function(key, value) {
        if (key === gc && value.CP_YN === "1" && value.ENTP_COMM_YN !== "1") {
          promoTag = '<img alt="可使用折價券" title="可使用折價券" src="//img1.momoshop.com.tw/ecm/img/cmm/category/couponsIcon.png">';
          return false; // 終止 each 迴圈
        }
      });
    }

  }
  return promoTag;
};
