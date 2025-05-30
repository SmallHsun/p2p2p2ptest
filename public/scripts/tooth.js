(function($) {

$.fn.MoMu2013=function(settings){
  var container=$(this);
  if ( container.length >1 ) {
    container.each(function(){
      $(this).MoMu2013(settings);
    });
    return false;
  } 
  var _defaultSettings = {        
    scrWidth:1320,
    lbt:'#bt_0_layout_b257',
    subMnId:'bt_0_197_',  
    liHeight:24,
    liWidth:131
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
  
  _lbt.on("mouseenter",'.subMenu2013',function(){
    var _subMenu=$(this);
    var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
    if(_subMenu.attr('id')=='bt_0_059_01'){
      _menuID='21';   
    }
    if(_subMenu.attr('id')=='bt_0_059_01'){
      $("#bt_0_layout_b257 #bt_0_059_01 .TabContent").height($("#bt_0_layout_b257 #bt_0_059_01 .TabMenu").height());
    }
    
    if(_menuID==22 || _menuID==24 || _menuID==30 || _menuID==37 || _menuID==35){
      $(this).parents("#bt_0_layout_b257").addClass("gray");
    }  
    
    _subMenu.data('Show',1);
    _subMenu.show();
    $('#C'+_menuID).addClass('BGO');
    $('#C'+_menuID+' a').addClass('BGO');
    
    /*$('.toothCode').each(function(){
            var _toothId=$(this);
            if(_toothId.text()==_menuID){            
                _toothId.parent('.ContentD').addClass('BGO');
            }
        });*/
  }).on("mouseleave",'.subMenu2013',function(){
    var _subMenu=$(this);
    var _menuID=_subMenu.attr('id').replace(_settings.subMnId,'');
    if(_subMenu.attr('id')=='bt_0_059_01'){
      _menuID='21';   
    }
    _subMenu.data('Show',0);
    _subMenu.hide();
    $('#C'+_menuID).removeClass('BGO');
    $('#C'+_menuID+' a').removeClass('BGO');
    
    /*$('.toothCode').each(function(){
            var _toothId=$(this);
            if(_toothId.text()==_menuID){            
                _toothId.parent('.ContentD').removeClass('BGO');
            }
        });*/
    
    if(_menuID!=22 ||_menuID!=24|| _menuID!=30 || _menuID!=37 || _menuID!=35){
      $('#bt_0_layout_b257').removeClass('gray');
    }
  });
  container.on("mouseenter",'.MoMoDDMHead',function(){
    _settings.scrWidth=$('#bt_0_157_01 ul').outerWidth() + $('#bt_0_157_01 ul').position().left;
    _lbt.find('.subMenu2013,#bt_0_059_01').hide();
    var _head=$(this); 
    _head.addClass('BGO');
    $('a',_head).addClass('BGO');
    // cale subMenu position
    var _x=0;
    var _y=0;
    var _POS=_head.position();
    _x=_POS.left;
    _y=_POS.top+_head.height()+2;
    var _subBtId=_settings.subMnId+_head.attr('id').replace('C','');
    var _subMenu=$('#'+_subBtId);
    
    if(_head.attr('id')=='C21'){
      _subBtId='bt_0_059_01';
      _subMenu=$('#'+_subBtId);    
    }
    ResortMenu(_subMenu,_subBtId);
    var _menuWidth=_subMenu.outerWidth();//menu totalwidth
    if(_menuWidth+_x > _settings.scrWidth){
      _x=_settings.scrWidth-_menuWidth;
    }  
    
    if(_y==40){_y=76;}
    _subMenu.css({left:_x,top:_y}).show();
  }).on("mouseleave",'.MoMoDDMHead',function(){
    _settings.scrWidth=$('#bt_0_157_01 ul').outerWidth() + $('#bt_0_157_01 ul').position().left;
    var _head=$(this);
    _head.removeClass('BGO');
    $('a',_head).removeClass('BGO');
    $("#bt_0_layout_b257").removeClass("gray");
    var _subBtId=_settings.subMnId+_head.attr('id').replace('C','');
    if(_head.attr('id')=='C21'){
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
  });
  // deal subMenu END

  var ResortMenu=function(_subMenu,_subBtId){
         
       if(typeof _subMenu.data('menuInit')=='undefined' || _subMenu.data('menuInit')== null){        
             //add gray
             if(_subBtId.replace('bt_0_197_','')=='30'|| _subBtId.replace('bt_0_197_','')=='24' || _subBtId.replace('bt_0_197_','')=='22' || _subBtId.replace('bt_0_197_','')=='37'
             || _subBtId.replace('bt_0_197_','')=='35'){
                _subMenu.addClass('gray');
                _subMenu.find('.topArea').addClass('gray');
                _subMenu.find('.bottomArea').addClass('gray');
             }
             
              var _rowLen=8;
              var _subMenuWidth=0;
              var _calWidth=0; 
             //make rule to change row             
             if(_subMenu.find('#'+_subBtId+'_e9').text()!='' || _subMenu.find('#'+_subBtId+'_e9').text()!='&nbsp;'){  
                if(parseInt(_subMenu.find('#'+_subBtId+'_e9').text(),10)){               
                  _rowLen=parseInt(_subMenu.find('#'+_subBtId+'_e9').text(),10);
                }             
             }
            
             if(_subBtId=='bt_0_059_01'){
                  _rowLen=11;
             }
             _subMenu.find('.topmenu').each(function(){
                var _topMenu=$(this);                             
                if(momoj.trim(_topMenu.find('h3').text()) == '' || momoj.trim(_topMenu.find('h3').text()) == '&nbsp;'){
                  _topMenu.hide();            
                }else{                    
                  
                    var _ul = _topMenu.find('ul');
                    var _lis=_ul.find('li');
                    var _liColsTop=_calCols(_lis.length,_rowLen);//cal col 
                    var _topmenuWidth=_settings.liWidth  *_liColsTop.cols-(_liColsTop.cols-1)*2;//cal width
                    var _ulHeight=((_rowLen+1)*_settings.liHeight)+15; //cal height
                    if(_subBtId=='bt_0_059_01'){
                      _topmenuWidth = _topmenuWidth+(_liColsTop.cols*7)+10;
                    }                    
                    _topMenu.css({width:_topmenuWidth+'px',height:_ulHeight});
                    _ul.empty();
                    
                    
                    var _liCols=_liColsTop.cols;         
                    
                    if(_subBtId=='bt_0_059_01'){
                      _ul.css({width:_topmenuWidth-10});
                      /*if(_liCols>2){
                        _ul.css({width:_topmenuWidth+21});
                      }*/
                    }
                    /*resort li start*/
                    for(var i=0;i<_rowLen;i++){
                       var _liElm=$(_lis[i]);
                       _addParamForHref(_liElm,'A');
                       _liElm.width(_settings.liWidth);
                       var _aElm=$('a',_liElm);
                      _aElm.css({width:_settings.liWidth  -10});
                      _ul.append(_lis[i]);
                      
                      for(var j=1;j<_liCols;j++){
                        var _liElm=momoj(_lis[i+j*_rowLen]);
                        _liElm.css({width:_settings.liWidth  -2});
                        var _aElm=momoj('a',_liElm);
                        _aElm.css({width:_settings.liWidth  -10});
                        _ul.append(_lis[i+j*_rowLen]);            
                      }
                    
                      if(i+1==_liColsTop.mod){
                        _liCols--;
                      }
                            
                   }                    
                   /*resort li end*/    
                   if(_subBtId!='bt_0_059_01'){
                    _calWidth++;
                    _subMenuWidth+=_topmenuWidth;
                    _subMenu.css({width:_subMenuWidth+(_calWidth-1)});
                   }
                   
                }                
                
                
              });
          
           _subMenu.data('menuInit','1');//when you first time come
     }     
       _subMenu.data('Show',0); 
           return _subMenu;  
  }
  
  // deal bt_0_110_01 show bt_0_143 menu  
  /*if(document.location.href.indexOf('/main/Main.jsp')>-1){    
     
    $('#bt_0_110_01').delegate('.ContentD','hover',function(e){
        if(e.type==='mouseover'){
          $('.subMenu2013',_lbt).hide();
          var _ml=$(this);            
          _ml.addClass('BGO');
          // cale subMenu position
          var _x=0;
          var _y=0;
          var _POS=_ml.position();
          
          _x=_POS.left+_ml.width();
          _y=_POS.top+_ml.height()+400;
          var _subBtId=_settings.subMnId+$('.toothCode',_ml).text();            
          var _subMenu=$('#'+_subBtId);
          
          ResortMenu(_subMenu,_subBtId);
          
          var _menuWidth=_subMenu.outerWidth();
          if(_menuWidth+_x > _settings.scrWidth){
            _x=_settings.scrWidth-_menuWidth;
          }
          
          var _menuHeight=_POS.top+_ml.height()+500+_subMenu.outerHeight();
          var _sT=$(document).scrollTop();
          var _wHeight=$(window).height();
            
          if(_menuHeight-_sT>_wHeight+10){              
            _y=_wHeight-_ml.height()-_subMenu.outerHeight()-120+_sT;
          }
          
                 
          _subMenu
            .css({left:_x,top:_y})
            .show()
           
          ;
        }else{
          var _ml=$(this);
          _ml.removeClass('BGO');
          var _subBtId=_settings.subMnId+$('.toothCode',_ml).text();
          var _subMenu=$('#'+_subBtId);
          _lbt.data('showMenu',_subBtId);
          setTimeout(function(_subMenu){
            var _subMenu=$('#'+_lbt.data('showMenu'));
            if (_subMenu.data('Show')==0){
              $('#'+_lbt.data('showMenu')).hide();
            }
          },200);
  
        }
      })
    
    ; 
  }*/
  
  //get category code from url
  var getCategoryCodeByUrl = function() {
    var code = '';
    if(document.location.href.indexOf('/LgrpCategory.jsp')>-1) {
      code=get_form(document.location.href,'l_code');
    } else if(document.location.href.indexOf('/MgrpCategory.jsp')>-1) {
      code=get_form(document.location.href,'m_code');
    } else if(document.location.href.indexOf('/DgrpCategory.jsp')>-1) {
      code=get_form(document.location.href,'d_code');
    } else if(document.location.href.indexOf('/surl/category/')>-1) {
      var reg = new RegExp('[0-9]{10}');
      //get part of url ex./surl/category/1900100001 => 1900100001
      var href = document.location.href.substring(document.location.href.indexOf('/surl/category/'), document.location.href.length);
      code = reg.exec(href)[0];
    }
  return code;
  }
  
  //deal real category     
  //get d_code from NVA (left menu)
  var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');  
  // get ToothCode
  var _FTOOTH = get_form(document.location.href, 'FTOOTH');
  if(_FTOOTH==='') {
    _FTOOTH = getCategoryCodeByUrl().substring(0, 2);
  }
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
  
  // get l_code
  var _l_code = getCategoryCodeByUrl();
  
  if(_l_code.substring(5, 10) !== '00000') {
    _l_code = _l_code.substring(0, 5) + '00000';
  }
 
  if (document.location.href.indexOf('/goods/')>-1 || _l_code==null || _l_code=='null') {
    _l_code="";
    if (_d_code_li.length > 0){
      var _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
      if (_d_code.length>5){
        _l_code=_d_code.substr(0,5)+'00000';
      }
    }
  }
  var tvShopLeft=function(){
  
    momoj.ajaxTool({
    async: true,
    data:{flag: 2034 },
    ajaxSuccess:function(_rtnObj) { 
      var htmlContent = _rtnObj.rtnData.result;
      momoj('.navcontent_list').append('<div id="tvShopDiv"></div>')
      $('#tvShopDiv').css({'display': 'none'});
      $('#tvShopDiv').append(htmlContent);
      _bt_0_197();
    }
  });
  }
  
  //alert(_settings.html());   
  //deal bt_2_026_01 lgrpcategory contentArea 2011/10/20
  var _bt_0_142=function(){
    // deal Relation Category Area
    var bt_0_142_01_html = $([                            
      '<div id="bt_0_142_01" class="">',
        '<div id="bt_category_title" class="title ie6png">',
        '  <p class="ie6png">',
        '    <a id="bt_category_e1" href=""></a>',
        '  </p>',
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

    var _liPush = '<li id="liPush" class="cateM BTDME">館長推薦</li>';      
    var _liTop30 = '<li id="top30" class="cateS BTDME">'+
                   '<a id="top30" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&TOP30=Y" style="">本館熱銷TOP30</a>' +
                   '</li>';
    var _liNew = '<li id="newOfWeek" class="cateS BTDME">'+
                   '<a id="newOfWeek" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&NEW=Y&flag=L" style="">本週新品</a>' +
                   '</li>';
    var _liSale = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&SALE=Y&flag=L" style="">本週新降價</a>' +
                   '</li>';
    var _liCPHot = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&CPHOT=Y&flag=L" style="">折價券熱銷</a>' +
                   '</li>';
    var _liComingSoion = '<li id="comingSoion" class="cateS BTDME">'+
              '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&COMINGSOON=Y&flag=L" style="">即將上市</a>' +
           '</li>';
  if(_l_code == '2499900000'){
   $('#bt_category_Content ul',bt_0_142_01_html).append(_liPush).append(_liTop30).append(_liSale).append(_liCPHot);// 20180927 因為電視新品定義與網路不同，先隱藏電視購物館主頁-本週新品
     if(_l_code.substr(0, 2) == "40")
       $('#bt_category_Content ul',bt_0_142_01_html).append(_liComingSoion);
  }else if(_l_code != '4199900000') {
     $('#bt_category_Content ul',bt_0_142_01_html).append(_liPush).append(_liTop30).append(_liNew).append(_liSale).append(_liCPHot);
     if(_l_code.substr(0, 2) == "40")
       $('#bt_category_Content ul',bt_0_142_01_html).append(_liComingSoion);
    }else{
     $('#bt_category_Content ul',bt_0_142_01_html);
    }
    
   //抓取對應的館主頁id
    var mnId='bt_0_996_';
    var _subBtId='';
    var cid='';
    $('#toothUl li').each(function(){    
       var lcodeLst =$(this).attr('l_code');
       if(typeof lcodeLst!='undefined' && lcodeLst.indexOf(_l_code)>-1){
          cid= $(this).attr('id');
          _subBtId=mnId+cid.replace('C','');
       }
    });
    if(_subBtId !=''){  
      $('#'+_subBtId+' .topArea .topmenu #groupTr td').each(function(){ 
        var _realTitle="";
        var h3_lcode = $('h3',this).attr('l_code');
        if(typeof h3_lcode != 'undefined'){
            if(_l_code == h3_lcode){
              try{      
                _realTitle = $.trim($('h3',this).text());         
              }catch(err){
              }
              if(_realTitle!=''){
                var _titleLi = '<li id="lic" class="cateM BTDME">'+_realTitle+'</li>';
                $('#bt_category_Content ul',bt_0_142_01_html).append(_titleLi);
              }
              $('ul li',this).each(function(){
                _addParamForHref(this,'C');
                var _li = $(this).clone();
                  if($.trim(_li.text())!=''){
                    //$('a',_li).attr('style','').css({width:'164px'}).text($('span',_li).text());    
                    $('#bt_category_Content ul',bt_0_142_01_html).append(_li); 
                  }        
              });    
            }
        }else{
            var p_lcode = $('p',this).attr('l_code');
            if(_l_code == p_lcode){
              try{      
                _realTitle = $.trim($('p',this).text());         
              }catch(err){
              }
              if(_realTitle!=''){
                var _titleLi = '<li id="lic" class="cateM BTDME">'+_realTitle+'</li>';
                $('#bt_category_Content ul',bt_0_142_01_html).append(_titleLi);
              }
              $('ul li',this).each(function(){
                _addParamForHref(this,'C');
                var _li = $(this).clone();
                  if($.trim(_li.text())!=''){
                    //$('a',_li).attr('style','').css({width:'164px'}).text($('span',_li).text());    
                    $('#bt_category_Content ul',bt_0_142_01_html).append(_li); 
                    $(_li,bt_0_142_01_html).children("a").wrap('<h2></h2>');                
                  }        
              });    
            }
        }
      }); 
        
      //title
      $('#bt_category_e1',bt_0_142_01_html).attr('href','/category/LgrpCategory.jsp?l_code='+_l_code);
      $('#bt_category_e1',bt_0_142_01_html).text($.unicode2Str($('.toothName').val()));
      $('.titleImg','#bt_2_026_01').hide();     
      $('.contentArea','#bt_2_026_01').hide();
      $('#bt_2_layout_b2').attr('class','');
      $('#bt_2_layout_b2').append(bt_0_142_01_html);  
    }
  }
  
  //組電視購物左側的選單
  var _bt_0_197=function(){
    // deal Relation Category Area
    var bt_0_142_01_html = $([                            
      '<div id="bt_0_142_01" class="">',
        '<div id="bt_category_title" class="title ie6png">',
        '  <p class="ie6png">',
        '    <a id="bt_category_e1" href=""></a>',
        '  </p>',
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
  
    var _liPush = '<li id="liPush" class="cateM BTDME">館長推薦</li>';      
    var _liTop30 = '<li id="top30" class="cateS BTDME">'+
                   '<a id="top30" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&TOP30=Y" style="">本館熱銷TOP30</a>' +
                   '</li>';
    var _liNew = '<li id="newOfWeek" class="cateS BTDME">'+
                   '<a id="newOfWeek" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&NEW=Y&flag=L" style="">本週新品</a>' +
                   '</li>';
    var _liSale = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&SALE=Y&flag=L" style="">本週新降價</a>' +
                   '</li>';
    var _liCPHot = '<li id="superBigSale" class="cateS BTDME">'+
                   '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&CPHOT=Y&flag=L" style="">折價券熱銷</a>' +
                   '</li>';
    var _liComingSoion = '<li id="comingSoion" class="cateS BTDME">'+
              '<a id="superBigSale" href="/category/LgrpCategory.jsp?l_code='+_l_code+'&COMINGSOON=Y&flag=L" style="">即將上市</a>' +
           '</li>';
  if(_l_code == '2499900000'){
   $('#bt_category_Content ul',bt_0_142_01_html).append(_liPush).append(_liTop30).append(_liSale).append(_liCPHot);// 20180927 因為電視新品定義與網路不同，先隱藏電視購物館主頁-本週新品
     if(_l_code.substr(0, 2) == "40")
       $('#bt_category_Content ul',bt_0_142_01_html).append(_liComingSoion);
  }else if(_l_code != '4199900000') {
     $('#bt_category_Content ul',bt_0_142_01_html).append(_liPush).append(_liTop30).append(_liNew).append(_liSale).append(_liCPHot);
     if(_l_code.substr(0, 2) == "40")
       $('#bt_category_Content ul',bt_0_142_01_html).append(_liComingSoion);
    }else{
     $('#bt_category_Content ul',bt_0_142_01_html);
    }

  $('#bt_0_197_24 .topArea .topmenu').each(function(){      
    var _realTitle="";        
    try{      
      _realTitle=$.trim($('h3',this).text());         
    }catch(err){
    }
    if(_realTitle!=''){
      var _titleLi = '<li id="lic" class="cateM BTDME">'+_realTitle+'</li>';
      $('#bt_category_Content ul',bt_0_142_01_html).append(_titleLi);
    }
    $('ul li',this).each(function(){
      _addParamForHref(this,'C');
      var _li = $(this).clone();
        if($.trim(_li.text())!=''){
          _li.addClass('cateS').attr('style','').css({width:'194px'});
          //$('a',_li).attr('style','').css({width:'164px'}).text($('span',_li).text());    
          $('#bt_category_Content ul',bt_0_142_01_html).append(_li); 
          $(_li,bt_0_142_01_html).children("a").wrap('<h2></h2>');		  
        }        
    });    
    }); 
    
  //title
    $('#bt_category_e1',bt_0_142_01_html).attr('href','/category/LgrpCategory.jsp?l_code='+_l_code);
    $('#bt_category_e1',bt_0_142_01_html).text(momoj('input[name="toothName"]').val());
    $('.titleImg','#bt_2_026_01').hide();     
    $('.contentArea','#bt_2_026_01').hide();
    $('#bt_2_layout_b2').attr('class','');
    $('#bt_2_layout_b2').append(bt_0_142_01_html);  
  }
  
  //search engine dropdownlist
  var _bt_0_103 = function(){
    var _select = $('#p_lgrpCode');    
    var _cur_sel_l_code = _l_code;          
    var l_selected = _cur_sel_l_code.substring(2,5)=='999' ? " selected" : "";
    _select.empty();
    _select.append('<option value="">全商品分類</option>');
    _select.append('<option value="'+_l_code.substring(0,2)+'00000000" ' + l_selected + '>'+$('#C'+_FTOOTH+' a').text()+'總覽</option>');
    $('#'+_settings.subMnId+_FTOOTH+' .topArea .topmenu').each(function(){          
    $('ul li',this).each(function(){
      var _li = $(this).clone();          
    var _select_text = _li.text();    
        var _select_lcode = get_form($('a',_li).attr('href'),'l_code');
    var _selected= _select_lcode == _cur_sel_l_code ? " selected" : "";        
        $('a',_li).attr('style','').css({width:'auto'});
        _select.append('<option value="'+_select_lcode+'"'+_selected+'>'+_select_text+'</option>');
    });    
    });
  }   
  
  //deal subNav
  var _subNav=function(){
  $('#'+_settings.subMnId+_FTOOTH+' .topArea .topmenu').each(function(){          
    $('ul li',this).each(function(){ 
      _addParamForHref(this,'B');
      var _li = $(this).clone();        
        if(momoj.trim(_li.text())){
          _li.attr('class','').css('width','auto');
          $('a',_li).attr('style','').css({width:'auto'});    
          var _liSubNavLCode=get_form($('a',_li).attr('href'),'l_code');
          if (_l_code !='' && _l_code==_liSubNavLCode ){
            _li.addClass('selected');
          }   
          $('#subnav ul').append(_li);
        }
    });    
    }); 
  }
  
  //add parameter for href to doing statistics
  var _addParamForHref=function(obj, stage){
    try{
      if(obj && $(obj).length > 0){
        var _li = $($(obj)[0]).find('a');
        if(_li && _li.length > 0){
          $(_li).each(function(){
            var href = $(this).attr('href').replace(/&btType=[A-Z]+/,'');
            if(href && href.length > 0){
              $(this).attr('href',  href + "&btType=" + stage);
            }
          });
        }
      }
    }catch(err){
    }
  }
  
  // left Category
  var _leftCateBGO=function(_d_code){
    var _d_code_link='d_code='+_d_code;
    var _m_code_link='C'+_d_code;
    var _cateM='';
    $('#bt_cate_top li').each(function(){
      var _li=$(this);
      if(_li.hasClass('cateM')){
        if(_li.attr('id').indexOf(_m_code_link)>-1){
          _li.addClass('BGO');
        }else{
          _cateM=_li;   
        }
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
  
  // deal tooth
  var _toothName=' &gt; '+$('#C'+_FTOOTH).html();
  var _toothName1=''+$('#C'+_FTOOTH).html();
  $('.TabMenu ul li',container).removeClass('selected');
  if(_FTOOTH!='' && (document.location.href.indexOf('/goods/')>-1||document.location.href.indexOf('/category/')>-1)){
    var _tooth_code='ft'+_FTOOTH;
    // 館首(任選), 小分類頁, 紅綠配, 商品頁
    momoj('.bt_2_layout,.bt_4_layout,.bt_6_layout,#Dgrp_BodyBigTableBase,#BodyBigTableBase,#container').addClass(_tooth_code);
    _lbt.addClass(_tooth_code);
  //$('#C'+_FTOOTH).addClass('selected');//因為對無法對應到,所以拿掉
    
    // deal subnav menu 
  $('#Dgrp_BodyBigTableBase,#BodyBigTableBase').addClass('bt_2_layout');
    $('.bt_2_layout').prepend('<div id="subnav"><ul></ul></div>');
    $('.bt_6_layout').prepend('<div id="subnav"><ul></ul></div>');
    _subNav();
    // deal subnav menu end            
    //var _d_code_li=$('#bt_2_layout_NAV ul li[cateCode^=DC]');
    var _d_code="";
  var _m_code=""; 
    if(_d_code_li.length >0){
      _d_code=$(_d_code_li[0]).attr('cateCode').replace('DC','');
    }else if( document.location.href.indexOf("DgrpCategory.jsp")>-1 ){
      _d_code=get_form(document.location.href,'d_code');
    }else if(document.location.href.indexOf("/surl/category/")>-1) {
    _d_code = getCategoryCodeByUrl();
    //短網址進來有可能是齒或館，所以要排除
      if(_d_code.substring(5, 10) === '00000') {
      _d_code = "";
    }
  }else if( document.location.href.indexOf("MgrpCategory.jsp")>-1 ){
      _m_code=get_form(document.location.href,'m_code');    
    }
  
    if(_d_code!=""){
      _leftCateBGO(_d_code);
    }else if(_m_code!=""){
    _leftCateBGO(_m_code);
  }
  
    _bt_0_103();        
  }
  
  // deal directory
  if (document.location.href.indexOf('/LgrpCategory.jsp')>-1 || document.location.href.indexOf('/surl/category/')>-1){
    var _cur_l_code=getCategoryCodeByUrl();
    //短網址進來有可能是小分類，所以要排除
    if(_cur_l_code.substring(5, 10) === '00000') {
    $('#bt_2_layout_NAV').remove();
      if ((_cur_l_code.indexOf('99900000') > -1 || _cur_l_code =='3200100000' 
        || _cur_l_code =='3400100000' || _cur_l_code =='3400200000') && _cur_l_code !='3599900000') {
        var bt_2_layout_NAV_b2 = $([
          '<div id="bt_2_layout_NAV" class=" bt770class">',
          '<ul>',
          '<li class="first"><a href="//www.momoshop.com.tw">Home</a></li>',
          '<li id="NavCategoryName"></li>',
          '</ul>',
          '</div>'].join(''));
        if($('.bt_2_layout_Left').length>0){
          $('.bt_2_layout_Left').append(bt_2_layout_NAV_b2);
        }else{
          $('#bt_2_layout_b2').append(bt_2_layout_NAV_b2);
        }
        var _cateName='<h1>'+$('.toothName').val()+'</h1>';
        if(_cur_l_code == '3200100000'){
            _cateName = '\u76F4\u914D\u5927\u9678';
        }
        if(_cur_l_code == '3400100000'){
            _cateName = '&#20303;&#23487;&#47;&#20241;&#24687;&#21048;';
        }
        if(_cur_l_code == '3400200000'){
            _cateName = '&#29609;&#27138;&#47;&#83;&#80;&#65;&#47;&#27873;&#28271;&#21048;';
        }
        $('#NavCategoryName').html(_cateName.replace('<br>', ''));
        if(_cur_l_code.indexOf('2499900000') > -1){//電視購物
          tvShopLeft();
        }else{
          _bt_0_142();
        }
      }else{
      // deal TOOTH Name
          var _toothName1=$('.toothName').val();
          var _cateName=$('.lCateName').val();
          var _l_code=$('#tempTCode').val();
            var bt_2_layout_NAV_html = $([
              '<div id="bt_2_layout_NAV" class=" bt770class">',
              '<ul>',
              '<li class="first"><a href="//www.momoshop.com.tw">Home</a></li>',
              '<li id="NavCategoryName"><a href="/category/LgrpCategory.jsp?l_code='+_l_code+'">'+_toothName1.replace('<br>', '')+ '</a></li><li><h1>'+_cateName.replace('<br>', '')+'</h1></li>',
              '</ul>',
              '</div>'].join(''));
            $('#bt_2_layout_G').append(bt_2_layout_NAV_html);
            //$('#NavCategoryName').html('<h3>'+_toothName1+ '</h3></li><li><h2>'+_cateName+'</h2>');
            //return false;

      }
    }
  } 
  
  // deal hide category
  var _ulCate=$('#bt_cate_top');
  var liList = $('li', _ulCate);
  var isCloseCateS = false;
  for(var i = 0; i < liList.length; i++) {
    //if cateM hide then cateS hide.
    if($(liList[i]).attr('hide_yn') === '1' && $(liList[i]).hasClass('cateM')) {
      isCloseCateS = true;
    } else if($(liList[i]).attr('hide_yn') !== '1' && $(liList[i]).hasClass('cateM')) {
      isCloseCateS = false;
    }
    if(isCloseCateS || $(liList[i]).attr('hide_yn') === '1') {
      $(liList[i]).remove();
  }
  }
  var _lis=$('li',_ulCate);
  for(var i=0;i<_lis.length;i++){
    var _li=$(_lis[i]);
  if(_li.hasClass('More') && i+1<_lis.length && $(_lis[i+1]).hasClass('cateM') ){
    _li.remove();
  }
} 
          
  return container;
}

})(jQuery);
