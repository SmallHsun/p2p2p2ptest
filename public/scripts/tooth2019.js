

momoj(document).ready(function () {
    
     //移到選單 
      momoj(".navcontent .navcontent_list ul.navcontent_listul li").mouseenter(function(){

          momoj(".navcontent .navcontent_list ul.navcontent_listul li").removeClass("BGO");
          momoj(this).addClass("BGO"); 
          lival = momoj(".navcontent .navcontent_list ul.navcontent_listul li.BGO").index();
          momoj(".navcontent .navcontent_list .navcontent_innerwarp").hide()
          momoj(".navcontent .navcontent_list .navcontent_innerwarp").eq(lival).show()
          momoj(".navcontent .navcontent_list .navcontent_innerwarp").css({"width":"auto", "top":"0px", "left":"0px"})
          var thisinnerwarp = momoj(".navcontent .navcontent_list .navcontent_innerwarp").eq(lival)
          var wt = momoj(thisinnerwarp).find("table").width()
          momoj(thisinnerwarp).width(wt)

           //li數量
           var lilength = momoj(".navcontent .navcontent_list ul.navcontent_listul li").length
           //li的排行
           var thisli = momoj(this).index()
           //li寬度
           var liwidth = momoj(this).width()
           //選取的li到最右邊li的寬度
           var listwidth = (lilength - thisli)*liwidth
           //浮層寬度
           var navcontentwidth = momoj(thisinnerwarp).width();
           var _head=momoj(this);    
           var _position=_head.position() 
           var _left=_position.left;
           var _top=_position.top+_head.height()
           
           if(navcontentwidth > listwidth){
              momoj(thisinnerwarp).css({"top":_top,"left":_left - navcontentwidth + listwidth})
           }else{
              momoj(thisinnerwarp).css({"top":_top,"left":_left})   
           }
           momoj("img[lazy=2]").each(function(){
            momoj(this).attr("src",momoj.getImgSrc({org:momoj(this).attr("org")}));
            momoj(this).removeAttr("lazy");
          });
      });
      //離開選單內容 
      momoj(".navcontent .navcontent_list .navcontent_innerwarp").mouseleave(function(){ 
          momoj(".navcontent .navcontent_list ul.navcontent_listul li").removeClass("BGO");
          momoj(".navcontent .navcontent_list .navcontent_innerwarp").hide();
          return;
      });
      //移到選單內容
      momoj(".navcontent .navcontent_list .navcontent_innerwarp").mouseenter(function(){
          momoj(".navcontent .navcontent_list .navcontent_innerwarp").eq(lival).show();
          momoj(".navcontent .navcontent_list ul.navcontent_listul li").eq(lival).addClass("BGO");
          return;
      });
      //離開選單
      momoj(".navcontent .navcontent_list ul.navcontent_listul li").mouseleave(function(){
          momoj(".navcontent .navcontent_list ul.navcontent_listul li").removeClass("BGO");
          momoj(".navcontent .navcontent_list .navcontent_innerwarp").hide();
          return;
      });
      
	});
