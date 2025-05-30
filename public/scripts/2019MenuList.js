var _menuSettings = {        
    scrWidth:1320,
    lbt:'#bt_0_layout_b957',
    subMnId:'bt_0_997_',  
    liHeight:24,
    liWidth:131
};
/*
momoj(document).ready(function () {
  //取得首頁左側選單
  var Obj=momoj('.menubox_title');
  if(Obj && Obj.length>0){
    setTimeout(function(){
      if(momoj("#bt_0_957_01").length <= 0){
        getCategoryContent("1099700000");
      }   
    },500);
  }
});**/
 

//初始化首頁左側選單  
function menuListInit(){
    
  if(momoj(".stc997 .bt_0_layout_b957").length==0){
    return false;
  }  
  var divClone = momoj(".bt_0_layout_b957").clone();
  momoj(".stc997").empty();
  divClone.show();
  var Obj=momoj('.menubox_title');
  Obj.after(divClone);

    //滑鼠移過我關注的時 
  momoj(".menuList .ulli:not(.btGroupDivider)").mouseenter(function () {
    momoj(".menuList .ulli").removeClass("BGO");
    momoj(this).addClass("BGO");
    var _head = momoj(this);
    var _subBtId = _menuSettings.subMnId + _head.attr('id').replace('C', '');
    var _subMenu = momoj('#' + _subBtId);

    _subMenu.find('.topmenu').each(function () {
      var _topMenu = momoj(this);
      if (momoj.trim(momoj.trim(_topMenu.find('p').html())) == '' || momoj.trim(_topMenu.find('p').html()) == '&nbsp;') {
        _topMenu.hide();
      } 
    });
    _subMenu.show();

    lival = momoj(".menuList .ulli.BGO").index();

    var contentbottomwidth = momoj("#" + _subBtId + " .bottomArea").width()
    var dlwidth = contentbottomwidth - 135 - 40
    var ddmath = Math.round(dlwidth / 72)
    var ddlength = momoj("#" + _subBtId + " .bottomArea table tbody tr td ul li").length
    var e = Math.floor(ddlength / ddmath)

    for (i = 0; i <= e; i++) {
      momoj("#" + _subBtId + " .bottomArea table tbody tr td ul li:eq(" + ddmath * i + ")").css({ "padding-left": "0px" })
    }

    var ObjSub = momoj('.subMenu');
    var topArea = ObjSub.eq(subMenuMapping(lival)).find('.topArea');
    var recommend = ObjSub.eq(subMenuMapping(lival)).find('.recommend');
    var tfoot = ObjSub.eq(subMenuMapping(lival)).find('.bottomArea table tfoot');
    var _topAreaHeight = topArea.height();
    var _tfootHeight = tfoot.height();

    if (_topAreaHeight < 500) {
      var height = 500 - _topAreaHeight - _tfootHeight - 50;
      recommend.css({ 'min-height': height + 'px' });
    }

    momoj("img[lazy=2]").each(function () {
      momoj(this).attr("src", momoj.getImgSrc({ org: momoj(this).attr("org") }));
      momoj(this).removeAttr("lazy");
    });
        
  })
  /**滑鼠離開主選單時**/
  momoj(".subMenu").mouseleave(function () {
    momoj(".menuList .ulli").removeClass("BGO");
    momoj(".subMenu").hide();
    return;
  });
  //滑鼠移到次選單區時
  momoj(".subMenu").mouseenter(function () {
    momoj(".menuList .ulli").eq(subMenuMapping(lival)).addClass("BGO");
    momoj(".subMenu").eq(subMenuMapping(lival)).show();
    return;
  });
  //滑鼠離開次選單時 
  momoj(".menuList .ulli").mouseleave(function () {
    momoj(".menuList .ulli").removeClass("BGO");
    momoj(".subMenu").hide();
    return;
  });

}

//subMenuMapping
function subMenuMapping(index){
  switch (index) {
    case 0:
    case 1:
    case 2:
      return index;
    case 4:
    case 5:
      return index - 1;
    case 7:
    case 8:
    case 9:
      return index - 2;
    case 11:
    case 12:
      return index - 3;
    case 14:
    case 15:
      return index - 4;
    case 17:
    case 18:
      return index - 5;
    default:
      return index;
  }
}


