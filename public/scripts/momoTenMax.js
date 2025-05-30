var tenMaxDomain = "//static-cdn.momoshop.com.tw";
var tenMaxRtqId = 'f9c4a969-baa3-4025-8510-ee0e210fa11c';
if (!/(www|m)\.momoshop\.com\.tw/.test(location.hostname)) {
  tenMaxDomain = "//uat-static-cdn.momoshop.com.tw";
  tenMaxRtqId = "10cc39b6-4576-11ee-be56-0242ac120002";
}
//TenMax ECDMP pageView Event
'use strict';
(function(win, doc, scriptTagName, src, _rtq, newScriptElement, rootScriptElement) {
    if (win.rtq) return;
    _rtq = win.rtq = function() {
    if (_rtq.callMethod) _rtq.callMethod.apply(_rtq, arguments);
    else _rtq.queue.push(arguments)
    };
    _rtq.feedJsPathPrefix = "https:"+tenMaxDomain+"/trackcode/f/";
    _rtq.queue = [];
    newScriptElement = doc.createElement(scriptTagName);
    rootScriptElement = doc.getElementsByTagName(scriptTagName)[0];
    newScriptElement.async = true;
    newScriptElement.src = src;
    rootScriptElement.parentNode.insertBefore(newScriptElement, rootScriptElement)
})(window, document, "script", "https:"+tenMaxDomain+"/trackcode/loader.js", "rtq");
rtq('init', tenMaxRtqId);
rtq('track', 'pageView');
//End TenMax ECDMP pageView Event

if(momoj().cookie("loginRsult") != null  && momoj().cookie("loginRsult") == '1'){
    sendTenMaxLogin();
}

//TenMax ECDMP identify Event
function sendTenMaxLogin(){
    if(momoj().cookie("loginRsult") != null  && momoj().cookie("loginRsult") == '1'){
        var ccmedia = momoj().cookie('ccmedia') || '';
        var __rtq_var = {
        "cid": ccmedia.split('_/')[0].replace('"', ''),
        "pn": "",
        "em": ""
        };
        rtq('track', 'identify', __rtq_var);
    }
}

// TenMax ECDMP viewContent Event
function sendTenMaxViewContent(tenMaxViewContent){
    var tenMaxCategory = remarketingCategoriesName().join(',');
    if(Object.keys(tenMaxViewContent).length > 0){
        var __rtq_var = {
        "productId": tenMaxViewContent.productId,
        "skuIds": "",
        "name": tenMaxViewContent.name,
        "description": "",
        "brand": tenMaxViewContent.brand,
        "salePrice": tenMaxViewContent.salePrice,
        "listPrice": "",
        "currency": "TWD",
        "category": tenMaxCategory
        };
        rtq('track', 'viewContent', __rtq_var);
    }
}


//TenMax ECDMP addToCart Event
function sendTenMaxAddToCart(tenMaxAddToCart){
    var tenMaxCategory = remarketingCategoriesName().join(',');
    if(Object.keys(tenMaxAddToCart).length > 0){
        var __rtq_var = {
        "productId": tenMaxAddToCart.productId,
        "skuId": "",
        "name": tenMaxAddToCart.name,
        "currency": "TWD",
        "quantity": tenMaxAddToCart.quantity,
        "salePrice": tenMaxAddToCart.salePrice,
        "listPrice": "",
        "category": tenMaxCategory
        };
        rtq('track', 'addToCart', __rtq_var);
    }
}

//組出tenmax搜尋廣告要用的麵包屑文字內容
function remarketingCategoriesName(){
    var remarketingCategoriesName = [];
    momoj('#bt_2_layout_NAV').find('ul').find('li').each(function(){
      var _this = momoj(this);
      var cateTmp = _this.text();
      remarketingCategoriesName.push(cateTmp);
    });
    return remarketingCategoriesName;
}

//插入PC版位(O圖)_熱銷排榜下方
function addMainTenmaxHtml(){
  var insertTenmaxHtml = momoj('<div id="tenmaxBanner"></div>').append('<script id="pc_index_5c92b35c15f04527" src="https:'+tenMaxDomain+'/widget/pc_index_5c92b35c15f04527.js"></script>');
  if(location.href.toString().indexOf("Main.jsp") && momoj("#bt_0_255_01").length > 0){
    momoj("#bt_0_255_01").after(insertTenmaxHtml);
  }
}

//插入PC商品頁版位(O圖, Banner),推薦版位第一區上方
function addGoodsTenmaxHtml(){
  var insertGoodsTenmaxBanner1 = `<div><script id="pc_goods_76f92200e3034144" src="https:${tenMaxDomain}/widget/pc_goods_76f92200e3034144.js"></script></div>`;
  var insertGoodsTenmaxBanner2 = `<div><script id="pc_goodsDetail_a996be12c1a14d90" src="https:${tenMaxDomain}/widget/pc_goodsDetail_a996be12c1a14d90.js"></script></div>`;
  if(location.href.toString().indexOf("GoodsDetail.jsp") && momoj("#tenmaxBanner").length > 0){
    momoj("#tenmaxBanner").append(insertGoodsTenmaxBanner1).append(insertGoodsTenmaxBanner2);
  }
}
//插入PC首頁版位(Banner+O圖)_限時搶購與爆殺24上方
function addMainTenMaxBannerOImage(){
  if(momoj("#bt_0_263_01").length > 0) {
    momoj("#bt_0_263_01").before(`<div><script id="pc_index_c90394dd9faf4ed9" src="https:${tenMaxDomain}/widget/pc_index_c90394dd9faf4ed9.js"></script></div>`);
  }
}

//插入PC分類頁版位(Banner)_館主/館首頁下, LgrpCategory.jsp
function addCategoryTenMaxBanner(){
  var banner = `<div><script id="pc_category_60fad7b93f7848b9" data-department-code="${allCategoryCode}" src="https:${tenMaxDomain}/widget/pc_category_60fad7b93f7848b9.js"></script></div>`;
  if(momoj("#bt_2_layout_b1").length > 0) {
    momoj("#bt_2_layout_b1").prepend(banner);
  }
}