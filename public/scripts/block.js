//for bt_2_092 
(function($) {
  var imgOnlinePath = "" ;
  var sslDomain = document.location.href;
  if(sslDomain.match(/momotest.momoshop.com.tw/i) || sslDomain.match(/ecmdev.momoshop.com.tw/i)
      || /momouat[1]?[0-9]{1}\./.test(sslDomain) || sslDomain.indexOf("ecmuati.momoshop.com.tw") > -1
      || /ecmuat[1]?[0-9]{1}\./.test(sslDomain) || /ecmqc[1]?[0-9]{1}\./.test(sslDomain)){    
  }else{
    var imgOnlinePath = "//img1.momoshop.com.tw" ; 
  }
  
  $.fn.CrazyTabDelay = function(btId){
     var _TabMenu = $('#'+btId+' .TabMenu');
     var _TabContentD = $('#'+btId).find('.TabContentD');
     var _count = 0; 
     var _index = 0;
     var _show = new Array();
     _TabMenu.find('li span').each(function(){
        var _span = $(this);
        
        if($.trim(_span.html())!='' && $.trim(_span.html())!='&nbsp;'){
          _show[_index] ='1';
          _count++;
        }else{
          _show[_index]='0';        
          _span.parent('a').parent('li').remove();
          _span.parent('li').remove();
        }        
        _index++;
     });
     _index =0;
     _TabContentD.each(function(){
        if(_show[_index]=='0'){
          $(this).remove();
        }
        _index++;
     });
     
     _TabMenu = $('#'+btId+' .TabMenu');
     _TabContentD = $('#'+btId).find('.TabContentD');
     
     var _TabRan = 0;
     if(_count>1){
        _TabRan =  (Math.round(Math.random()*_count));
        if(_TabRan > 1) _TabRan--;
     }
     
     _TabMenu.find('li').eq(_TabRan).addClass('selected');
     _TabContentD.eq(_TabRan).addClass('selected').show();
     
     _TabContentD.eq(_TabRan).find('[lazy=1],[lazy=2]').each(function(){
      if(!!$.getImgSrc({org:$(this).attr("org")})) {
          $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
    }
        $(this).removeAttr("lazy");
     });
     
     _TabMenu.delegate('li','mouseover',function(){
        _TabContentD.removeClass('selected'); 
        _TabMenu.removeClass('selected'); 
        _TabMenu.find('li').removeClass('selected'); 
        $(this).addClass('selected');
        _TabContentD.eq($(this).index()).addClass('selected').show();
        
        _TabContentD.eq($(this).index()).find('[lazy=1],[lazy=2]').each(function(){
      if(!!$.getImgSrc({org:$(this).attr("org")})) {
            $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
      }
          $(this).removeAttr("lazy");
        });
     });       
             
  }
  
  $.fn.CrazyTabDelay095 = function(btId){ 
     var _TabMenu = $('#'+btId+' .TabMenu');
     var _TabContentD = $('#'+btId).find('.TabContentD');
     var _count = 1; 
     var _index = 1;
     var _show = new Array();
      
     _TabMenu.find('li p').each(function(){
        var _span = $(this);
        if($.trim(_span.html())=='' || $.trim( _span.html())=='0'){
          _show[_index] ='1';
          _count++;
        }else{
          _show[_index] ='0';
          _span.parent('li').remove();
        } 
        _index++;
     });
     
      _index =0;
     _TabContentD.each(function(){
        if(_show[_index]=='0'){
          $(this).remove();
        }
        _index++;
     });

     _TabMenu = $('#'+btId+' .TabMenu');
     _TabContentD = $('#'+btId).find('.TabContentD');
     
     _TabMenu.find('li').each(function(){
       $(this).removeClass('selected');
     });
     _TabContentD.each(function(){
       $(this).removeClass('selected');
     });
     
     var _TabRan = 0;
     if(_count>1){
        _TabRan =  (Math.round(Math.random()*_count));
        if(_TabRan > 1) _TabRan--;
     }
    
     _TabMenu.find('li').eq(_TabRan).addClass('selected');
     _TabContentD.eq(_TabRan).addClass('selected').show();
     
     _TabContentD.eq(_TabRan).find('[lazy=1],[lazy=2]').each(function(){
      if(!!$.getImgSrc({org:$(this).attr("org")})) {
          $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
    }
        $(this).removeAttr("lazy");
     });
     
     _TabMenu.delegate('li','mouseover',function(){
        _TabContentD.removeClass('selected'); 
        _TabMenu.removeClass('selected'); 
        _TabMenu.find('li').removeClass('selected'); 
        $(this).addClass('selected');
        _TabContentD.eq($(this).index()).addClass('selected').show();
        
        _TabContentD.eq($(this).index()).find('[lazy=1],[lazy=2]').each(function(){
      if(!!$.getImgSrc({org:$(this).attr("org")})) {
            $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
      }
          $(this).removeAttr("lazy");
        });
     });     
             
  }
  $.fn.hiddenImg023 = function(){
    $('#bt_A_023_01' + ' .TabContent').find('img').each(function(){
      var _span = $(this);
      var titleStr = _span.attr('title').trim();
      var srcStr = _span.attr('src').trim();
      var altStr = _span.attr('alt').trim();
      
      if(titleStr=='' && srcStr=='' && altStr==''){
        _span.addClass("hiddenImg");
      }else{
        _span.removeClass("hiddenImg");
      }
      
    });
  }
  $.fn.CrazyTabDelay023 = function(btId){
    var _TabMenu = $('#'+btId+' .TabMenu');
    var _TabContentD = $('#'+btId).find('.TabContentD');
    var _count = 0; 
    var _index = 0;
    var _show = new Array();
    
    _TabMenu.find('li p').each(function(){
      var _span = $(this);
      if($.trim(_span.html())=='' || $.trim( _span.html())=='0'){
        _show[_index] ='1';
        _count++;
      }else{
        _show[_index] ='0';
        _span.parent('li').remove();
          }
      _index++;
    });
    _TabMenu = $('#'+btId+' .TabMenu');
    _TabContentD = $('#'+btId).find('.TabContentD');
    _index =0;
    _TabContentD.each(function(){
      if(_show[_index]=='0'){
        $(this).remove();
      }
          _index++;
       });
    var _TabRan = 0;
    if(_count>1){
      _TabRan =  (Math.round(Math.random()*_count));
      if(_TabRan > 1){
        _TabRan--;
      }
    }else{
      $('#'+btId+' .arrows').hide();
      $('#'+btId+' .TabMenu').hide();
    }
    _TabContentD = $('#'+btId).find('.TabContentD');
    _TabContentD.removeClass('selected');
    _TabMenu.find('li').removeClass('selected');
    _TabMenu.find('li').eq(_TabRan).addClass('selected');
    _TabContentD.eq(_TabRan).addClass('selected');
    _TabContentD.eq(_TabRan).find('[lazy=1],[lazy=2]').each(function(){
      if(!!$.getImgSrc({org:$(this).attr("org")})) {
        $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
      }
          $(this).removeAttr("lazy");
        });
    _TabMenu.delegate('li','mouseover',function(){
      _TabContentD.removeClass('selected');
      _TabMenu.removeClass('selected'); 
      _TabMenu.find('li').removeClass('selected');
      $(this).addClass('selected');
      _TabContentD.eq($(this).index()).addClass('selected').show();
      _TabContentD.eq($(this).index()).find('[lazy=1],[lazy=2]').each(function(){
        if(!!$.getImgSrc({org:$(this).attr("org")})) {
          $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
        }
        $(this).removeAttr("lazy");
      });
  });
  }
  
  $.fn.FloorBTShowR = function(btId ,eid ,cnt){
    var _TabMenu = $('#'+btId+' .TabContent');
    var _ChildList = _TabMenu.children();    

    for(var i=1;i<=_ChildList.length;i++){
    var _cnt = cnt;
    var _show = new Array();
      var _html = new Array();
      var _node = $('#'+btId+'_P'+i+' > li');
      var j=0;
    if(_node.length>cnt){
        for(j=0;j<_node.length;j++){
            var _index = j+1;
            var _eid = $('#'+btId+'_P'+i+'_'+_index+'_'+eid);
            var _display = _eid.html();
            if( _display!= null && _display.length>0 && _display == 0  ){
              _show[j]=1;
              _cnt = _cnt-1;
            }else{
              _show[j]=0;
            }
          }
       j=0;
          while(j<_cnt){
            var _ShowIndex=Math.floor(Math.random()*_node.length);
            if( _show[_ShowIndex]==0 ){
              _show[_ShowIndex]=1;
              j++;
            }
          }
          
      for(j=0;j<_node.length;j++){
            if(_show[j]==0){
              _node[j].setAttribute("style" , "display:none");
            }else{
              _node[j].setAttribute("style" , "display:block");
            }
          }
    }
   }
 }
  /** 
   * 處理首頁樓層
   * @author jphsu
   */
  $.fn.FloorTips = async function(){

    // 樓層選單
    const floorMenu = {
      /**樓層選單最外層元素 */
      element: document.querySelector('#bt_0_215_01'),
      /**目前是否有高光的按鈕 */
      get hasHighLightFloorMenuBtn() {
        return floorMenu.element.querySelector('.selected') !== null;
      },
      /* 顯示樓層選單整區 */
      show() {
        floorMenu.element.style.display = 'block';
        floorMenu.element.style.transition = '.2s';
        floorMenu.element.style.opacity = '1';
        floorMenu.element.style.pointerEvents = 'auto';
      },
      /* 隱藏樓層選單整區 */
      hide() {
        floorMenu.element.style.opacity = '0';
        floorMenu.element.style.pointerEvents = 'none';
      },
      /* 高光樓層選單按鈕 */
      highLightFloorMenuBtn(floorMenuElement) {
        floorMenuElement.classList.add('selected');
      },
      /* 取消高光樓層選單按鈕 */
      unHighLightFloorMenuBtn(floorMenuElement) {
        floorMenuElement.classList.remove('selected');
      },
      /**產出 對應樓層 的 樓層選單按鈕 到 樓層選單 中 ( \<li floor-parent="{ 對應的樓層的id }">{ 對應樓層名 }\<li> )，以及 綁定樓層按鈕 點擊事件 */
      createFloorMenuBtn(floorElement) {
        if (!floorElement) return;
        // 產 樓層按鈕
        const blockId = floorElement.getAttribute('id');
        const floorMenuBtnElement = document.createElement('li');
        floorMenuBtnElement.setAttribute('floor-parent', blockId);
        floorMenuBtnElement.innerHTML = floorElement.querySelector('h3 .sso_e1_title').textContent.replace('3C', '3C<br>');

        // 樓層按鈕 點擊事件
        floorMenuBtnElement.addEventListener('click', () => {
          const offset = floorElement.offsetTop + floorElement.offsetHeight;
          if (offset) {
            window.scrollTo({ top: offset - ( document.documentElement.clientHeight / 2 ), behavior: 'smooth' });
          }
        })

        floorMenu.element.querySelector('ul').append(floorMenuBtnElement);
      },
      /**提供 Intersection Observer 呼叫的 callback，處理 樓層按鈕 的高光、樓層按鈕區的 顯示 / 隱藏 */
      intersectionShowHideHandler(entries) {
        // 樓層按鈕 高光
        entries.forEach(entry => {
          const floorMenuElement = document.querySelector(`[floor-parent*=${entry.target.id}]`);
          if (!floorMenuElement) return;
          if (entry.intersectionRatio === 1) {
            floorMenu.highLightFloorMenuBtn(floorMenuElement);
          } else {
            floorMenu.unHighLightFloorMenuBtn(floorMenuElement);
          }
        })
        // 樓層按鈕整區 顯示 / 隱藏
        if (floorMenu.hasHighLightFloorMenuBtn) {
          floorMenu.show();
        } else {
          floorMenu.hide();
        };
      },
    };

    /**獲取 首頁各樓層 推薦商品資訊、樓層推薦順序 */
    const fetchFloorRecommendGoodsInfo = (floorGoodsInfoApiParams={}) => {
      return new Promise((resolve, reject) => {
        momoj.ajaxTool({
          timeout: 10 * 1000,
          async: true,
          data: {
            flag: 2056,
            blockId: "",
            blockTypeId: "bt_r_floor",
            categoryCode: "",
            excludeList: null,
            goodsCode: "",
            page: 0,
            platform: "pc",
            qty: 0,
            htmlFloorRecommendGoodsInfo : floorGoodsInfoApiParams,
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

    /**處理 推薦版位 API 回傳資料 */
    class FloorRecommendGoodsInfoResponse {
      constructor(response) {
        this.response = response;
        this.successRtnCode = '200';
      }
      get rtnData() {
        return this.response?.rtnData || {};
      }
      get isSuccess() {
        return this.response?.rtnCode == this.successRtnCode
                &&
               Object.keys(this.blocksInfo).length !== 0;
      }
      get isFloorsSortedByApi() {
        return !!this.rtnData.isFloorsSortedByApi;
      }
      get blockRequestId() {
        return this.rtnData.blockRequestId || '';
      }
      get snapshotId() {
        return this.rtnData.blockRequestId || '';
      }
      get blocksInfo() {
        return this.rtnData.blocksInfo || {};
      }
    }

    // ================

    // 處理 樓層按鈕 的高光、樓層按鈕區的 顯示 / 隱藏 的 觀測器
    const floorIntersectionObserver = new IntersectionObserver(
      floorMenu.intersectionShowHideHandler, 
      {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Trigger intersectionCallback when at least [0, 0.1 - 1]*100% of the element is visible
      }
    )

    // 組 取得樓層推薦商品的 的 API 參數
    const floorGoodsInfoApiParams = Array.from(document.querySelectorAll('.btfloor'))
      .reduce((floorGoodsInfo, floorContainer) => {
        const floorContainerId = floorContainer.getAttribute('id');
        const promoElements = Array.from(floorContainer.querySelectorAll('.prdS'));
        const goodsCodes = promoElements.reduce((goodsCodes, promoElement) => {
          const goodsCodeElement = promoElement.querySelector('[class*="GDS-"]');
          const goodsCode = (goodsCodeElement?.className||'').match(/GDS-\S+/)?.[0]?.replace('GDS-', '')
          if (goodsCode) {
            goodsCodes.push(goodsCode);
          }
          return goodsCodes;
        }, [])
        floorGoodsInfo[floorContainerId] = goodsCodes;
        return floorGoodsInfo;
      }, {});

    fetchFloorRecommendGoodsInfo(floorGoodsInfoApiParams)
      .then(rawResponse => {
        const floorRecommendGoodsInfoResponse = new FloorRecommendGoodsInfoResponse(rawResponse);
        if (floorRecommendGoodsInfoResponse.isSuccess) {
          // 處理 樓層順序 以及 樓層版位推薦商品
          const sortedBlocksInfoList = Object.values(floorRecommendGoodsInfoResponse.blocksInfo).toSorted((blocksInfo1, blocksInfo2) => blocksInfo1.recommendIndex - blocksInfo2.recommendIndex);
          /* DocumentFragment */
          const documentFragment = sortedBlocksInfoList.reduce((documentFragment, blocksInfo, blockIndex) => {
            const { blockId, goodsInfo:goodsInfoList={} } = blocksInfo;
            documentFragment.append(document.querySelector(`#${blockId}`));
            // 更新商品元素
            const goodsElements = documentFragment.querySelectorAll(`#${blockId} .prdS`);
            Object.keys(goodsInfoList).forEach((goodsCode, index) => {
              const isEmptyPrice = price => price == 0 || price === '' || typeof price === 'undefined';
              const isStoreTag = tagContent => ['店⁺', '店+'].includes(momoj.unicode2Str(tagContent));
              const isPreorderTag = tagContent => ['預', '預購'].includes(momoj.unicode2Str(tagContent));

              const goodsElement = goodsElements[index];
              const goodsInfo = goodsInfoList[goodsCode];
              const { imgUrl, goodsName, marketPriceModel={}, goodsPriceModel={}, goodsTag:goodsTags=[], action={}, } = goodsInfo;
              const { sign:originSign='', price:originPrice='', strPrice:originStartingPrice='',} = marketPriceModel.basePrice || {};
              const { sign:promoSign='',  price:promoPrice='',  strPrice:promoStartingPrice='', } = goodsPriceModel.basePrice || {};
              const hightLightSign = isEmptyPrice(promoPrice) ? originSign : promoSign;
              const hightLightPrice = isEmptyPrice(promoPrice) ? originPrice : promoPrice;
              const hightLightStartingPrice = isEmptyPrice(promoPrice) ? originStartingPrice : promoStartingPrice;

              // 如果必要資料 沒資料 ( API 異常 )，就不更新 html，保留該商品原始 stc html
              if (goodsName && imgUrl && !isEmptyPrice(hightLightPrice)) {
                const hrefElement = goodsElement.querySelector('& > a');
                const prdImgElement = goodsElement.querySelector('a > img');
                const priceElement = goodsElement.querySelector('.priceBox');
                const goodsNameElement = goodsElement.querySelector('.prdName');
                const ssoElements = goodsElement.querySelectorAll('[class*="sso_"]');
                // 商品品名、Tag
                if (goodsNameElement) {
                  goodsNameElement.innerHTML = (
                    (
                      goodsTags.length !== 0
                        ? `<span class="icon-group">` +
                            goodsTags.map(goodsTag => {
                              if (isStoreTag(goodsTag.content))    return `<span class="icon-store" style="background-color: ${ goodsTag?.bgColor || '' }"><img src="${ goodsTag?.imgUrl || '' }" alt="店+"></span>`;
                              if (isPreorderTag(goodsTag.content)) return `<span class="icon-preorder" style="background-color: ${ goodsTag?.bgColor || '' }"><img src="${ goodsTag?.imgUrl || '' }" alt="預"></span>`;
                              return '';
                            }).join('') +
                          '</span>'
                        : ''
                    ) +
                    `<span class="prd-name">${ goodsName }</span>`
                  )
                  goodsNameElement.style.width = '90px';
                }

                ssoElements.forEach(ssoElement => {
                  ssoElement.textContent = goodsName;
                })

                // 商品連結
                if (hrefElement) {
                  const getURLSearchParam = ({ blockId, goodsIndexInCurrentFloor, recomd_id, }) => {
                    let mdivSuffix = '';
                    if (goodsIndexInCurrentFloor === 0) { mdivSuffix='_e50'; }
                    if (goodsIndexInCurrentFloor === 1) { mdivSuffix='_e56'; }
                    if (goodsIndexInCurrentFloor === 2) { mdivSuffix='_e62'; }
                    return {
                      oid: 'mb',
                      mdiv: `1000000000-${blockId}-${blockId}${mdivSuffix}`,
                      ctype: 'B',
                      rec_pos: '1pp_s3',
                      recomd_id,
                    }
                  }
                  hrefElement.href = getGoodsPageUrlByGoodsCode(goodsCode, getURLSearchParam({ blockId, goodsIndexInCurrentFloor: index, recomd_id: floorRecommendGoodsInfoResponse.blockRequestId, }));
                  hrefElement.title = `${goodsName}`;
                }
                // 商品圖
                if (prdImgElement) {
                  prdImgElement.src = imgUrl;
                  prdImgElement.alt = goodsName;
                  prdImgElement.title = goodsName;
                }
                // 商品價錢
                if (priceElement) {
                  priceElement.insertAdjacentHTML('afterend', (
                    `<div class="priceBox prices-group">` +
                    (
                      `<span class="price current-prices-group">` +
                        `<span class="current-price">${ hightLightSign }<b>${ hightLightPrice }</b>` +
                          ( // 有'起' 顯示 html， 沒'起' 不顯示 html
                            !!hightLightStartingPrice ? `<span class="price-from">${ hightLightStartingPrice }</span>` : ''
                          ) +
                        `</span>` +
                      `</span>`
                    ) +
                    ( // 市價為 0、售價為空 不顯示市價 html
                      isEmptyPrice(originPrice) || isEmptyPrice(promoPrice)
                        ? '<span class="oPrice origin-prices-group"></span>'
                        : (
                            `<span class="oPrice origin-prices-group">${ originSign }<b>${ originPrice }</b>` +
                              ( // 有'起' 顯示 html， 沒'起' 不顯示 html
                                !!originStartingPrice ? `<span class="price-from">${ originStartingPrice }</span>` : ''
                              ) +
                            `</span>`
                          )
                    ) + 
                    `</p>`
                  ));
                  priceElement.remove();
                }
              }
            })

            // 產出 樓層按鈕、觀測 樓層 顯示/隱藏
            const floorElement = documentFragment.querySelector(`#${blockId}`);
            floorMenu.createFloorMenuBtn(floorElement);
            floorIntersectionObserver.observe(floorElement);

            return documentFragment;
          }, new DocumentFragment());

          // 所有更新後的樓層 塞到 獨立 div 中
          const newFloorBlockConatiner = document.createElement('div');
          newFloorBlockConatiner.id = 'btfloor';
          newFloorBlockConatiner.append(documentFragment);

          // 獨立 div 塞到 "口碑推薦"( #bt_0_235_01 ) 後面 
          document.querySelector('#bt_0_235_01')
              .insertAdjacentElement('afterend', newFloorBlockConatiner);

        } else {
          // 用本來的 html 來 產出 樓層按鈕 以及 綁定樓層按鈕點擊事件
          document.querySelectorAll('.btfloor').forEach(floorElement => {
            // 產出 樓層按鈕、觀測 樓層 顯示/隱藏
            floorMenu.createFloorMenuBtn(floorElement);
            floorIntersectionObserver.observe(floorElement);
          });
        }
      })
      .catch(() => {
        // 用本來的 html 來 產出 樓層按鈕 以及 綁定樓層按鈕點擊事件
        document.querySelectorAll('.btfloor').forEach(floorElement => {
          // 產出 樓層按鈕、觀測 樓層 顯示/隱藏
          floorMenu.createFloorMenuBtn(floorElement);
          floorIntersectionObserver.observe(floorElement);
        });
      })
  }
  
  $.fn.Hr24Tips = function(){
  var _bt208 = momoj('#bt_0_208_01 .view >ul >li');
  var _Show=Math.floor(Math.random()*2);
  var _start = (4*_Show)+1;
  var _end = (4*_Show)+4;
  for(var i=_start;i<=_end;i++){
    momoj('#bt_0_208_01_P1_'+i).hide();
  }

  }
  //載入youtube btId:區塊名稱  width:寬 height:高
  $.fn.intputyoutube = function(btId , width , height){
      var _movie = momoj('#'+btId+' .TabContent .TabContentD .movieArea .movieSrc')
      for(var i=0;i<_movie.length;i++){
        var _movieArea =  _movie[i];
        _movieArea.innerHTML  = '<iframe width="'+width+'" height="'+height+'" src="'+_movieArea.innerHTML+'" frameborder="0" allowfullscreen></iframe>';
      }
    }
  $.fn.bt095wrap = function(btId){
      var $block = $('#'+btId+'_big'),
      $wrap = $('#'+btId+'_big .TabContent'),
      $ul = $wrap,
      $li = $('#'+btId+'_big .TabContent div'),
      $dli = $('#'+btId+'_big .TabMenu li');
      
      var _count = 0;
      $dli.find('p').each(function(){
         var _span = $(this);
         if( $.trim(_span.html())=='1'){
           _count++;
         }
      });
      if(_count == 5){
        $('#'+btId+'_big .arrows').hide();
        $('#'+btId+'_big .TabMenu').hide();
      }

      
      _default = 0,
      _width = $wrap.width(),
      animateSpeed = 400;
      $('#'+btId+'_big'+' .arrows').delegate('div', 'click', function(event){
              var divId = $(this).parent('div').parent('div').parent('div').attr('id');
              $li = $('#'+divId+'_big .TabContent div');
              $dli = $('#'+divId+'_big .TabMenu li');
              $wrap = $('#'+divId+'_big .TabContent');
              $ul = $wrap;
              _width = $wrap.width();
              // 先找出 .selected 的元素後移掉該樣式
              var $selected = $li.filter('.selected').removeClass('selected'),
              // 找出目前顯示的元素是第幾個
              _index = $li.index($selected);
              
               $dli.filter('.selected').removeClass('selected');
               // 依點擊的是上一張或下一張來切換
               _index = (event.target.className == 'leftBtn' ? _index - 1 + $li.length : _index + 1) % $li.length;
               for(var i=0;i<5;i++){
                 if($dli.eq(_index).find('p').html() != null && $.trim($dli.eq(_index).find('p').html()) =='1' ){
                   _index = (event.target.className == 'leftBtn' ? _index - 1 + $li.length : _index + 1) % $li.length;
                 }
               }
               $li.eq(_index).addClass('selected');
         $li.eq(_index).find('[lazy=1],[lazy=2]').each(function(){
                 $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
                 $(this).removeAttr("lazy");
               });
               $dli.eq(_index).addClass('selected');
               $ul.animate({
                       left: _index * _width * -1
               }, animateSpeed);
               // 改變標題
              
              return false;
      });
      // 先顯示預設的
      $ul.css('left', _default * _width * -1);
      $('#'+btId+'_big'+' .arrows').focus(function(){
              this.blur();
      });
  }
  
  $.fn.bt023wrap = function(btId){
    var $block = $('#'+btId),
      $wrap = $('#'+btId+' .TabContent'),
      $ul = $wrap,
      $li = $('#'+btId+' .TabContent div'),
      $dli = $('#'+btId+' .TabMenu li');

      _default = 0,
      _width = $wrap.width(),
      animateSpeed = 400;
      $('.arrows').delegate('div', 'click', function(event){
        var divId = $(this).parent('span').parent('div').parent('div').attr('id');
              $li = $('#'+divId+' .TabContent div');
              $dli = $('#'+divId+' .TabMenu li');
              $wrap = $('#'+divId+' .TabContent');
              $ul = $wrap;
              _width = $wrap.width();
              // 先找出 .selected 的元素後移掉該樣式
              var $selected = $li.filter('.selected').removeClass('selected'),
              // 找出目前顯示的元素是第幾個
              _index = $li.index($selected);
              
               $dli.filter('.selected').removeClass('selected');
               // 依點擊的是上一張或下一張來切換
               _index = (event.target.className == 'leftBtn' ? _index - 1 + $li.length : _index + 1) % $li.length;
               for(var i=0;i<5;i++){
                 if($dli.eq(_index).find('p').html() != null && $.trim($dli.eq(_index).find('p').html()) =='1' ){
                   _index = (event.target.className == 'leftBtn' ? _index - 1 + $li.length : _index + 1) % $li.length;
                 }
               }
               $li.eq(_index).addClass('selected');
         $li.eq(_index).find('[lazy=1],[lazy=2]').each(function(){
                 $(this).attr("src", $.getImgSrc({org:$(this).attr("org")}));
                 $(this).removeAttr("lazy");
               });
               $dli.eq(_index).addClass('selected');
               $ul.animate({
                       left: _index * _width * -1
               }, animateSpeed);
               // 改變標題
              
              return false;
      });
      // 先顯示預設的
      $ul.css('left', _default * _width * -1);
      $('.arrows').focus(function(){
              this.blur();
      });

  }
  
  /** 排行榜_類別打開 **/
  $.fn.rankingList = function() {
    var bt = momoj('#bt_0_233_01');
    var chooseBox = momoj('.chooseBox');
    bt.on("mouseenter", '.openchooseBtn', function(){
      chooseBox.show();
    }).on("mouseleave", '.openchooseBtn', function(){
      setTimeout(function() {
        if (chooseBox.data('show') === false){
          chooseBox.hide();
        }
      }, 200);
    });
    bt.on("mouseenter", chooseBox.selector, function(){
      chooseBox.data('show', true);
      chooseBox.unbind('li').delegate('li', 'click', function() {
        var _a = momoj(this);
        //bt.selector is #bt_0_233_01
        momoj(bt.selector + ' h4').text(_a.html()); 
        //chooseBox.selector is .chooseBox
        momoj(bt.selector + ' ' + chooseBox.selector + ' ul li').removeClass('selected');
        momoj('#'+_a.attr('id')).addClass('selected');
        momoj('.rankingList').each(function() {
          momoj(this).hide();
        });
        momoj('#rankingList_'+_a.attr('id')).show();
        chooseBox.hide();
      });
    }).on("mouseleave", chooseBox.selector, function(){
      momoj(bt.selector + ' ' + chooseBox.selector).data('show', false);
      chooseBox.hide();
    });
  }
  $.fn.custExclBuyLoad = function(options) {
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
          momoj.getScript("//img1.momoshop.com.tw/ecm/js/custExclBuy.js?t=20201119001");
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
  $.fn.newCustExclBuyLoad = function(options) {
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
            momoj.getScript("/ecm/js/newCustExclBuy.js?t=20250326001");
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
  $.fn.ShowVideoFun = function(){
    var container=momoj(this);
    container.find('.showVideo').each(function(){
      var containerParent=momoj(this).parent();
      if(momoj(this).text() == "1"){
        containerParent.addClass("viewVideo");
        containerParent.find('.openvideoBtn').attr('title',containerParent.find('img').attr('title'));
        containerParent.find('.openvideoBtn').attr('vlink',containerParent.find('.videoUrl').text())
      }else{
        containerParent.removeClass("viewVideo");
      }
    });
    
    momoj.ajax({
      url:"/ecm/js/video.js?t=20200707001",
      dataType:"script",
      cache:true,
      success:function(){
        container.bindVideo({youtubeArea:'bt_0_236_youtubeArea'});
      }
    });
  }
  $.fn.NewBtBanner = function(_settings){
    var container=momoj(this);
    if(/ecm/i.test(location.href) && momoj('#BTM-form').css('display')=='block'){
      return;
    }
    var _html = container.html();
    _html = _html.replace(/<ul/g,"<div");
    _html = _html.replace(/<\/ul/g,"<\/div");
    _html = _html.replace(/<li/g,"<div");
    _html = _html.replace(/<\/li/g,"<\/div");
    container.html(_html);
    momoj().btBannerWrap(container, _settings); 
  }
  $.fn.btBannerWrap = function(_container, _settings){
    var settings = {
      random   : true,
      position : 0
    };
    if(_settings) {
      momoj.extend(settings, _settings);
    }
    var _tabContentD = momoj('.TabContentD',_container);
    var _tabContent = momoj('.TabContent',_container);
    var _tabMenu = momoj('.TabMenu',_container);
    var _arrows = momoj('.arrows',_container);
    var _tabMenuLi;
    var _count = _tabContentD.length;
    var _default = 0;
    var _index = 0;
    var _width = 0;
    var animateSpeed = 400;
    var _tabRan = 0;
    
    if(_count > 1){
      _tabMenu.append('<ul></ul>');
      for(var i=0;i<_count;i++){
        momoj('.TabMenu ul',_container).append('<li></li>')
      }
      
      if(!settings.random){
        _tabRan = settings.position;
      }else{
        _tabRan =  (Math.round(Math.random()*_count));
        if(_tabRan > 1) _tabRan--;  
      }
      
      
      _tabContentD.eq(_tabRan).find('[lazy=1],[lazy=2]').each(function(){
        if(!!momoj.getImgSrc({org:momoj(this).attr("org")})) {
          momoj(this).attr("src", momoj.getImgSrc({org:momoj(this).attr("org")}));
        }
        momoj(this).removeAttr("lazy");
      });

    }else{
      _arrows.hide();
      _tabMenu.hide();
    }
    
    momoj('.TabMenu li',_container).eq(_tabRan).addClass('selected');
    _tabContentD.eq(_tabRan).addClass('selected').show();
    _tabContent.attr('style','left:' + _default * _width * -1 + 'px');

    _tabMenu.delegate('li','mouseover',function(){
      _tabContentD.removeClass('selected'); 
      _tabMenu.removeClass('selected'); 
      _tabMenu.find('li').removeClass('selected'); 
      momoj(this).addClass('selected');
      _tabContentD.eq($(this).index()).addClass('selected').show();
       
      _tabContentD.eq($(this).index()).find('[lazy=1],[lazy=2]').each(function(){
        if(!!momoj.getImgSrc({org:momoj(this).attr("org")})) {
          momoj(this).attr("src", momoj.getImgSrc({org:momoj(this).attr("org")}));
        }
        momoj(this).removeAttr("lazy");
      });
    });     
    
    _arrows.delegate('a', 'click', function(event){
      var divContainer = momoj(this).parent('div').parent('div');
      _tabContentD = momoj('.TabContentD',divContainer);
      _tabMenuLi = momoj('.TabMenu li',divContainer);
      _tabContent = momoj('.TabContent',divContainer);
      _width = _tabContent.width();
      // 先找出 .selected 的元素後移掉該樣式
      // 找出目前顯示的元素是第幾個
      _index = _tabContentD.index(_tabContentD.filter('.selected').removeClass('selected'));
      _tabMenuLi.filter('.selected').removeClass('selected');
      // 依點擊的是上一張或下一張來切換
      _index = (event.target.className == 'leftBtn' ? _index - 1 + _tabContentD.length : _index + 1) % _tabContentD.length;
      _tabContentD.eq(_index).addClass('selected');
      _tabContentD.eq(_index).find('[lazy=1],[lazy=2]').each(function(){
        momoj(this).attr('src', momoj.getImgSrc({org:momoj(this).attr("org")}));
        momoj(this).removeAttr('lazy');
      });
      _tabMenuLi.eq(_index).addClass('selected');
      _tabContent.animate({left: _index * _width * -1}, animateSpeed);
      return false;
    });
  }
  $.fn.processBlock999 = function(btId){
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
    
  }
  $.fn.setGoodsImgTag = function(_settings){
    var container=momoj(this);
    var displayBlock = momoj('.displayBlock',container).text();
    if((/ecm/i.test(location.href) && container.parents('#preview').length > 0) || displayBlock == 'off'){
      return;
    }
    var goodsimg = '/goodsimg/';
    var imgTagArray = new Array();
    var n =0;
    container.find('img').each(function(){
      var imgUrl='';
      if(typeof momoj(this).attr('org') != 'undefined' && momoj(this).attr('org').indexOf(goodsimg) > -1){
        imgUrl = momoj(this).attr('org');
      }else if(typeof momoj(this).attr('src') != 'undefined' && momoj(this).attr('src').indexOf(goodsimg) > -1){
        imgUrl = momoj(this).attr('src');
      }
      if(imgUrl!=''){
        var imgUrlArr = imgUrl.substring(imgUrl.lastIndexOf("/")+1,imgUrl.indexOf("?")).split("_");
        imgTagArray[n]=imgUrlArr[0];
        n++;
      }
     
    });
    if(imgTagArray.length>0){
      momoj.ajaxTool({
        async: true,
        data:{flag: 2026,goodsCode: imgTagArray},
        ajaxSuccess:function(_rtnObj) { 
          var x = 0;
          container.find('li').each(function(){
            var imgUrlUrl = _rtnObj.rtnData.result[x];
            momoj(this).children('a').children('img').wrap('<div class=\"prdGoodsImgWrap prdImgWrap\"></div>');
            if(imgUrlUrl!=''){
              momoj(this).find('.prdGoodsImgWrap').prepend('<div class="goodsImgTag"><img src="'+ imgUrlUrl +'"></div>');
            }
            x++;
          });
        }
      });
    }
    
  }
  
  //顯示自訂金額 or 系統金額 zhtang 2021.09.29
  $.fn.DisplayCustomPrice = function(btId){
    var container = momoj('#'+btId);
    if(container.length==0){
        container = momoj('#'+btId+'A');
   	}
    var obj;
    var sIsDisplay;
    var objSysPrice;
    var objCustPrice;
    var listLi = container.find('ul > li');
    momoj.each(listLi,function(index,element){
      obj = momoj(element);
      
      sIsDisplay = obj.find('.displayCustomPrice').text();
      objCustPrice = obj.find('.Custom-price');
      objSysPrice = obj.find('.system-price');
      
      if(sIsDisplay == 'on'){
        objCustPrice.show();
        objSysPrice.hide();
        //若前面沒有$, 自動補上
        try{
            if(objCustPrice.parent().html().trim().substring(0,1)!='$'){
	        	objCustPrice.parent().html('$'+objCustPrice.parent().html());
	        }
        }catch(e){
        	
        }
      }else{
        objCustPrice.hide();
        objSysPrice.show();
      }
    });
  }
  
  
})(jQuery);
/** 爆殺24H 左右側按鈕 **/
function h24click(btId){
    var dis = momoj('#'+btId+'_P1_1').css('display');
    if( dis != 'none' ){
      momoj('#'+btId+'_P1_1').hide();
      momoj('#'+btId+'_P1_2').hide();
      momoj('#'+btId+'_P1_3').hide();
      momoj('#'+btId+'_P1_4').hide();
      momoj('#'+btId+'_P1_5').show();
      momoj('#'+btId+'_P1_6').show();
      momoj('#'+btId+'_P1_7').show();
      momoj('#'+btId+'_P1_8').show();
    }else{
      momoj('#'+btId+'_P1_1').show();
      momoj('#'+btId+'_P1_2').show();
      momoj('#'+btId+'_P1_3').show();
      momoj('#'+btId+'_P1_4').show();
      momoj('#'+btId+'_P1_5').hide();
      momoj('#'+btId+'_P1_6').hide();
      momoj('#'+btId+'_P1_7').hide();
      momoj('#'+btId+'_P1_8').hide();
    }
  }

/**爆殺24H的倒數**/
function refreshTime(){   
  var _today = new Date();
  var _endD = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate()+1);
  var _endS = _endD.getTime();
  var _nowD = new Date();
  var _nowS = _nowD.getTime();
  
  var _secs=parseInt((_endS-_nowS)/1000,10);
  var _hh=parseInt(_secs/3600,10);
  var _mm=parseInt(Math.floor((_secs%3600)/60),10);
  var _ss=parseInt(Math.floor(_secs%60),10);
  if(_hh.toString().length<2)_hh='0'+_hh.toString();
  if(_mm.toString().length<2)_mm='0'+_mm.toString();
  if(_ss.toString().length<2)_ss='0'+_ss.toString();
  momoj('#hh').html(_hh);
  momoj('#mm').html(_mm);
  momoj('#ss').html(_ss);
      
  setTimeout("refreshTime()",100);
}
/** 時間倒數 **/
function mRefreshTime(btId,_endD){   
  var _endS = new Date(_endD).getTime();
  var _nowD = new Date();
  var _nowS = _nowD.getTime();
  
  var _secs=parseInt((_endS-_nowS)/1000,10);
  var _hh=parseInt(_secs/3600,10);
  var _mm=parseInt(Math.floor((_secs%3600)/60),10);
  var _ss=parseInt(Math.floor(_secs%60),10);
  if(_hh.toString().length<2)_hh='0'+_hh.toString();
  if(_mm.toString().length<2)_mm='0'+_mm.toString();
  if(_ss.toString().length<2)_ss='0'+_ss.toString();
  momoj("#"+btId).find('.hh').html(_hh);
  momoj("#"+btId).find('.mm').html(_mm);
  momoj("#"+btId).find('.ss').html(_ss);
      
  setTimeout("mRefreshTime('"+btId+"','"+_endD.toString()+"')",100);
}
function bkArea() {
  if(momoj('body').find('.fancybox-overlay').length == 0){
    momoj('body').append('<div class="fancybox-overlay"></div>');
  }
  var bodywidth = momoj("body")[0].clientWidth; /** 將整個body的寬度置入bodywidth **/
  var bodyheight = momoj("body")[0].clientHeight; /** 將整個body的高度置入bodyheight **/
  momoj(".fancybox-overlay").css({"width":+ bodywidth+"px","height":+bodyheight+"px"}).fadeTo("slow",0.5); /** 將body的寬高置入此層，然後淡出透明度0.5 **/
}

/** 推送recomd_id **/
function sendRecommendId(recomd_id){

  /** momowa start **/
  var pathname = location.pathname;
  var momowaSiteId = "shop";
  var ua = navigator.userAgent.toLowerCase();
  if(isMobile(ua)){ //手機裝置
    momowaSiteId = ua.indexOf("momoshop") >= 0 ? '':'shopmobile';
  }
  var noTrackmomowa = (location.pathname == "/goods/GoodsDetail.jsp") && (/^#(info|spec|gifts)$/.test(location.hash));
  if(pathname == "/main/Main.jsp" || pathname == "/category/LgrpCategory.jsp" 
      || pathname == "/category/DgrpCategory.jsp" || pathname == "/goods/GoodsDetail.jsp"){
    if(typeof recomd_id == "string" && !noTrackmomowa && momowaCmds && momowaSiteId){
      momowaCmds.push(['setSiteId',momowaSiteId]);
      momowaCmds.push(['setTrackerUrl','//https://momowa.momoshop.com.tw/momowa/rc/RC.MMW']);
      momowaCmds.push(['setRecommendId',recomd_id]);
      momowaCmds.push(['trackPageView']);
    }
  }
  (function() {
    var _mwa = document.createElement('script');
    _mwa.type = 'text/javascript';
    _mwa.async = true;
    _mwa.src = '//https://momowa.momoshop.com.tw/momowa/rc/js/momowa.js?_=20200513001';
    var _mwa_s = document.getElementsByTagName('script')[0];
    _mwa_s.parentNode.insertBefore(_mwa, _mwa_s);
  }());
  /** momowa end **/
}


 


